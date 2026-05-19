import type { Metadata } from 'next';
import { buildMetadata, breadcrumbSchema, faqSchema, BASE_URL } from '@/lib/seo';
import JsonLd from '@/components/JsonLd';
import OfflineServicesClient from './PageClient';

export const metadata: Metadata = buildMetadata({
  title: 'Offline Services — In-Person Training & Counseling | Adyapan',
  description:
    'Adyapan\'s offline services include in-person training, career counseling, campus visits, and hands-on workshops across India. Book your free counseling session today.',
  keywords: [
    'offline training india', 'in-person courses', 'career counseling india',
    'adyapan offline', 'campus training', 'skill development offline',
  ],
  path: '/offline-services',
});

export default function OfflineServicesPage() {
  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'Offline Services', url: `${BASE_URL}/offline-services` },
  ]);
  const faq = faqSchema([
    {
      question: 'Does Adyapan offer offline training?',
      answer: 'Yes. Adyapan provides in-person training, campus workshops, and career counseling sessions across India.',
    },
    {
      question: 'How do I book a free counseling session?',
      answer: 'Fill out the enrollment form on our Offline Services page and our team will contact you within 24 hours.',
    },
    {
      question: 'Are offline sessions available in my city?',
      answer: 'We conduct sessions across major Indian cities. Contact us to check availability in your location.',
    },
  ]);
  return (
    <>
      <JsonLd schema={breadcrumb} />
      <JsonLd schema={faq} />
      <OfflineServicesClient />
    </>
  );
}
