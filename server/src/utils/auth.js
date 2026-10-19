import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-hangerhome-luxury-jwt';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || (JWT_SECRET + '_refresh');

export const hash = (p) => bcrypt.hash(p, 10);
export const compare = (p, h) => bcrypt.compare(p, h || '');

export const token = (id, expiresIn = '7d') => jwt.sign({ id }, JWT_SECRET, { expiresIn });

export function generateTokens(user, rememberMe = false) {
  const accessExpiry = rememberMe ? '7d' : '1d';
  const refreshExpiry = rememberMe ? '30d' : '7d';

  const accessToken = jwt.sign(
    { id: String(user._id), role: user.role, email: user.email },
    JWT_SECRET,
    { expiresIn: accessExpiry }
  );

  const refreshToken = jwt.sign(
    { id: String(user._id), role: user.role },
    JWT_REFRESH_SECRET,
    { expiresIn: refreshExpiry }
  );

  return { accessToken, refreshToken };
}

export function verifyAccessToken(rawToken) {
  return jwt.verify(rawToken, JWT_SECRET);
}

export function verifyRefreshToken(rawToken) {
  return jwt.verify(rawToken, JWT_REFRESH_SECRET);
}

export function setAuthCookies(res, accessToken, refreshToken, rememberMe = false) {
  const maxAgeAccess = (rememberMe ? 7 : 1) * 24 * 60 * 60 * 1000;
  const maxAgeRefresh = (rememberMe ? 30 : 7) * 24 * 60 * 60 * 1000;
  const isProd = process.env.NODE_ENV === 'production';

  res.cookie('hh_access_token', accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: maxAgeAccess,
    path: '/',
  });

  if (refreshToken) {
    res.cookie('hh_refresh_token', refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: maxAgeRefresh,
      path: '/api/auth',
    });
  }
}

export function clearAuthCookies(res) {
  const isProd = process.env.NODE_ENV === 'production';
  const cookieOpts = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
  };
  res.clearCookie('hh_access_token', { ...cookieOpts, path: '/' });
  res.clearCookie('hh_refresh_token', { ...cookieOpts, path: '/api/auth' });
}

export const publicUser = (u) => {
  if (!u) return null;
  return {
    _id: String(u._id),
    id: String(u._id),
    name: u.name,
    email: u.email,
    phone: u.phone || '',
    role: u.role || 'customer',
    city: u.city || '',
    pincode: u.pincode || '',
    acceptedTerms: !!u.acceptedTerms,
    avatar: u.avatar || '',
    isBlocked: !!u.isBlocked,
    addresses: u.addresses || [],
    wishlist: (u.wishlist || []).map((w) => (w._id ? String(w._id) : String(w))),
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
  };
};
