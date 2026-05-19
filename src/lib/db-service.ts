/**
 * Adyapan — Central Database Service
 * All critical DB operations go through here.
 * If a critical save fails, it throws — callers must handle.
 */

import { connectToDatabase } from '@/lib/mongodb';
import AuthUser from '@/models/AuthUser';
import Payment from '@/models/Payment';
import Enrollment from '@/models/Enrollment';
import Progress from '@/models/Progress';
import Certificate from '@/models/Certificate';
import EmailLog from '@/models/EmailLog';
import AdminActivityLog from '@/models/AdminActivityLog';
import Plan from '@/models/Plan';
import Course from '@/models/Course';
import { COURSE_CATALOGUE, withTotalLessons } from '@/lib/courseData';
import { PLAN_DATA } from '@/lib/planData';

/* ══════════════════════════════════════════════════════════════
   PLAN SEEDING
══════════════════════════════════════════════════════════════ */

export async function seedPlans(): Promise<void> {
  await connectToDatabase();
  for (const [id, p] of Object.entries(PLAN_DATA)) {
    await Plan.findOneAndUpdate(
      { planId: id },
      {
        $set: {
          planId:          id,
          planName:        p.label,
          displayName:     p.name,
          price:           p.price,
          originalPrice:   p.originalPrice,
          discountPercent: p.discount,
          duration:        p.duration,
          totalDays:       p.totalDays,
          benefits:        p.benefits,
          features:        p.benefits,
          isPopular:       !!p.badge,
          status:          'active',
        },
      },
      { upsert: true }
    );
  }
}

/* ══════════════════════════════════════════════════════════════
   PAYMENT FLOW
══════════════════════════════════════════════════════════════ */

export interface SavePaymentInput {
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  paymentId: string;
  orderId: string;
  courseSlug: string;
  courseName: string;
  planLabel: string;
  baseAmount: number;
  gstAmount: number;
  totalAmount: number;
  currency?: string;
  status: 'success' | 'failed' | 'pending';
  paymentMethod?: string;
  failureReason?: string;
  signatureVerified?: boolean;
  isTestMode?: boolean;
  paidAt?: Date;
}

/**
 * Save a payment record. Throws on failure — caller must handle.
 */
export async function savePayment(input: SavePaymentInput) {
  await connectToDatabase();

  // Idempotency: return existing if already saved
  const existing = await Payment.findOne({ paymentId: input.paymentId });
  if (existing) return existing;

  const payment = await Payment.create({
    userId:            input.userId,
    userName:          input.userName,
    userEmail:         input.userEmail.toLowerCase().trim(),
    userPhone:         input.userPhone || '',
    paymentId:         input.paymentId,
    orderId:           input.orderId,
    courseSlug:        input.courseSlug,
    courseName:        input.courseName,
    planLabel:         input.planLabel || '',
    baseAmount:        input.baseAmount,
    gstAmount:         input.gstAmount,
    totalAmount:       input.totalAmount,
    currency:          input.currency || 'INR',
    status:            input.status,
    paymentMethod:     input.paymentMethod || 'upi',
    failureReason:     input.failureReason || '',
    signatureVerified: input.signatureVerified ?? false,
    isTestMode:        input.isTestMode ?? false,
    paidAt:            input.paidAt || new Date(),
  });

  console.log(`[DB] ✅ Payment saved: ${payment.paymentId} | Status: ${payment.status} | ₹${payment.totalAmount}`);
  return payment;
}

/* ══════════════════════════════════════════════════════════════
   ENROLLMENT FLOW
══════════════════════════════════════════════════════════════ */

export interface CreateEnrollmentInput {
  userId: string;
  courseSlug: string;
  courseName: string;
  planId?: string;
  planLabel: string;
  amountPaid: number;
  paymentId: string;
  expiresAt?: Date;
}

/**
 * Create enrollment + seed course + init progress.
 * Idempotent — safe to call multiple times.
 */
