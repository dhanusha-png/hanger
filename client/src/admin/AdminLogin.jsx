import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Eye, EyeOff, Loader2, ArrowLeft, AlertCircle } from 'lucide-react';
import { Logo } from '../components/Logo';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';

export function AdminLogin() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '', rememberMe: true });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // If already logged in as admin/staff, redirect to /admin
  useEffect(() => {
    if (user && ['admin', 'staff'].includes(user.role)) {
      navigate('/admin', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api('/auth/admin-login', {
        method: 'POST',
        body: JSON.stringify(form),
      });

      login(res.token || res.accessToken, res.user);
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid administrative credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card-container">
        <Link to="/" className="auth-back-link">
          <ArrowLeft size={14} /> Back to Website
        </Link>

        <div className="auth-card">
          <div className="auth-card-header">
            <Logo variant="stacked" height={52} className="auth-brand-logo" />
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', margin: '14px 0 6px', color: '#e8c070', fontSize: '11px', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              <ShieldCheck size={14} /> Administrative Access
            </div>
            <h1 className="auth-card-title">Staff & Admin Portal</h1>
            <p className="auth-card-subtitle">
              Sign in to manage catalog, orders, customers, and website configuration.
            </p>
          </div>

          {error && (
            <div className="auth-server-error" role="alert">
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="auth-form-group">
              <label htmlFor="admin-email">Admin Email</label>
              <input
                id="admin-email"
                type="email"
                required
                autoComplete="email"
                placeholder="admin@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div className="auth-form-group">
              <label htmlFor="admin-password">Password</label>
              <div className="auth-password-input-wrap">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="auth-form-options">
              <label className="auth-remember-label">
                <input
                  type="checkbox"
                  checked={form.rememberMe}
                  onChange={(e) => setForm({ ...form, rememberMe: e.target.checked })}
                />
                <span>Stay signed in for 30 days</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="auth-btn-gold"
              style={{ marginTop: '12px' }}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="auth-spinner" /> Verifying Access…
                </>
              ) : (
                'Sign In to Dashboard'
              )}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: '#6e7a76' }}>
            HangerHome Platform Security · IP Protected
          </div>
        </div>
      </div>
    </div>
  );
}
