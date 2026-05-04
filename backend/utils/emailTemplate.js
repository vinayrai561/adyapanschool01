/**
 * Adyapan Skills — Payment Confirmation Email Template
 * Sender: support@adyapan.com
 * Modern card-style HTML, mobile responsive, NO password sent
 */

const COURSE_META = {
  'Adyapan Starter': {
    modules: [
      'Introduction & Fundamentals',
      'Core Concepts & Theory',
      'Practical Exercises',
      'Assessment & Certification',
    ],
    benefits: [
      'Industry-recognised certificate',
      'Live doubt-clearing sessions',
      'Study material & notes',
      'Lifetime access to recordings',
    ],
  },
  'Adyapan Standard': {
    modules: [
      'Foundation & Core Concepts',
      'Hands-on Projects',
      'Industry Case Studies',
      'Mentorship Sessions',
      'Assessment & Certification',
    ],
    benefits: [
      'Industry-recognised certificate',
      'Live classes with mentors',
      'Real-world project experience',
      'Career guidance sessions',
      'Lifetime access to recordings',
    ],
  },
  'Adyapan Professional': {
    modules: [
      'Advanced Concepts & Architecture',
      'Real-world Project Development',
      'Industry Expert Sessions',
      'Portfolio Building',
      'Placement Preparation',
      'Assessment & Certification',
    ],
    benefits: [
      'Industry-recognised certificate',
      'Live expert-led classes',
      'Real project portfolio',
      'Placement support',
      '1:1 mentorship sessions',
      'Resume & LinkedIn review',
    ],
  },
  'Adyapan Career Pro': {
    modules: [
      'Deep-dive Core Curriculum',
      'Industry-grade Projects',
      'Expert Masterclasses',
      'Mock Interviews & GD',
      'Resume & Portfolio Building',
      'Placement Drive Access',
      'Assessment & Certification',
    ],
    benefits: [
      'Placement guarantee',
      'Industry-recognised certificate',
      '1:1 mentorship',
      'Mock interviews with industry experts',
      'Resume & LinkedIn optimisation',
      'Lifetime access to all materials',
      'Alumni network access',
    ],
  },
};

const DEFAULT_META = {
  modules: [
    'Core Curriculum',
    'Practical Projects',
    'Expert Sessions',
    'Assessment & Certification',
  ],
  benefits: [
    'Industry-recognised certificate',
    'Live classes',
    'Study material',
    'Placement support',
  ],
};

const fmt = (n) =>
  '₹' + Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2 });

/**
 * @param {object} data
 * @param {string} data.name
 * @param {string} data.courseName
 * @param {string} data.planLabel
 * @param {number} data.amount
 * @param {string} data.duration
 * @param {string} data.paymentId
 * @param {string} data.orderId
 * @param {string} [data.dashboardUrl]
 */