export async function createEnrollmentWithProgress(input: CreateEnrollmentInput) {
  await connectToDatabase();

  // Idempotency check
  const existing = await Enrollment.findOne({ paymentId: input.paymentId });
  if (existing) {
    console.log(`[DB] Enrollment already exists for paymentId: ${input.paymentId}`);
    return { enrollment: existing, isNew: false };
  }

  // Ensure course exists in DB
  let course = await Course.findOne({ slug: input.courseSlug }).lean();
  if (!course) {
    const raw = COURSE_CATALOGUE.find(c => c.slug === input.courseSlug);
    if (raw) {
      const data = withTotalLessons(raw);
      course = await Course.findOneAndUpdate(
        { slug: data.slug },
        { $set: data },
        { upsert: true, new: true }
      ).lean();
    }
  }

  // Create enrollment
  const enrollment = await Enrollment.create({
    userId:           input.userId,
    courseSlug:       input.courseSlug,
    courseName:       input.courseName,
    planId:           input.planId || '',
    planLabel:        input.planLabel || '',
    amountPaid:       input.amountPaid,
    paymentId:        input.paymentId,
    enrollmentStatus: 'active',
    enrolledAt:       new Date(),
    expiresAt:        input.expiresAt,
  });

  // Initialize progress record
  await Progress.findOneAndUpdate(
    { userId: input.userId, courseSlug: input.courseSlug },
    {
      $setOnInsert: {
        completedLessons:   [],
        progressPercent:    0,
        totalLessons:       (course as any)?.totalLessons || 0,
        isCompleted:        false,
        lastAccessedAt:     new Date(),
      },
    },
    { upsert: true }
  );

  // Update user's enrolled courses list
  await AuthUser.findByIdAndUpdate(input.userId, {
    $addToSet: {
      purchasedCourses: input.courseName,
      enrolledCourses:  input.courseSlug,
    },
  });

  console.log(`[DB] ✅ Enrollment created: ${input.userId} → ${input.courseSlug}`);
  return { enrollment, isNew: true };
}

/* ══════════════════════════════════════════════════════════════
   PROGRESS UPDATE
══════════════════════════════════════════════════════════════ */

export interface UpdateProgressInput {
  userId: string;
  courseSlug: string;
  lessonId: string;
  moduleId?: string;
}

export interface UpdateProgressResult {
  progressPercent: number;
  completedLessons: string[];
  totalLessons: number;
  isCompleted: boolean;
  completedAt: Date | null;
  certificateGenerated: boolean;
  certificate: any | null;
}

/**
 * Mark a lesson complete, recalculate progress, auto-generate certificate at 100%.
 */
export async function updateProgress(
  input: UpdateProgressInput,
  userName: string,
  courseTitle?: string
): Promise<UpdateProgressResult> {
  await connectToDatabase();

  const course = await Course.findOne({ slug: input.courseSlug }).lean();
  const totalLessons = (course as any)?.totalLessons ?? 0;

  const progress = await Progress.findOneAndUpdate(
    { userId: input.userId, courseSlug: input.courseSlug },
    {
      $addToSet: { completedLessons: input.lessonId },
      $set: {
        lastAccessedLesson: input.lessonId,
        lastModuleId:       input.moduleId ?? '',
        totalLessons,
        lastAccessedAt:     new Date(),
      },
    },
    { upsert: true, new: true }
  );

  const pct = totalLessons > 0
    ? Math.round((progress.completedLessons.length / totalLessons) * 100)
    : 0;

  progress.progressPercent = pct;

  let certificateGenerated = false;
  let certificate = null;

  if (pct === 100 && !progress.completedAt) {
    progress.completedAt = new Date();
    progress.isCompleted = true;

    // Mark enrollment as completed
    await Enrollment.findOneAndUpdate(
      { userId: input.userId, courseSlug: input.courseSlug, enrollmentStatus: 'active' },
      { $set: { enrollmentStatus: 'completed', completedAt: new Date() } }
    );

    // Generate certificate if not already issued
    const existing = await Certificate.findOne({ userId: input.userId, courseSlug: input.courseSlug });
    if (!existing) {
      const certId = generateCertificateId();
      const courseName = courseTitle || (course as any)?.title || input.courseSlug;

      certificate = await Certificate.create({
        userId:          input.userId,
        courseSlug:      input.courseSlug,
        certificateType: 'course_completion',
        certificateId:   certId,
        studentName:     userName,
        courseName,
        issuedAt:        new Date(),
        status:          'ready',
        certificateUrl:  `/api/certificates/${input.courseSlug}/download`,
        emailSent:       false,
      });

      certificateGenerated = true;
      console.log(`[DB] ✅ Certificate generated: ${certId} for ${userName}`);
    } else {
      certificate = existing;
    }
  }

  await progress.save();

  return {
    progressPercent:  pct,
    completedLessons: progress.completedLessons,
    totalLessons,
    isCompleted:      pct === 100,
    completedAt:      progress.completedAt ?? null,
    certificateGenerated,
    certificate: certificate
      ? {
          certificateId: certificate.certificateId,
          studentName:   certificate.studentName,
          courseName:    certificate.courseName,
          issuedAt:      certificate.issuedAt,
          status:        certificate.status,
          downloadUrl:   `/api/certificates/${input.courseSlug}/download`,
        }
      : null,
  };
}

