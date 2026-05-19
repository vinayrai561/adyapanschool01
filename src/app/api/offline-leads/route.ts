/**
 * POST /api/offline-leads
 *
 * Saves an offline internship enrollment enquiry.
 * - Validates all required fields
 * - Duplicate protection: same phone OR email within 24 hours → 409
 * - Saves to MongoDB Atlas via Mongoose
 * - Sends confirmation email (non-blocking)
 *
 * GET /api/offline-leads  (admin use)
 * - Returns all leads sorted by newest first
 */
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { connectToDatabase } from '@/lib/mongodb';
import { protectRouteByRole } from '@/lib/auth';
import {
  getClientIp,
  isRateLimited,
  isSpamSubmission,
  normalizeEmail,
  normalizePhone,
  rateLimitResponse,
  sanitizeMongoInput,
  verifyTurnstileToken,
} from '@/lib/security';
import OfflineInternshipLead from '@/models/OfflineInternshipLead';

const clean = (v: unknown) => String(v || '').trim();
const esc   = (v: unknown) =>
  clean(v)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

/* ── POST ─────────────────────────────────────────────────── */
export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  if (isRateLimited(`offline-leads:${ip}`, 5, 15 * 60 * 1000)) {
    return rateLimitResponse('Too many enrollment submissions. Please try again later.');
  }

  try {
    // Connect — throw if Atlas is unreachable
    await connectToDatabase();
  } catch {
    return NextResponse.json(
      { error: 'Database connection failed. Please try again later.' },
      { status: 503 }
    );
  }

  try {
    const body = sanitizeMongoInput(await req.json()) as Record<string, unknown>;
    if (isSpamSubmission(body)) {
      return NextResponse.json({ success: true });
    }

    const turnstileOk = await verifyTurnstileToken(
      typeof body.cfTurnstileToken === 'string' ? body.cfTurnstileToken : undefined,
      ip
    );
    if (!turnstileOk) {
      return NextResponse.json({ error: 'Security check failed. Please try again.' }, { status: 400 });
    }

    const name           = clean(body.name);
    const phone          = normalizePhone(body.phone);
    const email          = normalizeEmail(body.email);
    const college        = clean(body.college);
    const city           = clean(body.city);
    const courseInterest = clean(body.courseInterest || body.course);
    const preferredBatch = clean(body.preferredBatch || body.batch);

    // ── Validate required fields ──────────────────────────
    const missing: string[] = [];
    if (!name)           missing.push('Name');
    if (!phone)          missing.push('Phone');
    if (!email)          missing.push('Email');
    if (!courseInterest) missing.push('Course Interest');
    if (!preferredBatch) missing.push('Preferred Batch');

    if (missing.length) {
      return NextResponse.json(
        { error: `Please fill in: ${missing.join(', ')}` },
        { status: 400 }
      );
    }

    // Basic phone validation (10 digits)
    if (!/^\d{10}$/.test(phone.replace(/\s/g, ''))) {
      return NextResponse.json(
        { error: 'Please enter a valid 10-digit phone number.' },
        { status: 400 }
      );
    }

    // Basic email validation
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    // ── Duplicate protection: 24-hour window ─────────────
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const duplicate = await OfflineInternshipLead.findOne({
      $or: [
        { phone, createdAt: { $gte: since } },
        { email, createdAt: { $gte: since } },
      ],
    }).lean();

    if (duplicate) {
      return NextResponse.json(
        {
          error:     'You have already submitted an enquiry in the last 24 hours.',
          duplicate: true,
        },
        { status: 409 }
      );
    }

    // ── Save to Atlas ─────────────────────────────────────
    const lead = await OfflineInternshipLead.create({
      name,
      phone,
      email,
      college,
      city,
      courseInterest,
      preferredBatch,
      status: 'new',
      source: 'offline_services_page',
    });

    console.log(`[OfflineLead] Saved lead ${lead._id.toString()} | Course: ${courseInterest}`);

    // ── Send emails (non-blocking) ────────────────────────
    sendEmails(lead).catch((e) =>
      console.error('[OfflineLead] Email error:', e.message)
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Enrollment submitted successfully. Our counselor will contact you soon.',
        id:      lead._id.toString(),
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('[OfflineLead POST]', err.message);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again later.' },
      { status: 500 }
    );
  }
}

