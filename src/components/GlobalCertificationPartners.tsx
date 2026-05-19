'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  AdobeLogo, AppleLogo, AutodeskLogo, CiscoLogo,
  IntuitLogo, MicrosoftLogo, PMILogo, UnityLogo,
  MetaLogo, CCSGenAILogo, IC3Logo, ESBLogo,
} from '@/components/CertPartnerLogos';

const partners = [
  { name: 'Adobe',           Logo: AdobeLogo,     neon: '#FF0000' },
  { name: 'Apple',           Logo: AppleLogo,     neon: '#a0a0a0' },
  { name: 'Autodesk',        Logo: AutodeskLogo,  neon: '#0696D7' },
  { name: 'Cisco',           Logo: CiscoLogo,     neon: '#049FD9' },
  { name: 'Microsoft',       Logo: MicrosoftLogo, neon: '#00A4EF' },
  { name: 'Meta',            Logo: MetaLogo,      neon: '#0668E1' },
  { name: 'Intuit',          Logo: IntuitLogo,    neon: '#2CA01C' },
  { name: 'Unity',           Logo: UnityLogo,     neon: '#ffffff' },
  { name: 'PMI',             Logo: PMILogo,       neon: '#FF6B00' },
  { name: 'IC3',             Logo: IC3Logo,       neon: '#003087' },
  { name: 'ESB',             Logo: ESBLogo,       neon: '#2563eb' },
  { name: 'CCS Generative AI', Logo: CCSGenAILogo, neon: '#f97316' },
];

function PartnerCard({ partner, i }: { partner: typeof partners[0]; i: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative cursor-pointer"
    >
      {/* Neon glow */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              boxShadow: `0 0 20px 5px ${partner.neon}44, 0 0 40px 10px ${partner.neon}18`,
              border: `1.5px solid ${partner.neon}77`,
              borderRadius: 16,
            }}
          />
        )}
      </AnimatePresence>

      <motion.div
        animate={{ y: hovered ? -8 : 0, scale: hovered ? 1.07 : 1 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col items-center text-center overflow-hidden"
        style={{ minHeight: 120 }}
      >
        {/* Shimmer */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ x: hovered ? ['−100%', '200%'] : '-100%' }}
          transition={{ duration: 0.55, ease: 'easeInOut' }}
          style={{ background: `linear-gradient(105deg, transparent 40%, ${partner.neon}15 50%, transparent 60%)` }}
        />

        <motion.div
          animate={{ scale: hovered ? 1.12 : 1, rotate: hovered ? [0, -3, 3, 0] : 0 }}
          transition={{ duration: 0.35 }}
          className="mb-2"
        >
          <partner.Logo size={44} />
        </motion.div>

        <p className="font-semibold text-gray-800 text-xs leading-tight">{partner.name}</p>

        {/* Bottom bar */}
        <motion.div
          className="absolute bottom-0 left-0 h-[3px] rounded-b-2xl"
          animate={{ width: hovered ? '100%' : '0%' }}
          transition={{ duration: 0.3 }}
          style={{ background: `linear-gradient(90deg, ${partner.neon}, ${partner.neon}66)` }}
        />
      </motion.div>
    </motion.div>
  );
}

export default function GlobalCertificationPartners() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">Globally Recognized</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mt-3 mb-4">
            Global <span style={{ color: '#f97316' }}>Certification Partners</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Earn certificates from the world's most recognized technology companies. Validate your skills and stand out to employers.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-12">
          {partners.map((partner, i) => (
            <PartnerCard key={partner.name} partner={partner} i={i} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <Link href="/certifications">
            <motion.button
              whileHover={{ scale: 1.06, boxShadow: '0 0 32px rgba(249,115,22,0.5)' }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white shadow-lg"
              style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)', boxShadow: '0 0 16px rgba(249,115,22,0.3)' }}
            >
              View All Certifications <span>→</span>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
