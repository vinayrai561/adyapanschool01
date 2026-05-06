'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

const KICK_DURATION_MS    = 1000;
const KICK_RELEASE_MS     = 160;
const BALL_DIAMETER_RATIO = 0.19;
const TOE_X               = 0.56;
const TOE_Y               = 0.90;

const ASSETS = {
  juggle:   '/mascot/assets/mascot_juggle.webm',
  juggleMp4:'/mascot/assets/mascot_juggle.mp4',
  kickPose: '/mascot/assets/mascot_kick.png',
  ball:     '/mascot/assets/ball_logo.png.png',
};

const clamp   = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const easeOut = (t: number) => 1 - (1 - t) ** 3;
const wait    = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

interface BallState {
  x: number; y: number;
  rot: number; scale: number;
  opacity: number; visible: boolean;
}

/* ── Remove white/near-white pixels from canvas ── */
function removeWhiteBg(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const id   = ctx.getImageData(0, 0, w, h);
  const data = id.data;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    if (r > 230 && g > 230 && b > 230) {
      data[i + 3] = 0;
    } else if (r > 200 && g > 200 && b > 200) {
      data[i + 3] = Math.round(((255 - (r + g + b) / 3) / 55) * 255);
    }
  }
  ctx.putImageData(id, 0, 0);
}

/* ── Pre-process a PNG image → canvas with white removed (cached) ── */
function processImage(src: string): Promise<HTMLCanvasElement> {
  return new Promise(resolve => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const c   = document.createElement('canvas');
      c.width   = img.naturalWidth;
      c.height  = img.naturalHeight;
      const ctx = c.getContext('2d', { willReadFrequently: true })!;
      ctx.drawImage(img, 0, 0);
      removeWhiteBg(ctx, c.width, c.height);
      resolve(c);
    };
    img.onerror = () => resolve(document.createElement('canvas'));
    img.src = src;
  });
}

// Caches
let kickPoseCache: HTMLCanvasElement | null = null;
let ballCache:     HTMLCanvasElement | null = null;

function getKickPoseCanvas(): Promise<HTMLCanvasElement> {
  if (kickPoseCache) return Promise.resolve(kickPoseCache);
  return processImage(ASSETS.kickPose).then(c => { kickPoseCache = c; return c; });
}

function getBallCanvas(): Promise<HTMLCanvasElement> {
  if (ballCache) return Promise.resolve(ballCache);
  return processImage(ASSETS.ball).then(c => { ballCache = c; return c; });
}

