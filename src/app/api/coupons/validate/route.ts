/**
 * POST /api/coupons/validate
 * Validates a coupon code and returns discount amount.
 * All validation is backend-only — never trust frontend.
 */

import { NextRequest, NextResponse } from 'next/server';
import { protectRoute } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import Coupon from '@/models/Coupon';
import Payment from '@/models/Payment';

export async function POST(req: NextRequest) {
  // Must be logged in
  const user = protectRoute(req);
  if (user instanceof NextResponse) return user;

  try {
    const { code, planId, amount } = await req.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ success: false, error: 'Coupon code is required' }, { status: 400 });
    }
    if (!amount || typeof amount !== 'number') {
      return NextResponse.json({ success: false, error: 'Order amount is required' }, { status: 400 });
    }

    await connectToDatabase();

    const coupon = await Coupon.findOne({ code: code.trim().toUpperCase() });

    // 1. Exists?
    if (!coupon) {
      return NextResponse.json({ success: false, error: 'Invalid coupon code' }, { status: 404 });
    }

    // 2. Active?
    if (!coupon.active) {
      return NextResponse.json({ success: false, error: 'This coupon is no longer active' }, { status: 400 });
    }

    // 3. Expired?
    if (new Date() > new Date(coupon.expiryDate)) {
      return NextResponse.json({ success: false, error: 'This coupon has expired' }, { status: 400 });
    }

    // 4. Usage limit reached?
    if (coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json({ success: false, error: 'Coupon usage limit reached' }, { status: 400 });
    }

    // 5. Already used by this user?
    if (coupon.usedBy.includes(user.email)) {
      return NextResponse.json({ success: false, error: 'You have already used this coupon' }, { status: 400 });
    }

    // 6. Minimum purchase?
    if (coupon.minPurchase && amount < coupon.minPurchase) {
      return NextResponse.json({
        success: false,
        error: `Minimum purchase of ₹${coupon.minPurchase.toLocaleString('en-IN')} required for this coupon`,
      }, { status: 400 });
    }

    // 7. Course-specific?
    if (coupon.courseIds && coupon.courseIds.length > 0 && planId) {
      if (!coupon.courseIds.includes(planId)) {
        return NextResponse.json({ success: false, error: 'This coupon is not valid for the selected plan' }, { status: 400 });
      }
    }

    // 8. First-user only?
    if (coupon.firstUserOnly) {
      const prevPayment = await Payment.findOne({ userEmail: user.email, status: 'paid' });
      if (prevPayment) {
        return NextResponse.json({ success: false, error: 'This coupon is only for first-time purchases' }, { status: 400 });
      }
    }

    // ── Calculate discount ──
    let discountAmount = 0;
    if (coupon.type === 'percentage') {
      discountAmount = Math.round((amount * coupon.discount) / 100);
      if (coupon.maxDiscount) {
        discountAmount = Math.min(discountAmount, coupon.maxDiscount);
      }
    } else {
      discountAmount = Math.min(coupon.discount, amount); // can't discount more than order
    }

    const afterDiscount = amount - discountAmount;
    const gst = Math.round(afterDiscount * 0.18);
    const grandTotal = afterDiscount + gst;

    return NextResponse.json({
      success: true,
      code: coupon.code,
      type: coupon.type,
      discount: coupon.discount,
      discountAmount,
      afterDiscount,
      gst,
      grandTotal,
      description: coupon.description || `${coupon.type === 'percentage' ? coupon.discount + '%' : '₹' + coupon.discount} OFF`,
      expiryDate: coupon.expiryDate,
    });
  } catch (err: any) {
    console.error('[Coupon Validate]', err);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
