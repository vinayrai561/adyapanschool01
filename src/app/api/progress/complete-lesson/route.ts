/**
 * POST /api/progress/complete-lesson
 * Body: { courseSlug, lessonId, moduleId }
 *
 * Marks a lesson complete, recalculates progress.
 * At 100%: auto-generates Certificate, sends certificate-ready email, logs it.
 */
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { protectRoute } from '@/lib/auth';
import { sanitizeMongoInput } from '@/lib/security';
import { updateProgress, logEmail, wasEmailSent } from '@/lib/db-service';
import { sendCertificateReadyEmail } from '@/lib/email';
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
      return NextResponse.json({ error: 'courseSlug and lessonId are required' }, { status: 400 });
    }

    // ── Fetch user ──
    const user = await AuthUser.findById(auth.userId).lean();
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

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

    const courseTitle = (course as any)?.title || courseSlug;
    const userName    = (user as any).name || 'Student';
    const userEmail   = (user as any).email || '';

    // ── Update progress via db-service ──
    const result = await updateProgress(
      { userId: auth.userId, courseSlug, lessonId, moduleId },
      userName,
      courseTitle
    );

    // ── If course just completed → send certificate email ──
    if (result.certificateGenerated && result.certificate && userEmail) {
      const alreadySent = await wasEmailSent('userId', auth.userId, 'certificate_ready');

      if (!alreadySent) {
        let emailStatus: 'sent' | 'failed' = 'failed';
        let errorMessage = '';

        try {
          const sent = await sendCertificateReadyEmail({
            name:          userName,
            email:         userEmail,
            courseName:    result.certificate.courseName,
            courseSlug,
            certificateId: result.certificate.certificateId,
            issuedAt:      result.certificate.issuedAt,
          });
          emailStatus = sent ? 'sent' : 'failed';
          if (!sent) errorMessage = 'SendGrid returned non-202';
        } catch (e: any) {
          errorMessage = e?.message || 'Unknown error';
          console.error('[Email] Certificate email failed:', errorMessage);
        }

        await logEmail({
          userId:        auth.userId,
          email:         userEmail,
          emailType:     'certificate_ready',
          subject:       `Your Certificate is Ready — ${result.certificate.courseName}`,
          status:        emailStatus,
          errorMessage,
          courseSlug,
          courseName:    result.certificate.courseName,
          certificateId: result.certificate.certificateId,
        });
      }
    }

    return NextResponse.json({
      success:              true,
      progressPercent:      result.progressPercent,
      completedLessons:     result.completedLessons,
      totalLessons:         result.totalLessons,
      completedAt:          result.completedAt,
      isComplete:           result.isCompleted,
      certificateGenerated: result.certificateGenerated,
      certificate:          result.certificate,
    });

  } catch (err: any) {
    console.error('[Complete Lesson]', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
