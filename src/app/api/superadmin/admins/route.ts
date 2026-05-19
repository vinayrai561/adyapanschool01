/**
 * GET  /api/superadmin/admins  — list all admins (SUPERADMIN only)
 * POST /api/superadmin/admins  — create admin directly (SUPERADMIN only)
 */

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/mongodb';
import { requireSuperAdmin } from '@/lib/auth';
import AuthUser from '@/models/AuthUser';
import AdminInvite from '@/models/AdminInvite';

export async function GET(request: NextRequest) {
  const auth = requireSuperAdmin(request);
  if (auth instanceof NextResponse) return auth;

  try {
    await connectToDatabase();

    const admins = await AuthUser.find({ role: { $in: ['ADMIN', 'SUPERADMIN'] } })
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .lean();

    const now = new Date();

    return NextResponse.json({
      success: true,
      admins: admins.map(a => ({
        id:            a._id.toString(),
        name:          a.name,
        email:         a.email,
        role:          a.role,
        accountStatus: a.accountStatus,
        isActive:      a.isActive,
        phone:         a.phone || '',
        loginCount:    a.loginCount || 0,
        lastLoginAt:   a.lastLoginAt || null,
        createdAt:     a.createdAt,
        invitedBy:     a.invitedBy || null,
        isLocked:      !!(a.lockedUntil && a.lockedUntil > now),
        lockedUntil:   a.lockedUntil || null,
      })),
      total: admins.length,
    });
  } catch (err: any) {
    console.error('[SuperAdmin Admins GET]', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

const CreateAdminSchema = z.object({
  name:     z.string().min(2),
  email:    z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role:     z.enum(['ADMIN', 'SUPERADMIN']).default('ADMIN'),
  phone:    z.string().optional(),
});

export async function POST(request: NextRequest) {
  const auth = requireSuperAdmin(request);
  if (auth instanceof NextResponse) return auth;

  try {
    await connectToDatabase();

    const body = await request.json();
    const parsed = CreateAdminSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }
    const { name, email, password, role, phone } = parsed.data;

    const existing = await AuthUser.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const admin = await AuthUser.create({
      name:            name.trim(),
      email:           email.toLowerCase().trim(),
      passwordHash,
      role,
      accountStatus:   'approved',
      phone:           phone?.trim() || '',
      isActive:        true,
      isEmailVerified: true,
      invitedBy:       auth.userId,
      approvedBy:      auth.userId,
      approvedAt:      new Date(),
      signupAt:        new Date(),
    });

    console.log(`[SuperAdmin] ✅ Created ${role}: ${admin.email} | By: ${auth.email}`);

    return NextResponse.json({
      success: true,
      admin: {
        id:    admin._id.toString(),
        name:  admin.name,
        email: admin.email,
        role:  admin.role,
      },
    }, { status: 201 });

  } catch (err: any) {
    console.error('[SuperAdmin Admins POST]', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
