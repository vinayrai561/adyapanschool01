'use client';

import { motion } from 'framer-motion';

const certifications = [
  { name: 'ISO', logo: '🏢', desc: 'ISO 9001:2015' },
  { name: 'NSDC', logo: '👥', desc: 'National Skill Development Corporation' },
  { name: 'Skill India', logo: '🇮🇳', desc: 'Skill India Digital Hub' },
];

const partners = [
  { name: 'Microsoft', logo: '🟦' },
  { name: 'Adobe', logo: '🔴' },
  { name: 'Meta', logo: '👤' },
  { name: 'Apple', logo: '🍎' },
  { name: 'Cisco', logo: '📊' },
];

const CertificationsSection = () => {
  // Duplicate partners for infinite scroll
  const scrollPartners = [...partners, ...partners];

  return (
    <section className="bg-[#f5f0eb] py-20 px-6 overflow-hidden relative">
      {/* Orange curved background */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#ff9900] rounded-full -translate-x-1/2 -translate-y-1/2 opacity-20" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Certifications Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-[#1a1a2e] mb-2">
              We are now certified by{' '}
              <span style={{ color: '#ff9900' }}>ISO, Skill India Digital Hub</span> and
            </h3>
            <h3 className="text-2xl font-bold text-[#1a1a2e]">
              <span style={{ color: '#ff9900' }}>National Skill Development Corporation (NSDC)</span>.
            </h3>
          </div>

          {/* Certification Logos */}
          <div className="flex justify-center items-center gap-12 flex-wrap">
            {certifications.map((cert, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ scale: 1.1, transition: { duration: 0.3 } }}
                className="flex flex-col items-center cursor-default"
              >
                <div className="text-6xl mb-3">{cert.logo}</div>
                <p className="text-sm text-[#666] text-center font-semibold">{cert.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Partners Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <h3 className="text-3xl font-extrabold text-[#1a1a2e] text-center mb-12">
            Our Certificate Partners
          </h3>

          {/* Infinite Scrolling Partners */}
          <div className="relative overflow-hidden">
            <motion.div
              className="flex gap-12 items-center justify-center"
              animate={{ x: [0, -1000] }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              {scrollPartners.map((partner, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.1, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0 w-40 h-24 bg-white rounded-2xl border border-[#ede8e0] flex items-center justify-center cursor-default hover:shadow-lg transition-shadow"
                >
                  <div className="text-center">
                    <div className="text-4xl mb-2">{partner.logo}</div>
                    <p className="font-bold text-[#1a1a2e] text-sm">{partner.name}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Gradient fade effect */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#f5f0eb] to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#f5f0eb] to-transparent z-10" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CertificationsSection;
