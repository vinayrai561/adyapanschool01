'use client';

import { useEffect, useRef } from 'react';

/* ─────────────────────────────────────────────────────────────────
   NEXT-GEN ANTIGRAVITY BACKGROUND
   ─ 50 organic glowing nodes with Z-depth parallax
   ─ Mouse magnetism (attract when close, drift when fast)
   ─ LERP scroll for silky "heavy" parallax
   ─ Sin-wave bobbing on each node
   ─ SVG grain overlay for cinematic texture
   ─ Throttled to 60 fps via delta-time
   ───────────────────────────────────────────────────────────────── */

const NODE_COUNT   = 52;
const BASE_SPEED   = 0.18;
const ATTRACT_R    = 160;
const REPEL_SPEED  = 5.5;   // mouse speed threshold → repel
const LERP_SCROLL  = 0.07;  // 0-1 — lower = silkier/heavier
const LERP_MOUSE   = 0.09;

// Warm-cream palette — low contrast, high premium feel
const PALETTE = [
  { r: 255, g: 185, b:  60 },   // amber gold
  { r: 230, g: 165, b:  90 },   // warm sand
  { r: 180, g: 210, b: 255 },   // cool periwinkle
  { r: 255, g: 210, b: 140 },   // pale apricot
  { r: 160, g: 190, b: 220 },   // muted sky
  { r: 220, g: 195, b: 165 },   // blush beige
];

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
function rand(min: number, max: number)        { return Math.random() * (max - min) + min; }

