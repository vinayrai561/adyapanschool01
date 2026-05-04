/**
 * GET /api/courses?slug=plan-4-premium
 * Returns course details (modules + lessons).
 */
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Course from '@/models/Course';
import { COURSE_CATALOGUE, withTotalLessons } from '@/lib/courseData';

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug');

  try {
    await connectToDatabase();

    if (slug) {
      let course = await Course.findOne({ slug }).lean();
      if (!course) {
        // Auto-seed if not found
        const raw = COURSE_CATALOGUE.find(c => c.slug === slug);
        if (!raw) return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        const data = withTotalLessons(raw);
        course = await Course.findOneAndUpdate({ slug }, { $set: data }, { upsert: true, new: true }).lean();
      }
      return NextResponse.json({ success: true, course });
    }

    let courses = await Course.find({}, { modules: 0 }).lean();
    if (courses.length === 0) {
      // Auto-seed all
      for (const raw of COURSE_CATALOGUE) {
        const data = withTotalLessons(raw);
        await Course.findOneAndUpdate({ slug: data.slug }, { $set: data }, { upsert: true, new: true });
      }
      courses = await Course.find({}, { modules: 0 }).lean();
    }

    return NextResponse.json({ success: true, courses });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
