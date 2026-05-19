/**
 * PATCH  /api/company/jobs/[id]  — update a job
 * DELETE /api/company/jobs/[id]  — delete a job
 */
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
    const body = await req.json();
    const allowed = ['jobTitle','category','description','responsibilities','requiredSkills','educationRequirement','experienceLevel','openings','employmentType','workMode','location','salaryOrStipend','deadline','status'];
    const update: Record<string, any> = {};
    for (const key of allowed) { if (body[key] !== undefined) update[key] = body[key]; }
    const updated = await JobPost.findByIdAndUpdate(id, update, { new: true });
    return NextResponse.json({ success: true, job: updated });
  } catch (err: any) {
    console.error('[CompanyJob PATCH]', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
    await JobPost.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Job deleted' });
  } catch (err: any) {
    console.error('[CompanyJob DELETE]', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
