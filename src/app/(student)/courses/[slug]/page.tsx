import type { Metadata } from 'next';
import { ALL_PROGRAMS } from '@/lib/courseData';
import { buildMetadata, courseSchema, breadcrumbSchema, BASE_URL } from '@/lib/seo';
import JsonLd from '@/components/JsonLd';
import CoursePageClient from './CoursePageClient';

interface Props {
  params: Promise<{ slug: string }>;
}

// ── Static params for build-time generation ───────────────────────────────────
export function generateStaticParams() {
  return ALL_PROGRAMS.map((course) => ({ slug: course.slug }));
}

// ── Dynamic metadata per course ───────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = ALL_PROGRAMS.find((c) => c.slug === slug);

  if (!course) {
    // Fallback for dynamically generated courses not in ALL_PROGRAMS
    const title = slug
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
    return buildMetadata({
      title: `${title} Course — Live Classes & Placement Support`,
      description: `Master ${title} with Adyapan's live online course. Industry experts, real projects, and guaranteed placement support. Enroll for ₹3,000.`,
      path: `/courses/${slug}`,
      ogType: 'article',
    });
  }

  return buildMetadata({
    title: `${course.title} Course — Live Classes & Placement Support | Adyapan`,
    description: `${course.description || `Master ${course.title} with Adyapan.`} Live online classes, real projects, industry certification, and placement support. Enroll for ${course.price || '₹3,000'}.`,
    keywords: [
      course.title.toLowerCase(),
      `${course.title.toLowerCase()} course`,
      `${course.title.toLowerCase()} online`,
      `${course.title.toLowerCase()} india`,
      (course.category || 'adyapan programs').toLowerCase(),
      'adyapan course', 'placement support', 'live classes',
    ],
    path: `/courses/${slug}`,
    ogImage: course.thumbnail ? `${BASE_URL}${course.thumbnail}` : undefined,
    ogType: 'article',
  });
}

// ── Page component ────────────────────────────────────────────────────────────
export default async function CoursePage({ params }: Props) {
  const { slug } = await params;
  const course = ALL_PROGRAMS.find((c) => c.slug === slug);

  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'Programs', url: `${BASE_URL}/programs` },
    ...(course ? [{ name: course.category, url: `${BASE_URL}/programs` }] : []),
    {
      name: course ? `${course.title} Course` : slug,
      url: `${BASE_URL}/courses/${slug}`,
    },
  ]);

  const schema = course
    ? courseSchema({
        name: `${course.title} Course`,
        description: course.description || `Master ${course.title} with Adyapan.`,
        url: `${BASE_URL}/courses/${slug}`,
        image: course.thumbnail ? `${BASE_URL}${course.thumbnail}` : BASE_URL,
        duration: 'P2M',
        price: '3000',
        category: course.category || 'Adyapan Programs',
      })
    : null;

  return (
    <>
      <JsonLd schema={breadcrumb} />
      {schema && <JsonLd schema={schema} />}
      <CoursePageClient />
    </>
  );
}
