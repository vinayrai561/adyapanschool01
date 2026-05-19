'use client';

import { useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/* ─── Types ──────────────────────────────────────────────────────────────── */
interface MarqueeBannerProps {
  /** The text to repeat in the marquee. Defaults to "INDIA'S LARGEST STUDENT COMMUNITY" */
  text?: string;
  /** Scroll speed in seconds for one full cycle. Lower = faster. Default: 30 */
  speed?: number;
  /** Visual variant. Default: 'dark' */
  variant?: 'dark' | 'orange' | 'glass';
}

/* ─── Separator icon between repeated text items ─────────────────────────── */
const Separator = () => (
  <span
    aria-hidden="true"
    className="mx-6 text-[#ffa800] opacity-80 select-none"
    style={{ fontSize: 'inherit', lineHeight: 1 }}
  >
    ✦
  </span>
);

/* ─── Single marquee track (one seamless loop) ───────────────────────────── */
function MarqueeTrack({
  text,
  speed,
  variant,
}: {
  text: string;
  speed: number;
  variant: 'dark' | 'orange' | 'glass';
}) {
  const shouldReduceMotion = useReducedMotion();

  // Duplicate enough times so the loop is seamless at any viewport width
  const REPEAT = 8;
  const items = Array.from({ length: REPEAT }, (_, i) => i);

  /* ── Text colour per variant ── */
  const textStyle: React.CSSProperties =
    variant === 'orange'
      ? {
          background: 'linear-gradient(90deg, #fff 0%, #ffe0a0 40%, #ffa800 70%, #fff 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textShadow: 'none',
        }
      : {
          background: 'linear-gradient(90deg, #ffffff 0%, #ffe0a0 45%, #ffa800 75%, #ffffff 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textShadow: 'none',
        };

  return (
    <div
      className="overflow-hidden w-full"
      style={{ willChange: 'transform' }}
    >
      <motion.div
        className="flex items-center whitespace-nowrap"
        style={{ width: 'max-content' }}
        animate={shouldReduceMotion ? {} : { x: ['0%', '-50%'] }}
        transition={
          shouldReduceMotion
            ? {}
            : {
                duration: speed,
                repeat: Infinity,
                ease: 'linear',
                repeatType: 'loop',
              }
        }
        /* Pause on hover (desktop) */
        whileHover={{ animationPlayState: 'paused' }}
      >
        {items.map((i) => (
          <span key={i} className="inline-flex items-center">
            <span
              className="
                text-sm sm:text-base md:text-lg lg:text-xl
                font-black uppercase tracking-[0.18em]
                select-none
              "
              style={textStyle}
            >
              {text}
            </span>
            <Separator />
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ─── Background styles per variant ─────────────────────────────────────── */
function getBgStyle(variant: 'dark' | 'orange' | 'glass'): React.CSSProperties {
  if (variant === 'orange') {
    return {
      background: 'linear-gradient(135deg, #ff8c00 0%, #ffa800 40%, #ff6b00 100%)',
      borderTop: '1px solid rgba(255,255,255,0.15)',
      borderBottom: '1px solid rgba(255,255,255,0.15)',
    };
  }
  if (variant === 'glass') {
    return {
      background: 'rgba(26, 26, 46, 0.82)',
      backdropFilter: 'blur(16px) saturate(1.4)',
      WebkitBackdropFilter: 'blur(16px) saturate(1.4)',
      borderTop: '1px solid rgba(255,168,0,0.25)',
      borderBottom: '1px solid rgba(255,168,0,0.25)',
    };
  }
  // dark (default)
  return {
    background: 'linear-gradient(135deg, #0d0d1a 0%, #1a1a2e 50%, #0d0d1a 100%)',
    borderTop: '1px solid rgba(255,168,0,0.2)',
    borderBottom: '1px solid rgba(255,168,0,0.2)',
  };
}

/* ─── Main exported component ────────────────────────────────────────────── */
export default function MarqueeBanner({
  text = "INDIA'S LARGEST STUDENT COMMUNITY",
  speed = 30,
  variant = 'dark',
}: MarqueeBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      role="marquee"
      aria-label={text}
      className="relative w-full overflow-hidden py-3 sm:py-3.5 md:py-4 group"
      style={{
        ...getBgStyle(variant),
        /* Subtle glow line on top */
        boxShadow:
          variant === 'dark' || variant === 'glass'
            ? '0 0 24px 0 rgba(255,168,0,0.12), inset 0 1px 0 rgba(255,168,0,0.08)'
            : '0 4px 24px 0 rgba(255,140,0,0.35)',
      }}
    >
      {/* Left fade mask */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-24 z-10"
        style={{
          background:
            variant === 'orange'
              ? 'linear-gradient(90deg, #ff8c00, transparent)'
              : variant === 'glass'
              ? 'linear-gradient(90deg, rgba(13,13,26,0.9), transparent)'
              : 'linear-gradient(90deg, #0d0d1a, transparent)',
        }}
      />
      {/* Right fade mask */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-24 z-10"
        style={{
          background:
            variant === 'orange'
              ? 'linear-gradient(270deg, #ff6b00, transparent)'
              : variant === 'glass'
              ? 'linear-gradient(270deg, rgba(13,13,26,0.9), transparent)'
              : 'linear-gradient(270deg, #0d0d1a, transparent)',
        }}
      />

      {/* The scrolling track — pause on hover via CSS group trick */}
      <div className="[&>div>div]:group-hover:[animation-play-state:paused]">
        <MarqueeTrack text={text} speed={speed} variant={variant} />
      </div>
    </div>
  );
}
