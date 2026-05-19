/**
 * GET /api/payment/check-status
 * 
 * Checks payment status for UPI polling
 * Used by frontend to poll for payment confirmation
 * 
 * SECURITY:
 * - Checks database first (fast path)
 * - Falls back to Razorpay API for live mode
 * - Handles test mode gracefully
 * 
 * Query params:
 * - orderId: Razorpay order ID
 * - name: Customer name
 * - email: Customer email
 * - phone: Customer phone
 * - planName: Plan name
 * - planLabel: Plan label
 * - planKey: Plan key
 * - grandTotal: Total amount
 */

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/mongodb';
import { requireJwtSecret } from '@/lib/security';
import { sendPaymentNotifications } from '@/lib/notifications';
import Payment from '@/models/Payment';
import Enrollment from '@/models/Enrollment';
import Progress from '@/models/Progress';
import Course from '@/models/Course';
import AuthUser from '@/models/AuthUser';
import { COURSE_CATALOGUE, withTotalLessons } from '@/lib/courseData';

const GST_RATE = 0.18;

const PLAN_SLUGS: Record<string, string> = {
  'plan-1': 'Adyapan Starter',
  'plan-2': 'Adyapan Standard',
  'plan-3': 'Adyapan Professional',
  'plan-4-premium': 'Adyapan Career Pro',
};

/**
 * Helper function to save payment and enroll user
 */
async function savePaymentAndEnroll(
  req: NextRequest,
  paymentId: string,
  orderId: string,
  planKey: string,
  planName: string,
  planLabel: string,
  grandTotal: number,
  testMode: boolean,
  customerName: string,
  customerEmail: string,
  customerPhone: string
) {
  const token = req.cookies.get('authToken')?.value;
  let userId = '';
  let userName = customerName;
  let userEmail = customerEmail;
  let userPhone = customerPhone;

  if (token) {
    try {
      const decoded = jwt.verify(token, requireJwtSecret()) as {
        userId: string;
      };
      userId = decoded.userId;

      const dbUser = await AuthUser.findById(userId).lean();
      if (dbUser) {
        userName = (dbUser as any).name || userName;
        userEmail = (dbUser as any).email || userEmail;
        userPhone = (dbUser as any).phone || userPhone;
      }
    } catch {
      // Continue without userId
    }
  }

  const courseSlug =
    planKey ||
    Object.keys(PLAN_SLUGS).find((k) => PLAN_SLUGS[k] === planName) ||
    'plan-4-premium';
  const courseName = PLAN_SLUGS[courseSlug] || planName || 'Adyapan Course';

  const total = Number(grandTotal) || 0;
  const base = parseFloat((total / (1 + GST_RATE)).toFixed(2));
  const gst = parseFloat((total - base).toFixed(2));
  const now = new Date();

  // Save Payment record
  const existingPayment = await Payment.findOne({ paymentId });
  if (!existingPayment) {
    await Payment.create({
      userId,
      userName,
      userEmail: userEmail.toLowerCase().trim(),
      userPhone,
      paymentId,
      orderId,
      courseSlug,
      courseName,
      planLabel: planLabel || '',
      baseAmount: base,
      gstAmount: gst,
      totalAmount: total,
      currency: 'INR',
      status: 'success',
      paymentMethod: 'upi',
      signatureVerified: !testMode,
      isTestMode: testMode,
      paidAt: now,
    });

    console.log(
      `[Payment] ✅ Payment saved via polling - ID: ${paymentId} | Email: ${userEmail} | Amount: ₹${total}`
    );
  }

  // Enroll user
  if (userId) {
    const existingEnrollment = await Enrollment.findOne({ paymentId });
    if (!existingEnrollment) {
      await Enrollment.create({
        userId,
        courseSlug,
        courseName,
        planLabel: planLabel || '',
        amountPaid: total,
        paymentId,
        enrolledAt: now,
      });

      let course = await Course.findOne({ slug: courseSlug }).lean();
      if (!course) {
        const raw = COURSE_CATALOGUE.find((c) => c.slug === courseSlug);
        if (raw) {
          const data = withTotalLessons(raw);
          course = await Course.findOneAndUpdate(
            { slug: data.slug },
            { $set: data },
            { upsert: true, new: true }
          ).lean();
        }
      }

      await Progress.findOneAndUpdate(
        { userId, courseSlug },
        {
          $setOnInsert: {
            completedLessons: [],
            progressPercent: 0,
            totalLessons: (course as any)?.totalLessons || 0,
          },
        },
        { upsert: true }
      );

      await AuthUser.findByIdAndUpdate(userId, { $addToSet: { purchasedCourses: courseName } });

      console.log(`[Enrollment] ✅ ${userName} enrolled in ${courseSlug} via polling`);
    }
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get('orderId') || '';
  const name = searchParams.get('name') || '';
  const email = searchParams.get('email') || '';
  const phone = searchParams.get('phone') || '';
  const planName = searchParams.get('planName') || '';
  const planLabel = searchParams.get('planLabel') || '';
  const planKey = searchParams.get('planKey') || '';
  const grandTotal = parseFloat(searchParams.get('grandTotal') || '0');

  if (!orderId) {
    return NextResponse.json(
      { paid: false, error: 'orderId is required' },
      { status: 400 }
    );
  }

  try {
    await connectToDatabase();

    // Check if payment already exists in database (fast path)
    const existingPayment = await Payment.findOne({ orderId });
    if (existingPayment && existingPayment.status === 'success') {
      console.log(`[Payment] Status check - Payment found: ${existingPayment.paymentId}`);
      return NextResponse.json({
        paid: true,
        paymentId: existingPayment.paymentId,
        orderId,
      });
    }

    // LIVE MODE: Check with Razorpay API
    try {
      const Razorpay = (await import('razorpay')).default;
      const rzp = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID!,
        key_secret: process.env.RAZORPAY_KEY_SECRET!,
      });

      const order = await (rzp.orders as any).fetchPayments(orderId);
      const payments: any[] = order?.items || [];
      const capturedPayment = payments.find((p) => p.status === 'captured');

      if (capturedPayment) {
        await savePaymentAndEnroll(
          req,
          capturedPayment.id,
          orderId,
          planKey,
          planName,
          planLabel,
          grandTotal,
          false,
          name,
          email,
          phone
        );

        if (email && name) {
          sendPaymentNotifications({
            name,
            email,
            phone,
            planName,
            planLabel,
            amount: grandTotal,
            paymentId: capturedPayment.id,
            orderId,
            testMode: false,
          }).catch((err) => console.error('[Notify]', err));
        }

        console.log(`[Payment] Status check - Captured payment found: ${capturedPayment.id}`);
        return NextResponse.json({
          paid: true,
          paymentId: capturedPayment.id,
          orderId,
        });
      }

      return NextResponse.json({ paid: false, orderId });
    } catch (razorpayError: any) {
      console.error('[Payment] Razorpay API error during status check:', razorpayError?.message);
      return NextResponse.json(
        { paid: false, orderId, error: 'Status check failed' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('[Payment] checkPaymentStatus error:', error?.message);
    return NextResponse.json(
      { success: false, error: 'Status check failed' },
      { status: 500 }
    );
  }
}
