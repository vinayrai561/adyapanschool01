'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WelcomePopup from '@/components/WelcomePopup';
import AnimatedBackground from '@/components/AnimatedBackground';
import CookieConsent from '@/components/CookieConsent';
import Mascot from '@/components/Mascot';
import WhatsAppButton from '@/components/WhatappButton';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AnimatedBackground />
      <Navbar />
      <main className="flex-grow w-full">{children}</main>
      <Footer />
      <WelcomePopup />
      <CookieConsent />
      <Mascot />
      <WhatsAppButton />
    </>
  );
}
