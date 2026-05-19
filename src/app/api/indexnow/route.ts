/**
 * IndexNow API Route — /api/indexnow
 * ─────────────────────────────────────────────────────────────────────────────
 * Submits one or more URLs to Bing (and other IndexNow-compatible engines)
 * for immediate crawling.
 *
 * POST /api/indexnow
 * Body: { urls: string[] }          — submit specific URLs
 *       { urls: [] }                — omit or send empty to submit full sitemap
 *
 * GET  /api/indexnow                — health check / manual trigger for all pages
 *
 * Protect this route with a secret header in production:
 *   Authorization: Bearer <INDEXNOW_SUBMIT_SECRET>
 */

import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://adyapan.com';
const INDEXNOW_KEY = process.env.INDEXNOW_KEY || '';
const SUBMIT_SECRET = process.env.INDEXNOW_SUBMIT_SECRET || '';

// All public pages to submit when no specific URLs are provided
const ALL_PUBLIC_URLS = [
  BASE_URL,
  `${BASE_URL}/programs`,
  `${BASE_URL}/about`,
  `${BASE_URL}/contact`,
  `${BASE_URL}/offline-services`,
  `${BASE_URL}/campus-ambassador`,
  `${BASE_URL}/gallery`,
  `${BASE_URL}/privacy`,
  `${BASE_URL}/terms`,
  `${BASE_URL}/jobs`,
  `${BASE_URL}/marketplace`,
];

interface IndexNowPayload {
  host: string;
  key: string;
  keyLocation: string;
  urlList: string[];
}

async function submitToIndexNow(urls: string[]): Promise<{ ok: boolean; status: number; body: string }> {
  if (!INDEXNOW_KEY) {
    return { ok: false, status: 500, body: 'INDEXNOW_KEY env variable is not set' };
  }

  const host = new URL(BASE_URL).hostname;

  const payload: IndexNowPayload = {
    host,
    key: INDEXNOW_KEY,
    keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
    urlList: urls,
  };

  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload),
  });

  const body = await res.text().catch(() => '');
  return { ok: res.ok, status: res.status, body };
}

// ── POST handler ──────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // Verify secret in production
  if (process.env.NODE_ENV === 'production' && SUBMIT_SECRET) {
    const auth = req.headers.get('authorization') || '';
    if (auth !== `Bearer ${SUBMIT_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  let urls: string[] = [];
  try {
    const body = await req.json();
    urls = Array.isArray(body?.urls) ? body.urls : [];
  } catch {
    // empty body is fine — submit all pages
  }

  if (urls.length === 0) {
    urls = ALL_PUBLIC_URLS;
  }

  // Validate URLs belong to our domain
  const validUrls = urls.filter((u) => {
    try {
      return new URL(u).hostname === new URL(BASE_URL).hostname;
    } catch {
      return false;
    }
  });

  if (validUrls.length === 0) {
    return NextResponse.json({ error: 'No valid URLs provided' }, { status: 400 });
  }

  const result = await submitToIndexNow(validUrls);

  return NextResponse.json(
    {
      submitted: validUrls.length,
      urls: validUrls,
      indexnow: { status: result.status, body: result.body },
    },
    { status: result.ok ? 200 : 502 }
  );
}

// ── GET handler (manual trigger / health check) ───────────────────────────────
export async function GET(req: NextRequest) {
  // Only allow in non-production or with secret
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get('secret');

  if (process.env.NODE_ENV === 'production' && secret !== SUBMIT_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const result = await submitToIndexNow(ALL_PUBLIC_URLS);

  return NextResponse.json({
    submitted: ALL_PUBLIC_URLS.length,
    urls: ALL_PUBLIC_URLS,
    indexnow: { status: result.status, body: result.body },
  });
}
