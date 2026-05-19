import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { protectRouteByRole } from '@/lib/auth';
import Course from '@/models/Course';
import Enrollment from '@/models/Enrollment';
import Payment from '@/models/Payment';

export async function GET(request: NextRequest) {
  const auth = protectRouteByRole(request, ['ADMIN', 'COMPANY']);
  if (auth instanceof NextResponse) return auth;

  try {
    await connectToDatabase();

    const courses = await Course.find().lean();

    const enriched = await Promise.all(
      courses.map(async (course) => {
        const [totalEnrolled, totalRevenue] = await Promise.all([
          Enrollment.countDocuments({ courseSlug: course.slug }),
          Payment.aggregate([
            { $match: { courseSlug: course.slug, status: 'success' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } },
          ]),
        ]);

        return {
          id: course._id.toString(),
          slug: course.slug,
          title: course.title,
          subtitle: course.subtitle,
          duration: course.duration,
          totalLessons: course.totalLessons,
          category: course.category,
          level: course.level,
          totalModules: course.modules?.length ?? 0,
          totalEnrolled,
          totalRevenue: totalRevenue[0]?.total ?? 0,
          status: 'active',
        };
      })
    );

    return NextResponse.json({
      success: true,
      courses: enriched,
    });
  } catch (err: any) {
    console.error('[Admin Courses]', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
