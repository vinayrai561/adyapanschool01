'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [active, setActive] = useState('');
  const [showPrograms, setShowPrograms] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const links = [
    { label: 'Assessment', href: '/assessment' },
    { label: 'About Us', href: '/about' },
    { label: 'Categories', href: '#categories' },
    { label: 'Skills', href: '#skills' },
    { label: 'Students', href: '#testimonials' },
    { label: 'Campus Ambassador', href: '/campus-ambassador' },
  ];

  const categories = [
    { name: 'CSE / IT DOMAINS', count: '26 COURSES' },
    { name: 'MANAGEMENT & COMMERCE', count: '15 COURSES' },
    { name: 'ECE DOMAINS', count: '5 COURSES' },
    { name: 'ECONOMICS', count: '4 COURSES' },
    { name: 'MECHANICAL ENGINEERING', count: '4 COURSES' },
    { name: 'BIO & LIFE SCIENCES', count: '10 COURSES' },
    { name: 'CIVIL ENGINEERING', count: '1 COURSE' },
  ];

  const coursesByCategory: Record<string, Array<{ name: string; img: string; duration: string }>> = {
    'CSE / IT DOMAINS': [
      { name: 'Artificial Intelligence', img: 'https://images.unsplash.com/photo-1677442d019cecf8f80f1a18f0445c1d437b89efd?w=400&q=85', duration: '2-3 Months' },
      { name: 'AI Engineering', img: 'https://images.unsplash.com/photo-1516321318423-f06f70d504f0?w=400&q=85', duration: '2-3 Months' },
      { name: 'Generative AI', img: 'https://images.unsplash.com/photo-1677442d019cecf8f80f1a18f0445c1d437b89efd?w=400&q=85', duration: '2-3 Months' },
      { name: 'Machine Learning', img: 'https://images.unsplash.com/photo-1516321318423-f06f70d504f0?w=400&q=85', duration: '2-3 Months' },
      { name: 'Data Science', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=85', duration: '2-3 Months' },
      { name: 'Data Engineering', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=85', duration: '2-3 Months' },
      { name: 'Data Analytics', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=85', duration: '2-3 Months' },
      { name: 'Database Management (DBMS)', img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=85', duration: '2-3 Months' },
      { name: 'Data Structures & Algorithms', img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=85', duration: '2-3 Months' },
      { name: 'Web Development', img: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&q=85', duration: '2-3 Months' },
      { name: 'Web 3.0', img: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&q=85', duration: '2-3 Months' },
      { name: 'App Development', img: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&q=85', duration: '2-3 Months' },
      { name: 'Python Full Stack', img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=85', duration: '2-3 Months' },
      { name: 'Python programming curriculum', img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=85', duration: '2-3 Months' },
      { name: 'Java Programming', img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=85', duration: '2-3 Months' },
      { name: 'Java Full Stack', img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=85', duration: '2-3 Months' },
      { name: 'Selenium Testing with Java', img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=85', duration: '2-3 Months' },
      { name: 'DevOps Engineering', img: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&q=85', duration: '2-3 Months' },
      { name: 'Cloud Computing', img: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&q=85', duration: '2-3 Months' },
      { name: 'AWS', img: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&q=85', duration: '2-3 Months' },
      { name: 'Cyber Security', img: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&q=85', duration: '2-3 Months' },
      { name: 'Blockchain & Bitcoin', img: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&q=85', duration: '2-3 Months' },
      { name: 'AR/VR Development', img: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&q=85', duration: '2-3 Months' },
      { name: 'UI/UX Design', img: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&q=85', duration: '2-3 Months' },
      { name: 'Graphic Design', img: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&q=85', duration: '2-3 Months' },
      { name: 'VFX', img: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&q=85', duration: '2-3 Months' },
    ],
    'MANAGEMENT & COMMERCE': [
      { name: 'Finance', img: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&q=85', duration: '2-3 Months' },
      { name: 'Investment Banking', img: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&q=85', duration: '2-3 Months' },
      { name: 'Business Analytics', img: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&q=85', duration: '2-3 Months' },
      { name: 'Marketing Management', img: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&q=85', duration: '2-3 Months' },
      { name: 'Digital Marketing & Growth Strategy', img: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&q=85', duration: '2-3 Months' },
      { name: 'Social Media Marketing', img: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&q=85', duration: '2-3 Months' },
      { name: 'HRM', img: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&q=85', duration: '2-3 Months' },
      { name: 'Management Consultancy', img: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&q=85', duration: '2-3 Months' },
      { name: 'Supply Chain Management', img: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&q=85', duration: '2-3 Months' },
      { name: 'SAP FICA', img: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&q=85', duration: '2-3 Months' },
      { name: 'Salesforce', img: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&q=85', duration: '2-3 Months' },
      { name: 'Stock Marketing', img: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&q=85', duration: '2-3 Months' },
      { name: 'ACCA F4 (Business & Corporate Law)', img: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&q=85', duration: '2-3 Months' },
      { name: 'Chartered Accountancy / CFA', img: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&q=85', duration: '2-3 Months' },
      { name: 'Spoken English & Communication', img: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&q=85', duration: '2-3 Months' },
    ],
    'ECE DOMAINS': [
      { name: 'Embedded Systems', img: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&q=85', duration: '2-3 Months' },
      { name: 'Hybrid & Electric Vehicle', img: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&q=85', duration: '2-3 Months' },
      { name: 'VLSI', img: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&q=85', duration: '2-3 Months' },
      { name: 'IoT & Robotics', img: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&q=85', duration: '2-3 Months' },
      { name: 'Power Systems', img: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&q=85', duration: '2-3 Months' },
    ],
    'ECONOMICS': [
      { name: 'Business & Financial Economics', img: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&q=85', duration: '2-3 Months' },
      { name: 'Investment Analysis', img: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&q=85', duration: '2-3 Months' },
      { name: 'Data Analysis for Economics', img: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&q=85', duration: '2-3 Months' },
      { name: 'Financial Economics', img: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&q=85', duration: '2-3 Months' },
    ],
    'MECHANICAL ENGINEERING': [
      { name: 'AutoCAD', img: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&q=85', duration: '2-3 Months' },
      { name: 'CATIA', img: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&q=85', duration: '2-3 Months' },
      { name: 'Car Design', img: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&q=85', duration: '2-3 Months' },
      { name: 'Quality & Safety Professionals', img: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&q=85', duration: '2-3 Months' },
    ],
    'BIO & LIFE SCIENCES': [
      { name: 'Bioinformatics', img: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&q=85', duration: '2-3 Months' },
      { name: 'Microbiology', img: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&q=85', duration: '2-3 Months' },
      { name: 'Molecular Biology', img: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&q=85', duration: '2-3 Months' },
      { name: 'Genetic Engineering', img: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&q=85', duration: '2-3 Months' },
      { name: 'Pharmacovigilance', img: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&q=85', duration: '2-3 Months' },
      { name: 'Nano Technology', img: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&q=85', duration: '2-3 Months' },
      { name: 'Food Science & Technology', img: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&q=85', duration: '2-3 Months' },
      { name: 'Nutrition & Health Management', img: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&q=85', duration: '2-3 Months' },
      { name: 'Sensory Science', img: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&q=85', duration: '2-3 Months' },
      { name: 'Medical Coding', img: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&q=85', duration: '2-3 Months' },
    ],
    'CIVIL ENGINEERING': [
      { name: 'Construction Planning', img: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&q=85', duration: '2-3 Months' },
    ],
  };

  const [selectedCategory, setSelectedCategory] = useState('CSE / IT DOMAINS');

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowPrograms(false);
      }
    };

    if (showPrograms) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showPrograms]);

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 border-b border-white/10"
      style={{
        background: 'rgba(20, 22, 38, 0.82)',
        backdropFilter: 'blur(18px) saturate(1.5)',
        WebkitBackdropFilter: 'blur(18px) saturate(1.5)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
          <Link href="/" className="flex items-center space-x-2.5">
            <img
              src="/images/adyapan-logo-bg.png"
              alt="Adyapan Logo"
              className="h-10 w-auto"
            />
          </Link>
        </motion.div>

        {/* Programs Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <motion.button
            onClick={() => setShowPrograms(!showPrograms)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 px-4 py-1.5 bg-[#ffa800] text-white rounded-full text-sm font-semibold hover:bg-[#e69500] transition-colors"
          >
            <span>☰</span>
            <span>All Programs</span>
          </motion.button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {showPrograms && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-2xl p-6 w-[1000px] z-50"
              >
                <div className="grid grid-cols-3 gap-6">
                  {/* Left Sidebar - Categories */}
                  <div className="col-span-1 border-r border-gray-200 pr-4 max-h-[500px] overflow-y-auto">
                    <div className="space-y-2">
                      {categories.map((cat, i) => (
                        <motion.button
                          key={i}
                          onClick={() => setSelectedCategory(cat.name)}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className={`w-full text-left flex items-center justify-between p-3 rounded-lg transition-all ${
                            selectedCategory === cat.name
                              ? 'bg-[#ffa800] text-white'
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          <div>
                            <div className="font-semibold text-sm">{cat.name}</div>
                            <div className={`text-xs ${selectedCategory === cat.name ? 'text-white/80' : 'text-gray-500'}`}>
                              {cat.count}
                            </div>
                          </div>
                          <span className={selectedCategory === cat.name ? 'text-white' : 'text-gray-400'}>›</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Right Side - Courses Grid */}
                  <div className="col-span-2 max-h-[500px] overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4">
                      {(coursesByCategory[selectedCategory] || []).map((course: { name: string; img: string; duration: string }, i: number) => {
                        // Create slug from course name
                        const slug = course.name.toLowerCase()
                          .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
                          .replace(/\s+/g, '-') // Replace spaces with hyphens
                          .replace(/-+/g, '-') // Replace multiple hyphens with single
                          .trim();

                        return (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.03 }}
                            className="rounded-xl overflow-hidden bg-white border border-gray-200 hover:shadow-lg transition-all cursor-pointer group"
                          >
                            <Link href={`/courses/${slug}`} className="block">
                              {/* Course Image */}
                              <div className="relative h-32 overflow-hidden bg-gray-200">
                                <img
                                  src={course.img}
                                  alt={course.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                              </div>

                              {/* Course Info */}
                              <div className="p-3">
                                <h4 className="font-semibold text-sm text-gray-800 mb-2 line-clamp-2">
                                  {course.name}
                                </h4>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-gray-600">{course.duration}</span>
                                  <span className="inline-flex items-center space-x-1 px-2 py-1 bg-red-50 rounded-full">
                                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                                    <span className="text-xs text-red-600 font-semibold">Live</span>
                                  </span>
                                </div>
                              </div>
                            </Link>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Nav links */}
        <div className="hidden md:flex items-center space-x-8">
          {links.map((l, i) => (
            <motion.div
              key={l.label}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.07, duration: 0.4 }}
            >
              <Link
                href={l.href}
                onClick={() => setActive(l.label)}
                className={`text-sm font-medium transition-colors relative group ${
                  active === l.label ? 'text-[#ffa800]' : 'text-white hover:text-gray-300'
                }`}
              >
                {l.label}
                <span className={`absolute -bottom-0.5 left-0 h-0.5 bg-[#ffa800] transition-all duration-300 ${
                  active === l.label ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Actions */}
        <motion.div
          className="flex items-center space-x-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >

          <Link href="/auth" className="text-sm font-medium text-white hover:text-gray-300 transition-colors">
            Login
          </Link>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/auth"
              className="px-5 py-2 bg-[#ffa800] text-white rounded-full text-sm font-semibold hover:bg-[#e69500] transition-colors"
            >
              Sign Up
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
