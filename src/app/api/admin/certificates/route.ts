import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { protectRouteByRole } from '@/lib/auth';
import Certificate from '@/models/Certificate';
import AuthUser from '@/models/AuthUser';

export async function GET(request: NextRequest) {
  const auth = protectRouteByRole(request, ['ADMIN', 'COMPANY']);
  if (auth instanceof NextResponse) return auth;

  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const search  = searchParams.get('search') || '';
    const status  = searchParams.get('status') || '';
    const course  = searchParams.get('course') || '';
    const page    = parseInt(searchParams.get('page') || '1');
    const limit   = parseInt(searchParams.get('limit') || '20');
    const skip    = (page - 1) * limit;

    const query: any = {};
    if (status) query.status = status;
    if (course) query.courseSlug = { $regex: course, $options: 'i' };
    if (search) {
      query.$or = [
        { studentName: { $regex: search, $options: 'i' } },
        { courseName:  { $regex: search, $options: 'i' } },
        { certificateId: { $regex: search, $options: 'i' } },
      ];
    }

    const [certificates, total] = await Promise.all([
      Certificate.find(query).sort({ issuedAt: -1 }).skip(skip).limit(limit).lean(),
      Certificate.countDocuments(query),
    ]);

    // Enrich with user email
    const enriched = await Promise.all(
      certificates.map(async (cert) => {
        const user = await AuthUser.findById(cert.userId).select('email phone').lean();
        return {
          id:              cert._id.toString(),
          certificateId:   cert.certificateId,
          studentName:     cert.studentName,
          studentEmail:    (user as any)?.email || '',
          studentPhone:    (user as any)?.phone || '',
          courseName:      cert.courseName,
          courseSlug:      cert.courseSlug,
          certificateType: cert.certificateType,
          status:          cert.status,
          emailSent:       cert.emailSent,
          issuedAt:        cert.issuedAt,
          downloadUrl:     `/api/certificates/${cert.courseSlug}/download`,
          userId:          cert.userId,
        };
      })
    );

    // Summary stats
    const [totalReady, totalPending, totalEmailSent] = await Promise.all([
      Certificate.countDocuments({ status: 'ready' }),
      Certificate.countDocuments({ status: 'pending' }),
      Certificate.countDocuments({ emailSent: true }),
    ]);

    return NextResponse.json({
      success: true,
      certificates: enriched,
      summary: { totalReady, totalPending, totalEmailSent },
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err: any) {
    console.error('[Admin Certificates]', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
