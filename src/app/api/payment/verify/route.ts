/**
 * POST /api/payment/verify
 *
 * Verifies Razorpay payment signature and persists the full payment flow:
 *   1. Verify HMAC SHA256 signature (NEVER trust frontend)
 *   2. Idempotency check
 *   3. Save Payment record (critical — throws on failure)
 *   4. Create Enrollment + init Progress (critical)
 *   5. Send success email + save EmailLog
 *
 * If any critical DB save fails → return 500, do NOT return success.
 */

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/mongodb';
import { requireJwtSecret, sanitizeMongoInput } from '@/lib/security';
import {
  savePayment,
  createEnrollmentWithProgress,
  logEmail,
  wasEmailSent,
} from '@/lib/db-service';
import { sendPaymentSuccessEmail, sendPaymentFailureEmail } from '@/lib/email';
import { sendPaymentNotifications } from '@/lib/notifications';
import Payment from '@/models/Payment';
import AuthUser from '@/models/AuthUser';

const GST_RATE = 0.18;

const PLAN_SLUGS: Record<string, string> = {
  'plan-1':         'Adyapan Starter',
  'plan-2':         'Adyapan Standard',
  'plan-3':         'Adyapan Professional',
  'plan-4-premium': 'Adyapan Career Pro',
};

function verifySignature(orderId: string, paymentId: string, signature: string): boolean {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) throw new Error('RAZORPAY_KEY_SECRET not configured');
  const body = `${orderId}|${paymentId}`;
  const expected = crypto.createHmac('sha256', keySecret).update(body).digest('hex');
  return expected === signature;
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = sanitizeMongoInput(await req.json());
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
    } = body;

    // ── Validate required fields ──
    if (!razorpay_order_id || !razorpay_payment_id || !customerEmail) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // ── Idempotency: already processed? ──
    const existingPayment = await Payment.findOne({ paymentId: razorpay_payment_id });
    if (existingPayment) {
      console.log(`[Payment] Duplicate: ${razorpay_payment_id} — returning cached success`);
      return NextResponse.json({ success: true, paymentId: razorpay_payment_id, orderId: razorpay_order_id, duplicate: true });
    }

    // ── SECURITY: Verify signature ──
    let signatureValid = false;
    try {
      signatureValid = verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    } catch (err: any) {
      console.error('[Payment] Signature check error:', err?.message);
      return NextResponse.json({ success: false, error: 'Signature verification failed' }, { status: 500 });
    }

    if (!signatureValid) {
      console.warn(`[Payment] ❌ INVALID SIGNATURE — Order: ${razorpay_order_id} | Payment: ${razorpay_payment_id}`);

      // Save failed payment attempt for audit
      const courseSlug = planKey || 'plan-4-premium';
      const courseName = PLAN_SLUGS[courseSlug] || planName || 'Adyapan Course';
      const total = Number(grandTotal) || 0;
      await savePayment({
        userId: '', userName: customerName || '', userEmail: customerEmail || '',
        userPhone: customerPhone || '', paymentId: razorpay_payment_id,
        orderId: razorpay_order_id, courseSlug, courseName, planLabel: planLabel || '',
        baseAmount: total, gstAmount: 0, totalAmount: total,
        status: 'failed', failureReason: 'Invalid signature',
        signatureVerified: false, isTestMode: false,
      }).catch(e => console.warn('[Payment] Failed payment save error:', e?.message));

      return NextResponse.json({ success: false, error: 'Payment verification failed — invalid signature' }, { status: 400 });
    }

    // ── Resolve user from JWT ──
    const token = req.cookies.get('authToken')?.value;
    let userId = '';
    let userName = customerName || '';
    let userEmail = customerEmail || '';
    let userPhone = customerPhone || '';

    if (token) {
      try {
        const decoded = jwt.verify(token, requireJwtSecret()) as { userId: string };
        userId = decoded.userId;
        const dbUser = await AuthUser.findById(userId).lean();
        if (dbUser) {
          userName  = (dbUser as any).name  || userName;
          userEmail = (dbUser as any).email || userEmail;
          userPhone = (dbUser as any).phone || userPhone;
        }
      } catch { /* continue without userId */ }
    }

    const courseSlug = planKey || Object.keys(PLAN_SLUGS).find(k => PLAN_SLUGS[k] === planName) || 'plan-4-premium';
    const courseName = PLAN_SLUGS[courseSlug] || planName || 'Adyapan Course';
    const total  = Number(grandTotal) || 0;
    const base   = parseFloat((total / (1 + GST_RATE)).toFixed(2));
    const gst    = parseFloat((total - base).toFixed(2));

    // ── CRITICAL: Save payment (throws on failure) ──
    const payment = await savePayment({
      userId, userName, userEmail, userPhone,
      paymentId: razorpay_payment_id, orderId: razorpay_order_id,
      courseSlug, courseName, planLabel: planLabel || '',
      baseAmount: base, gstAmount: gst, totalAmount: total,
      status: 'success', paymentMethod,
      signatureVerified: true, isTestMode: false,
      paidAt: new Date(),
    });

    // ── CRITICAL: Create enrollment + progress (if user is logged in) ──
    if (userId) {
      await createEnrollmentWithProgress({
        userId, courseSlug, courseName,
        planId:    courseSlug,
        planLabel: planLabel || '',
        amountPaid: total,
        paymentId: razorpay_payment_id,
      });
    }

    // ── Send success email (non-critical, but logged) ──
    if (userEmail && userName) {
      const alreadySent = await wasEmailSent('paymentId', razorpay_payment_id, 'payment_success');

      if (!alreadySent) {
        let emailStatus: 'sent' | 'failed' = 'failed';
        let errorMessage = '';
        let provider = 'sendgrid';

        try {
          const sent = await sendPaymentSuccessEmail({
            name: userName, email: userEmail, courseName, courseSlug,
            planLabel: planLabel || '', amount: total,
            paymentId: razorpay_payment_id, orderId: razorpay_order_id,
          });

          if (sent) {
            emailStatus = 'sent';
          } else {
            // Fallback to Nodemailer
            provider = 'nodemailer';
            await sendPaymentNotifications({
              name: userName, email: userEmail, phone: userPhone,
              planName: courseName, planLabel: planLabel || '', amount: total,
              paymentId: razorpay_payment_id, orderId: razorpay_order_id,
            });
            emailStatus = 'sent';
          }
        } catch (e: any) {
          errorMessage = e?.message || 'Unknown error';
          console.error('[Email] Payment success email failed:', errorMessage);
        }

        await logEmail({
          userId, email: userEmail,
          emailType: 'payment_success',
          subject: `Payment Confirmed — ${courseName}`,
          status: emailStatus, provider,
          errorMessage, paymentId: razorpay_payment_id,
          orderId: razorpay_order_id, courseSlug, courseName, amount: total,
        });
      }
    }

    console.log(`[Payment] ✅ Complete — ${razorpay_payment_id} | ${userEmail} | ₹${total}`);

    return NextResponse.json({
      success: true,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    });

  } catch (error: any) {
    console.error('[Payment] Verify critical error:', error?.message);
    // Critical failure — do NOT return success
    return NextResponse.json({ success: false, error: 'Payment processing failed. Please contact support.' }, { status: 500 });
  }
}
