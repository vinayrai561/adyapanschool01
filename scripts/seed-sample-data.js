/**
 * Seed Sample Data for Recruiter Dashboard Testing
 * Run this to add sample students, enrollments, and placements
 * 
 * Usage: node scripts/seed-sample-data.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/adyapan';

async function seedData() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;

    // Check if data already exists
    const existingStudents = await db.collection('authusers').countDocuments({ role: 'STUDENT' });
    
    if (existingStudents > 5) {
      console.log('ℹ️  Database already has student data. Skipping seed.');
      console.log('   Delete existing data first if you want to reseed.\n');
      return;
    }

    console.log('🌱 Seeding sample data...\n');

    // Create sample students
    const students = [
      {
        name: 'Aarohi Sharma',
        email: 'aarohi.sharma@example.com',
        phone: '+91 9876543210',
        role: 'STUDENT',
        accountStatus: 'approved',
        isActive: true,
        selectedProgram: 'B.Tech in Computer Science',
        passwordHash: await bcrypt.hash('password123', 10),
        authProvider: 'local',
        isEmailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Rohit Verma',
        email: 'rohit.verma@example.com',
        phone: '+91 9876543211',
        role: 'STUDENT',
        accountStatus: 'approved',
        isActive: true,
        selectedProgram: 'B.Des in Communication Design',
        passwordHash: await bcrypt.hash('password123', 10),
        authProvider: 'local',
        isEmailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Priya Mehta',
        email: 'priya.mehta@example.com',
        phone: '+91 9876543212',
        role: 'STUDENT',
        accountStatus: 'approved',
        isActive: true,
        selectedProgram: 'M.Tech in AI & ML',
        passwordHash: await bcrypt.hash('password123', 10),
        authProvider: 'local',
        isEmailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Karan Joshi',
        email: 'karan.joshi@example.com',
        phone: '+91 9876543213',
        role: 'STUDENT',
        accountStatus: 'approved',
        isActive: true,
        selectedProgram: 'B.Tech in Computer Engineering',
        passwordHash: await bcrypt.hash('password123', 10),
        authProvider: 'local',
        isEmailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Sneha Reddy',
        email: 'sneha.reddy@example.com',
        phone: '+91 9876543214',
        role: 'STUDENT',
        accountStatus: 'approved',
        isActive: true,
        selectedProgram: 'B.Tech in CSE',
        passwordHash: await bcrypt.hash('password123', 10),
        authProvider: 'local',
        isEmailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    console.log('👥 Creating students...');
    const insertedStudents = await db.collection('authusers').insertMany(students);
    const studentIds = Object.values(insertedStudents.insertedIds);
    console.log(`   ✅ Created ${studentIds.length} students\n`);

    // Create enrollments
    const courses = [
      { slug: 'full-stack-development', name: 'Full Stack Development', planId: 'plan-1', planLabel: 'Career Pro Plan' },
      { slug: 'data-science', name: 'Data Science & Analytics', planId: 'plan-2', planLabel: 'Premium Plan' },
      { slug: 'machine-learning', name: 'Machine Learning & AI', planId: 'plan-3', planLabel: 'Advanced Plan' },
      { slug: 'devops-engineering', name: 'DevOps Engineering', planId: 'plan-1', planLabel: 'Career Pro Plan' },
      { slug: 'android-development', name: 'Android App Development', planId: 'plan-2', planLabel: 'Premium Plan' },
    ];

    console.log('📖 Creating enrollments...');
    const enrollments = studentIds.map((studentId, index) => ({
      userId: studentId.toString(),
      courseSlug: courses[index].slug,
      courseName: courses[index].name,
      planId: courses[index].planId,
      planLabel: courses[index].planLabel,
      amountPaid: 15000 + (index * 1000),
      paymentId: `pay_TEST_${Date.now()}_${index}`,
      enrollmentStatus: 'active',
      enrolledAt: new Date(Date.now() - (30 - index) * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await db.collection('enrollments').insertMany(enrollments);
    console.log(`   ✅ Created ${enrollments.length} enrollments\n`);

    // Create progress
    console.log('📊 Creating progress records...');
    const progressRecords = studentIds.map((studentId, index) => ({
      userId: studentId.toString(),
      courseSlug: courses[index].slug,
      completedLessons: [],
      progressPercent: 20 + (index * 15),
      totalLessons: 50,
      isCompleted: index < 2, // First 2 students completed
      completedAt: index < 2 ? new Date() : null,
      lastAccessedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await db.collection('progresses').insertMany(progressRecords);
    console.log(`   ✅ Created ${progressRecords.length} progress records\n`);

    // Create certificates for completed students
    console.log('🎓 Creating certificates...');
    const certificates = studentIds.slice(0, 2).map((studentId, index) => ({
      userId: studentId.toString(),
      courseSlug: courses[index].slug,
      certificateType: 'course_completion',
      certificateId: `ADYP-2024-${1000 + index}`,
      studentName: students[index].name,
      courseName: courses[index].name,
      issuedAt: new Date(),
      certificateUrl: `/certificates/ADYP-2024-${1000 + index}.pdf`,
      status: 'ready',
      emailSent: true,
      emailSentAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await db.collection('certificates').insertMany(certificates);
    console.log(`   ✅ Created ${certificates.length} certificates\n`);

    // Create placements for first 2 students
    console.log('💼 Creating placements...');
    const placements = [
      {
        userId: studentIds[0].toString(),
        studentName: students[0].name,
        studentEmail: students[0].email,
        companyName: 'Tech Mahindra',
        jobTitle: 'Full Stack Developer',
        packageAmount: 800000, // 8 LPA
        packageCurrency: 'INR',
        joiningDate: new Date('2024-02-01'),
        placementType: 'full-time',
        courseSlug: courses[0].slug,
        courseName: courses[0].name,
        isVerified: true,
        verifiedBy: 'admin',
        verifiedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: studentIds[1].toString(),
        studentName: students[1].name,
        studentEmail: students[1].email,
        companyName: 'Infosys',
        jobTitle: 'Data Analyst',
        packageAmount: 650000, // 6.5 LPA
        packageCurrency: 'INR',
        joiningDate: new Date('2024-03-01'),
        placementType: 'full-time',
        courseSlug: courses[1].slug,
        courseName: courses[1].name,
        isVerified: true,
        verifiedBy: 'admin',
        verifiedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await db.collection('placements').insertMany(placements);
    console.log(`   ✅ Created ${placements.length} placements\n`);

    // Create a company user if none exists
    const companyExists = await db.collection('authusers').findOne({ role: 'COMPANY' });
    
    if (!companyExists) {
      console.log('🏢 Creating company user...');
      const companyUser = {
        name: 'Recruiter Demo',
        email: 'recruiter@adyapan.com',
        phone: '+91 9999999999',
        role: 'COMPANY',
        accountStatus: 'approved',
        isActive: true,
        companyName: 'Adyapan Recruiting',
        passwordHash: await bcrypt.hash('recruiter123', 10),
        authProvider: 'local',
        isEmailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await db.collection('authusers').insertOne(companyUser);
      console.log('   ✅ Created company user');
      console.log('   📧 Email: recruiter@adyapan.com');
      console.log('   🔑 Password: recruiter123\n');
    }

    console.log('═══════════════════════════════════════════════════════');
    console.log('✅ SAMPLE DATA SEEDED SUCCESSFULLY!');
    console.log('═══════════════════════════════════════════════════════\n');

    console.log('📊 Summary:');
    console.log(`   👥 Students: ${studentIds.length}`);
    console.log(`   📖 Enrollments: ${enrollments.length}`);
    console.log(`   📊 Progress: ${progressRecords.length}`);
    console.log(`   🎓 Certificates: ${certificates.length}`);
    console.log(`   💼 Placements: ${placements.length}`);
    console.log('');

    console.log('🚀 Next Steps:');
    console.log('   1. Login as: recruiter@adyapan.com / recruiter123');
    console.log('   2. Navigate to: /company/find-employee');
    console.log('   3. You should see the sample students!');
    console.log('');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

seedData();
