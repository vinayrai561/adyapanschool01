/**
 * GET /api/admin/offline-leads
 * Returns offline internship leads for admin dashboard.
 */
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { protectRouteByRole } from '@/lib/auth';
import OfflineInternshipLead from '@/models/OfflineInternshipLead';

export async function GET(request: NextRequest) {
  const auth = protectRouteByRole(request, ['ADMIN', 'SUPERADMIN']);
  if (auth instanceof NextResponse) return auth;

  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    const page   = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit  = Math.min(50, parseInt(searchParams.get('limit') || '20'));
    const skip   = (page - 1) * limit;

    const filter: Record<string, unknown> = {};
    if (status !== 'all') filter.status = status;
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
      OfflineInternshipLead.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      OfflineInternshipLead.countDocuments(filter),
    ]);

    return NextResponse.json({ success: true, leads, total, page, limit });
  } catch (err: any) {
    console.error('[Admin OfflineLeads]', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const auth = protectRouteByRole(request, ['ADMIN', 'SUPERADMIN']);
  if (auth instanceof NextResponse) return auth;

  try {
    await connectToDatabase();
    const { id, status, notes } = await request.json();
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
    const update: Record<string, unknown> = {};
    if (status) update.status = status;
    if (notes !== undefined) update.notes = notes;
    const updated = await OfflineInternshipLead.findByIdAndUpdate(id, { $set: update }, { new: true }).lean();
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, lead: updated });
  } catch (err: any) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
