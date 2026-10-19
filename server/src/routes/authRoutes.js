import express from 'express';
import { User } from '../models/index.js';
import {
  hash,
  compare,
  generateTokens,
  setAuthCookies,
  clearAuthCookies,
  verifyRefreshToken,
  publicUser,
} from '../utils/auth.js';
import { requireAuth } from '../middleware/auth.js';
import { registerSchema, loginSchema, formatZodErrors } from '../utils/validation.js';
import { generateRandomToken, hashToken } from '../utils/security.js';
import { sendMail } from '../utils/mailer.js';
import { recordAudit } from '../utils/audit.js';

const router = express.Router();

// -------------------------------------------------------------
// POST /api/auth/register
// -------------------------------------------------------------
router.post('/register', async (req, res, next) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: 'Please resolve the validation errors.',
        errors: formatZodErrors(parsed.error),
      });
    }

    const { name, email, phone, password, city, pincode, acceptedTerms } = parsed.data;
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({
        message: 'An account with this email already exists.',
        errors: { email: 'Email is already registered' },
      });
    }

    const passwordHash = await hash(password);
    const user = await User.create({
      name,
      email,
      phone: phone || '',
      passwordHash,
      role: 'customer',
      city: city || '',
      pincode: pincode || '',
      acceptedTerms: !!acceptedTerms,
    });

    const { accessToken, refreshToken } = generateTokens(user, false);
    setAuthCookies(res, accessToken, refreshToken, false);

    res.status(201).json({
      token: accessToken,
      accessToken,
      user: publicUser(user),
    });
  } catch (err) {
    next(err);
  }
});

// -------------------------------------------------------------
// POST /api/auth/login
// -------------------------------------------------------------
router.post('/login', async (req, res, next) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: 'Invalid email or password format.',
        errors: formatZodErrors(parsed.error),
      });
    }

    const { email, password, rememberMe } = parsed.data;
    const user = await User.findOne({ email });

    if (!user || !(await compare(password, user.passwordHash || ''))) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: 'Your account has been suspended. Please contact support.' });
    }

    const { accessToken, refreshToken } = generateTokens(user, rememberMe);
    setAuthCookies(res, accessToken, refreshToken, rememberMe);

    res.json({
      token: accessToken,
      accessToken,
      user: publicUser(user),
    });
  } catch (err) {
    next(err);
  }
});

// -------------------------------------------------------------
// POST /api/auth/admin-login (Admin & Staff dedicated portal)
// -------------------------------------------------------------
router.post('/admin-login', async (req, res, next) => {
  try {
    const { email, password, rememberMe } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: String(email).trim().toLowerCase() });
    if (!user || !(await compare(password, user.passwordHash || ''))) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    if (!['admin', 'staff'].includes(user.role)) {
      return res.status(403).json({ message: 'Access denied: Staff or Administrative privileges required.' });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: 'Your administrative account has been deactivated.' });
    }

    const { accessToken, refreshToken } = generateTokens(user, rememberMe);
    setAuthCookies(res, accessToken, refreshToken, rememberMe);

    await recordAudit(req, 'admin_login', 'User', user._id, { email: user.email, role: user.role });

    res.json({
      token: accessToken,
      accessToken,
      user: publicUser(user),
    });
  } catch (err) {
    next(err);
  }
});

