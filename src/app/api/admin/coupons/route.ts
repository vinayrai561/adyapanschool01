/**
 * GET  /api/admin/coupons        — list all coupons
 * POST /api/admin/coupons        — create coupon
 */

import { NextRequest, NextResponse } from 'next/server';
import { protectRouteByRole } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import Coupon from '@/models/Coupon';

export async function GET(req: NextRequest) {
  const user = protectRouteByRole(req, ['ADMIN', 'SUPERADMIN']);
  if (user instanceof NextResponse) return user;

  await connectToDatabase();
  const coupons = await Coupon.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ success: true, coupons });
}

export async function POST(req: NextRequest) {
  const user = protectRouteByRole(req, ['ADMIN', 'SUPERADMIN']);
  if (user instanceof NextResponse) return user;

  try {
    const body = await req.json();
    const {
      code, type, discount, maxDiscount, minPurchase,
      expiryDate, usageLimit, courseIds, firstUserOnly, description,
    } = body;

    // Validate required fields
    if (!code || !type || !discount || !expiryDate || !usageLimit) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }
    if (!['percentage', 'flat'].includes(type)) {
      return NextResponse.json({ success: false, error: 'Invalid coupon type' }, { status: 400 });
    }
    if (type === 'percentage' && (discount < 1 || discount > 100)) {
      return NextResponse.json({ success: false, error: 'Percentage must be 1–100' }, { status: 400 });
    }

    await connectToDatabase();

    const existing = await Coupon.findOne({ code: code.trim().toUpperCase() });
    if (existing) {
      return NextResponse.json({ success: false, error: 'Coupon code already exists' }, { status: 409 });
    }

    const coupon = await Coupon.create({
      code: code.trim().toUpperCase(),
      type,
      discount: Number(discount),
      maxDiscount: maxDiscount ? Number(maxDiscount) : undefined,
      minPurchase: minPurchase ? Number(minPurchase) : 0,
      expiryDate: new Date(expiryDate),
      usageLimit: Number(usageLimit),
      courseIds: courseIds || [],
      firstUserOnly: Boolean(firstUserOnly),
      description,
      active: true,
    });

    return NextResponse.json({ success: true, coupon }, { status: 201 });
  } catch (err: any) {
    console.error('[Admin Coupon Create]', err);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
