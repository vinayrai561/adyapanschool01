/**
 * Adyapan Skills — Project Request Email Templates
 * Sender: support@adyapan.com
 * Orange gradient header, card-based layout, consistent with emailTemplate.js
 */

const fmt = (n) =>
  '₹' + Number(n).toLocaleString('en-IN', { minimumFractionDigits: 0 });

const HEADER = (emoji, title, subtitle) => `
  <tr>
    <td style="background:linear-gradient(135deg,#ffa800 0%,#ff6b00 100%);padding:40px 40px 32px;text-align:center;">
      <div style="width:72px;height:72px;background:rgba(255,255,255,0.2);border-radius:50%;margin:0 auto 20px;display:inline-flex;align-items:center;justify-content:center;">
        <span style="font-size:36px;line-height:1;">${emoji}</span>
      </div>
      <h1 style="margin:0 0 8px;color:#ffffff;font-size:26px;font-weight:800;letter-spacing:-0.5px;">${title}</h1>
      <p style="margin:0;color:rgba(255,255,255,0.88);font-size:14px;line-height:1.5;">${subtitle}</p>
    </td>
  </tr>`;

const FOOTER = () => `
  <tr>
    <td style="background:#1a1a2e;padding:24px 40px;text-align:center;border-radius:0 0 24px 24px;">
      <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#ffa800;">Adyapan Skills</p>
      <p style="margin:0 0 8px;font-size:12px;color:#9ca3af;">SR's Adyapan Edutech Private Limited</p>
      <p style="margin:0;font-size:11px;color:#6b7280;">
        © ${new Date().getFullYear()} Adyapan Skills · All rights reserved ·
        <a href="https://adyapan.com/privacy" style="color:#6b7280;">Privacy Policy</a>
      </p>
    </td>
  </tr>`;

const WRAPPER_OPEN = () => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
</head>
<body style="margin:0;padding:0;background:#f5f0eb;font-family:'Segoe UI',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0eb;padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0"
        style="max-width:600px;width:100%;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.10);">`;

const WRAPPER_CLOSE = () => `
      </table>
      <p style="margin:16px 0 0;font-size:11px;color:#9ca3af;text-align:center;">
        You received this email from Adyapan Skills.
      </p>
    </td></tr>
  </table>
</body>
</html>`;

const detailRow = (label, value) => `
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:10px;">
    <tr>
      <td style="font-size:13px;color:#9ca3af;width:42%;">${label}</td>
      <td style="font-size:13px;color:#111827;font-weight:600;text-align:right;">${value}</td>
    </tr>
  </table>`;

// ─────────────────────────────────────────────────────────────────────────────
/**
 * Sent to client after successful project submission + payment
 * @param {{ name, email, projectTitle, category, budget, deadline, projectRequestId, paymentId }} data
 * @returns {{ html: string, text: string }}
 */
function buildProjectSubmissionEmail(data) {
  const { name, projectTitle, category, budget, deadline, projectRequestId, paymentId } = data;
  const date = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
  const deadlineFormatted = new Date(deadline).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

  const html = WRAPPER_OPEN() + `
    ${HEADER('✅', 'Project Request Received!', 'Your project has been submitted successfully')}
    <tr>
      <td style="padding:36px 40px 0;">
        <p style="margin:0 0 6px;font-size:18px;font-weight:700;color:#111827;">Hi ${name} 👋</p>
        <p style="margin:0 0 28px;font-size:14px;color:#6b7280;line-height:1.7;">
          We've received your project request for <strong style="color:#ea580c;">${projectTitle}</strong>.
          Our team will review it and get back to you within <strong>24 hours</strong>.
        </p>

        <!-- Receipt Card -->
        <table width="100%" cellpadding="0" cellspacing="0"
          style="background:#fff7ed;border:1.5px solid #fed7aa;border-radius:16px;margin-bottom:28px;">
          <tr>
            <td style="padding:20px 24px;">
              <p style="margin:0 0 16px;font-size:11px;font-weight:700;color:#92400e;text-transform:uppercase;letter-spacing:1px;">
                📋 Project Submission Receipt
              </p>
              ${detailRow('Project Title', projectTitle)}
              ${detailRow('Category', category)}
              ${detailRow('Budget Paid', fmt(budget))}
              ${detailRow('Deadline', deadlineFormatted)}
              ${detailRow('Payment ID', paymentId)}
              ${detailRow('Request ID', projectRequestId)}
              ${detailRow('Submitted On', date)}
              ${detailRow('Status', '🔵 Under Review')}
            </td>
          </tr>
        </table>

        <!-- What's Next -->
        <table width="100%" cellpadding="0" cellspacing="0"
          style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;margin-bottom:28px;">
          <tr>
            <td style="padding:18px 22px;">
              <p style="margin:0 0 10px;font-size:14px;font-weight:700;color:#1e40af;">🚀 What happens next?</p>
              <ul style="margin:0;padding-left:18px;font-size:13px;color:#374151;line-height:2.2;">
                <li>Our team will review your requirements within <strong>24 hours</strong>.</li>
                <li>You'll receive an email once your project is assigned to a developer.</li>
                <li>Track your project status at any time from your dashboard.</li>
                <li>We'll deliver the completed project before your deadline.</li>
              </ul>
            </td>
          </tr>
        </table>

        <!-- CTA -->
        <table cellpadding="0" cellspacing="0" style="margin:0 auto 36px;">
          <tr>
            <td align="center" style="border-radius:14px;background:linear-gradient(135deg,#ffa800,#ff6b00);box-shadow:0 4px 20px rgba(255,107,0,0.35);">
              <a href="https://adyapan.com/company/my-projects"
                style="display:inline-block;padding:16px 40px;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;border-radius:14px;">
                Track Your Project →
              </a>
            </td>
          </tr>
        </table>

        <p style="margin:0 0 6px;font-size:14px;color:#374151;line-height:1.7;">
          Questions? Reply to this email or reach us at
          <a href="mailto:support@adyapan.com" style="color:#ea580c;font-weight:600;">support@adyapan.com</a>.
        </p>
        <p style="margin:0 0 36px;font-size:14px;color:#374151;">
          Thank you for choosing Adyapan Skills! 🙏
        </p>
      </td>
    </tr>
    ${FOOTER()}
  ` + WRAPPER_CLOSE();

  const text = `Hi ${name},

