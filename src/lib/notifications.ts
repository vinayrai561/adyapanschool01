/**
 * Adyapan — Payment Notification Service
 * Sends confirmation email (Nodemailer/Gmail) + SMS (Fast2SMS free tier)
 * after a successful payment.
 *
 * ENV vars needed (add to .env):
 *   EMAIL_FROM          — sender address, e.g. adyapan.skills@gmail.com
 *   EMAIL_PASS          — Gmail App Password (16-char, not your login password)
 *   FAST2SMS_API_KEY    — from fast2sms.com dashboard (free tier works)
 *   NEXT_PUBLIC_APP_URL — e.g. https://adyapan.com  (used in email links)
 */

import nodemailer from 'nodemailer';

/* ─── Types ──────────────────────────────────────────────────── */
export interface PaymentNotificationPayload {
  name:      string;
  email:     string;
  phone:     string;          // 10-digit Indian mobile, no country code
  planName:  string;
  planLabel: string;
  amount:    number;          // grand total in ₹ (already includes GST)
  paymentId: string;
  orderId:   string;
  testMode?: boolean;
}

/* ─── Helpers ────────────────────────────────────────────────── */
const fmt = (n: number) =>
  '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2 });

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

/* ─── Email transport ────────────────────────────────────────── */
function createTransport() {
  const user = process.env.EMAIL_FROM;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass || pass.includes('your_') || pass.includes('xxxx')) {
    return null; // not configured
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });
}

