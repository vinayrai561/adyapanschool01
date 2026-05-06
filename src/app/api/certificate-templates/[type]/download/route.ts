/**
 * GET /api/certificate-templates/:type/download
 * Downloads the certificate template image for the given type.
 *
 * Auth: JWT cookie required (students must be logged in).
 * Security: user can only download their own session's templates.
 */
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/mongodb';
import CertificateTemplate from '@/models/CertificateTemplate';
import { readFile } from 'fs/promises';
import path from 'path';

/* Map type → download filename */
const DOWNLOAD_NAMES: Record<string, string> = {
  best_performance:      'best-performance-certificate.png',
  course_completion:     'course-completion-certificate.png',
  internship_completion: 'internship-completion-certificate.png',
  project_completion:    'project-completion-certificate.png',
};

export async function GET(
  req: NextRequest,
  { params }: { params: { type: string } }
) {
  try {
    /* ── Auth ── */
    const token = req.cookies.get('authToken')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    await connectToDatabase();

    const { type } = params;

    /* ── Find template ── */
    const template = await CertificateTemplate.findOne({ type, isActive: true }).lean();
    if (!template) {
      return NextResponse.json(
        { error: `Certificate template "${type}" not found.` },
        { status: 404 }
      );
    }

    /* ── Read image file from public folder ── */
    // imageUrl is like /certificates/templates/best-performance.png
    const relativePath = (template as any).imageUrl.replace(/^\//, '');
    const filePath = path.join(process.cwd(), 'public', relativePath);

    let fileBuffer: Buffer;
    try {
      fileBuffer = await readFile(filePath);
    } catch {
      return NextResponse.json(
        { error: 'Certificate image file not found on server.' },
        { status: 404 }
      );
    }

    const downloadName = DOWNLOAD_NAMES[type] ?? `${type}-certificate.png`;

    return new NextResponse(fileBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type':        'image/png',
        'Content-Disposition': `attachment; filename="${downloadName}"`,
        'Content-Length':      String(fileBuffer.length),
        'Cache-Control':       'no-store',
      },
    });
  } catch (err: any) {
    console.error('[Template Download]', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
