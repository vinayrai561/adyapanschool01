/**
 * POST /api/progress/complete-lesson
 * Body: { courseSlug, lessonId, moduleId }
 *
 * Marks a lesson as complete, recalculates progress.
 * When progress hits 100%, auto-generates a Certificate record.
 */
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/mongodb';
import Progress from '@/models/Progress';
import Course from '@/models/Course';
import Certificate from '@/models/Certificate';
import AuthUser from '@/models/AuthUser';
import { COURSE_CATALOGUE, withTotalLessons } from '@/lib/courseData';

function generateCertificateId(): string {
  const year = new Date().getFullYear();
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ADYP-${year}-${rand}`;
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    /* ── Auth ── */
    const token = req.cookies.get('authToken')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    let decoded: { userId: string };
    try {
      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'your-secret-key'
      ) as { userId: string };
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { courseSlug, lessonId, moduleId } = await req.json();
    if (!courseSlug || !lessonId) {
      return NextResponse.json(
        { error: 'courseSlug and lessonId are required' },
        { status: 400 }
      );
    }

    /* ── Fetch user ── */
    const user = await AuthUser.findById(decoded.userId).lean();
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    /* ── Get or seed course ── */
    let course = await Course.findOne({ slug: courseSlug }).lean();
    if (!course) {
      const raw = COURSE_CATALOGUE.find((c) => c.slug === courseSlug);
      if (raw) {
        const data = withTotalLessons(raw);
        course = await Course.findOneAndUpdate(
          { slug: data.slug },
          { $set: data },
          { upsert: true, new: true }
        ).lean();
      }
    }
    const totalLessons = (course as any)?.totalLessons ?? 0;

    /* ── Upsert progress ── */
    const progress = await Progress.findOneAndUpdate(
      { userId: decoded.userId, courseSlug },
      {
        $addToSet: { completedLessons: lessonId },
        $set: {
          lastLessonId: lessonId,
          lastModuleId: moduleId ?? '',
          totalLessons,
        },
      },
      { upsert: true, new: true }
    );

    /* ── Recalculate percent ── */
    const pct =
      totalLessons > 0
        ? Math.round((progress.completedLessons.length / totalLessons) * 100)
        : 0;

    progress.progressPercent = pct;

    let certificateGenerated = false;
    let certificate = null;

    /* ── Course complete → generate certificate ── */
    if (pct === 100 && !progress.completedAt) {
      progress.completedAt = new Date();

      // Check if certificate already exists
      const existing = await Certificate.findOne({
        userId: decoded.userId,
        courseSlug,
      });

      if (!existing) {
        const certId = generateCertificateId();
        certificate = await Certificate.create({
          userId:        decoded.userId,
          courseSlug,
          certificateId: certId,
          studentName:   (user as any).name,
          courseName:    (course as any)?.title ?? courseSlug,
          issuedAt:      new Date(),
          status:        'ready',
          certificateUrl: `/api/certificates/${courseSlug}/download`,
        });
        certificateGenerated = true;
      } else {
        certificate = existing;
      }
    }

    await progress.save();

    return NextResponse.json({
      success: true,
      progressPercent:  pct,
      completedLessons: progress.completedLessons,
      totalLessons,
      completedAt:      progress.completedAt ?? null,
      isComplete:       pct === 100,
      certificateGenerated,
      certificate: certificate
        ? {
            certificateId:  certificate.certificateId,
            studentName:    certificate.studentName,
            courseName:     certificate.courseName,
            issuedAt:       certificate.issuedAt,
            status:         certificate.status,
            downloadUrl:    `/api/certificates/${courseSlug}/download`,
          }
        : null,
    });
  } catch (err: any) {
    console.error('[Complete Lesson]', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
