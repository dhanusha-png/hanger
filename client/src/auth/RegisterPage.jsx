import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, Check, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Logo } from '../components/Logo';

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    city: '',
    pincode: '',
    acceptedTerms: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Live password rules inspection
  const passwordRules = useMemo(() => {
    const p = form.password;
    return {
      length: p.length >= 8,
      upper: /[A-Z]/.test(p),
      lower: /[a-z]/.test(p),
      number: /[0-9]/.test(p)
    };
  }, [form.password]);

  // Live password strength calculation
  const strengthInfo = useMemo(() => {
    const passedCount = Object.values(passwordRules).filter(Boolean).length;
    if (form.password.length === 0) {
      return { score: 0, label: '', className: '' };
    }
    if (passedCount <= 1) {
      return { score: 1, label: 'Weak', className: 'str-weak' };
    }
    if (passedCount === 2 || passedCount === 3) {
      return { score: 2, label: 'Fair', className: 'str-fair' };
    }
    if (passedCount === 4 && form.password.length < 10) {
      return { score: 3, label: 'Good', className: 'str-good' };
    }
    return { score: 4, label: 'Strong', className: 'str-strong' };
  }, [passwordRules, form.password]);

  // Validation function for each field
  const validateField = (name, value, allForm = form) => {
    let error = '';
    switch (name) {
      case 'name':
        if (!value.trim()) {
          error = 'Full name is required';
        } else if (value.trim().length < 2) {
          error = 'Name must be at least 2 characters';
        }
        break;

      case 'email':
        if (!value.trim()) {
          error = 'Email address is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          error = 'Please enter a valid email address';
        }
        break;

      case 'phone':
        if (!value.trim()) {
          error = 'Phone number is required';
        } else if (!/^(?:\+91|91|0)?[6-9]\d{9}$/.test(value.trim())) {
          error = 'Enter a valid 10-digit Indian phone number (e.g. 9876543210)';
        }
        break;

      case 'password':
        if (!value) {
          error = 'Password is required';
        } else if (value.length < 8) {
          error = 'Must be at least 8 characters';
        } else if (!/[A-Z]/.test(value)) {
          error = 'Must include at least one uppercase letter';
        } else if (!/[a-z]/.test(value)) {
          error = 'Must include at least one lowercase letter';
        } else if (!/[0-9]/.test(value)) {
          error = 'Must include at least one number';
        }
        break;

      case 'confirmPassword':
        if (!value) {
          error = 'Please confirm your password';
        } else if (value !== allForm.password) {
          error = 'Passwords do not match';
        }
        break;

      case 'pincode':
        if (value.trim() && !/^\d{6}$/.test(value.trim())) {
          error = 'Pincode must be 6 digits';
        }
        break;

      case 'acceptedTerms':
        if (!value) {
          error = 'You must accept the Terms and Privacy Policy';
        }
        break;

      default:
        break;
    }
    return error;
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, form[field], form);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleChange = (field, value) => {
    const updated = { ...form, [field]: value };
    setForm(updated);

    if (serverError) setServerError('');

    if (touched[field]) {
      const error = validateField(field, value, updated);
      setErrors(prev => ({ ...prev, [field]: error }));
    }

    // Re-check confirmPassword if password changes
    if (field === 'password' && touched.confirmPassword) {
      const confErr = validateField('confirmPassword', form.confirmPassword, updated);
      setErrors(prev => ({ ...prev, confirmPassword: confErr }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = Object.keys(form).reduce((acc, k) => ({ ...acc, [k]: true }), {});
    setTouched(allTouched);

    const validationErrors = {};
    Object.keys(form).forEach(key => {
      const err = validateField(key, form[key], form);
      if (err) validationErrors[key] = err;
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    setServerError('');

    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
        city: form.city.trim(),
        pincode: form.pincode.trim(),
        acceptedTerms: form.acceptedTerms
      });

      // Auto-login succeeds, redirect to previous page or home
      const destination = location.state?.from || '/';
      navigate(destination, { replace: true });
    } catch (err) {
      if (err.errors && Object.keys(err.errors).length > 0) {
        setErrors(err.errors);
      }
      setServerError(err.message || 'Registration failed. Please check your details and try again.');
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

        <h1>Create an Account</h1>
        <p className="auth-subtitle">
          Join HangerHome for streamlined installations, instant quotes, and exclusive previews.
        </p>

        {serverError && (
          <div className="auth-server-error" role="alert">
            <AlertCircle size={17} />
            <span>{serverError}</span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {/* Full Name */}
          <div className="auth-field">
            <label htmlFor="reg-name">Full Name</label>
            <div className="auth-input-wrapper">
              <input
                id="reg-name"
                type="text"
                name="name"
                autoComplete="name"
                placeholder="Rajesh Kumar"
                value={form.name}
                onChange={e => handleChange('name', e.target.value)}
                onBlur={() => handleBlur('name')}
                className={`auth-input ${errors.name ? 'has-error' : ''}`}
                disabled={submitting}
              />
            </div>
            {errors.name && (
              <span className="auth-field-error">
                <AlertCircle size={12} /> {errors.name}
              </span>
            )}
          </div>

          {/* Email */}
          <div className="auth-field">
            <label htmlFor="reg-email">Email Address</label>
            <div className="auth-input-wrapper">
              <input
                id="reg-email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="rajesh@example.com"
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

          {/* Phone */}
          <div className="auth-field">
            <label htmlFor="reg-phone">Phone Number (India)</label>
            <div className="auth-input-wrapper">
              <input
                id="reg-phone"
                type="tel"
                name="phone"
                autoComplete="tel"
                placeholder="+91 98765 43210"
                value={form.phone}
                onChange={e => handleChange('phone', e.target.value)}
                onBlur={() => handleBlur('phone')}
                className={`auth-input ${errors.phone ? 'has-error' : ''}`}
                disabled={submitting}
              />
            </div>
            {errors.phone && (
              <span className="auth-field-error">
                <AlertCircle size={12} /> {errors.phone}
              </span>
            )}
          </div>

          {/* Password */}
          <div className="auth-field">
            <label htmlFor="reg-password">Password</label>
            <div className="auth-input-wrapper">
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                autoComplete="new-password"
                placeholder="Min 8 chars, 1 uppercase, 1 number"
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

            {/* Live Strength Meter */}
            {form.password.length > 0 && (
              <div className="auth-strength-wrap">
                <div className="auth-strength-label">
                  <span>Strength:</span>
                  <b className={strengthInfo.className}>{strengthInfo.label}</b>
                </div>
                <div className="auth-strength-bar">
                  {[1, 2, 3, 4].map(step => (
                    <div
                      key={step}
                      className={`auth-strength-segment ${
                        step <= strengthInfo.score ? strengthInfo.className : ''
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Rule Checklist */}
            <ul className="auth-rules-checklist">
              <li className={`auth-rule-item ${passwordRules.length ? 'valid' : ''}`}>
                <Check size={12} /> 8+ Characters
              </li>
              <li className={`auth-rule-item ${passwordRules.upper ? 'valid' : ''}`}>
                <Check size={12} /> One Uppercase (A-Z)
              </li>
              <li className={`auth-rule-item ${passwordRules.lower ? 'valid' : ''}`}>
                <Check size={12} /> One Lowercase (a-z)
              </li>
              <li className={`auth-rule-item ${passwordRules.number ? 'valid' : ''}`}>
                <Check size={12} /> One Number (0-9)
              </li>
            </ul>

            {errors.password && (
              <span className="auth-field-error">
                <AlertCircle size={12} /> {errors.password}
              </span>
            )}
          </div>

          {/* Confirm Password */}
          <div className="auth-field">
            <label htmlFor="reg-confirm-password">Confirm Password</label>
            <div className="auth-input-wrapper">
              <input
                id="reg-confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                autoComplete="new-password"
                placeholder="Re-enter your password"
                value={form.confirmPassword}
                onChange={e => handleChange('confirmPassword', e.target.value)}
                onBlur={() => handleBlur('confirmPassword')}
                className={`auth-input with-eye ${errors.confirmPassword ? 'has-error' : ''}`}
                disabled={submitting}
              />
              <button
                type="button"
                className="auth-eye-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex="-1"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="auth-field-error">
                <AlertCircle size={12} /> {errors.confirmPassword}
              </span>
            )}
          </div>

          {/* Optional City and Pincode */}
          <div className="auth-two-col">
            <div className="auth-field">
              <label htmlFor="reg-city">
                City <span className="auth-optional">(Optional)</span>
              </label>
              <input
                id="reg-city"
                type="text"
                name="city"
                placeholder="Bengaluru"
                value={form.city}
                onChange={e => handleChange('city', e.target.value)}
                className="auth-input"
                disabled={submitting}
              />
            </div>

            <div className="auth-field">
              <label htmlFor="reg-pincode">
                Pincode <span className="auth-optional">(Optional)</span>
              </label>
              <input
                id="reg-pincode"
                type="text"
                name="pincode"
                placeholder="560001"
                maxLength="6"
                value={form.pincode}
                onChange={e => handleChange('pincode', e.target.value)}
                onBlur={() => handleBlur('pincode')}
                className={`auth-input ${errors.pincode ? 'has-error' : ''}`}
                disabled={submitting}
              />
              {errors.pincode && (
                <span className="auth-field-error">
                  <AlertCircle size={12} /> {errors.pincode}
                </span>
              )}
            </div>
          </div>

          {/* Terms & Privacy Policy Checkbox */}
          <div className="auth-field">
            <label className="auth-checkbox-label">
              <input
                type="checkbox"
                name="acceptedTerms"
                checked={form.acceptedTerms}
                onChange={e => handleChange('acceptedTerms', e.target.checked)}
                disabled={submitting}
              />
              <span>
                I agree to HangerHome’s{' '}
                <Link to="/policies" target="_blank" rel="noopener noreferrer">
                  Terms & Conditions
                </Link>{' '}
                and Privacy Policy.
              </span>
            </label>
            {errors.acceptedTerms && (
              <span className="auth-field-error">
                <AlertCircle size={12} /> {errors.acceptedTerms}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="auth-btn-primary"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 size={16} className="auth-spinner" />
                <span>Creating Account…</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>

        <div className="auth-switch-wrap">
          Already have an account?
          <Link to="/login" className="auth-switch-link">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
