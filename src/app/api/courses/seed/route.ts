/**
 * POST /api/courses/seed
 * Seeds the MongoDB courses collection from courseData.ts.
 * Call once after setup: fetch('/api/courses/seed', { method: 'POST' })
 */
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Course from '@/models/Course';
import { COURSE_CATALOGUE, withTotalLessons } from '@/lib/courseData';

export async function POST() {
  try {
    await connectToDatabase();

    const results = [];
    for (const raw of COURSE_CATALOGUE) {
      const data = withTotalLessons(raw);
      const course = await Course.findOneAndUpdate(
        { slug: data.slug },
        { $set: data },
        { upsert: true, new: true }
      );
      results.push({ slug: course.slug, title: course.title, totalLessons: course.totalLessons });
    }

    return NextResponse.json({ success: true, seeded: results });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
