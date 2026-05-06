'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/* ── SVG Brand Logos ── */
const MicrosoftLogo = () => (
  <svg viewBox="0 0 21 21" className="w-10 h-10">
    <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
    <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
    <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
    <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
  </svg>
);

const AdobeLogo = () => (
  <svg viewBox="0 0 240 234" className="w-10 h-10">
    <path d="M42.5 0h155C221 0 240 19 240 42.5v149c0 23.5-19 42.5-42.5 42.5h-155C19 234 0 215 0 191.5v-149C0 19 19 0 42.5 0z" fill="#FF0000"/>
    <path d="M186 178h-32l-14-35H100l-14 35H54l62-140h8l62 140zm-52-60l-16-40-16 40h32z" fill="white"/>
  </svg>
);

const MetaLogo = () => (
  <svg viewBox="0 0 60 60" className="w-10 h-10">
    <defs>
      <linearGradient id="metaGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#0064E0"/>
        <stop offset="100%" stopColor="#00C7FF"/>
      </linearGradient>
    </defs>
    <ellipse cx="15" cy="30" rx="8" ry="14" fill="none" stroke="url(#metaGrad)" strokeWidth="4"/>
    <path d="M23 30 Q30 16 37 30 Q44 44 51 30" fill="none" stroke="url(#metaGrad)" strokeWidth="4" strokeLinecap="round"/>
  </svg>
);

const GoogleLogo = () => (
  <svg viewBox="0 0 48 48" className="w-10 h-10">
    <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"/>
    <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"/>
    <path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"/>
    <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"/>
  </svg>
);

const AppleLogo = () => (
  <svg viewBox="0 0 814 1000" className="w-9 h-9" fill="#1d1d1f">
    <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 376.7 0 248.7 0 126.8c0-70.3 22.9-143.3 72.5-192.8 49.7-49.5 122.3-82.5 198.5-82.5 76.2 0 141.4 33.4 190.3 33.4 46.9 0 120.9-35.4 209.4-35.4 33.5 0 138.3 3.2 209.4 107.5zm-199.6-107.5c-31.1-36.9-75.4-64.8-124.1-64.8-7.1 0-14.3.6-21.3 1.9 1.9 37.5 17.6 75 41.1 100.8 23.4 25.7 67.1 54.6 112.4 54.6 6.4 0 12.8-.6 19.1-1.9-1.9-37.5-18.9-75.6-27.2-90.6z"/>
  </svg>
);

const CiscoLogo = () => (
  <svg viewBox="0 0 100 40" className="w-14 h-8">
    <g fill="#1BA0D7">
      <rect x="0" y="15" width="8" height="10" rx="2"/>
      <rect x="11" y="8" width="8" height="24" rx="2"/>
      <rect x="22" y="3" width="8" height="34" rx="2"/>
      <rect x="33" y="8" width="8" height="24" rx="2"/>
      <rect x="44" y="15" width="8" height="10" rx="2"/>
      <rect x="55" y="8" width="8" height="24" rx="2"/>
      <rect x="66" y="3" width="8" height="34" rx="2"/>
      <rect x="77" y="8" width="8" height="24" rx="2"/>
      <rect x="88" y="15" width="8" height="10" rx="2"/>
    </g>
  </svg>
);

