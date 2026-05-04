'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { fadeUp, staggerContainer, scaleIn } from '@/lib/motion';

const categories = ['All categories', 'Tech', 'Design', 'Marketing', 'Data', 'Business'];

const cards = [
  { bg: 'bg-[#f0d8c8]', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80', title: 'AI Skills Audit', duration: '20 minutes', accent: false },
  { bg: 'bg-[#d8e8c8]', img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80', title: 'Career GPS', duration: '3 months', accent: false },
  { bg: 'bg-[#d8e4f0]', img: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&q=80', title: 'Micro-Credentials', duration: '2 months', accent: true },
  { bg: 'bg-[#e8d8f0]', img: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&q=80', title: 'Live Market Data', duration: '4 months', accent: false },
];

const FeaturesSection = () => {
  const [activeTab, setActiveTab] = useState('All categories');

  return (
    <section id="categories" className="bg-[#f5f0eb] py-20 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl md:text-5xl font-extrabold text-[#1a1a2e] text-center mb-10 tracking-tight"
        >
          Everything you need to go from{' '}
          <span style={{ color: '#f90' }}>student to professional</span>
          <span style={{ color: '#f90' }}>.</span>
        </motion.h2>

        {/* Category tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-6 mb-12 border-b border-[#e0d8d0] pb-4"
        >
          {categories.map((c) => (
            <motion.button
              key={c}
              onClick={() => setActiveTab(c)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`text-sm font-medium pb-1 transition-colors ${
                activeTab === c ? 'text-[#1a1a2e] border-b-2 border-[#1a1a2e]' : 'text-gray-400 hover:text-[#1a1a2e]'
              }`}
            >
              {c}
            </motion.button>
          ))}
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={staggerContainer(0.12, 0.2)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {cards.map((card, i) => (
            <motion.div
              key={i}
              variants={scaleIn}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="group cursor-pointer"
            >
              <div className={`relative ${card.bg} rounded-3xl overflow-hidden aspect-[3/4] mb-4`}>
                <motion.img
                  src={card.img}
                  alt={card.title}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.07 }}
                  transition={{ duration: 0.5 }}
                />
                {card.accent && (
                  <motion.button
                    whileHover={{ scale: 1.15, rotate: 45 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-4 right-4 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md"
                  >
                    <svg className="w-4 h-4 text-[#1a1a2e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
                    </svg>
                  </motion.button>
                )}
              </div>
              <h3 className={`font-bold text-lg mb-1 transition-colors ${card.accent ? 'text-[#f90]' : 'text-[#1a1a2e] group-hover:text-[#f90]'}`}>
                {card.title}
              </h3>
              <p className="text-gray-400 text-sm">{card.duration}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
