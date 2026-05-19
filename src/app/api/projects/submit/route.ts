/**
 * POST /api/projects/submit
 * Alias → delegates to /api/project-payment/verify
 * Kept for backward compatibility with any frontend calling this path.
 */
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  // Forward to the canonical project-payment verify endpoint
  const body = await req.text();
  const url  = new URL('/api/project-payment/verify', req.url);
  return fetch(url.toString(), {
    method:  'POST',
    headers: { 'Content-Type': 'application/json', cookie: req.headers.get('cookie') || '' },
    body,
  }).then(r => r.json()).then(data => NextResponse.json(data));
}
