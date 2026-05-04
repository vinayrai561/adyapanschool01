'use client';

import { motion } from 'framer-motion';

const addOns = [
  {
    number: '01',
    title: 'Access to top company networks and collaborations.',
  },
  {
    number: '02',
    title: 'Real industry insights you won\'t find in textbooks.',
  },
  {
    number: '03',
    title: 'Become placement-ready with our training, backed by lifetime job support.',
  },
  {
    number: '04',
    title: 'Mock interviews & resume-building workshops.',
  },
  {
    number: '05',
    title: '6-month content access - lifetime career impact.',
  },
];

const AddOnsSection = () => {
  return (
    <section className="bg-[#f5f0eb] py-20 px-6 overflow-hidden relative">
      {/* Decorative curves */}
      <div className="absolute top-0 left-0 w-96 h-96 border-4 border-[#8b4513]/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 border-4 border-[#8b4513]/10 rounded-full translate-x-1/2 translate-y-1/2" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header with Logo */}
        <div className="flex items-center gap-4 mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-16 h-16 rounded-full bg-[#ff9900] flex items-center justify-center flex-shrink-0"
          >
            <span className="text-2xl font-bold text-[#5a1a00]">ady.</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-6xl font-extrabold text-[#1a1a2e]"
          >
            Add-Ons Along the<br />Way
          </motion.h2>
        </div>

        {/* Cards Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
        >
          {addOns.map((addon, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8, boxShadow: '0 16px 40px rgba(255, 153, 0, 0.15)', transition: { duration: 0.3 } }}
              className="bg-[#ff9900] rounded-3xl p-6 flex flex-col justify-between min-h-[240px] cursor-default"
            >
              <div>
                <div className="text-5xl font-extrabold text-white/30 mb-4">
                  {addon.number}
                </div>
                <p className="text-white font-semibold text-base leading-relaxed">
                  {addon.title}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AddOnsSection;
