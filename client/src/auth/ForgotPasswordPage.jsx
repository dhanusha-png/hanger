import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Check, Loader2 } from 'lucide-react';
import { Logo } from '../components/Logo';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Email address is required');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address');
      return;
    }

    setSubmitting(true);
    setError('');

    // Simulate reset link dispatch or call backend if configured
    setTimeout(() => {
      setSubmitting(false);
      setSent(true);
    }, 600);
  };

  return (
    <div className="auth-page-clean">
      <Link to="/login" className="auth-back-link">
        <ArrowLeft size={15} />
        <span>Back to Sign In</span>
      </Link>

      <div className="auth-card-clean">
        <div className="auth-logo-center">
          <Logo variant="lockup" height={44} link={false} />
        </div>

        <h1>Reset Password</h1>
        <p className="auth-subtitle">
          Enter your registered email address and we’ll send you password recovery instructions.
        </p>

        {sent ? (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                background: 'rgba(74, 222, 128, 0.15)',
                color: '#4ade80',
                display: 'grid',
                placeItems: 'center',
                margin: '0 auto 16px',
                border: '1px solid rgba(74, 222, 128, 0.3)'
              }}
            >
              <Check size={26} />
            </div>
            <h3 style={{ color: '#fff', fontSize: '18px', margin: '0 0 8px' }}>Instructions Sent</h3>
            <p style={{ color: '#95a8a0', fontSize: '13px', lineHeight: 1.5, margin: '0 0 24px' }}>
              We’ve dispatched password reset guidance to <b>{email}</b>. Please check your inbox and spam folder.
            </p>
            <Link to="/login" className="auth-btn-primary" style={{ textDecoration: 'none' }}>
              Return to Sign In
            </Link>
          </div>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="auth-field">
              <label htmlFor="forgot-email">Email Address</label>
              <input
                id="forgot-email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={e => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                className={`auth-input ${error ? 'has-error' : ''}`}
                disabled={submitting}
              />
              {error && (
                <span className="auth-field-error">
                  <AlertCircle size={12} /> {error}
                </span>
              )}
            </div>

            <button type="submit" className="auth-btn-primary" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 size={16} className="auth-spinner" />
                  <span>Sending Link…</span>
                </>
              ) : (
                <span>Send Reset Link</span>
              )}
            </button>

            <div className="auth-switch-wrap">
              Remember your password?
              <Link to="/login" className="auth-switch-link">
                Sign in
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
