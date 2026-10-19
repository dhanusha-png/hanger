import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  User,
  Mail,
  Phone,
  MessageSquare,
  Lock,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  RefreshCw,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { api } from '../lib/api';

const ALL_REQUIREMENTS = [
  'Ceiling Hanger Installation',
  'Wall Mounted Drying Rack',
  'Shoe Storage System',
  'Custom Hanger Fabrication',
  'Repair / Rope Replacement',
  'Site Measurement Request',
  'General Inquiry'
];

const TOP_THREE_CHIPS = [
  'Ceiling Hanger Installation',
  'Repair / Rope Replacement',
  'Custom Hanger Fabrication'
];

export function ContactForm({ preselectedRequirement }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    requirement: preselectedRequirement || ALL_REQUIREMENTS[0],
    message: '',
    _hp: '' // Honeypot field for bot protection
  });

  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [submitError, setSubmitError] = useState('');

  // Update requirement if prop changes (e.g. from Action Card click)
  useEffect(() => {
    if (preselectedRequirement && ALL_REQUIREMENTS.includes(preselectedRequirement)) {
      setForm(prev => ({ ...prev, requirement: preselectedRequirement }));
    }
  }, [preselectedRequirement]);

  // Validate a single field
  const validateField = (fieldName, value) => {
    let err = '';
    const val = (value || '').trim();

    if (fieldName === 'name') {
      if (!val) err = 'Full name is required';
      else if (val.length < 2) err = 'Name must be at least 2 characters';
    } else if (fieldName === 'email') {
      if (!val) err = 'Email address is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        err = 'Please enter a valid email address';
      }
    } else if (fieldName === 'phone') {
      if (val) {
        // India +91 phone check (10 digits, optional country code)
        const digits = val.replace(/\D/g, '');
        if (digits.length !== 10 && !(digits.length === 12 && digits.startsWith('91'))) {
          err = 'Please enter a valid 10-digit mobile number';
        }
      }
    } else if (fieldName === 'message') {
      if (!val) err = 'Message is required';
      else if (val.length < 10) err = 'Please provide at least 10 characters describing your space';
    }

    return err;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const err = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: err }));
    }
    if (submitError) setSubmitError('');
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const err = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: err }));
  };

  const handleChipClick = (req) => {
    setForm(prev => ({ ...prev, requirement: req }));
  };

  // Calculate completion progress
  const hasDetails = form.name.trim().length >= 2 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
  const hasReq = Boolean(form.requirement);
  const hasMsg = form.message.trim().length >= 10;

  let progressPercent = 15;
  if (hasDetails) progressPercent = 50;
  if (hasDetails && hasReq) progressPercent = 70;
  if (hasDetails && hasReq && hasMsg) progressPercent = 100;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Spam honeypot check
    if (form._hp) {
      console.warn('Bot detected by honeypot');
      setSuccess(true);
      return;
    }

    // Mark all required fields as touched
    const newErrors = {
      name: validateField('name', form.name),
      email: validateField('email', form.email),
      phone: validateField('phone', form.phone),
      message: validateField('message', form.message)
    };

    setTouched({ name: true, email: true, phone: true, message: true });
    setErrors(newErrors);

    const hasAnyError = Object.values(newErrors).some(Boolean);
    if (hasAnyError) {
      const firstErrorKey = Object.keys(newErrors).find(k => newErrors[k]);
      const el = document.getElementById(`field-${firstErrorKey}`);
      if (el) el.focus();
      return;
    }

    setLoading(true);
    setSubmitError('');

    try {
      await api('/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          requirement: form.requirement,
          message: form.message.trim()
        })
      });
      setSubmittedData({ ...form });
      setSuccess(true);
    } catch (err) {
      setSubmitError(err.message || 'Unable to submit your enquiry. Please check your connection and retry.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({
      name: '',
      email: '',
      phone: '',
      requirement: ALL_REQUIREMENTS[0],
      message: '',
      _hp: ''
    });
    setTouched({});
    setErrors({});
    setSuccess(false);
    setSubmittedData(null);
    setSubmitError('');
  };

  return (
    <motion.div
      className="contact-form-glow-wrapper"
      id="enquiry-form-card"
      initial={{ opacity: 0, x: 28 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Conic Glow Travelling Border Background */}
      <div className="contact-form-conic-glow" aria-hidden="true" />

      {/* Main Glass Form Container */}
      <div className="contact-form-panel">
        <AnimatePresence mode="wait">
          {!success ? (
            <motion.div
              key="form-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.35 }}
            >
              {/* Form Header */}
              <div className="contact-form-header">
                <div className="contact-form-header-badge">
                  <Sparkles size={13} className="sparkle-icon" />
                  <span>DIRECT INQUIRY</span>
                </div>
                <h2 className="contact-form-title">Send Us an Enquiry</h2>
                <p className="contact-form-subtitle">
                  Fill out the form below with your space requirement, and our team will get back to you promptly.
                </p>

                {/* 3-Step Progress Indicator */}
                <div className="contact-progress-container" aria-label="Form completion progress">
                  <div className="contact-progress-track">
                    <div
                      className="contact-progress-bar"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <div className="contact-progress-steps">
                    <span className={`contact-step-hint ${hasDetails ? 'step-done' : 'step-active'}`}>
                      1. Details {hasDetails && '✓'}
                    </span>
                    <span className={`contact-step-hint ${hasReq ? 'step-done' : ''}`}>
                      2. Requirement {hasReq && '✓'}
                    </span>
                    <span className={`contact-step-hint ${hasMsg ? 'step-done' : ''}`}>
                      3. Message {hasMsg && '✓'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Submission Error Banner */}
              {submitError && (
                <div className="contact-form-error-banner" role="alert">
                  <AlertCircle size={18} />
                  <div className="error-banner-text">
                    <b>Submission Error</b>
                    <p>{submitError}</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="error-retry-btn"
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* Actual Form */}
              <form onSubmit={handleSubmit} noValidate className="contact-fields-grid">
                {/* Honeypot field (hidden from legitimate users) */}
                <input
                  type="text"
                  name="_hp"
                  value={form._hp}
                  onChange={handleChange}
                  tabIndex={-1}
                  autoComplete="off"
                  style={{ display: 'none' }}
                  aria-hidden="true"
                />

                {/* Full Name Field */}
                <div className={`contact-float-field ${errors.name ? 'has-error' : ''} ${touched.name && !errors.name && form.name ? 'is-valid' : ''}`}>
                  <div className="field-input-wrap">
                    <User size={17} className="field-lead-icon" />
                    <input
                      id="field-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      placeholder=" "
                      value={form.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <label htmlFor="field-name">Your Full Name *</label>
                    {touched.name && !errors.name && form.name && (
                      <CheckCircle2 size={16} className="field-valid-icon" />
                    )}
                  </div>
                  {touched.name && errors.name && (
                    <motion.span
                      className="field-error-text"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {errors.name}
                    </motion.span>
                  )}
                </div>

                {/* Email and Phone in 2 Columns */}
                <div className="contact-dual-row">
                  {/* Email Field */}
                  <div className={`contact-float-field ${errors.email ? 'has-error' : ''} ${touched.email && !errors.email && form.email ? 'is-valid' : ''}`}>
                    <div className="field-input-wrap">
                      <Mail size={17} className="field-lead-icon" />
                      <input
                        id="field-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        placeholder=" "
                        value={form.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <label htmlFor="field-email">Email Address *</label>
                      {touched.email && !errors.email && form.email && (
                        <CheckCircle2 size={16} className="field-valid-icon" />
                      )}
                    </div>
                    {touched.email && errors.email && (
                      <motion.span
                        className="field-error-text"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        {errors.email}
                      </motion.span>
                    )}
                  </div>

                  {/* Phone Field */}
                  <div className={`contact-float-field ${errors.phone ? 'has-error' : ''} ${touched.phone && !errors.phone && form.phone ? 'is-valid' : ''}`}>
                    <div className="field-input-wrap">
                      <Phone size={17} className="field-lead-icon" />
                      <input
                        id="field-phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        placeholder=" "
                        value={form.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <label htmlFor="field-phone">Phone Number (Optional)</label>
                      {touched.phone && !errors.phone && form.phone && (
                        <CheckCircle2 size={16} className="field-valid-icon" />
                      )}
                    </div>
                    {touched.phone && errors.phone && (
                      <motion.span
                        className="field-error-text"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        {errors.phone}
                      </motion.span>
                    )}
                  </div>
                </div>

                {/* Requirement Chips + Custom Select */}
                <div className="contact-requirement-block">
                  <div className="contact-req-label-row">
                    <label htmlFor="field-requirement" className="contact-section-label">
                      What do you need assistance with?
                    </label>
                    <small className="contact-req-helper">Select a quick chip or choose from dropdown</small>
                  </div>

                  {/* Top 3 Quick Select Chips */}
                  <div className="contact-req-chips-strip">
                    {TOP_THREE_CHIPS.map(chip => {
                      const isSelected = form.requirement === chip;
                      return (
                        <button
                          key={chip}
                          type="button"
                          className={`contact-req-chip ${isSelected ? 'selected' : ''}`}
                          onClick={() => handleChipClick(chip)}
                        >
                          {isSelected && (
                            <motion.span
                              className="contact-chip-selected-glow"
                              layoutId="reqChipHighlight"
                              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                            />
                          )}
                          <span className="contact-req-chip-text">{chip}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Styled Select Dropdown (All 7 Options) */}
                  <div className="contact-select-wrap">
                    <select
                      id="field-requirement"
                      name="requirement"
                      value={form.requirement}
                      onChange={handleChange}
                      className="contact-custom-select"
                    >
                      {ALL_REQUIREMENTS.map(req => (
                        <option key={req} value={req}>
                          {req}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={17} className="contact-select-chevron" />
                  </div>
                </div>

                {/* Message / Space Details Textarea with Character Counter */}
                <div className={`contact-float-field textarea-field ${errors.message ? 'has-error' : ''} ${touched.message && !errors.message && form.message.length >= 10 ? 'is-valid' : ''}`}>
                  <div className="field-input-wrap">
                    <MessageSquare size={17} className="field-lead-icon top-icon" />
                    <textarea
                      id="field-message"
                      name="message"
                      required
                      rows={4}
                      maxLength={500}
                      placeholder=" "
                      value={form.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <label htmlFor="field-message">Message / Space Details *</label>
                  </div>

                  <div className="contact-textarea-footer">
                    {touched.message && errors.message ? (
                      <motion.span
                        className="field-error-text"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        {errors.message}
                      </motion.span>
                    ) : (
                      <small className="field-tip">Tell us about ceiling height, balcony type or model requirement</small>
                    )}
                    <span className={`char-counter ${form.message.length > 450 ? 'near-limit' : ''}`}>
                      {form.message.length} / 500
                    </span>
                  </div>
                </div>

                {/* Large GooButton Submit Button */}
                <div className="contact-submit-wrap">
                  <button
                    type="submit"
                    className="contact-goo-submit-btn"
                    disabled={loading}
                    id="contact-btn-submit"
                  >
                    <div className="btn-light-sweep" />
                    <div className="btn-content-flex">
                      {loading ? (
                        <>
                          <RefreshCw size={18} className="btn-spin-icon" />
                          <span>Submitting Your Enquiry...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Enquiry</span>
                          <ArrowRight size={17} className="btn-arrow" />
                        </>
                      )}
                    </div>
                  </button>

                  <div className="contact-trust-line">
                    <Lock size={13} className="trust-lock-icon" />
                    <span>Your details are only used to respond to your enquiry. We never spam.</span>
                  </div>
                </div>
              </form>
            </motion.div>
          ) : (
            /* SUCCESS STATE PANEL */
            <motion.div
              key="success-view"
              className="contact-success-panel"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Animated Self-Drawing Checkmark */}
              <div className="contact-success-icon-wrap" aria-hidden="true">
                <svg className="contact-check-svg" viewBox="0 0 52 52">
                  <circle
                    className="contact-check-circle"
                    cx="26"
                    cy="26"
                    r="23"
                    fill="none"
                  />
                  <path
                    className="contact-check-path"
                    fill="none"
                    d="M14 27l8 8 16-16"
                  />
                </svg>
              </div>

              <span className="contact-success-tag">ENQUIRY RECORDED</span>
              <h3 className="contact-success-title">Thank you! We'll get back to you shortly.</h3>
              <p className="contact-success-desc">
                Our site planning and customer support specialists have received your space details. We will review your requirement and reach out within 2 to 4 business hours.
              </p>

              {/* Enquiry Summary Card */}
              {submittedData && (
                <div className="contact-summary-card">
                  <div className="summary-row">
                    <span className="summary-label">Name:</span>
                    <strong className="summary-val">{submittedData.name}</strong>
                  </div>
                  <div className="summary-row">
                    <span className="summary-label">Email:</span>
                    <strong className="summary-val">{submittedData.email}</strong>
                  </div>
                  {submittedData.phone && (
                    <div className="summary-row">
                      <span className="summary-label">Phone:</span>
                      <strong className="summary-val">{submittedData.phone}</strong>
                    </div>
                  )}
                  <div className="summary-row">
                    <span className="summary-label">Requirement:</span>
                    <span className="summary-badge">{submittedData.requirement}</span>
                  </div>
                  <div className="summary-row message-summary">
                    <span className="summary-label">Message:</span>
                    <p className="summary-msg">"{submittedData.message}"</p>
                  </div>
                </div>
              )}

              <button
                type="button"
                className="contact-reset-btn"
                onClick={handleReset}
              >
                <RefreshCw size={15} />
                <span>Send Another Enquiry</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
