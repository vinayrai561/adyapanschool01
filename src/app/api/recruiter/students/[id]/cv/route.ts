/**
 * GET /api/recruiter/students/[id]/cv
 * Download student CV and log the action.
 */

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { protectRouteByRole } from '@/lib/auth';
import AuthUser from '@/models/AuthUser';
import StudentCV from '@/models/StudentCV';
import CVDownloadLog from '@/models/CVDownloadLog';
import RecruiterActivityLog from '@/models/RecruiterActivityLog';
import Enrollment from '@/models/Enrollment';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = protectRouteByRole(request, ['COMPANY', 'ADMIN', 'SUPERADMIN']);
  if (auth instanceof NextResponse) return auth;
  try {
    await connectToDatabase();
    const { id: studentId } = await params;

    // Get student details
    const student = await AuthUser.findById(studentId)
      .select('name email')
      .lean();

    if (!student || student.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Get active CV
    const cv = await StudentCV.findOne({ userId: studentId, isActive: true })
      .sort({ uploadedAt: -1 })
      .lean();

    if (!cv) {
      return NextResponse.json({ 
        error: 'CV not uploaded',
        message: 'This student has not uploaded their CV yet.' 
      }, { status: 404 });
    }

    // Get primary enrollment for context
    const enrollment = await Enrollment.findOne({ userId: studentId })
      .sort({ enrolledAt: -1 })
      .select('courseSlug courseName')
      .lean();

    // Get IP and user agent
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Log CV download
    await CVDownloadLog.create({
      recruiterId: auth.userId,
      recruiterEmail: auth.email,
      studentId,
      studentName: student.name,
      studentEmail: student.email,
      courseSlug: enrollment?.courseSlug || '',
      courseName: enrollment?.courseName || '',
      downloadedAt: new Date(),
      ipAddress,
      userAgent,
    });

    // Log activity
    await RecruiterActivityLog.create({
      recruiterId: auth.userId,
      recruiterEmail: auth.email,
      activityType: 'cv_download',
      targetStudentId: studentId,
      targetStudentName: student.name,
      metadata: {
        fileName: cv.fileName,
        fileSize: cv.fileSize,
      },
      ipAddress,
      userAgent,
    });

    // Increment download count
    await StudentCV.updateOne(
      { _id: cv._id },
      { $inc: { downloadCount: 1 } }
    );

    return NextResponse.json({
      success: true,
      cv: {
        fileName: cv.fileName,
        fileUrl: cv.fileUrl,
        fileSize: cv.fileSize,
        mimeType: cv.mimeType,
        uploadedAt: cv.uploadedAt,
      },
    });

  } catch (err: any) {
    console.error('[CV Download]', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
