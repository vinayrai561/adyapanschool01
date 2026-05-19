import type { Metadata } from 'next';
import { buildMetadata, breadcrumbSchema, faqSchema, BASE_URL } from '@/lib/seo';
import JsonLd from '@/components/JsonLd';
import ProgramsPageClient from './ProgramsPageClient';

export const metadata: Metadata = buildMetadata({
  title: 'All Programs — 65+ Industry Courses with Placement Support',
  description:
    'Browse 65+ industry-relevant programs in AI, Data Science, Web Development, Finance, ECE, and more. Live classes, real projects, and guaranteed placement support.',
  keywords: [
    'online courses india', 'data science course', 'machine learning course',
    'web development course', 'ai course india', 'placement guarantee course',
    'internship program india', 'edtech courses', 'adyapan programs',
  ],
  path: '/programs',
});

export default function ProgramsPage() {
  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'Programs', url: `${BASE_URL}/programs` },
  ]);

  const faq = faqSchema([
    {
      question: 'What courses does Adyapan offer?',
      answer:
        'Adyapan offers 65+ industry-relevant courses across AI/ML, Data Science, Web Development, Cloud Computing, Finance, ECE, Bio Sciences, and more.',
    },
    {
      question: 'Do Adyapan courses include placement support?',
      answer:
        'Yes. All Adyapan programs include guaranteed placement support with resume building, mock interviews, and direct recruiter connections.',
    },
    {
      question: 'Are the classes live or recorded?',
      answer:
        'Adyapan offers live online interactive sessions with industry experts, supplemented by recorded sessions for revision.',
    },
    {
      question: 'What is the course fee?',
      answer:
        'Most Adyapan courses are priced at ₹3,000 for the full program, making quality education accessible to all students.',
    },
    {
      question: 'Will I get a certificate after completing the course?',
      answer:
        'Yes. You will receive an industry-recognized certificate from Adyapan upon successful completion of the course and projects.',
    },
  ]);

  return (
    <>
      <JsonLd schema={breadcrumb} />
      <JsonLd schema={faq} />
      <ProgramsPageClient />
    </>
  );
}
