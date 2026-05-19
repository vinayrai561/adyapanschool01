/**
 * GET /api/talents
 *
 * Fetch talent profiles from MongoDB Atlas with full filtering support.
 * Public endpoint — no auth required (data is curated showcase profiles).
 *
 * Query params:
 *   search         — text search across name, role, skills, education, course
 *   skills         — comma-separated skill filter (e.g. "React,Node.js")
 *   course         — course name filter
 *   education      — education filter
 *   experienceLevel — Fresher | Junior | Mid | Senior | Internship
 *   availability   — available | placed | all (default: all)
 *   status         — available | shortlisted | hired | placed
 *   minPackage     — minimum package expectation (numeric, LPA)
 *   maxPackage     — maximum package expectation (numeric, LPA)
 *   sort           — newest | oldest | rating | projects
 *   page           — page number (default: 1)
 *   limit          — per page (default: 12, max: 50)
 *
 * Returns:
 *   { success, talents[], stats, total, page, limit, pages }
 */

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import StudentTalent from '@/models/StudentTalent';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
  } catch {
    return NextResponse.json(
      {
        success: false,
        error:   'Unable to load real data. Please check MongoDB Atlas connection.',
        dbError: true,
      },
      { status: 503 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);

    const search          = searchParams.get('search')          || '';
    const skillsParam     = searchParams.get('skills')          || '';
    const course          = searchParams.get('course')          || '';
    const education       = searchParams.get('education')       || '';
    const experienceLevel = searchParams.get('experienceLevel') || '';
    const availability    = searchParams.get('availability')    || 'all';
    const status          = searchParams.get('status')          || '';
    const sort            = searchParams.get('sort')            || 'newest';
    const page            = Math.max(1, parseInt(searchParams.get('page')  || '1'));
    const limit           = Math.min(50, parseInt(searchParams.get('limit') || '12'));
    const skip            = (page - 1) * limit;

    // ── Build filter ──────────────────────────────────────────
    const filter: Record<string, unknown> = {};

    // Text search
    if (search.trim()) {
      filter.$or = [
        { name:     { $regex: search, $options: 'i' } },
        { role:     { $regex: search, $options: 'i' } },
        { skills:   { $elemMatch: { $regex: search, $options: 'i' } } },
        { education:{ $regex: search, $options: 'i' } },
        { course:   { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    // Skills filter (comma-separated)
    if (skillsParam.trim()) {
      const skillList = skillsParam.split(',').map(s => s.trim()).filter(Boolean);
      if (skillList.length) {
        filter.skills = {
          $elemMatch: {
            $in: skillList.map(s => new RegExp(s, 'i')),
          },
        };
      }
    }

    // Course filter
    if (course.trim()) {
      filter.course = { $regex: course, $options: 'i' };
    }

    // Education filter
    if (education.trim()) {
      filter.education = { $regex: education, $options: 'i' };
    }

    // Experience level filter
    if (experienceLevel.trim()) {
      filter.experienceLevel = { $regex: experienceLevel, $options: 'i' };
    }

    // Availability / placed filter
    if (availability === 'available') {
      filter.placed = false;
    } else if (availability === 'placed') {
      filter.placed = true;
    }

    // Status filter
    if (status && ['available', 'shortlisted', 'hired', 'placed'].includes(status)) {
      filter.status = status;
    }

    // ── Sort ──────────────────────────────────────────────────
    const sortMap: Record<string, Record<string, 1 | -1>> = {
      newest:   { createdAt: -1 },
      oldest:   { createdAt:  1 },
      rating:   { rating: -1, createdAt: -1 },
      projects: { projectsCount: -1, createdAt: -1 },
    };
    const sortQuery = sortMap[sort] ?? sortMap.newest;

    // ── Fetch ─────────────────────────────────────────────────
    const [talents, total] = await Promise.all([
      StudentTalent.find(filter)
        .sort(sortQuery)
        .skip(skip)
        .limit(limit)
        .lean(),
      StudentTalent.countDocuments(filter),
    ]);

    // ── Stats (always from full collection, no filter) ────────
    const [
      totalStudents,
      availableCount,
      placedCount,
      shortlistedCount,
      hiredCount,
    ] = await Promise.all([
      StudentTalent.countDocuments({}),
      StudentTalent.countDocuments({ status: 'available' }),
      StudentTalent.countDocuments({ placed: true }),
      StudentTalent.countDocuments({ status: 'shortlisted' }),
      StudentTalent.countDocuments({ status: 'hired' }),
    ]);

    return NextResponse.json({
      success: true,
      talents,
      stats: {
        total:       totalStudents,
        available:   availableCount,
        placed:      placedCount,
        shortlisted: shortlistedCount,
        hired:       hiredCount,
      },
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    });
  } catch (err: any) {
    console.error('[Talents GET]', err.message);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
