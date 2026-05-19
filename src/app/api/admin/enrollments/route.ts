/**
 * GET /api/admin/enrollments
 * Returns online enrollments with student info for admin dashboard.
 */
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { protectRouteByRole } from '@/lib/auth';
import { cleanText, escapeRegex } from '@/lib/security';
import Enrollment from '@/models/Enrollment';
import AuthUser from '@/models/AuthUser';

export async function GET(request: NextRequest) {
  const auth = protectRouteByRole(request, ['ADMIN', 'SUPERADMIN']);
  if (auth instanceof NextResponse) return auth;

  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const search = cleanText(searchParams.get('search') || '', 120);
    const status = searchParams.get('status') || 'all';
    const page   = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit  = Math.min(50, parseInt(searchParams.get('limit') || '20'));
    const skip   = (page - 1) * limit;

    // Build enrollment filter
    const enrollFilter: Record<string, unknown> = {};
    if (status !== 'all') enrollFilter.enrollmentStatus = status;

    // If search, find matching users first
    let userIds: string[] | undefined;
    if (search.trim()) {
      const safeSearch = escapeRegex(search.trim());
      const users = await AuthUser.find({
        role: 'STUDENT',
        $or: [
          { name:  { $regex: safeSearch, $options: 'i' } },
          { email: { $regex: safeSearch, $options: 'i' } },
          { phone: { $regex: safeSearch, $options: 'i' } },
        ],
      }).select('_id').lean();
      userIds = users.map((u: any) => u._id.toString());

      // Also search by course name
      const courseFilter = { courseName: { $regex: safeSearch, $options: 'i' } };
      enrollFilter.$or = [
        { userId: { $in: userIds } },
        courseFilter,
      ];
    }

    const [enrollments, total] = await Promise.all([
      Enrollment.find(enrollFilter).sort({ enrolledAt: -1 }).skip(skip).limit(limit).lean(),
      Enrollment.countDocuments(enrollFilter),
    ]);

    // Enrich with user data
    const userIdSet = Array.from(new Set(enrollments.map((e: any) => e.userId)));
    const users = await AuthUser.find({ _id: { $in: userIdSet } })
      .select('name email phone').lean();
    const userMap = Object.fromEntries(users.map((u: any) => [u._id.toString(), u]));

    const enriched = enrollments.map((e: any) => {
      const user = userMap[e.userId] || {};
      return {
        _id:              e._id.toString(),
        userId:           e.userId,
        userName:         (user as any).name || '',
        userEmail:        (user as any).email || '',
        userPhone:        (user as any).phone || '',
        courseSlug:       e.courseSlug,
        courseName:       e.courseName,
        planLabel:        e.planLabel,
        amountPaid:       e.amountPaid,
        enrollmentStatus: e.enrollmentStatus,
        enrolledAt:       e.enrolledAt,
        paymentId:        e.paymentId,
      };
    });

    return NextResponse.json({ success: true, enrollments: enriched, total, page, limit });
  } catch (err: any) {
    console.error('[Admin Enrollments]', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
