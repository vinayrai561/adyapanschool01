/**
 * DELETE /api/admin/invite-codes/:id — revoke/delete an invite code (ADMIN only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { protectRouteByRole } from '@/lib/auth';
import InviteCode from '@/models/InviteCode';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = protectRouteByRole(request, ['ADMIN']);
  if (auth instanceof NextResponse) return auth;

  try {
    await connectToDatabase();
    const { id } = await params;
    const invite = await InviteCode.findById(id);
    if (!invite) return NextResponse.json({ error: 'Invite code not found' }, { status: 404 });
    if (invite.used) return NextResponse.json({ error: 'Cannot delete a used invite code' }, { status: 400 });

    await invite.deleteOne();
    console.log(`[InviteCode] 🗑️ Deleted: ${invite.code} by admin ${auth.userId}`);

    return NextResponse.json({ success: true, message: 'Invite code deleted' });
  } catch (err: any) {
    console.error('[InviteCode DELETE]', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
