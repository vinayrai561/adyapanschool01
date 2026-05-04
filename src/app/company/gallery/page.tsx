'use client';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, ChevronRight as ArrowR } from 'lucide-react';

const E = [0.22, 1, 0.36, 1] as const;

/* ── data ── */
const MOMENTS = [
  { src: '/images/team.jpg',           alt: 'Team',        area: 'a' },
  { src: '/images/room-teaching.jpg',  alt: 'Teaching 1',  area: 'b' },
  { src: '/images/room-teaching3.jpg', alt: 'Teaching 3',  area: 'c' },
  { src: '/images/room-teaching2.jpg', alt: 'Teaching 2',  area: 'd' },
  { src: '/images/cricket.jpg',        alt: 'Events',      area: 'e' },
  { src: '/images/in-frame-pic.jpg',   alt: 'Culture',     area: 'f' },
];

const CARDS = [
  { src: '/images/team-img01.jpg',        label: 'OUR TEAM',    bg: 'bg-red-600',    col: '#dc2626' },
  { src: '/images/room-teaching.jpg',     label: 'CLASSROOM',   bg: 'bg-green-700',  col: '#15803d' },
  { src: '/images/in-room-teaching01.jpg',label: 'HANDS-ON',    bg: 'bg-yellow-500', col: '#ca8a04' },
  { src: '/images/cricket.jpg',           label: 'EVENTS',      bg: 'bg-purple-700', col: '#7e22ce' },
  { src: '/images/in-frame-pic.jpg',      label: 'CULTURE',     bg: 'bg-orange-600', col: '#ea580c' },
];

/* ── scroll progress ── */
function ScrollBar() {
  const { scrollYProgress } = useScroll();
  const s = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  return <motion.div className="fixed top-0 left-0 right-0 h-[3px] z-[200] origin-left bg-[#ffa800]" style={{ scaleX: s }} />;
}

/* ── lightbox ── */
function Lightbox({ images, idx, onClose, onPrev, onNext }: any) {
  return (
    <motion.div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.button onClick={e => { e.stopPropagation(); onClose(); }}
        className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white"
        whileHover={{ rotate: 90, scale: 1.1 }}><X className="w-4 h-4" /></motion.button>
      <motion.button onClick={e => { e.stopPropagation(); onPrev(); }}
        className="absolute left-4 w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-[#ffa800]/40 transition-colors"
        whileHover={{ x: -3 }}><ChevronLeft className="w-6 h-6" /></motion.button>
      <AnimatePresence mode="wait">
        <motion.img key={idx} src={images[idx].src} alt={images[idx].alt}
          className="max-h-[75vh] max-w-[80vw] object-contain rounded-xl shadow-2xl"
          initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.88 }} transition={{ duration: 0.3, ease: E }}
          onClick={e => e.stopPropagation()} />
      </AnimatePresence>
      <motion.button onClick={e => { e.stopPropagation(); onNext(); }}
        className="absolute right-4 w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-[#ffa800]/40 transition-colors"
        whileHover={{ x: 3 }}><ChevronRight className="w-6 h-6" /></motion.button>
      <div className="flex gap-1.5 mt-6">
        {images.map((_: any, i: number) => (
          <motion.div key={i} className="h-1.5 rounded-full"
            animate={{ width: i === idx ? 24 : 6, background: i === idx ? '#ffa800' : 'rgba(255,255,255,0.25)' }}
            transition={{ duration: 0.3 }} />
        ))}
      </div>
    </motion.div>
  );
}

