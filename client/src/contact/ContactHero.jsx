import React from 'react';
import { motion } from 'framer-motion';
import { Phone, MessageCircle, Mail } from 'lucide-react';

export function ContactHero({ phone, whatsapp, email }) {
  const displayPhone = phone || '+91 98765 43210';
  const displayWhatsapp = whatsapp || '+91 98765 43210';
  const displayEmail = email || 'support@hangerhome.com';

  const cleanPhone = displayPhone.replace(/[^\d+]/g, '');
  const cleanWhatsapp = displayWhatsapp.replace(/\D/g, '');

  return (
    <section className="contact-hero-section" aria-label="Contact HangerHome Header">
      {/* SVG Gooey Filter for Ambient Blobs */}
      <svg className="contact-gooey-svg-filter" aria-hidden="true">
        <defs>
          <filter id="contact-gooey-filter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Background Ambience: Gradient + Architectural Grid + Gooey Blobs */}
      <div className="contact-hero-bg-layer" aria-hidden="true">
        <div className="contact-hero-grid-pattern" />
        <div className="contact-hero-radial-glow" />

        {/* Floating Twinkling Gold Dots */}
        <div className="contact-twinkle-dot dot-1" />
        <div className="contact-twinkle-dot dot-2" />
        <div className="contact-twinkle-dot dot-3" />
        <div className="contact-twinkle-dot dot-4" />
        <div className="contact-twinkle-dot dot-5" />

        {/* Isolated Gooey Ambient Blobs */}
        <div className="contact-gooey-wrap">
          <div className="contact-goo-blob blob-a" />
          <div className="contact-goo-blob blob-b" />
          <div className="contact-goo-blob blob-c" />
          <div className="contact-goo-blob blob-d" />
        </div>
      </div>

      <div className="container contact-hero-container">
        {/* Eyebrow with pulsating gold dot */}
        <motion.div
          className="contact-eyebrow-pill"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <span className="contact-eyebrow-dot" />
          <span className="contact-eyebrow-text">GET IN TOUCH</span>
        </motion.div>

        {/* Main Heading with drawing underline under "Your Space." */}
        <motion.h1
          className="contact-hero-heading"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          Let's Talk About{' '}
          <span className="contact-heading-gold-wrap">
            <span className="contact-heading-gold-text">Your Space.</span>
            <svg
              className="contact-heading-underline-svg"
              viewBox="0 0 240 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M3 8.5C60 3.5 180 3.5 237 8.5"
                stroke="url(#contact-underline-gold)"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="contact-underline-gold" x1="3" y1="8.5" x2="237" y2="8.5" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#f7df9c" />
                  <stop offset="0.5" stopColor="#e8c070" />
                  <stop offset="1" stopColor="#c9a24b" />
                </linearGradient>
              </defs>
            </svg>
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="contact-hero-subtext"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          Tell us what you need and we'll help you find the right product or professional service.
        </motion.p>

        {/* Row of 3 Quick-Action Glass Chips */}
        <motion.div
          className="contact-quick-chips-row"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          aria-label="Direct contact channels"
        >
          <a
            href={`tel:${cleanPhone}`}
            className="contact-quick-chip"
            title={`Call HangerHome at ${displayPhone}`}
          >
            <div className="contact-chip-light-sweep" />
            <div className="contact-chip-icon-box">
              <Phone size={14} />
            </div>
            <div className="contact-chip-content">
              <span className="contact-chip-label">Call us</span>
              <strong className="contact-chip-val">{displayPhone}</strong>
            </div>
          </a>

          <a
            href={`https://wa.me/${cleanWhatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-quick-chip"
            title={`Chat on WhatsApp at ${displayWhatsapp}`}
          >
            <div className="contact-chip-light-sweep" />
            <div className="contact-chip-icon-box">
              <MessageCircle size={15} />
            </div>
            <div className="contact-chip-content">
              <span className="contact-chip-label">WhatsApp</span>
              <strong className="contact-chip-val">Instant Chat</strong>
            </div>
          </a>

          <a
            href={`mailto:${displayEmail}`}
            className="contact-quick-chip"
            title={`Email us at ${displayEmail}`}
          >
            <div className="contact-chip-light-sweep" />
            <div className="contact-chip-icon-box">
              <Mail size={14} />
            </div>
            <div className="contact-chip-content">
              <span className="contact-chip-label">Email</span>
              <strong className="contact-chip-val">{displayEmail}</strong>
            </div>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
