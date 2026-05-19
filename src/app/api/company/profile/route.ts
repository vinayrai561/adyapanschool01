/**
 * GET  /api/company/profile  — fetch own company profile
 * POST /api/company/profile  — create or update company profile
 */
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { protectRouteByRole } from '@/lib/auth';
import CompanyProfile from '@/models/CompanyProfile';

export async function GET(req: NextRequest) {
  const auth = protectRouteByRole(req, ['COMPANY', 'ADMIN', 'SUPERADMIN']);
  if (auth instanceof NextResponse) return auth;

  try {
    await connectToDatabase();
    const profile = await CompanyProfile.findOne({ organizationUserId: auth.userId }).lean();
    return NextResponse.json({ success: true, profile: profile || null });
  } catch (err: any) {
    console.error('[CompanyProfile GET]', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = protectRouteByRole(req, ['COMPANY', 'ADMIN', 'SUPERADMIN']);
  if (auth instanceof NextResponse) return auth;

  try {
    await connectToDatabase();
    const body = await req.json();

    const {
      companyName, companyEmail, mobileNumber, website, logoUrl,
      industry, companySize, gstOrCin, address, city, state, country,
    } = body;

    if (!companyName?.trim() || !companyEmail?.trim()) {
      return NextResponse.json({ error: 'Company name and email are required' }, { status: 400 });
    }

    const existing = await CompanyProfile.findOne({ organizationUserId: auth.userId });

    if (existing) {
      // Update — preserve verificationStatus unless admin
      const update: Record<string, any> = {
        companyName: companyName.trim(),
        companyEmail: companyEmail.toLowerCase().trim(),
        mobileNumber: mobileNumber || '',
        website: website || '',
        logoUrl: logoUrl || '',
        industry: industry || '',
        companySize: companySize || '',
        gstOrCin: gstOrCin || '',
        address: address || '',
        city: city || '',
        state: state || '',
        country: country || 'India',
      };
      // If profile was rejected, re-submitting resets to pending
      if (existing.verificationStatus === 'rejected') {
        update.verificationStatus = 'pending';
        update.rejectionReason = '';
      }
      const updated = await CompanyProfile.findOneAndUpdate(
        { organizationUserId: auth.userId },
        update,
        { new: true }
      );
      return NextResponse.json({ success: true, profile: updated, message: 'Profile updated' });
    }

    // Create new
    const profile = await CompanyProfile.create({
      organizationUserId: auth.userId,
      companyName: companyName.trim(),
      companyEmail: companyEmail.toLowerCase().trim(),
      mobileNumber: mobileNumber || '',
      website: website || '',
      logoUrl: logoUrl || '',
      industry: industry || '',
      companySize: companySize || '',
      gstOrCin: gstOrCin || '',
      address: address || '',
      city: city || '',
      state: state || '',
      country: country || 'India',
      verificationStatus: 'pending',
    });

    return NextResponse.json({ success: true, profile, message: 'Profile created. Awaiting verification.' }, { status: 201 });
  } catch (err: any) {
    console.error('[CompanyProfile POST]', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
