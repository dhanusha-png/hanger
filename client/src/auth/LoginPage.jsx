import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Logo } from '../components/Logo';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Validate fields
  const validateField = (name, value) => {
    let error = '';
    if (name === 'email') {
      if (!value.trim()) {
        error = 'Email address is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        error = 'Please enter a valid email address';
      }
    } else if (name === 'password') {
      if (!value) {
        error = 'Password is required';
      }
    }
    return error;
  };

  const handleBlur = (field) => {
    const error = validateField(field, form[field]);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    if (serverError) {
      setServerError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailErr = validateField('email', form.email);
    const passErr = validateField('password', form.password);

    if (emailErr || passErr) {
      setErrors({ email: emailErr, password: passErr });
      return;
    }

    setSubmitting(true);
    setServerError('');

    try {
      const res = await login({
        email: form.email.trim(),
        password: form.password,
        rememberMe: form.rememberMe
      });

      // Role-based routing: admin -> /admin, customer -> previous page or home
      const destination = res?.user?.role === 'admin'
        ? '/admin'
        : (location.state?.from || '/');

      navigate(destination, { replace: true });
    } catch (err) {
      if (err.errors && Object.keys(err.errors).length > 0) {
        setErrors(err.errors);
      }
      setServerError(err.message || 'Invalid email or password. Please verify your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page-clean">
      <Link to="/" className="auth-back-link">
        <ArrowLeft size={15} />
        <span>Back to Home</span>
      </Link>

      <div className="auth-card-clean">
        <div className="auth-logo-center">
          <Logo variant="lockup" height={44} link={false} />
        </div>

        <h1>Welcome Back</h1>
        <p className="auth-subtitle">
          Sign in to manage your orders, installations, and saved designs.
        </p>

        {serverError && (
          <div className="auth-server-error" role="alert">
            <AlertCircle size={17} />
            <span>{serverError}</span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="auth-field">
            <label htmlFor="login-email">Email Address</label>
            <div className="auth-input-wrapper">
              <input
                id="login-email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="name@example.com"
                value={form.email}
                onChange={e => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                className={`auth-input ${errors.email ? 'has-error' : ''}`}
                disabled={submitting}
              />
            </div>
            {errors.email && (
              <span className="auth-field-error">
                <AlertCircle size={12} /> {errors.email}
              </span>
            )}
          </div>

          <div className="auth-field">
            <label htmlFor="login-password">Password</label>
            <div className="auth-input-wrapper">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => handleChange('password', e.target.value)}
                onBlur={() => handleBlur('password')}
                className={`auth-input with-eye ${errors.password ? 'has-error' : ''}`}
                disabled={submitting}
              />
              <button
                type="button"
                className="auth-eye-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <span className="auth-field-error">
                <AlertCircle size={12} /> {errors.password}
              </span>
            )}
          </div>

          <div className="auth-checkbox-row">
            <label className="auth-checkbox-label">
              <input
                type="checkbox"
                name="rememberMe"
                checked={form.rememberMe}
                onChange={e => handleChange('rememberMe', e.target.checked)}
                disabled={submitting}
              />
              <span>Remember me</span>
            </label>

            <Link to="/forgot-password" className="auth-forgot-link">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="auth-btn-primary"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 size={16} className="auth-spinner" />
                <span>Signing in…</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        <div className="auth-switch-wrap">
          Don't have an account?
          <Link to="/register" className="auth-switch-link">
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
}
