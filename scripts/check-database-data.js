/**
 * Database Data Checker
 * Run this script to see what data exists in your database
 * 
 * Usage: node scripts/check-database-data.js
 */

const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/adyapan';

async function checkDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;

    // Get all collections
    const collections = await db.listCollections().toArray();
    console.log('📚 Collections in database:');
    collections.forEach(col => console.log(`  - ${col.name}`));
    console.log('');

    // Check AuthUsers
    console.log('👥 USERS (authusers):');
    const users = await db.collection('authusers').find({}).limit(10).toArray();
    console.log(`  Total: ${await db.collection('authusers').countDocuments()}`);
    console.log(`  Students: ${await db.collection('authusers').countDocuments({ role: 'STUDENT' })}`);
    console.log(`  Companies: ${await db.collection('authusers').countDocuments({ role: 'COMPANY' })}`);
    console.log(`  Admins: ${await db.collection('authusers').countDocuments({ role: 'ADMIN' })}`);
    console.log(`  SuperAdmins: ${await db.collection('authusers').countDocuments({ role: 'SUPERADMIN' })}`);
    
    if (users.length > 0) {
      console.log('\n  Sample users:');
      users.slice(0, 3).forEach(u => {
        console.log(`    - ${u.name} (${u.email}) - Role: ${u.role}`);
      });
    }
    console.log('');

    // Check Enrollments
    console.log('📖 ENROLLMENTS:');
    const enrollments = await db.collection('enrollments').find({}).limit(5).toArray();
    console.log(`  Total: ${await db.collection('enrollments').countDocuments()}`);
    console.log(`  Active: ${await db.collection('enrollments').countDocuments({ enrollmentStatus: 'active' })}`);
    console.log(`  Completed: ${await db.collection('enrollments').countDocuments({ enrollmentStatus: 'completed' })}`);
    
    if (enrollments.length > 0) {
      console.log('\n  Sample enrollments:');
      enrollments.slice(0, 3).forEach(e => {
        console.log(`    - ${e.courseName} (${e.enrollmentStatus})`);
      });
    }
    console.log('');

    // Check Certificates
    console.log('🎓 CERTIFICATES:');
    const certificates = await db.collection('certificates').find({}).limit(5).toArray();
    console.log(`  Total: ${await db.collection('certificates').countDocuments()}`);
    console.log(`  Ready: ${await db.collection('certificates').countDocuments({ status: 'ready' })}`);
    
    if (certificates.length > 0) {
      console.log('\n  Sample certificates:');
      certificates.slice(0, 3).forEach(c => {
        console.log(`    - ${c.studentName} - ${c.courseName}`);
      });
    }
    console.log('');

    // Check Progress
    console.log('📊 PROGRESS:');
    const progress = await db.collection('progresses').find({}).limit(5).toArray();
    console.log(`  Total: ${await db.collection('progresses').countDocuments()}`);
    console.log(`  Completed: ${await db.collection('progresses').countDocuments({ isCompleted: true })}`);
    console.log('');

    // Check Placements
    console.log('💼 PLACEMENTS:');
    const placements = await db.collection('placements').find({}).limit(5).toArray();
    console.log(`  Total: ${await db.collection('placements').countDocuments()}`);
    console.log(`  Verified: ${await db.collection('placements').countDocuments({ isVerified: true })}`);
    
    if (placements.length > 0) {
      console.log('\n  Sample placements:');
      placements.slice(0, 3).forEach(p => {
        console.log(`    - ${p.studentName} at ${p.companyName} - ₹${(p.packageAmount / 100000).toFixed(1)} LPA`);
      });
    }
    console.log('');

    // Check Recruiter Shortlists
    console.log('⭐ RECRUITER SHORTLISTS:');
    const shortlists = await db.collection('recruitershortlists').find({}).limit(5).toArray();
    console.log(`  Total: ${await db.collection('recruitershortlists').countDocuments()}`);
    
    if (shortlists.length > 0) {
      console.log('\n  Sample shortlists:');
      shortlists.slice(0, 3).forEach(s => {
        console.log(`    - ${s.studentName} shortlisted by ${s.recruiterEmail}`);
      });
    }
    console.log('');

    // Check Student CVs
    console.log('📄 STUDENT CVs:');
    const cvs = await db.collection('studentcvs').find({}).limit(5).toArray();
    console.log(`  Total: ${await db.collection('studentcvs').countDocuments()}`);
    console.log(`  Active: ${await db.collection('studentcvs').countDocuments({ isActive: true })}`);
    console.log('');

    // Check Recruiter Jobs
    console.log('💼 RECRUITER JOBS:');
    const jobs = await db.collection('recruiterjobs').find({}).limit(5).toArray();
    console.log(`  Total: ${await db.collection('recruiterjobs').countDocuments()}`);
    console.log(`  Open: ${await db.collection('recruiterjobs').countDocuments({ status: 'open' })}`);
    console.log('');

    // Summary for Recruiter Dashboard
    console.log('═══════════════════════════════════════════════════════');
    console.log('📊 RECRUITER DASHBOARD DATA SUMMARY:');
    console.log('═══════════════════════════════════════════════════════');
    
    const enrolledUserIds = await db.collection('enrollments')
      .distinct('userId', { enrollmentStatus: { $in: ['active', 'completed'] } });
    
    const totalStudents = await db.collection('authusers').countDocuments({
      role: 'STUDENT',
      accountStatus: 'approved',
      isActive: true,
      _id: { $in: enrolledUserIds.map(id => new mongoose.Types.ObjectId(id)) }
    });

    const placedStudentIds = await db.collection('placements')
      .distinct('userId', { isVerified: true });
    
    const availableStudents = totalStudents - placedStudentIds.length;

    console.log(`\n  📚 Total Enrolled Students: ${totalStudents}`);
    console.log(`  ✅ Available Students: ${availableStudents}`);
    console.log(`  💼 Placed Students: ${placedStudentIds.length}`);
    console.log(`  ⭐ Total Shortlists: ${await db.collection('recruitershortlists').countDocuments()}`);
    console.log(`  📄 Students with CVs: ${await db.collection('studentcvs').countDocuments({ isActive: true })}`);
    console.log(`  💼 Active Jobs: ${await db.collection('recruiterjobs').countDocuments({ status: 'open' })}`);
    
    console.log('\n═══════════════════════════════════════════════════════\n');

    // Recommendations
    console.log('💡 RECOMMENDATIONS:');
    
    if (totalStudents === 0) {
      console.log('  ⚠️  No enrolled students found!');
      console.log('     → Students need to purchase/enroll in courses first');
      console.log('     → Check the enrollments collection');
    } else {
      console.log(`  ✅ Found ${totalStudents} enrolled students - Dashboard will show data!`);
    }

    if (placedStudentIds.length === 0) {
      console.log('  ℹ️  No placements recorded yet');
      console.log('     → Add placement records to show placement highlights');
    }

    const companyUsers = await db.collection('authusers').countDocuments({ role: 'COMPANY' });
    if (companyUsers === 0) {
      console.log('  ⚠️  No COMPANY users found!');
      console.log('     → Create a COMPANY user to access recruiter dashboard');
      console.log('     → Or use ADMIN/SUPERADMIN account');
    } else {
      console.log(`  ✅ Found ${companyUsers} company user(s) - Can access dashboard!`);
    }

    console.log('');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

checkDatabase();
