require("dotenv").config();
const bcrypt = require("bcrypt");
const connectDB = require("../config/db");
const User = require("../models/User");
const CompatibilityProfile = require("../models/CompatibilityProfile");
const Property = require("../models/Property");
const Chat = require("../models/Chat");
const Message = require("../models/Message");
const Review = require("../models/Review");
const Report = require("../models/Report");

async function run() {
  await connectDB();
  await Promise.all([
    User.deleteMany({ email: { $regex: "@staymatch.demo$" } }),
    Property.deleteMany({}),
    Chat.deleteMany({}),
    Message.deleteMany({}),
    Review.deleteMany({}),
    Report.deleteMany({}),
  ]);

  const password = await bcrypt.hash("DemoPass123!", 12);

  // 1. Students (diverse verification statuses)
  const studentUsers = [
    {
      firstName: "Neeraj",
      lastName: "Patel",
      email: "neeraj.patel@staymatch.demo",
      phone: "9876543210",
      password,
      role: "student",
      college: "Nirma University",
      course: "Computer Engineering",
      graduationYear: 2026,
      city: "Ahmedabad",
      verificationStatus: "verified",
      isVerified: true,
      bio: "Final year CS student looking for clean and quiet room near campus.",
    },
    {
      firstName: "Diya",
      lastName: "Shah",
      email: "student1@staymatch.demo",
      phone: "9000000001",
      password,
      role: "student",
      college: "LD College of Engineering",
      course: "Information Technology",
      graduationYear: 2027,
      city: "Ahmedabad",
      verificationStatus: "pending",
      isVerified: false,
      verificationNote: "Submitted LD College college ID card & Aadhar proof.",
      bio: "2nd year IT student, vegetarian, focused on academics.",
    },
    {
      firstName: "Aarav",
      lastName: "Shah",
      email: "student2@staymatch.demo",
      phone: "9000000002",
      password,
      role: "student",
      college: "Pune Institute of Computer Technology",
      course: "Electronics Engineering",
      graduationYear: 2027,
      city: "Pune",
      verificationStatus: "unsubmitted",
      isVerified: false,
      bio: "Engineering fresher seeking roommate.",
    },
    {
      firstName: "Rohan",
      lastName: "Mehta",
      email: "student3@staymatch.demo",
      phone: "9000000003",
      password,
      role: "student",
      college: "Symbiosis International University",
      course: "BBA",
      graduationYear: 2026,
      city: "Pune",
      verificationStatus: "rejected",
      isVerified: false,
      verificationNote: "ID card image was blurry and unreadable. Please re-upload.",
      bio: "BBA student looking for flat-sharing.",
    },
    {
      firstName: "Meera",
      lastName: "Joshi",
      email: "student4@staymatch.demo",
      phone: "9000000004",
      password,
      role: "student",
      college: "Ahmedabad University",
      course: "Design",
      graduationYear: 2028,
      city: "Ahmedabad",
      verificationStatus: "unsubmitted",
      isVerified: false,
      bio: "Design student enthusiastic about arts and quiet spaces.",
    },
  ];

  const students = await User.insertMany(studentUsers);

  // 2. Jayesh Patel (Primary Verified Owner)
  let jayesh = await User.findOne({ email: "jayesh@gmail.com" });
  if (!jayesh) {
    jayesh = await User.create({
      firstName: "Jayesh",
      lastName: "Patel",
      email: "jayesh@gmail.com",
      phone: "9898012345",
      password,
      role: "owner",
      businessName: "Patel Accommodations & PG Services",
      city: "Ahmedabad",
      verificationStatus: "verified",
      isVerified: true,
      bio: "Experienced property owner operating premium student accommodations in Ahmedabad for 12+ years.",
    });
  } else {
    jayesh.firstName = "Jayesh";
    jayesh.lastName = "Patel";
    jayesh.businessName = "Patel Accommodations & PG Services";
    jayesh.city = "Ahmedabad";
    jayesh.verificationStatus = "verified";
    jayesh.isVerified = true;
    jayesh.password = password;
    await jayesh.save();
  }

  // 3. Additional Owners with Pending, Verified, and Rejected statuses
  const otherOwners = await User.insertMany([
    {
      firstName: "Anita",
      lastName: "Patel",
      email: "owner1@staymatch.demo",
      phone: "9111111111",
      password,
      role: "owner",
      businessName: "Patel Homes & Hostels",
      city: "Ahmedabad",
      verificationStatus: "verified",
      isVerified: true,
      bio: "Dedicated to safe, comfortable girls and boys student residences.",
    },
    {
      firstName: "Vikram",
      lastName: "Rao",
      email: "owner2@staymatch.demo",
      phone: "9222222222",
      password,
      role: "owner",
      businessName: "Rao Student Residences",
      city: "Pune",
      verificationStatus: "verified",
      isVerified: true,
      bio: "Modern co-living spaces for tech students.",
    },
    {
      firstName: "Ramesh",
      lastName: "Mehta",
      email: "owner3@staymatch.demo",
      phone: "9333333331",
      password,
      role: "owner",
      businessName: "Mehta Student Living",
      city: "Ahmedabad",
      verificationStatus: "pending",
      isVerified: false,
      verificationNote: "Uploaded electricity bill and business registration GST certificate for verification.",
      bio: "New property host offering premier accommodations near SG Highway.",
    },
    {
      firstName: "Suresh",
      lastName: "Desai",
      email: "owner4@staymatch.demo",
      phone: "9444444441",
      password,
      role: "owner",
      businessName: "Desai Residency",
      city: "Pune",
      verificationStatus: "rejected",
      isVerified: false,
      verificationNote: "Incomplete property registry documentation provided. Re-submit with official index-II deed.",
      bio: "Hostel facilities in Kothrud area.",
    },
    {
      firstName: "Priya",
      lastName: "Verma",
      email: "owner5@staymatch.demo",
      phone: "9555555551",
      password,
      role: "owner",
      businessName: "Verma Co-Living Spaces",
      city: "Ahmedabad",
      verificationStatus: "pending",
      isVerified: false,
      verificationNote: "Government photo ID and property lease agreement submitted yesterday.",
      bio: "Modern co-living with high speed internet and study rooms.",
    },
  ]);

  // 4. Admin Account
  let admin = await User.findOne({ email: "admin@staymatch.demo" });
  if (!admin) {
    admin = await User.create({
      firstName: "System",
      lastName: "Administrator",
      email: "admin@staymatch.demo",
      phone: "9999999999",
      password,
      role: "admin",
      isVerified: true,
      verificationStatus: "verified",
      bio: "StayMatch Chief Platform Administrator & Verification Officer",
    });
  } else {
    admin.password = password;
    admin.role = "admin";
    admin.isVerified = true;
    admin.verificationStatus = "verified";
    await admin.save();
  }

  // 5. Compatibility Profiles for students
  await CompatibilityProfile.deleteMany({ user: { $in: students.map((s) => s._id) } });
  await CompatibilityProfile.insertMany(
    students.map((u, i) => ({
      user: u._id,
      collegeName: u.college,
      course: u.course,
      graduationYear: u.graduationYear || 2027,
      cleanliness: [4, 5, 3, 4, 5][i % 5],
      dietaryPreference: i === 2 ? "non_vegetarian" : "vegetarian",
      sleepSchedule: i % 2 === 0 ? "night_owl" : "early_bird",
      studyHabit: "flexible",
      socialHabit: 3,
      smoking: false,
      drinking: "no",
      noisePreference: "quiet",
      nightCalls: "no",
      windowPreference: "open",
      budget: { min: 6000, max: 13000 },
      preferredLocations: [u.city || "Ahmedabad"],
      isLookingForRoommate: true,
    }))
  );

  // 6. Properties with Verified, Pending, and Rejected Statuses
  const samples = [
    {
      title: "Krishna PG",
      owner: jayesh._id,
      description: "A clean, secure, and student-friendly PG near Nirma University and SG Highway with high-speed Wi-Fi, daily hygienic meals, and 24/7 security guard.",
      propertyType: "PG",
      location: {
        address: "1 SG Highway, Near Nirma University",
        area: "Gota",
        city: "Ahmedabad",
        state: "Gujarat",
        pincode: "380060",
      },
      pricing: { monthlyRent: 7500, securityDeposit: 15000 },
      accommodation: { roomType: "2-sharing", totalRooms: 10, availableRooms: 3 },
      preferences: { genderPreference: "any" },
      amenities: ["Wi-Fi", "Daily Food", "Laundry", "Security", "AC", "Power Backup"],
      rules: ["No smoking indoors", "Visitors allowed in common lounge until 9 PM"],
      verificationStatus: "verified",
    },
    {
      title: "Shree Girls PG",
      owner: otherOwners[0]._id, // Anita Patel
      description: "Safe and comfortable accommodation exclusively for female students in Vastrapur near university campuses and lakes.",
      propertyType: "PG",
      location: {
        address: "2 Vastrapur Lake Road",
        area: "Vastrapur",
        city: "Ahmedabad",
        state: "Gujarat",
        pincode: "380015",
      },
      pricing: { monthlyRent: 8000, securityDeposit: 16000 },
      accommodation: { roomType: "2-sharing", totalRooms: 8, availableRooms: 2 },
      preferences: { genderPreference: "female" },
      amenities: ["Wi-Fi", "Daily Food", "Security", "CCTV", "Biometric Entry"],
      rules: ["Curfew 10:00 PM", "Quiet study hours"],
      verificationStatus: "verified",
    },
    {
      title: "Prime Stay PG",
      owner: jayesh._id,
      description: "Modern student living with spacious single and double rooms, high-speed Wi-Fi, and dedicated study desks.",
      propertyType: "PG",
      location: {
        address: "4 Thaltej Crossroads",
        area: "Thaltej",
        city: "Ahmedabad",
        state: "Gujarat",
        pincode: "380059",
      },
      pricing: { monthlyRent: 8500, securityDeposit: 17000 },
      accommodation: { roomType: "1-sharing", totalRooms: 12, availableRooms: 4 },
      preferences: { genderPreference: "any" },
      amenities: ["Wi-Fi", "Daily Food", "Gym", "Laundry", "Study Desks"],
      rules: ["Quiet hours after 11 PM"],
      verificationStatus: "verified",
    },
    {
      title: "Campus Nest PG",
      owner: otherOwners[1]._id, // Vikram Rao
      description: "Affordable and cozy student home close to colleges and bus connectivity in Satellite area.",
      propertyType: "Apartment",
      location: {
        address: "5 Satellite Road",
        area: "Satellite",
        city: "Ahmedabad",
        state: "Gujarat",
        pincode: "380015",
      },
      pricing: { monthlyRent: 9000, securityDeposit: 18000 },
      accommodation: { roomType: "2-sharing", totalRooms: 6, availableRooms: 1 },
      preferences: { genderPreference: "any" },
      amenities: ["Wi-Fi", "Security", "Attached Bath"],
      rules: ["No loud music"],
      verificationStatus: "verified",
    },
    {
      title: "Greenview Co-living",
      owner: jayesh._id,
      description: "Premium co-living space with lush green surroundings, high-speed internet, and regular housekeeping.",
      propertyType: "PG",
      location: {
        address: "8 Bodakdev Main Road",
        area: "Bodakdev",
        city: "Ahmedabad",
        state: "Gujarat",
        pincode: "380054",
      },
      pricing: { monthlyRent: 9500, securityDeposit: 19000 },
      accommodation: { roomType: "2-sharing", totalRooms: 8, availableRooms: 2 },
      preferences: { genderPreference: "any" },
      amenities: ["Wi-Fi", "Daily Food", "Housekeeping", "Laundry", "Air Conditioner"],
      rules: ["No smoking indoors"],
      verificationStatus: "pending",
    },
    {
      title: "Mehta Luxury Haven",
      owner: otherOwners[2]._id, // Ramesh Mehta (Pending Owner)
      description: "Brand new PG facility with modern furnishings, solar water heating, and daily vegetarian thali.",
      propertyType: "Hostel",
      location: {
        address: "14 SG Highway, Chandkheda",
        area: "Chandkheda",
        city: "Ahmedabad",
        state: "Gujarat",
        pincode: "382424",
      },
      pricing: { monthlyRent: 7000, securityDeposit: 14000 },
      accommodation: { roomType: "3-sharing", totalRooms: 15, availableRooms: 8 },
      preferences: { genderPreference: "male" },
      amenities: ["Wi-Fi", "Daily Food", "CCTV", "Lift", "RO Water"],
      rules: ["Gate closes at 10:30 PM"],
      verificationStatus: "pending",
    },
    {
      title: "Old City Boys Hostel",
      owner: otherOwners[3]._id, // Suresh Desai
      description: "Budget accommodation for boys near train station.",
      propertyType: "Hostel",
      location: {
        address: "22 Station Road",
        area: "Railway Colony",
        city: "Pune",
        state: "Maharashtra",
        pincode: "411001",
      },
      pricing: { monthlyRent: 4500, securityDeposit: 9000 },
      accommodation: { roomType: "4-sharing", totalRooms: 10, availableRooms: 5 },
      preferences: { genderPreference: "male" },
      amenities: ["Wi-Fi", "Water Purifier"],
      rules: ["Strict discipline required"],
      verificationStatus: "rejected",
      rejectionReason: "Fire safety NOC certificate missing and room photos do not meet listing standards.",
    },
  ];

  const createdProperties = await Property.insertMany(samples);

  // 7. Real Chat and Messages
  const krishnaPg = createdProperties.find((p) => p.title === "Krishna PG");
  if (krishnaPg && students.length > 0) {
    const student = students[0]; // Neeraj Patel
    const chat = await Chat.create({
      participants: [student._id, jayesh._id],
      property: krishnaPg._id,
      lastMessage: "Hello Jayesh sir, is the double sharing room at Krishna PG available for this semester?",
      lastMessageAt: new Date(),
    });

    await Message.create({
      chat: chat._id,
      sender: student._id,
      body: "Hello Jayesh sir, is the double sharing room at Krishna PG available for this semester?",
      readBy: [student._id],
    });

    await Message.create({
      chat: chat._id,
      sender: jayesh._id,
      body: "Hi Neeraj! Yes, we have 2 rooms available. Food and Wi-Fi are included in the rent. You can visit anytime between 10 AM and 6 PM.",
      readBy: [student._id, jayesh._id],
    });

    // 8. Reviews
    await Review.create({
      property: krishnaPg._id,
      author: student._id,
      rating: 5,
      comment: "Very clean and well maintained PG. Jayesh sir is extremely cooperative and helpful. The food is hygienic and campus distance is just 10 mins.",
      isVisible: true,
    });

    await Review.create({
      property: createdProperties[1]._id, // Shree Girls PG
      author: students[1]._id, // Diya Shah
      rating: 4,
      comment: "Great location and safe environment for girls. Wi-Fi speed could be slightly better on the 2nd floor.",
      isVisible: true,
    });

    // 9. Real Reports for admin moderation
    await Report.create({
      reporter: students[0]._id,
      targetType: "property",
      targetId: krishnaPg._id,
      reason: "Listing photo showed study desk in every room, but 2-sharing room had only 1 combined desk.",
      status: "pending",
    });

    await Report.create({
      reporter: students[1]._id,
      targetType: "user",
      targetId: otherOwners[3]._id, // Suresh Desai
      reason: "Owner requested deposit payment through personal phone without booking agreement.",
      status: "pending",
    });

    await Report.create({
      reporter: students[2]._id,
      targetType: "property",
      targetId: createdProperties[2]._id, // Prime Stay PG
      reason: "Listing rent was updated from ₹8000 to ₹8500 without advance notification.",
      status: "resolved",
      resolution: "Admin verified that owner had added AC upgrade package reflecting the updated ₹8500 price.",
    });
  }

  console.log("=========================================");
  console.log("StayMatch Demo data successfully seeded!");
  console.log("Admin: admin@staymatch.demo / DemoPass123!");
  console.log("Owner: jayesh@gmail.com / DemoPass123!");
  console.log("Student: neeraj.patel@staymatch.demo / DemoPass123!");
  console.log("=========================================");
  process.exit(0);
}

run().catch((e) => {
  console.error("Seeding error:", e);
  process.exit(1);
});
