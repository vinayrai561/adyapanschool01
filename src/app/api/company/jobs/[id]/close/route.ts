/** PATCH /api/company/jobs/[id]/close */
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { protectRouteByRole } from '@/lib/auth';
import JobPost from '@/models/JobPost';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = protectRouteByRole(req, ['COMPANY', 'ADMIN', 'SUPERADMIN']);
  if (auth instanceof NextResponse) return auth;
  try {
    await connectToDatabase();
    const { id } = await params;
    const job = await JobPost.findById(id);
    if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    if (job.companyId !== auth.userId && !['ADMIN','SUPERADMIN'].includes(auth.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const updated = await JobPost.findByIdAndUpdate(id, { status: 'closed' }, { new: true });
    return NextResponse.json({ success: true, job: updated });
  } catch (err: any) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