Project Request Received! ✅

We've received your project request for "${projectTitle}".

Receipt:
- Category: ${category}
- Budget Paid: ${fmt(budget)}
- Deadline: ${deadlineFormatted}
- Payment ID: ${paymentId}
- Request ID: ${projectRequestId}
- Submitted On: ${date}

Our team will review it within 24 hours.

Track your project: https://adyapan.com/company/my-projects

Questions? Email us at support@adyapan.com

— Adyapan Skills Team`;

  return { html, text };
}

// ─────────────────────────────────────────────────────────────────────────────
/**
 * Sent to client when project is assigned to a developer
 * @param {{ name, email, projectTitle, assignedTo, estimatedDelivery }} data
 * @returns {{ html: string, text: string }}
 */
function buildProjectAssignedEmail(data) {
  const { name, projectTitle, assignedTo, estimatedDelivery } = data;
  const deliveryFormatted = estimatedDelivery
    ? new Date(estimatedDelivery).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
    : 'As per deadline';

  const html = WRAPPER_OPEN() + `
    ${HEADER('🎯', 'Project Assigned!', 'A developer has been assigned to your project')}
    <tr>
      <td style="padding:36px 40px 0;">
        <p style="margin:0 0 6px;font-size:18px;font-weight:700;color:#111827;">Hi ${name} 👋</p>
        <p style="margin:0 0 28px;font-size:14px;color:#6b7280;line-height:1.7;">
          Great news! Your project <strong style="color:#ea580c;">${projectTitle}</strong> has been
          assigned to a developer and work has begun.
        </p>

        <table width="100%" cellpadding="0" cellspacing="0"
          style="background:#fff7ed;border:1.5px solid #fed7aa;border-radius:16px;margin-bottom:28px;">
          <tr>
            <td style="padding:20px 24px;">
              <p style="margin:0 0 16px;font-size:11px;font-weight:700;color:#92400e;text-transform:uppercase;letter-spacing:1px;">
                📌 Assignment Details
              </p>
              ${detailRow('Project', projectTitle)}
              ${detailRow('Assigned To', assignedTo || 'Adyapan Team')}
              ${detailRow('Estimated Delivery', deliveryFormatted)}
              ${detailRow('Status', '🟠 In Progress')}
            </td>
          </tr>
        </table>

        <table width="100%" cellpadding="0" cellspacing="0"
          style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;margin-bottom:28px;">
          <tr>
            <td style="padding:18px 22px;">
              <p style="margin:0 0 10px;font-size:14px;font-weight:700;color:#166534;">💡 Tips while we work</p>
              <ul style="margin:0;padding-left:18px;font-size:13px;color:#374151;line-height:2.2;">
                <li>You can track progress from your project dashboard.</li>
                <li>Our team may reach out if they need clarification.</li>
                <li>You'll be notified when the project is completed.</li>
              </ul>
            </td>
          </tr>
        </table>

        <table cellpadding="0" cellspacing="0" style="margin:0 auto 36px;">
          <tr>
            <td align="center" style="border-radius:14px;background:linear-gradient(135deg,#ffa800,#ff6b00);box-shadow:0 4px 20px rgba(255,107,0,0.35);">
              <a href="https://adyapan.com/company/my-projects"
                style="display:inline-block;padding:16px 40px;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;border-radius:14px;">
                Track Your Project →
              </a>
            </td>
          </tr>
        </table>

        <p style="margin:0 0 36px;font-size:14px;color:#374151;line-height:1.7;">
          Questions? Email us at
          <a href="mailto:support@adyapan.com" style="color:#ea580c;font-weight:600;">support@adyapan.com</a>.
        </p>
      </td>
    </tr>
    ${FOOTER()}
  ` + WRAPPER_CLOSE();

  const text = `Hi ${name},

