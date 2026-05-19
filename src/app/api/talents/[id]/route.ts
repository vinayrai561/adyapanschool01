/**
 * PATCH /api/talents/:id
 *
 * Update a talent's status or details.
 * Used by shortlist button and admin dashboard.
 */

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { protectRouteByRole } from '@/lib/auth';
import { sanitizeMongoInput } from '@/lib/security';
import StudentTalent from '@/models/StudentTalent';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = protectRouteByRole(req, ['ADMIN', 'SUPERADMIN']);
  if (auth instanceof NextResponse) return auth;

  try {
    await connectToDatabase();
  } catch {
    return NextResponse.json(
      { success: false, error: 'Database connection failed.' },
      { status: 503 }
    );
  }

  try {
    const { id } = await params;
    const body = sanitizeMongoInput(await req.json()) as Record<string, unknown>;

    // Whitelist updatable fields
    const allowed = [
      'status', 'placed', 'availability', 'packageExpectation',
      'company', 'role', 'skills', 'education', 'course',
      'experienceLevel', 'projectsCount', 'certificatesCount',
      'rating', 'portfolio', 'github', 'linkedin',
      'location', 'resumeUrl', 'profileSummary', 'objective',
      'experience', 'projects', 'certifications',
    ] as const;

    const update: Record<string, unknown> = {};
    for (const key of allowed) {
      if (body[key] !== undefined) update[key] = body[key];
    }

    // Auto-sync placed flag when status changes
    if (update.status === 'placed') update.placed = true;
    if (update.status === 'available' || update.status === 'shortlisted') {
      update.placed = false;
    }

    if (!Object.keys(update).length) {
      return NextResponse.json(
        { success: false, error: 'No valid fields to update.' },
        { status: 400 }
      );
    }

    const talent = await StudentTalent.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true, runValidators: true }
    ).lean();

    if (!talent) {
      return NextResponse.json(
        { success: false, error: 'Talent not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, talent });
  } catch (err: any) {
    console.error('[Talents PATCH]', err.message);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = protectRouteByRole(req, ['ADMIN', 'SUPERADMIN']);
  if (auth instanceof NextResponse) return auth;

  try {
    await connectToDatabase();
  } catch {
    return NextResponse.json({ success: false, error: 'Database connection failed.' }, { status: 503 });
  }

  try {
    const { id } = await params;
    const talent = await StudentTalent.findById(id).lean();
    if (!talent) {
      return NextResponse.json({ success: false, error: 'Talent not found.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, talent });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = protectRouteByRole(req, ['ADMIN', 'SUPERADMIN']);
  if (auth instanceof NextResponse) return auth;

  try {
    await connectToDatabase();
  } catch {
    return NextResponse.json({ success: false, error: 'Database connection failed.' }, { status: 503 });
  }

  try {
    const { id } = await params;
    const talent = await StudentTalent.findByIdAndDelete(id).lean();
    if (!talent) {
      return NextResponse.json({ success: false, error: 'Talent not found.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Talent deleted.' });
  } catch (err: any) {
    console.error('[Talents DELETE]', err.message);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
