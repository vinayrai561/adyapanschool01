/**
 * Seed Student Data Script
 * 
 * This script creates test students with:
 * - Course purchases (Enrollments)
 * - Course progress
 * - Certificates for completed courses
 * 
 * Usage:
 *   npx ts-node scripts/seed-student-data.ts
 * 
 * Or add to package.json:
 *   "seed:students": "ts-node scripts/seed-student-data.ts"
 */

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/adyapan';

// Models (inline schemas for standalone script)
const AuthUserSchema = new mongoose.Schema({
  name: String,
  email: String,
  passwordHash: String,
  role: String,
  accountStatus: String,
  phone: String,
  avatar: String,
  selectedProgram: String,
  purchasedCourses: [String],
  enrolledCourses: [String],
  isActive: Boolean,
  isEmailVerified: Boolean,
  createdAt: Date,
  updatedAt: Date,
}, { timestamps: true });

const EnrollmentSchema = new mongoose.Schema({
  userId: String,
  courseSlug: String,
  courseName: String,
  planId: String,
  planLabel: String,
  amountPaid: Number,
  paymentId: String,
  enrollmentStatus: String,
  enrolledAt: Date,
  completedAt: Date,
}, { timestamps: true });

const ProgressSchema = new mongoose.Schema({
  userId: String,
  courseSlug: String,
  completedLessons: [String],
  progressPercent: Number,
  totalLessons: Number,
  isCompleted: Boolean,
  completedAt: Date,
  lastAccessedAt: Date,
}, { timestamps: true });

const CertificateSchema = new mongoose.Schema({
  userId: String,
  courseSlug: String,
  certificateType: String,
  certificateId: String,
  studentName: String,
  courseName: String,
  issuedAt: Date,
  certificateUrl: String,
  status: String,
  emailSent: Boolean,
}, { timestamps: true });

const PaymentSchema = new mongoose.Schema({
  userId: String,
  userName: String,
  userEmail: String,
  userPhone: String,
  paymentId: String,
  orderId: String,
  courseSlug: String,
  courseName: String,
  planLabel: String,
  baseAmount: Number,
  gstAmount: Number,
  totalAmount: Number,
  currency: String,
  status: String,
  paymentMethod: String,
  paidAt: Date,
}, { timestamps: true });

// Sample data
const COURSES = [
  { slug: 'plan-1', name: 'Adyapan Starter', totalLessons: 20 },
  { slug: 'plan-2', name: 'Adyapan Standard', totalLessons: 30 },
  { slug: 'plan-3', name: 'Adyapan Professional', totalLessons: 40 },
  { slug: 'plan-4-premium', name: 'Adyapan Career Pro', totalLessons: 50 },
];

const EDUCATION_LEVELS = ['B.Tech', 'M.Tech', 'B.Sc', 'MCA', 'MBA', 'BCA'];

const SAMPLE_STUDENTS = [
  { name: 'Rupesh Kumar', email: 'rupesh.rupak@example.com', phone: '8292244709', education: 'B.Tech' },
  { name: 'Ruku rupak', email: 'ruku.rupesh@example.com', phone: '923622259', education: 'M.Tech' },
  { name: 'Amit Kumar', email: 'amit.kumar@example.com', phone: '9876543212', education: 'B.Sc' },
  { name: 'Sneha Reddy', email: 'sneha.reddy@example.com', phone: '9876543213', education: 'MCA' },
  { name: 'Vikram Singh', email: 'vikram.singh@example.com', phone: '9876543214', education: 'B.Tech' },
  { name: 'Anjali Gupta', email: 'anjali.gupta@example.com', phone: '9876543215', education: 'MBA' },
  { name: 'Rohan Verma', email: 'rohan.verma@example.com', phone: '9876543216', education: 'BCA' },
  { name: 'Kavya Iyer', email: 'kavya.iyer@example.com', phone: '9876543217', education: 'B.Tech' },
  { name: 'Arjun Nair', email: 'arjun.nair@example.com', phone: '9876543218', education: 'M.Tech' },
  { name: 'Divya Menon', email: 'divya.menon@example.com', phone: '9876543219', education: 'B.Sc' },
];

