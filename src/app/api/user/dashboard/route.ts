/**
 * GET /api/user/dashboard
 * Returns: user info + enrolled courses + progress for each.
 * Auth: JWT cookie (authToken)
 */
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/mongodb';
import AuthUser from '@/models/AuthUser';
import Enrollment from '@/models/Enrollment';
import Progress from '@/models/Progress';
import Course from '@/models/Course';
import Certificate from '@/models/Certificate';
import { COURSE_CATALOGUE, withTotalLessons } from '@/lib/courseData';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    /* ── Auth ── */
    const token = req.cookies.get('authToken')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    let decoded: { userId: string };
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: string };
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const user = await AuthUser.findById(decoded.userId).lean();
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    /* ── Enrollments ── */
    const enrollments = await Enrollment.find({ userId: decoded.userId }).lean();

    /* ── Progress for each enrollment ── */
    const dashboardCourses = await Promise.all(
      enrollments.map(async (enr) => {
        /* Get or auto-seed course */
        let course = await Course.findOne({ slug: enr.courseSlug }).lean();
        if (!course) {
          const raw = COURSE_CATALOGUE.find(c => c.slug === enr.courseSlug);
          if (raw) {
            const data = withTotalLessons(raw);
            course = await Course.findOneAndUpdate(
              { slug: data.slug }, { $set: data }, { upsert: true, new: true }
            ).lean();
          }
        }

        /* Get or init progress */
        let progress = await Progress.findOne({
          userId: decoded.userId,
          courseSlug: enr.courseSlug,
        }).lean();

        if (!progress) {
          const totalLessons = course?.totalLessons ?? 0;
          progress = await Progress.create({
            userId:           decoded.userId,
            courseSlug:       enr.courseSlug,
            completedLessons: [],
            progressPercent:  0,
            totalLessons,
          });
        }

        const progressPercent = (progress as any).progressPercent ?? 0;
        const isComplete = progressPercent === 100;

        /* Get certificate if course is complete */
        let certificateData = null;
        if (isComplete) {
          const cert = await Certificate.findOne({
            userId: decoded.userId,
            courseSlug: enr.courseSlug,
          }).lean();

          if (cert) {
            certificateData = {
              certificateId: (cert as any).certificateId,
              studentName:   (cert as any).studentName,
              courseName:    (cert as any).courseName,
              issuedAt:      (cert as any).issuedAt,
              status:        (cert as any).status,
              downloadUrl:   `/api/certificates/${enr.courseSlug}/download`,
            };
          }
        }

        return {
          enrollment: {
            id:         enr._id.toString(),
            courseSlug: enr.courseSlug,
            courseName: enr.courseName,
            planLabel:  enr.planLabel,
            amountPaid: enr.amountPaid,
            enrolledAt: enr.enrolledAt,
          },
          course: course
            ? {
                slug:         (course as any).slug,
                title:        (course as any).title,
                subtitle:     (course as any).subtitle,
                duration:     (course as any).duration,
                totalLessons: (course as any).totalLessons,
                thumbnail:    (course as any).thumbnail,
                category:     (course as any).category,
                level:        (course as any).level,
                modules:      (course as any).modules ?? [],
              }
            : null,
          progress: {
            completedLessons: (progress as any).completedLessons ?? [],
            progressPercent,
            totalLessons:     (progress as any).totalLessons ?? 0,
            lastLessonId:     (progress as any).lastLessonId ?? '',
            lastModuleId:     (progress as any).lastModuleId ?? '',
            completedAt:      (progress as any).completedAt ?? null,
            isComplete,
          },
          certificate: certificateData,
        };
      })
    );

    return NextResponse.json({
      success: true,
      user: {
        id:    user._id.toString(),
        name:  user.name,
        email: user.email,
        role:  user.role,
        avatar: user.avatar ?? null,
      },
      enrolledCount: enrollments.length,
      courses: dashboardCourses,
    });
  } catch (err: any) {
    console.error('[Dashboard API]', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