Your project "${projectTitle}" has been assigned! 🎯

Assigned To: ${assignedTo || 'Adyapan Team'}
Estimated Delivery: ${deliveryFormatted}
Status: In Progress

Track your project: https://adyapan.com/company/my-projects

— Adyapan Skills Team`;

  return { html, text };
}

// ─────────────────────────────────────────────────────────────────────────────
/**
 * Sent to client when project is completed and delivered
 * @param {{ name, email, projectTitle, projectRequestId, githubLink, liveLink }} data
 * @returns {{ html: string, text: string }}
 */
function buildProjectCompletedEmail(data) {
  const { name, projectTitle, projectRequestId, githubLink, liveLink } = data;

  const html = WRAPPER_OPEN() + `
    ${HEADER('🎉', 'Project Completed!', 'Your project has been built and delivered')}
    <tr>
      <td style="padding:36px 40px 0;">
        <p style="margin:0 0 6px;font-size:18px;font-weight:700;color:#111827;">Hi ${name} 👋</p>
        <p style="margin:0 0 28px;font-size:14px;color:#6b7280;line-height:1.7;">
          Exciting news! Your project <strong style="color:#ea580c;">${projectTitle}</strong> has been
          completed and is ready for you. 🚀
        </p>

        <table width="100%" cellpadding="0" cellspacing="0"
          style="background:#f0fdf4;border:1.5px solid #bbf7d0;border-radius:16px;margin-bottom:28px;">
          <tr>
            <td style="padding:20px 24px;">
              <p style="margin:0 0 16px;font-size:11px;font-weight:700;color:#166534;text-transform:uppercase;letter-spacing:1px;">
                ✅ Delivery Details
              </p>
              ${detailRow('Project', projectTitle)}
              ${detailRow('Request ID', projectRequestId)}
              ${githubLink ? detailRow('GitHub Repository', `<a href="${githubLink}" style="color:#ea580c;">${githubLink}</a>`) : ''}
              ${liveLink ? detailRow('Live Demo', `<a href="${liveLink}" style="color:#ea580c;">${liveLink}</a>`) : ''}
              ${detailRow('Status', '✅ Delivered')}
            </td>
          </tr>
        </table>

        <table width="100%" cellpadding="0" cellspacing="0"
          style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;margin-bottom:28px;">
          <tr>
            <td style="padding:18px 22px;">
              <p style="margin:0 0 10px;font-size:14px;font-weight:700;color:#1e40af;">📋 Next Steps</p>
              <ul style="margin:0;padding-left:18px;font-size:13px;color:#374151;line-height:2.2;">
                <li>Review the delivered project and test all features.</li>
                <li>If you need any revisions, reply to this email.</li>
                <li>Leave a review to help other clients find us.</li>
              </ul>
            </td>
          </tr>
        </table>

        <table cellpadding="0" cellspacing="0" style="margin:0 auto 36px;">
          <tr>
            <td align="center" style="border-radius:14px;background:linear-gradient(135deg,#ffa800,#ff6b00);box-shadow:0 4px 20px rgba(255,107,0,0.35);">
              <a href="https://adyapan.com/company/my-projects"
                style="display:inline-block;padding:16px 40px;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;border-radius:14px;">
                View Delivered Project →
              </a>
            </td>
          </tr>
        </table>

        <p style="margin:0 0 36px;font-size:14px;color:#374151;line-height:1.7;">
          Thank you for trusting Adyapan Skills with your project! 🙏<br/>
          Questions? Email us at
          <a href="mailto:support@adyapan.com" style="color:#ea580c;font-weight:600;">support@adyapan.com</a>.
        </p>
      </td>
    </tr>
    ${FOOTER()}
  ` + WRAPPER_CLOSE();

  const text = `Hi ${name},