async function seedStudentData() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const AuthUser = mongoose.models.AuthUser || mongoose.model('AuthUser', AuthUserSchema);
    const Enrollment = mongoose.models.Enrollment || mongoose.model('Enrollment', EnrollmentSchema);
    const Progress = mongoose.models.Progress || mongoose.model('Progress', ProgressSchema);
    const Certificate = mongoose.models.Certificate || mongoose.model('Certificate', CertificateSchema);
    const Payment = mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);

    console.log('\n📊 Starting data seeding...\n');

    const defaultPassword = await bcrypt.hash('Test@123', 10);

    for (const studentData of SAMPLE_STUDENTS) {
      // Check if student already exists
      const existingUser = await AuthUser.findOne({ email: studentData.email });
      if (existingUser) {
        console.log(`⏭️  Skipping ${studentData.name} - already exists`);
        continue;
      }

      // Create student user
      const student = await AuthUser.create({
        name: studentData.name,
        email: studentData.email,
        passwordHash: defaultPassword,
        role: 'STUDENT',
        accountStatus: 'approved',
        phone: studentData.phone,
        avatar: '',
        selectedProgram: studentData.education,
        purchasedCourses: [],
        enrolledCourses: [],
        isActive: true,
        isEmailVerified: true,
        createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000), // Random date in last 90 days
      });

      console.log(`✅ Created student: ${student.name} (${student.email})`);

      // Randomly assign 1-3 courses
      const numCourses = Math.floor(Math.random() * 3) + 1;
      const selectedCourses = COURSES.sort(() => 0.5 - Math.random()).slice(0, numCourses);

      for (const course of selectedCourses) {
        const enrolledDate = new Date(student.createdAt.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000);
        const paymentId = `pay_test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const orderId = `order_test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const amount = 5000 + Math.floor(Math.random() * 15000); // ₹5000-₹20000

        // Create payment record
        await Payment.create({
          userId: student._id.toString(),
          userName: student.name,
          userEmail: student.email,
          userPhone: student.phone,
          paymentId,
          orderId,
          courseSlug: course.slug,
          courseName: course.name,
          planLabel: course.name,
          baseAmount: amount * 0.85,
          gstAmount: amount * 0.15,
          totalAmount: amount,
          currency: 'INR',
          status: 'success',
          paymentMethod: 'upi',
          paidAt: enrolledDate,
        });

        // Determine if course is completed (70% chance)
        const isCompleted = Math.random() > 0.3;
        const progressPercent = isCompleted ? 100 : Math.floor(Math.random() * 80) + 10;
        const completedLessons = Math.floor((progressPercent / 100) * course.totalLessons);

        // Create enrollment
        const enrollment = await Enrollment.create({
          userId: student._id.toString(),
          courseSlug: course.slug,
          courseName: course.name,
          planId: course.slug,
          planLabel: course.name,
          amountPaid: amount,
          paymentId,
          enrollmentStatus: isCompleted ? 'completed' : 'active',
          enrolledAt: enrolledDate,
          completedAt: isCompleted ? new Date(enrolledDate.getTime() + 60 * 24 * 60 * 60 * 1000) : undefined,
        });

        // Create progress
        await Progress.create({
          userId: student._id.toString(),
          courseSlug: course.slug,
          completedLessons: Array.from({ length: completedLessons }, (_, i) => `lesson-${i + 1}`),
          progressPercent,
          totalLessons: course.totalLessons,
          isCompleted,
          completedAt: isCompleted ? enrollment.completedAt : undefined,
          lastAccessedAt: new Date(),
        });

        // Create certificate if completed
        if (isCompleted) {
          const certificateId = `ADYP-2024-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
          await Certificate.create({
            userId: student._id.toString(),
            courseSlug: course.slug,
            certificateType: 'course_completion',
            certificateId,
            studentName: student.name,
            courseName: course.name,
            issuedAt: enrollment.completedAt,
            certificateUrl: `/certificates/${certificateId}.pdf`,
            status: 'ready',
            emailSent: true,
          });
          console.log(`   📜 Certificate issued: ${certificateId}`);
        }

        console.log(`   📚 Enrolled in: ${course.name} (${progressPercent}% complete)`);
      }

      // Update student's purchased courses
      await AuthUser.findByIdAndUpdate(student._id, {
        $set: {
          purchasedCourses: selectedCourses.map(c => c.name),
          enrolledCourses: selectedCourses.map(c => c.slug),
        },
      });

      console.log('');
    }

    console.log('✅ Data seeding completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   Students created: ${SAMPLE_STUDENTS.length}`);
    console.log(`   Default password: Test@123`);
    console.log('\n🎯 You can now view these students in the recruiter dashboard!');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the seeding function
seedStudentData();