/* ══════════════════════════════════════════════════════════════
   EMAIL LOG
══════════════════════════════════════════════════════════════ */

export interface LogEmailInput {
  userId?: string;
  email: string;
  emailType: 'payment_success' | 'payment_failed' | 'certificate_ready' | 'welcome' | 'course_completion' | 'password_reset' | 'enrollment_confirmation';
  subject: string;
  status: 'sent' | 'failed';
  provider?: string;
  providerResponse?: string;
  errorMessage?: string;
  paymentId?: string;
  orderId?: string;
  courseSlug?: string;
  courseName?: string;
  certificateId?: string;
  amount?: number;
}

export async function logEmail(input: LogEmailInput) {
  try {
    await connectToDatabase();
    const log = await EmailLog.create({
      userId:           input.userId || '',
      email:            input.email.toLowerCase().trim(),
      emailType:        input.emailType,
      subject:          input.subject,
      status:           input.status,
      provider:         input.provider || 'sendgrid',
      providerResponse: input.providerResponse || '',
      errorMessage:     input.errorMessage || '',
      paymentId:        input.paymentId || '',
      orderId:          input.orderId || '',
      courseSlug:       input.courseSlug || '',
      courseName:       input.courseName || '',
      certificateId:    input.certificateId || '',
      amount:           input.amount || 0,
      retryCount:       0,
    });
    return log;
  } catch (err: any) {
    // Email log failure is non-fatal — just warn
    console.warn('[DB] EmailLog save failed:', err?.message);
    return null;
  }
}

/**
 * Check if an email of a given type was already sent (deduplication).
 */
export async function wasEmailSent(
  field: 'paymentId' | 'userId',
  value: string,
  emailType: string
): Promise<boolean> {
  await connectToDatabase();
  const existing = await EmailLog.findOne({
    [field]: value,
    emailType,
    status: 'sent',
  });
  return !!existing;
}

/* ══════════════════════════════════════════════════════════════
   ADMIN ACTIVITY LOG
══════════════════════════════════════════════════════════════ */

export interface LogAdminActivityInput {
  adminId: string;
  adminEmail: string;
  actionType: string;
  description: string;
  targetUserId?: string;
  targetUserEmail?: string;
  targetCourseId?: string;
  targetPaymentId?: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

export async function logAdminActivity(input: LogAdminActivityInput) {
  try {
    await connectToDatabase();
    await AdminActivityLog.create({
      adminId:         input.adminId,
      adminEmail:      input.adminEmail,
      actionType:      input.actionType,
      description:     input.description,
      targetUserId:    input.targetUserId || '',
      targetUserEmail: input.targetUserEmail || '',
      targetCourseId:  input.targetCourseId || '',
      targetPaymentId: input.targetPaymentId || '',
      metadata:        input.metadata || {},
      ipAddress:       input.ipAddress || '',
      userAgent:       input.userAgent || '',
    });
  } catch (err: any) {
    // Activity log failure is non-fatal
    console.warn('[DB] AdminActivityLog save failed:', err?.message);
  }
}

/* ══════════════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════════════ */

export function generateCertificateId(): string {
  const year = new Date().getFullYear();
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ADYP-${year}-${rand}`;
}
