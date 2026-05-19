/**
 * POST /api/project-payment/create-order
 *
 * Creates a Razorpay order for a "Build My Project" submission.
 * Saves a ProjectRequest (status: draft) and a ProjectPayment (status: pending)
 * so we have a DB record before the user even pays.
 *
 * SECURITY:
 *  - Amount is validated server-side (min ₹3000) — never trust the frontend
 *  - Razorpay keys are read from env only
 *  - No secrets returned to the client
 */

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import mongoose from 'mongoose';

const MIN_AMOUNT = 3000; // INR

/* ── lazy-load backend models via mongoose (shared connection) ── */
function getProjectRequestModel() {
  if (mongoose.models.ProjectRequest) return mongoose.models.ProjectRequest;
  const schema = new mongoose.Schema(
    {
      projectTitle:   { type: String, required: true },
      category:       { type: String, required: true },
      description:    { type: String, required: true },
      features:       { type: [String], default: [] },
      techPreference: { type: String, default: '' },
      deadline:       { type: Date, required: true },
      budget:         { type: Number, required: true, min: 3000 },
      contactName:    { type: String, required: true },
      contactEmail:   { type: String, required: true, lowercase: true },
      contactPhone:   { type: String, required: true },
      imageUrls:      { type: [String], default: [] },
      pdfUrls:        { type: [String], default: [] },
      referenceFiles: { type: mongoose.Schema.Types.Mixed, default: [] },
      additionalNotes:{ type: String, default: '' },
      userId:         { type: mongoose.Schema.Types.ObjectId, default: null },
      paymentId:      { type: String, default: '' },
      orderId:        { type: String, default: '' },
      paymentStatus:  { type: String, enum: ['pending','success','failed'], default: 'pending' },
      paidAmount:     { type: Number, default: 0 },
      projectStatus:  { type: String, default: 'draft' },
      emailSent:      { type: Boolean, default: false },
    },
    { timestamps: true }
  );
  return mongoose.model('ProjectRequest', schema);
}

function getProjectPaymentModel() {
  if (mongoose.models.ProjectPayment) return mongoose.models.ProjectPayment;
  const schema = new mongoose.Schema(
    {
      projectRequestId:  { type: mongoose.Schema.Types.ObjectId, required: true },
      contactName:       { type: String, required: true },
      contactEmail:      { type: String, required: true, lowercase: true },
      contactPhone:      { type: String, default: '' },
      razorpayOrderId:   { type: String, required: true, unique: true },
      razorpayPaymentId: { type: String, default: '' },
      razorpaySignature: { type: String, default: '' },
      amount:            { type: Number, required: true, min: 3000 },
      currency:          { type: String, default: 'INR' },
      status:            { type: String, enum: ['pending','success','failed'], default: 'pending' },
      signatureVerified: { type: Boolean, default: false },
      isTestMode:        { type: Boolean, default: false },
      paidAt:            { type: Date, default: null },
      failureReason:     { type: String, default: '' },
    },
    { timestamps: true }
  );
  return mongoose.model('ProjectPayment', schema);
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const {
      projectTitle, category, description, features,
      techPreference, deadline, budget, contactName,
      contactEmail, contactPhone, additionalNotes,
      imageUrls, pdfUrls, referenceFiles, userId,
    } = body;

    /* ── 1. Validate required fields ── */
    if (!projectTitle?.trim() || !category || !description?.trim() ||
        !deadline || !contactName?.trim() || !contactEmail?.trim() || !contactPhone?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    /* ── 2. Validate amount server-side ── */
    const amount = Number(budget);
    if (!amount || amount < MIN_AMOUNT) {
      return NextResponse.json(
        { success: false, error: `Minimum project submission amount is ₹${MIN_AMOUNT}` },
        { status: 400 }
      );
    }

    /* ── 3. Create Razorpay order ── */
    const keyId     = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      console.error('[ProjectPayment] Razorpay keys not configured');
      return NextResponse.json(
        { success: false, error: 'Payment gateway not configured. Please contact support.' },
        { status: 500 }
      );
    }

    const isTestMode = keyId.startsWith('rzp_test_');
    let razorpayOrderId: string;
    let orderAmount: number;

    try {
      const Razorpay = (await import('razorpay')).default;
      const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

      const order = await razorpay.orders.create({
        amount:   Math.round(amount * 100), // paise
        currency: 'INR',
        receipt:  `proj_${Date.now()}`,
        notes:    { projectTitle, contactEmail, type: 'project_build' },
      });

      razorpayOrderId = order.id;
      orderAmount     = order.amount as number;
      console.log(`[ProjectPayment] ✅ Order created: ${razorpayOrderId} | ₹${amount}`);
    } catch (rzpErr: any) {
      console.error('[ProjectPayment] Razorpay error:', rzpErr?.message);
      return NextResponse.json(
        { success: false, error: 'Failed to create payment order. Please try again.' },
        { status: 502 }
      );
    }

    /* ── 4. Save ProjectRequest (draft) ── */
    const ProjectRequest = getProjectRequestModel();
    const projectRequest = await ProjectRequest.create({
      projectTitle:    projectTitle.trim(),
      category,
      description:     description.trim(),
      features:        Array.isArray(features) ? features.filter(Boolean) : [],
      techPreference:  techPreference || '',
      deadline:        new Date(deadline),
      budget:          amount,
      contactName:     contactName.trim(),
      contactEmail:    contactEmail.toLowerCase().trim(),
      contactPhone:    contactPhone.trim(),
      imageUrls:       imageUrls   || [],
      pdfUrls:         pdfUrls     || [],
      referenceFiles:  referenceFiles || [],
      additionalNotes: additionalNotes || '',
      userId:          userId || null,
      orderId:         razorpayOrderId,
      paymentStatus:   'pending',
      paidAmount:      0,
      projectStatus:   'draft',
    });

    /* ── 5. Save ProjectPayment (pending) ── */
    const ProjectPayment = getProjectPaymentModel();
    await ProjectPayment.create({
      projectRequestId:  projectRequest._id,
      contactName:       contactName.trim(),
      contactEmail:      contactEmail.toLowerCase().trim(),
      contactPhone:      contactPhone.trim(),
      razorpayOrderId,
      amount,
      currency:          'INR',
      status:            'pending',
      isTestMode,
    });

    /* ── 6. Return order details to frontend ── */
    return NextResponse.json({
      success:          true,
      orderId:          razorpayOrderId,
      amount:           orderAmount,
      currency:         'INR',
      keyId,
      projectRequestId: projectRequest._id.toString(),
      isTestMode,
    });

  } catch (err: any) {
    console.error('[ProjectPayment] create-order error:', err?.message);
    return NextResponse.json(
      { success: false, error: 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
}
