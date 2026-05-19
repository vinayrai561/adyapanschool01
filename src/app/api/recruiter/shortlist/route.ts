/**
 * POST /api/recruiter/shortlist
 * Add a student to the recruiter's shortlist.
 */

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { protectRouteByRole } from '@/lib/auth';
import RecruiterShortlist from '@/models/RecruiterShortlist';
import RecruiterActivityLog from '@/models/RecruiterActivityLog';
import AuthUser from '@/models/AuthUser';

export async function POST(request: NextRequest) {
  const auth = protectRouteByRole(request, ['COMPANY', 'ADMIN', 'SUPERADMIN']);
  if (auth instanceof NextResponse) return auth;

  try {
    await connectToDatabase();

    const body = await request.json();
    const { studentId, courseSlug, courseName, note } = body;

    if (!studentId) {
      return NextResponse.json({ error: 'Student ID is required' }, { status: 400 });
    }

    // Check if already shortlisted
    const existing = await RecruiterShortlist.findOne({
      recruiterId: auth.userId,
      studentId,
    });

    if (existing) {
      return NextResponse.json({ 
        success: true, 
        message: 'Already shortlisted',
        shortlist: existing 
      });
    }

    // Get student details
    const student = await AuthUser.findById(studentId).select('name email').lean();
    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Create shortlist entry
    const shortlist = await RecruiterShortlist.create({
      recruiterId: auth.userId,
      recruiterEmail: auth.email,
      studentId,
      studentName: student.name,
      studentEmail: student.email,
      courseSlug: courseSlug || '',
      courseName: courseName || '',
      note: note || '',
    });

    // Log activity
    await RecruiterActivityLog.create({
      recruiterId: auth.userId,
      recruiterEmail: auth.email,
      activityType: 'shortlist_add',
      targetStudentId: studentId,
      targetStudentName: student.name,
      metadata: { courseSlug, courseName },
    });

    return NextResponse.json({
      success: true,
      message: 'Student shortlisted successfully',
      shortlist,
    });

  } catch (err: any) {
    console.error('[Shortlist POST]', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * GET /api/recruiter/shortlist
 * Get all shortlisted students for the recruiter.
 */
export async function GET(request: NextRequest) {
  const auth = protectRouteByRole(request, ['COMPANY', 'ADMIN', 'SUPERADMIN']);
  if (auth instanceof NextResponse) return auth;

  try {
    await connectToDatabase();

    const shortlists = await RecruiterShortlist.find({ recruiterId: auth.userId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      shortlists,
      count: shortlists.length,
    });

  } catch (err: any) {
    console.error('[Shortlist GET]', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