function buildPaymentSuccessEmail(data) {
  const {
    name,
    courseName,
    planLabel,
    amount,
    duration,
    paymentId,
    orderId,
    dashboardUrl = 'https://adyapan.com/dashboard/student',
  } = data;

  const meta = COURSE_META[courseName] || DEFAULT_META;
  const date = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const moduleRows = meta.modules
    .map(
      (m, i) => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;">
          <span style="display:inline-flex;align-items:center;gap:10px;font-size:14px;color:#374151;">
            <span style="width:24px;height:24px;background:#fff7ed;border:1px solid #fed7aa;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#ea580c;flex-shrink:0;">${i + 1}</span>
            ${m}
          </span>
        </td>
      </tr>`
    )
    .join('');

  const benefitRows = meta.benefits
    .map(
      (b) => `
      <tr>
        <td style="padding:6px 0;">
          <span style="font-size:14px;color:#374151;">
            <span style="color:#16a34a;margin-right:8px;font-size:16px;">✓</span>${b}
          </span>
        </td>
      </tr>`
    )
    .join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Payment Confirmed — Adyapan Skills</title>
</head>
<body style="margin:0;padding:0;background:#f5f0eb;font-family:'Segoe UI',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">

  <!-- Wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0eb;padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0"
        style="max-width:600px;width:100%;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.10);">

        <!-- ── HEADER ── -->
        <tr>
          <td style="background:linear-gradient(135deg,#ffa800 0%,#ff6b00 100%);padding:40px 40px 32px;text-align:center;">
            <!-- Success icon -->
            <div style="width:72px;height:72px;background:rgba(255,255,255,0.2);border-radius:50%;margin:0 auto 20px;display:flex;align-items:center;justify-content:center;">
              <span style="font-size:36px;line-height:1;">🎉</span>
            </div>
            <h1 style="margin:0 0 8px;color:#ffffff;font-size:28px;font-weight:800;letter-spacing:-0.5px;">
              Payment Successful!
            </h1>
            <p style="margin:0;color:rgba(255,255,255,0.88);font-size:15px;line-height:1.5;">
              Welcome to Adyapan Skills — your learning journey begins now
            </p>
          </td>
        </tr>

        <!-- ── BODY ── -->
        <tr>
          <td style="padding:36px 40px 0;">

            <!-- Greeting -->
            <p style="margin:0 0 6px;font-size:18px;font-weight:700;color:#111827;">
              Hi ${name} 👋
            </p>
            <p style="margin:0 0 28px;font-size:14px;color:#6b7280;line-height:1.7;">
              Congratulations! Your payment has been successfully processed and you are now
              officially enrolled in <strong style="color:#ea580c;">${courseName}</strong>.
              Get ready to learn, build, and get placed!
            </p>

            <!-- ── RECEIPT CARD ── -->
            <table width="100%" cellpadding="0" cellspacing="0"
              style="background:#fff7ed;border:1.5px solid #fed7aa;border-radius:16px;margin-bottom:28px;">
              <tr>
                <td style="padding:20px 24px;">
                  <p style="margin:0 0 16px;font-size:11px;font-weight:700;color:#92400e;text-transform:uppercase;letter-spacing:1px;">
                    📋 Payment Receipt
                  </p>
                  ${[
                    ['Plan',        planLabel || courseName],
                    ['Course',      courseName],
                    ['Duration',    duration],
                    ['Amount Paid', fmt(amount)],
                    ['Payment ID',  paymentId],
                    ['Order ID',    orderId],
                    ['Date',        date],
                    ['Status',      '✅ Confirmed'],
                  ]
                    .map(
                      ([k, v]) => `
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:10px;">
                    <tr>
                      <td style="font-size:13px;color:#9ca3af;width:42%;">${k}</td>
                      <td style="font-size:13px;color:#111827;font-weight:600;text-align:right;">${v}</td>
                    </tr>
                  </table>`
                    )
                    .join('')}
                </td>
              </tr>
            </table>

            <!-- ── COURSE MODULES ── -->
            <p style="margin:0 0 12px;font-size:15px;font-weight:700;color:#111827;">
              📚 Course Modules
            </p>
            <table width="100%" cellpadding="0" cellspacing="0"
              style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;margin-bottom:28px;">
              <tr><td style="padding:16px 20px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  ${moduleRows}
                </table>
              </td></tr>
            </table>

            <!-- ── BENEFITS ── -->
            <p style="margin:0 0 12px;font-size:15px;font-weight:700;color:#111827;">
              🌟 What You Get
            </p>
            <table width="100%" cellpadding="0" cellspacing="0"
              style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;margin-bottom:32px;">
              <tr><td style="padding:16px 20px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  ${benefitRows}
                </table>
              </td></tr>
            </table>

            <!-- ── WHAT'S NEXT ── -->
            <table width="100%" cellpadding="0" cellspacing="0"
              style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;margin-bottom:32px;">
              <tr>
                <td style="padding:18px 22px;">
                  <p style="margin:0 0 10px;font-size:14px;font-weight:700;color:#1e40af;">🚀 What happens next?</p>
                  <ul style="margin:0;padding-left:18px;font-size:13px;color:#374151;line-height:2.2;">
                    <li>Our team will contact you within <strong>24 hours</strong> with batch details.</li>
                    <li>Check your dashboard for course schedule and materials.</li>
                    <li>Join our student WhatsApp group for live updates.</li>
                    <li>Attend your first live class and start your journey!</li>
                  </ul>
                </td>
              </tr>
            </table>

            <!-- ── CTA BUTTON ── -->
            <table cellpadding="0" cellspacing="0" style="margin:0 auto 36px;">
              <tr>
                <td align="center" style="border-radius:14px;background:linear-gradient(135deg,#ffa800,#ff6b00);box-shadow:0 4px 20px rgba(255,107,0,0.35);">
                  <a href="${dashboardUrl}"
                    style="display:inline-block;padding:16px 40px;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;border-radius:14px;letter-spacing:0.3px;">
                    Go to My Dashboard →
                  </a>
                </td>
              </tr>
            </table>

            <!-- Closing -->
            <p style="margin:0 0 6px;font-size:14px;color:#374151;line-height:1.7;">
              If you have any questions, reply to this email or reach us at
              <a href="mailto:support@adyapan.com" style="color:#ea580c;font-weight:600;">support@adyapan.com</a>.
            </p>
            <p style="margin:0 0 36px;font-size:14px;color:#374151;">
              We're excited to have you on board. Let's build something great together! 💪
            </p>

          </td>
        </tr>

        <!-- ── FOOTER ── -->
        <tr>
          <td style="background:#1a1a2e;padding:24px 40px;text-align:center;border-radius:0 0 24px 24px;">
            <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#ffa800;">Adyapan Skills</p>
            <p style="margin:0 0 8px;font-size:12px;color:#9ca3af;">
              SR's Adyapan Edutech Private Limited
            </p>
            <p style="margin:0;font-size:11px;color:#6b7280;">
              © ${new Date().getFullYear()} Adyapan Skills · All rights reserved ·
              <a href="https://adyapan.com/privacy" style="color:#6b7280;">Privacy Policy</a>
            </p>
          </td>
        </tr>

      </table>

      <!-- Anti-spam note -->
      <p style="margin:16px 0 0;font-size:11px;color:#9ca3af;text-align:center;">
        You received this email because you made a purchase on Adyapan Skills.
      </p>
    </td></tr>
  </table>

</body>
</html>`;

  const text = `Hi ${name},

Payment Successful! 🎉

You are now enrolled in ${courseName} (${planLabel}).

Receipt:
- Amount Paid: ${fmt(amount)}
- Duration: ${duration}
- Payment ID: ${paymentId}
- Date: ${date}

Visit your dashboard: ${dashboardUrl}

Questions? Email us at support@adyapan.com

— Adyapan Skills Team`;

  return { html, text };
}

module.exports = { buildPaymentSuccessEmail };
