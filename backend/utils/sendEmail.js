const sgMail = require('@sendgrid/mail');
const { buildPaymentSuccessEmail } = require('./emailTemplate');

/* ── Check if SendGrid is properly configured ── */
function isSendGridConfigured() {
  const key = process.env.SENDGRID_API_KEY || '';
  return key.startsWith('SG.') && key.length > 20;
}

/**
 * Send payment confirmation email via SendGrid
 * from: support@adyapan.com
 *
 * @param {object} payload
 * @param {string} payload.name
 * @param {string} payload.email
 * @param {string} payload.courseName
 * @param {string} payload.planLabel
 * @param {number} payload.amount
 * @param {string} payload.duration
 * @param {string} payload.paymentId
 * @param {string} payload.orderId
 * @returns {Promise<boolean>} true if sent successfully
 */
async function sendPaymentConfirmationEmail(payload) {
  if (!isSendGridConfigured()) {
    console.warn('[Email] ⚠️  SendGrid not configured — skipping email.');
    console.warn('[Email]    Set SENDGRID_API_KEY=SG.xxxx in backend/.env');
    console.warn('[Email]    Also verify sender domain: support@adyapan.com in SendGrid dashboard.');
    return false;
  }

  // Set API key at send-time (after dotenv has loaded)
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const { html, text } = buildPaymentSuccessEmail(payload);

  const msg = {
    to:   payload.email,
    from: {
      email: 'support@adyapan.com',
      name:  'Adyapan Skills',
    },
    replyTo: 'support@adyapan.com',
    subject: `✅ Payment Confirmed — ${payload.courseName} | Adyapan Skills`,
    html,
    text,
  };

  try {
    console.log(`[Email] 📧 Sending to: ${payload.email}`);
    const [response] = await sgMail.send(msg);
    console.log(`[Email] ✅ Sent! Status: ${response.statusCode} | To: ${payload.email}`);
    return true;
  } catch (error) {
    const detail = error?.response?.body?.errors?.[0]?.message || error.message;
    console.error(`[Email] ❌ SendGrid error: ${detail}`);
    return false;
  }
}

/**
 * Send project-related emails via SendGrid
 * (project submission, assignment, completion, admin notifications)
 *
 * @param {object} payload
 * @param {string} payload.to
 * @param {string} payload.subject
 * @param {string} payload.html
 * @param {string} payload.text
 * @returns {Promise<boolean>} true if sent successfully
 */
async function sendProjectEmail({ to, subject, html, text }) {
  if (!isSendGridConfigured()) {
    console.warn('[Email] SendGrid not configured — skipping project email to:', to);
    return false;
  }
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  try {
    await sgMail.send({
      to,
      from: { email: 'support@adyapan.com', name: 'Adyapan Skills' },
      replyTo: 'support@adyapan.com',
      subject,
      html,
      text,
    });
    console.log('[Email] ✅ Project email sent to:', to);
    return true;
  } catch (error) {
    console.error('[Email] ❌ Project email error:', error?.response?.body?.errors?.[0]?.message || error.message);
    return false;
  }
}

module.exports = { sendPaymentConfirmationEmail, sendProjectEmail };
