import type { Metadata } from 'next';
import { buildMetadata, breadcrumbSchema, organizationSchema } from '@/lib/seo';
import JsonLd from '@/components/JsonLd';
import AboutPageClient from './AboutPageClient';

export const metadata: Metadata = buildMetadata({
  title: 'About Adyapan — India\'s Leading EdTech Platform',
  description:
    'Learn about Adyapan Edutech — our mission to bridge the skill gap in India with 65+ industry-relevant courses, live classes, real internships, and guaranteed placement support.',
  keywords: [
    'about adyapan', 'adyapan edutech', 'edtech india', 'online learning platform india',
    'skill development india', 'placement support', 'career guidance india',
  ],
  path: '/about',
  ogType: 'website',
});

export default function AboutPage() {
  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: 'https://adyapan.com' },
    { name: 'About', url: 'https://adyapan.com/about' },
  ]);

  return (
    <>
      <JsonLd schema={breadcrumb} />
      <JsonLd schema={organizationSchema()} />
      <AboutPageClient />
    </>
  );
}
