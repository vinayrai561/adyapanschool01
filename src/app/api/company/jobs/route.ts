/**
 * GET  /api/company/jobs  — list own jobs
 * POST /api/company/jobs  — create a new job (verified companies only)
 */
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { protectRouteByRole } from '@/lib/auth';
import CompanyProfile from '@/models/CompanyProfile';
import JobPost from '@/models/JobPost';

export async function GET(req: NextRequest) {
  const auth = protectRouteByRole(req, ['COMPANY', 'ADMIN', 'SUPERADMIN']);
  if (auth instanceof NextResponse) return auth;

  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'all';

    const query: Record<string, any> = { companyId: auth.userId };
    if (status !== 'all') query.status = status;

    const jobs = await JobPost.find(query).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, jobs, count: jobs.length });
  } catch (err: any) {
    console.error('[CompanyJobs GET]', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = protectRouteByRole(req, ['COMPANY', 'ADMIN', 'SUPERADMIN']);
  if (auth instanceof NextResponse) return auth;

  try {
    await connectToDatabase();

    // Check company profile & verification
    const profile = await CompanyProfile.findOne({ organizationUserId: auth.userId });
    if (!profile) {
      return NextResponse.json(
        { error: 'Please complete your company profile before posting a job.', code: 'NO_PROFILE' },
        { status: 403 }
      );
    }
    if (profile.verificationStatus !== 'verified') {
      const msg =
        profile.verificationStatus === 'pending'
          ? 'Your company profile is under verification. You can save as draft but cannot publish yet.'
          : 'Your company profile was rejected. Please update your profile and resubmit.';
      return NextResponse.json({ error: msg, code: 'NOT_VERIFIED', status: profile.verificationStatus }, { status: 403 });
    }

    const body = await req.json();
    const {
      jobTitle, category, description, responsibilities, requiredSkills,
      educationRequirement, experienceLevel, openings, employmentType,
      workMode, location, salaryOrStipend, deadline, status,
    } = body;

    if (!jobTitle?.trim() || !category?.trim() || !description?.trim() || !deadline) {
      return NextResponse.json({ error: 'Job title, category, description, and deadline are required' }, { status: 400 });
    }

    const job = await JobPost.create({
      companyId:            auth.userId,
      organizationUserId:   auth.userId,
      companyName:          profile.companyName,
      companyEmail:         profile.companyEmail,
      companyLogoUrl:       profile.logoUrl || '',
      companyWebsite:       profile.website || '',
      companyIndustry:      profile.industry || '',
      companyCity:          profile.city || '',
      companyVerified:      true,
      jobTitle:             jobTitle.trim(),
      category:             category.trim(),
      description:          description.trim(),
      responsibilities:     Array.isArray(responsibilities) ? responsibilities.filter(Boolean) : [],
      requiredSkills:       Array.isArray(requiredSkills) ? requiredSkills.filter(Boolean) : [],
      educationRequirement: educationRequirement || '',
      experienceLevel:      experienceLevel || 'Fresher',
      openings:             Number(openings) || 1,
      employmentType:       employmentType || 'internship',
      workMode:             workMode || 'onsite',
      location:             location || '',
      salaryOrStipend:      salaryOrStipend || '',
      deadline:             new Date(deadline),
      status:               status === 'draft' ? 'draft' : 'active',
    });

    return NextResponse.json({ success: true, job, message: 'Job posted successfully' }, { status: 201 });
  } catch (err: any) {
    console.error('[CompanyJobs POST]', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