export default function Mascot() {
  const stageRef        = useRef<HTMLDivElement>(null);
  const shellRef        = useRef<HTMLDivElement>(null);
  const videoRef        = useRef<HTMLVideoElement>(null);
  const juggleCanvasRef = useRef<HTMLCanvasElement>(null);
  const kickCanvasRef   = useRef<HTMLCanvasElement>(null);
  // Ball canvas is always mounted (never conditionally rendered) so ref is always valid
  const ballCanvasRef   = useRef<HTMLCanvasElement>(null);
  const rafRef          = useRef<number>(0);

  const [kicking, setKicking] = useState(false);
  const [facing,  setFacing]  = useState<'left' | 'right'>('right');
  const [ball,    setBall]    = useState<BallState>({
    x: 0, y: 0, rot: 0, scale: 1, opacity: 0, visible: false,
  });
  const [mounted, setMounted] = useState(false);
  const [ballD,   setBallD]   = useState(48);

  const lockedRef = useRef(false);
  const aidRef    = useRef(0);

  /* ── Juggle video render loop ── */
  const startRenderLoop = useCallback(() => {
    const video  = videoRef.current;
    const canvas = juggleCanvasRef.current;
    if (!video || !canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    cancelAnimationFrame(rafRef.current);
    const draw = () => {
      if (video.readyState >= 2 && video.videoWidth > 0) {
        const w = video.videoWidth, h = video.videoHeight;
        if (canvas.width !== w)  canvas.width  = w;
        if (canvas.height !== h) canvas.height = h;
        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(video, 0, 0, w, h);
        removeWhiteBg(ctx, w, h);
      }
      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);
  }, []);

  /* ── Load juggle video ── */
  const loadVideo = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    // Try webm first (better browser support), fall back to mp4
    v.src   = ASSETS.juggle;
    v.loop  = true;
    v.muted = true;
    v.playsInline = true;
    v.load();
    v.play().catch(() => {
      // Fallback to mp4 if webm fails
      v.src = ASSETS.juggleMp4;
      v.load();
      v.play().catch(() => {});
    });
    v.addEventListener('playing', startRenderLoop, { once: true });
  }, [startRenderLoop]);

  /* ── Pre-load kick pose + ball on mount ── */
  useEffect(() => {
    loadVideo();
    getKickPoseCanvas();
    getBallCanvas();
    const t = setTimeout(() => setMounted(true), 500);
    return () => { clearTimeout(t); cancelAnimationFrame(rafRef.current); };
  }, [loadVideo]);

  /* ── Update ball diameter on resize ── */
  useEffect(() => {
    const update = () => {
      const stage = stageRef.current;
      if (stage) {
        setBallD(clamp(stage.clientWidth * BALL_DIAMETER_RATIO, 22, 120));
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  /* ── Draw kick pose onto kickCanvasRef ── */
  const showKickPose = useCallback(async () => {
    const src = await getKickPoseCanvas();
    const c   = kickCanvasRef.current;
    if (!c || !src.width) return;
    c.width  = src.width;
    c.height = src.height;
    const ctx = c.getContext('2d')!;
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.drawImage(src, 0, 0);
  }, []);

  /* ── Core animation handler — accepts viewport coords ── */
  const triggerKick = useCallback(async (clientX: number, clientY: number) => {
    if (lockedRef.current) return;
    lockedRef.current = true;

    const stage = stageRef.current;
    const shell = shellRef.current;
    if (!stage || !shell) { lockedRef.current = false; return; }

    const rect = stage.getBoundingClientRect();
    setFacing(clientX >= rect.left + rect.width / 2 ? 'right' : 'left');

    const sr    = shell.getBoundingClientRect();
    const toeVX = sr.left + shell.clientWidth  * TOE_X;
    const toeVY = sr.top  + shell.clientHeight * TOE_Y;

    // Stop juggle, show kick pose
    cancelAnimationFrame(rafRef.current);
    videoRef.current?.pause();
    await showKickPose();
    setKicking(true);

    await wait(KICK_RELEASE_MS);

    // Draw ball onto the always-mounted canvas
    const ballSrc = await getBallCanvas();
    const bc      = ballCanvasRef.current;
    if (bc && ballSrc.width) {
      bc.width  = ballSrc.width;
      bc.height = ballSrc.height;
      const bctx = bc.getContext('2d')!;
      bctx.clearRect(0, 0, bc.width, bc.height);
      bctx.drawImage(ballSrc, 0, 0);
    }

    // Animate ball
    const aid   = ++aidRef.current;
    const start = { x: toeVX, y: toeVY };
    const end   = { x: clientX, y: clientY };
    const dist  = Math.hypot(end.x - start.x, end.y - start.y);
    const dur   = clamp(520 + dist * 0.45, 520, 1100);
    const arc   = clamp(dist * 0.22, 55, 200);
    const dir   = end.x >= start.x ? 1 : -1;
    const t0    = performance.now();

    // Make ball visible at start position before animating
    setBall({ x: start.x, y: start.y, rot: 0, scale: 1, opacity: 1, visible: true });

    await new Promise<void>(resolve => {
      const step = (now: number) => {
        if (aid !== aidRef.current) { resolve(); return; }
        const t       = clamp((now - t0) / dur, 0, 1);
        const p       = easeOut(t);
        const x       = start.x + (end.x - start.x) * p;
        const y       = start.y + (end.y - start.y) * p - arc * 4 * p * (1 - p);
        const rot     = dir * (35 + p * 620);
        const scale   = 1 - p * 0.16;
        const opacity = t > 0.92 ? 1 - (t - 0.92) / 0.08 : 1;
        setBall({ x, y, rot, scale, opacity, visible: true });
        if (t < 1) { requestAnimationFrame(step); return; }
        setTimeout(() => { setBall(b => ({ ...b, visible: false })); resolve(); }, 140);
      };
      requestAnimationFrame(step);
    });

    await wait(KICK_DURATION_MS - KICK_RELEASE_MS);
    setKicking(false);
    loadVideo();
    lockedRef.current = false;
  }, [loadVideo, showKickPose]);

  /* ── Pointer event listener (handles mouse + touch + stylus) ── */
  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      // Ignore if the click is on an interactive element (buttons, links, inputs)
      const target = e.target as HTMLElement;
      if (target.closest('a, button, input, textarea, select, [role="button"]')) return;
      triggerKick(e.clientX, e.clientY);
    };
    window.addEventListener('pointerdown', onPointerDown);
    return () => window.removeEventListener('pointerdown', onPointerDown);
  }, [triggerKick]);

  return (
    <>
      {/* ── Mascot stage ── */}
      <div
        ref={stageRef}
        aria-hidden="true"
        style={{
          position:      'fixed',
          left:          'max(8px, env(safe-area-inset-left))',
          bottom:        'max(8px, env(safe-area-inset-bottom))',
          width:         'clamp(180px, 23vw, 300px)',
          aspectRatio:   '1/1',
          zIndex:        50,
          pointerEvents: 'none',
          opacity:        mounted ? 1 : 0,
          transition:    'opacity 0.5s ease',
        }}
      >
        <div
          ref={shellRef}
          style={{
            position:        'absolute',
            inset:           0,
            transform:       `scaleX(${facing === 'right' ? 1 : -1})`,
            transformOrigin: '52% 88%',
            transition:      'transform 180ms ease-out',
          }}
        >
          {/* Hidden source video */}
          <video ref={videoRef} playsInline muted loop style={{ display: 'none' }} />

          {/* Juggle canvas — white bg removed */}
          <canvas
            ref={juggleCanvasRef}
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'contain', objectPosition: 'center bottom',
              pointerEvents: 'none',
              display: kicking ? 'none' : 'block',
            }}
          />

          {/* Kick pose canvas — white bg removed */}
          <canvas
            ref={kickCanvasRef}
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'contain', objectPosition: 'center bottom',
              pointerEvents: 'none',
              display: kicking ? 'block' : 'none',
              animation: kicking
                ? 'mascot-kick-pop 1000ms cubic-bezier(0.25,0.9,0.35,1) both'
                : 'none',
            }}
          />
        </div>
      </div>

      {/* ── Flying ball — always mounted so ref is always valid ── */}
      <div
        aria-hidden="true"
        style={{
          position:      'fixed',
          zIndex:        60,
          width:         ballD,
          height:        ballD,
          left:          ball.x,
          top:           ball.y,
          transform:     `translate(-50%,-50%) rotate(${ball.rot}deg) scale(${ball.scale})`,
          opacity:        ball.visible ? ball.opacity : 0,
          pointerEvents: 'none',
          willChange:    'transform, opacity',
          // Hide visually when not in use but keep in DOM
          visibility:    ball.visible ? 'visible' : 'hidden',
        }}
      >
        <canvas
          ref={ballCanvasRef}
          style={{ width: '100%', height: '100%', display: 'block', objectFit: 'contain' }}
        />
      </div>

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes mascot-kick-pop {
          0%   { transform: translateY(0)    rotate(0deg);  }
          20%  { transform: translateY(4px)  rotate(-4deg); }
          48%  { transform: translateY(-7px) rotate(7deg);  }
          100% { transform: translateY(0)    rotate(0deg);  }
        }
      `}</style>
    </>
  );
}
