/**
 * Test Recruiter API Script
 * 
 * This script tests the recruiter dashboard API endpoints
 * to verify they're working correctly.
 * 
 * Usage:
 *   npx ts-node scripts/test-recruiter-api.ts
 */

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/adyapan';

async function testRecruiterAPI() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Define models
    const AuthUser = mongoose.models.AuthUser || mongoose.model('AuthUser', new mongoose.Schema({}, { strict: false }));
    const Enrollment = mongoose.models.Enrollment || mongoose.model('Enrollment', new mongoose.Schema({}, { strict: false }));
    const Progress = mongoose.models.Progress || mongoose.model('Progress', new mongoose.Schema({}, { strict: false }));
    const Certificate = mongoose.models.Certificate || mongoose.model('Certificate', new mongoose.Schema({}, { strict: false }));
    const Payment = mongoose.models.Payment || mongoose.model('Payment', new mongoose.Schema({}, { strict: false }));

    console.log('📊 Database Statistics:\n');

    // Count students
    const totalStudents = await AuthUser.countDocuments({ role: 'STUDENT' });
    console.log(`👥 Total Students: ${totalStudents}`);

    const approvedStudents = await AuthUser.countDocuments({ 
      role: 'STUDENT', 
      accountStatus: 'approved',
      isActive: true 
    });
    console.log(`✅ Approved & Active Students: ${approvedStudents}`);

    // Count enrollments
    const totalEnrollments = await Enrollment.countDocuments();
    console.log(`\n📚 Total Enrollments: ${totalEnrollments}`);

    const activeEnrollments = await Enrollment.countDocuments({ 
      enrollmentStatus: { $in: ['active', 'completed'] } 
    });
    console.log(`✅ Active/Completed Enrollments: ${activeEnrollments}`);

    // Get enrolled student IDs
    const enrolledUserIds = await Enrollment.distinct('userId', {
      enrollmentStatus: { $in: ['active', 'completed'] },
    });
    console.log(`👤 Students with Enrollments: ${enrolledUserIds.length}`);

    // Count progress records
    const totalProgress = await Progress.countDocuments();
    console.log(`\n📈 Total Progress Records: ${totalProgress}`);

    const completedProgress = await Progress.countDocuments({ isCompleted: true });
    console.log(`✅ Completed Courses: ${completedProgress}`);

    // Count certificates
    const totalCertificates = await Certificate.countDocuments();
    console.log(`\n📜 Total Certificates: ${totalCertificates}`);

    const readyCertificates = await Certificate.countDocuments({ status: 'ready' });
    console.log(`✅ Ready Certificates: ${readyCertificates}`);

    // Count payments
    const totalPayments = await Payment.countDocuments();
    console.log(`\n💳 Total Payments: ${totalPayments}`);

    const successPayments = await Payment.countDocuments({ status: 'success' });
    console.log(`✅ Successful Payments: ${successPayments}`);

    // Sample student data
    console.log('\n\n📋 Sample Student Data:\n');

    const sampleStudents = await AuthUser.find({ 
      role: 'STUDENT',
      accountStatus: 'approved',
      isActive: true,
      _id: { $in: enrolledUserIds.map((id: string) => id) }
    })
    .limit(5)
    .lean();

    for (const student of sampleStudents) {
      console.log(`\n👤 ${(student as any).name} (${(student as any).email})`);
      
      const enrollments = await Enrollment.find({ 
        userId: (student as any)._id.toString(),
        enrollmentStatus: { $in: ['active', 'completed'] }
      }).lean();
      
      console.log(`   📚 Enrolled Courses: ${enrollments.length}`);
      
      for (const enr of enrollments) {
        const progress = await Progress.findOne({
          userId: (student as any)._id.toString(),
          courseSlug: (enr as any).courseSlug
        }).lean();
        
        const progressPercent = (progress as any)?.progressPercent || 0;
        const isCompleted = (progress as any)?.isCompleted || false;
        
        console.log(`      - ${(enr as any).courseName}: ${progressPercent}% ${isCompleted ? '✅' : '⏳'}`);
      }
      
      const certificates = await Certificate.find({
        userId: (student as any)._id.toString(),
        status: 'ready'
      }).lean();
      
      console.log(`   📜 Certificates: ${certificates.length}`);
    }

    // API Query Simulation
    console.log('\n\n🔍 Simulating API Query:\n');

    const userQuery: Record<string, unknown> = {
      role: 'STUDENT',
      accountStatus: 'approved',
      isActive: true,
      _id: { $in: enrolledUserIds.map((id: string) => id) },
    };

    const studentsForAPI = await AuthUser.find(userQuery)
      .select('-passwordHash -lockedUntil -failedLoginAttempts')
      .sort({ createdAt: -1 })
      .limit(12)
      .lean();

    console.log(`✅ API would return ${studentsForAPI.length} students`);

    if (studentsForAPI.length === 0) {
      console.log('\n⚠️  WARNING: No students found!');
      console.log('\n💡 Possible reasons:');
      console.log('   1. No students have purchased courses yet');
      console.log('   2. No enrollment records exist');
      console.log('   3. Students are not approved or active');
      console.log('\n💡 Solution:');
      console.log('   Run: npx ts-node scripts/seed-student-data.ts');
    } else {
      console.log('\n✅ Recruiter dashboard should display students correctly!');
    }

    console.log('\n\n📊 Summary:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Students:     ${totalStudents} total, ${approvedStudents} approved`);
    console.log(`Enrollments:  ${totalEnrollments} total, ${activeEnrollments} active`);
    console.log(`Progress:     ${totalProgress} total, ${completedProgress} completed`);
    console.log(`Certificates: ${totalCertificates} total, ${readyCertificates} ready`);
    console.log(`Payments:     ${totalPayments} total, ${successPayments} successful`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

testRecruiterAPI();
