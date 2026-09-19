const http = require('http');

function request(options, data) {
  return new Promise((resolve, reject) => {
    const payload = data ? JSON.stringify(data) : null;
    const headers = { ...(options.headers || {}) };
    if (payload) {
      headers['Content-Length'] = Buffer.byteLength(payload);
    }
    const req = http.request({ ...options, headers }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function runTests() {
  console.log('=== RUNNING TESTS FOR QUESTIONNAIRE UPDATES ===\n');

  // 1. Authenticate as student
  console.log('1. Logging in as student...');
  const loginRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/v1/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { email: 'neeraj.patel@staymatch.demo', password: 'DemoPass123!' });

  const token = loginRes.data?.data?.token;
  if (!token) throw new Error('Failed to login: ' + JSON.stringify(loginRes.data));
  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
  console.log('✓ Student authenticated successfully');

  // 2. Test Budget Validation: Minimum budget >= 500
  console.log('\n2. Testing Minimum Budget validation (< ₹500 should fail)...');
  const testCasesMin = [
    { min: 0, max: 2000, desc: '0' },
    { min: -100, max: 2000, desc: 'negative (-100)' },
    { min: 499, max: 2000, desc: '499 (< 500)' }
  ];

  for (const tc of testCasesMin) {
    const res = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/v1/profiles',
      method: 'POST',
      headers: authHeaders
    }, {
      collegeName: 'Nirma University',
      sleepSchedule: 'flexible',
      cleanliness: 3,
      studyHabit: 'flexible',
      socialHabit: 3,
      dietaryPreference: 'vegetarian',
      smoking: false,
      drinking: 'no',
      budget: { min: tc.min, max: tc.max }
    });

    console.log(`- Testing min = ${tc.desc}: Status ${res.status} | Message: "${res.data?.message}"`);
    if (res.status !== 400 || !res.data?.message?.includes('500')) {
      throw new Error(`Expected 400 with 500 error, got ${res.status}: ${JSON.stringify(res.data)}`);
    }
  }
  console.log('✓ All sub-500 budget inputs rejected correctly by backend');

  // 3. Test Budget Validation: Minimum strictly less than Maximum
  console.log('\n3. Testing Min < Max Budget validation (min >= max should fail)...');
  const testCasesStrict = [
    { min: 1000, max: 1000, desc: 'min == max (1000 == 1000)' },
    { min: 1500, max: 1000, desc: 'min > max (1500 > 1000)' }
  ];

  for (const tc of testCasesStrict) {
    const res = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/v1/profiles',
      method: 'POST',
      headers: authHeaders
    }, {
      collegeName: 'Nirma University',
      sleepSchedule: 'flexible',
      cleanliness: 3,
      studyHabit: 'flexible',
      socialHabit: 3,
      dietaryPreference: 'vegetarian',
      smoking: false,
      drinking: 'no',
      budget: { min: tc.min, max: tc.max }
    });

    console.log(`- Testing ${tc.desc}: Status ${res.status} | Message: "${res.data?.message}"`);
    if (res.status !== 400 || !res.data?.message?.toLowerCase().includes('strictly less')) {
      throw new Error(`Expected 400 with strictly less error, got ${res.status}: ${JSON.stringify(res.data)}`);
    }
  }
  console.log('✓ All min >= max inputs rejected correctly by backend');

  // 4. Test Valid Budget saving
  console.log('\n4. Testing valid budget saving (min = 500, max = 1000)...');
  const validRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/v1/profiles',
    method: 'POST',
    headers: authHeaders
  }, {
    collegeName: 'Nirma University',
    sleepSchedule: 'flexible',
    cleanliness: 1, // Testing cleanliness = 1 (Very Relaxed)
    studyHabit: 'flexible',
    socialHabit: 3,
    dietaryPreference: 'vegetarian',
    smoking: false,
    drinking: 'no',
    budget: { min: 500, max: 1000 },
    preferredLocations: ['Vadodara']
  });

  if (validRes.status !== 200) {
    throw new Error(`Valid save failed! Status ${validRes.status}: ${JSON.stringify(validRes.data)}`);
  }
  console.log('✓ Valid budget (500-1000) saved successfully');

  // 5. Verify Cleanliness Standard = 1 is saved and returned accurately
  console.log('\n5. Verifying Cleanliness = 1 saved in DB...');
  const profRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/v1/profiles/me',
    method: 'GET',
    headers: authHeaders
  });
  console.log('✓ Fetched cleanliness standard:', profRes.data?.data?.profile?.cleanliness);
  if (profRes.data?.data?.profile?.cleanliness !== 1) {
    throw new Error('Cleanliness standard 1 was not persisted!');
  }

  // 6. Verify Preferred City = Vadodara is saved in DB and User.city
  console.log('\n6. Verifying Preferred Gujarat City ("Vadodara") saved in DB...');
  console.log('✓ Profile preferredLocations:', profRes.data?.data?.profile?.preferredLocations);
  if (profRes.data?.data?.profile?.preferredLocations?.[0] !== 'Vadodara') {
    throw new Error('Preferred location was not saved as Vadodara!');
  }

  const userRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/v1/users/me',
    method: 'GET',
    headers: authHeaders
  });
  console.log('✓ User city in DB:', userRes.data?.data?.user?.city);
  if (userRes.data?.data?.user?.city !== 'Vadodara') {
    throw new Error('User city in DB was not synced to Vadodara!');
  }

  // Reset student back to Ahmedabad with standard budget
  await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/v1/profiles',
    method: 'POST',
    headers: authHeaders
  }, {
    collegeName: 'Nirma University',
    sleepSchedule: 'flexible',
    cleanliness: 4,
    studyHabit: 'flexible',
    socialHabit: 3,
    dietaryPreference: 'vegetarian',
    smoking: false,
    drinking: 'no',
    budget: { min: 6000, max: 12000 },
    preferredLocations: ['Ahmedabad']
  });

  console.log('\n=== ALL QUESTIONNAIRE TESTS PASSED! ===');
}

runTests().catch(err => {
  console.error('\n❌ TEST FAILED:', err);
  process.exit(1);
});
