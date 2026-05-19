/**
 * PATCH  /api/admin/coupons/[id]  — toggle active / update
 * DELETE /api/admin/coupons/[id]  — delete coupon
 */

import { NextRequest, NextResponse } from 'next/server';
import { protectRouteByRole } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import Coupon from '@/models/Coupon';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const user = protectRouteByRole(req, ['ADMIN', 'SUPERADMIN']);
  if (user instanceof NextResponse) return user;

  try {
    await connectDB();
    const body = await req.json();
    const coupon = await Coupon.findByIdAndUpdate(params.id, body, { new: true });
    if (!coupon) return NextResponse.json({ success: false, error: 'Coupon not found' }, { status: 404 });
    return NextResponse.json({ success: true, coupon });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = protectRouteByRole(req, ['ADMIN', 'SUPERADMIN']);
  if (user instanceof NextResponse) return user;

  try {
    await connectDB();
    await Coupon.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
