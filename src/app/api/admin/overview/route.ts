import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { protectRouteByRole } from '@/lib/auth';
import { seedPlans } from '@/lib/db-service';
import AuthUser from '@/models/AuthUser';
import Enrollment from '@/models/Enrollment';
import Payment from '@/models/Payment';
import Certificate from '@/models/Certificate';
import Course from '@/models/Course';
import Plan from '@/models/Plan';
import OfflineInternshipLead from '@/models/OfflineInternshipLead';
import ProjectRequest from '@/models/ProjectRequest';

export async function GET(request: NextRequest) {
  const auth = protectRouteByRole(request, ['ADMIN', 'SUPERADMIN']);
  if (auth instanceof NextResponse) return auth;

  try {
    await connectToDatabase();

    // Auto-seed plans if not present
    const planCount = await Plan.countDocuments();
    if (planCount === 0) await seedPlans();

    const [
      totalStudents,
      totalEnrolled,
      successPayments,
      totalCertificates,
      totalCourses,
      pendingPayments,
      completedEnrollments,
      totalLeads,
      totalProjectRequests,
      purchasedCourses,
    ] = await Promise.all([
      AuthUser.countDocuments({ role: 'STUDENT' }),
      Enrollment.countDocuments({ enrollmentStatus: 'active' }),
      Payment.find({ status: 'success' }).lean(),
      Certificate.countDocuments({ status: 'ready' }),
      Course.countDocuments(),
      Payment.countDocuments({ status: 'pending' }),
      Enrollment.countDocuments({ enrollmentStatus: 'completed' }),
      OfflineInternshipLead.countDocuments(),
      ProjectRequest.countDocuments(),
      Enrollment.countDocuments({ enrollmentStatus: { $in: ['active', 'completed'] } }),
    ]);

    const totalRevenue = successPayments.reduce((s: number, p: any) => s + (p.totalAmount || 0), 0);

    // Revenue by month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const [recentPayments, recentEnrollments] = await Promise.all([
      Payment.find({ status: 'success', paidAt: { $gte: sixMonthsAgo } }).lean(),
      Enrollment.find({ enrolledAt: { $gte: sixMonthsAgo } }).lean(),
    ]);

    // Build revenue chart
    const revenueByMonth: Record<string, number> = {};
    recentPayments.forEach((p: any) => {
      const key = new Date(p.paidAt).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
      revenueByMonth[key] = (revenueByMonth[key] || 0) + p.totalAmount;
    });
    const revenueChart = Object.entries(revenueByMonth).map(([month, revenue]) => ({ month, revenue }));

    // Build enrollment chart
    const enrollmentsByMonth: Record<string, number> = {};
    recentEnrollments.forEach((e: any) => {
      const key = new Date(e.enrolledAt).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
      enrollmentsByMonth[key] = (enrollmentsByMonth[key] || 0) + 1;
    });
    const enrollmentChart = Object.entries(enrollmentsByMonth).map(([month, count]) => ({ month, count }));

    // Plan breakdown
    const planBreakdown = await Payment.aggregate([
      { $match: { status: 'success' } },
      { $group: { _id: '$planLabel', count: { $sum: 1 }, revenue: { $sum: '$totalAmount' } } },
      { $sort: { revenue: -1 } },
    ]);

    // Recent activity (last 10 payments)
    const recentActivity = await Payment.find({ status: 'success' })
      .sort({ paidAt: -1 })
      .limit(10)
      .lean();

    return NextResponse.json({
      success: true,
      overview: {
        totalStudents,
        totalEnrolled,
        totalRevenue,
        totalPayments:        successPayments.length,
        totalCourses,
        pendingPayments,
        completedCourses:     completedEnrollments,
        totalCertificates,
        totalLeads,
        totalProjectRequests,
        purchasedCourses,
      },
      revenueChart,
      enrollmentChart,
      planBreakdown,
      recentActivity: recentActivity.map((p: any) => ({
        paymentId:   p.paymentId,
        studentName: p.userName,
        courseName:  p.courseName,
        amount:      p.totalAmount,
        paidAt:      p.paidAt,
      })),
    });
  } catch (err: any) {
    console.error('[Admin Overview]', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
