/**
 * Adyapan — SendGrid Email Service
 * Handles payment success and failure emails
 * Sender: support@adyapan.com
 */

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://adyapan.com';

const fmt = (n: number) =>
  '₹' + Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2 });

/* ── Course metadata ── */
const COURSE_META: Record<string, { modules: string[]; benefits: string[]; duration: string }> = {
  'plan-1': {
    duration: '2 Months',
    modules: ['Introduction & Fundamentals', 'Core Concepts & Theory', 'Practical Exercises', 'Assessment & Certification'],
    benefits: ['Industry-recognised certificate', 'Live doubt-clearing sessions', 'Study material & notes', 'Lifetime access to recordings'],
  },
  'plan-2': {
    duration: '2 Months',
    modules: ['Foundation & Core Concepts', 'Hands-on Projects', 'Industry Case Studies', 'Mentorship Sessions', 'Assessment & Certification'],
    benefits: ['Industry-recognised certificate', 'Live classes with mentors', 'Real-world project experience', 'Career guidance sessions', 'Lifetime access to recordings'],
  },
  'plan-3': {
    duration: '3 Months',
    modules: ['Advanced Concepts & Architecture', 'Real-world Project Development', 'Industry Expert Sessions', 'Portfolio Building', 'Placement Preparation', 'Assessment & Certification'],
    benefits: ['Industry-recognised certificate', 'Live expert-led classes', 'Real project portfolio', 'Placement support', '1:1 mentorship sessions', 'Resume & LinkedIn review'],
  },
  'plan-4-premium': {
    duration: '4 Months',
    modules: ['Deep-dive Core Curriculum', 'Industry-grade Projects', 'Expert Masterclasses', 'Mock Interviews & GD', 'Resume & Portfolio Building', 'Placement Drive Access', 'Assessment & Certification'],
    benefits: ['Placement guarantee', 'Industry-recognised certificate', '1:1 mentorship', 'Mock interviews with industry experts', 'Resume & LinkedIn optimisation', 'Lifetime access to all materials', 'Alumni network access'],
  },
};

const DEFAULT_META = {
  duration: 'As per plan',
  modules: ['Core Curriculum', 'Practical Projects', 'Expert Sessions', 'Assessment & Certification'],
  benefits: ['Industry-recognised certificate', 'Live classes', 'Study material', 'Placement support'],
};

/* ── Check SendGrid config ── */
function isSendGridConfigured(): boolean {
  const key = process.env.SENDGRID_API_KEY || '';
  return key.startsWith('SG.') && key.length > 20;
}

/* ── Send via SendGrid ── */
async function sendViaSendGrid(to: string, subject: string, html: string, text: string): Promise<boolean> {
  if (!isSendGridConfigured()) {
    console.warn('[Email] SendGrid not configured. Set SENDGRID_API_KEY in .env');
    return false;
  }

  try {
    const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: 'support@adyapan.com', name: 'Adyapan Skills' },
        reply_to: { email: 'support@adyapan.com' },
        subject,
        content: [
          { type: 'text/plain', value: text },
          { type: 'text/html', value: html },
        ],
      }),
    });

    if (res.status === 202) {
      console.log(`[Email] ✅ Sent to ${to} | Subject: ${subject}`);
      return true;
    }

    const body = await res.text();
    console.error(`[Email] ❌ SendGrid error ${res.status}: ${body}`);
    return false;
  } catch (err: any) {
    console.error('[Email] ❌ Network error:', err?.message);
    return false;
  }
}

/* ══════════════════════════════════════════════════════════════
   SUCCESS EMAIL
══════════════════════════════════════════════════════════════ */
export interface SuccessEmailPayload {
  name: string;
  email: string;
  courseName: string;
  courseSlug: string;
  planLabel: string;
  amount: number;
  paymentId: string;
  orderId: string;
}

