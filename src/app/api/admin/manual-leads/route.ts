/**
 * /api/admin/manual-leads
 *
 * GET    — list manual leads (search, enrollmentType filter, paymentStatus filter, pagination)
 * POST   — create a new manual lead (duplicate check by phone/email)
 * PATCH  — update an existing lead (edit)
 * DELETE — delete a lead (admin only)
 *
 * All routes require ADMIN or SUPERADMIN role.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/mongodb';
import { protectRouteByRole } from '@/lib/auth';
import ManualLead from '@/models/ManualLead';

// ── Validation schema ─────────────────────────────────────────
const CreateSchema = z.object({
  name:           z.string().min(2, 'Name must be at least 2 characters').max(100),
  phone:          z.string().min(7, 'Enter a valid phone number').max(20),
  email:          z.string().email('Enter a valid email'),
  college:        z.string().max(200).optional().default(''),
  city:           z.string().max(100).optional().default(''),
  courseInterest: z.string().max(200).optional().default(''),
  preferredBatch: z.string().max(100).optional().default(''),
  enrollmentType: z.enum(['Online', 'Offline Form', 'Office Visit', 'Phone Call']),
  paymentStatus:  z.enum(['Paid', 'Pending', 'Failed', 'Partial']).optional().default('Pending'),
  amountPaid:     z.number().min(0).optional().default(0),
  notes:          z.string().max(2000).optional().default(''),
  addedByAdmin:   z.string().max(200).optional().default(''),
});

const UpdateSchema = CreateSchema.partial().extend({
  id: z.string().min(1, 'id is required'),
});

// ── GET ───────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const auth = protectRouteByRole(request, ['ADMIN', 'SUPERADMIN']);
  if (auth instanceof NextResponse) return auth;

  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const search         = searchParams.get('search') || '';
    const enrollmentType = searchParams.get('enrollmentType') || '';
    const paymentStatus  = searchParams.get('paymentStatus') || '';
    const page           = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit          = Math.min(50, parseInt(searchParams.get('limit') || '20'));
    const skip           = (page - 1) * limit;

    const filter: Record<string, unknown> = {};

    if (enrollmentType && enrollmentType !== 'all') {
      filter.enrollmentType = enrollmentType;
    }
    if (paymentStatus && paymentStatus !== 'all') {
      filter.paymentStatus = paymentStatus;
    }
    if (search.trim()) {
      filter.$or = [
        { name:           { $regex: search, $options: 'i' } },
        { email:          { $regex: search, $options: 'i' } },
        { phone:          { $regex: search, $options: 'i' } },
        { city:           { $regex: search, $options: 'i' } },
        { college:        { $regex: search, $options: 'i' } },
        { courseInterest: { $regex: search, $options: 'i' } },
      ];
    }

    const [leads, total] = await Promise.all([
      ManualLead.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      ManualLead.countDocuments(filter),
    ]);

    return NextResponse.json({ success: true, leads, total, page, limit });
  } catch (err: any) {
    console.error('[ManualLeads GET]', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ── POST ──────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const auth = protectRouteByRole(request, ['ADMIN', 'SUPERADMIN']);
  if (auth instanceof NextResponse) return auth;

  try {
    await connectToDatabase();

    const body   = await request.json();
    const parsed = CreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // ── Duplicate check by phone OR email ──────────────────────
    const duplicate = await ManualLead.findOne({
      $or: [
        { phone: data.phone.trim() },
        { email: data.email.toLowerCase().trim() },
      ],
    }).lean();

    if (duplicate) {
      const field = (duplicate as any).phone === data.phone.trim() ? 'phone' : 'email';
      return NextResponse.json(
        { error: `A student with this ${field} already exists in manual leads.`, duplicate: true },
        { status: 409 }
      );
    }

    const lead = await ManualLead.create({
      ...data,
      source: 'manual-admin-entry',
    });

    return NextResponse.json({ success: true, lead }, { status: 201 });
  } catch (err: any) {
    console.error('[ManualLeads POST]', err.message);
    if (err.code === 11000) {
      return NextResponse.json({ error: 'Duplicate entry detected.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ── PATCH ─────────────────────────────────────────────────────
export async function PATCH(request: NextRequest) {
  const auth = protectRouteByRole(request, ['ADMIN', 'SUPERADMIN']);
  if (auth instanceof NextResponse) return auth;

  try {
    await connectToDatabase();

    const body   = await request.json();
    const parsed = UpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { id, ...updates } = parsed.data;

    // If phone/email is being changed, check for duplicates (excluding self)
    if (updates.phone || updates.email) {
      const orConditions: Record<string, unknown>[] = [];
      if (updates.phone) orConditions.push({ phone: updates.phone.trim() });
      if (updates.email) orConditions.push({ email: updates.email.toLowerCase().trim() });

      const duplicate = await ManualLead.findOne({
        _id: { $ne: id },
        $or: orConditions,
      }).lean();

      if (duplicate) {
        const field = (duplicate as any).phone === updates.phone?.trim() ? 'phone' : 'email';
        return NextResponse.json(
          { error: `Another student with this ${field} already exists.`, duplicate: true },
          { status: 409 }
        );
      }
    }

    const updated = await ManualLead.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    ).lean();

    if (!updated) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, lead: updated });
  } catch (err: any) {
    console.error('[ManualLeads PATCH]', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ── DELETE ────────────────────────────────────────────────────
export async function DELETE(request: NextRequest) {
  const auth = protectRouteByRole(request, ['ADMIN', 'SUPERADMIN']);
  if (auth instanceof NextResponse) return auth;

  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    const deleted = await ManualLead.findByIdAndDelete(id).lean();
    if (!deleted) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Lead deleted successfully' });
  } catch (err: any) {
    console.error('[ManualLeads DELETE]', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
