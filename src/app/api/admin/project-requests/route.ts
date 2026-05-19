/**
 * GET /api/admin/project-requests
 * Returns project requests for admin dashboard.
 */
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { protectRouteByRole } from '@/lib/auth';
import ProjectRequest from '@/models/ProjectRequest';

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
    if (status !== 'all') filter.projectStatus = status;
    if (search.trim()) {
      filter.$or = [
        { projectTitle:  { $regex: search, $options: 'i' } },
        { contactName:   { $regex: search, $options: 'i' } },
        { contactEmail:  { $regex: search, $options: 'i' } },
        { contactPhone:  { $regex: search, $options: 'i' } },
        { category:      { $regex: search, $options: 'i' } },
      ];
    }

    const [requests, total] = await Promise.all([
      ProjectRequest.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      ProjectRequest.countDocuments(filter),
    ]);

    return NextResponse.json({ success: true, requests, total, page, limit });
  } catch (err: any) {
    console.error('[Admin ProjectRequests]', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const auth = protectRouteByRole(request, ['ADMIN', 'SUPERADMIN']);
  if (auth instanceof NextResponse) return auth;

  try {
    await connectToDatabase();
    const { id, projectStatus } = await request.json();
    if (!id || !projectStatus) {
      return NextResponse.json({ error: 'id and projectStatus required' }, { status: 400 });
    }
    const updated = await ProjectRequest.findByIdAndUpdate(id, { $set: { projectStatus } }, { new: true }).lean();
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, request: updated });
  } catch (err: any) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
