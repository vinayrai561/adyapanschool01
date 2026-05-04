/**
 * POST /api/progress/update
 * Body: { courseSlug, lessonId, moduleId }
 * Marks a lesson as complete and recalculates progress %.
 */
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/mongodb';
import Progress from '@/models/Progress';
import Course from '@/models/Course';

export async function POST(req: NextRequest) {
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

    const { courseSlug, lessonId, moduleId } = await req.json();
    if (!courseSlug || !lessonId) {
      return NextResponse.json({ error: 'courseSlug and lessonId required' }, { status: 400 });
    }

    /* ── Get course total lessons ── */
    const course = await Course.findOne({ slug: courseSlug }).lean();
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
    const pct = totalLessons > 0
      ? Math.round((progress.completedLessons.length / totalLessons) * 100)
      : 0;

    progress.progressPercent = pct;
    if (pct === 100 && !progress.completedAt) {
      progress.completedAt = new Date();
    }
    await progress.save();

    return NextResponse.json({
      success: true,
      progressPercent:  pct,
      completedLessons: progress.completedLessons,
      totalLessons,
      completedAt: progress.completedAt ?? null,
    });
  } catch (err: any) {
    console.error('[Progress Update]', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