export async function sendPaymentSuccessEmail(p: SuccessEmailPayload): Promise<boolean> {
  const meta = COURSE_META[p.courseSlug] || DEFAULT_META;
  const date = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

  const moduleRows = meta.modules.map((m, i) => `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;">
        <span style="display:inline-flex;align-items:center;gap:10px;font-size:14px;color:#374151;">
          <span style="width:24px;height:24px;background:#fff7ed;border:1px solid #fed7aa;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#ea580c;flex-shrink:0;">${i + 1}</span>
          ${m}
        </span>
      </td>
    </tr>`).join('');

  const benefitRows = meta.benefits.map(b => `
    <tr>
      <td style="padding:6px 0;">
        <span style="font-size:14px;color:#374151;">
          <span style="color:#16a34a;margin-right:8px;">&#10003;</span>${b}
        </span>
      </td>
    </tr>`).join('');

  const receiptRows = [
    ['Plan', p.planLabel || p.courseName],
    ['Course', p.courseName],
    ['Duration', meta.duration],
    ['Amount Paid', fmt(p.amount)],
    ['Payment ID', p.paymentId],
    ['Order ID', p.orderId],
    ['Date', date],
    ['Status', '&#10003; Confirmed'],
  ].map(([k, v]) => `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:10px;">
      <tr>
        <td style="font-size:13px;color:#9ca3af;width:42%;">${k}</td>
        <td style="font-size:13px;color:#111827;font-weight:600;text-align:right;">${v}</td>
      </tr>
    </table>`).join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#f5f0eb;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0eb;padding:40px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.10);">

  <!-- HEADER -->
  <tr>
    <td style="background:linear-gradient(135deg,#ffa800 0%,#ff6b00 100%);padding:40px 40px 32px;text-align:center;">
      <div style="width:72px;height:72px;background:rgba(255,255,255,0.2);border-radius:50%;margin:0 auto 20px;line-height:72px;font-size:36px;">&#127881;</div>
      <h1 style="margin:0 0 8px;color:#ffffff;font-size:28px;font-weight:800;">Payment Successful!</h1>
      <p style="margin:0;color:rgba(255,255,255,0.88);font-size:15px;">Welcome to Adyapan Skills — your learning journey begins now</p>
    </td>
  </tr>

  <!-- BODY -->
  <tr><td style="padding:36px 40px 0;">
    <p style="margin:0 0 6px;font-size:18px;font-weight:700;color:#111827;">Hi ${p.name},</p>
    <p style="margin:0 0 28px;font-size:14px;color:#6b7280;line-height:1.7;">
      Congratulations! Your payment has been successfully processed and you are now officially enrolled in
      <strong style="color:#ea580c;">${p.courseName}</strong>. Get ready to learn, build, and get placed!
    </p>

    <!-- RECEIPT -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff7ed;border:1.5px solid #fed7aa;border-radius:16px;margin-bottom:28px;">
      <tr><td style="padding:20px 24px;">
        <p style="margin:0 0 16px;font-size:11px;font-weight:700;color:#92400e;text-transform:uppercase;letter-spacing:1px;">Payment Receipt</p>
        ${receiptRows}
      </td></tr>
    </table>

    <!-- MODULES -->
    <p style="margin:0 0 12px;font-size:15px;font-weight:700;color:#111827;">Course Modules</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;margin-bottom:28px;">
      <tr><td style="padding:16px 20px;">
        <table width="100%" cellpadding="0" cellspacing="0">${moduleRows}</table>
      </td></tr>
    </table>

    <!-- BENEFITS -->
    <p style="margin:0 0 12px;font-size:15px;font-weight:700;color:#111827;">What You Get</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;margin-bottom:28px;">
      <tr><td style="padding:16px 20px;">
        <table width="100%" cellpadding="0" cellspacing="0">${benefitRows}</table>
      </td></tr>
    </table>

    <!-- NEXT STEPS -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;margin-bottom:32px;">
      <tr><td style="padding:18px 22px;">
        <p style="margin:0 0 10px;font-size:14px;font-weight:700;color:#1e40af;">What happens next?</p>
        <ul style="margin:0;padding-left:18px;font-size:13px;color:#374151;line-height:2.2;">
          <li>Our team will contact you within <strong>24 hours</strong> with batch details.</li>
          <li>Check your dashboard for course schedule and materials.</li>
          <li>Join our student WhatsApp group for live updates.</li>
          <li>Attend your first live class and start your journey!</li>
        </ul>
      </td></tr>
    </table>

    <!-- CTA -->
    <table cellpadding="0" cellspacing="0" style="margin:0 auto 32px;">
      <tr>
        <td align="center" style="border-radius:14px;background:linear-gradient(135deg,#ffa800,#ff6b00);box-shadow:0 4px 20px rgba(255,107,0,0.35);">
          <a href="${APP_URL}/dashboard/student" style="display:inline-block;padding:16px 40px;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;border-radius:14px;">
            Go to My Dashboard &rarr;
          </a>
        </td>
      </tr>
    </table>

    <p style="margin:0 0 36px;font-size:14px;color:#374151;line-height:1.7;">
      Questions? Email us at <a href="mailto:support@adyapan.com" style="color:#ea580c;font-weight:600;">support@adyapan.com</a>
    </p>
  </td></tr>

  <!-- FOOTER -->
  <tr>
    <td style="background:#1a1a2e;padding:24px 40px;text-align:center;">
      <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#ffa800;">Adyapan Skills</p>
      <p style="margin:0 0 8px;font-size:12px;color:#9ca3af;">SR's Adyapan Edutech Private Limited</p>
      <p style="margin:0;font-size:11px;color:#6b7280;">
        &copy; ${new Date().getFullYear()} Adyapan Skills &middot; All rights reserved &middot;
        <a href="${APP_URL}/privacy" style="color:#6b7280;">Privacy Policy</a>
      </p>
    </td>
  </tr>

</table>
<p style="margin:16px 0 0;font-size:11px;color:#9ca3af;text-align:center;">You received this because you made a purchase on Adyapan Skills.</p>
</td></tr>
</table>
</body>
</html>`;

  const text = `Hi ${p.name},

Payment Successful! Congratulations!

You are now enrolled in ${p.courseName} (${p.planLabel}).

Receipt:
- Amount Paid: ${fmt(p.amount)}
- Duration: ${meta.duration}
- Payment ID: ${p.paymentId}
- Order ID: ${p.orderId}
- Date: ${date}
- Status: Confirmed

Course Modules:
${meta.modules.map((m, i) => `${i + 1}. ${m}`).join('\n')}

What You Get:
${meta.benefits.map(b => `- ${b}`).join('\n')}

Go to your dashboard: ${APP_URL}/dashboard/student

Questions? Email: support@adyapan.com

— Adyapan Skills Team`;

  return sendViaSendGrid(
    p.email,
    `Payment Confirmed — ${p.courseName} | Adyapan Skills`,
    html,
    text
  );
}

/* ══════════════════════════════════════════════════════════════
   FAILURE EMAIL
══════════════════════════════════════════════════════════════ */
export interface FailureEmailPayload {
  name: string;
  email: string;
  courseName: string;
  courseSlug: string;
  planLabel: string;
  amount: number;
  orderId: string;
  failureReason?: string;
  retryUrl?: string;
}

export async function sendPaymentFailureEmail(p: FailureEmailPayload): Promise<boolean> {
  const retryLink = p.retryUrl || `${APP_URL}/checkout?plan=${p.courseSlug}`;
  const date = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#f5f0eb;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0eb;padding:40px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.10);">

  <!-- HEADER -->
  <tr>
    <td style="background:linear-gradient(135deg,#dc2626 0%,#b91c1c 100%);padding:40px 40px 32px;text-align:center;">
      <div style="width:72px;height:72px;background:rgba(255,255,255,0.15);border-radius:50%;margin:0 auto 20px;line-height:72px;font-size:36px;text-align:center;">&#10060;</div>
      <h1 style="margin:0 0 8px;color:#ffffff;font-size:28px;font-weight:800;">Payment Failed</h1>
      <p style="margin:0;color:rgba(255,255,255,0.88);font-size:15px;">Don't worry — your money is safe. Please try again.</p>
    </td>
  </tr>

  <!-- BODY -->
  <tr><td style="padding:36px 40px 0;">
    <p style="margin:0 0 6px;font-size:18px;font-weight:700;color:#111827;">Hi ${p.name},</p>
    <p style="margin:0 0 28px;font-size:14px;color:#6b7280;line-height:1.7;">
      We're sorry, but your payment for <strong style="color:#dc2626;">${p.courseName}</strong> could not be processed.
      No amount has been deducted from your account. Please try again using the button below.
    </p>

    <!-- DETAILS -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#fef2f2;border:1.5px solid #fecaca;border-radius:16px;margin-bottom:28px;">
      <tr><td style="padding:20px 24px;">
        <p style="margin:0 0 16px;font-size:11px;font-weight:700;color:#991b1b;text-transform:uppercase;letter-spacing:1px;">Payment Details</p>
        ${[
          ['Course', p.courseName],
          ['Plan', p.planLabel || p.courseName],
          ['Amount', fmt(p.amount)],
          ['Order ID', p.orderId],
          ['Date', date],
          ['Status', '&#10060; Failed'],
          ...(p.failureReason ? [['Reason', p.failureReason]] : []),
        ].map(([k, v]) => `
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:10px;">
          <tr>
            <td style="font-size:13px;color:#9ca3af;width:42%;">${k}</td>
            <td style="font-size:13px;color:#111827;font-weight:600;text-align:right;">${v}</td>
          </tr>
        </table>`).join('')}
      </td></tr>
    </table>

    <!-- TIPS -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#fffbeb;border:1px solid #fde68a;border-radius:12px;margin-bottom:32px;">
      <tr><td style="padding:18px 22px;">
        <p style="margin:0 0 10px;font-size:14px;font-weight:700;color:#92400e;">Common reasons for payment failure:</p>
        <ul style="margin:0;padding-left:18px;font-size:13px;color:#374151;line-height:2.2;">
          <li>Insufficient balance in your account</li>
          <li>Bank declined the transaction</li>
          <li>Network timeout during payment</li>
          <li>Incorrect OTP or card details</li>
          <li>Daily transaction limit exceeded</li>
        </ul>
      </td></tr>
    </table>

    <!-- RETRY CTA -->
    <table cellpadding="0" cellspacing="0" style="margin:0 auto 16px;">
      <tr>
        <td align="center" style="border-radius:14px;background:linear-gradient(135deg,#ffa800,#ff6b00);box-shadow:0 4px 20px rgba(255,107,0,0.35);">
          <a href="${retryLink}" style="display:inline-block;padding:16px 40px;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;border-radius:14px;">
            Retry Payment &rarr;
          </a>
        </td>
      </tr>
    </table>

    <p style="margin:0 0 36px;font-size:13px;color:#9ca3af;text-align:center;">
      If the issue persists, contact us at
      <a href="mailto:support@adyapan.com" style="color:#ea580c;font-weight:600;">support@adyapan.com</a>
    </p>
  </td></tr>

  <!-- FOOTER -->
  <tr>
    <td style="background:#1a1a2e;padding:24px 40px;text-align:center;">
      <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#ffa800;">Adyapan Skills</p>
      <p style="margin:0 0 8px;font-size:12px;color:#9ca3af;">SR's Adyapan Edutech Private Limited</p>
      <p style="margin:0;font-size:11px;color:#6b7280;">
        &copy; ${new Date().getFullYear()} Adyapan Skills &middot; All rights reserved
      </p>
    </td>
  </tr>

</table>
</td></tr>
</table>
</body>
</html>`;

  const text = `Hi ${p.name},

Payment Failed for ${p.courseName}.

Don't worry — no amount has been deducted from your account.

Details:
- Course: ${p.courseName}
- Amount: ${fmt(p.amount)}
- Order ID: ${p.orderId}
- Date: ${date}
${p.failureReason ? `- Reason: ${p.failureReason}` : ''}

Retry your payment: ${retryLink}

Need help? Email: support@adyapan.com

— Adyapan Skills Team`;

  return sendViaSendGrid(
    p.email,
    `Payment Failed — ${p.courseName} | Adyapan Skills`,
    html,
    text
  );
}
