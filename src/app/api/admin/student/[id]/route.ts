import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { protectRouteByRole } from '@/lib/auth';
import AuthUser from '@/models/AuthUser';
import Enrollment from '@/models/Enrollment';
import Payment from '@/models/Payment';
import Progress from '@/models/Progress';
import Certificate from '@/models/Certificate';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = protectRouteByRole(request, ['ADMIN', 'COMPANY']);
  if (auth instanceof NextResponse) return auth;

  try {
    await connectToDatabase();
    const { id } = await params;
    const student = await AuthUser.findById(id).select('-passwordHash').lean();
    if (!student || student.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    const userId = id;

    const [enrollments, payments, certificates] = await Promise.all([
      Enrollment.find({ userId }).lean(),
      Payment.find({ userId }).lean(),
      Certificate.find({ userId }).lean(),
    ]);

    const enrollmentsWithProgress = await Promise.all(
      enrollments.map(async (enr) => {
        const progress = await Progress.findOne({ userId, courseSlug: enr.courseSlug }).lean();
        const cert = certificates.find(c => c.courseSlug === enr.courseSlug);
        return {
          courseSlug: enr.courseSlug,
          courseName: enr.courseName,
          planLabel: enr.planLabel,
          amountPaid: enr.amountPaid,
          enrolledAt: enr.enrolledAt,
          progressPercent: (progress as any)?.progressPercent ?? 0,
          completedLessons: (progress as any)?.completedLessons?.length ?? 0,
          totalLessons: (progress as any)?.totalLessons ?? 0,
          completedAt: (progress as any)?.completedAt ?? null,
          certificate: cert
            ? {
                certificateId: cert.certificateId,
                status: cert.status,
                issuedAt: cert.issuedAt,
              }
            : null,
        };
      })
    );

    return NextResponse.json({
      success: true,
      student: {
        id: userId,
        name: student.name,
        email: student.email,
        phone: student.phone || '',
        createdAt: student.createdAt,
        lastLoginAt: student.lastLoginAt || null,
        loginCount: student.loginCount || 0,
        signupAt: student.signupAt || student.createdAt,
      },
      enrollments: enrollmentsWithProgress,
      payments: payments.map(p => ({
        paymentId: p.paymentId,
        orderId: p.orderId,
        courseName: p.courseName,
        planLabel: p.planLabel,
        totalAmount: p.totalAmount,
        status: p.status,
        paymentMethod: p.paymentMethod,
        paidAt: p.paidAt,
      })),
      summary: {
        totalPaid: payments.filter(p => p.status === 'success').reduce((s, p) => s + p.totalAmount, 0),
        totalEnrollments: enrollments.length,
        totalCertificates: certificates.filter(c => c.status === 'ready').length,
      },
    });
  } catch (err: any) {
    console.error('[Admin Student Detail]', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
