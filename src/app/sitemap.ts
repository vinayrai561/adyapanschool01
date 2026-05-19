import { MetadataRoute } from 'next';
import { ALL_PROGRAMS } from '@/lib/courseData';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://adyapan.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // ── Static public pages ───────────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL,                          lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE_URL}/programs`,            lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE_URL}/about`,               lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/offline-services`,    lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/campus-ambassador`,   lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/jobs`,                lastModified: now, changeFrequency: 'daily',   priority: 0.8 },
    { url: `${BASE_URL}/gallery`,             lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/contact`,             lastModified: now, changeFrequency: 'yearly',  priority: 0.6 },
    { url: `${BASE_URL}/privacy`,             lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${BASE_URL}/terms`,               lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
  ];

  // ── Dynamic course pages ──────────────────────────────────────────────────
  const coursePages: MetadataRoute.Sitemap = ALL_PROGRAMS.map((course) => ({
    url:             `${BASE_URL}/courses/${course.slug}`,
    lastModified:    now,
    changeFrequency: 'monthly' as const,
    priority:        0.8,
  }));

  return [...staticPages, ...coursePages];
}