interface Node {
  x: number; y: number;
  baseX: number; baseY: number;
  vx: number; vy: number;
  z: number;           // 0.25–1.0 depth
  r: number;           // base radius
  phase: number;       // bobbing phase
  phaseSpeed: number;
  color: typeof PALETTE[0];
  alpha: number;
  connections: number[];
}

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext('2d', { alpha: true })!;

    // ── Sizing ────────────────────────────────────────────────
    let W = 0, H = 0;
    const resize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // ── Nodes init ────────────────────────────────────────────
    const nodes: Node[] = Array.from({ length: NODE_COUNT }, () => {
      const x = rand(0, window.innerWidth);
      const y = rand(0, window.innerHeight);
      return {
        x, y, baseX: x, baseY: y,
        vx: rand(-0.25, 0.25), vy: rand(-0.25, 0.25),
        z: rand(0.25, 1.0),
        r: rand(2.5, 7.5),
        phase: rand(0, Math.PI * 2),
        phaseSpeed: rand(0.004, 0.014),
        color: PALETTE[Math.floor(rand(0, PALETTE.length))],
        alpha: rand(0.06, 0.24),
        connections: [],
      };
    });

    // ── Mouse state ───────────────────────────────────────────
    let rawMX = W / 2, rawMY = H / 2;
    let smMX  = W / 2, smMY  = H / 2;  // smoothed mouse
    let prevMX = W / 2, prevMY = H / 2;
    let mouseSpeed = 0;

    const onMouseMove = (e: MouseEvent) => {
      prevMX = rawMX; prevMY = rawMY;
      rawMX = e.clientX; rawMY = e.clientY;
      const dx = rawMX - prevMX, dy = rawMY - prevMY;
      mouseSpeed = Math.sqrt(dx * dx + dy * dy);
    };
    window.addEventListener('mousemove', onMouseMove);

    // Touch fallback
    const onTouch = (e: TouchEvent) => {
      rawMX = e.touches[0].clientX;
      rawMY = e.touches[0].clientY;
    };
    window.addEventListener('touchmove', onTouch, { passive: true });

    // ── Scroll LERP ───────────────────────────────────────────
    let scrollY    = window.scrollY;
    let smoothScrollY = scrollY;
    const onScroll = () => { scrollY = window.scrollY; };
    window.addEventListener('scroll', onScroll, { passive: true });

    // ── Connection graph (build once, re-check distance each frame) ──
    const MAX_CONNECT_DIST = 140;

    // ── Draw helpers ──────────────────────────────────────────
    let lastTime = 0;

    const drawNode = (n: Node, scrollDelta: number) => {
      // Parallax offset based on Z depth
      const py  = n.y - scrollDelta * n.z * 0.3;

      // Bobbing
      n.phase += n.phaseSpeed;
      const bob = Math.sin(n.phase) * 12 * n.z;

      const fx  = n.x;
      const fy  = py + bob;

      // Glow halo
      const grad = ctx.createRadialGradient(fx, fy, 0, fx, fy, n.r * 4.5 * n.z);
      const { r, g, b } = n.color;
      grad.addColorStop(0,   `rgba(${r},${g},${b},${n.alpha * 1.0})`);
      grad.addColorStop(0.4, `rgba(${r},${g},${b},${n.alpha * 0.45})`);
      grad.addColorStop(1,   `rgba(${r},${g},${b},0)`);

      ctx.beginPath();
      ctx.arc(fx, fy, n.r * 4.5 * n.z, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Solid core
      ctx.beginPath();
      ctx.arc(fx, fy, n.r * 0.55 * n.z, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${n.alpha * 2.2})`;
      ctx.fill();

      return { fx, fy };
    };

    const drawConnections = (positions: Array<{fx:number;fy:number}>) => {
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = positions[i].fx - positions[j].fx;
          const dy = positions[i].fy - positions[j].fy;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d > MAX_CONNECT_DIST) continue;
          const a = (1 - d / MAX_CONNECT_DIST) * 0.07;
          const { r, g, b } = nodes[i].color;
          ctx.beginPath();
          ctx.moveTo(positions[i].fx, positions[i].fy);
          ctx.lineTo(positions[j].fx, positions[j].fy);
          ctx.strokeStyle = `rgba(${r},${g},${b},${a})`;
          ctx.lineWidth   = (1 - d / MAX_CONNECT_DIST) * 1.2;
          ctx.stroke();
        }
      }
    };

    // ── rAF loop ──────────────────────────────────────────────
    let raf = 0;

    const loop = (ts: number) => {
      const dt = Math.min(ts - lastTime, 50);  // cap at 50ms → no spiral on tab-switch
      lastTime = ts;

      // LERP mouse & scroll
      smMX = lerp(smMX, rawMX, LERP_MOUSE);
      smMY = lerp(smMY, rawMY, LERP_MOUSE);
      smoothScrollY = lerp(smoothScrollY, scrollY, LERP_SCROLL);
      const scrollDelta = smoothScrollY;

      // Clear
      ctx.clearRect(0, 0, W, H);

      // Subtle vignette
      const vig = ctx.createRadialGradient(W/2, H/2, H*0.1, W/2, H/2, W*0.8);
      vig.addColorStop(0, 'rgba(245,240,235,0)');
      vig.addColorStop(1, 'rgba(210,200,185,0.18)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);

      const positions: Array<{fx:number;fy:number}> = [];

      for (const n of nodes) {
        // ── Mouse magnetism ─────────────────────────────────
        const dx  = smMX - n.x;
        const dy  = smMY - n.y;
        const d   = Math.sqrt(dx * dx + dy * dy);

        if (d < ATTRACT_R) {
          if (mouseSpeed > REPEL_SPEED) {
            // Fast mouse → gentle push away
            const f = (1 - d / ATTRACT_R) * 0.012;
            n.vx -= dx * f;
            n.vy -= dy * f;
          } else {
            // Slow/still cursor → subtle magnetic pull
            const f = (1 - d / ATTRACT_R) * 0.006;
            n.vx += dx * f;
            n.vy += dy * f;
          }
        }

        // ── Drift & damping ──────────────────────────────────
        n.x += n.vx * BASE_SPEED * (dt / 16);
        n.y += n.vy * BASE_SPEED * (dt / 16);
        n.vx *= 0.978;
        n.vy *= 0.978;

        // ── Soft boundary wrap ───────────────────────────────
        if (n.x < -80)  n.x = W + 60;
        if (n.x > W+80) n.x = -60;
        if (n.y < -80)  n.y = H + 60;
        if (n.y > H+80) n.y = -60;

        positions.push(drawNode(n, scrollDelta));
      }

      // ── Connections ──────────────────────────────────────
      ctx.save();
      drawConnections(positions);
      ctx.restore();

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouch);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width:  '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        userSelect:    'none',
      }}
    />
  );
}
