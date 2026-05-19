/**
 * GET /api/recruiter/students/[id]
 * Returns full student profile for the recruiter.
 */

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { protectRouteByRole } from '@/lib/auth';
import AuthUser from '@/models/AuthUser';
import Enrollment from '@/models/Enrollment';
import Certificate from '@/models/Certificate';
import Progress from '@/models/Progress';
import RecruiterShortlist from '@/models/RecruiterShortlist';
import Placement from '@/models/Placement';
import StudentCV from '@/models/StudentCV';
import RecruiterActivityLog from '@/models/RecruiterActivityLog';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = protectRouteByRole(request, ['COMPANY', 'ADMIN', 'SUPERADMIN']);
  if (auth instanceof NextResponse) return auth;

  try {
    await connectToDatabase();
    const { id } = await params;
    const student = await AuthUser.findById(id)
      .select('-passwordHash -lockedUntil -failedLoginAttempts -signupIp -userAgent -lastUserAgent')
      .lean();

    if (!student || student.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    const userId = student._id.toString();

    const [enrollments, certificates, progresses, shortlistEntry, placement, cv] = await Promise.all([
      Enrollment.find({ userId }).sort({ enrolledAt: -1 }).lean(),
      Certificate.find({ userId, status: 'ready' }).lean(),
      Progress.find({ userId }).lean(),
      RecruiterShortlist.findOne({ recruiterId: auth.userId, studentId: userId }).lean(),
      Placement.findOne({ userId, isVerified: true }).lean(),
      StudentCV.findOne({ userId, isActive: true }).sort({ uploadedAt: -1 }).lean(),
    ]);

    const enrichedEnrollments = enrollments.map(e => {
      const prog = progresses.find(p => p.courseSlug === e.courseSlug);
      const cert = certificates.find(c => c.courseSlug === e.courseSlug);
      return {
        courseSlug:      e.courseSlug,
        courseName:      e.courseName,
        planLabel:       e.planLabel,
        enrollmentStatus: e.enrollmentStatus,
        enrolledAt:      e.enrolledAt,
        progressPercent: prog?.progressPercent ?? 0,
        isCompleted:     prog?.isCompleted ?? false,
        certificateId:   cert?.certificateId || null,
        certificateUrl:  cert?.certificateUrl || null,
      };
    });

    // Calculate skills from courses
    const skills = enrollments.map(e => e.courseName.split(' ')[0]).slice(0, 10);

    // Projects count (completed courses)
    const projectsCount = progresses.filter(p => p.isCompleted).length;

    // Log profile view
    await RecruiterActivityLog.create({
      recruiterId: auth.userId,
      recruiterEmail: auth.email,
      activityType: 'profile_view',
      targetStudentId: userId,
      targetStudentName: student.name,
    }).catch(err => console.error('Failed to log profile view:', err));

    return NextResponse.json({
      success: true,
      student: {
        id:           userId,
        name:         student.name,
        email:        student.email,
        phone:        student.phone || '',
        avatar:       student.avatar || '',
        education:    student.selectedProgram || '',
        createdAt:    student.createdAt,
        lastLoginAt:  student.lastLoginAt || null,
        enrollments:  enrichedEnrollments,
        certificates: certificates.map(c => ({
          courseName:    c.courseName,
          certificateId: c.certificateId,
          certificateUrl: c.certificateUrl,
          issuedAt:      c.issuedAt,
        })),
        skills,
        projectsCount,
        totalCourses:       enrollments.length,
        totalCertificates:  certificates.length,
        isShortlisted:      !!shortlistEntry,
        shortlistedAt:      shortlistEntry?.createdAt || null,
        // Placement info
        placement: placement ? {
          companyName: placement.companyName,
          jobTitle: placement.jobTitle,
          packageAmount: placement.packageAmount,
          joiningDate: placement.joiningDate,
          placementType: placement.placementType,
        } : null,
        availabilityStatus: placement ? 'placed' : 'available',
        // CV info
        hasCV: !!cv,
        cvFileName: cv?.fileName || null,
        cvUploadedAt: cv?.uploadedAt || null,
      },
    });

  } catch (err: any) {
    console.error('[Recruiter Student Profile]', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
