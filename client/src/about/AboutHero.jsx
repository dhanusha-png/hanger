import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Play,
  Users,
  Home,
  Gem,
  X,
  Layers,
  Archive,
  Wrench
} from 'lucide-react';
import { api } from '../lib/api';
import './about-hero.css';

// Custom SVG Clothes Hanger Icon
function ClothesHangerIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 6a2 2 0 1 1 2 2c-1.5 0-2 1-2 2v2" />
      <path d="m2.5 17.5 8.7-6.5a1.5 1.5 0 0 1 1.6 0l8.7 6.5a1.5 1.5 0 0 1-.9 2.5H3.4a1.5 1.5 0 0 1-.9-2.5Z" />
    </svg>
  );
}

// Custom SVG Shoe Rack Icon
function ShoeRackIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h16" />
      <path d="M6 4v16" />
      <path d="M18 4v16" />
    </svg>
  );
}

// Custom SVG Crossed Tools Icon (Wrench & Screwdriver)
function CrossedToolsIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m14.7 6.3 5 5" />
      <path d="M3 21l6.5-6.5" />
      <path d="M17 3a2.8 2.8 0 0 0-3.9 0l-1.5 1.5 3.9 3.9 1.5-1.5a2.8 2.8 0 0 0 0-3.9Z" />
      <path d="m21 21-6.5-6.5" />
      <path d="M3 5l4 4" />
      <path d="M5 3l4 4" />
      <path d="M7 9l5.5 5.5" />
    </svg>
  );
}

