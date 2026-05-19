'use client';

import { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useMotionValue, useSpring, useTransform, useInView, AnimatePresence } from 'framer-motion';

/* ─── Data ─────────────────────────────────────────────────── */
const STATS = [
  '50K+ Students',
  '100+ Courses',
  'AI Powered Learning',
  'Career Support',
  'Industry Mentors',
  'Live Projects',
  '100+ Hiring Partners',
  'Adyapan Certificates',
];

/* ─── Decorative scattered dots/shapes ─────────────────────── */
const SHAPES = [
  { type: 'dot',    x: '8%',  y: '18%', size: 8,  color: 'rgba(255,153,0,0.35)' },
  { type: 'ring',   x: '5%',  y: '55%', size: 14, color: 'rgba(255,153,0,0.3)'  },
  { type: 'plus',   x: '14%', y: '78%', size: 12, color: 'rgba(180,100,255,0.3)'},
  { type: 'dot',    x: '22%', y: '12%', size: 5,  color: 'rgba(255,153,0,0.25)' },
  { type: 'ring',   x: '88%', y: '20%', size: 12, color: 'rgba(180,100,255,0.3)'},
  { type: 'dot',    x: '92%', y: '50%', size: 8,  color: 'rgba(180,100,255,0.35)'},
  { type: 'plus',   x: '78%', y: '75%', size: 10, color: 'rgba(255,153,0,0.25)' },
  { type: 'dot',    x: '75%', y: '10%', size: 5,  color: 'rgba(255,153,0,0.2)'  },
  { type: 'ring',   x: '50%', y: '88%', size: 10, color: 'rgba(180,100,255,0.2)'},
  { type: 'dot',    x: '35%', y: '5%',  size: 4,  color: 'rgba(255,153,0,0.2)'  },
  { type: 'plus',   x: '60%', y: '15%', size: 8,  color: 'rgba(180,100,255,0.2)'},
];

/* ─── Spotlight cursor ──────────────────────────────────────── */
function Spotlight({ sectionRef }: { sectionRef: React.RefObject<HTMLElement | null> }) {
  const x = useMotionValue(-9999);
  const y = useMotionValue(-9999);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      if (e.clientX >= rect.left && e.clientX <= rect.right &&
          e.clientY >= rect.top  && e.clientY <= rect.bottom) {
        x.set(e.clientX - rect.left);
        y.set(e.clientY - rect.top);
      } else {
        x.set(-9999); y.set(-9999);
      }
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [x, y, sectionRef]);

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-0"
      style={{
        background: useTransform(
          [x, y],
          ([mx, my]) =>
            `radial-gradient(500px circle at ${mx}px ${my}px, rgba(255,153,0,0.06) 0%, transparent 70%)`
        ),
      }}
    />
  );
}

/* ─── Soft blobs ────────────────────────────────────────────── */
function Blobs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {/* warm peach/orange blob — top left */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 560, height: 560,
          top: '-20%', left: '-15%',
          background: 'radial-gradient(circle, rgba(255,180,80,0.28) 0%, rgba(255,140,40,0.12) 45%, transparent 70%)',
          filter: 'blur(80px)',
        }}
        animate={{ x: [0, 40, 0], y: [0, 30, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* soft lavender blob — bottom right */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 480, height: 480,
          bottom: '-15%', right: '-12%',
          background: 'radial-gradient(circle, rgba(180,130,255,0.22) 0%, rgba(140,90,240,0.08) 50%, transparent 70%)',
          filter: 'blur(75px)',
        }}
        animate={{ x: [0, -30, 0], y: [0, -25, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
      />
      {/* faint gold center */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 300, height: 300,
          top: '35%', left: '42%',
          background: 'radial-gradient(circle, rgba(255,210,80,0.1) 0%, transparent 65%)',
          filter: 'blur(50px)',
        }}
        animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 7 }}
      />
    </div>
  );
}

