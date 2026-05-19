/**
 * MongoDB Data Checker
 * 
 * This script connects to your MongoDB and checks:
 * - Students who completed courses
 * - Students with placements
 * - Data available for hiring dashboard
 * 
 * Usage:
 *   npx ts-node scripts/check-mongodb-data.ts
 */

import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/adyapan';

// Define schemas
const AuthUserSchema = new mongoose.Schema({}, { strict: false, collection: 'authusers' });
const EnrollmentSchema = new mongoose.Schema({}, { strict: false, collection: 'enrollments' });
const ProgressSchema = new mongoose.Schema({}, { strict: false, collection: 'progresses' });
const CertificateSchema = new mongoose.Schema({}, { strict: false, collection: 'certificates' });
const PaymentSchema = new mongoose.Schema({}, { strict: false, collection: 'payments' });
const PlacementSchema = new mongoose.Schema({}, { strict: false, collection: 'placements' });

async function checkMongoDBData() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    console.log(`📍 URI: ${MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@')}\n`);
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully!\n');

    const AuthUser = mongoose.models.AuthUser || mongoose.model('AuthUser', AuthUserSchema);
    const Enrollment = mongoose.models.Enrollment || mongoose.model('Enrollment', EnrollmentSchema);
    const Progress = mongoose.models.Progress || mongoose.model('Progress', ProgressSchema);
    const Certificate = mongoose.models.Certificate || mongoose.model('Certificate', CertificateSchema);
    const Payment = mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);
    const Placement = mongoose.models.Placement || mongoose.model('Placement', PlacementSchema);

    console.log('═══════════════════════════════════════════════════════════');
    console.log('                  DATABASE OVERVIEW                        ');
    console.log('═══════════════════════════════════════════════════════════\n');

    // 1. STUDENTS
    console.log('👥 STUDENTS:');
    const totalStudents = await AuthUser.countDocuments({ role: 'STUDENT' });
    const activeStudents = await AuthUser.countDocuments({ 
      role: 'STUDENT', 
      isActive: true 
    });
    const approvedStudents = await AuthUser.countDocuments({ 
      role: 'STUDENT', 
      accountStatus: 'approved',
      isActive: true 
    });
    
    console.log(`   Total Students: ${totalStudents}`);
    console.log(`   Active Students: ${activeStudents}`);
    console.log(`   Approved & Active: ${approvedStudents}\n`);

    // 2. ENROLLMENTS
    console.log('📚 ENROLLMENTS:');
    const totalEnrollments = await Enrollment.countDocuments();
    const activeEnrollments = await Enrollment.countDocuments({ 
      enrollmentStatus: 'active' 
    });
    const completedEnrollments = await Enrollment.countDocuments({ 
      enrollmentStatus: 'completed' 
    });
    
    console.log(`   Total Enrollments: ${totalEnrollments}`);
    console.log(`   Active: ${activeEnrollments}`);
    console.log(`   Completed: ${completedEnrollments}\n`);

    // Get enrolled student IDs
    const enrolledUserIds = await Enrollment.distinct('userId', {
      enrollmentStatus: { $in: ['active', 'completed'] },
    });
    console.log(`   Students with Enrollments: ${enrolledUserIds.length}\n`);

    // 3. PROGRESS
    console.log('📈 COURSE PROGRESS:');
    const totalProgress = await Progress.countDocuments();
    const completedCourses = await Progress.countDocuments({ isCompleted: true });
    const inProgressCourses = await Progress.countDocuments({ 
      isCompleted: false,
      progressPercent: { $gt: 0 }
    });
    
    console.log(`   Total Progress Records: ${totalProgress}`);
    console.log(`   Completed Courses: ${completedCourses}`);
    console.log(`   In Progress: ${inProgressCourses}\n`);

    // 4. CERTIFICATES
    console.log('📜 CERTIFICATES:');
    const totalCertificates = await Certificate.countDocuments();
    const readyCertificates = await Certificate.countDocuments({ status: 'ready' });
    const pendingCertificates = await Certificate.countDocuments({ status: 'pending' });
    
    console.log(`   Total Certificates: ${totalCertificates}`);
    console.log(`   Ready: ${readyCertificates}`);
    console.log(`   Pending: ${pendingCertificates}\n`);

    // 5. PAYMENTS
    console.log('💳 PAYMENTS:');
    const totalPayments = await Payment.countDocuments();
    const successPayments = await Payment.countDocuments({ status: 'success' });
    const totalRevenue = await Payment.aggregate([
      { $match: { status: 'success' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    
    console.log(`   Total Payments: ${totalPayments}`);
    console.log(`   Successful: ${successPayments}`);
    console.log(`   Total Revenue: ₹${totalRevenue[0]?.total || 0}\n`);

    // 6. PLACEMENTS
    console.log('🎯 PLACEMENTS:');
    const totalPlacements = await Placement.countDocuments();
    const verifiedPlacements = await Placement.countDocuments({ isVerified: true });
    const avgPackage = await Placement.aggregate([
      { $match: { isVerified: true } },
      { $group: { _id: null, avg: { $avg: '$packageAmount' } } }
    ]);
    
    console.log(`   Total Placements: ${totalPlacements}`);
    console.log(`   Verified: ${verifiedPlacements}`);
    console.log(`   Average Package: ₹${((avgPackage[0]?.avg || 0) / 100000).toFixed(2)} LPA\n`);

    console.log('═══════════════════════════════════════════════════════════');
    console.log('           STUDENTS FOR HIRING DASHBOARD                  ');
    console.log('═══════════════════════════════════════════════════════════\n');

    // Find students who should appear in hiring dashboard
    const hiringStudents = await AuthUser.find({
      role: 'STUDENT',
      accountStatus: 'approved',
      isActive: true,
      _id: { $in: enrolledUserIds }
    })
    .select('name email phone selectedProgram createdAt')
    .limit(10)
    .lean();

    console.log(`✅ Found ${hiringStudents.length} students for hiring dashboard\n`);

    if (hiringStudents.length === 0) {
      console.log('⚠️  WARNING: No students found for hiring dashboard!\n');
      console.log('💡 Reasons:');
      console.log('   1. No students have purchased courses');
      console.log('   2. No enrollment records exist');
      console.log('   3. Students are not approved or active\n');
      console.log('💡 Solution:');
      console.log('   Run: npx ts-node scripts/seed-student-data.ts\n');
    } else {
      console.log('📋 SAMPLE STUDENTS:\n');

      for (const student of hiringStudents) {
        const studentId = (student as any)._id.toString();
        
        // Get enrollments
        const enrollments = await Enrollment.find({ 
          userId: studentId,
          enrollmentStatus: { $in: ['active', 'completed'] }
        }).lean();

        // Get progress
        const progresses = await Progress.find({ userId: studentId }).lean();
        const completedCount = progresses.filter((p: any) => p.isCompleted).length;

        // Get certificates
        const certificates = await Certificate.find({ 
          userId: studentId,
          status: 'ready'
        }).lean();

        // Get placement
        const placement = await Placement.findOne({ 
          userId: studentId,
          isVerified: true
        }).lean();

        console.log(`👤 ${(student as any).name}`);
        console.log(`   Email: ${(student as any).email}`);
        console.log(`   Phone: ${(student as any).phone || 'N/A'}`);
        console.log(`   Education: ${(student as any).selectedProgram || 'N/A'}`);
        console.log(`   Enrolled Courses: ${enrollments.length}`);
        console.log(`   Completed Courses: ${completedCount}`);
        console.log(`   Certificates: ${certificates.length}`);
        
        if (placement) {
          console.log(`   🎉 PLACED at ${(placement as any).companyName}`);
          console.log(`      Package: ₹${((placement as any).packageAmount / 100000).toFixed(2)} LPA`);
          console.log(`      Role: ${(placement as any).jobTitle}`);
        } else {
          console.log(`   Status: Available for Hiring`);
        }

        // Show course details
        if (enrollments.length > 0) {
          console.log(`   Courses:`);
          for (const enr of enrollments) {
            const progress = progresses.find((p: any) => p.courseSlug === (enr as any).courseSlug);
            const progressPercent = (progress as any)?.progressPercent || 0;
            const status = (progress as any)?.isCompleted ? '✅ Completed' : `⏳ ${progressPercent}%`;
            console.log(`      - ${(enr as any).courseName}: ${status}`);
          }
        }
        
        console.log('');
      }
    }

    console.log('═══════════════════════════════════════════════════════════');
    console.log('                  API SIMULATION                           ');
    console.log('═══════════════════════════════════════════════════════════\n');

    // Simulate API query
    const apiQuery = {
      role: 'STUDENT',
      accountStatus: 'approved',
      isActive: true,
      _id: { $in: enrolledUserIds }
    };

    const apiStudents = await AuthUser.find(apiQuery)
      .select('-passwordHash -lockedUntil -failedLoginAttempts')
      .sort({ createdAt: -1 })
      .limit(12)
      .lean();

    console.log(`✅ API would return ${apiStudents.length} students\n`);

    // Get placement stats
    const placedStudentIds = await Placement.distinct('userId', { isVerified: true });
    const availableCount = apiStudents.filter((s: any) => 
      !placedStudentIds.includes(s._id.toString())
    ).length;
    const placedCount = apiStudents.filter((s: any) => 
      placedStudentIds.includes(s._id.toString())
    ).length;

    console.log('📊 DASHBOARD STATS:');
    console.log(`   Total Students: ${apiStudents.length}`);
    console.log(`   Available: ${availableCount}`);
    console.log(`   Placed: ${placedCount}\n`);

    // Check for placed students for marquee
    const placedStudents = await AuthUser.find({
      role: 'STUDENT',
      _id: { $in: placedStudentIds }
    }).limit(5).lean();

    if (placedStudents.length > 0) {
      console.log('🎉 MARQUEE BANNER WILL SHOW:');
      for (const student of placedStudents) {
        const placement = await Placement.findOne({ 
          userId: (student as any)._id.toString(),
          isVerified: true
        }).lean();
        
        if (placement) {
          console.log(`   ${(student as any).name} → ${(placement as any).companyName} • ₹${((placement as any).packageAmount / 100000).toFixed(1)} LPA`);
        }
      }
      console.log('');
    } else {
      console.log('ℹ️  Marquee banner will not show (no placed students)\n');
    }

    console.log('═══════════════════════════════════════════════════════════');
    console.log('                     SUMMARY                               ');
    console.log('═══════════════════════════════════════════════════════════\n');

    if (apiStudents.length > 0) {
      console.log('✅ SUCCESS: Your hiring dashboard will display students!\n');
      console.log('📊 What will show:');
      console.log(`   - ${apiStudents.length} students with course enrollments`);
      console.log(`   - ${completedCourses} completed courses`);
      console.log(`   - ${readyCertificates} certificates`);
      console.log(`   - ${placedCount} placed students (highlighted)`);
      console.log(`   - ${availableCount} available students\n`);
      
      if (placedStudents.length > 0) {
        console.log('✨ Marquee banner will show placed students');
      }
      
      console.log('\n🎯 Next Step:');
      console.log('   Login as COMPANY/ADMIN and visit the Find Employee page!');
    } else {
      console.log('⚠️  WARNING: No data available for hiring dashboard\n');
      console.log('💡 Solution:');
      console.log('   Run: npx ts-node scripts/seed-student-data.ts');
      console.log('   This will create 10 test students with courses and placements');
    }

    console.log('\n═══════════════════════════════════════════════════════════\n');

  } catch (error: any) {
    console.error('\n❌ ERROR:', error.message);
    console.error('\n💡 Troubleshooting:');
    console.error('   1. Check your .env file has MONGODB_URI');
    console.error('   2. Verify MongoDB is running');
    console.error('   3. Check connection string is correct');
    console.error('   4. Ensure database name is correct\n');
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB\n');
  }
}

// Run the checker
checkMongoDBData();
