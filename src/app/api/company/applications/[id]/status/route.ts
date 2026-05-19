/** PATCH /api/company/applications/[id]/status */
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { protectRouteByRole } from '@/lib/auth';
import JobApplication from '@/models/JobApplication';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = protectRouteByRole(req, ['COMPANY', 'ADMIN', 'SUPERADMIN']);
  if (auth instanceof NextResponse) return auth;
  try {
    await connectToDatabase();
    const { id } = await params;
    const app = await JobApplication.findById(id);
    if (!app) return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    if (app.companyId !== auth.userId && !['ADMIN','SUPERADMIN'].includes(auth.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const { status } = await req.json();
    const allowed = ['applied','shortlisted','rejected','hired'];
    if (!allowed.includes(status)) return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    const updated = await JobApplication.findByIdAndUpdate(id, { status }, { new: true });
    return NextResponse.json({ success: true, application: updated });
  } catch (err: any) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