const AWSLogo = () => (
  <svg viewBox="0 0 80 48" className="w-14 h-10">
    <path d="M22.3 19.8c0 .8.1 1.4.2 1.8.2.4.4.9.8 1.4.1.2.2.4.2.5 0 .2-.1.4-.4.6l-1.3.9c-.2.1-.4.2-.5.2-.2 0-.4-.1-.6-.3-.3-.3-.5-.6-.7-1-.2-.4-.4-.8-.6-1.4-1.5 1.8-3.4 2.7-5.7 2.7-1.6 0-2.9-.5-3.8-1.4-.9-.9-1.4-2.2-1.4-3.7 0-1.6.6-2.9 1.7-3.9 1.1-1 2.6-1.5 4.5-1.5.6 0 1.3.1 2 .2.7.1 1.4.3 2.2.5v-1.4c0-1.4-.3-2.4-.9-3-.6-.6-1.6-.9-3-.9-.6 0-1.3.1-2 .3-.7.2-1.4.4-2 .7-.3.1-.5.2-.6.2-.2 0-.3-.1-.3-.4v-.9c0-.2 0-.4.1-.5.1-.1.3-.2.5-.3.6-.3 1.4-.6 2.2-.8.9-.2 1.8-.3 2.8-.3 2.1 0 3.7.5 4.7 1.5 1 1 1.5 2.5 1.5 4.5v5.9zm-7.9 3c.6 0 1.2-.1 1.9-.4.7-.3 1.3-.7 1.8-1.3.3-.4.5-.8.6-1.2.1-.4.2-1 .2-1.7v-.8c-.5-.1-1.1-.2-1.7-.3-.6-.1-1.2-.1-1.7-.1-1.2 0-2.1.2-2.7.7-.6.5-.9 1.2-.9 2.1 0 .8.2 1.5.7 1.9.4.5 1 .7 1.8.7zm14.6 2c-.2 0-.4 0-.5-.1-.1-.1-.2-.3-.3-.6l-3.4-11.2c-.1-.3-.1-.5-.1-.6 0-.2.1-.4.4-.4h1.6c.2 0 .4 0 .5.1.1.1.2.3.3.6l2.4 9.5 2.3-9.5c.1-.3.2-.5.3-.6.1-.1.3-.1.5-.1h1.3c.2 0 .4 0 .5.1.1.1.2.3.3.6l2.3 9.6 2.5-9.6c.1-.3.2-.5.3-.6.1-.1.3-.1.5-.1h1.5c.2 0 .4.1.4.4 0 .1 0 .2-.1.4l-3.5 11.2c-.1.3-.2.5-.3.6-.1.1-.3.1-.5.1h-1.4c-.2 0-.4 0-.5-.1-.1-.1-.2-.3-.3-.6l-2.3-9.3-2.3 9.3c-.1.3-.2.5-.3.6-.1.1-.3.1-.5.1h-1.4zm18.7.4c-.9 0-1.7-.1-2.5-.3-.8-.2-1.4-.4-1.9-.7-.3-.2-.5-.4-.5-.6v-.9c0-.3.1-.4.3-.4.1 0 .2 0 .3.1.1.1.3.1.4.2.6.3 1.2.5 1.9.6.7.1 1.3.2 2 .2 1.1 0 1.9-.2 2.5-.6.6-.4.9-.9.9-1.6 0-.5-.1-.9-.4-1.2-.3-.3-.9-.6-1.7-.9l-2.4-.7c-1.2-.4-2.1-.9-2.7-1.6-.6-.7-.9-1.5-.9-2.4 0-.7.1-1.3.4-1.8.3-.5.7-1 1.2-1.4.5-.4 1.1-.7 1.7-.9.7-.2 1.4-.3 2.1-.3.4 0 .7 0 1.1.1.4.1.7.1 1 .2.3.1.6.2.9.3.3.1.5.2.6.3.2.1.3.2.4.3.1.1.1.3.1.5v.9c0 .3-.1.4-.3.4-.1 0-.3-.1-.6-.2-.9-.4-1.9-.6-3-.6-1 0-1.7.2-2.3.5-.6.3-.8.8-.8 1.5 0 .5.2.9.5 1.2.3.3 1 .6 1.9.9l2.4.7c1.2.4 2 .9 2.6 1.5.6.7.8 1.5.8 2.4 0 .7-.1 1.4-.4 2-.3.6-.7 1.1-1.2 1.5-.5.4-1.1.7-1.8.9-.8.2-1.6.3-2.5.3z" fill="#FF9900"/>
    <path d="M67.3 29.5c-5.5 4.1-13.5 6.2-20.4 6.2-9.6 0-18.3-3.6-24.9-9.5-.5-.5-.1-1.1.6-.7 7.1 4.1 15.8 6.6 24.9 6.6 6.1 0 12.8-1.3 18.9-3.9 1-.3 1.7.7.9 1.3z" fill="#FF9900"/>
    <path d="M69.6 26.9c-.7-.9-4.6-.4-6.3-.2-.5.1-.6-.4-.1-.7 3.1-2.2 8.2-1.5 8.7-.8.6.7-.2 5.8-3 8.2-.4.4-.9.2-.7-.3.7-1.6 2.1-5.3 1.4-6.2z" fill="#FF9900"/>
  </svg>
);

