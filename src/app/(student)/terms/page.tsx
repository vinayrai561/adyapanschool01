import type { Metadata } from 'next';
import { buildMetadata, breadcrumbSchema, BASE_URL } from '@/lib/seo';
import JsonLd from '@/components/JsonLd';
import TermsClient from './PageClient';

export const metadata: Metadata = buildMetadata({
  title: 'Terms of Service | Adyapan',
  description:
    'Review Adyapan\'s Terms of Service — the rules and guidelines governing your use of our platform, courses, and services.',
  keywords: ['adyapan terms of service', 'terms and conditions', 'user agreement edtech'],
  path: '/terms',
  index: true,
});

export default function TermsPage() {
  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'Terms of Service', url: `${BASE_URL}/terms` },
  ]);
  return (
    <>
      <JsonLd schema={breadcrumb} />
      <TermsClient />
    </>
  );
}
