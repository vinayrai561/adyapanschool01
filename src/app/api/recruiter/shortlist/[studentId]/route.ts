/**
 * DELETE /api/recruiter/shortlist/[studentId]
 * Remove a student from the recruiter's shortlist.
 */

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { protectRouteByRole } from '@/lib/auth';
import RecruiterShortlist from '@/models/RecruiterShortlist';
import RecruiterActivityLog from '@/models/RecruiterActivityLog';
import AuthUser from '@/models/AuthUser';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ studentId: string }> }
) {
  const auth = protectRouteByRole(request, ['COMPANY', 'ADMIN', 'SUPERADMIN']);
  if (auth instanceof NextResponse) return auth;

  try {
    await connectToDatabase();
    const { studentId } = await params;
    const shortlist = await RecruiterShortlist.findOne({ recruiterId: auth.userId, studentId });
    if (!shortlist) return NextResponse.json({ error: 'Not found in shortlist' }, { status: 404 });

    await RecruiterShortlist.deleteOne({ recruiterId: auth.userId, studentId });
    await RecruiterActivityLog.create({
      recruiterId: auth.userId, recruiterEmail: auth.email,
      activityType: 'shortlist_remove', targetStudentId: studentId,
      targetStudentName: shortlist.studentName,
    }).catch(err => console.error('Failed to log shortlist removal:', err));

    return NextResponse.json({ success: true, message: 'Removed from shortlist' });
  } catch (err: any) {
    console.error('[Shortlist DELETE]', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
