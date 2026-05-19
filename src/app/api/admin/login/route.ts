/**
 * POST /api/admin/login
 *
 * Secure admin-only login with 3-factor verification:
 *  1. Email must match ADMIN_EMAIL env var
 *  2. Password must be correct (bcrypt)
 *  3. Access key must match ADMIN_ACCESS_KEY env var
 *
 * Security:
 *  - IP rate limit: 5 attempts / 15 min
 *  - Account lockout: 5 failed attempts → locked 30 min
 *  - JWT in httpOnly secure cookie
 *  - No public signup — admin accounts created via scripts only
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
  rateLimitResponse,
  requireJwtSecret,
  sanitizeMongoInput,
} from '@/lib/security';
import AuthUser from '@/models/AuthUser';

const ALLOWED_ADMIN_EMAIL = (process.env.ADMIN_EMAIL || '').toLowerCase().trim();
const ADMIN_ACCESS_KEY    = process.env.ADMIN_ACCESS_KEY || '';

const LoginSchema = z.object({
  email:     z.string().email(),
  password:  z.string().min(1),
  accessKey: z.string().min(1, 'Access key is required'),
});

/* ── IP rate limiter ── */
const LOGIN_LIMIT = 5;
const LOGIN_WINDOW = 15 * 60 * 1000;

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  if (isRateLimited(`admin-login:${ip}`, LOGIN_LIMIT, LOGIN_WINDOW)) {
    return rateLimitResponse('Too many login attempts. Please try again in 15 minutes.');
  }

  try {
    await connectToDatabase();

    if (!ALLOWED_ADMIN_EMAIL || !ADMIN_ACCESS_KEY) {
      return NextResponse.json({ error: 'Admin login is not configured.' }, { status: 503 });
    }

    const body   = sanitizeMongoInput(await request.json());
    const parsed = LoginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const { email, password, accessKey } = parsed.data;
    const normalizedEmail = email.toLowerCase().trim();

    /* ── 1. Access key check (first — fast fail) ── */
    if (accessKey !== ADMIN_ACCESS_KEY) {
      console.warn(`[AdminLogin] ❌ Invalid access key from IP: ${ip}`);
      return NextResponse.json({ error: 'Invalid access key.' }, { status: 403 });
    }

    /* ── 2. Email whitelist check ── */
    if (ALLOWED_ADMIN_EMAIL && normalizedEmail !== ALLOWED_ADMIN_EMAIL) {
      console.warn(`[AdminLogin] ❌ Unauthorized email: ${normalizedEmail} | IP: ${ip}`);
      return NextResponse.json({ error: 'You are not authorized to access the admin panel.' }, { status: 403 });
    }

    /* ── 3. Find user ── */
    const user = await AuthUser.findOne({ email: normalizedEmail });
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN')) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    /* ── 4. Account lockout check ── */
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const minutesLeft = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
      return NextResponse.json(
        { error: `Account locked. Try again in ${minutesLeft} minute${minutesLeft > 1 ? 's' : ''}.` },
        { status: 423 }
      );
    }

    /* ── 5. Password check ── */
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
      if (user.failedLoginAttempts >= 5) {
        user.lockedUntil         = new Date(Date.now() + 30 * 60 * 1000);
        user.failedLoginAttempts = 0;
        await user.save();
        return NextResponse.json({ error: 'Too many failed attempts. Account locked for 30 minutes.' }, { status: 423 });
      }
      await user.save();
      const remaining = 5 - user.failedLoginAttempts;
      return NextResponse.json(
        { error: `Invalid credentials. ${remaining} attempt${remaining > 1 ? 's' : ''} remaining.` },
        { status: 401 }
      );
    }

    /* ── 6. Account status ── */
    if (user.accountStatus === 'blocked') {
      return NextResponse.json({ error: 'Account suspended. Contact support.' }, { status: 403 });
    }

    /* ── 7. Success ── */
    user.failedLoginAttempts = 0;
    user.lockedUntil         = undefined;
    user.lastLoginAt         = new Date();
    user.loginCount          = (user.loginCount || 0) + 1;
    user.lastLoginIp         = ip;
    await user.save();

    console.log(`[AdminLogin] ${user.role} login succeeded | User: ${user._id.toString()} | IP: ${ip}`);

    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email, role: user.role, name: user.name },
      requireJwtSecret(),
      { expiresIn: '8h' }
    );

    const res = NextResponse.json({
      success: true,
      user: { id: user._id.toString(), email: user.email, name: user.name, role: user.role },
    });

    res.cookies.set('authToken', token, authCookieOptions(8 * 60 * 60));

    return res;

  } catch (err: any) {
    console.error('[AdminLogin] Error:', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
