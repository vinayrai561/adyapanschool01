/**
 * Auth Middleware — JWT verification + RBAC
 * Supports httpOnly cookies.
 */

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be configured with at least 32 characters.');
}

/**
 * Verify JWT from the auth cookie.
 * Attaches decoded payload to req.user.
 */
function authenticate(req, res, next) {
  const token = req.cookies?.authToken || null;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized — no token provided' });
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired — please log in again' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
}

/**
 * Role-based access control.
 * Usage: authorize('ADMIN', 'SUPERADMIN')
 */
function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    // SUPERADMIN bypasses all role checks
    if (req.user.role === 'SUPERADMIN') return next();
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden — insufficient permissions' });
    }
    next();
  };
}

module.exports = { authenticate, authorize };
