'use client';

import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
import { fadeLeft, fadeRight, fadeUp, staggerContainer } from '@/lib/motion';

// Video Player Component with Controls
const VideoPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, transition: { duration: 0.4 } }}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      className="rounded-3xl overflow-hidden bg-[#c8d4d8] relative shadow-xl w-full max-w-xs sm:max-w-sm mx-auto"
      style={{ aspectRatio: '9/16' }} // Instagram Reels aspect ratio (vertical)
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-cover"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source src="/videos/website-intro.mp4" type="video/mp4" />
      </video>
      
      {/* Video Controls Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showControls ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-black/20 flex items-center justify-center pointer-events-none"
      >
        <div className="flex items-center space-x-4 pointer-events-auto">
          {/* Play/Pause Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={togglePlay}
            className="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
          >
            {isPlaying ? (
              // Pause Icon
              <svg className="w-6 h-6 text-[#1a1a2e]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              // Play Icon
              <svg className="w-6 h-6 text-[#1a1a2e] ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </motion.button>

          {/* Sound Toggle Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleMute}
            className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
          >
            {isMuted ? (
              // Muted Icon
              <svg className="w-5 h-5 text-[#1a1a2e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            ) : (
              // Unmuted Icon
              <svg className="w-5 h-5 text-[#1a1a2e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Subtle gradient overlay for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
    </motion.div>
  );
};

const pillars = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    title: 'Verified Skills',
    desc: 'Every skill you earn is blockchain-verified and trusted by top companies',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Real Projects',
    desc: 'Work on actual business tasks from companies and build your portfolio',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Direct Placement',
    desc: 'Top performers get flagged for full-time interviews by the same companies',
  },
];

const HowItWorksSection = () => {
  return (
    <section id="skills" className="bg-[#f5f0eb] py-20 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center px-4 sm:px-6">

        {/* Left */}
        <motion.div
          variants={staggerContainer(0.15, 0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.h2
            variants={fadeLeft}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1a1a2e] leading-tight mb-4 tracking-tight"
          >
            Where India's Students<br />
            <span style={{ color: '#f90' }}>Learn Skills, Earn Income</span><br />
            &amp; Get Hired<span style={{ color: '#f90' }}>.</span>
          </motion.h2>

          <motion.p variants={fadeLeft} className="text-gray-500 text-sm sm:text-base mb-8 lg:mb-10 max-w-sm leading-relaxed">
            The modern job market demands more than a degree. Adyapan gives you
            verified skills, real project experience, and a direct path to employment.
          </motion.p>

          {/* Pillars */}
          <div className="space-y-6">
            {pillars.map((p, i) => (
              <motion.div
                key={i}
                variants={fadeLeft}
                whileHover={{ x: 6, transition: { duration: 0.2 } }}
                className="flex items-start space-x-4 cursor-default"
              >
                <motion.div
                  whileHover={{ scale: 1.15, borderColor: '#f90' }}
                  transition={{ duration: 0.2 }}
                  className="w-10 h-10 rounded-full border border-[#e0d8d0] bg-white flex items-center justify-center flex-shrink-0 text-[#1a1a2e]"
                >
                  {p.icon}
                </motion.div>
                <div>
                  <div className="font-bold text-[#1a1a2e] mb-1">{p.title}</div>
                  <div className="text-gray-400 text-sm leading-relaxed">{p.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right — video */}
        <motion.div
          variants={fadeRight}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="relative"
        >
          {/* Stats card */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute -top-4 sm:-top-6 -left-2 sm:-left-4 z-10 bg-[#d8e8c8] rounded-2xl px-4 sm:px-6 py-3 sm:py-4 flex gap-4 sm:gap-8 shadow-sm"
          >
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold text-[#1a1a2e]">20K</span>
              <span className="text-xs text-gray-500 block uppercase tracking-wider mt-0.5">Active Learners</span>
            </div>
            <div className="w-px bg-[#c0d0b0]" />
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold text-[#1a1a2e]">250+</span>
              <span className="text-xs text-gray-500 block uppercase tracking-wider mt-0.5">Partner Companies</span>
            </div>
          </motion.div>

          {/* Video Container with Natural Aspect Ratio */}
          <VideoPlayer />
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
