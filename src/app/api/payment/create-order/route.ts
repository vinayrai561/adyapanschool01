/**
 * POST /api/payment/create-order
 * 
 * Creates a Razorpay order for the selected plan
 * This endpoint is called by the frontend checkout page
 * 
 * SECURITY:
 * - Validates plan against hardcoded catalogue
 * - Returns only necessary data (no secrets)
 * - Always uses real Razorpay (no test mode)
 */

import { NextRequest, NextResponse } from 'next/server';

const PLAN_AMOUNTS: Record<string, number> = {
  'plan-1': 300000, // ₹3,000 in paise
  'plan-2': 350000, // ₹3,500 in paise
  'plan-3': 500000, // ₹5,000 in paise
  'plan-4-premium': 1500000, // ₹15,000 in paise
};

export async function POST(req: NextRequest) {
  try {
    const { plan } = await req.json();

    // Validate plan
    const amount = PLAN_AMOUNTS[plan];
    if (!amount) {
      return NextResponse.json(
        { success: false, error: 'Invalid plan selected' },
        { status: 400 }
      );
    }

    // Create real Razorpay order
    try {
      const Razorpay = (await import('razorpay')).default;
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID!,
        key_secret: process.env.RAZORPAY_KEY_SECRET!,
      });

      const order = await razorpay.orders.create({
        amount,
        currency: 'INR',
        receipt: `rcpt_${plan}_${Date.now()}`,
        notes: { plan },
      });

      console.log(
        `[Payment] ✅ Order created: ${order.id} | Plan: ${plan} | Amount: ₹${amount / 100}`
      );

      return NextResponse.json({
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
      });
    } catch (razorpayError: any) {
      console.error('[Payment] Razorpay API error:', razorpayError?.message);
      return NextResponse.json(
        { success: false, error: 'Failed to create payment order' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('[Payment] Order creation error:', error?.message);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
