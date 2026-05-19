/** GET /api/company/jobs/[id]/applicants */
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { protectRouteByRole } from '@/lib/auth';
import JobPost from '@/models/JobPost';
import JobApplication from '@/models/JobApplication';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
    const applicants = await JobApplication.find({ jobId: id }).sort({ appliedAt: -1 }).lean();
    return NextResponse.json({ success: true, applicants, count: applicants.length });
  } catch (err: any) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
