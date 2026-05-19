import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { requireJwtSecret } from '@/lib/security';

export interface DecodedToken {
  userId: string;
  email: string;
  role: string;
  name?: string;
  iat: number;
  exp: number;
}

export function verifyToken(token: string): DecodedToken | null {
  try {
    return jwt.verify(token, requireJwtSecret()) as DecodedToken;
  } catch {
    return null;
  }
}

export function getTokenFromRequest(request: NextRequest): string | null {
  const cookieToken = request.cookies.get('authToken')?.value;
  if (cookieToken) return cookieToken;
  return null;
}

export function protectRoute(request: NextRequest): DecodedToken | NextResponse {
  const token = getTokenFromRequest(request);
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized — no token' }, { status: 401 });
  }
  const decoded = verifyToken(token);
  if (!decoded) {
    return NextResponse.json({ error: 'Unauthorized — invalid or expired token' }, { status: 401 });
  }
  return decoded;
}

/**
 * Protect a route by allowed roles.
 * SUPERADMIN implicitly passes ALL role checks (they can do everything).
 */
export function protectRouteByRole(
  request: NextRequest,
  allowedRoles: string[]
): DecodedToken | NextResponse {
  const result = protectRoute(request);
  if (result instanceof NextResponse) return result;

  // SUPERADMIN bypasses all role restrictions
  if (result.role === 'SUPERADMIN') return result;

  if (!allowedRoles.includes(result.role)) {
    return NextResponse.json({ error: 'Forbidden — insufficient permissions' }, { status: 403 });
  }
  return result;
}

/**
 * Strict superadmin-only check — does NOT allow ADMIN.
 */
export function requireSuperAdmin(request: NextRequest): DecodedToken | NextResponse {
  const result = protectRoute(request);
  if (result instanceof NextResponse) return result;
  if (result.role !== 'SUPERADMIN') {
    return NextResponse.json({ error: 'Forbidden — superadmin access required' }, { status: 403 });
  }
  return result;
}
