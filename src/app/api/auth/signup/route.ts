/**
 * POST /api/auth/signup
 *
 * PUBLIC:  role=student      — no invite needed
 * PUBLIC:  role=organization — no invite needed (invite system removed)
 *
 * Admin accounts are created ONLY via the seed script.
 * No admin signup is allowed here.
 */

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/mongodb';
import {
  authCookieOptions,
  getClientIp,
  isRateLimited,
  normalizePhone,
  rateLimitResponse,
  requireJwtSecret,
  sanitizeMongoInput,
  verifyTurnstileToken,
} from '@/lib/security';
import AuthUser from '@/models/AuthUser';

const SIGNUP_LIMIT = 5;
const SIGNUP_WINDOW = 15 * 60 * 1000;

/* ── Validation schemas ── */
const StudentSchema = z
  .object({
    firstName:       z.string().min(2, 'First name must be at least 2 characters'),
    lastName:        z.string().min(2, 'Last name must be at least 2 characters'),
    email:           z.string().email('Invalid email address'),
    password:        z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    phone:           z.string().optional(),
    selectedProgram: z.string().optional(),
    selectedAmount:  z.number().positive().optional(),
  })
  .refine(d => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

const OrgSchema = z
  .object({
    fullName:        z.string().min(2, 'Full name must be at least 2 characters'),
    companyName:     z.string().min(2, 'Company name must be at least 2 characters'),
    email:           z.string().email('Invalid email address'),
    password:        z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    phone:           z.string().optional(),
  })
  .refine(d => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  if (isRateLimited(`auth-signup:${ip}`, SIGNUP_LIMIT, SIGNUP_WINDOW)) {
    return rateLimitResponse('Too many signup attempts. Please try again in 15 minutes.');
  }

  try {
    await connectToDatabase();

    const body = sanitizeMongoInput(await request.json());
    const { role, ...data } = body;

    const userAgent = request.headers.get('user-agent') || 'unknown';
    const now       = new Date();

    const turnstileOk = await verifyTurnstileToken(
      typeof body.cfTurnstileToken === 'string' ? body.cfTurnstileToken : undefined,
      ip
    );
    if (!turnstileOk) {
      return NextResponse.json({ error: 'Security check failed. Please try again.' }, { status: 400 });
    }

    /* ── Block any attempt to self-register as admin ── */
    if (role === 'admin' || role === 'ADMIN' || role === 'superadmin') {
      return NextResponse.json(
        { error: 'You are not authorized to create this account.' },
        { status: 403 }
      );
    }

    /* ══════════════════════════════════════════
       STUDENT SIGNUP
    ══════════════════════════════════════════ */
    if (role === 'student') {
      const parsed = StudentSchema.safeParse(data);
      if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
      }
      const d = parsed.data;

      const phone = normalizePhone(d.phone);
      const existing = await AuthUser.findOne({
        $or: [
          { email: d.email.toLowerCase().trim() },
          ...(phone ? [{ phone }] : []),
        ],
      });
      if (existing) {
        return NextResponse.json({ error: 'Email or phone already registered' }, { status: 409 });
      }

      const passwordHash = await bcrypt.hash(d.password, 10);
      const user = await AuthUser.create({
        email:            d.email.toLowerCase().trim(),
        name:             `${d.firstName.trim()} ${d.lastName.trim()}`,
        passwordHash,
        role:             'STUDENT',
        accountStatus:    'approved',
        phone,
        selectedProgram:  d.selectedProgram || null,
        selectedAmount:   d.selectedAmount  || null,
        purchasedCourses: [],
        enrolledCourses:  [],
        wishlist:         [],
        loginCount:       0,
        signupIp:         ip,
        userAgent,
        signupAt:         now,
      });

      console.log(`[Signup] STUDENT account created | User: ${user._id.toString()} | IP: ${ip}`);

      // Welcome email (non-blocking)
      Promise.all([import('@/lib/email'), import('@/lib/db-service')]).then(
        async ([{ sendWelcomeEmail }, { logEmail }]) => {
          try {
            const sent = await sendWelcomeEmail({ name: user.name, email: user.email, role: 'student' });
            await logEmail({ userId: user._id.toString(), email: user.email, emailType: 'welcome', subject: 'Welcome to Adyapan Skills!', status: sent ? 'sent' : 'failed', provider: 'sendgrid' });
          } catch (e: any) { console.warn('[Signup] Welcome email failed:', e?.message); }
        }
      );

      const token = jwt.sign(
        { userId: user._id.toString(), email: user.email, role: user.role },
        requireJwtSecret(),
        { expiresIn: '7d' }
      );

      const res = NextResponse.json({
        success: true,
        user: { id: user._id.toString(), email: user.email, name: user.name, role: user.role, accountStatus: user.accountStatus },
      }, { status: 201 });

      res.cookies.set('authToken', token, authCookieOptions(7 * 24 * 60 * 60));
      return res;
    }

    /* ══════════════════════════════════════════
       ORGANIZATION SIGNUP — no invite needed
    ══════════════════════════════════════════ */
    if (role === 'organization') {
      const parsed = OrgSchema.safeParse(data);
      if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
      }
      const d = parsed.data;

      const phone = normalizePhone(d.phone);
      const existing = await AuthUser.findOne({
        $or: [
          { email: d.email.toLowerCase().trim() },
          ...(phone ? [{ phone }] : []),
        ],
      });
      if (existing) {
        return NextResponse.json({ error: 'Email or phone already registered' }, { status: 409 });
      }

      const passwordHash = await bcrypt.hash(d.password, 10);
      const user = await AuthUser.create({
        email:          d.email.toLowerCase().trim(),
        name:           d.fullName.trim(),
        passwordHash,
        role:           'COMPANY',
        accountStatus:  'approved',
        phone,
        companyName:    d.companyName.trim(),
        purchasedCourses: [],
        enrolledCourses:  [],
        wishlist:         [],
        loginCount:       0,
        signupIp:         ip,
        userAgent,
        signupAt:         now,
      });

      console.log(`[Signup] COMPANY account created | User: ${user._id.toString()} | IP: ${ip}`);

      // Welcome email (non-blocking)
      Promise.all([import('@/lib/email'), import('@/lib/db-service')]).then(
        async ([{ sendWelcomeEmail }, { logEmail }]) => {
          try {
            const sent = await sendWelcomeEmail({ name: user.name, email: user.email, role: 'organization' });
            await logEmail({ userId: user._id.toString(), email: user.email, emailType: 'welcome', subject: 'Welcome to Adyapan Portal!', status: sent ? 'sent' : 'failed', provider: 'sendgrid' });
          } catch (e: any) { console.warn('[Signup] Welcome email failed:', e?.message); }
        }
      );

      const token = jwt.sign(
        { userId: user._id.toString(), email: user.email, role: user.role },
        requireJwtSecret(),
        { expiresIn: '7d' }
      );

      const res = NextResponse.json({
        success: true,
        user: { id: user._id.toString(), email: user.email, name: user.name, role: user.role, accountStatus: user.accountStatus },
      }, { status: 201 });

      res.cookies.set('authToken', token, authCookieOptions(7 * 24 * 60 * 60));
      return res;
    }

    return NextResponse.json(
      { error: 'You are not authorized to create this account.' },
      { status: 403 }
    );

  } catch (error) {
    if ((error as any)?.name === 'ZodError') {
      return NextResponse.json({ error: (error as any).errors[0].message }, { status: 400 });
    }
    console.error('[Signup] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
