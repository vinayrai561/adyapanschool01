import type { Metadata } from 'next';
import { buildMetadata, breadcrumbSchema, BASE_URL } from '@/lib/seo';
import JsonLd from '@/components/JsonLd';
import JobsClient from './PageClient';

export const metadata: Metadata = buildMetadata({
  title: 'Jobs & Internships — Find Opportunities | Adyapan',
  description:
    'Browse 100+ job and internship listings on Adyapan. Find full-time, part-time, remote, and internship opportunities across tech, finance, marketing, and more.',
  keywords: [
    'jobs india', 'internships india', 'fresher jobs', 'tech jobs india',
    'adyapan jobs', 'remote jobs india', 'placement opportunities',
  ],
  path: '/jobs',
});

export default function JobsPage() {
  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'Jobs & Internships', url: `${BASE_URL}/jobs` },
  ]);

  const jobListingSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Jobs & Internships at Adyapan',
    description: 'Browse job and internship opportunities posted on Adyapan',
    url: `${BASE_URL}/jobs`,
  };

  return (
    <>
      <JsonLd schema={breadcrumb} />
      <JsonLd schema={jobListingSchema} />
      <JobsClient />
    </>
  );
}
