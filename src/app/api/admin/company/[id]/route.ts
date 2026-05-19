/**
 * PATCH /api/admin/company/[id]
 * Admin: verify or reject a company profile
 * Body: { action: 'verify' | 'reject', reason?: string }
 */
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { protectRouteByRole } from '@/lib/auth';
import CompanyProfile from '@/models/CompanyProfile';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = protectRouteByRole(req, ['ADMIN', 'SUPERADMIN']);
  if (auth instanceof NextResponse) return auth;

  try {
    await connectToDatabase();
    const { id } = await params;
    const { action, reason } = await req.json();

    if (!['verify', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Action must be verify or reject' }, { status: 400 });
    }

    const update: Record<string, any> =
      action === 'verify'
        ? { verificationStatus: 'verified', verifiedBy: auth.userId, verifiedAt: new Date(), rejectionReason: '' }
        : { verificationStatus: 'rejected', rejectionReason: reason || 'Rejected by admin', verifiedBy: '', verifiedAt: null };

    const profile = await CompanyProfile.findByIdAndUpdate(id, update, { new: true });
    if (!profile) return NextResponse.json({ error: 'Company profile not found' }, { status: 404 });

    return NextResponse.json({ success: true, profile, message: `Company ${action === 'verify' ? 'verified' : 'rejected'}` });
  } catch (err: any) {
    console.error('[AdminCompany PATCH]', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
