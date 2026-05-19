/**
 * POST /api/admin/invites/signup
 *
 * Complete admin/organization signup via invite token.
 *
 * Security rules:
 *  - Token must exist, be unused, not expired, not revoked
 *  - Email must exactly match invite email
 *  - Mobile number must exactly match invite mobile number
 *  - Role is assigned from invite, NEVER from frontend
 *  - Rate limited: 5 attempts per IP per 15 minutes
 *  - Failed attempts are logged on the invite record
 */

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
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
import AdminInvite from '@/models/AdminInvite';
import AuthUser from '@/models/AuthUser';

/* ── Rate limiter (in-memory, per IP) ── */
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

/* ── Validation schema ── */
const InviteSignupSchema = z
  .object({
    token:           z.string().min(1, 'Invite token is required'),
    fullName:        z.string().min(2, 'Full name must be at least 2 characters').max(100),
    email:           z.string().email('Invalid email address'),
    mobileNumber:    z.string().min(10, 'Mobile number must be at least 10 digits').max(15).regex(/^\+?[0-9\s\-()]+$/, 'Invalid mobile number format'),
    password:        z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    companyName:     z.string().max(200).optional(),
  })
  .refine(d => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const userAgent = request.headers.get('user-agent') || 'unknown';

  if (isRateLimited(`invite-signup:${ip}`, MAX_ATTEMPTS, WINDOW_MS)) {
    console.warn(`[InviteSignup] ⚠️ Rate limited: ${ip}`);
    return rateLimitResponse('Too many signup attempts. Please try again in 15 minutes.');
  }

  try {
    await connectToDatabase();

    const body = sanitizeMongoInput(await request.json());
    const parsed = InviteSignupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }
    const d = parsed.data;
    const now = new Date();

    // ── 1. Find invite by token ──
    const invite = await AdminInvite.findOne({ token: d.token });

    if (!invite) {
      console.warn(`[InviteSignup] ❌ Invalid token | IP: ${ip}`);
      return NextResponse.json(
        { error: 'Invalid invite link. Please contact your administrator.' },
        { status: 403 }
      );
    }

    // Helper to log failed attempt and return error
    const failInvite = async (reason: string, logMsg: string) => {
      invite.failedAttempts = (invite.failedAttempts || 0) + 1;
      invite.lastFailedAt = now;
      await invite.save();
      console.warn(`[InviteSignup] Failed invite signup: ${logMsg} | IP: ${ip}`);
      return NextResponse.json({ error: reason }, { status: 403 });
    };

    // ── 2. Check token not used ──
    if (invite.used) {
      return failInvite(
        'This invite has already been used.',
        'Used invite'
      );
    }

    // ── 3. Check token not expired ──
    if (invite.expiresAt < now) {
      return failInvite(
        'This invite has expired. Please request a new one from your administrator.',
        'Expired invite'
      );
    }

    // ── 4. Check token not revoked ──
    if (invite.revokedAt) {
      return failInvite(
        'This invite has been revoked. Please contact your administrator.',
        'Revoked invite'
      );
    }

    // ── 5. Verify email matches invite ──
    if (invite.email !== d.email.toLowerCase().trim()) {
      return failInvite(
        'The email address does not match the invite. Please use the email this invite was sent to.',
        `Email mismatch (expected: ${invite.email}, got: ${d.email.toLowerCase()})`
      );
    }

    // ── 6. Verify mobile number matches invite ──
    const normalizedInput = normalizeMobile(d.mobileNumber);
    const normalizedInvite = normalizeMobile(invite.mobileNumber);
    if (!timingSafeEqual(normalizedInput, normalizedInvite)) {
      return failInvite(
        'The mobile number does not match the invite. Please use the mobile number registered with this invite.',
        `Mobile mismatch | IP: ${ip}`
      );
    }

    // ── 7. Check email not already registered ──
    const existing = await AuthUser.findOne({ email: d.email.toLowerCase().trim() });
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    // ── 8. Map invite role to AuthUser role ──
    const roleMap: Record<string, string> = {
      ADMIN:        'ADMIN',
      ORGANIZATION: 'COMPANY',
      SUPERADMIN:   'ADMIN',
    };
    const assignedRole = roleMap[invite.role] || 'COMPANY';

    // ── 9. Create user ──
    const passwordHash = await bcrypt.hash(d.password, 12);

    const user = await AuthUser.create({
      email:          d.email.toLowerCase().trim(),
      name:           d.fullName.trim(),
      passwordHash,
      role:           assignedRole,
      accountStatus:  'approved',
      phone:          normalizedInput,
      companyName:    d.companyName?.trim() || '',
      purchasedCourses: [],
      enrolledCourses:  [],
      wishlist:         [],
      loginCount:       0,
      inviteCodeUsed:   invite._id.toString(),
      invitedBy:        invite.invitedBy,
      approvedAt:       now,
      approvedBy:       invite.invitedBy,
      signupIp:         ip,
      userAgent,
      signupAt:         now,
      isEmailVerified:  true,
    });

    // ── 10. Mark invite as used ──
    invite.used   = true;
    invite.usedBy = user._id.toString();
    invite.usedAt = now;
    await invite.save();

    console.log(`[InviteSignup] ${assignedRole} account created | User: ${user._id.toString()} | Invite: ${invite._id} | IP: ${ip}`);

    // ── 11. Issue JWT ──
    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email, role: user.role },
      requireJwtSecret(),
      { expiresIn: '7d' }
    );

    const res = NextResponse.json({
      success: true,
      user: {
        id:            user._id.toString(),
        email:         user.email,
        name:          user.name,
        role:          user.role,
        accountStatus: user.accountStatus,
      },
    }, { status: 201 });

    res.cookies.set('authToken', token, authCookieOptions(7 * 24 * 60 * 60));

    return res;

  } catch (err: any) {
    console.error('[InviteSignup]', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/* ── Helpers ── */
function normalizeMobile(mobile: string): string {
  return mobile.replace(/[\s\-()]/g, '');
}

/**
 * Timing-safe string comparison to prevent timing attacks on mobile verification
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    // Still do a comparison to avoid timing leak on length
    crypto.timingSafeEqual(
      Buffer.from(a.padEnd(b.length, '0')),
      Buffer.from(b.padEnd(a.length, '0'))
    );
    return false;
  }
  try {
    return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
  } catch {
    return false;
  }
}
