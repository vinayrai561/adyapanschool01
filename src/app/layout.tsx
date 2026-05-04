'use client';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WelcomePopup from '@/components/WelcomePopup';
import JugglerMascot from '@/components/JugglerMascot';
import AnimatedBackground from '@/components/AnimatedBackground';
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isHiringPage = pathname === '/hiring' || pathname?.startsWith('/hiring/');
  const isCompanyPage = pathname === '/company' || pathname?.startsWith('/company/');
  const isAboutPage = pathname === '/about' || pathname?.startsWith('/about/');
  const isCampusAmbassadorPage = pathname === '/campus-ambassador' || pathname?.startsWith('/campus-ambassador/');

  const isGalleryPage = pathname === '/gallery' || pathname?.startsWith('/gallery/');

  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        {/* ── Zero-G animated background — behind everything ── */}
        <AnimatedBackground />

        {!isHiringPage && !isCompanyPage && !isAboutPage && !isCampusAmbassadorPage && !isGalleryPage && <Navbar />}
        <main className="flex-grow">{children}</main>
        {!isHiringPage && !isCompanyPage && !isAboutPage && !isCampusAmbassadorPage && !isGalleryPage && <Footer />}
        {!isHiringPage && !isCompanyPage && !isAboutPage && !isCampusAmbassadorPage && !isGalleryPage && <WelcomePopup />}
        {/* ── Juggler Mascot: fixed overlay across all pages ── */}
        <JugglerMascot />
      </body>
    </html>
  );
}
