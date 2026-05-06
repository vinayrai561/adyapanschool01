/**
 * POST /api/payment/verify
 * 
 * Verifies payment signature and saves payment record
 * THIS IS THE MOST CRITICAL SECURITY ENDPOINT
 * 
 * SECURITY:
 * - Verifies HMAC SHA256 signature server-side (NEVER trust frontend)
 * - Handles duplicate payments (idempotency)
 * - Saves payment record to database
 * - Enrolls user in course
 * - Sends confirmation email
 * 
 * Request body:
 * {
 *   razorpay_order_id: 'order_XXXXX',
 *   razorpay_payment_id: 'pay_XXXXX',
 *   razorpay_signature: 'signature_hash',
 *   customerName: 'John Doe',
 *   customerEmail: 'john@example.com',
 *   customerPhone: '9876543210',
 *   planName: 'Adyapan Career Pro',
 *   planLabel: 'Career Pro Plan',
 *   grandTotal: 17700,
 *   planKey: 'plan-4-premium'
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/mongodb';
import { sendPaymentNotifications } from '@/lib/notifications';
import { sendPaymentSuccessEmail } from '@/lib/email';
import Payment from '@/models/Payment';
import Enrollment from '@/models/Enrollment';
import Progress from '@/models/Progress';
import Course from '@/models/Course';
import AuthUser from '@/models/AuthUser';
import EmailLog from '@/models/EmailLog';
import { COURSE_CATALOGUE, withTotalLessons } from '@/lib/courseData';

const GST_RATE = 0.18;

const PLAN_SLUGS: Record<string, string> = {
  'plan-1': 'Adyapan Starter',
  'plan-2': 'Adyapan Standard',
  'plan-3': 'Adyapan Professional',
  'plan-4-premium': 'Adyapan Career Pro',
};

/**
 * Verify payment signature using HMAC SHA256
 * This is the most critical security function
 */
function verifySignature(orderId: string, paymentId: string, signature: string): boolean {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    throw new Error('RAZORPAY_KEY_SECRET not configured');
  }

  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(body)
    .digest('hex');

  return expectedSignature === signature;
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      customerName,
      customerEmail,
      customerPhone,
      planName,
      planLabel,
      grandTotal,
      planKey,
      paymentMethod = 'upi',
    } = await req.json();

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !customerName || !customerEmail) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    let testMode = false;

    // SECURITY: Verify signature server-side (NEVER trust frontend)
    try {
      const isValid = verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
      if (!isValid) {
        console.warn(
          `[Payment] ❌ INVALID SIGNATURE - Order: ${razorpay_order_id} | Payment: ${razorpay_payment_id}`
        );
        return NextResponse.json(
          { success: false, error: 'Payment verification failed - invalid signature' },
          { status: 400 }
        );
      }
    } catch (error: any) {
      console.error('[Payment] Signature verification error:', error?.message);
      return NextResponse.json(
        { success: false, error: 'Signature verification failed' },
        { status: 500 }
      );
    }

    // SECURITY: Check for duplicate payment (idempotency)
    const existingPayment = await Payment.findOne({ paymentId: razorpay_payment_id });
    if (existingPayment) {
      console.log(
        `[Payment] ⚠️ Duplicate payment detected: ${razorpay_payment_id} - Returning cached success`
      );
      return NextResponse.json({
        success: true,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        duplicate: true,
      });
    }

    // Get user from JWT token
    const token = req.cookies.get('authToken')?.value;
    let userId = '';
    let userName = customerName;
    let userEmail = customerEmail;
    let userPhone = customerPhone;

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as {
          userId: string;
        };
        userId = decoded.userId;

        // Fetch latest user data
        const dbUser = await AuthUser.findById(userId).lean();
        if (dbUser) {
          userName = (dbUser as any).name || userName;
          userEmail = (dbUser as any).email || userEmail;
          userPhone = (dbUser as any).phone || userPhone;
        }
      } catch {
        // Token invalid - continue without userId
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
    const payment = await Payment.create({
      userId,
      userName,
      userEmail: userEmail.toLowerCase().trim(),
      userPhone,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      courseSlug,
      courseName,
      planLabel: planLabel || '',
      baseAmount: base,
      gstAmount: gst,
      totalAmount: total,
      currency: 'INR',
      status: 'success',
      paymentMethod: paymentMethod || 'upi',
      signatureVerified: !testMode,
      isTestMode: testMode,
      paidAt: now,
    });

    console.log(
      `[Payment] ✅ Payment saved - ID: ${payment._id} | Email: ${userEmail} | Amount: ₹${total}`
    );

    // Enroll user in course
    if (userId) {
      try {
        const existingEnrollment = await Enrollment.findOne({ paymentId: razorpay_payment_id });
        if (!existingEnrollment) {
          await Enrollment.create({
            userId,
            courseSlug,
            courseName,
            planLabel: planLabel || '',
            amountPaid: total,
            paymentId: razorpay_payment_id,
            enrolledAt: now,
          });

          // Ensure course exists
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

          // Initialize progress
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

          // Add to user's purchased courses
          await AuthUser.findByIdAndUpdate(userId, { $addToSet: { purchasedCourses: courseName } });

          console.log(`[Enrollment] ✅ ${userName} enrolled in ${courseSlug}`);
        }
      } catch (enrollmentError: any) {
        console.warn('[Enrollment] Error:', enrollmentError?.message);
      }
    }

    // Send email notifications (SendGrid + fallback Gmail)
    if (userEmail && userName) {
      // Prevent duplicate emails
      const alreadySent = await EmailLog.findOne({ paymentId: razorpay_payment_id, type: 'payment_success', status: 'sent' });

      if (!alreadySent) {
        let emailStatus: 'sent' | 'failed' = 'failed';
        let errorMessage = '';

        try {
          // Try SendGrid first
          const sent = await sendPaymentSuccessEmail({
            name: userName,
            email: userEmail,
            courseName,
            courseSlug,
            planLabel: planLabel || '',
            amount: total,
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
          });

          if (sent) {
            emailStatus = 'sent';
          } else {
            // Fallback to Gmail/Nodemailer
            await sendPaymentNotifications({
              name: userName,
              email: userEmail,
              phone: userPhone,
              planName: courseName,
              planLabel: planLabel || '',
              amount: total,
              paymentId: razorpay_payment_id,
              orderId: razorpay_order_id,
              testMode,
            });
            emailStatus = 'sent';
          }
        } catch (e: any) {
          errorMessage = e?.message || 'Unknown error';
          console.error('[Email] Error:', errorMessage);
        }

        // Log email attempt
        await EmailLog.create({
          userId,
          email: userEmail,
          type: 'payment_success',
          status: emailStatus,
          paymentId: razorpay_payment_id,
          orderId: razorpay_order_id,
          courseName,
          amount: total,
          errorMessage,
        }).catch(e => console.warn('[EmailLog] Save error:', e?.message));

        console.log(`[Email] Status: ${emailStatus} | To: ${userEmail}`);
      } else {
        console.log(`[Email] Already sent for ${razorpay_payment_id} — skipping`);
      }
    }

    return NextResponse.json({
      success: true,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      testMode,
    });
  } catch (error: any) {
    console.error('[Payment] Verify error:', error?.message);
    return NextResponse.json(
      { success: false, error: 'Payment verification failed' },
      { status: 500 }
    );
  }
}
