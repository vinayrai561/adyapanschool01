/**
 * PATCH  /api/admin/coupons/[id]
 * DELETE /api/admin/coupons/[id]
 */

import { NextRequest, NextResponse } from 'next/server';
import { protectRouteByRole } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import Coupon from '@/models/Coupon';

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const user = protectRouteByRole(req, ['ADMIN', 'SUPERADMIN']);

  if (user instanceof NextResponse) {
    return user;
  }

  try {
    const { id } = await context.params;

    await connectToDatabase();

    const body = await req.json();

    const coupon = await Coupon.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (!coupon) {
      return NextResponse.json(
        {
          success: false,
          error: 'Coupon not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      coupon,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: 'Server error',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const user = protectRouteByRole(req, ['ADMIN', 'SUPERADMIN']);

  if (user instanceof NextResponse) {
    return user;
  }

  try {
    const { id } = await context.params;

    await connectToDatabase();

    await Coupon.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: 'Server error',
      },
      { status: 500 }
    );
  }
}