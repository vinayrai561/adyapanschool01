import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { protectRouteByRole } from '@/lib/auth';
import AuthUser from '@/models/AuthUser';
import Enrollment from '@/models/Enrollment';
import Payment from '@/models/Payment';
import Certificate from '@/models/Certificate';

export async function GET(request: NextRequest) {
  const auth = protectRouteByRole(request, ['ADMIN', 'COMPANY']);
  if (auth instanceof NextResponse) return auth;

  try {
    await connectToDatabase();

    const students = await AuthUser.find({ role: 'STUDENT' })
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .lean();

    const rows: string[] = [
      'Name,Email,Phone,Enrolled Course,Plan,Amount Paid,Payment Status,Enrollment Date,Progress %,Certificate Status,Signup Date',
    ];

    for (const student of students) {
      const userId = student._id.toString();
      const enrollments = await Enrollment.find({ userId }).lean();
      const payments = await Payment.find({ userId }).lean();
      const certificates = await Certificate.find({ userId }).lean();

      if (enrollments.length === 0) {
        const latestPayment = payments[0];
        rows.push(
          [
            `"${student.name}"`,
            student.email,
            student.phone || '',
            '',
            '',
            '',
            latestPayment?.status || 'none',
            '',
            '',
            '',
            new Date(student.createdAt).toLocaleDateString('en-IN'),
          ].join(',')
        );
      } else {
        for (const enr of enrollments) {
          const payment = payments.find(p => p.courseSlug === enr.courseSlug && p.status === 'success');
          const cert = certificates.find(c => c.courseSlug === enr.courseSlug);
          rows.push(
            [
              `"${student.name}"`,
              student.email,
              student.phone || '',
              `"${enr.courseName}"`,
              enr.planLabel || '',
              enr.amountPaid || '',
              payment?.status || 'none',
              new Date(enr.enrolledAt).toLocaleDateString('en-IN'),
              '',
              cert ? cert.status : 'not_issued',
              new Date(student.createdAt).toLocaleDateString('en-IN'),
            ].join(',')
          );
        }
      }
    }

    const csv = rows.join('\n');

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="students-${Date.now()}.csv"`,
      },
    });
  } catch (err: any) {
    console.error('[Admin Export Students]', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
