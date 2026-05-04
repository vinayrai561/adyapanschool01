'use client';

import { useEffect, useRef } from 'react';

// ─────────────────────────────────────────────────────────────
// JugglerMascot – canvas-drawn character (bottom-left, fixed)
// Ball shoots across the FULL viewport on any click.
// ─────────────────────────────────────────────────────────────
export default function JugglerMascot() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hintRef   = useRef<HTMLDivElement>(null); // kept for compat, unused

  useEffect(() => {
    const canvas = canvasRef.current!;
    const hint   = hintRef.current!;
    const ctx    = canvas.getContext('2d')!;

    // ── Sizing ─────────────────────────────────────────────
    const W = 220, H = 340;
    canvas.width  = W;
    canvas.height = H;

    // ── State ──────────────────────────────────────────────
    let mx = W / 2, my = H / 2;   // mouse relative to CANVAS
    let time = 0;
    let spin = 0;

    // Ball – juggling
    let juggling  = true;
    let juggleT   = 0;
    let ballX     = 0, ballY = 0;

    // Ball – free flight (full-viewport coords)
    let free       = false;
    let ballVX     = 0, ballVY = 0;
    let trailPts: Array<{x:number;y:number}> = [];

    const GRAVITY = 0.38;
    const BOUNCE  = 0.55;
    const FRICTION = 0.985;

    // Character centre inside canvas
    const CC = { x: W * 0.52, y: H * 0.42 };

    // ── Mouse tracking (over the ENTIRE window) ────────────
    const onMouseMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      // Map global mouse to canvas-local coords for head/eye tracking
      mx = e.clientX - r.left;
      my = e.clientY - r.top;
    };
    window.addEventListener('mousemove', onMouseMove);

    // ── Click to shoot (anywhere on page) ─────────────────
    const onClick = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();

      // Ball starts near character's foot (in viewport coords)
      const startX = r.left + CC.x - 28;
      const startY = r.top  + CC.y + 155;

      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const speed = Math.min(Math.max(dist * 0.12, 10), 28);

      ballX  = startX;
      ballY  = startY;
      ballVX = (dx / dist) * speed;
      ballVY = (dy / dist) * speed - 5;
      trailPts = [];
      free     = true;
      juggling = false;

      // Ripple at click
      const rpl = document.createElement('div');
      rpl.style.cssText = `
        position:fixed;left:${e.clientX - 18}px;top:${e.clientY - 18}px;
        width:36px;height:36px;border-radius:50%;
        border:2.5px solid #f90;pointer-events:none;z-index:99999;
        animation:_ady_ripple .5s ease-out forwards;
      `;
      document.body.appendChild(rpl);
      setTimeout(() => rpl.remove(), 550);
    };
    window.addEventListener('click', onClick);

    // ── Draw helpers ────────────────────────────────────────
    const s = Math.min(W, H) / 320; // scale factor

    function drawShadow(x:number, y:number, w:number, h:number, a:number) {
      ctx.save();
      ctx.globalAlpha = a;
      ctx.fillStyle   = '#000';
      ctx.beginPath();
      ctx.ellipse(x, y, w, h, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function drawBody(cx:number, cy:number) {
      // Ground shadow
      drawShadow(cx, cy + 175*s, 48*s, 10*s, 0.15);

      // ── Legs ──────────────────────────────────────────────
      const kickBob = Math.sin(time * 2) * 3 * s;

      // Right leg
      ctx.save();
      ctx.strokeStyle = '#2a2d3e'; ctx.lineWidth = 18*s; ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(cx + 10*s, cy + 65*s);
      ctx.quadraticCurveTo(cx + 16*s, cy + 115*s, cx + 14*s, cy + 170*s);
      ctx.stroke();
      // Rip accent
      ctx.strokeStyle = '#3a3f55'; ctx.lineWidth = 2.5*s;
      ctx.beginPath(); ctx.moveTo(cx+11*s,cy+130*s); ctx.lineTo(cx+18*s,cy+132*s); ctx.stroke();
      // Right shoe
      ctx.fillStyle='#c97b30';
      ctx.beginPath(); ctx.ellipse(cx+18*s,cy+175*s,18*s,8*s,-0.15,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#fff';
      ctx.beginPath(); ctx.ellipse(cx+18*s,cy+173*s,16*s,6*s,-0.15,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle='#c97b30'; ctx.lineWidth=2*s;
      ctx.beginPath(); ctx.moveTo(cx+6*s,cy+172*s); ctx.quadraticCurveTo(cx+16*s,cy+177*s,cx+28*s,cy+169*s); ctx.stroke();
      ctx.restore();

      // Left leg (kicking)
      ctx.save();
      ctx.strokeStyle = '#2a2d3e'; ctx.lineWidth = 18*s; ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(cx - 10*s, cy + 65*s);
      ctx.quadraticCurveTo(cx - 28*s, cy + 115*s, cx - 42*s + kickBob, cy + 150*s);
      ctx.stroke();
      ctx.strokeStyle='#3a3f55'; ctx.lineWidth=2.5*s;
      ctx.beginPath(); ctx.moveTo(cx-24*s,cy+125*s); ctx.lineTo(cx-14*s,cy+127*s); ctx.stroke();
      // Left shoe
      ctx.fillStyle='#c97b30';
      ctx.beginPath(); ctx.ellipse(cx-46*s+kickBob,cy+157*s,16*s,7*s,0.3,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#fff';
      ctx.beginPath(); ctx.ellipse(cx-46*s+kickBob,cy+155*s,14*s,5*s,0.3,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle='#c97b30'; ctx.lineWidth=2*s;
      ctx.beginPath(); ctx.moveTo(cx-55*s+kickBob,cy+153*s); ctx.quadraticCurveTo(cx-43*s+kickBob,cy+158*s,cx-33*s+kickBob,cy+151*s); ctx.stroke();
      ctx.restore();

      // ── Torso ─────────────────────────────────────────────
      ctx.fillStyle='#1e1e1e';
      ctx.beginPath(); ctx.roundRect(cx-28*s,cy+8*s,56*s,60*s,4*s); ctx.fill();

      // Denim jacket
      ctx.fillStyle='#5a7fa0';
      ctx.beginPath();
      ctx.moveTo(cx-36*s,cy+8*s); ctx.lineTo(cx+36*s,cy+8*s);
      ctx.lineTo(cx+40*s,cy+68*s); ctx.lineTo(cx-40*s,cy+68*s); ctx.closePath();
      ctx.fill();
      // Lapels
      ctx.fillStyle='#4a6f8f';
      ctx.beginPath(); ctx.moveTo(cx-8*s,cy+8*s); ctx.lineTo(cx-24*s,cy+32*s); ctx.lineTo(cx-4*s,cy+40*s); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(cx+8*s,cy+8*s); ctx.lineTo(cx+24*s,cy+32*s); ctx.lineTo(cx+4*s,cy+40*s); ctx.closePath(); ctx.fill();
      // ady. patch
      ctx.fillStyle='#fff'; ctx.fillRect(cx+4*s,cy+14*s,24*s,11*s);
      ctx.fillStyle='#1a1a2e'; ctx.font=`bold ${7*s}px sans-serif`; ctx.textAlign='center';
      ctx.fillText('ady.',cx+16*s,cy+23*s);
      // Jacket rips
      ctx.strokeStyle='#7a9fba'; ctx.lineWidth=1.5*s;
      ctx.beginPath(); ctx.moveTo(cx-32*s,cy+20*s); ctx.lineTo(cx-22*s,cy+22*s); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx+30*s,cy+28*s); ctx.lineTo(cx+22*s,cy+30*s); ctx.stroke();

      // ── Arms ──────────────────────────────────────────────
      // Right (thumbs up)
      ctx.save();
      ctx.strokeStyle='#5a7fa0'; ctx.lineWidth=16*s; ctx.lineCap='round';
      ctx.beginPath();
      ctx.moveTo(cx+36*s,cy+16*s); ctx.quadraticCurveTo(cx+64*s,cy+16*s,cx+68*s,cy-8*s); ctx.stroke();
      ctx.fillStyle='#f5c5a3';
      ctx.beginPath(); ctx.ellipse(cx+70*s,cy-14*s,10*s,13*s,-0.3,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx+74*s,cy-24*s,5*s,11*s,0.2,0,Math.PI*2); ctx.fill();
      ctx.restore();
      // Left (hip)
      ctx.save();
      ctx.strokeStyle='#5a7fa0'; ctx.lineWidth=16*s; ctx.lineCap='round';
      ctx.beginPath();
      ctx.moveTo(cx-36*s,cy+16*s); ctx.quadraticCurveTo(cx-56*s,cy+32*s,cx-52*s,cy+58*s); ctx.stroke();
      ctx.fillStyle='#f5c5a3';
      ctx.beginPath(); ctx.ellipse(cx-53*s,cy+64*s,9*s,7*s,0.4,0,Math.PI*2); ctx.fill();
      ctx.restore();

      // ── Neck ──────────────────────────────────────────────
      ctx.fillStyle='#f5c5a3';
      ctx.beginPath(); ctx.roundRect(cx-6*s,cy-10*s,13*s,18*s,3*s); ctx.fill();
      ctx.strokeStyle='#d4a50a'; ctx.lineWidth=1.5*s;
      ctx.beginPath(); ctx.arc(cx,cy+5*s,10*s,Math.PI*0.1,Math.PI*0.9); ctx.stroke();
      ctx.fillStyle='#d4a50a';
      ctx.beginPath(); ctx.roundRect(cx-3*s,cy+12*s,6*s,6*s,1.5*s); ctx.fill();
    }

    function drawHead(cx:number, cy:number) {
      const dx  = mx - cx, dy2 = my - cy;
      const tiltX = Math.max(-0.16, Math.min(0.16, dx / (W * 0.7)));
      const tiltY = Math.max(-0.12, Math.min(0.12, dy2 / (H * 0.7)));
      const eyeFX = Math.max(-3.5*s, Math.min(3.5*s, dx/(W*0.18)*s));
      const eyeFY = Math.max(-2.5*s, Math.min(2.5*s, dy2/(H*0.18)*s));

      ctx.save();
      ctx.translate(cx + tiltX*16*s, cy - 24*s + tiltY*8*s);

      // Face
      ctx.fillStyle='#f5c5a3';
      ctx.beginPath(); ctx.ellipse(0,0,30*s,34*s,0,0,Math.PI*2); ctx.fill();

      // Ear
      ctx.fillStyle='#f0b890';
      ctx.beginPath(); ctx.ellipse(30*s,4*s,6*s,9*s,0,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#c0c0c0';
      ctx.beginPath(); ctx.arc(35*s,2*s,2*s,0,Math.PI*2); ctx.fill();

      // Hair sides (undercut)
      ctx.fillStyle='#5a3825';
      ctx.beginPath(); ctx.ellipse(-22*s,-8*s,11*s,24*s,-0.2,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(26*s,-8*s,10*s,22*s,0.2,0,Math.PI*2); ctx.fill();

      // Hair swoop
      ctx.fillStyle='#6b4226';
      ctx.beginPath();
      ctx.moveTo(-28*s,-22*s);
      ctx.quadraticCurveTo(-16*s,-52*s,4*s,-40*s);
      ctx.quadraticCurveTo(24*s,-30*s,22*s,-16*s);
      ctx.quadraticCurveTo(4*s,-36*s,-16*s,-24*s);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle='#8b5e3c';
      ctx.beginPath();
      ctx.moveTo(-8*s,-44*s); ctx.quadraticCurveTo(8*s,-50*s,16*s,-36*s);
      ctx.quadraticCurveTo(4*s,-44*s,-8*s,-44*s); ctx.fill();

      // Beanie
      ctx.fillStyle='#c8922a';
      ctx.beginPath(); ctx.ellipse(0,-32*s,29*s,8*s,0,0,Math.PI*2); ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-28*s,-32*s); ctx.quadraticCurveTo(-22*s,-63*s,0,-66*s);
      ctx.quadraticCurveTo(22*s,-63*s,28*s,-32*s); ctx.closePath(); ctx.fill();
      ctx.strokeStyle='#a07020'; ctx.lineWidth=2.5*s;
      ctx.beginPath(); ctx.moveTo(-24*s,-44*s); ctx.quadraticCurveTo(0,-48*s,24*s,-44*s); ctx.stroke();
      ctx.fillStyle='#fff'; ctx.fillRect(-10*s,-42*s,18*s,9*s);
      ctx.fillStyle='#8b5e10'; ctx.font=`bold ${6*s}px sans-serif`; ctx.textAlign='center';
      ctx.fillText('ady.',-1*s,-35*s);

      // Eyebrows
      ctx.strokeStyle='#4a2c10'; ctx.lineWidth=3*s; ctx.lineCap='round';
      ctx.beginPath(); ctx.moveTo(-18*s,-11*s); ctx.quadraticCurveTo(-10*s,-15*s,-3*s,-11*s); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(4*s,-13*s); ctx.quadraticCurveTo(13*s,-17*s,19*s,-13*s); ctx.stroke();

      // Eyes
      for (const [ex, sign] of [[-11*s,-1],[11*s,1]] as [number,number][]) {
        ctx.fillStyle='#fff';
        ctx.beginPath(); ctx.ellipse(ex,-4*s,9*s,7*s,0,0,Math.PI*2); ctx.fill();
        ctx.fillStyle='#4a2c10';
        ctx.beginPath(); ctx.arc(ex+eyeFX,-4*s+eyeFY,4*s,0,Math.PI*2); ctx.fill();
        ctx.fillStyle='#000';
        ctx.beginPath(); ctx.arc(ex+eyeFX,-4*s+eyeFY,2.5*s,0,Math.PI*2); ctx.fill();
        ctx.fillStyle='#fff';
        ctx.beginPath(); ctx.arc(ex+eyeFX+1.5*s,-5.5*s+eyeFY,1.2*s,0,Math.PI*2); ctx.fill();
      }

      // Nose
      ctx.strokeStyle='#e0a878'; ctx.lineWidth=1.5*s;
      ctx.beginPath(); ctx.moveTo(2*s,-1*s); ctx.quadraticCurveTo(5*s,6*s,2*s,8*s); ctx.stroke();

      // Smirk
      ctx.strokeStyle='#c0785a'; ctx.lineWidth=2*s; ctx.lineCap='round';
      ctx.beginPath(); ctx.moveTo(-10*s,14*s); ctx.quadraticCurveTo(1*s,22*s,14*s,14*s); ctx.stroke();

      // Blush
      ctx.fillStyle='rgba(255,140,100,0.16)';
      ctx.beginPath(); ctx.ellipse(-16*s,11*s,8*s,5*s,0,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(18*s,11*s,8*s,5*s,0,0,Math.PI*2); ctx.fill();

      ctx.restore();
    }

    function drawBall(bx:number, by:number, spin:number) {
      const r2 = 18*s;
      ctx.save();
      ctx.translate(bx, by); ctx.rotate(spin);
      const grad = ctx.createRadialGradient(-5*s,-5*s,2*s,0,0,r2);
      grad.addColorStop(0,'#ffcc44'); grad.addColorStop(0.6,'#f09820'); grad.addColorStop(1,'#c06810');
      ctx.fillStyle=grad;
      ctx.beginPath(); ctx.arc(0,0,r2,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#8b2000'; ctx.font=`bold ${6*s}px sans-serif`; ctx.textAlign='center';
      ctx.fillText('ady.',0,-1*s);
      ctx.font=`${4*s}px sans-serif`; ctx.fillText('ADYAPAN',0,6*s);
      ctx.fillStyle='rgba(255,255,220,0.35)';
      ctx.beginPath(); ctx.ellipse(-6*s,-6*s,5*s,4*s,-0.5,0,Math.PI*2); ctx.fill();
      ctx.restore();
    }

    // ── FREE-FLIGHT ball drawn on a full-viewport overlay canvas ──
    const vc = document.createElement('canvas');
    vc.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9002;';
    vc.width  = window.innerWidth;
    vc.height = window.innerHeight;
    document.body.appendChild(vc);
    const vctx = vc.getContext('2d')!;

    const onResize2 = () => { vc.width = window.innerWidth; vc.height = window.innerHeight; };
    window.addEventListener('resize', onResize2);

    // ── Main animation loop ──────────────────────────────────
    let raf = 0;
    let trailCanvas: Array<{x:number;y:number}> = [];

    const loop = () => {
      ctx.clearRect(0, 0, W, H);
      vctx.clearRect(0, 0, vc.width, vc.height);

      time += 0.04;
      const cx = CC.x, cy = CC.y;

      // Draw character (body then head for layering)
      drawBody(cx, cy);
      drawHead(cx, cy);

      if (juggling) {
        juggleT += 0.055;
        const jY = Math.abs(Math.sin(juggleT)) * (-65*s) + (cy + 140*s);
        const jX = cx - 40*s + Math.sin(juggleT * 0.5) * 8*s;
        spin += 0.07;
        drawBall(jX, jY, spin);
        const sa = 0.06 + (1 - Math.abs(Math.sin(juggleT))) * 0.10;
        drawShadow(jX, cy + 170*s, 14*s, 4*s, sa);
      }

      // Free flight – draw on viewport overlay canvas
      if (free) {
        ballVY += GRAVITY;
        ballVX *= FRICTION;
        ballX  += ballVX;
        ballY  += ballVY;
        spin   += ballVX * 0.06;

        const VW = vc.width, VH = vc.height;
        const br = 18 * s;

        // Walls
        if (ballX - br <= 0)    { ballX = br;      ballVX = Math.abs(ballVX) * BOUNCE; }
        if (ballX + br >= VW)   { ballX = VW - br; ballVX = -Math.abs(ballVX) * BOUNCE; }
        if (ballY - br <= 0)    { ballY = br;       ballVY = Math.abs(ballVY) * 0.4; }
        if (ballY + br >= VH)   {
          ballY  = VH - br;
          ballVY = -Math.abs(ballVY) * BOUNCE;
          ballVX *= 0.80;
          if (Math.abs(ballVY) < 1.5) {
            setTimeout(() => { free = false; juggling = true; juggleT = 0; trailCanvas = []; }, 400);
          }
        }

        trailCanvas.push({x: ballX, y: ballY});
        if (trailCanvas.length > 20) trailCanvas.shift();

        // Trail
        vctx.save();
        for (let i = 1; i < trailCanvas.length; i++) {
          const a = (i / trailCanvas.length) * 0.45;
          vctx.strokeStyle = `rgba(255,175,40,${a})`;
          vctx.lineWidth   = (i / trailCanvas.length) * 7;
          vctx.lineCap     = 'round';
          vctx.beginPath();
          vctx.moveTo(trailCanvas[i-1].x, trailCanvas[i-1].y);
          vctx.lineTo(trailCanvas[i].x,   trailCanvas[i].y);
          vctx.stroke();
        }
        vctx.restore();

        // Ball (viewport canvas)
        const r2 = br;
        vctx.save();
        vctx.translate(ballX, ballY); vctx.rotate(spin);
        const grad2 = vctx.createRadialGradient(-5,-5,2,0,0,r2);
        grad2.addColorStop(0,'#ffcc44'); grad2.addColorStop(0.6,'#f09820'); grad2.addColorStop(1,'#c06810');
        vctx.fillStyle = grad2;
        vctx.beginPath(); vctx.arc(0,0,r2,0,Math.PI*2); vctx.fill();
        vctx.fillStyle='#8b2000'; vctx.font=`bold 8px sans-serif`; vctx.textAlign='center';
        vctx.fillText('ady.',0,-1);
        vctx.font='5px sans-serif'; vctx.fillText('ADYAPAN',0,7);
        vctx.fillStyle='rgba(255,255,220,0.35)';
        vctx.beginPath(); vctx.ellipse(-6,-6,6,4,-0.5,0,Math.PI*2); vctx.fill();
        vctx.restore();
      }

      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('click', onClick);
      window.removeEventListener('resize', onResize2);
      vctx.clearRect(0, 0, vc.width, vc.height);
      vc.remove();
    };
  }, []);

  return (
    <>
      {/* Global keyframes */}
      <style>{`
        @keyframes _ady_ripple {
          0%   { transform:scale(0); opacity:1; }
          100% { transform:scale(3.5); opacity:0; }
        }
        @keyframes _ady_hint {
          0%,100% { opacity:1; transform:translateX(-50%) translateY(0); }
          50%      { opacity:.6; transform:translateX(-50%) translateY(-4px); }
        }
      `}</style>

      {/* Fixed mascot container – bottom-left, below navbar */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          zIndex: 9003,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
        aria-hidden="true"
      >
        <canvas
          ref={canvasRef}
          style={{
            display: 'block',
            filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.22))',
            cursor: 'crosshair',
            pointerEvents: 'none',
          }}
        />
      </div>
    </>
  );
}
