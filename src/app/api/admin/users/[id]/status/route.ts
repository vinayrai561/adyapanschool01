/**
 * PATCH /api/admin/users/:id/status
 * Body: { status: 'approved' | 'blocked' | 'pending' }
 *
 * ADMIN only — approve or block org/admin accounts
 */

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { protectRouteByRole } from '@/lib/auth';
import AuthUser from '@/models/AuthUser';
import { logAdminActivity } from '@/lib/db-service';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = protectRouteByRole(request, ['ADMIN']);
  if (auth instanceof NextResponse) return auth;

  try {
    await connectToDatabase();
    const { id } = await params;
    const { status } = await request.json();

    if (!['approved', 'blocked', 'pending'].includes(status)) {
      return NextResponse.json({ error: 'status must be approved, blocked, or pending' }, { status: 400 });
    }

    const user = await AuthUser.findById(id);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Cannot change status of STUDENT accounts via this endpoint
    if (user.role === 'STUDENT') {
      return NextResponse.json({ error: 'Use a different endpoint to manage student accounts' }, { status: 400 });
    }

    // Cannot block yourself
    if (user._id.toString() === auth.userId) {
      return NextResponse.json({ error: 'You cannot change your own account status' }, { status: 400 });
    }

    const prevStatus = user.accountStatus;
    user.accountStatus = status as any;
    if (status === 'approved') {
      user.approvedAt = new Date();
      user.approvedBy = auth.userId;
    }
    await user.save();

    // Log admin activity
    await logAdminActivity({
      adminId:        auth.userId,
      adminEmail:     auth.email,
      actionType:     'update_user',
      description:    `Changed account status of ${user.email} from ${prevStatus} to ${status}`,
      targetUserId:   user._id.toString(),
      targetUserEmail: user.email,
      metadata:       { prevStatus, newStatus: status },
      ipAddress:      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '',
    });

    console.log(`[UserStatus] ${user.email}: ${prevStatus} → ${status} by ${auth.email}`);

    return NextResponse.json({
      success: true,
      user: {
        id:            user._id.toString(),
        email:         user.email,
        name:          user.name,
        role:          user.role,
        accountStatus: user.accountStatus,
      },
    });
  } catch (err: any) {
    console.error('[UserStatus PATCH]', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
