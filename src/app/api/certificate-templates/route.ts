/**
 * GET /api/certificate-templates
 * Returns all active certificate templates.
 * Public endpoint — no auth required (templates are public previews).
 */
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import CertificateTemplate from '@/models/CertificateTemplate';

export async function GET() {
  try {
    await connectToDatabase();

    const templates = await CertificateTemplate.find({ isActive: true })
      .sort({ createdAt: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      templates: templates.map((t: any) => ({
        id:       t._id.toString(),
        type:     t.type,
        title:    t.title,
        imageUrl: t.imageUrl,
        isActive: t.isActive,
      })),
    });
  } catch (err: any) {
    console.error('[Certificate Templates GET]', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
