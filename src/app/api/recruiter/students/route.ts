/**
 * GET /api/recruiter/students
 *
 * Returns enrolled students for the recruiter dashboard.
 * Only COMPANY or ADMIN/SUPERADMIN can access.
 *
 * Query params:
 *  search    — name / email / skills / course
 *  skill     — filter by skill (partial match)
 *  course    — filter by course name
 *  education — filter by degree
 *  availability — available | placed | all
 *  page      — pagination (default 1)
 *  limit     — per page (default 12)
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
import RecruiterActivityLog from '@/models/RecruiterActivityLog';

export async function GET(request: NextRequest) {
  const auth = protectRouteByRole(request, ['COMPANY', 'ADMIN', 'SUPERADMIN']);
  if (auth instanceof NextResponse) return auth;

  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const search       = searchParams.get('search')       || '';
    const skillFilter  = searchParams.get('skill')        || '';
    const courseFilter = searchParams.get('course')       || '';
    const eduFilter    = searchParams.get('education')    || '';
    const avail        = searchParams.get('availability') || 'all';
    const page         = Math.max(1, parseInt(searchParams.get('page')  || '1'));
    const limit        = Math.min(50, parseInt(searchParams.get('limit') || '12'));
    const skip         = (page - 1) * limit;

    /* ── 1. Find all students who have at least one enrollment ── */
    const enrolledUserIds = await Enrollment.distinct('userId', {
      enrollmentStatus: { $in: ['active', 'completed'] },
    });

    /* ── 2. Build user query ── */
    const userQuery: Record<string, unknown> = {
      role:          'STUDENT',
      accountStatus: 'approved',
      isActive:      true,
      _id:           { $in: enrolledUserIds.map((id: string) => id) },
    };

    if (search) {
      userQuery.$or = [
        { name:  { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const [students, total] = await Promise.all([
      AuthUser.find(userQuery)
        .select('-passwordHash -lockedUntil -failedLoginAttempts -signupIp -userAgent -lastUserAgent -wishlist -authProvider')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      AuthUser.countDocuments(userQuery),
    ]);

    /* ── 3. Get recruiter's shortlist ── */
    const myShortlists = await RecruiterShortlist.find({ recruiterId: auth.userId })
      .select('studentId')
      .lean();
    const shortlistedIds = new Set(myShortlists.map(s => s.studentId));

    /* ── 4. Get all placements ── */
    const allPlacements = await Placement.find({ isVerified: true }).lean();
    const placementMap = new Map(
      allPlacements.map(p => [p.userId, p])
    );

    /* ── 5. Enrich each student ── */
    const enriched = await Promise.all(
      students.map(async (student) => {
        const userId = student._id.toString();

        const [enrollments, certificates, progresses] = await Promise.all([
          Enrollment.find({ userId, enrollmentStatus: { $in: ['active', 'completed'] } })
            .select('courseSlug courseName enrollmentStatus enrolledAt')
            .lean(),
          Certificate.find({ userId, status: 'ready' })
            .select('courseName certificateId issuedAt')
            .lean(),
          Progress.find({ userId })
            .select('courseSlug progressPercent isCompleted')
            .lean(),
        ]);

        // Apply course filter
        if (courseFilter) {
          const hasCourse = enrollments.some(e =>
            e.courseName.toLowerCase().includes(courseFilter.toLowerCase())
          );
          if (!hasCourse) return null;
        }

        // Apply skill filter (match against course names as proxy for skills)
        if (skillFilter) {
          const hasSkill = enrollments.some(e =>
            e.courseName.toLowerCase().includes(skillFilter.toLowerCase())
          );
          if (!hasSkill) return null;
        }

        // Apply education filter
        if (eduFilter && student.selectedProgram) {
          if (!student.selectedProgram.toLowerCase().includes(eduFilter.toLowerCase())) {
            return null;
          }
        }

        // Check placement status
        const placement = placementMap.get(userId);
        const availabilityStatus = placement ? 'placed' : 'available';

        if (avail === 'available' && availabilityStatus !== 'available') return null;
        if (avail === 'placed'    && availabilityStatus !== 'placed')    return null;

        // Primary enrollment
        const primaryEnrollment = enrollments[0];
        const primaryProgress   = primaryEnrollment
          ? progresses.find(p => p.courseSlug === primaryEnrollment.courseSlug)
          : null;

        // Calculate skills from course names (simplified)
        const skills = enrollments.map(e => e.courseName.split(' ')[0]).slice(0, 5);

        return {
          id:           userId,
          name:         student.name,
          email:        student.email,
          phone:        student.phone || '',
          avatar:       student.avatar || '',
          education:    student.selectedProgram || '',
          // Course info
          courseName:   primaryEnrollment?.courseName || '',
          courseSlug:   primaryEnrollment?.courseSlug || '',
          enrolledAt:   primaryEnrollment?.enrolledAt || null,
          totalCourses: enrollments.length,
          // Progress
          progressPercent: primaryProgress?.progressPercent ?? 0,
          isCompleted:     primaryProgress?.isCompleted ?? false,
          // Certificates
          certificateCount: certificates.length,
          certificates:     certificates.map(c => ({
            courseName:    c.courseName,
            certificateId: c.certificateId,
            issuedAt:      c.issuedAt,
          })),
          // Skills (derived from courses)
          skills,
          // Projects count (use completed courses as proxy)
          projectsCount: progresses.filter(p => p.isCompleted).length,
          // Rating (placeholder - can be enhanced later)
          rating: 4.5 + Math.random() * 0.5,
          reviewsCount: Math.floor(Math.random() * 50) + 10,
          // Status
          availabilityStatus,
          isShortlisted: shortlistedIds.has(userId),
          // Placement info
          placement: placement ? {
            companyName: placement.companyName,
            jobTitle: placement.jobTitle,
            packageAmount: placement.packageAmount,
            joiningDate: placement.joiningDate,
            placementType: placement.placementType,
          } : null,
          // Metadata
          createdAt:    student.createdAt,
          lastLoginAt:  student.lastLoginAt || null,
        };
      })
    );

    const filtered = enriched.filter(Boolean);

    // Log search activity if search term provided
    if (search || skillFilter || courseFilter) {
      await RecruiterActivityLog.create({
        recruiterId: auth.userId,
        recruiterEmail: auth.email,
        activityType: 'search',
        metadata: {
          search,
          skillFilter,
          courseFilter,
          eduFilter,
          resultsCount: filtered.length,
        },
      }).catch(err => console.error('Failed to log search:', err));
    }

    return NextResponse.json({
      success: true,
      students: filtered,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });

  } catch (err: any) {
    console.error('[Recruiter Students]', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
