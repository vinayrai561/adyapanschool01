/**
 * POST /api/payment/webhook
 *
 * Razorpay Webhook — source of truth for payment events
 *
 * Events handled:
 *   payment.captured  → success flow
 *   payment.failed    → failure flow
 *
 * Security:
 *   - Verifies X-Razorpay-Signature using HMAC SHA256
 *   - Idempotent: skips if paymentId already processed
 *   - Never trusts frontend — webhook is the authoritative source
 *
 * Setup in Razorpay Dashboard:
 *   Webhook URL: https://yourdomain.com/api/payment/webhook
 *   Secret: set RAZORPAY_WEBHOOK_SECRET in .env
 *   Events: payment.captured, payment.failed
 */

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectToDatabase } from '@/lib/mongodb';
import Payment from '@/models/Payment';
import Enrollment from '@/models/Enrollment';
import Progress from '@/models/Progress';
import Course from '@/models/Course';
import AuthUser from '@/models/AuthUser';
import EmailLog from '@/models/EmailLog';
import { sendPaymentSuccessEmail, sendPaymentFailureEmail } from '@/lib/email';
import { COURSE_CATALOGUE, withTotalLessons } from '@/lib/courseData';

const GST_RATE = 0.18;

const PLAN_SLUGS: Record<string, string> = {
  'plan-1': 'Adyapan Starter',
  'plan-2': 'Adyapan Standard',
  'plan-3': 'Adyapan Professional',
  'plan-4-premium': 'Adyapan Career Pro',
};

