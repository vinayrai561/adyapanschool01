/**
 * GET /api/jobs — public job listing for students
 * Supports filters: category, employmentType, workMode, location, skills, search
 * Pagination: page, limit
 */
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import JobPost from '@/models/JobPost';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);

    const page           = Math.max(1, Number(searchParams.get('page') || 1));
    const limit          = Math.min(50, Math.max(1, Number(searchParams.get('limit') || 12)));
    const skip           = (page - 1) * limit;
    const search         = searchParams.get('search')?.trim() || '';
    const category       = searchParams.get('category') || '';
    const employmentType = searchParams.get('employmentType') || '';
    const workMode       = searchParams.get('workMode') || '';
    const location       = searchParams.get('location') || '';
    const skills         = searchParams.get('skills') || '';

    const query: Record<string, any> = { status: 'active' };

    if (search) {
      query.$or = [
        { jobTitle:    { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location:    { $regex: search, $options: 'i' } },
      ];
    }
    if (category)       query.category       = { $regex: category, $options: 'i' };
    if (employmentType) query.employmentType  = employmentType;
    if (workMode)       query.workMode        = workMode;
    if (location)       query.location        = { $regex: location, $options: 'i' };
    if (skills) {
      const skillArr = skills.split(',').map(s => s.trim()).filter(Boolean);
      if (skillArr.length) query.requiredSkills = { $in: skillArr.map(s => new RegExp(s, 'i')) };
    }

    const [jobs, total] = await Promise.all([
      JobPost.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-__v')
        .lean(),
      JobPost.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      jobs,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err: any) {
    console.error('[Jobs GET]', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