const IBMLogo = () => (
  <svg viewBox="0 0 80 32" className="w-14 h-8">
    <g fill="#1F70C1">
      <rect x="0" y="0" width="80" height="4"/>
      <rect x="0" y="7" width="80" height="4"/>
      <rect x="0" y="14" width="80" height="4"/>
      <rect x="0" y="21" width="80" height="4"/>
      <rect x="0" y="28" width="80" height="4"/>
    </g>
  </svg>
);

const partners = [
  { name: 'Microsoft', Logo: MicrosoftLogo, bg: '#f3f4f6', color: '#737373' },
  { name: 'Adobe',     Logo: AdobeLogo,     bg: '#fff1f0', color: '#FF0000' },
  { name: 'Meta',      Logo: MetaLogo,      bg: '#eff6ff', color: '#0064E0' },
  { name: 'Google',    Logo: GoogleLogo,    bg: '#f0fdf4', color: '#4285F4' },
  { name: 'Apple',     Logo: AppleLogo,     bg: '#f9fafb', color: '#1d1d1f' },
  { name: 'Cisco',     Logo: CiscoLogo,     bg: '#eff6ff', color: '#1BA0D7' },
  { name: 'AWS',       Logo: AWSLogo,       bg: '#fffbeb', color: '#FF9900' },
];

