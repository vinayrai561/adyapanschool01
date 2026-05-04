import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL || 'https://adyapan.com';

  const staticPages = [
    { url: base, priority: 1.0, changeFrequency: 'weekly' as const },
    { url: `${base}/programs`, priority: 0.9, changeFrequency: 'weekly' as const },
    { url: `${base}/about`, priority: 0.8, changeFrequency: 'monthly' as const },
    { url: `${base}/auth`, priority: 0.7, changeFrequency: 'monthly' as const },
    { url: `${base}/contact`, priority: 0.7, changeFrequency: 'monthly' as const },
    { url: `${base}/privacy`, priority: 0.5, changeFrequency: 'yearly' as const },
    { url: `${base}/terms`, priority: 0.5, changeFrequency: 'yearly' as const },
    { url: `${base}/campus-ambassador`, priority: 0.6, changeFrequency: 'monthly' as const },
    { url: `${base}/company/hire-talent`, priority: 0.7, changeFrequency: 'monthly' as const },
    { url: `${base}/gallery`, priority: 0.5, changeFrequency: 'monthly' as const },
  ];

  return staticPages.map(page => ({
    url: page.url,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
