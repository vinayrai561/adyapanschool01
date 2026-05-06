'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WelcomePopup from '@/components/WelcomePopup';
import AnimatedBackground from '@/components/AnimatedBackground';
import CookieConsent from '@/components/CookieConsent';
import Mascot from '@/components/Mascot';
import WhatsAppButton from '@/components/WhatappButton';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" />
        <meta name="theme-color" content="#14162a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

        {/* SEO */}
        <title>Adyapan — Learn, Earn & Get Placed</title>
        <meta name="description" content="Adyapan offers industry-relevant courses, real internship experience, and placement support to help students launch their careers." />
        <meta name="keywords" content="online courses, internship, placement, skills, adyapan, edutech, india" />
        <meta name="author" content="Adyapan Edutech Pvt. Ltd." />
        <meta name="robots" content="index, follow" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Adyapan — Learn, Earn & Get Placed" />
        <meta property="og:description" content="Industry-relevant courses with real internship experience and placement support." />
        <meta property="og:image" content="/adyapan-logo.png" />
        <meta property="og:url" content={process.env.NEXT_PUBLIC_APP_URL || 'https://adyapan.com'} />
        <meta property="og:site_name" content="Adyapan" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Adyapan — Learn, Earn & Get Placed" />
        <meta name="twitter:description" content="Industry-relevant courses with real internship experience and placement support." />
        <meta name="twitter:image" content="/adyapan-logo.png" />

        {/* Canonical */}
        <link rel="canonical" href={process.env.NEXT_PUBLIC_APP_URL || 'https://adyapan.com'} />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col overflow-x-hidden`}>
        <AnimatedBackground />
        <Navbar />
        <main className="flex-grow w-full">{children}</main>
        <Footer />
        <WelcomePopup />
        <CookieConsent />
        <Mascot />
        <WhatsAppButton />
      </body>
    </html>
  );
}