Your project "${projectTitle}" has been completed and delivered! 🎉

${githubLink ? `GitHub: ${githubLink}` : ''}
${liveLink ? `Live Demo: ${liveLink}` : ''}
Request ID: ${projectRequestId}

View your project: https://adyapan.com/company/my-projects

Thank you for choosing Adyapan Skills!

— Adyapan Skills Team`;

  return { html, text };
}

// ─────────────────────────────────────────────────────────────────────────────
/**
 * Sent to admin when a new project request is submitted
 * @param {{ projectTitle, category, budget, contactName, contactEmail, contactPhone, projectRequestId }} data
 * @returns {{ html: string, text: string }}
 */
function buildAdminNewProjectEmail(data) {
  const { projectTitle, category, budget, contactName, contactEmail, contactPhone, projectRequestId } = data;
  const date = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

  const html = WRAPPER_OPEN() + `
    ${HEADER('🆕', 'New Project Request', 'A client has submitted a new project build request')}
    <tr>
      <td style="padding:36px 40px 0;">
        <p style="margin:0 0 28px;font-size:14px;color:#6b7280;line-height:1.7;">
          A new project request has been submitted and requires your review.
        </p>

        <table width="100%" cellpadding="0" cellspacing="0"
          style="background:#fff7ed;border:1.5px solid #fed7aa;border-radius:16px;margin-bottom:28px;">
          <tr>
            <td style="padding:20px 24px;">
              <p style="margin:0 0 16px;font-size:11px;font-weight:700;color:#92400e;text-transform:uppercase;letter-spacing:1px;">
                📋 Project Details
              </p>
              ${detailRow('Project Title', projectTitle)}
              ${detailRow('Category', category)}
              ${detailRow('Budget', fmt(budget))}
              ${detailRow('Request ID', projectRequestId)}
              ${detailRow('Submitted On', date)}
            </td>
          </tr>
        </table>

        <table width="100%" cellpadding="0" cellspacing="0"
          style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:16px;margin-bottom:28px;">
          <tr>
            <td style="padding:20px 24px;">
              <p style="margin:0 0 16px;font-size:11px;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:1px;">
                👤 Client Information
              </p>
              ${detailRow('Name', contactName)}
              ${detailRow('Email', `<a href="mailto:${contactEmail}" style="color:#ea580c;">${contactEmail}</a>`)}
              ${detailRow('Phone', contactPhone)}
            </td>
          </tr>
        </table>

        <table cellpadding="0" cellspacing="0" style="margin:0 auto 36px;">
          <tr>
            <td align="center" style="border-radius:14px;background:linear-gradient(135deg,#ffa800,#ff6b00);box-shadow:0 4px 20px rgba(255,107,0,0.35);">
              <a href="https://adyapan.com/admin/project-requests"
                style="display:inline-block;padding:16px 40px;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;border-radius:14px;">
                Review in Admin Dashboard →
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    ${FOOTER()}
  ` + WRAPPER_CLOSE();

  const text = `New Project Request Received 🆕

Project: ${projectTitle}
Category: ${category}
Budget: ${fmt(budget)}
Request ID: ${projectRequestId}
Submitted: ${date}

Client: ${contactName}
Email: ${contactEmail}
Phone: ${contactPhone}

Review: https://adyapan.com/admin/project-requests

— Adyapan Skills System`;

  return { html, text };
}

module.exports = {
  buildProjectSubmissionEmail,
  buildProjectAssignedEmail,
  buildProjectCompletedEmail,
  buildAdminNewProjectEmail,
};
