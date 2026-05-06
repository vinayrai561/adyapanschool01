'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

/* ─── Data ─────────────────────────────────────────────────────────────── */

const platformLinks = [
  { href: '/programs',            label: 'Programs' },
  { href: '/about',               label: 'About Us' },
  { href: '/gallery',             label: 'Gallery' },
  { href: '/campus-ambassador',   label: 'Campus Ambassador' },
  { href: '/company/hire-talent', label: 'Hire Talent' },
  { href: '/marketplace',         label: 'Marketplace' },
];

const legalLinks = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms',   label: 'Terms of Service' },
  { href: '/contact', label: 'Support' },
  { href: '/contact', label: 'Contact Us' },
];

const socialLinks = [
  {
    href: 'https://www.instagram.com/adyapanschool?igsh=MWw1NGwwNTIwZXU2eQ==',
    label: 'Instagram',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    href: 'https://www.linkedin.com/company/adyapan-edutech-pvt-ltd/posts/?feedView=all',
    label: 'LinkedIn',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    href: 'https://youtube.com',
    label: 'YouTube',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];

/* ─── Sub-components ────────────────────────────────────────────────────── */

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-orange-400 font-semibold text-xs uppercase tracking-widest mb-5 flex items-center gap-2">
      <span className="w-4 h-px bg-orange-500 inline-block flex-shrink-0" aria-hidden="true" />
      {children}
    </p>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link
        href={href}
        className="text-gray-400 text-sm hover:text-orange-400 transition-colors duration-200 flex items-center gap-1.5 group min-h-[44px] sm:min-h-0 py-1"
      >
        <span
          className="w-0 group-hover:w-3 h-px bg-orange-400 transition-all duration-300 inline-block flex-shrink-0"
          aria-hidden="true"
        />
        {label}
      </Link>
    </li>
  );
}

/* ─── Footer ────────────────────────────────────────────────────────────── */

const Footer = () => {
  return (
    <footer
      className="relative w-full overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #976b13ff 0%, #06064cff 50%, #180e02ff 100%)' }}
    >
      {/* Decorative top border */}
      <div
        className="h-px w-full"
        style={{ background: 'linear-gradient(90deg, transparent, #f5802c, #f97316, #ce7508, transparent)' }}
        aria-hidden="true"
      />

      {/* Ambient glow blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.04, 0.08, 0.04] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-32 -left-32 w-80 h-80 rounded-full"
          style={{ background: 'radial-gradient(circle, #f97316, transparent)' }}
        />
        <motion.div
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.03, 0.07, 0.03] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full"
          style={{ background: 'radial-gradient(circle, #fbbf24, transparent)' }}
        />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* ── Main content ── */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12 lg:pt-14 pb-8">

        {/* 4-column responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-10 sm:mb-12">

          {/* ── Col 1: Brand ── */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block mb-4 group" aria-label="Adyapan home">
              <motion.img
                src="/adyapan-logo.png"
                alt="Adyapan"
                className="h-10 w-auto"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              />
            </Link>

            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
              Transforming India's talent landscape through industry-relevant education, real-world experience, and career-focused programs.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3 flex-wrap">
              {socialLinks.map(({ href, label, icon }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow us on ${label}`}
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.92 }}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-colors duration-200"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  {icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* ── Col 2: Platform ── */}
          <div>
            <SectionHeading>Platform</SectionHeading>
            <ul className="space-y-1">
              {platformLinks.map((link) => (
                <NavLink key={link.label} {...link} />
              ))}
            </ul>
          </div>

          {/* ── Col 3: Legal ── */}
          <div>
            <SectionHeading>Legal</SectionHeading>
            <ul className="space-y-1">
              {legalLinks.map((link) => (
                <NavLink key={link.label} {...link} />
              ))}
            </ul>
          </div>

          {/* ── Col 4: Contact ── */}
          <div>
            <SectionHeading>Contact</SectionHeading>
            <ul className="space-y-4">

              {/* Phone */}
              <li>
                <a
                  href="tel:8179124566"
                  aria-label="Call us at 8179124566"
                  className="flex items-center gap-3 group min-h-[44px]"
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                    style={{
                      background: 'linear-gradient(135deg, rgba(249,115,22,0.25), rgba(249,115,22,0.12))',
                      border: '1px solid rgba(249,115,22,0.3)',
                    }}
                    aria-hidden="true"
                  >
                    <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <span className="text-gray-300 text-sm group-hover:text-orange-400 transition-colors duration-200 font-medium">
                    +91 81791 24566
                  </span>
                </a>
              </li>

              {/* Email */}
              <li>
                <a
                  href="mailto:support@adyapan.com"
                  aria-label="Email us at support@adyapan.com"
                  className="flex items-center gap-3 group min-h-[44px]"
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                    style={{
                      background: 'linear-gradient(135deg, rgba(249,115,22,0.25), rgba(249,115,22,0.12))',
                      border: '1px solid rgba(249,115,22,0.3)',
                    }}
                    aria-hidden="true"
                  >
                    <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-gray-300 text-sm group-hover:text-orange-400 transition-colors duration-200 font-medium break-all">
                    support@adyapan.com
                  </span>
                </a>
              </li>

              {/* Address */}
              <li>
                <div className="flex items-start gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{
                      background: 'linear-gradient(135deg, rgba(249,115,22,0.25), rgba(249,115,22,0.12))',
                      border: '1px solid rgba(249,115,22,0.3)',
                    }}
                    aria-hidden="true"
                  >
                    <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <address className="text-gray-400 text-sm leading-relaxed not-italic">
                    Sattva Magnus, behind Reliance Bazaar Shaikpet,
                    Sabza Colony, Ambedkar Nagar,
                    Hyderabad, Telangana 500008
                  </address>
                </div>
              </li>

            </ul>
          </div>
        </div>

        {/* Divider */}
        <div
          className="h-px w-full mb-6"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(249,115,22,0.35), rgba(255,255,255,0.08), rgba(249,115,22,0.35), transparent)' }}
          aria-hidden="true"
        />

        {/* ── Bottom bar ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <p className="text-gray-500 text-xs text-center sm:text-left">
            © {new Date().getFullYear()}{' '}
            <span className="text-gray-400 font-medium">Adyapan Edutech Pvt. Ltd.</span>
            {' '}All rights reserved.
          </p>

          <nav aria-label="Legal links" className="flex items-center gap-1 text-xs text-gray-500">
            {[
              { href: '/privacy', label: 'Privacy' },
              { href: '/terms',   label: 'Terms' },
              { href: '/contact', label: 'Support' },
            ].map(({ href, label }, i, arr) => (
              <span key={label} className="flex items-center gap-1">
                <Link
                  href={href}
                  className="hover:text-orange-400 transition-colors duration-200 px-1 py-1 min-h-[44px] sm:min-h-0 flex items-center"
                >
                  {label}
                </Link>
                {i < arr.length - 1 && (
                  <span className="text-gray-700 select-none" aria-hidden="true">·</span>
                )}
              </span>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