export function AboutHero() {
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [counts, setCounts] = useState({ homes: 0, years: 0, products: 0, satisfaction: 0 });
  const [counted, setCounted] = useState(false);
  const [targetStats, setTargetStats] = useState({ homes: 1000, years: 5, products: 20, satisfaction: 99 });
  const statsRef = useRef(null);

  useEffect(() => {
    let active = true;
    api('/settings').then(s => {
      if (!active || !s?.stats) return;
      setTargetStats({
        homes: Number(s.stats.homes) || 1000,
        years: Number(s.stats.years) || 5,
        products: Number(s.stats.products) || 20,
        satisfaction: Number(s.stats.satisfaction) || 99
      });
    }).catch(() => {});
    return () => { active = false; };
  }, []);

  // Animated Count-up for Stats Bar
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !counted) {
          setCounted(true);
          const duration = 1800; // ms
          const start = performance.now();

          const animate = (time) => {
            const elapsed = time - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const ease = 1 - Math.pow(1 - progress, 3);

            setCounts({
              homes: Math.floor(ease * targetStats.homes),
              years: Math.floor(ease * targetStats.years),
              products: Math.floor(ease * targetStats.products),
              satisfaction: Math.floor(ease * targetStats.satisfaction)
            });

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCounts({ ...targetStats });
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, [counted, targetStats]);

  const signCategories = [
    {
      id: 'hangers',
      label: 'Hangers',
      icon: ClothesHangerIcon,
      link: '/products?category=Hangers',
      tooltip: 'Products filtered by Hangers'
    },
    {
      id: 'shoe-racks',
      label: 'Shoe Racks',
      icon: ShoeRackIcon,
      link: '/products?category=Shoe+Racks',
      tooltip: 'Products filtered by Shoe Racks'
    },
    {
      id: 'storage',
      label: 'Storage Solutions',
      icon: Archive,
      link: '/products?category=Storage',
      tooltip: 'Products filtered by Storage'
    },
    {
      id: 'installation-service',
      label: 'Installation & Service',
      icon: CrossedToolsIcon,
      link: '/installations',
      tooltip: 'Installation & Service'
    }
  ];

  return (
    <div className="about-hero-master">
      {/* SVG Gooey Filter Definition */}
      <svg className="about-gooey-svg-filter" aria-hidden="true">
        <defs>
          <filter id="about-gooey-effect">
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
      <section className="about-hero-stage">
        {/* Background Photo Plate with Ken Burns */}
        <div className="about-hero-bg-plate">
          <picture>
            <source srcSet="/about/about-hero-bg.webp" type="image/webp" />
            <img
              src="/about/about-hero-bg.jpg"
              alt="HangerHome Workshop and Showroom"
              onError={(e) => {
                e.currentTarget.src = '/media/hanger-8.jpg';
              }}
            />
          </picture>
        </div>

        {/* Cinematic Gradient Overlays */}
        <div className="about-hero-overlay" />
        <div className="about-hero-vignette" />

        {/* Very subtle warm light twinkles near window and ceiling hanger */}
        <div className="about-twinkle-dot" style={{ top: '30%', left: '16%', animationDelay: '0s' }} />
        <div className="about-twinkle-dot" style={{ top: '46%', left: '22%', animationDelay: '1.8s' }} />
        <div className="about-twinkle-dot" style={{ top: '22%', left: '26%', animationDelay: '3.4s' }} />
        <div className="about-twinkle-dot" style={{ top: '14%', left: '46%', animationDelay: '1.0s' }} />
        <div className="about-twinkle-dot" style={{ top: '18%', left: '56%', animationDelay: '2.6s' }} />
        <div className="about-twinkle-dot" style={{ top: '12%', left: '64%', animationDelay: '4.2s' }} />

        {/* Gooey Organic Blobs */}
        <div className="about-gooey-container" aria-hidden="true">
          <div className="about-gooey-blob blob-1" />
          <div className="about-gooey-blob blob-2" />
          <div className="about-gooey-blob blob-3" />
          <div className="about-gooey-blob blob-4" />
        </div>

        {/* Hero Grid: Left Content + Right 3D Wall Sign */}
        <div className="about-hero-content-grid">
          {/* LEFT: Typography, CTAs & Trust Badges */}
          <motion.div
            className="about-hero-left"
            initial={{ opacity: 0.01, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <span className="about-eyebrow">
              <span style={{ color: '#e8c070', fontSize: '10px' }}>✦</span>
              ABOUT HANGERHOME
            </span>

            <h1 className="about-headline">
              <span className="about-headline-white">Built Around</span>
              <span className="about-headline-gold">Better Spaces.</span>
            </h1>

            <p className="about-paragraph">
              HangerHome brings together thoughtfully designed hanger and storage solutions with professional installation and service. Our goal is simple — to make every home more organized, functional and beautiful.
            </p>

            {/* Action Buttons */}
            <div className="about-hero-actions">
              <Link
                to="/products"
                className="about-btn-gold"
                id="about-btn-explore"
              >
                <span>Explore Products</span>
                <ArrowRight size={16} className="btn-arrow-icon" />
              </Link>

              <button
                type="button"
                className="about-btn-outline"
                id="about-btn-story"
                onClick={() => setVideoModalOpen(true)}
              >
                <span className="about-play-icon-circle">
                  <Play size={10} fill="currentColor" />
                </span>
                <span>Our Story</span>
              </button>
            </div>

            {/* Trust Row: 3 Circular Badges */}
            <div className="about-trust-row">
              <div className="about-trust-item">
                <div className="about-trust-icon-ring">
                  <Gem size={20} />
                </div>
                <div className="about-trust-text">
                  <b>Premium Quality</b>
                  <small>Durable &amp; stylish solutions</small>
                </div>
              </div>

              <div className="about-trust-item">
                <div className="about-trust-icon-ring">
                  <Users size={20} />
                </div>
                <div className="about-trust-text">
                  <b>Expert Installation</b>
                  <small>Skilled &amp; trusted professionals</small>
                </div>
              </div>

              <div className="about-trust-item">
                <div className="about-trust-icon-ring">
                  <Home size={20} />
                </div>
                <div className="about-trust-text">
                  <b>Better Living Spaces</b>
                  <small>Organised, modern and clutter-free</small>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: 3D Floating Feature Wall Sign */}
          <div className="about-hero-right">
            <motion.div
              className="about-3d-wall-sign"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Brand Sign: HANGER in White, HOME in Gold with 6s soft light sweep */}
              <div className="about-sign-brand">
                <span className="about-sign-brand-white">HANGER</span>
                <span className="about-sign-brand-gold">HOME</span>
              </div>

              {/* Tagline Underneath */}
              <div className="about-sign-tagline">
                SMART STORAGE &nbsp;|&nbsp; MODERN HOMES &nbsp;|&nbsp; PROFESSIONAL INSTALLATION
              </div>

              {/* 4 Floating Icon Items with Gold Ring Hover & Tooltip */}
              <div className="about-sign-icons-row">
                {signCategories.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      to={item.link}
                      key={item.id}
                      className="about-sign-icon-item"
                      title={item.tooltip}
                      aria-label={item.tooltip}
                    >
                      <div className="about-sign-icon-svg">
                        <Icon width={20} height={20} />
                      </div>
                      <span className="about-sign-icon-label">{item.label}</span>
                      <span className="about-sign-tooltip">{item.tooltip}</span>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>

        {/* STEP 5 — STATS BAR (Bottom Left Glass Panel with Rounded Corners) */}
        <div className="about-stats-container" ref={statsRef}>
          <motion.div
            className="about-stats-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="about-stat-item">
              <span className="about-stat-number">{counts.homes}+</span>
              <span className="about-stat-label">Happy Homes</span>
              <span className="about-stat-desc">Spaces transformed</span>
            </div>

            <div className="about-stat-item">
              <span className="about-stat-number">{counts.years}+</span>
              <span className="about-stat-label">Years Experience</span>
              <span className="about-stat-desc">Trusted &amp; growing</span>
            </div>

            <div className="about-stat-item">
              <span className="about-stat-number">{counts.products}+</span>
              <span className="about-stat-label">Product Solutions</span>
              <span className="about-stat-desc">For every space</span>
            </div>

            <div className="about-stat-item">
              <span className="about-stat-number">{counts.satisfaction}%</span>
              <span className="about-stat-label">Customer Satisfaction</span>
              <span className="about-stat-desc">Quality you can trust</span>
            </div>
          </motion.div>

          {/* Optional Restyled Compact "Our Installation" Floating Card */}
          <Link to="/installations" className="about-floating-install-card">
            <div className="about-install-thumb">
              <img src="/media/hanger-1.jpg" alt="Our Installation" />
            </div>
            <div className="about-install-info">
              <small>Our Installation</small>
              <b>Ceiling Mounted Clothes Drying System</b>
            </div>
            <ArrowRight size={14} style={{ color: '#e8c070' }} />
          </Link>
        </div>
      </section>

      {/* Video Modal (Our Story) */}
      <AnimatePresence>
        {videoModalOpen && (
          <motion.div
            className="about-video-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setVideoModalOpen(false)}
          >
            <motion.div
              className="about-video-modal-card"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="about-video-modal-header">
                <h3>The HangerHome Story</h3>
                <button
                  type="button"
                  className="about-video-close-btn"
                  onClick={() => setVideoModalOpen(false)}
                  aria-label="Close video"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="about-video-frame">
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
