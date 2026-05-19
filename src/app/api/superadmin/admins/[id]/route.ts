/**
 * PATCH  /api/superadmin/admins/[id]  — update admin (block/unblock/activate)
 * DELETE /api/superadmin/admins/[id]  — delete admin (SUPERADMIN only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { requireSuperAdmin } from '@/lib/auth';
import AuthUser from '@/models/AuthUser';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireSuperAdmin(request);
  if (auth instanceof NextResponse) return auth;
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await request.json();
    const { accountStatus, isActive, unlockAccount } = body;
    const admin = await AuthUser.findById(id);
    if (!admin) return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    if (admin.role === 'SUPERADMIN' && admin._id.toString() === auth.userId) {
      return NextResponse.json({ error: 'Cannot modify your own superadmin account' }, { status: 400 });
    }
    if (accountStatus) admin.accountStatus = accountStatus;
    if (typeof isActive === 'boolean') admin.isActive = isActive;
    if (unlockAccount) { admin.lockedUntil = undefined; admin.failedLoginAttempts = 0; }
    await admin.save();
    return NextResponse.json({ success: true, message: 'Admin updated' });
  } catch (err: any) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireSuperAdmin(request);
  if (auth instanceof NextResponse) return auth;
  try {
    await connectToDatabase();
    const { id } = await params;
    const admin = await AuthUser.findById(id);
    if (!admin) return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    if (admin._id.toString() === auth.userId) return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
    if (admin.role === 'SUPERADMIN') return NextResponse.json({ error: 'Cannot delete another superadmin' }, { status: 403 });
    await AuthUser.deleteOne({ _id: id });
    return NextResponse.json({ success: true, message: 'Admin deleted' });
  } catch (err: any) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
