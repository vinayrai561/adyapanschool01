/**
 * GET /api/auth/me
 * Returns the current authenticated user from the JWT cookie.
 * Used by all portals (student, admin, superadmin) to verify session.
 */

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { protectRoute } from '@/lib/auth';
import AuthUser from '@/models/AuthUser';

export async function GET(request: NextRequest) {
  const auth = protectRoute(request);
  if (auth instanceof NextResponse) return auth;

  try {
    await connectToDatabase();

    const user = await AuthUser.findById(auth.userId)
      .select('-passwordHash -lockedUntil -failedLoginAttempts -signupIp -userAgent -lastUserAgent')
      .lean();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Block access if account is suspended or deactivated
    if (user.accountStatus === 'blocked' || !user.isActive) {
      return NextResponse.json({ error: 'Account suspended' }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id:              user._id.toString(),
        email:           user.email,
        name:            user.name,
        role:            user.role,
        accountStatus:   user.accountStatus,
        phone:           user.phone           || null,
        avatar:          user.avatar          || null,
        companyName:     user.companyName     || null,
        isEmailVerified: user.isEmailVerified,
        loginCount:      user.loginCount      || 0,
        lastLoginAt:     user.lastLoginAt     || null,
        lastLoginIp:     user.lastLoginIp     || null,
        invitedBy:       user.invitedBy       || null,
        createdAt:       user.createdAt,
        // Role-specific profiles
        studentProfile:  user.role === 'STUDENT' ? {
          selectedProgram: user.selectedProgram || null,
          selectedAmount:  user.selectedAmount  || null,
          enrolledCourses: user.enrolledCourses || [],
          purchasedCourses: user.purchasedCourses || [],
          wishlist:        user.wishlist        || [],
        } : null,
        companyProfile: user.role === 'COMPANY' ? {
          companyName: user.companyName || '',
        } : null,
      },
    });
  } catch (err: any) {
    console.error('[Auth/Me]', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
