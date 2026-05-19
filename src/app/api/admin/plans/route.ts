import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { protectRouteByRole } from '@/lib/auth';
import Payment from '@/models/Payment';
import Enrollment from '@/models/Enrollment';

// Adyapan plan definitions
const PLANS = [
  { id: 'plan-1', label: 'Plan 1', price: 3000, description: 'Basic access to course content' },
  { id: 'plan-2', label: 'Plan 2', price: 3500, description: 'Standard access with mentorship' },
  { id: 'plan-3', label: 'Plan 3', price: 5000, description: 'Premium access with projects' },
  { id: 'plan-4', label: 'Plan 4', price: 15000, description: 'Full access with placement support' },
];

export async function GET(request: NextRequest) {
  const auth = protectRouteByRole(request, ['ADMIN', 'COMPANY']);
  if (auth instanceof NextResponse) return auth;

  try {
    await connectToDatabase();

    const enriched = await Promise.all(
      PLANS.map(async (plan) => {
        const [purchaseCount, revenueAgg] = await Promise.all([
          Enrollment.countDocuments({
            planLabel: { $regex: plan.label, $options: 'i' },
          }),
          Payment.aggregate([
            {
              $match: {
                planLabel: { $regex: plan.label, $options: 'i' },
                status: 'success',
              },
            },
            { $group: { _id: null, total: { $sum: '$totalAmount' }, count: { $sum: 1 } } },
          ]),
        ]);

        return {
          ...plan,
          purchaseCount,
          revenue: revenueAgg[0]?.total ?? 0,
          paymentCount: revenueAgg[0]?.count ?? 0,
        };
      })
    );

    return NextResponse.json({
      success: true,
      plans: enriched,
    });
  } catch (err: any) {
    console.error('[Admin Plans]', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
