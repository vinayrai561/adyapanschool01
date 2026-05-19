import type { Metadata } from 'next';
import { buildMetadata, breadcrumbSchema, BASE_URL } from '@/lib/seo';
import JsonLd from '@/components/JsonLd';
import ContactPageClient from './ContactPageClient';

export const metadata: Metadata = buildMetadata({
  title: 'Contact Adyapan — Get in Touch with Our Team',
  description:
    'Have questions about our courses, internships, or placement support? Contact Adyapan Edutech — we\'re here to help you launch your career.',
  keywords: [
    'contact adyapan', 'adyapan support', 'adyapan helpline',
    'edtech customer support', 'course enquiry india',
  ],
  path: '/contact',
});

export default function ContactPage() {
  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'Contact', url: `${BASE_URL}/contact` },
  ]);

  const localBusiness = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Adyapan Edutech Pvt. Ltd.',
    url: BASE_URL,
    telephone: '+91-8292244709',
    email: 'support@adyapan.com',
    image: `${BASE_URL}/adyapan-logo.png`,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '18:00',
    },
    sameAs: [
      'https://www.linkedin.com/company/adyapan',
      'https://www.instagram.com/adyapan',
    ],
  };

  return (
    <>
      <JsonLd schema={breadcrumb} />
      <JsonLd schema={localBusiness} />
      <ContactPageClient />
    </>
  );
}
