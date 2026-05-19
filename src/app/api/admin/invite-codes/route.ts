/**
 * GET  /api/admin/invite-codes  — list all invite codes (ADMIN only)
 * POST /api/admin/invite-codes  — create a new invite code (ADMIN only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { protectRouteByRole } from '@/lib/auth';
import InviteCode from '@/models/InviteCode';
import AuthUser from '@/models/AuthUser';

function generateCode(role: string): string {
  const prefix = role === 'ADMIN' ? 'ADYP-ADM' : 'ADYP-ORG';
  const chars  = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no ambiguous chars
  let rand = '';
  for (let i = 0; i < 8; i++) rand += chars[Math.floor(Math.random() * chars.length)];
  return `${prefix}-${rand}`;
}

/* ── GET: list invite codes ── */
export async function GET(request: NextRequest) {
  const auth = protectRouteByRole(request, ['ADMIN']);
  if (auth instanceof NextResponse) return auth;

  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || 'all'; // all | active | used | expired

    const now   = new Date();
    let query: any = {};
    if (filter === 'active')  query = { used: false, expiresAt: { $gt: now } };
    if (filter === 'used')    query = { used: true };
    if (filter === 'expired') query = { used: false, expiresAt: { $lte: now } };

    const codes = await InviteCode.find(query).sort({ createdAt: -1 }).lean();

    return NextResponse.json({
      success: true,
      codes: codes.map(c => ({
        id:             c._id.toString(),
        code:           c.code,
        role:           c.role,
        emailAllowed:   c.emailAllowed || null,
        used:           c.used,
        usedBy:         c.usedBy || null,
        usedAt:         c.usedAt || null,
        expiresAt:      c.expiresAt,
        createdBy:      c.createdBy,
        createdByEmail: c.createdByEmail,
        note:           c.note || '',
        isExpired:      c.expiresAt < now,
        isActive:       !c.used && c.expiresAt > now,
        createdAt:      c.createdAt,
      })),
      total: codes.length,
    });
  } catch (err: any) {
    console.error('[InviteCodes GET]', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/* ── POST: create invite code ── */
export async function POST(request: NextRequest) {
  const auth = protectRouteByRole(request, ['ADMIN']);
  if (auth instanceof NextResponse) return auth;

  try {
    await connectToDatabase();

    const body = await request.json();
    const { role, emailAllowed, note, expiresInDays = 7 } = body;

    if (!role || !['COMPANY', 'ADMIN'].includes(role)) {
      return NextResponse.json({ error: 'role must be COMPANY or ADMIN' }, { status: 400 });
    }
    if (expiresInDays < 1 || expiresInDays > 365) {
      return NextResponse.json({ error: 'expiresInDays must be between 1 and 365' }, { status: 400 });
    }

    // Get admin info
    const admin = await AuthUser.findById(auth.userId).lean();
    if (!admin) return NextResponse.json({ error: 'Admin not found' }, { status: 404 });

    // Generate unique code (retry up to 5 times on collision)
    let code = '';
    for (let i = 0; i < 5; i++) {
      const candidate = generateCode(role);
      const exists = await InviteCode.findOne({ code: candidate });
      if (!exists) { code = candidate; break; }
    }
    if (!code) return NextResponse.json({ error: 'Failed to generate unique code' }, { status: 500 });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    const invite = await InviteCode.create({
      code,
      role,
      emailAllowed: emailAllowed?.toLowerCase().trim() || '',
      expiresAt,
      createdBy:      auth.userId,
      createdByEmail: (admin as any).email,
      note:           note?.trim() || '',
    });

    console.log(`[InviteCode] ✅ Created: ${code} | Role: ${role} | By: ${(admin as any).email}`);

    return NextResponse.json({
      success: true,
      invite: {
        id:           invite._id.toString(),
        code:         invite.code,
        role:         invite.role,
        emailAllowed: invite.emailAllowed || null,
        expiresAt:    invite.expiresAt,
        note:         invite.note,
        createdAt:    invite.createdAt,
      },
    }, { status: 201 });

  } catch (err: any) {
    console.error('[InviteCodes POST]', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
