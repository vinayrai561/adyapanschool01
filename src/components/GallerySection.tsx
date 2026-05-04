'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

const customEase = [0.22, 1, 0.36, 1] as const;

const galleryImages = [
  {
    src: '/images/team.jpg',
    alt: 'Adyapan Team',
    caption: 'Our Team',
    category: 'Team',
    span: 'col-span-2 row-span-2',
  },
  {
    src: '/images/room-teaching.jpg',
    alt: 'Classroom Teaching Session',
    caption: 'Live Classroom Sessions',
    category: 'Teaching',
    span: 'col-span-1 row-span-1',
  },
  {
    src: '/images/room-teaching2.jpg',
    alt: 'Room Teaching 2',
    caption: 'Interactive Learning',
    category: 'Teaching',
    span: 'col-span-1 row-span-1',
  },
  {
    src: '/images/in-room-teaching01.jpg',
    alt: 'In-room Teaching',
    caption: 'Hands-On Training',
    category: 'Teaching',
    span: 'col-span-1 row-span-1',
  },
  {
    src: '/images/room-teaching3.jpg',
    alt: 'Room Teaching 3',
    caption: 'Expert-Led Workshops',
    category: 'Teaching',
    span: 'col-span-1 row-span-2',
  },
  {
    src: '/images/team-img01.jpg',
    alt: 'Team Member',
    caption: 'Meet Our Team',
    category: 'Team',
    span: 'col-span-1 row-span-1',
  },
  {
    src: '/images/cricket.jpg',
    alt: 'Cricket Event',
    caption: 'Team Building & Events',
    category: 'Events',
    span: 'col-span-2 row-span-1',
  },
  {
    src: '/images/in-frame-pic.jpg',
    alt: 'In Frame',
    caption: 'Company Culture',
    category: 'Culture',
    span: 'col-span-1 row-span-1',
  },
];

const categories = ['All', 'Team', 'Teaching', 'Events', 'Culture'];

interface GallerySectionProps {
  theme?: 'light' | 'dark';
}

