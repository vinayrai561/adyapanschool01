/**
 * POST /api/auth/logout
 * Clears the authToken httpOnly cookie on all paths.
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(_request: NextRequest) {
  const res = NextResponse.json({ success: true, message: 'Logged out successfully' });

  // Expire the cookie — must set path:'/' to match how it was set
  res.cookies.set('authToken', '', {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge:   0,
    path:     '/',
  });

  return res;
}