/* ─── Email HTML template ────────────────────────────────────── */
function buildEmailHtml(p: PaymentNotificationPayload): string {
  const date = new Date().toLocaleDateString('en-IN', {
    day: '2-digit', month: 'long', year: 'numeric',
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Payment Confirmation — Adyapan</title>
</head>
<body style="margin:0;padding:0;background:#f5f0eb;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0eb;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#ffa800,#ff6b00);padding:32px 40px;text-align:center;">
            <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:800;letter-spacing:-0.5px;">
              🎉 Payment Confirmed!
            </h1>
            <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">
              Welcome to Adyapan Skills — your journey starts now
            </p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:36px 40px;">

            <p style="margin:0 0 20px;font-size:16px;color:#1a1a2e;">
              Hi <strong>${p.name}</strong>,
            </p>
            <p style="margin:0 0 28px;font-size:14px;color:#555;line-height:1.7;">
              Your payment has been successfully processed. You are now enrolled in
              <strong style="color:#ffa800;">${p.planName}</strong>.
              Get ready to learn, grow, and get placed!
            </p>

            <!-- Receipt box -->
            <table width="100%" cellpadding="0" cellspacing="0"
              style="background:#fff7ed;border:1px solid #fed7aa;border-radius:14px;margin-bottom:28px;">
              <tr>
                <td style="padding:20px 24px;">
                  <p style="margin:0 0 14px;font-size:13px;font-weight:700;color:#92400e;text-transform:uppercase;letter-spacing:0.8px;">
                    📋 Payment Receipt
                  </p>
                  ${[
                    ['Plan',        p.planLabel],
                    ['Program',     p.planName],
                    ['Amount Paid', fmt(p.amount)],
                    ['Payment ID',  p.paymentId],
                    ['Order ID',    p.orderId],
                    ['Date',        date],
                    ['Status',      '✅ Confirmed'],
                  ].map(([k, v]) => `
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
                    <tr>
                      <td style="font-size:13px;color:#78716c;width:40%;">${k}</td>
                      <td style="font-size:13px;color:#1a1a2e;font-weight:600;text-align:right;">${v}</td>
                    </tr>
                  </table>`).join('')}
                </td>
              </tr>
            </table>

            <!-- What's next -->
            <p style="margin:0 0 12px;font-size:14px;font-weight:700;color:#1a1a2e;">🚀 What happens next?</p>
            <ul style="margin:0 0 28px;padding-left:20px;font-size:14px;color:#555;line-height:2;">
              <li>Our team will contact you within <strong>24 hours</strong> to share batch details.</li>
              <li>Check your dashboard for course materials and schedule.</li>
              <li>Join our student WhatsApp group for updates.</li>
            </ul>

            <!-- CTA button -->
            <table cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
              <tr>
                <td style="border-radius:12px;background:linear-gradient(135deg,#ffa800,#ff6b00);">
                  <a href="${appUrl}/dashboard/student"
                    style="display:inline-block;padding:14px 32px;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;border-radius:12px;">
                    Go to My Dashboard →
                  </a>
                </td>
              </tr>
            </table>

            <p style="margin:0;font-size:13px;color:#9ca3af;line-height:1.6;">
              Need help? Reply to this email or reach us at
              <a href="mailto:support@adyapan.com" style="color:#ffa800;">support@adyapan.com</a>
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#1a1a2e;padding:20px 40px;text-align:center;">
            <p style="margin:0;font-size:12px;color:#6b7280;">
              © ${new Date().getFullYear()} Adyapan Skills Pvt. Ltd. · All rights reserved
            </p>
            <p style="margin:6px 0 0;font-size:11px;color:#4b5563;">
              SR's Adyapan Edutech Private Limited
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

/* ─── Send email ─────────────────────────────────────────────── */
export async function sendPaymentEmail(p: PaymentNotificationPayload): Promise<void> {
  const transport = createTransport();

  if (!transport) {
    console.warn('[Email] Not configured — skipping. Set EMAIL_FROM and EMAIL_PASS in .env');
    return;
  }

  try {
    await transport.sendMail({
      from:    `"Adyapan Skills" <${process.env.EMAIL_FROM}>`,
      to:      p.email,
      subject: `✅ Payment Confirmed — ${p.planName} | Adyapan`,
      html:    buildEmailHtml(p),
      text:    `Hi ${p.name}, your payment of ${fmt(p.amount)} for ${p.planName} is confirmed. Payment ID: ${p.paymentId}. Visit ${appUrl}/dashboard/student`,
    });
    console.log(`[Email] Confirmation sent to ${p.email}`);
  } catch (err: any) {
    // Non-fatal — log but don't break the payment flow
    console.error('[Email] Failed to send:', err?.message);
  }
}

/* ─── Send SMS via Fast2SMS ──────────────────────────────────── */
export async function sendPaymentSMS(p: PaymentNotificationPayload): Promise<void> {
  const apiKey = process.env.FAST2SMS_API_KEY;

  if (!apiKey || apiKey.includes('your_') || apiKey.length < 10) {
    console.warn('[SMS] Fast2SMS not configured — skipping. Set FAST2SMS_API_KEY in .env');
    return;
  }

  // Sanitise phone — strip country code if present
  const phone = p.phone.replace(/^\+91/, '').replace(/\D/g, '').slice(-10);
  if (phone.length !== 10) {
    console.warn(`[SMS] Invalid phone number: ${p.phone}`);
    return;
  }

  const message =
    `Hi ${p.name.split(' ')[0]}! Your payment of ${fmt(p.amount)} for ${p.planName} is CONFIRMED. ` +
    `Payment ID: ${p.paymentId}. ` +
    `Login at ${appUrl}/dashboard/student to access your course. - Adyapan Skills`;

  try {
    const res = await fetch('https://www.fast2sms.com/dev/bulkV2', {
      method: 'POST',
      headers: {
        authorization: apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        route:    'q',          // quick transactional route
        message,
        language: 'english',
        flash:    0,
        numbers:  phone,
      }),
    });

    const data = await res.json();
    if (data.return) {
      console.log(`[SMS] Confirmation sent to ${phone}`);
    } else {
      console.error('[SMS] Fast2SMS error:', data.message ?? data);
    }
  } catch (err: any) {
    // Non-fatal
    console.error('[SMS] Failed to send:', err?.message);
  }
}

/* ─── Combined: send both ────────────────────────────────────── */
export async function sendPaymentNotifications(p: PaymentNotificationPayload): Promise<void> {
  // Fire both in parallel — neither blocks the other
  await Promise.allSettled([
    sendPaymentEmail(p),
    sendPaymentSMS(p),
  ]);
}
