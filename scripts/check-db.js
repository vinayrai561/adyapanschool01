/**
 * MongoDB Data Checker (JavaScript version)
 * 
 * Usage: node scripts/check-db.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/adyapan';

async function checkDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    console.log(`📍 URI: ${MONGODB_URI}\n`);
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected successfully!\n');

    // Get all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📚 Collections in database:');
    collections.forEach(col => console.log(`   - ${col.name}`));
    console.log('');

    // Check each collection
    const stats = {};
    
    for (const col of collections) {
      const count = await mongoose.connection.db.collection(col.name).countDocuments();
      stats[col.name] = count;
    }

    console.log('═══════════════════════════════════════════════════════════');
    console.log('                  COLLECTION COUNTS                        ');
    console.log('═══════════════════════════════════════════════════════════\n');

    Object.entries(stats).forEach(([name, count]) => {
      console.log(`   ${name}: ${count}`);
    });
    console.log('');

    // Check students
    if (stats.authusers > 0) {
      console.log('═══════════════════════════════════════════════════════════');
      console.log('                     STUDENTS                              ');
      console.log('═══════════════════════════════════════════════════════════\n');

      const students = await mongoose.connection.db.collection('authusers')
        .find({ role: 'STUDENT' })
        .limit(5)
        .toArray();

      console.log(`Found ${students.length} students (showing first 5):\n`);
      
      for (const student of students) {
        console.log(`👤 ${student.name}`);
        console.log(`   Email: ${student.email}`);
        console.log(`   Role: ${student.role}`);
        console.log(`   Status: ${student.accountStatus}`);
        console.log(`   Active: ${student.isActive}`);
        console.log('');
      }
    }

    // Check enrollments
    if (stats.enrollments > 0) {
      console.log('═══════════════════════════════════════════════════════════');
      console.log('                   ENROLLMENTS                             ');
      console.log('═══════════════════════════════════════════════════════════\n');

      const enrollments = await mongoose.connection.db.collection('enrollments')
        .find({})
        .limit(5)
        .toArray();

      console.log(`Found ${enrollments.length} enrollments (showing first 5):\n`);
      
      for (const enr of enrollments) {
        console.log(`📚 ${enr.courseName}`);
        console.log(`   User ID: ${enr.userId}`);
        console.log(`   Status: ${enr.enrollmentStatus}`);
        console.log(`   Amount: ₹${enr.amountPaid}`);
        console.log(`   Enrolled: ${enr.enrolledAt}`);
        console.log('');
      }
    }

    // Check progress
    if (stats.progresses > 0) {
      console.log('═══════════════════════════════════════════════════════════');
      console.log('                     PROGRESS                              ');
      console.log('═══════════════════════════════════════════════════════════\n');

      const progresses = await mongoose.connection.db.collection('progresses')
        .find({})
        .limit(5)
        .toArray();

      console.log(`Found ${progresses.length} progress records (showing first 5):\n`);
      
      for (const prog of progresses) {
        console.log(`📈 Course: ${prog.courseSlug}`);
        console.log(`   User ID: ${prog.userId}`);
        console.log(`   Progress: ${prog.progressPercent}%`);
        console.log(`   Completed: ${prog.isCompleted ? 'Yes ✅' : 'No ⏳'}`);
        console.log('');
      }
    }

    // Check placements
    if (stats.placements > 0) {
      console.log('═══════════════════════════════════════════════════════════');
      console.log('                    PLACEMENTS                             ');
      console.log('═══════════════════════════════════════════════════════════\n');

      const placements = await mongoose.connection.db.collection('placements')
        .find({})
        .limit(5)
        .toArray();

      console.log(`Found ${placements.length} placements (showing first 5):\n`);
      
      for (const place of placements) {
        console.log(`🎉 ${place.companyName}`);
        console.log(`   User ID: ${place.userId}`);
        console.log(`   Package: ₹${(place.packageAmount / 100000).toFixed(2)} LPA`);
        console.log(`   Role: ${place.jobTitle}`);
        console.log(`   Verified: ${place.isVerified ? 'Yes ✅' : 'No ⏳'}`);
        console.log('');
      }
    }

    // Summary
    console.log('═══════════════════════════════════════════════════════════');
    console.log('                      SUMMARY                              ');
    console.log('═══════════════════════════════════════════════════════════\n');

    const studentCount = stats.authusers || 0;
    const enrollmentCount = stats.enrollments || 0;
    const progressCount = stats.progresses || 0;
    const placementCount = stats.placements || 0;

    if (enrollmentCount > 0) {
      console.log('✅ Your database has data!');
      console.log(`   - ${studentCount} users`);
      console.log(`   - ${enrollmentCount} enrollments`);
      console.log(`   - ${progressCount} progress records`);
      console.log(`   - ${placementCount} placements\n`);
      console.log('🎯 Your hiring dashboard should work!');
      console.log('   Login as COMPANY/ADMIN and visit Find Employee page\n');
    } else {
      console.log('⚠️  No enrollment data found!');
      console.log('\n💡 Solution:');
      console.log('   Run: node scripts/seed-student-data.js');
      console.log('   Or: npx ts-node scripts/seed-student-data.ts\n');
    }

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error('\n💡 Troubleshooting:');
    console.error('   1. Make sure MongoDB is running');
    console.error('   2. Check .env file has correct MONGODB_URI');
    console.error('   3. Try: mongosh "mongodb://127.0.0.1:27017/adyapan"\n');
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB\n');
  }
}

checkDatabase();
