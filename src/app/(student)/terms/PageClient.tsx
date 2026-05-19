'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function TermsOfService() {
  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: [
        'By accessing or using Adyapan\'s platform, you agree to be bound by these Terms of Service.',
        'If you do not agree to these terms, please do not use our services.',
        'We reserve the right to update these terms at any time with notice to users.',
      ],
    },
    {
      title: '2. Use of Services',
      content: [
        'You must be at least 13 years old to use our services.',
        'You are responsible for maintaining the confidentiality of your account credentials.',
        'You agree not to share your account with others or use another person\'s account.',
        'You agree not to use our platform for any unlawful or prohibited purpose.',
        'We reserve the right to suspend or terminate accounts that violate these terms.',
      ],
    },
    {
      title: '3. Course Enrollment & Access',
      content: [
        'Upon successful payment, you will be enrolled in the selected course/program.',
        'Course access is granted to the registered user only and is non-transferable.',
        'We reserve the right to update course content to keep it current and relevant.',
        'Course access duration is as specified at the time of purchase.',
      ],
    },
    {
      title: '4. Payment Terms',
      content: [
        'All prices are in Indian Rupees (INR) and inclusive of applicable taxes.',
        'Payments are processed securely via Razorpay.',
        'By making a payment, you confirm that you are authorised to use the payment method.',
        'We do not store your payment credentials.',
        'All sales are final unless covered by our Refund Policy.',
      ],
    },
    {
      title: '5. Refund Policy',
      content: [
        'Refund requests must be submitted within 7 days of purchase.',
        'Refunds are considered on a case-by-case basis.',
        'No refunds will be issued after course content has been substantially accessed.',
        'To request a refund, email support@adyapan.com with your order details.',
        'Approved refunds will be processed within 7–10 business days.',
      ],
    },
    {
      title: '6. Intellectual Property',
      content: [
        'All course content, materials, and platform features are owned by Adyapan Edutech Pvt. Ltd.',
        'You may not reproduce, distribute, or create derivative works without written permission.',
        'You are granted a limited, non-exclusive licence to access content for personal learning only.',
        'Certificates issued are the property of Adyapan and may be verified by employers.',
      ],
    },
    {
      title: '7. User Conduct',
      content: [
        'You agree not to upload harmful, offensive, or illegal content.',
        'You agree not to attempt to hack, disrupt, or reverse-engineer our platform.',
        'You agree not to scrape, crawl, or extract data from our platform without permission.',
        'Violations may result in immediate account termination without refund.',
      ],
    },
    {
      title: '8. Certificates & Credentials',
      content: [
        'Certificates are issued upon successful completion of course requirements.',
        'Certificates are digital and can be shared on LinkedIn and other platforms.',
        'Adyapan reserves the right to revoke certificates if fraud is detected.',
        'Certificates do not guarantee employment or specific outcomes.',
      ],
    },
    {
      title: '9. Limitation of Liability',
      content: [
        'Adyapan is not liable for any indirect, incidental, or consequential damages.',
        'Our total liability shall not exceed the amount paid for the specific service.',
        'We do not guarantee specific learning outcomes or employment results.',
        'Platform availability is provided on a best-effort basis.',
      ],
    },
    {
      title: '10. Governing Law',
      content: [
        'These terms are governed by the laws of India.',
        'Any disputes shall be subject to the exclusive jurisdiction of courts in India.',
        'We encourage resolving disputes amicably before pursuing legal action.',
      ],
    },
    {
      title: '11. Contact',
      content: [
        'Adyapan Edutech Pvt. Ltd.',
        'Email: support@adyapan.com',
        'For legal queries: legal@adyapan.com',
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-white py-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <Link href="/" className="text-sm text-orange-500 hover:underline mb-4 inline-block">← Back to Home</Link>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 border-2 border-orange-200 flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900">Terms of Service</h1>
          </div>
          <p className="text-gray-500 text-sm">Last updated: May 2026 · Effective: May 1, 2026</p>
          <div className="mt-4 p-4 rounded-xl bg-orange-50 border border-orange-200">
            <p className="text-sm text-gray-700 leading-relaxed">
              Please read these Terms of Service carefully before using <strong>Adyapan's</strong> platform.
              These terms constitute a legally binding agreement between you and Adyapan Edutech Pvt. Ltd.
            </p>
          </div>
        </motion.div>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
            >
              <h2 className="text-base font-bold text-gray-900 mb-3">{section.title}</h2>
              <ul className="space-y-2">
                {section.content.map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-orange-400 mt-0.5 flex-shrink-0">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Footer links */}
        <div className="mt-10 text-center text-sm text-gray-400 space-x-4">
          <Link href="/privacy" className="hover:text-orange-500 transition-colors">Privacy Policy</Link>
          <span>·</span>
          <Link href="/contact" className="hover:text-orange-500 transition-colors">Contact Us</Link>
          <span>·</span>
          <Link href="/" className="hover:text-orange-500 transition-colors">Home</Link>
        </div>
      </div>
    </main>
  );
}
