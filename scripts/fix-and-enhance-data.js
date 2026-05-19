/**
 * Fix Placement Data and Enhance Database
 * 
 * This script:
 * 1. Fixes incomplete placement records
 * 2. Adds placement data for existing students
 * 3. Optionally adds more test students
 * 
 * Usage: node scripts/fix-and-enhance-data.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/adyapan';

// Sample companies and roles
const COMPANIES = [
  { name: 'TCS', packages: [600000, 700000, 800000] },
  { name: 'Infosys', packages: [650000, 750000, 850000] },
  { name: 'Wipro', packages: [600000, 700000, 750000] },
  { name: 'Cognizant', packages: [650000, 700000, 800000] },
  { name: 'Accenture', packages: [700000, 800000, 900000] },
  { name: 'HCL Technologies', packages: [600000, 650000, 700000] },
  { name: 'Tech Mahindra', packages: [600000, 700000, 750000] },
  { name: 'Amazon', packages: [1200000, 1500000, 1800000] },
  { name: 'Microsoft', packages: [1500000, 1800000, 2000000] },
  { name: 'Google', packages: [1800000, 2000000, 2500000] },
];

const JOB_TITLES = [
  'Software Engineer',
  'Full Stack Developer',
  'Backend Developer',
  'Frontend Developer',
  'Data Analyst',
  'DevOps Engineer',
  'QA Engineer',
  'System Engineer',
  'Associate Software Engineer',
  'Junior Developer',
];

async function fixAndEnhanceData() {
  try {
    console.log('🔌 Connecting to MongoDB...\n');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected successfully!\n');

    const db = mongoose.connection.db;

    // 1. Clean up bad placement records
    console.log('🧹 Cleaning up incomplete placement records...');
    const deleteResult = await db.collection('placements').deleteMany({
      $or: [
        { userId: { $exists: false } },
        { userId: null },
        { userId: undefined },
        { companyName: { $exists: false } },
        { companyName: null },
      ]
    });
    console.log(`   Deleted ${deleteResult.deletedCount} incomplete records\n`);

    // 2. Get all students with completed courses
    console.log('👥 Finding students with completed courses...');
    const students = await db.collection('authusers')
      .find({ role: 'STUDENT', isActive: true })
      .toArray();

    console.log(`   Found ${students.length} students\n`);

    let placedCount = 0;

    for (const student of students) {
      const studentId = student._id.toString();

      // Check if student has completed courses
      const completedProgress = await db.collection('progresses')
        .findOne({ 
          userId: studentId,
          isCompleted: true,
          progressPercent: 100
        });

      if (completedProgress) {
        // Check if placement already exists
        const existingPlacement = await db.collection('placements')
          .findOne({ userId: studentId, isVerified: true });

        if (!existingPlacement) {
          // Create placement (50% chance)
          if (Math.random() > 0.5) {
            const company = COMPANIES[Math.floor(Math.random() * COMPANIES.length)];
            const packageAmount = company.packages[Math.floor(Math.random() * company.packages.length)];
            const jobTitle = JOB_TITLES[Math.floor(Math.random() * JOB_TITLES.length)];
            const joiningDate = new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000); // Next 90 days

            await db.collection('placements').insertOne({
              userId: studentId,
              studentName: student.name,
              studentEmail: student.email,
              companyName: company.name,
              jobTitle: jobTitle,
              packageAmount: packageAmount,
              placementType: 'full-time',
              joiningDate: joiningDate,
              placedAt: new Date(),
              isVerified: true,
              verifiedBy: 'admin',
              verifiedAt: new Date(),
              createdAt: new Date(),
              updatedAt: new Date(),
            });

            console.log(`   ✅ ${student.name} → ${company.name} • ₹${(packageAmount / 100000).toFixed(2)} LPA`);
            placedCount++;
          } else {
            console.log(`   ⏳ ${student.name} → Available for hiring`);
          }
        } else {
          console.log(`   ℹ️  ${student.name} → Already has placement`);
        }
      } else {
        console.log(`   ⏳ ${student.name} → Course not completed yet`);
      }
    }

    console.log(`\n🎉 Created ${placedCount} new placements!\n`);

    // 3. Summary
    console.log('═══════════════════════════════════════════════════════════');
    console.log('                      SUMMARY                              ');
    console.log('═══════════════════════════════════════════════════════════\n');

    const totalStudents = await db.collection('authusers').countDocuments({ role: 'STUDENT' });
    const totalEnrollments = await db.collection('enrollments').countDocuments();
    const totalPlacements = await db.collection('placements').countDocuments({ isVerified: true });
    const totalProgress = await db.collection('progresses').countDocuments({ isCompleted: true });

    console.log(`✅ Database updated successfully!`);
    console.log(`   - ${totalStudents} students`);
    console.log(`   - ${totalEnrollments} enrollments`);
    console.log(`   - ${totalProgress} completed courses`);
    console.log(`   - ${totalPlacements} verified placements\n`);

    if (totalPlacements > 0) {
      console.log('🎯 Your hiring dashboard will now show:');
      console.log(`   - Students with course enrollments`);
      console.log(`   - Highlighted placed students (green theme)`);
      console.log(`   - Scrolling marquee with placements`);
      console.log(`   - "INDIA'S LARGEST STUDENT COMMUNITY" banner\n`);
    }

    console.log('🚀 Next Step:');
    console.log('   Login as COMPANY/ADMIN and visit Find Employee page!\n');

    // Show sample placements
    if (totalPlacements > 0) {
      console.log('📋 Sample Placements:');
      const samplePlacements = await db.collection('placements')
        .find({ isVerified: true })
        .limit(5)
        .toArray();

      for (const place of samplePlacements) {
        console.log(`   ${place.studentName} → ${place.companyName} • ₹${(place.packageAmount / 100000).toFixed(2)} LPA • ${place.jobTitle}`);
      }
      console.log('');
    }

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB\n');
  }
}

fixAndEnhanceData();
