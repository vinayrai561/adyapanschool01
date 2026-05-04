'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function PrivacyPolicy() {
  const sections = [
    {
      title: '1. Information We Collect',
      content: [
        'Personal Information: Name, email address, phone number, and payment details when you register or make a purchase.',
        'Usage Data: Pages visited, time spent, clicks, and device/browser information.',
        'Payment Data: Processed securely via Razorpay. We do not store card or UPI credentials.',
        'Cookies: Session cookies, analytics cookies, and preference cookies (see Cookie Policy below).',
      ],
    },
    {
      title: '2. How We Use Your Information',
      content: [
        'To provide and improve our educational services and platform.',
        'To process payments and send transaction confirmations.',
        'To send course updates, announcements, and promotional emails (you can opt out anytime).',
        'To analyse usage patterns and improve user experience.',
        'To comply with legal obligations.',
      ],
    },
    {
      title: '3. Data Sharing',
      content: [
        'We do not sell your personal data to third parties.',
        'We share data with trusted service providers: Razorpay (payments), SendGrid (emails), MongoDB Atlas (database).',
        'We may disclose data if required by law or to protect our legal rights.',
      ],
    },
    {
      title: '4. Data Security',
      content: [
        'All data is transmitted over HTTPS/TLS encryption.',
        'Passwords are hashed using bcrypt — never stored in plain text.',
        'Payment processing is PCI-DSS compliant via Razorpay.',
        'We regularly review and update our security practices.',
      ],
    },
    {
      title: '5. Your Rights',
      content: [
        'Access: Request a copy of your personal data.',
        'Correction: Update inaccurate or incomplete data.',
        'Deletion: Request deletion of your account and data.',
        'Opt-out: Unsubscribe from marketing emails at any time.',
        'To exercise these rights, email us at support@adyapan.com',
      ],
    },
    {
      title: '6. Cookie Policy',
      content: [
        'Necessary Cookies: Required for authentication and security. Cannot be disabled.',
        'Analytics Cookies: Help us understand how users interact with the platform.',
        'Functional Cookies: Remember your preferences and settings.',
        'Marketing Cookies: Used for targeted advertising (disabled by default).',
        'You can manage cookie preferences via the cookie banner on our site.',
      ],
    },
    {
      title: '7. Data Retention',
      content: [
        'Account data is retained as long as your account is active.',
        'Payment records are retained for 7 years for legal/tax compliance.',
        'You may request deletion of your account at any time.',
      ],
    },
    {
      title: '8. Children\'s Privacy',
      content: [
        'Our services are not directed to children under 13.',
        'We do not knowingly collect data from children under 13.',
        'If you believe a child has provided us data, contact us immediately.',
      ],
    },
    {
      title: '9. Changes to This Policy',
      content: [
        'We may update this Privacy Policy from time to time.',
        'We will notify you of significant changes via email or a notice on our website.',
        'Continued use of our services after changes constitutes acceptance.',
      ],
    },
    {
      title: '10. Contact Us',
      content: [
        'Adyapan Edutech Pvt. Ltd.',
        'Email: support@adyapan.com',
        'For privacy-related queries, please email privacy@adyapan.com',
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
            <span className="text-3xl">🔒</span>
            <h1 className="text-3xl font-extrabold text-gray-900">Privacy Policy</h1>
          </div>
          <p className="text-gray-500 text-sm">Last updated: May 2026 · Effective: May 1, 2026</p>
          <div className="mt-4 p-4 rounded-xl bg-orange-50 border border-orange-200">
            <p className="text-sm text-gray-700 leading-relaxed">
              At <strong>Adyapan Edutech Pvt. Ltd.</strong>, we are committed to protecting your privacy.
              This policy explains how we collect, use, and safeguard your personal information when you use our platform.
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
          <Link href="/terms" className="hover:text-orange-500 transition-colors">Terms of Service</Link>
          <span>·</span>
          <Link href="/contact" className="hover:text-orange-500 transition-colors">Contact Us</Link>
          <span>·</span>
          <Link href="/" className="hover:text-orange-500 transition-colors">Home</Link>
        </div>
      </div>
    </main>
  );
}
