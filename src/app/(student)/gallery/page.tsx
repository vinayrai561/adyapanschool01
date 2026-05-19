import type { Metadata } from 'next';
import { buildMetadata, breadcrumbSchema, BASE_URL } from '@/lib/seo';
import JsonLd from '@/components/JsonLd';
import GalleryPageClient from './PageClient';

export const metadata: Metadata = buildMetadata({
  title: 'Gallery — Adyapan Campus Life & Events',
  description:
    'Explore Adyapan\'s gallery — live classroom sessions, team moments, student events, and the vibrant culture that makes learning at Adyapan unique.',
  keywords: ['adyapan gallery', 'adyapan campus', 'edtech india events', 'adyapan students', 'adyapan classroom'],
  path: '/gallery',
});

export default function GalleryPage() {
  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'Gallery', url: `${BASE_URL}/gallery` },
  ]);
  return (
    <>
      <JsonLd schema={breadcrumb} />
      <GalleryPageClient />
    </>
  );
}