/* ── Verify webhook signature ── */
function verifyWebhookSignature(body: string, signature: string): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    console.warn('[Webhook] RAZORPAY_WEBHOOK_SECRET not set — skipping signature check');
    return true; // allow in dev if not configured
  }
  const expected = crypto.createHmac('sha256', secret).update(body).digest('hex');
  return expected === signature;
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get('x-razorpay-signature') || '';

  // Verify webhook authenticity
  if (!verifyWebhookSignature(rawBody, signature)) {
    console.warn('[Webhook] ❌ Invalid signature — rejected');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  let event: any;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const eventType: string = event.event;
  const paymentEntity = event.payload?.payment?.entity;

  if (!paymentEntity) {
    return NextResponse.json({ received: true });
  }

  await connectToDatabase();

  const paymentId = paymentEntity.id;
  const orderId   = paymentEntity.order_id;
  const amount    = (paymentEntity.amount || 0) / 100; // paise → rupees
  const email     = paymentEntity.email || '';
  const contact   = paymentEntity.contact || '';
  const notes     = paymentEntity.notes || {};
  const courseSlug = notes.plan || notes.courseSlug || 'plan-4-premium';
  const courseName = PLAN_SLUGS[courseSlug] || 'Adyapan Course';
  const planLabel  = notes.planLabel || courseName;

  console.log(`[Webhook] Event: ${eventType} | Payment: ${paymentId} | Order: ${orderId}`);

  /* ════════════════════════════════════════════════
     PAYMENT CAPTURED (SUCCESS)
  ════════════════════════════════════════════════ */
  if (eventType === 'payment.captured') {
    // Idempotency check
    const existing = await Payment.findOne({ paymentId });
    if (existing) {
      console.log(`[Webhook] Duplicate payment.captured for ${paymentId} — skipping`);
      return NextResponse.json({ received: true });
    }

    const base  = parseFloat((amount / (1 + GST_RATE)).toFixed(2));
    const gst   = parseFloat((amount - base).toFixed(2));
    const now   = new Date();

    // Find user by email
    const dbUser = await AuthUser.findOne({ email: email.toLowerCase() }).lean();
    const userId = (dbUser as any)?._id?.toString() || '';
    const userName = (dbUser as any)?.name || paymentEntity.name || 'Student';

    // Save payment
    await Payment.create({
      userId,
      userName,
      userEmail: email.toLowerCase(),
      userPhone: contact,
      paymentId,
      orderId,
      courseSlug,
      courseName,
      planLabel,
      baseAmount: base,
      gstAmount: gst,
      totalAmount: amount,
      currency: 'INR',
      status: 'success',
      paymentMethod: paymentEntity.method || 'upi',
      signatureVerified: true,
      isTestMode: false,
      paidAt: now,
    });

    console.log(`[Webhook] ✅ Payment saved: ${paymentId}`);

    // Enroll user
    if (userId) {
      try {
        const existingEnrollment = await Enrollment.findOne({ paymentId });
        if (!existingEnrollment) {
          await Enrollment.create({ userId, courseSlug, courseName, planLabel, amountPaid: amount, paymentId, enrolledAt: now });

          let course = await Course.findOne({ slug: courseSlug }).lean();
          if (!course) {
            const raw = COURSE_CATALOGUE.find(c => c.slug === courseSlug);
            if (raw) {
              const data = withTotalLessons(raw);
              course = await Course.findOneAndUpdate({ slug: data.slug }, { $set: data }, { upsert: true, new: true }).lean();
            }
          }

          await Progress.findOneAndUpdate(
            { userId, courseSlug },
            { $setOnInsert: { completedLessons: [], progressPercent: 0, totalLessons: (course as any)?.totalLessons || 0 } },
            { upsert: true }
          );

          await AuthUser.findByIdAndUpdate(userId, { $addToSet: { purchasedCourses: courseName } });
          console.log(`[Webhook] ✅ Enrolled ${userName} in ${courseSlug}`);
        }
      } catch (e: any) {
        console.warn('[Webhook] Enrollment error:', e?.message);
      }
    }

    // Send success email (prevent duplicate using EmailLog)
    const emailAlreadySent = await EmailLog.findOne({ paymentId, type: 'payment_success', status: 'sent' });
    if (!emailAlreadySent && email) {
      let emailStatus: 'sent' | 'failed' = 'failed';
      let errorMessage = '';

      try {
        const sent = await sendPaymentSuccessEmail({
          name: userName,
          email,
          courseName,
          courseSlug,
          planLabel,
          amount,
          paymentId,
          orderId,
        });
        emailStatus = sent ? 'sent' : 'failed';
        if (!sent) errorMessage = 'SendGrid returned non-202';
      } catch (e: any) {
        errorMessage = e?.message || 'Unknown error';
      }

      await EmailLog.create({
        userId,
        email,
        type: 'payment_success',
        status: emailStatus,
        paymentId,
        orderId,
        courseName,
        amount,
        errorMessage,
      });

      console.log(`[Webhook] Email ${emailStatus} for ${email}`);
    }

    return NextResponse.json({ received: true, status: 'success' });
  }

  /* ════════════════════════════════════════════════
     PAYMENT FAILED
  ════════════════════════════════════════════════ */
  if (eventType === 'payment.failed') {
    const failureReason = paymentEntity.error_description || paymentEntity.error_reason || 'Payment declined';

    // Save failed payment (allow duplicates for audit trail)
    const existingFailed = await Payment.findOne({ paymentId, status: 'failed' });
    if (!existingFailed) {
      await Payment.create({
        userEmail: email.toLowerCase(),
        userPhone: contact,
        paymentId: paymentId || `failed_${Date.now()}`,
        orderId,
        courseSlug,
        courseName,
        planLabel,
        baseAmount: amount,
        gstAmount: 0,
        totalAmount: amount,
        currency: 'INR',
        status: 'failed',
        paymentMethod: paymentEntity.method || 'upi',
        signatureVerified: false,
        isTestMode: false,
      });
      console.log(`[Webhook] ❌ Failed payment saved: ${paymentId}`);
    }

    // Send failure email (prevent duplicate)
    const emailAlreadySent = await EmailLog.findOne({ orderId, type: 'payment_failed', status: 'sent' });
    if (!emailAlreadySent && email) {
      const dbUser = await AuthUser.findOne({ email: email.toLowerCase() }).lean();
      const userName = (dbUser as any)?.name || paymentEntity.name || 'Student';
      const userId   = (dbUser as any)?._id?.toString() || '';

      let emailStatus: 'sent' | 'failed' = 'failed';
      let errorMessage = '';

      try {
        const sent = await sendPaymentFailureEmail({
          name: userName,
          email,
          courseName,
          courseSlug,
          planLabel,
          amount,
          orderId,
          failureReason,
        });
        emailStatus = sent ? 'sent' : 'failed';
        if (!sent) errorMessage = 'SendGrid returned non-202';
      } catch (e: any) {
        errorMessage = e?.message || 'Unknown error';
      }

      await EmailLog.create({
        userId,
        email,
        type: 'payment_failed',
        status: emailStatus,
        paymentId: paymentId || '',
        orderId,
        courseName,
        amount,
        errorMessage,
      });

      console.log(`[Webhook] Failure email ${emailStatus} for ${email}`);
    }

    return NextResponse.json({ received: true, status: 'failed' });
  }

  // Unhandled event — acknowledge receipt
  return NextResponse.json({ received: true });
}
