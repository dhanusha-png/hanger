import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  ArrowRight,
  Play,
  ShieldCheck,
  Settings,
  Wrench,
  Award,
  Check,
  X
} from 'lucide-react';
import './installations-hero.css';

// Custom SVG Hanger Icon
function ClothesHangerIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 6a2 2 0 1 1 2 2c-1.5 0-2 1-2 2v2" />
      <path d="m2.5 17.5 8.7-6.5a1.5 1.5 0 0 1 1.6 0l8.7 6.5a1.5 1.5 0 0 1-.9 2.5H3.4a1.5 1.5 0 0 1-.9-2.5Z" />
    </svg>
  );
}

export function InstallationsHero({ onSelectType }) {
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleRequestClick = (type) => {
    if (onSelectType) onSelectType(type);
    scrollToSection('booking-section');
  };

  const floatingRightCards = [
    {
      id: 'professional',
      tag: 'INSTALL',
      title: 'Professional Installation',
      subtitle: 'Safe & precise',
      thumb: '/installations/install-professional.jpg',
      fallback: '/media/hanger-5.jpg',
      cardClass: 'card-1',
      action: () => handleRequestClick('installation')
    },
    {
      id: 'maintenance',
      tag: 'SERVICE',
      title: 'Repair & Maintenance',
      subtitle: 'Keep it working like new',
      thumb: '/services/service-maintenance.jpg',
      fallback: '/media/hanger-3.jpg',
      cardClass: 'card-2',
      action: () => handleRequestClick('service')
    },
    {
      id: 'support',
      tag: 'SERVICE',
      title: 'After-Sales Support',
      subtitle: 'Fast response, lasting results',
      thumb: '/services/service-new-installation.jpg',
      fallback: '/media/hanger-1.jpg',
      cardClass: 'card-3',
      action: () => scrollToSection('service-solutions')
    }
  ];

  return (
    <div className="install-hero-master">
      {/* SVG Gooey Filter Definition */}
      <svg className="install-gooey-svg-filter" aria-hidden="true">
        <defs>
          <filter id="installations-gooey-effect">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
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

      {/* FULL-BLEED HERO STAGE */}
      <section className="install-hero-stage" aria-label="Installation and Service Hero">
        {/* Background Photo Plate with Ken Burns */}
        <div className="install-hero-bg-plate">
          <picture>
            <source srcSet="/installations/installations-hero-bg.webp" type="image/webp" />
            <img
              src="/installations/installations-hero-bg.jpg"
              alt="HangerHome Technicians Installing Ceiling Hanger and Shoe Rack"
              onError={(e) => {
                e.currentTarget.src = '/media/hanger-8.jpg';
              }}
            />
          </picture>
        </div>

        {/* Cinematic Gradient Overlays (left-to-right dark green + soft vignettes) */}
        <div className="install-hero-overlay" />
        <div className="install-hero-vignette" />

        {/* Twinkling Gold Light Dots in the Scene */}
        <div className="install-twinkle-dot" style={{ top: '20%', right: '36%', animationDelay: '0s' }} />
        <div className="install-twinkle-dot" style={{ top: '44%', right: '50%', animationDelay: '1.4s' }} />
        <div className="install-twinkle-dot" style={{ top: '30%', right: '22%', animationDelay: '2.2s' }} />
        <div className="install-twinkle-dot" style={{ top: '62%', right: '32%', animationDelay: '0.8s' }} />
        <div className="install-twinkle-dot" style={{ top: '72%', right: '46%', animationDelay: '2.8s' }} />

        {/* Gooey Liquid Blobs */}
        <div className="install-gooey-container" aria-hidden="true">
          <div className="install-gooey-blob blob-1" />
          <div className="install-gooey-blob blob-2" />
          <div className="install-gooey-blob blob-3" />
          <div className="install-gooey-blob blob-4" />
        </div>

        {/* Hero Grid: Left Content + Right Floating Canvas */}
        <div className="install-hero-content-grid">
          {/* LEFT: Typography, Equal Buttons & Trust Row */}
          <motion.div
            className="install-hero-left"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="install-eyebrow">
              <span className="eyebrow-sparkle">✦</span>
              PROFESSIONAL INSTALLATION &amp; SERVICE
            </span>

            <h1 className="install-headline">
              <span className="install-headline-white">Expert Installation &amp; Service</span>
              <span className="install-headline-gold">for a Perfect Space</span>
            </h1>

            <p className="install-paragraph">
              From first-time installation to repair, maintenance and custom fixes, our trained team keeps your hangers, shoe racks and storage solutions safe, precise and working beautifully for years.
            </p>

            {/* Action Buttons: Equal Size & Glow */}
            <div className="install-hero-actions">
              <button
                type="button"
                className="install-btn-gold"
                id="install-btn-request"
                onClick={() => handleRequestClick('installation')}
              >
                <Calendar size={18} />
                <span>Request an Installation</span>
                <ArrowRight size={16} className="btn-arrow-icon" />
              </button>

              <button
                type="button"
                className="install-btn-gold-outline"
                id="install-btn-service"
                onClick={() => handleRequestClick('service')}
              >
                <Calendar size={18} />
                <span>Book a Service</span>
                <ArrowRight size={16} className="btn-arrow-icon" />
              </button>

              <button
                type="button"
                className="install-link-watch"
                id="install-btn-watch"
                onClick={() => setVideoModalOpen(true)}
              >
                <span className="install-play-icon-circle">
                  <Play size={10} fill="currentColor" />
                </span>
                <span>Watch our process</span>
              </button>
            </div>

            {/* Trust Row: 4 Badges */}
            <div className="install-trust-row">
              <div className="install-trust-item">
                <div className="install-trust-icon-ring">
                  <ShieldCheck size={20} />
                </div>
                <div className="install-trust-text">
                  <b>Trained Technicians</b>
                  <small>Skilled &amp; reliable</small>
                </div>
              </div>

              <div className="install-trust-item">
                <div className="install-trust-icon-ring">
                  <Settings size={20} />
                </div>
                <div className="install-trust-text">
                  <b>Precise Installation</b>
                  <small>Proper alignment</small>
                </div>
              </div>

              <div className="install-trust-item">
                <div className="install-trust-icon-ring">
                  <Wrench size={19} />
                </div>
                <div className="install-trust-text">
                  <b>Repair &amp; Maintenance</b>
                  <small>Like-new performance</small>
                </div>
              </div>

              <div className="install-trust-item">
                <div className="install-trust-icon-ring">
                  <Award size={20} />
                </div>
                <div className="install-trust-text">
                  <b>Quality Assurance</b>
                  <small>Built to last</small>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Floating Visual Elements Over the Scene */}
          <div className="install-hero-right">
            {/* Top-Center Floating Pill Card: Installation & Service */}
            <motion.div
              className="install-pill-motion-wrap"
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <button
                type="button"
                className="install-floating-pill"
                id="install-top-pill"
                onClick={() => scrollToSection('tabs-section')}
                title="Explore Installation & Service Solutions"
              >
                <div className="install-pill-icon">
                  <ClothesHangerIcon width={17} height={17} />
                </div>
                <div className="install-pill-info">
                  <b>Installation &amp; Service</b>
                  <small>Install • Repair • Maintain</small>
                </div>
                <div className="install-pill-arrow">
                  <ArrowRight size={13} />
                </div>
              </button>
            </motion.div>

            {/* 3 Compact Stacked Cards on the Far Right Edge */}
            <div className="install-right-cards-stack">
              {floatingRightCards.map((card, idx) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.35 + idx * 0.15 }}
                >
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={card.action}
                    onKeyDown={(e) => e.key === 'Enter' && card.action()}
                    className={`install-glass-card ${card.cardClass}`}
                  >
                    <div className="install-card-thumb">
                      <img
                        src={card.thumb}
                        alt={card.title}
                        onError={(e) => {
                          e.currentTarget.src = card.fallback;
                        }}
                      />
                    </div>
                    <div className="install-card-body">
                      <div className="install-card-header-row">
                        <span className={`install-card-tag ${card.tag === 'INSTALL' ? 'tag-install' : 'tag-service'}`}>
                          {card.tag}
                        </span>
                        <div className="install-card-check-ring">
                          <Check size={12} strokeWidth={2.6} />
                        </div>
                      </div>
                      <div className="install-card-text">
                        <b>{card.title}</b>
                        <small>{card.subtitle}</small>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Handwritten Gold Script at Bottom Center/Floor Area */}
            <motion.div
              className="install-script-tag"
              initial={{ opacity: 0, rotate: -6, scale: 0.9 }}
              animate={{ opacity: 1, rotate: -2.5, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.7 }}
            >
              <span className="install-script-text">Installed right. Serviced for life.</span>
              <svg className="install-script-swoosh" viewBox="0 0 160 12" fill="none">
                <path
                  d="M2 9C40 2 110 1 158 9"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
              </svg>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Video Modal (Watch our process) */}
      <AnimatePresence>
        {videoModalOpen && (
          <motion.div
            className="install-video-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setVideoModalOpen(false)}
          >
            <motion.div
              className="install-video-modal-card"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="install-video-modal-header">
                <h3>HangerHome Installation &amp; Service Process</h3>
                <button
                  type="button"
                  className="install-video-close-btn"
                  onClick={() => setVideoModalOpen(false)}
                  aria-label="Close video"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="install-video-frame">
                <video
                  src="/media/hanger-demo.mp4"
                  controls
                  autoPlay
                  playsInline
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