/* ── GET (admin) ──────────────────────────────────────────── */
export async function GET(req: NextRequest) {
  const auth = protectRouteByRole(req, ['ADMIN', 'SUPERADMIN']);
  if (auth instanceof NextResponse) return auth;

  try {
    await connectToDatabase();
  } catch {
    return NextResponse.json({ error: 'Database connection failed.' }, { status: 503 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const limit  = Math.min(Number(searchParams.get('limit') || 100), 500);
    const page   = Math.max(Number(searchParams.get('page') || 1), 1);

    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;

    const [leads, total] = await Promise.all([
      OfflineInternshipLead.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      OfflineInternshipLead.countDocuments(filter),
    ]);

    return NextResponse.json({ success: true, leads, total, page, limit });
  } catch (err: any) {
    console.error('[OfflineLead GET]', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/* ── Email helper ─────────────────────────────────────────── */
async function sendEmails(lead: any) {
  const emailFrom = process.env.EMAIL_FROM;
  const emailPass = process.env.EMAIL_PASS;
  if (!emailFrom || !emailPass) return;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: emailFrom, pass: emailPass },
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const s = {
    name:           esc(lead.name),
    phone:          esc(lead.phone),
    email:          esc(lead.email),
    college:        esc(lead.college || 'Not specified'),
    courseInterest: esc(lead.courseInterest || 'Not specified'),
    preferredBatch: esc(lead.preferredBatch || 'Not specified'),
    city:           esc(lead.city || 'Not specified'),
  };

  // Confirmation to student
  await transporter.sendMail({
    from:    `"Adyapan Skills" <${emailFrom}>`,
    to:      lead.email,
    subject: '✅ Enrollment Received — Adyapan Offline Internship',
    html: `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f5f0eb;font-family:sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;background:#f5f0eb;">
<tr><td align="center">
<table width="600" style="max-width:600px;width:100%;background:#fff;border-radius:24px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,.1);">
<tr><td style="background:linear-gradient(135deg,#ffa800,#ff6b00);padding:40px;text-align:center;">
  <h1 style="margin:0 0 8px;color:#fff;font-size:26px;font-weight:800;">Enrollment Received! 🎉</h1>
  <p style="margin:0;color:rgba(255,255,255,.88);font-size:14px;">Our counselor will contact you within 24 hours</p>
</td></tr>
<tr><td style="padding:36px 40px;">
  <p style="font-size:18px;font-weight:700;color:#111827;margin:0 0 6px;">Hi ${s.name},</p>
  <p style="font-size:14px;color:#6b7280;line-height:1.7;margin:0 0 24px;">
    Thank you for enrolling in Adyapan's <strong style="color:#ea580c;">6-Month Offline Internship Program</strong>.
    Our counselor will reach out to you soon with batch details and next steps.
  </p>
  <table width="100%" style="background:#fff7ed;border:1.5px solid #fed7aa;border-radius:12px;margin-bottom:24px;">
  <tr><td style="padding:16px 20px;">
    <p style="margin:0 0 12px;font-size:11px;font-weight:700;color:#92400e;text-transform:uppercase;">Your Enrollment Details</p>
    <p style="margin:4px 0;font-size:13px;color:#374151;"><b>Name:</b> ${s.name}</p>
    <p style="margin:4px 0;font-size:13px;color:#374151;"><b>Phone:</b> ${s.phone}</p>
    <p style="margin:4px 0;font-size:13px;color:#374151;"><b>Course:</b> ${s.courseInterest}</p>
    <p style="margin:4px 0;font-size:13px;color:#374151;"><b>Batch:</b> ${s.preferredBatch}</p>
    <p style="margin:4px 0;font-size:13px;color:#374151;"><b>City:</b> ${s.city}</p>
  </td></tr></table>
  <p style="font-size:13px;color:#6b7280;margin:0;">Questions? Call or WhatsApp: <a href="tel:8292244709" style="color:#ea580c;font-weight:700;">8292244709</a></p>
</td></tr>
<tr><td style="background:#1a1a2e;padding:20px 40px;text-align:center;">
  <p style="margin:0;font-size:12px;font-weight:700;color:#ffa800;">Adyapan Skills</p>
  <p style="margin:4px 0 0;font-size:11px;color:#6b7280;">&copy; ${new Date().getFullYear()} Adyapan Skills</p>
</td></tr>
</table></td></tr></table></body></html>`,
    text: `Hi ${lead.name}, your enrollment has been received. Our counselor will contact you within 24 hours. Call/WhatsApp: 8292244709 — Adyapan Skills`,
  });

  // Admin notification
  const adminEmail = process.env.ADMIN_EMAIL || '';
  if (!adminEmail) {
    console.warn('[offline-leads] ADMIN_EMAIL not set — skipping admin notification');
  } else {
  await transporter.sendMail({
    from:    `"Adyapan Skills" <${emailFrom}>`,
    to:      adminEmail,
    subject: `🆕 New Offline Internship Enrollment — ${lead.name}`,
    text: `New enrollment:
Name:    ${lead.name}
Phone:   ${lead.phone}
Email:   ${lead.email}
College: ${lead.college}
Course:  ${lead.courseInterest}
Batch:   ${lead.preferredBatch}
City:    ${lead.city}

View leads: ${appUrl}/admin/offline-leads`,
  });
}
}