const certifications = [
  {
    name: 'ISO 9001:2015',
    desc: 'Quality Management System',
    icon: (
      <svg viewBox="0 0 60 60" className="w-12 h-12">
        <circle cx="30" cy="30" r="28" fill="none" stroke="#f97316" strokeWidth="3"/>
        <circle cx="30" cy="30" r="20" fill="none" stroke="#f97316" strokeWidth="2" strokeDasharray="4 2"/>
        <text x="30" y="26" textAnchor="middle" fontSize="10" fontWeight="900" fill="#f97316" fontFamily="Arial">ISO</text>
        <text x="30" y="38" textAnchor="middle" fontSize="7" fontWeight="700" fill="#f97316" fontFamily="Arial">9001:2015</text>
      </svg>
    ),
  },
  {
    name: 'NSDC',
    desc: 'National Skill Development Corporation',
    icon: (
      <svg viewBox="0 0 60 60" className="w-12 h-12">
        <rect x="4" y="4" width="52" height="52" rx="8" fill="none" stroke="#f97316" strokeWidth="3"/>
        <path d="M15 42 L15 18 L25 30 L35 18 L35 42" fill="none" stroke="#f97316" strokeWidth="3" strokeLinejoin="round"/>
        <text x="42" y="44" textAnchor="middle" fontSize="8" fontWeight="900" fill="#f97316" fontFamily="Arial">DC</text>
        <circle cx="42" cy="22" r="8" fill="none" stroke="#f97316" strokeWidth="2.5"/>
        <path d="M38 22 L41 25 L46 19" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    name: 'Skill India',
    desc: 'Skill India Digital Hub',
    icon: (
      <svg viewBox="0 0 60 60" className="w-12 h-12">
        <circle cx="30" cy="30" r="26" fill="none" stroke="#f97316" strokeWidth="3"/>
        <path d="M20 38 Q30 15 40 38" fill="none" stroke="#f97316" strokeWidth="3" strokeLinecap="round"/>
        <circle cx="30" cy="20" r="4" fill="#f97316"/>
        <path d="M22 44 L38 44" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M25 48 L35 48" stroke="#f97316" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    name: 'MSME',
    desc: 'Ministry of MSME, Govt. of India',
    icon: (
      <svg viewBox="0 0 60 60" className="w-12 h-12">
        <rect x="8" y="28" width="44" height="24" rx="3" fill="none" stroke="#f97316" strokeWidth="3"/>
        <path d="M16 28 L16 20 Q16 8 30 8 Q44 8 44 20 L44 28" fill="none" stroke="#f97316" strokeWidth="3"/>
        <rect x="24" y="36" width="12" height="16" rx="2" fill="none" stroke="#f97316" strokeWidth="2"/>
        <circle cx="30" cy="22" r="4" fill="none" stroke="#f97316" strokeWidth="2"/>
      </svg>
    ),
  },
];

export default function CertificationsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);

  const row1 = [...partners, ...partners];
  const row2 = [...partners.slice().reverse(), ...partners.slice().reverse()];

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-24" style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f5f0eb 40%, #f5f0eb 100%)' }}>

      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.08), transparent 70%)' }}
        />
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'radial-gradient(circle, #f97316 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">

        {/* ── CERTIFICATIONS ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">Recognised & Certified</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mt-3 mb-4">
            Certified by <span className="text-orange-500">Industry Leaders</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Our programs are officially recognised by top government and industry bodies, ensuring your certificate carries real weight.
          </p>
        </motion.div>

        {/* Certification cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 mb-20 sm:mb-24">
          {certifications.map((cert, i) => (
            <motion.div
              key={cert.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8, boxShadow: '0 24px 48px rgba(249,115,22,0.15)' }}
              className="group bg-white rounded-2xl p-6 text-center cursor-default transition-all duration-300 border border-orange-100 hover:border-orange-300"
            >
              <div className="flex justify-center mb-4">
                <motion.div
                  whileHover={{ rotate: [0, -5, 5, 0], scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                >
                  {cert.icon}
                </motion.div>
              </div>
              <h4 className="font-extrabold text-gray-900 text-base mb-1">{cert.name}</h4>
              <p className="text-gray-400 text-xs leading-relaxed">{cert.desc}</p>
              {/* Animated bottom bar */}
              <div className="mt-4 h-0.5 w-0 group-hover:w-full mx-auto rounded-full transition-all duration-500"
                style={{ background: 'linear-gradient(90deg, #f97316, #fbbf24)' }} />
            </motion.div>
          ))}
        </div>

        {/* ── PARTNERS ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12"
        >
          <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">Certificate Partners</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mt-3 mb-4">
            Our <span className="text-orange-500">Certificate Partners</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Earn certificates co-branded with the world's most recognised technology companies.
          </p>
        </motion.div>
      </div>

      {/* ── Infinite scroll row 1 (left) ── */}
      <div className="relative overflow-hidden mb-4">
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(90deg, #f5f0eb, transparent)' }} />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(270deg, #f5f0eb, transparent)' }} />
        <motion.div
          className="flex gap-4 items-center"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
          style={{ width: 'max-content' }}
        >
          {row1.map(({ name, Logo, bg, color }, i) => (
            <motion.div
              key={`r1-${i}`}
              whileHover={{ y: -6, scale: 1.05, boxShadow: '0 16px 40px rgba(0,0,0,0.12)' }}
              transition={{ duration: 0.25 }}
              className="flex-shrink-0 w-36 h-20 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-default border border-gray-100"
              style={{ background: bg }}
            >
              <Logo />
              <span className="text-xs font-bold" style={{ color }}>{name}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ── Infinite scroll row 2 (right) ── */}
      <div className="relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(90deg, #f5f0eb, transparent)' }} />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(270deg, #f5f0eb, transparent)' }} />
        <motion.div
          className="flex gap-4 items-center"
          animate={{ x: ['-50%', '0%'] }}
          transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
          style={{ width: 'max-content' }}
        >
          {row2.map(({ name, Logo, bg, color }, i) => (
            <motion.div
              key={`r2-${i}`}
              whileHover={{ y: -6, scale: 1.05, boxShadow: '0 16px 40px rgba(0,0,0,0.12)' }}
              transition={{ duration: 0.25 }}
              className="flex-shrink-0 w-36 h-20 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-default border border-gray-100"
              style={{ background: bg }}
            >
              <Logo />
              <span className="text-xs font-bold" style={{ color }}>{name}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Stats strip */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4"
        >
          {[
            { n: '300+', l: 'Hiring Partners' },
            { n: '67+',  l: 'Programs' },
            { n: '10K+', l: 'Certificates Issued' },
            { n: '95%',  l: 'Placement Rate' },
          ].map(({ n, l }, i) => (
            <motion.div
              key={l}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl p-5 text-center border border-orange-100 hover:border-orange-300 transition-all shadow-sm hover:shadow-md"
            >
              <div className="text-3xl font-extrabold text-orange-500 leading-none mb-1">{n}</div>
              <div className="text-gray-500 text-xs font-semibold uppercase tracking-wider">{l}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