export default function GalleryPage() {
  const [lb, setLb] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const closeLb = () => setLb(null);
  const prev = () => setLb(v => v === null ? null : (v - 1 + MOMENTS.length) % MOMENTS.length);
  const next = () => setLb(v => v === null ? null : (v + 1) % MOMENTS.length);

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (lb === null) return;
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'Escape') closeLb();
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [lb]);

  const scrollCards = (dir: number) => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: dir * 280, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">
      <ScrollBar />

      {/* ── NAVBAR ── */}
      <nav className="sticky top-0 z-50 bg-[#1a202c] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/company">
            <img src="/images/adyapan-logo-bg.png" alt="Adyapan" className="h-10 w-auto" />
          </Link>

          {/* Center Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            {[['/company', 'Home'], ['/company/about', 'About Us'], ['/company/gallery', 'Our Gallery'], ['#', 'Hire Talent']].map(([h, l]) => (
              <Link key={l} href={h} className={`transition-colors ${l === 'Our Gallery' ? 'text-[#ffa800]' : 'text-white hover:text-gray-300'}`}>
                {l}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-6">
            <Link href="/auth?type=organization" className="text-sm font-medium text-white hover:text-gray-300 transition-colors">
              Login
            </Link>
            <Link href="/auth?type=organization" className="px-6 py-2 bg-[#ffa800] text-white rounded-full text-sm font-semibold hover:bg-[#e69500] transition-colors">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative bg-[#c8102e] overflow-hidden min-h-[480px] flex items-center">
        {/* Background accents */}
        <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20" />
        <div className="absolute bottom-8 left-1/3 w-3 h-3 rounded-full bg-white/30" />

        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-2 items-center gap-8 w-full">
          {/* Left text */}
          <div className="z-10">
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease: E }}>
              <motion.button className="mb-6 px-5 py-2 rounded-full bg-white text-black text-xs font-bold uppercase tracking-wider"
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                Join the Batch →
              </motion.button>
              <h1 className="text-5xl md:text-6xl font-black text-white leading-[1.05] mb-4">
                The Ultimate<br />Journey<br />
                <span className="text-yellow-300">Begins Now</span>
              </h1>
              <p className="text-white/70 text-sm max-w-xs leading-relaxed">
                Step into the learning competition where dreams come true — or vanish forever. Join Adyapan and face your destiny.
              </p>
            </motion.div>
          </div>

          {/* Right image */}
          <div className="relative flex justify-end items-end h-[420px]">
            <motion.div className="absolute right-0 bottom-0 w-72 md:w-96"
              initial={{ opacity: 0, x: 60, y: 20 }} animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.9, ease: E, delay: 0.2 }}>
              <img src="/images/team.jpg" alt="Team" className="w-full h-72 object-cover object-top rounded-2xl shadow-2xl" />
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── WELCOME SECTION ── */}
      <section className="bg-[#111] py-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: E }} viewport={{ once: true }}>
            <h2 className="text-4xl font-black text-white mb-6 leading-tight">
              Welcome to the<br /><span className="text-[#ffa800]">Adyapan Gallery</span>
            </h2>
            <p className="text-gray-400 text-sm leading-7 mb-4">
              Enter a world of learning that transcends imagination. Adyapan gathers students from all walks of life, each driven by a unique, unyielding dream. Through intense trials and fierce challenges, only one will emerge victorious, fulfilling their deepest desire.
            </p>
            <p className="text-gray-500 text-sm leading-7 mb-8">
              Are you ready to face destiny? These moments captured below tell the story of every batch that walked through our doors.
            </p>
            <motion.button className="px-6 py-3 bg-[#ffa800] text-black font-bold text-sm rounded-lg"
              whileHover={{ scale: 1.05, backgroundColor: '#e69500' }} whileTap={{ scale: 0.95 }}>
              Learn More
            </motion.button>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: E }} viewport={{ once: true }}
            className="relative rounded-2xl overflow-hidden h-80">
            <img src="/images/room-teaching3.jpg" alt="Teaching" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#111]/40" />
          </motion.div>
        </div>
      </section>

      {/* ── MEET THE TEAM (card carousel like "Meet the Contenders") ── */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }} viewport={{ once: true }} className="mb-10">
            <h2 className="text-4xl font-black text-black">Meet the Team</h2>
            <p className="text-gray-500 text-sm mt-2">Passion, Grit, and Relentless Drive</p>
          </motion.div>

          {/* Carousel */}
          <div className="relative">
            <button onClick={() => scrollCards(-1)}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-9 h-9 rounded-full bg-black text-white flex items-center justify-center shadow-lg hover:bg-[#ffa800] transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
              {CARDS.map((c, i) => (
                <motion.div key={i} className={`flex-shrink-0 w-56 h-72 rounded-2xl overflow-hidden relative cursor-pointer ${c.bg}`}
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.08 }} viewport={{ once: true }}
                  whileHover={{ y: -6, scale: 1.02 }}>
                  <img src={c.src} alt={c.label} className="w-full h-full object-cover mix-blend-overlay opacity-70" />
                  <div className="absolute inset-0 flex flex-col justify-end p-4">
                    <p className="text-white font-black text-lg tracking-wider drop-shadow-lg">{c.label}</p>
                    {/* Decorative icon */}
                    <div className="w-8 h-8 rounded-full bg-white/20 border border-white/40 mt-2 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{i + 1}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <button onClick={() => scrollCards(1)}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-9 h-9 rounded-full bg-black text-white flex items-center justify-center shadow-lg hover:bg-[#ffa800] transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ── MOMENTS OF GLORY (masonry grid) ── */}
      <section className="bg-[#111] py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-4xl font-black text-white mb-3">Moments of Glory</h2>
            <p className="text-gray-500 text-sm max-w-xl mx-auto leading-relaxed">
              Discover the unforgettable highlights and dramatic showdowns at Adyapan. These images capture the raw emotion, tension, and triumphs that define every batch.
            </p>
          </motion.div>

          {/* The specific masonry grid from the reference */}
          <div className="grid gap-3" style={{
            gridTemplateAreas: `"a b c" "a d c" "e e f"`,
            gridTemplateColumns: '1fr 1fr 1fr',
            gridTemplateRows: '220px 220px 240px',
          }}>
            {MOMENTS.map((img, i) => (
              <motion.div key={i} className="relative overflow-hidden rounded-xl cursor-pointer group"
                style={{ gridArea: img.area }}
                initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: i * 0.07, ease: E }} viewport={{ once: true }}
                whileHover={{ scale: img.area === 'a' || img.area === 'c' ? 1.01 : 1.03 }}
                onClick={() => setLb(i)}>
                <img src={img.src} alt={img.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 rounded-full bg-white/20 border-2 border-white/60 backdrop-blur-sm flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-black border-t border-gray-800 py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-4 gap-10 mb-10">
            {/* Logo col */}
            <div>
              <img src="/images/adyapan-logo-bg.png" alt="Adyapan" className="h-10 w-auto mb-3" />
              <p className="text-gray-600 text-xs leading-relaxed">© 2024 Adyapan Inc. All rights reserved.</p>
            </div>
            {/* Quick Links */}
            <div>
              <p className="text-white font-bold text-sm mb-4">Quick Links</p>
              {['Home', 'About Us', 'Gallery', 'Hire Talent', 'Admissions'].map(l => (
                <p key={l} className="text-gray-500 text-xs mb-2 hover:text-[#ffa800] cursor-pointer transition-colors">{l}</p>
              ))}
            </div>
            {/* Standard Links */}
            <div>
              <p className="text-white font-bold text-sm mb-4">Standard Links</p>
              {['Terms & Conditions', 'Privacy Policy', 'Community Guidelines'].map(l => (
                <p key={l} className="text-gray-500 text-xs mb-2 hover:text-white cursor-pointer transition-colors">{l}</p>
              ))}
            </div>
            {/* Social */}
            <div>
              <p className="text-white font-bold text-sm mb-4">Social Media</p>
              {['Instagram', 'X (Twitter)', 'Discord'].map(l => (
                <p key={l} className="text-gray-500 text-xs mb-2 hover:text-[#ffa800] cursor-pointer transition-colors">{l}</p>
              ))}
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-center">
            <p className="text-gray-700 text-xs">© 2024 Adyapan Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* ── LIGHTBOX ── */}
      <AnimatePresence>
        {lb !== null && <Lightbox images={MOMENTS} idx={lb} onClose={closeLb} onPrev={prev} onNext={next} />}
      </AnimatePresence>
    </div>
  );
}
