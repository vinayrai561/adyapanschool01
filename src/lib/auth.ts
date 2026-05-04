import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export interface DecodedToken {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

/**
 * Verify JWT token from request
 */
export function verifyToken(token: string): DecodedToken | null {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key'
    ) as DecodedToken;
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Get token from request (from cookies or Authorization header)
 */
export function getTokenFromRequest(request: NextRequest): string | null {
  // Try to get from cookie first
  const cookieToken = request.cookies.get('authToken')?.value;
  if (cookieToken) {
    return cookieToken;
  }

  // Try to get from Authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  return null;
}

/**
 * Middleware to protect API routes
 * Usage: const decoded = protectRoute(request);
 */
export function protectRoute(request: NextRequest): DecodedToken | NextResponse {
  const token = getTokenFromRequest(request);

  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized - No token provided' },
      { status: 401 }
    );
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return NextResponse.json(
      { error: 'Unauthorized - Invalid or expired token' },
      { status: 401 }
    );
  }

  return decoded;
}

/**
 * Middleware to protect routes by role
 */
export function protectRouteByRole(
  request: NextRequest,
  allowedRoles: string[]
): DecodedToken | NextResponse {
  const result = protectRoute(request);

  if (result instanceof NextResponse) {
    return result;
  }

  if (!allowedRoles.includes(result.role)) {
    return NextResponse.json(
      { error: 'Forbidden - Insufficient permissions' },
      { status: 403 }
    );
  }

  return result;
}