// -------------------------------------------------------------
// GET /api/auth/me
// -------------------------------------------------------------
router.get('/me', requireAuth, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

// -------------------------------------------------------------
// POST /api/auth/logout
// -------------------------------------------------------------
router.post('/logout', (req, res) => {
  clearAuthCookies(res);
  res.json({ ok: true, message: 'Logged out successfully.' });
});

// -------------------------------------------------------------
// POST /api/auth/refresh
// -------------------------------------------------------------
router.post('/refresh', async (req, res) => {
  try {
    const token = req.cookies?.hh_refresh_token || req.body?.refreshToken;
    if (!token) {
      return res.status(401).json({ message: 'No refresh token provided.' });
    }

    const decoded = verifyRefreshToken(token);
    const user = await User.findById(decoded.id);

    if (!user || user.isBlocked) {
      clearAuthCookies(res);
      return res.status(401).json({ message: 'Invalid session or account inactive.' });
    }

    const tokens = generateTokens(user, false);
    setAuthCookies(res, tokens.accessToken, tokens.refreshToken, false);

    res.json({
      token: tokens.accessToken,
      accessToken: tokens.accessToken,
      user: publicUser(user),
    });
  } catch (err) {
    clearAuthCookies(res);
    res.status(401).json({ message: 'Refresh token expired or invalid.' });
  }
});

// -------------------------------------------------------------
// PUT /api/auth/profile
// -------------------------------------------------------------
router.put('/profile', requireAuth, async (req, res, next) => {
  try {
    const allowed = ['name', 'phone', 'city', 'pincode', 'avatar', 'addresses'];
    for (const [key, val] of Object.entries(req.body)) {
      if (allowed.includes(key)) {
        req.user[key] = val;
      }
    }
    await req.user.save();
    res.json({ user: publicUser(req.user) });
  } catch (err) {
    next(err);
  }
});

// -------------------------------------------------------------
// POST /api/auth/change-password
// -------------------------------------------------------------
router.post('/change-password', requireAuth, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required.' });
    }

    const userWithHash = await User.findById(req.user._id);
    const valid = await compare(currentPassword, userWithHash.passwordHash);
    if (!valid) {
      return res.status(400).json({ message: 'Incorrect current password.' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'New password must be at least 8 characters long.' });
    }

    userWithHash.passwordHash = await hash(newPassword);
    await userWithHash.save();

    await recordAudit(req, 'change_password', 'User', userWithHash._id);
    res.json({ ok: true, message: 'Password changed successfully.' });
  } catch (err) {
    next(err);
  }
});

// -------------------------------------------------------------
// POST /api/auth/forgot-password
// -------------------------------------------------------------
router.post('/forgot-password', async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email address is required.' });

    const user = await User.findOne({ email: String(email).trim().toLowerCase() });
    if (!user) {
      // Return ok anyway for privacy
      return res.json({ ok: true, message: 'If this email is registered, reset instructions have been sent.' });
    }

    const rawToken = generateRandomToken(32);
    user.resetPasswordToken = hashToken(rawToken);
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const resetUrl = `${clientUrl}/reset-password?token=${rawToken}&email=${encodeURIComponent(user.email)}`;

    await sendMail({
      to: user.email,
      subject: 'HangerHome Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; background: #04120e; color: #f7f3ec; border-radius: 12px; border: 1px solid #e8c070;">
          <h2 style="color: #e8c070;">Password Reset</h2>
          <p>Hello ${user.name},</p>
          <p>You requested a password reset for your HangerHome account. Click the button below to choose a new password:</p>
          <p style="text-align: center; margin: 24px 0;">
            <a href="${resetUrl}" style="background: linear-gradient(135deg, #e8c070 0%, #c9a24b 100%); color: #04120e; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; display: inline-block;">Reset Password</a>
          </p>
          <p style="font-size: 12px; color: #95a8a0;">This link is valid for 1 hour. If you did not make this request, please ignore this email.</p>
        </div>
      `,
      text: `Reset your HangerHome password using this link: ${resetUrl}`,
    });

    res.json({ ok: true, message: 'If this email is registered, reset instructions have been sent.' });
  } catch (err) {
    next(err);
  }
});

// -------------------------------------------------------------
// POST /api/auth/reset-password
// -------------------------------------------------------------
router.post('/reset-password', async (req, res, next) => {
  try {
    const { token, email, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and new password are required.' });
    }

    const hashed = hashToken(token);
    const user = await User.findOne({
      resetPasswordToken: hashed,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Password reset link is invalid or has expired.' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
    }

    user.passwordHash = await hash(newPassword);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    await recordAudit(req, 'reset_password', 'User', user._id);
    res.json({ ok: true, message: 'Password has been reset successfully. You can now sign in.' });
  } catch (err) {
    next(err);
  }
});

export default router;
