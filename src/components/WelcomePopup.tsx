'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const WelcomePopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show popup after 1 second of page load
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const closePopup = () => setIsOpen(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with blur - covers everything including navbar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closePopup}
            className="fixed inset-0 bg-black/50 backdrop-blur-md z-[999]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
          >
            <div className="w-full max-w-4xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Student Card */}
                <motion.div
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="rounded-3xl p-8 relative overflow-hidden cursor-default"
                  style={{ background: 'linear-gradient(135deg, #ff9900 0%, #e07000 100%)' }}
                >
                  <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                  
                  <motion.div
                    whileHover={{ rotate: 90 }}
                    transition={{ duration: 0.3 }}
                    className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-6 relative z-10"
                  >
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.div>

                  <h3 className="text-2xl font-extrabold text-white mb-3 relative z-10">I'm a Student</h3>
                  <p className="text-white/90 text-sm mb-6 leading-relaxed relative z-10">
                    Build real skills with mentor-led programs, work on live projects, and gain industry experience that makes you job-ready.
                  </p>

                  <motion.ul
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="space-y-2 mb-6 relative z-10"
                  >
                    {[
                      'Learn from industry mentors & experts',
                      'Work on real internships & live projects',
                      'Build a job-ready portfolio',
                      'Get placement guidance & career support',
                    ].map((item) => (
                      <motion.li
                        key={item}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.35, duration: 0.4 }}
                        className="flex items-center text-white text-sm"
                      >
                        <span className="w-1.5 h-1.5 bg-white rounded-full mr-2 flex-shrink-0" />
                        {item}
                      </motion.li>
                    ))}
                  </motion.ul>

                  {/* Trust Badge */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="mb-6 pb-6 border-b border-white/20 relative z-10"
                  >
                    <p className="text-white text-xs font-semibold">
                      ⭐ Trusted by 20,000+ students | 500+ universities
                    </p>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="relative z-10 w-fit">
                    <Link
                      href="/auth?type=student"
                      onClick={closePopup}
                      className="inline-flex items-center px-5 py-2.5 bg-white rounded-xl font-semibold text-sm hover:bg-orange-50 transition-colors"
                      style={{ color: '#c05000' }}
                    >
                      Start Your Career Journey
                      <span className="ml-2">→</span>
                    </Link>
                  </motion.div>
                </motion.div>

                {/* Company Card */}
                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="bg-[#1a1a2e] rounded-3xl p-8 relative overflow-hidden cursor-default"
                >
                  <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />

                  <motion.div
                    whileHover={{ rotate: 15 }}
                    transition={{ duration: 0.3 }}
                    className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-6 relative z-10"
                  >
                    <svg className="w-5 h-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </motion.div>

                  <h3 className="text-2xl font-extrabold text-white mb-3 relative z-10">I'm a Company</h3>
                  <p className="text-gray-400 text-sm mb-6 leading-relaxed relative z-10">
                    Post micro-internship tasks, access pre-vetted talent, and build a direct pipeline to your next full-time hire.
                  </p>

                  <motion.ul
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="space-y-2 mb-8 relative z-10"
                  >
                    {[
                      'Post tasks in minutes',
                      'Pre-assessed, verified talent',
                      'See real project portfolios',
                      'Direct-to-hire pipeline',
                    ].map((item) => (
                      <motion.li
                        key={item}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.35, duration: 0.4 }}
                        className="flex items-center text-gray-300 text-sm"
                      >
                        <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mr-2 flex-shrink-0" />
                        {item}
                      </motion.li>
                    ))}
                  </motion.ul>

                  <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="relative z-10">
                    <Link
                      href="/company"
                      onClick={closePopup}
                      className="inline-flex items-center px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors"
                      style={{ background: '#ff9900', color: '#1a0800' }}
                    >
                      Post Your First Task
                      <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </motion.div>
                </motion.div>
              </div>

              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={closePopup}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#1a1a2e] font-bold hover:bg-gray-100 transition-colors z-[1001]"
              >
                ✕
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default WelcomePopup;
