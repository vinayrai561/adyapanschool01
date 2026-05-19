/**
 * POST /api/coupons/mark-used
 * Called after successful payment to mark coupon as used.
 * Internal use only — called from payment verify route.
 */

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Coupon from '@/models/Coupon';

export async function POST(req: NextRequest) {
  try {
    const { code, email } = await req.json();
    if (!code || !email) {
      return NextResponse.json({ success: false, error: 'Missing code or email' }, { status: 400 });
    }

    await connectToDatabase();

    await Coupon.findOneAndUpdate(
      { code: code.trim().toUpperCase() },
      {
        $inc: { usedCount: 1 },
        $addToSet: { usedBy: email },
      }
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[Coupon Mark Used]', err);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
