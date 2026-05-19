/**
 * Next.js 16 Proxy — Route Protection
 * (Renamed from middleware.ts as required by Next.js 16)
 *
 * Uses native Web Crypto (no external deps) to verify JWT.
 * Runs on Node.js runtime by default in Next.js 16.
 *
 * Protected routes:
 *  /admin/*         → ADMIN or SUPERADMIN only
 *  /organization/*  → COMPANY, ADMIN, or SUPERADMIN
 *  /company/*       → COMPANY, ADMIN, or SUPERADMIN only (recruiter features)
 *  /dashboard/*     → any authenticated user
 *
 * Always public:
 *  /admin/login
 *  /organization/login
 *  /auth/*
 *  /api/auth/*
 *  /api/organization/login
 *  /company (landing page - public)
 */

import { NextRequest, NextResponse } from 'next/server';

function b64urlDecode(str: string): Uint8Array {
  const b64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b64);
  return Uint8Array.from(bin, c => c.charCodeAt(0));
}

async function verifyJWT(token: string, secret: string): Promise<Record<string, unknown> | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [headerB64, payloadB64, sigB64] = parts;

    const keyData = new TextEncoder().encode(secret);
    const key = await crypto.subtle.importKey(
      'raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']
    );

    const data       = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
    const sigBytes   = b64urlDecode(sigB64);
    const signature  = sigBytes.buffer.slice(sigBytes.byteOffset, sigBytes.byteOffset + sigBytes.byteLength) as ArrayBuffer;
    const dataBuffer = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) as ArrayBuffer;
    const valid      = await crypto.subtle.verify('HMAC', key, signature, dataBuffer);
    if (!valid) return null;

    const payload = JSON.parse(new TextDecoder().decode(b64urlDecode(payloadB64)));
    if (payload.exp && Date.now() / 1000 > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

async function getRole(request: NextRequest): Promise<string | null> {
  const token = request.cookies.get('authToken')?.value;
  if (!token) return null;
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32 || secret.includes('fallback') || secret.includes('your_')) {
    return null;
  }
  const payload = await verifyJWT(token, secret);
  return (payload?.role as string) ?? null;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /* ── Always-public paths ── */
  const PUBLIC = [
    '/admin/login',
    '/organization/login',
    '/auth',
    '/api/auth/',
    '/api/organization/login',
    '/company', // Landing page is public
  ];
  if (PUBLIC.some(p => pathname === p || pathname.startsWith(p))) {
    return NextResponse.next();
  }

  /* ── /admin/* — ADMIN or SUPERADMIN only ── */
  if (pathname.startsWith('/admin')) {
    const role = await getRole(request);
    if (!role || !['ADMIN', 'SUPERADMIN'].includes(role)) {
      const url = new URL('/admin/login', request.url);
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  /* ── /organization/* — COMPANY, ADMIN, or SUPERADMIN ── */
  if (pathname.startsWith('/organization')) {
    const role = await getRole(request);
    if (!role || !['COMPANY', 'ADMIN', 'SUPERADMIN'].includes(role)) {
      const url = new URL('/organization/login', request.url);
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  /* ── /company/* (except landing page) — COMPANY, ADMIN, or SUPERADMIN only ── */
  if (pathname.startsWith('/company/')) {
    const role = await getRole(request);
    if (!role || !['COMPANY', 'ADMIN', 'SUPERADMIN'].includes(role)) {
      const url = new URL('/auth', request.url);
      url.searchParams.set('error', 'access_denied');
      url.searchParams.set('message', 'Only recruiters and admins can access this page');
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  /* ── /dashboard/* — any authenticated user ── */
  if (pathname.startsWith('/dashboard')) {
    const role = await getRole(request);
    if (!role) {
      return NextResponse.redirect(new URL('/auth', request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/organization/:path*',
    '/company/:path*',
    '/dashboard/:path*',
  ],
};
