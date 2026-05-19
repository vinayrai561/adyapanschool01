import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Analytics from '@/components/Analytics';

const inter = Inter({
  subsets:  ['latin'],
  display:  'swap',          // prevent FOIT
  variable: '--font-inter',
});

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://adyapan.com');

export const viewport: Viewport = {
  width:            'device-width',
  initialScale:     1,
  maximumScale:     5,
  viewportFit:      'cover',
  themeColor:       '#14162a',
  colorScheme:      'light',
};

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),

  title: {
    default:  'Adyapan — Learn, Earn & Get Placed',
    template: '%s | Adyapan',
  },
  description:
    'Adyapan offers 65+ industry-relevant courses, real internship experience, live classes, and placement support to help students launch their careers in India.',
  keywords: [
    'online courses india', 'internship program', 'placement support',
    'data science course', 'machine learning', 'web development',
    'adyapan', 'edtech india', 'live online classes', 'career guidance',
  ],
  authors:  [{ name: 'Adyapan Edutech Pvt. Ltd.', url: APP_URL }],
  creator:  'Adyapan Edutech Pvt. Ltd.',
  publisher:'Adyapan Edutech Pvt. Ltd.',
  robots: {
    index:          true,
    follow:         true,
    googleBot: {
      index:             true,
      follow:            true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet':       -1,
    },
  },

  openGraph: {
    type:        'website',
    locale:      'en_IN',
    url:         APP_URL,
    siteName:    'Adyapan',
    title:       'Adyapan — Learn, Earn & Get Placed',
    description: 'Industry-relevant courses with live classes, real internship experience, and placement support.',
    images: [
      {
        url:    '/og-image.png',
        width:  1200,
        height: 630,
        alt:    'Adyapan — EdTech Platform',
      },
    ],
  },

  twitter: {
    card:        'summary_large_image',
    site:        '@adyapan',
    creator:     '@adyapan',
    title:       'Adyapan — Learn, Earn & Get Placed',
    description: 'Industry-relevant courses with live classes, real internship experience, and placement support.',
    images:      ['/og-image.png'],
  },

  alternates: {
    canonical: APP_URL,
  },

  icons: {
    icon:        '/favicon.ico',
    shortcut:    '/favicon-16x16.png',
    apple:       '/apple-touch-icon.png',
  },

  manifest: '/site.webmanifest',

  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
    other: {
      // Bing Webmaster Tools verification
      'msvalidate.01': process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || '',
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Preconnect to critical third-party origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://checkout.razorpay.com" />
        {/* Schema.org Organization markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type':    'EducationalOrganization',
              name:       'Adyapan Edutech Pvt. Ltd.',
              url:        APP_URL,
              logo:       `${APP_URL}/adyapan-logo.png`,
              description:'India\'s leading EdTech platform offering 65+ industry-relevant courses with placement support.',
              sameAs: [
                'https://www.linkedin.com/company/adyapan',
                'https://www.instagram.com/adyapan',
              ],
              contactPoint: {
                '@type':             'ContactPoint',
                telephone:           '+91-8292244709',
                contactType:         'customer service',
                availableLanguage:   ['English', 'Hindi'],
              },
            }),
          }}
        />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col overflow-x-hidden`} suppressHydrationWarning>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
