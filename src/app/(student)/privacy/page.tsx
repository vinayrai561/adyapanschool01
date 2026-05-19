import type { Metadata } from 'next';
import { buildMetadata, breadcrumbSchema, BASE_URL } from '@/lib/seo';
import JsonLd from '@/components/JsonLd';
import PrivacyClient from './PageClient';

export const metadata: Metadata = buildMetadata({
  title: 'Privacy Policy | Adyapan',
  description:
    'Read Adyapan\'s Privacy Policy to understand how we collect, use, and protect your personal data in compliance with Indian data protection laws.',
  keywords: ['adyapan privacy policy', 'data protection', 'user privacy edtech'],
  path: '/privacy',
  index: true,
});

export default function PrivacyPage() {
  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'Privacy Policy', url: `${BASE_URL}/privacy` },
  ]);
  return (
    <>
      <JsonLd schema={breadcrumb} />
      <PrivacyClient />
    </>
  );
}
