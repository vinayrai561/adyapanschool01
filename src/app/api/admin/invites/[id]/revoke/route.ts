/**
 * POST /api/admin/invites/[id]/revoke
 *
 * Revoke an unused invite.
 * Only SUPERADMIN can revoke invites.
 */

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { requireSuperAdmin } from '@/lib/auth';
import AdminInvite from '@/models/AdminInvite';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireSuperAdmin(request);
  if (auth instanceof NextResponse) return auth;

  try {
    await connectToDatabase();
    const { id } = await params;
    const invite = await AdminInvite.findById(id);

    if (!invite) {
      return NextResponse.json({ error: 'Invite not found' }, { status: 404 });
    }
    if (invite.used) {
      return NextResponse.json(
        { error: 'Cannot revoke an invite that has already been used.' },
        { status: 400 }
      );
    }
    if (invite.revokedAt) {
      return NextResponse.json(
        { error: 'This invite has already been revoked.' },
        { status: 400 }
      );
    }

    invite.revokedAt = new Date();
    invite.revokedBy = auth.userId;
    await invite.save();

    console.log(`[AdminInvites] 🚫 Revoked invite ${invite._id} for ${invite.email} | By: ${auth.email}`);

    return NextResponse.json({ success: true, message: 'Invite revoked successfully' });

  } catch (err: any) {
    console.error('[AdminInvites Revoke]', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
