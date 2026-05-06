'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const certificates = [
  {
    id: 'completion',
    title: 'Certificate of Completion',
    subtitle: 'Programme Completion',
    image: '/images/Sample Course Completion.png',
    description: 'Awarded to students who successfully complete a programme at ADYAPAN SCHOOLS. Certifies academic excellence, skill development, and career-oriented learning.',
    points: [
      'Validates successful programme completion',
      'Recognised by 300+ hiring partners',
      'Includes programme name, duration & domain',
      'Signed by Co-Founder with official seal',
      'Stands as a promise of growth and lifelong learning',
    ],
  },
  {
    id: 'internship',
    title: 'Certificate of Internship Completion',
    subtitle: 'Internship Completion',
    image: '/images/Sample Internship.png',
    description: 'Awarded to interns who successfully complete their internship within the ADYAPAN SCHOOLS framework by SR\'S ADYAPAN EDUTECH PVT. LTD.',
    points: [
      'Certifies real-world internship experience',
      'Includes internship role, domain & duration',
      'Demonstrates practical skill application',
      'Boosts job prospects and employability',
      'Stands as a promise of career readiness',
    ],
  },
  {
    id: 'project',
    title: 'Certificate of Project Completion',
    subtitle: 'Project Completion',
    image: '/images/Sample Project.png',
    description: 'Awarded to students who successfully deliver a project within ADYAPAN SCHOOLS. Certifies practical learning and project execution expertise.',
    points: [
      'Certifies successful project delivery',
      'Includes project name, timeline & domain',
      'Demonstrates hands-on execution skills',
      'Adds real portfolio value for employers',
      'Stands as a promise of practical expertise',
    ],
  },
  {
    id: 'achievement',
    title: 'Certificate of Achievement — Best Performance',
    subtitle: 'Best Performance',
    image: '/images/Sample Best Performance.png',
    description: 'Awarded to top-performing students recognised as Best Performer at ADYAPAN SCHOOLS. Certifies exceptional dedication, leadership, and outstanding results.',
    points: [
      'Recognises exceptional performance & leadership',
      'Highlights outstanding results in relevant domain',
      'Strengthens job and higher study applications',
      'Demonstrates exemplary dedication & commitment',
      'Awarded in recognition of exemplary contribution',
    ],
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

export default function CertificateShowcaseSection() {
  const [active, setActive] = useState(0);

  return (
    <section className="bg-[#f5f0eb] py-16 sm:py-20 px-4 sm:px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="text-center mb-14"
        >
          <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">Adyapan Schools</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1a1a2e] mt-2 mb-3">
            Work-Ready Certification
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm sm:text-base">
            Every milestone you achieve at Adyapan is recognised with an official, industry-respected certificate.
          </p>
        </motion.div>

        {/* Tab selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.5, ease }}
          className="flex flex-wrap justify-center gap-2 mb-8 sm:mb-12 px-2"
        >
          {certificates.map((cert, i) => (
            <button
              key={cert.id}
              onClick={() => setActive(i)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                active === i
                  ? 'text-white shadow-lg shadow-orange-200'
                  : 'bg-white text-gray-500 hover:text-gray-800 border border-gray-200 hover:border-orange-300'
              }`}
              style={active === i ? { background: 'linear-gradient(135deg,#ffa800,#ff6b00)' } : {}}
            >
              {cert.subtitle}
            </button>
          ))}
        </motion.div>

        {/* Main content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.45, ease }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
          >
            {/* Certificate image */}
            <motion.div
              whileHover={{ y: -6, boxShadow: '0 32px 64px rgba(0,0,0,0.18)' }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl overflow-hidden shadow-2xl border border-orange-100"
            >
              <img
                src={certificates[active].image}
                alt={certificates[active].title}
                className="w-full h-auto object-cover"
              />
            </motion.div>

            {/* Text content */}
            <div>
              {/* Badge */}
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold text-orange-600 bg-orange-100 border border-orange-200 mb-4">
                {certificates[active].subtitle}
              </span>

              <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#1a1a2e] mb-4 leading-tight break-words">
                {certificates[active].title}
              </h3>

              <p className="text-gray-500 text-base leading-relaxed mb-6">
                {certificates[active].description}
              </p>

              <ul className="space-y-3 mb-8">
                {certificates[active].points.map((point, j) => (
                  <motion.li
                    key={j}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: j * 0.07, duration: 0.4, ease }}
                    className="flex items-start gap-3"
                  >
                    <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: 'linear-gradient(135deg,#ffa800,#ff6b00)' }}>
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="text-gray-600 text-sm leading-relaxed">{point}</span>
                  </motion.li>
                ))}
              </ul>

              {/* Navigation dots */}
              <div className="flex items-center gap-2">
                {certificates.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    className="transition-all duration-300 rounded-full"
                    style={{
                      width: active === i ? 24 : 8,
                      height: 8,
                      background: active === i
                        ? 'linear-gradient(135deg,#ffa800,#ff6b00)'
                        : '#d1d5db',
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* All certificates thumbnail strip */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6, ease }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16"
        >
          {certificates.map((cert, i) => (
            <motion.button
              key={cert.id}
              onClick={() => setActive(i)}
              whileHover={{ y: -4, boxShadow: '0 16px 40px rgba(0,0,0,0.15)' }}
              whileTap={{ scale: 0.97 }}
              className="relative rounded-xl overflow-hidden shadow-md transition-all duration-300 group"
              style={{
                outline: active === i ? '3px solid #f97316' : '3px solid transparent',
                outlineOffset: 2,
              }}
            >
              <img
                src={cert.image}
                alt={cert.subtitle}
                className="w-full h-auto object-cover"
              />
              <div className={`absolute inset-0 transition-all duration-300 ${
                active === i ? 'bg-orange-500/10' : 'bg-black/0 group-hover:bg-black/5'
              }`} />
              <div className="absolute bottom-0 left-0 right-0 px-2 py-1.5"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }}>
                <p className="text-white text-[10px] font-bold leading-tight">{cert.subtitle}</p>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
