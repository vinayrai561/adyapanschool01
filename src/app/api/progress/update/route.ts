/**
 * POST /api/progress/update
 * Body: { courseSlug, lessonId, moduleId }
 * Marks a lesson complete and recalculates progress %.
 * Uses db-service for consistent persistence.
 */
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { protectRoute } from '@/lib/auth';
import { sanitizeMongoInput } from '@/lib/security';
import { updateProgress } from '@/lib/db-service';
import AuthUser from '@/models/AuthUser';
import Course from '@/models/Course';
import { COURSE_CATALOGUE, withTotalLessons } from '@/lib/courseData';

export async function POST(req: NextRequest) {
  const auth = protectRoute(req);
  if (auth instanceof NextResponse) return auth;

  try {
    await connectToDatabase();

    // ── Auth ──
    const { courseSlug, lessonId, moduleId } = sanitizeMongoInput(await req.json());
    if (!courseSlug || !lessonId) {
      return NextResponse.json({ error: 'courseSlug and lessonId required' }, { status: 400 });
    }

    // ── Fetch user name for certificate generation ──
    const user = await AuthUser.findById(auth.userId).lean();
    const userName = (user as any)?.name || 'Student';

    // ── Ensure course exists ──
    let course = await Course.findOne({ slug: courseSlug }).lean();
    if (!course) {
      const raw = COURSE_CATALOGUE.find(c => c.slug === courseSlug);
      if (raw) {
        const data = withTotalLessons(raw);
        course = await Course.findOneAndUpdate(
          { slug: data.slug }, { $set: data }, { upsert: true, new: true }
        ).lean();
      }
    }

    const result = await updateProgress(
      { userId: auth.userId, courseSlug, lessonId, moduleId },
      userName,
      (course as any)?.title
    );

    return NextResponse.json({
      success:          true,
      progressPercent:  result.progressPercent,
      completedLessons: result.completedLessons,
      totalLessons:     result.totalLessons,
      completedAt:      result.completedAt,
      isComplete:       result.isCompleted,
    });

  } catch (err: any) {
    console.error('[Progress Update]', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
