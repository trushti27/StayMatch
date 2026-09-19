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
  console.log('=== STARTING AUTOMATED TESTS FOR STUDENT DASHBOARD & PROFILE ===\n');

  // 1. Login as student
  console.log('1. Logging in as student (neeraj.patel@staymatch.demo)...');
  const loginRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/v1/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { email: 'neeraj.patel@staymatch.demo', password: 'DemoPass123!' });

  if (!loginRes.data?.data?.token) {
    throw new Error('Login failed: ' + JSON.stringify(loginRes.data));
  }
  const token = loginRes.data.data.token;
  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
  console.log('✓ Logged in successfully. User role:', loginRes.data.data.user.role);

  // 2. Test Shortlisted PG count consistency
  console.log('\n2. Testing Shortlisted PG endpoint (/api/v1/favorites)...');
  const favRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/v1/favorites',
    method: 'GET',
    headers: authHeaders
  });
  const initialFavs = favRes.data?.data?.favorites || [];
  const initialCount = favRes.data?.count ?? initialFavs.length;
  console.log(`✓ Initial favorites count in DB: ${initialCount}, list length: ${initialFavs.length}`);
  if (initialCount !== initialFavs.length) {
    throw new Error(`Count mismatch! count: ${initialCount}, length: ${initialFavs.length}`);
  }

  // 3. Test Property fetch for favorite toggle
  const propRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/v1/properties?limit=5',
    method: 'GET',
    headers: authHeaders
  });
  const testProperty = propRes.data?.data?.properties?.[0];
  if (!testProperty) {
    throw new Error('No properties found to test favorite toggle');
  }
  console.log(`Found property to test: "${testProperty.title}" (ID: ${testProperty._id})`);

  // Add favorite
  console.log('Adding property to shortlist...');
  const addFavRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: `/api/v1/favorites/${testProperty._id}`,
    method: 'POST',
    headers: authHeaders
  });
  console.log('Add favorite response status:', addFavRes.status, addFavRes.data?.message);

  // Verify updated count
  const favResAfterAdd = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/v1/favorites',
    method: 'GET',
    headers: authHeaders
  });
  const favsAfterAdd = favResAfterAdd.data?.data?.favorites || [];
  console.log(`✓ Updated count after adding: ${favsAfterAdd.length}`);
  const hasAdded = favsAfterAdd.some(f => (f.property?._id || f.property) === testProperty._id);
  if (!hasAdded) {
    throw new Error('Property was not found in favorites list after adding!');
  }

  // Remove favorite
  console.log('Removing property from shortlist...');
  const delFavRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: `/api/v1/favorites/${testProperty._id}`,
    method: 'DELETE',
    headers: authHeaders
  });
  console.log('Remove favorite response status:', delFavRes.status, delFavRes.data?.message);

  const favResAfterDel = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/v1/favorites',
    method: 'GET',
    headers: authHeaders
  });
  const favsAfterDel = favResAfterDel.data?.data?.favorites || [];
  console.log(`✓ Count after removal: ${favsAfterDel.length}`);
  if (favsAfterDel.length !== initialFavs.length) {
    throw new Error('Count did not return to initial count after removing favorite!');
  }

  // 4. Test Budget and Preferred City updates in Profile & Questionnaire
  console.log('\n3. Testing Budget and Preferred City updates in Profile & DB...');
  const newCity = 'Pune';
  const newBudget = { min: 8000, max: 17000 };

  console.log(`Saving new Preferred City: "${newCity}", Budget: Min ₹${newBudget.min} - Max ₹${newBudget.max}...`);

  // Update user city
  await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/v1/users/me',
    method: 'PUT',
    headers: authHeaders
  }, { city: newCity });

  // Update compatibility profile
  const saveProfRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/v1/profiles',
    method: 'POST',
    headers: authHeaders
  }, {
    collegeName: 'Nirma University',
    course: 'Computer Science',
    graduationYear: 2026,
    sleepSchedule: 'early_bird',
    cleanliness: 5,
    studyHabit: 'complete_silence',
    socialHabit: 3,
    dietaryPreference: 'vegetarian',
    smoking: false,
    drinking: 'no',
    budget: newBudget,
    preferredLocations: [newCity],
    preferredRoomType: 'single'
  });

  if (saveProfRes.status !== 200) {
    throw new Error('Failed to save profile: ' + JSON.stringify(saveProfRes.data));
  }
  console.log('✓ Profile saved successfully:', saveProfRes.data?.message);

  // 5. Verify values retrieved from database
  console.log('\n4. Verifying persisted values from /api/v1/profiles/me and /api/v1/users/me...');
  const myProfRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/v1/profiles/me',
    method: 'GET',
    headers: authHeaders
  });
  const savedProfile = myProfRes.data?.data?.profile;
  console.log(`✓ Profile preferredLocations:`, savedProfile?.preferredLocations);
  console.log(`✓ Profile budget:`, savedProfile?.budget);

  if (savedProfile?.preferredLocations?.[0] !== newCity) {
    throw new Error(`Preferred city not saved! Expected ${newCity}, got ${savedProfile?.preferredLocations?.[0]}`);
  }
  if (savedProfile?.budget?.min !== newBudget.min || savedProfile?.budget?.max !== newBudget.max) {
    throw new Error(`Budget not saved accurately! Expected ${JSON.stringify(newBudget)}, got ${JSON.stringify(savedProfile?.budget)}`);
  }

  const myUserRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/v1/users/me',
    method: 'GET',
    headers: authHeaders
  });
  const savedUser = myUserRes.data?.data?.user;
  console.log(`✓ User city in DB:`, savedUser?.city);
  if (savedUser?.city !== newCity) {
    throw new Error(`User city not synchronized! Expected ${newCity}, got ${savedUser?.city}`);
  }

  // 6. Test Property search default with the new Preferred City
  console.log(`\n5. Verifying dashboard property search uses new preferred city "${newCity}"...`);
  const cityPropsRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: `/api/v1/properties?city=${encodeURIComponent(newCity)}`,
    method: 'GET',
    headers: authHeaders
  });
  console.log(`✓ Property query for "${newCity}" returned ${cityPropsRes.data?.data?.properties?.length || 0} properties`);

  // 7. Test changing preferred city again to ensure dynamic updates
  console.log('\n6. Testing changing preferred city again to "Gandhinagar"...');
  const city2 = 'Gandhinagar';
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
    budget: { min: 6000, max: 14000 },
    preferredLocations: [city2]
  });

  const checkProf2 = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/v1/profiles/me',
    method: 'GET',
    headers: authHeaders
  });
  console.log(`✓ Updated preferred city:`, checkProf2.data?.data?.profile?.preferredLocations?.[0]);
  if (checkProf2.data?.data?.profile?.preferredLocations?.[0] !== city2) {
    throw new Error(`Second city update failed! Expected ${city2}`);
  }

  // Reset back to Ahmedabad for standard demo state
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
  await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/v1/users/me',
    method: 'PUT',
    headers: authHeaders
  }, { city: 'Ahmedabad' });

  console.log('\n=== ALL TESTS PASSED SUCCESSFULLY! ===');
}

runTests().catch(err => {
  console.error('\n❌ TEST FAILED:', err);
  process.exit(1);
});
