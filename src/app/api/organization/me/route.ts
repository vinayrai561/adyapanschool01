/**
 * GET /api/organization/me
 *
 * Returns the current organization user from JWT.
 * Checks the organizationusers collection — not AuthUser.
 */

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { protectRoute } from '@/lib/auth';
import OrganizationUser from '@/models/OrganizationUser';

export async function GET(request: NextRequest) {
  const auth = protectRoute(request);
  if (auth instanceof NextResponse) return auth;

  // Must be COMPANY role
  if (auth.role !== 'COMPANY') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    await connectToDatabase();

    const user = await OrganizationUser.findById(auth.userId)
      .select('-passwordHash -lockedUntil -failedLoginAttempts')
      .lean();

    if (!user) {
      return NextResponse.json({ error: 'Organization user not found' }, { status: 404 });
    }

    if (user.accountStatus === 'suspended' || !user.isApproved) {
      return NextResponse.json({ error: 'Account suspended' }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id:            user._id.toString(),
        email:         user.email,
        name:          user.name,
        role:          'COMPANY',
        isApproved:    user.isApproved,
        accountStatus: user.accountStatus,
        loginCount:    user.loginCount || 0,
        lastLoginAt:   user.lastLoginAt || null,
        createdAt:     user.createdAt,
      },
    });
  } catch (err: any) {
    console.error('[OrgMe]', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
