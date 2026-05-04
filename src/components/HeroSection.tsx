'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import MorphText from './MorphText';

const cards = [
  {
    img: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    label: 'Skills Assessment',
    stat: '',
    statLabel: 'industrial skill development',
    tag: 'Skills',
  },
  {
    img: 'https://images.unsplash.com/photo-1459180129673-eefb56f79b45?q=80&w=1173&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    label: 'Industry relevant project',
    stat: '',
    statLabel: 'minor & major projects',
    tag: 'Career',
  },
  {
    img: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    label: 'Placement',
    stat: '100%',
    statLabel: 'PLACED',
    tag: 'Placement',
  },
];

const customEase = [0.22, 1, 0.36, 1] as const;

const textVariants = {
  hidden: { opacity: 0, y: 30 },
  show: (d: number) => ({
    opacity: 1, y: 0,
    transition: { delay: d, duration: 0.7, ease: customEase },
  }),
};

export default function HeroSection() {
  const [active, setActive] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();

  // All programs from navbar
  const allCourses = [
    // CSE / IT DOMAINS
    'Artificial Intelligence', 'AI Engineering', 'Generative AI', 'Machine Learning',
    'Data Science', 'Data Engineering', 'Data Analytics', 'Database Management (DBMS)',
    'Data Structures & Algorithms', 'Web Development', 'Web 3.0', 'App Development',
    'Python Full Stack', 'Python programming curriculum', 'Java Programming', 'Java Full Stack',
    'Selenium Testing with Java', 'DevOps Engineering', 'Cloud Computing', 'AWS',
    'Cyber Security', 'Blockchain & Bitcoin', 'AR/VR Development', 'UI/UX Design',
    'Graphic Design', 'VFX',
    // MANAGEMENT & COMMERCE
    'Finance', 'Investment Banking', 'Business Analytics', 'Marketing Management',
    'Digital Marketing & Growth Strategy', 'Social Media Marketing', 'HRM', 'Management Consultancy',
    'Supply Chain Management', 'SAP FICA', 'Salesforce', 'Stock Marketing',
    'ACCA F4 (Business & Corporate Law)', 'Chartered Accountancy / CFA', 'Spoken English & Communication',
    // ECE DOMAINS
    'Embedded Systems', 'Hybrid & Electric Vehicle', 'VLSI', 'IoT & Robotics', 'Power Systems',
    // ECONOMICS
    'Business & Financial Economics', 'Investment Analysis', 'Data Analysis for Economics', 'Financial Economics',
    // MECHANICAL ENGINEERING
    'AutoCAD', 'CATIA', 'Car Design', 'Quality & Safety Professionals',
    // BIO & LIFE SCIENCES
    'Bioinformatics', 'Microbiology', 'Molecular Biology', 'Genetic Engineering',
    'Pharmacovigilance', 'Nano Technology', 'Food Science & Technology', 'Nutrition & Health Management',
    'Sensory Science', 'Medical Coding',
    // CIVIL ENGINEERING
    'Construction Planning',
  ];

  // Filter courses based on search query
  const filteredCourses = searchQuery.trim()
    ? allCourses.filter(course =>
        course.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 8)
    : [];

  // Function to convert course name to slug
  const createSlug = (courseName: string) => {
    return courseName.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim();
  };

  const handleCourseSelect = (course: string) => {
    setSearchQuery(course);
    setShowSuggestions(false);
    const slug = createSlug(course);
    router.push(`/courses/${slug}`);
  };

  const handleGoClick = () => {
    if (searchQuery.trim()) {
      // Find exact match first
      const exactMatch = allCourses.find(course => 
        course.toLowerCase() === searchQuery.toLowerCase()
      );
      
      if (exactMatch) {
        const slug = createSlug(exactMatch);
        router.push(`/courses/${slug}`);
      } else {
        // Find partial match
        const partialMatch = allCourses.find(course =>
          course.toLowerCase().includes(searchQuery.toLowerCase())
        );
        
        if (partialMatch) {
          const slug = createSlug(partialMatch);
          router.push(`/courses/${slug}`);
        } else {
          // If no match found, create slug from search query
          const slug = createSlug(searchQuery);
          router.push(`/courses/${slug}`);
        }
      }
    }
  };

  return (
    <section className="min-h-[88vh] flex items-center overflow-hidden relative">
      {/* ── Background Video ── */}
      <video
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: -1,
        }}
      >
        <source src="/videos/8126367-hd_1920_1080_25fps.mp4" type="video/mp4" />
      </video>

      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-10 items-center py-12 relative z-10">

        {/* ── Left: Text ── */}
        <div className="flex flex-col gap-6">
          <motion.h1
            custom={0.1} variants={textVariants} initial="hidden" animate="show"
            className="text-6xl md:text-7xl font-extrabold text-white leading-[1.05] tracking-tight"
          >
            Don't Just<br />Learn.<br />
            <motion.span
              custom={0.35} variants={textVariants} initial="hidden" animate="show"
              style={{ display: 'inline-block' }}
            >
              <MorphText />
            </motion.span>
            <br />Yourself.
          </motion.h1>

          <motion.div
            custom={0.5} variants={textVariants} initial="hidden" animate="show"
            className="flex items-stretch max-w-sm relative"
          >
            <input
              type="text"
              placeholder="Find your passion"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(e.target.value.length > 0);
              }}
              onFocus={() => searchQuery && setShowSuggestions(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleGoClick();
                }
              }}
              className="flex-1 px-5 py-3.5 bg-white text-[#1a1a2e] text-sm rounded-l-xl border border-[#e0d8d0] focus:outline-none placeholder-gray-400 focus:ring-2 focus:ring-orange-300 transition-all"
            />
            <motion.button
              whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
              onClick={handleGoClick}
              className="px-6 py-3.5 font-bold text-[#1a1a2e] rounded-r-xl text-sm"
              style={{ background: '#f90' }}
            >
              Go
            </motion.button>

            {/* Suggestions Dropdown */}
            <AnimatePresence>
              {showSuggestions && filteredCourses.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-[#e0d8d0] overflow-hidden z-50"
                >
                  {filteredCourses.map((course, i) => (
                    <motion.button
                      key={i}
                      onClick={() => handleCourseSelect(course)}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="w-full text-left px-5 py-3 hover:bg-[#f90]/10 border-b border-gray-100 last:border-b-0 transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[#f90]">→</span>
                        <span className="text-sm text-[#1a1a2e] group-hover:text-[#f90] font-medium">
                          {course}
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* ── Right: Expanding card carousel ── */}
        <motion.div
          className="flex gap-3 items-end"
          style={{ height: 500 }}
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {cards.map((card, i) => {
            const isActive = i === active;

            return (
              <motion.div
                key={i}
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                animate={{
                  flex: isActive ? 2.2 : 0.7,
                  height: isActive ? '100%' : '75%',
                }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="relative rounded-3xl overflow-hidden cursor-pointer flex-shrink-0"
                style={{ minWidth: 0 }}
                whileHover={!isActive ? { y: -6 } : {}}
              >
                {/* Image */}
                <motion.img
                  src={card.img}
                  alt={card.label}
                  className="w-full h-full object-cover object-top"
                  animate={{ scale: isActive ? 1.04 : 1 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                {/* Active card — bottom info row */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      key="info"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute bottom-0 left-0 right-0 p-5 flex justify-between items-end"
                    >
                      <div>
                        <div className="text-white font-bold text-base leading-tight">
                          {card.label.split(' ')[0]}
                        </div>
                        <div className="text-white font-bold text-base leading-tight">
                          {card.label.split(' ').slice(1).join(' ')}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-extrabold text-4xl leading-none">
                          {card.stat}
                        </div>
                        <div className="text-white/60 text-[10px] uppercase tracking-widest mt-0.5">
                          {card.statLabel}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Inactive card — vertical tag */}
                <AnimatePresence>
                  {!isActive && (
                    <motion.div
                      key="tag"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute bottom-0 left-0 right-0 p-3 flex justify-center"
                    >
                      <div
                        className="bg-[#1a1a2e]/80 backdrop-blur-sm px-3 py-2 rounded-lg"
                        style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                      >
                        <span className="text-white font-bold text-xs">{card.tag}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
