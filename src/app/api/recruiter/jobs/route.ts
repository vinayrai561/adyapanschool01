/**
 * POST /api/recruiter/jobs
 * Create a new job posting.
 * 
 * GET /api/recruiter/jobs
 * Get all jobs posted by the recruiter.
 */

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { protectRouteByRole } from '@/lib/auth';
import RecruiterJob from '@/models/RecruiterJob';
import RecruiterActivityLog from '@/models/RecruiterActivityLog';

export async function POST(request: NextRequest) {
  const auth = protectRouteByRole(request, ['COMPANY', 'ADMIN', 'SUPERADMIN']);
  if (auth instanceof NextResponse) return auth;

  try {
    await connectToDatabase();

    const body = await request.json();
    const { 
      title, 
      description, 
      requiredSkills, 
      budget, 
      deadline, 
      jobType,
      status 
    } = body;

    if (!title || !description) {
      return NextResponse.json({ 
        error: 'Title and description are required' 
      }, { status: 400 });
    }

    // Create job
    const job = await RecruiterJob.create({
      recruiterId: auth.userId,
      recruiterEmail: auth.email,
      recruiterName: auth.name || '',
      title: title.trim(),
      description: description.trim(),
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : [],
      budget: budget || undefined,
      deadline: deadline ? new Date(deadline) : undefined,
      jobType: jobType || 'internship',
      status: status || 'open',
      applicants: [],
    });

    // Log activity
    await RecruiterActivityLog.create({
      recruiterId: auth.userId,
      recruiterEmail: auth.email,
      activityType: 'job_post',
      targetJobId: job._id.toString(),
      metadata: {
        title,
        jobType,
        requiredSkills,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Job posted successfully',
      job,
    }, { status: 201 });

  } catch (err: any) {
    console.error('[Job POST]', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const auth = protectRouteByRole(request, ['COMPANY', 'ADMIN', 'SUPERADMIN']);
  if (auth instanceof NextResponse) return auth;

  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';

    const query: Record<string, any> = { recruiterId: auth.userId };
    if (status !== 'all') {
      query.status = status;
    }

    const jobs = await RecruiterJob.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      jobs,
      count: jobs.length,
    });

  } catch (err: any) {
    console.error('[Jobs GET]', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
