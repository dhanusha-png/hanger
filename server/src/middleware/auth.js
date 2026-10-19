import { User } from '../models/index.js';
import { verifyAccessToken } from '../utils/auth.js';

/**
 * Extracts JWT token from httpOnly cookie or Authorization Bearer header
 */
function extractToken(req) {
  if (req.cookies && req.cookies.hh_access_token) {
    return req.cookies.hh_access_token;
  }
  const header = req.headers.authorization || '';
  if (header.startsWith('Bearer ')) {
    return header.slice(7).trim();
  }
  return null;
}

/**
 * Mandatory authentication guard
 */
export async function requireAuth(req, res, next) {
  try {
    const rawToken = extractToken(req);
    if (!rawToken) {
      return res.status(401).json({ message: 'Authentication required. Please sign in.' });
    }

    const payload = verifyAccessToken(rawToken);
    const user = await User.findById(payload.id).select('-passwordHash');

    if (!user) {
      return res.status(401).json({ message: 'Account no longer exists.' });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: 'This account has been suspended by an administrator.' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Session expired or invalid. Please sign in again.' });
  }
}

// Backward-compatibility alias
export const auth = requireAuth;

/**
 * Role-based authorization middleware factory
 * Example: requireRole('admin') or requireRole('admin', 'staff')
 */
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Forbidden: requires one of the following roles: [${roles.join(', ')}]`,
      });
    }

    next();
  };
}

// Convenience guards
export const admin = requireRole('admin');
export const staffOrAdmin = requireRole('admin', 'staff');

/**
 * Optional authentication: decodes user if token exists, but doesn't block guests
 */
export async function optionalAuth(req, _res, next) {
  try {
    const rawToken = extractToken(req);
    if (rawToken) {
      const payload = verifyAccessToken(rawToken);
      const user = await User.findById(payload.id).select('-passwordHash');
      if (user && !user.isBlocked) {
        req.user = user;
      }
    }
  } catch {}
  next();
}
