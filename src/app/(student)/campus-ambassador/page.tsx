import type { Metadata } from 'next';
import { buildMetadata, breadcrumbSchema, BASE_URL } from '@/lib/seo';
import JsonLd from '@/components/JsonLd';
import CampusAmbassadorClient from './PageClient';

export const metadata: Metadata = buildMetadata({
  title: 'Campus Ambassador Program — Earn While You Learn | Adyapan',
  description:
    'Join Adyapan\'s Campus Ambassador Program. Represent Adyapan at your college, earn commissions, build leadership skills, and get exclusive career benefits.',
  keywords: [
    'campus ambassador program india', 'student ambassador', 'earn while studying',
    'adyapan ambassador', 'college representative program', 'student leadership',
  ],
  path: '/campus-ambassador',
});

export default function CampusAmbassadorPage() {
  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'Campus Ambassador', url: `${BASE_URL}/campus-ambassador` },
  ]);
  return (
    <>
      <JsonLd schema={breadcrumb} />
      <CampusAmbassadorClient />
    </>
  );
}
