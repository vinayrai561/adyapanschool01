import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://adyapan.com';
  return {
    rules: [
      // Allow all public pages
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/superadmin/',
          '/api/',
          '/dashboard/',
          '/checkout/',
          '/auth/',
          '/organization/',
          '/certifications/',
          '/passport/',
          '/assessment/',
          '/marketplace/',
        ],
      },
      // Block AI training bots
      {
        userAgent: 'GPTBot',
        disallow: ['/'],
      },
      {
        userAgent: 'CCBot',
        disallow: ['/'],
      },
      {
        userAgent: 'anthropic-ai',
        disallow: ['/'],
      },
    ],
    sitemap:  `${baseUrl}/sitemap.xml`,
    host:     baseUrl,
  };
}