/* ─── Scattered decorative shapes ──────────────────────────── */
function DecorShapes() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      {SHAPES.map((s, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: s.x, top: s.y }}
          animate={{ y: [0, -8, 0], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
        >
          {s.type === 'dot' && (
            <div style={{ width: s.size, height: s.size, borderRadius: '50%', background: s.color }} />
          )}
          {s.type === 'ring' && (
            <div style={{
              width: s.size, height: s.size, borderRadius: '50%',
              border: `2px solid ${s.color}`, background: 'transparent',
            }} />
          )}
          {s.type === 'plus' && (
            <svg width={s.size} height={s.size} viewBox="0 0 12 12">
              <line x1="6" y1="1" x2="6" y2="11" stroke={s.color} strokeWidth="2" strokeLinecap="round" />
              <line x1="1" y1="6" x2="11" y2="6" stroke={s.color} strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Heading ───────────────────────────────────────────────── */
function Heading({ isInView }: { isInView: boolean }) {
  const shadow3dDark = [
    '0 1px 0 #888','0 2px 0 #777','0 3px 0 #666',
    '0 4px 0 #555','0 5px 0 #444',
    '0 8px 18px rgba(0,0,0,0.18)','0 16px 36px rgba(0,0,0,0.1)',
  ].join(', ');

  const shadow3dBig = [
    '0 1px 0 #999','0 2px 0 #888','0 3px 0 #777',
    '0 4px 0 #666','0 5px 0 #555','0 6px 0 #444',
    '0 7px 0 #333',
    '0 10px 22px rgba(0,0,0,0.22)','0 20px 40px rgba(0,0,0,0.12)',
  ].join(', ');

  const shadow3dOrange = [
    '0 1px 0 #c06000','0 2px 0 #a85400','0 3px 0 #904800',
    '0 4px 0 #783c00','0 5px 0 #603000',
    '0 8px 18px rgba(200,100,0,0.25)','0 0 40px rgba(255,153,0,0.2)',
  ].join(', ');

  return (
    <div className="text-center mb-8 select-none w-full">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Line 1: INDIA'S LARGEST */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-wrap items-baseline justify-center gap-x-4 leading-tight"
        >
          <span className="font-black" style={{
            fontSize: 'clamp(1.8rem, 4vw, 3.8rem)',
            letterSpacing: '-0.03em',
            color: '#1a1a2e',
            textShadow: shadow3dDark,
          }}>
            INDIA'S
          </span>
          <span className="font-black" style={{
            fontSize: 'clamp(1.8rem, 4vw, 3.8rem)',
            letterSpacing: '-0.03em',
            color: '#ff9900',
            textShadow: shadow3dOrange,
          }}>
            LARGEST
          </span>
        </motion.div>

        {/* Line 2: STUDENT — biggest */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.75, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex justify-center leading-tight"
        >
          {/* Curved underline */}
          <svg
            aria-hidden
            className="absolute pointer-events-none"
            style={{ bottom: '-2px', left: '50%', transform: 'translateX(-50%)', width: '55%', height: '10px' }}
            viewBox="0 0 400 10" preserveAspectRatio="none"
          >
            <path d="M 0 8 Q 200 0 400 8" fill="none" stroke="url(#arcGradLight)" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
            <defs>
              <linearGradient id="arcGradLight" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="30%" stopColor="#ff9900" />
                <stop offset="70%" stopColor="#ffcc00" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
          </svg>
          <span className="font-black" style={{
            fontSize: 'clamp(2.8rem, 7.5vw, 7rem)',
            letterSpacing: '-0.04em',
            color: '#1a1a2e',
            textShadow: shadow3dBig,
          }}>
            STUDENT
          </span>
        </motion.div>

        {/* Line 3: COMMUNITY */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="leading-tight"
        >
          <span className="font-black" style={{
            fontSize: 'clamp(1.8rem, 4.2vw, 4rem)',
            letterSpacing: '-0.03em',
            color: '#ff9900',
            textShadow: shadow3dOrange,
          }}>
            COMMUNITY
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ─── Magnetic button ───────────────────────────────────────── */
function MagneticButton({
  children, variant = 'primary', onClick, href,
}: {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  href?: string;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const x = useSpring(useMotionValue(0), { stiffness: 300, damping: 25 });
  const y = useSpring(useMotionValue(0), { stiffness: 300, damping: 25 });
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.3);
    y.set((e.clientY - rect.top  - rect.height / 2) * 0.3);
  };
  const handleMouseLeave = () => { x.set(0); y.set(0); };
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const id = Date.now();
    setRipples(r => [...r, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    setTimeout(() => setRipples(r => r.filter(rp => rp.id !== id)), 700);
    if (href) {
      // External links (http/https) open in new tab; internal links use router
      if (href.startsWith('http')) {
        window.open(href, '_blank', 'noopener,noreferrer');
      } else {
        router.push(href);
      }
    }
    onClick?.();
  };

  const isPrimary = variant === 'primary';

  return (
    <motion.button
      ref={ref}
      style={isPrimary ? {
        x, y,
        background: 'linear-gradient(135deg, #ff9900 0%, #ffb733 50%, #ff8800 100%)',
        color: '#fff',
        boxShadow: '0 4px 24px rgba(255,153,0,0.4), 0 1px 4px rgba(0,0,0,0.1)',
      } : {
        x, y,
        background: '#ffffff',
        color: '#1a1a2e',
        border: '1.5px solid #e0d8d0',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      whileHover={{ scale: 1.06, boxShadow: isPrimary ? '0 6px 32px rgba(255,153,0,0.55)' : '0 4px 20px rgba(0,0,0,0.12)' }}
      whileTap={{ scale: 0.94 }}
      className="relative overflow-hidden px-8 py-3.5 rounded-full font-black text-sm tracking-widest uppercase"
    >
      {children}
      <AnimatePresence>
        {ripples.map(rp => (
          <motion.span
            key={rp.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: rp.x, top: rp.y, x: '-50%', y: '-50%',
              background: isPrimary ? 'rgba(255,255,255,0.4)' : 'rgba(255,153,0,0.2)',
            }}
            initial={{ width: 0, height: 0, opacity: 0.8 }}
            animate={{ width: 260, height: 260, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>
    </motion.button>
  );
}

/* ─── Stats marquee ─────────────────────────────────────────── */
function StatsMarquee() {
  const items = [...STATS, ...STATS];
  return (
    <div className="relative overflow-hidden py-3.5 my-10"
      style={{
        background: 'rgba(255,153,0,0.05)',
        borderTop: '1px solid rgba(255,153,0,0.15)',
        borderBottom: '1px solid rgba(255,153,0,0.15)',
      }}>
      <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to right, #fdf8f3, transparent)' }} />
      <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to left, #fdf8f3, transparent)' }} />
      <motion.div
        className="flex gap-10 whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
      >
        {items.map((s, i) => (
          <span key={i} className="flex items-center gap-3 text-xs font-black tracking-widest uppercase">
            <span style={{ color: i % 2 === 0 ? '#ff9900' : '#1a1a2e99' }}>{s}</span>
            <span style={{ color: 'rgba(255,153,0,0.4)' }}>•</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ─── Main section ──────────────────────────────────────────── */
export default function CommunityShowcaseSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 });

  return (
    <>
      <style>{`
        @keyframes borderPulse {
          0%, 100% { opacity: 0.6; }
          50%       { opacity: 1; }
        }
      `}</style>

      <section
        ref={sectionRef}
        id="community"
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #fdf8f3 0%, #fef9f4 30%, #f8f4ff 65%, #fdf8f3 100%)',
        }}
      >
        <Spotlight sectionRef={sectionRef} />
        <Blobs />
        <DecorShapes />

        <div className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-6 text-center">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center mb-7"
          >
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase"
              style={{
                background: 'rgba(255,153,0,0.1)',
                border: '1px solid rgba(255,153,0,0.3)',
                color: '#cc7700',
                animation: 'borderPulse 3s ease infinite',
              }}
            >
              <motion.span
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 1.6, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full inline-block"
                style={{ background: '#ff9900' }}
              />
              India's #1 Student Platform
            </span>
          </motion.div>

          {/* Heading */}
          <Heading isInView={isInView} />

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed"
            style={{ fontSize: 'clamp(0.95rem, 1.8vw, 1.1rem)' }}
          >
            Join thousands of students{' '}
            <span style={{ color: '#1a1a2e', fontWeight: 700 }}>building careers</span>,{' '}
            mastering skills, and becoming{' '}
            <span style={{ color: '#ff9900', fontWeight: 700 }}>industry-ready</span>{' '}
            with Adyapan.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.48, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <MagneticButton variant="primary" href="https://chat.whatsapp.com/Gh5rXLLOZQOElaF1uR6Tua">
              Join Community
            </MagneticButton>
            <MagneticButton variant="secondary" href="/programs">
              Explore Programs
            </MagneticButton>
          </motion.div>
        </div>

        {/* Stats marquee */}
        <StatsMarquee />

        {/* Bottom accent line */}
        <div className="relative z-10 pb-16 flex justify-center">
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={isInView ? { scaleX: 1, opacity: 1 } : {}}
            transition={{ duration: 1.1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="h-px w-48"
            style={{
              background: 'linear-gradient(90deg, transparent, #ff9900, transparent)',
              boxShadow: '0 0 12px rgba(255,153,0,0.4)',
            }}
          />
        </div>
      </section>
    </>
  );
}