export default function GallerySection({ theme = 'light' }: GallerySectionProps) {
  const isDark = theme === 'dark';
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const filtered = activeCategory === 'All'
    ? galleryImages
    : galleryImages.filter((img) => img.category === activeCategory);

  const openLightbox = (idx: number) => setLightboxIndex(idx);
  const closeLightbox = () => setLightboxIndex(null);

  const prevImage = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + filtered.length) % filtered.length);
  };
  const nextImage = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % filtered.length);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxIndex, filtered.length]);

  return (
    <section
      id="our-gallery"
      className={`py-24 relative overflow-hidden ${
        isDark ? 'bg-[#0f1419]' : 'bg-[#f5f0eb]'
      }`}
    >
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 80, 0], y: [0, 40, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className={`absolute top-10 right-10 w-80 h-80 rounded-full blur-3xl ${
            isDark ? 'bg-[#f90]/8' : 'bg-orange-300/20'
          }`}
        />
        <motion.div
          animate={{ x: [0, -80, 0], y: [0, -40, 0], scale: [1.2, 1, 1.2] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className={`absolute bottom-10 left-10 w-96 h-96 rounded-full blur-3xl ${
            isDark ? 'bg-blue-500/5' : 'bg-orange-200/15'
          }`}
        />
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, 60, 0] }}
          transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
          className={`absolute top-1/2 left-1/3 w-64 h-64 rounded-full blur-3xl ${
            isDark ? 'bg-[#f90]/5' : 'bg-amber-200/10'
          }`}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: customEase }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <motion.p
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className={`text-sm font-semibold uppercase tracking-widest mb-3 ${
              isDark ? 'text-[#f90]' : 'text-[#ffa800]'
            }`}
          >
            Our Gallery
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: customEase }}
            viewport={{ once: true }}
            className={`text-4xl md:text-5xl font-extrabold mb-4 ${
              isDark ? 'text-white' : 'text-gray-800'
            }`}
          >
            Life at{' '}
            <span style={{ color: isDark ? '#f90' : '#ffa800' }}>Adyapan</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: customEase }}
            viewport={{ once: true }}
            className={`text-lg max-w-2xl mx-auto ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            A glimpse into our classrooms, events, and the passionate team crafting futures every day.
          </motion.p>

          {/* Animated underline */}
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '80px' }}
            transition={{ duration: 0.8, delay: 0.4, ease: customEase }}
            viewport={{ once: true }}
            className="h-1 rounded-full mx-auto mt-5"
            style={{ background: isDark ? '#f90' : '#ffa800' }}
          />
        </motion.div>

        {/* Category Filter Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 border ${
                activeCategory === cat
                  ? isDark
                    ? 'bg-[#f90] text-white border-[#f90] shadow-lg shadow-[#f90]/20'
                    : 'bg-[#ffa800] text-white border-[#ffa800] shadow-lg shadow-[#ffa800]/30'
                  : isDark
                  ? 'bg-transparent text-gray-400 border-gray-700 hover:border-[#f90]/50 hover:text-[#f90]'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-[#ffa800]/50 hover:text-[#ffa800]'
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </motion.div>

        {/* Masonry Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: customEase }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[200px] gap-4"
          >
            {filtered.map((img, i) => (
              <motion.div
                key={img.src + activeCategory}
                initial={{ opacity: 0, scale: 0.85, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  duration: 0.55,
                  delay: i * 0.07,
                  ease: customEase,
                }}
                className={`relative group overflow-hidden rounded-2xl cursor-pointer ${img.span}`}
                style={{
                  boxShadow: hoveredIndex === i
                    ? isDark
                      ? '0 8px 40px rgba(255,153,0,0.25)'
                      : '0 8px 40px rgba(255,168,0,0.25)'
                    : '0 2px 10px rgba(0,0,0,0.12)',
                  transition: 'box-shadow 0.3s ease',
                }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => openLightbox(i)}
              >
                {/* Image */}
                <motion.img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.45, ease: customEase }}
                />

                {/* Gradient overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />

                {/* Caption & zoom icon */}
                <motion.div
                  className="absolute inset-0 flex flex-col items-center justify-end p-4"
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    whileHover={{ scale: 1.2 }}
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30"
                      style={{ background: isDark ? 'rgba(255,153,0,0.7)' : 'rgba(255,168,0,0.75)' }}
                    >
                      <ZoomIn className="w-5 h-5 text-white" />
                    </div>
                  </motion.div>

                  {/* Category badge */}
                  <span
                    className="absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full text-white"
                    style={{ background: isDark ? 'rgba(255,153,0,0.85)' : 'rgba(255,168,0,0.85)' }}
                  >
                    {img.category}
                  </span>

                  <p className="text-white text-sm font-semibold text-center drop-shadow-lg">
                    {img.caption}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
            onClick={closeLightbox}
          >
            {/* Close button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
              className="absolute top-5 right-5 z-10 w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </motion.button>

            {/* Prev button */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-4 z-10 w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>

            {/* Next button */}
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-4 z-10 w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>

            {/* Image */}
            <AnimatePresence mode="wait">
              <motion.div
                key={lightboxIndex}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ duration: 0.35, ease: customEase }}
                className="max-w-5xl max-h-[85vh] mx-6 relative"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={filtered[lightboxIndex].src}
                  alt={filtered[lightboxIndex].alt}
                  className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
                />
                {/* Caption bar */}
                <div className="mt-4 text-center">
                  <span
                    className="text-xs font-bold px-3 py-1 rounded-full mr-2"
                    style={{ background: '#f90', color: 'white' }}
                  >
                    {filtered[lightboxIndex].category}
                  </span>
                  <span className="text-white text-base font-semibold">
                    {filtered[lightboxIndex].caption}
                  </span>
                  <p className="text-gray-400 text-sm mt-2">
                    {lightboxIndex + 1} / {filtered.length}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
