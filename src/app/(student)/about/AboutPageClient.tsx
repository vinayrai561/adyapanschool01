'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Award, Users, Zap, Target, Heart, Globe, BookOpen, TrendingUp } from 'lucide-react';

const customEase = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: customEase } },
};

const staggerContainer = (stagger = 0.12, delayChildren = 0.1) => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren: stagger,
      delayChildren,
    },
  },
});

export default function AboutPageClient() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

  useEffect(() => {
    // Intersection Observer to load video when section is in view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoadVideo(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldLoadVideo) return;
    
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      console.log('Video can play');
      setVideoLoaded(true);
      // Try to play with user interaction fallback
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('Autoplay failed:', error);
          // Don't set error for autoplay failures, just log them
        });
      }
    };

    const handleError = (e: any) => {
      console.error('Video error:', e);
      setVideoError(true);
    };

    const handleLoadedData = () => {
      console.log('Video data loaded');
      setVideoLoaded(true);
    };

    // Add event listeners
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);
    video.addEventListener('loadeddata', handleLoadedData);

    // Force load the video
    video.load();

    // Cleanup
    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      video.removeEventListener('loadeddata', handleLoadedData);
    };
  }, [shouldLoadVideo]);

  return (
    <div className="min-h-screen bg-[#f5f0eb]">
      {/* Hero Section */}
      <section ref={sectionRef} className="relative min-h-[60vh] flex items-center overflow-hidden bg-[#f5f0eb]">
        {/* Background Video with Progressive Loading */}
        <div className="absolute inset-0" style={{ zIndex: 0 }}>
          {shouldLoadVideo && (
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-2000 ${
                videoLoaded && !videoError ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ zIndex: 1 }}
            >
              <source src="/videos/15415747_3840_2160_25fps.mp4" type="video/mp4" />
            </video>
          )}
          
          {/* Fallback background while video loads */}
          <div 
            className={`absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 transition-opacity duration-2000 ${
              videoLoaded && !videoError ? 'opacity-30' : 'opacity-100'
            }`}
            style={{ zIndex: 0 }}
          />
        </div>

        {/* Loading indicator */}
        {shouldLoadVideo && !videoLoaded && !videoError && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 2 }}>
            <div className="text-white text-sm opacity-70 bg-black/20 px-4 py-2 rounded-lg">
              Loading high-quality video...
            </div>
          </div>
        )}

        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-black/30" style={{ zIndex: 3 }} />

        {/* Animated background elements */}
        <div className="absolute inset-0" style={{ zIndex: 4 }}>
          <motion.div 
            className="absolute top-20 right-10 w-96 h-96 bg-[#f90]/5 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div 
            className="absolute bottom-0 left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.6, 0.3],
              x: [0, -50, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 w-full relative z-50 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-3xl mx-auto"
          >
            <motion.p 
              className="text-[#ffa800] text-lg mb-4 font-medium"
              animate={{ 
                opacity: [0.7, 1, 0.7],
                y: [0, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              Our Vision
            </motion.p>
            <motion.h1 
              className="text-5xl md:text-6xl font-extrabold text-[#ffa800] leading-[1.2] mb-6"
              animate={{ 
                y: [0, -10 , 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              Crafting Futures, Not Just Careers.
            </motion.h1>
            <motion.p 
              className="text-lg text-white leading-relaxed max-w-2xl mx-auto"
              animate={{ 
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
            >
              At Adyapan, we are more than an education platform. We are the bridge between learning and professional launching. Our mission is to empower individuals with the real-world skills and connections to forge their own paths to success.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* The Adyapan Pillars Section */}
      <section className="py-20 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              The <span style={{ color: '#f90' }}>Adyapan</span> Pillars
            </h2>
            <p className="text-gray-600 text-lg">
              Three core principles that guide everything we do
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer(0.15, 0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                title: 'Empowerment through Practice',
                description: 'We believe in learn-by-doing, providing practical skills that apply to today\'s industries.',
                image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=85'
              },
              {
                title: 'The Human Connection',
                description: 'We connect you to a network of mentors and industry leaders who guide your growth.',
                image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=85'
              },
              {
                title: 'Launch Ready',
                description: 'We are committed to making you not just skilled, but launch-ready for your career.',
                image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=85'
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden group hover:shadow-lg transition-all"
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <motion.img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.5,
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
                </div>

                {/* Content */}
                <div className="p-8 text-white relative z-10">
                  <motion.h3 
                    className="text-2xl font-bold mb-3"
                    animate={{
                      opacity: [0.9, 1, 0.9],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.3,
                    }}
                  >
                    {item.title}
                  </motion.h3>
                  <motion.p 
                    className="text-gray-200 leading-relaxed"
                    animate={{
                      opacity: [0.8, 1, 0.8],
                    }}
                    transition={{
                      duration: 3.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.3 + 0.5,
                    }}
                  >
                    {item.description}
                  </motion.p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-[#f5f0eb] border-t border-gray-200 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-10 right-10 w-72 h-72 bg-orange-200/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, -100, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-10 left-10 w-72 h-72 bg-orange-100/15 rounded-full blur-3xl"
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: customEase }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.p
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-gray-600 text-lg mb-4 font-medium"
            >
              Our Story:
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: customEase }}
              className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
            >
              Crafting Futures, Not Just Careers.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: customEase }}
              className="text-gray-600 text-lg max-w-3xl mx-auto"
            >
              At Adyapan, we are more than an education platform. We are the bridge between learning and professional launching. Our mission is to empower individuals with the real-world skills and connections to forge their own paths to success.
            </motion.p>
          </motion.div>

          {/* Founder Cards Grid */}
          <motion.div
            variants={staggerContainer(0.3, 0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
          >
            {/* Founder Card */}
            <motion.div
              variants={{
                hidden: { opacity: 0, x: -50, rotateY: -20 },
                show: { 
                  opacity: 1, 
                  x: 0, 
                  rotateY: 0,
                  transition: { duration: 0.8, ease: customEase }
                }
              }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="relative group"
            >
              <div className="bg-black rounded-3xl p-8 relative overflow-hidden shadow-xl hover:shadow-2xl transition-all">
                {/* Decorative lines */}
                <div className="absolute top-0 left-1/4 w-1 h-12 bg-gradient-to-b from-orange-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 right-1/4 w-1 h-12 bg-gradient-to-t from-orange-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                  {/* Circular Image with orange border */}
                  <motion.div
                    className="flex-shrink-0"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      animate={{
                        boxShadow: [
                          "0 0 20px rgba(251, 146, 60, 0.3)",
                          "0 0 40px rgba(251, 146, 60, 0.6)",
                          "0 0 20px rgba(251, 146, 60, 0.3)",
                        ],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                      }}
                      className="w-40 h-40 rounded-full overflow-hidden border-8 border-orange-400 shadow-lg flex-shrink-0"
                    >
                      <img
                        src="/images/sai-charan.jpeg"
                        alt="Founder - Sai Charan"
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  </motion.div>

                  {/* Content */}
                  <div className="flex-1">
                    <motion.h3
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      className="text-2xl font-bold text-white mb-1"
                    >
                      SAI CHARAN
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.35 }}
                      className="text-orange-400 font-semibold mb-3"
                    >
                      Founder
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                      className="text-gray-300 leading-relaxed text-sm"
                    >
                      "Upskilling isn't optional anymore. Adyapanschools ensures every student learns with purpose, practices with mentors, and grows with confidence."
                    </motion.p>

                    {/* Social Icons */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.5 }}
                      className="flex gap-4 mt-4"
                    >
                      <motion.a
                        href="https://www.linkedin.com/in/saii-m-871712171/"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-10 h-10 rounded-full bg-orange-400/20 hover:bg-orange-400/40 flex items-center justify-center transition-colors"
                      >
                        <svg className="w-5 h-5 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                      </motion.a>
                      <motion.a
                        href="#"
                        whileHover={{ scale: 1.2, rotate: -10 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-10 h-10 rounded-full bg-orange-400/20 hover:bg-orange-400/40 flex items-center justify-center transition-colors"
                      >
                        <svg className="w-5 h-5 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7s1.1 5.2-5.2 8.3A15.7 15.7 0 010 19" />
                        </svg>
                      </motion.a>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Co-Founder Card */}
            <motion.div
              variants={{
                hidden: { opacity: 0, x: 50, rotateY: 20 },
                show: { 
                  opacity: 1, 
                  x: 0, 
                  rotateY: 0,
                  transition: { duration: 0.8, ease: customEase }
                }
              }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="relative group"
            >
              <div className="bg-black rounded-3xl p-8 relative overflow-hidden shadow-xl hover:shadow-2xl transition-all">
                {/* Decorative lines */}
                <div className="absolute top-0 right-1/4 w-1 h-12 bg-gradient-to-b from-orange-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-1/4 w-1 h-12 bg-gradient-to-t from-orange-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                  {/* Circular Image with orange border */}
                  <motion.div
                    className="flex-shrink-0"
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      animate={{
                        boxShadow: [
                          "0 0 20px rgba(251, 146, 60, 0.3)",
                          "0 0 40px rgba(251, 146, 60, 0.6)",
                          "0 0 20px rgba(251, 146, 60, 0.3)",
                        ],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: 1,
                      }}
                      className="w-40 h-40 rounded-full overflow-hidden border-8 border-orange-400 shadow-lg flex-shrink-0"
                    >
                      <img
                        src="/images/niranjan-reddy.jpeg"
                        alt="Co-Founder - Niranjan Reddy"
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  </motion.div>

                  {/* Content */}
                  <div className="flex-1">
                    <motion.h3
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      className="text-2xl font-bold text-white mb-1"
                    >
                      NIRANJAN REDDY
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.35 }}
                      className="text-orange-400 font-semibold mb-3"
                    >
                      Co- Founder
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                      className="text-gray-300 leading-relaxed text-sm"
                    >
                      "The world is full of opportunities, but students need the right direction. Adyapanschools helps them access global careers without feeling lost."
                    </motion.p>

                    {/* Social Icons */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.5 }}
                      className="flex gap-4 mt-4"
                    >
                      <motion.a
                        href="https://www.linkedin.com/in/niranjan-reddy-abb1861b6/"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-10 h-10 rounded-full bg-orange-400/20 hover:bg-orange-400/40 flex items-center justify-center transition-colors"
                      >
                        <svg className="w-5 h-5 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                      </motion.a>
                      <motion.a
                        href="#"
                        whileHover={{ scale: 1.2, rotate: -10 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-10 h-10 rounded-full bg-orange-400/20 hover:bg-orange-400/40 flex items-center justify-center transition-colors"
                      >
                        <svg className="w-5 h-5 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7s1.1 5.2-5.2 8.3A15.7 15.7 0 010 19" />
                        </svg>
                      </motion.a>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Our Leadership Section */}
      <section className="py-20 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Our <span style={{ color: '#f90' }}>Leadership</span>
            </h2>
            <p className="text-gray-600 text-lg">
              Visionary leaders driving innovation in EdTech
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer(0.15, 0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              {
                name: 'Sai Charan',
                role: 'Founder',
                image: '/images/sai-charan.jpeg'
              },
              {
                name: 'Niranjan Reddy',
                role: 'Co-Founder',
                image: '/images/niranjan-reddy.jpeg'
              },
              {
                name: 'Gunjan Avasthi',
                role: 'Human Resource Manager',
                image: 'https://static.vecteezy.com/system/resources/thumbnails/046/654/168/small/a-smiling-young-indian-businesswoman-in-a-light-grey-suit-stands-with-her-arms-crossed-in-a-modern-office-building-photo.jpeg'
              },
              {
                name: 'Dr. Dhiraj Singh',
                role: 'Head, Training & Placement Cell',
                image: '/images/Dr. Dhiraj Singh.jpeg'
              }
            ].map((member, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="text-center"
              >
                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-[#f90]/20 hover:border-[#f90]/50 transition-all">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">{member.name}</h3>
                <p className="text-gray-600 text-sm">{member.role}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            variants={staggerContainer(0.2, 0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
          >
            {[
              { number: '20K+', label: 'Students Trained' },
              { number: '70+', label: 'Programs Offered' },
              { number: '95%', label: 'Placement Rate' },
              { number: '250+', label: 'Partner Companies' }
            ].map((stat, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="text-center"
              >
                <motion.div 
                  className="text-5xl font-bold mb-2" 
                  style={{ color: '#f90' }}
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.8, 1, 0.8],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.3,
                  }}
                >
                  {stat.number}
                </motion.div>
                <motion.p 
                  className="text-gray-600 font-medium"
                  animate={{
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.3 + 0.5,
                  }}
                >
                  {stat.label}
                </motion.p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our Approach Section */}
      <section className="py-20 bg-[#f5f0eb] border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Our <span style={{ color: '#f90' }}>Learning Approach</span>
            </h2>
            <p className="text-gray-600 text-lg">
              Learn → Practice → Build → Launch
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer(0.15, 0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
          >
            {[
              { step: '01', title: 'Learn', description: 'Master industry-relevant concepts through expert-led courses' },
              { step: '02', title: 'Practice', description: 'Apply knowledge with hands-on projects and real scenarios' },
              { step: '03', title: 'Build', description: 'Create portfolio-worthy projects that impress employers' },
              { step: '04', title: 'Launch', description: 'Get placed with top companies or start your own venture' }
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-[#f90]/50 transition-all"
              >
                <div className="text-4xl font-bold mb-4" style={{ color: '#f90' }}>
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Adyapan Section */}
      <section className="py-20 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Why Choose <span style={{ color: '#f90' }}>Adyapan?</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              We're not just an EdTech platform. We're your partner in career transformation.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer(0.15, 0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              {
                icon: BookOpen,
                title: 'Industry-Aligned Curriculum',
                description: 'Learn skills that companies actually need, designed with industry experts'
              },
              {
                icon: Users,
                title: 'Expert Mentorship',
                description: 'Learn from professionals with 5-10+ years of real-world experience'
              },
              {
                icon: Zap,
                title: 'Real-World Projects',
                description: 'Build a portfolio with actual projects that impress employers'
              },
              {
                icon: Award,
                title: 'Recognized Credentials',
                description: 'Earn certifications valued by top companies worldwide'
              },
              {
                icon: TrendingUp,
                title: 'Career Support',
                description: 'Get placement assistance, interview prep, and career guidance'
              },
              {
                icon: Heart,
                title: 'Flexible Learning',
                description: 'Learn at your own pace with lifetime access to course materials'
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="bg-gradient-to-br from-[#f90]/5 to-transparent rounded-2xl p-8 border border-gray-200 hover:border-[#f90]/50 hover:shadow-lg transition-all group"
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="mb-4"
                  animate={{
                    rotate: [0, 10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.2,
                  }}
                >
                  <div className="w-12 h-12 bg-[#f90]/10 rounded-lg flex items-center justify-center group-hover:bg-[#f90]/20 transition-colors">
                    <item.icon className="w-6 h-6" style={{ color: '#f90' }} />
                  </div>
                </motion.div>
                <motion.h3 
                  className="text-gray-800 font-bold text-lg mb-2"
                  animate={{
                    opacity: [0.9, 1, 0.9],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.2 + 0.3,
                  }}
                >
                  {item.title}
                </motion.h3>
                <motion.p 
                  className="text-gray-600 text-sm leading-relaxed"
                  animate={{
                    opacity: [0.8, 1, 0.8],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.2 + 0.5,
                  }}
                >
                  {item.description}
                </motion.p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#f5f0eb] border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Ready to Craft Your <span style={{ color: '#f90' }}>Future?</span>
            </h2>
            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who have already transformed their careers with Adyapan
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/auth"
                className="inline-block px-10 py-4 bg-[#f90] text-white rounded-lg font-bold text-lg hover:bg-[#e07000] transition-colors"
              >
                Start Your Journey →
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
