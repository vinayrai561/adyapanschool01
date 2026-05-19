import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { protectRouteByRole } from '@/lib/auth';
import AuthUser from '@/models/AuthUser';
import Enrollment from '@/models/Enrollment';
import Payment from '@/models/Payment';
import Progress from '@/models/Progress';
import Certificate from '@/models/Certificate';

export async function GET(request: NextRequest) {
  const auth = protectRouteByRole(request, ['ADMIN', 'COMPANY']);
  if (auth instanceof NextResponse) return auth;

  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const course = searchParams.get('course') || '';
    const plan = searchParams.get('plan') || '';
    const paymentStatus = searchParams.get('paymentStatus') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Build user query
    const userQuery: any = { role: 'STUDENT' };
    if (search) {
      userQuery.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const [students, total] = await Promise.all([
      AuthUser.find(userQuery)
        .select('-passwordHash')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      AuthUser.countDocuments(userQuery),
    ]);

    // Enrich each student with enrollment/payment/progress/certificate data
    const enriched = await Promise.all(
      students.map(async (student) => {
        const userId = student._id.toString();

        const enrollments = await Enrollment.find({ userId }).lean();
        const payments = await Payment.find({ userId, status: 'success' }).lean();
        const certificates = await Certificate.find({ userId }).lean();

        // Filter by course/plan/paymentStatus if provided
        let filteredEnrollments = enrollments;
        if (course) filteredEnrollments = filteredEnrollments.filter(e => e.courseSlug === course || e.courseName.toLowerCase().includes(course.toLowerCase()));
        if (plan) filteredEnrollments = filteredEnrollments.filter(e => e.planLabel?.toLowerCase().includes(plan.toLowerCase()));

        const totalPaid = payments.reduce((sum, p) => sum + (p.totalAmount || 0), 0);
        const latestPayment = payments.sort((a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime())[0];

        // Get progress for each enrollment
        const enrollmentsWithProgress = await Promise.all(
          filteredEnrollments.map(async (enr) => {
            const progress = await Progress.findOne({ userId, courseSlug: enr.courseSlug }).lean();
            const cert = certificates.find(c => c.courseSlug === enr.courseSlug);
            return {
              courseSlug: enr.courseSlug,
              courseName: enr.courseName,
              planLabel: enr.planLabel,
              amountPaid: enr.amountPaid,
              enrolledAt: enr.enrolledAt,
              progressPercent: (progress as any)?.progressPercent ?? 0,
              certificateStatus: cert ? cert.status : 'not_issued',
              certificateId: cert ? cert.certificateId : null,
            };
          })
        );

        // Apply paymentStatus filter
        if (paymentStatus && latestPayment?.status !== paymentStatus) {
          return null;
        }

        return {
          id: userId,
          name: student.name,
          email: student.email,
          phone: student.phone || '',
          createdAt: student.createdAt,
          lastLoginAt: student.lastLoginAt || null,
          loginCount: student.loginCount || 0,
          totalPaid,
          paymentStatus: latestPayment?.status || 'none',
          paymentMethod: latestPayment?.paymentMethod || '',
          enrollments: enrollmentsWithProgress,
          totalEnrollments: enrollments.length,
          totalCertificates: certificates.filter(c => c.status === 'ready').length,
        };
      })
    );

    const filtered = enriched.filter(Boolean);

    return NextResponse.json({
      success: true,
      students: filtered,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err: any) {
    console.error('[Admin Students]', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
