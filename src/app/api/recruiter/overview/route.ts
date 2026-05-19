/**
 * GET /api/recruiter/overview
 * Get dashboard overview statistics for the recruiter.
 */

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { protectRouteByRole } from '@/lib/auth';
import AuthUser from '@/models/AuthUser';
import Enrollment from '@/models/Enrollment';
import RecruiterShortlist from '@/models/RecruiterShortlist';
import Placement from '@/models/Placement';
import RecruiterActivityLog from '@/models/RecruiterActivityLog';

export async function GET(request: NextRequest) {
  const auth = protectRouteByRole(request, ['COMPANY', 'ADMIN', 'SUPERADMIN']);
  if (auth instanceof NextResponse) return auth;

  try {
    await connectToDatabase();

    // Get all enrolled students
    const enrolledUserIds = await Enrollment.distinct('userId', {
      enrollmentStatus: { $in: ['active', 'completed'] },
    });

    const totalStudents = await AuthUser.countDocuments({
      role: 'STUDENT',
      accountStatus: 'approved',
      isActive: true,
      _id: { $in: enrolledUserIds },
    });

    // Get placed students
    const placedStudentIds = await Placement.distinct('userId', {
      isVerified: true,
    });

    const placedCount = placedStudentIds.length;
    const availableCount = totalStudents - placedCount;

    // Get shortlisted count
    const shortlistedCount = await RecruiterShortlist.countDocuments({
      recruiterId: auth.userId,
    });

    // Get recent activity count (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentActivity = await RecruiterActivityLog.countDocuments({
      recruiterId: auth.userId,
      createdAt: { $gte: thirtyDaysAgo },
    });

    return NextResponse.json({
      success: true,
      overview: {
        totalStudents,
        availableStudents: availableCount,
        placedStudents: placedCount,
        shortlistedStudents: shortlistedCount,
        recentActivity,
      },
    });

  } catch (err: any) {
    console.error('[Recruiter Overview]', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
