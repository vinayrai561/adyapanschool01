/**
 * GET /api/certificates/:courseId
 * Returns certificate details for the authenticated user's course.
 */
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { protectRoute } from '@/lib/auth';
import Certificate from '@/models/Certificate';
import Progress from '@/models/Progress';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const auth = protectRoute(req);
  if (auth instanceof NextResponse) return auth;

  try {
    await connectToDatabase();
    const { courseId: courseSlug } = await params;

    /* ── Check progress ── */
    const progress = await Progress.findOne({
      userId: auth.userId,
      courseSlug,
    }).lean();

    const progressPercent = (progress as any)?.progressPercent ?? 0;
    const isComplete = progressPercent === 100;

    if (!isComplete) {
      return NextResponse.json({
        success: true,
        isComplete: false,
        progressPercent,
        certificate: null,
        message: 'Complete all lessons to unlock your certificate.',
      });
    }

    /* ── Fetch certificate ── */
    const cert = await Certificate.findOne({
      userId: auth.userId,
      courseSlug,
    }).lean();

    if (!cert) {
      return NextResponse.json({
        success: true,
        isComplete: true,
        progressPercent,
        certificate: null,
        message: 'Certificate is being generated.',
      });
    }

    return NextResponse.json({
      success: true,
      isComplete: true,
      progressPercent,
      certificate: {
        certificateId:  (cert as any).certificateId,
        studentName:    (cert as any).studentName,
        courseName:     (cert as any).courseName,
        issuedAt:       (cert as any).issuedAt,
        status:         (cert as any).status,
        downloadUrl:    `/api/certificates/${courseSlug}/download`,
      },
    });
  } catch (err: any) {
    console.error('[Certificate GET]', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
