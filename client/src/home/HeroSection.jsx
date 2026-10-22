import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Play,
  Plus,
  ShieldCheck,
  Wrench,
  Sparkles,
  Headphones,
  Maximize2,
  Star
} from 'lucide-react';
import { api, img } from '../lib/api';

// Custom SVG Icons matching the clean gold line aesthetic in Image 2
function HangerLineIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3a2 2 0 0 0-2 2c0 1.1.9 2 2 2 1.5 0 2 .8 2 2v1" />
      <path d="M12 10 2.5 17a1 1 0 0 0 .6 1.7h17.8a1 1 0 0 0 .6-1.7L12 10Z" />
    </svg>
  );
}

function ShoeLineIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2.5 17c0-1.5.5-3 2-4l4-2.5 4.5 1.5 6-1 2 2.5c.6 1 .7 2.2.3 3.3L20 20H3.5a1 1 0 0 1-1-1v-2Z" />
      <path d="M7 12.5v3" />
      <path d="M10 13v2.5" />
      <path d="M13 13.5v2" />
      <path d="M2 19.5h19" />
    </svg>
  );
}

function StorageBoxIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}

function RulerTriangleIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 21h18" />
      <path d="M3 21V3l18 18H3Z" />
      <path d="m7 17 2-2" />
      <path d="m11 17 2-2" />
      <path d="m15 17 2-2" />
    </svg>
  );
}

export function HeroSection({ featuredProduct }) {
  const [activeHotspot, setActiveHotspot] = useState(null); // for tap-to-open on touch devices
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [heroBanner, setHeroBanner] = useState(null);

  useEffect(() => {
    api('/banners?placement=home_hero')
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setHeroBanner(data[0]);
        }
      })
      .catch(() => {});
  }, []);

  // Ceiling product data
  const ceilingProductData = {
    title: 'Retractable Ceiling Hanger',
    price: '₹2,999',
    thumb: '/products/hanger-compact-balcony.jpg',
    link: '/products/premium-wall-mounted-clothes-hanger',
  };

  // Shoe rack product data
  const shoeRackData = {
    title: 'Wall Shoe Rack',
    price: '₹1,899',
    thumb: '/products/shoe-rack-compact-3-tier.jpg',
    link: '/products/compact-3-tier-shoe-rack',
  };

  const bottomCards = [
    {
      icon: HangerLineIcon,
      title: 'Dry Clothes',
      sub: 'Hanger Solutions',
      link: '/products?category=Hangers',
    },
    {
      icon: ShoeLineIcon,
      title: 'Store Shoes',
      sub: 'Shoe Storage',
      link: '/products?category=Shoe Racks',
    },
    {
      icon: StorageBoxIcon,
      title: 'Save Space',
      sub: 'Storage Solutions',
      link: '/products',
    },
    {
      icon: Wrench,
      title: 'Installation',
      sub: 'Professional Service',
      link: '/installations',
    },
    {
      icon: RulerTriangleIcon,
      title: 'Custom Solution',
      sub: 'Made For Your Space',
      link: '/installations#service-solutions',
    },
  ];

  return (
    <section className="target-hero-viewport" aria-label="HangerHome Hero">
      {/* SVG Gooey Filter Definition */}
      <svg className="goo-filter-defs" aria-hidden="true" style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
        <defs>
          <filter id="hero-gooey-effect">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Hero Single Background Plate with Ken Burns Zoom */}
      <div className="target-hero-bg-canvas">
        <div
          className="target-hero-single-bg"
          style={{
            backgroundImage: heroBanner?.image
              ? `url(${img(heroBanner.image)}), url(/home/hero-bg.webp)`
              : 'url(/home/hero-bg.webp), url(/home/hero-bg.jpg), url(/hero/hero-bg.jpg)',
          }}
        />

        {/* Cinematic Multi-stop Dark Green to Transparent Gradient Overlays */}
        <div className="target-hero-gradient-overlay" />
        <div className="target-hero-vignette-overlay" />

        {/* Foreground Out-of-Focus Tropical Leaves (framing left edge) */}
        <div className="target-hero-leaves-overlay" aria-hidden="true">
          <svg viewBox="0 0 320 540" fill="none" className="leaves-svg">
            <g opacity="0.85" filter="blur(5px)">
              <path d="M-40 -20 C 20 80, 80 160, 60 280 C 40 370, -20 440, -60 480 C -10 390, 10 300, 0 190 C -10 100, -30 20, -40 -20 Z" fill="#072218" />
              <path d="M-20 -10 C 60 70, 130 180, 100 310 C 80 390, 20 460, -30 500 C 30 420, 50 320, 30 220 C 10 130, -10 40, -20 -10 Z" fill="#0d3b2b" />
              <path d="M0 40 C 90 120, 150 240, 120 360 C 100 430, 40 500, 10 530 C 50 460, 70 370, 50 280 C 30 200, 10 110, 0 40 Z" fill="#144d39" />
              <path d="M-30 140 C 40 200, 110 310, 80 430 C 60 490, 10 540, -10 560 C 20 500, 40 420, 20 340 C 10 270, -20 190, -30 140 Z" fill="#08291d" />
            </g>
          </svg>
        </div>

        {/* Organic Gooey Blobs drifting softly strictly behind the headline */}
        <div className="target-hero-goo-container" aria-hidden="true">
          <div className="goo-blob goo-blob-1" />
          <div className="goo-blob goo-blob-2" />
          <div className="goo-blob goo-blob-3" />
        </div>
      </div>

      {/* Main Full-Viewport Content Grid */}
      <div className="target-hero-inner-container">
        {/* Left Column: Headlines, CTAs, Feature Strip */}
        <div className="target-hero-left-content">
          {/* Eyebrow Badge */}
          <div className="target-hero-eyebrow">
            <span className="eyebrow-sparkle-dot" />
            <span>{heroBanner?.badge || 'SMART SPACE • PREMIUM LIVING'}</span>
          </div>

          {/* Headline with Serif & Luminous Gold Underline */}
          <h1 className="target-hero-title">
            {heroBanner?.title ? (
              <span className="title-line title-line-1">{heroBanner.title}</span>
            ) : (
              <>
                <span className="title-line title-line-1">Turn Every Space</span>
                <span className="title-line title-line-2">Into Something</span>
                <span className="title-line title-line-3">
                  <span className="gold-text-highlight">Better.</span>
                </span>
              </>
            )}
          </h1>

          {/* Description Paragraph (clean, no stray underlines) */}
          <p className="target-hero-lead">
            {heroBanner?.description || heroBanner?.subtitle || 'Premium ceiling hangers, shoe racks and storage solutions designed for modern homes — with professional installation and support.'}
          </p>

          {/* Action Buttons with Rotating Conic Light Glow */}
          <div className="target-hero-buttons-row">
            <Link to={heroBanner?.link || '/products'} className="target-btn-primary conic-light-btn">
              <span className="btn-conic-glow-border" />
              <span className="btn-label-text">{heroBanner?.buttonText || 'Explore Products'}</span>
              <ArrowRight size={18} className="btn-icon-arrow" />
              <div className="btn-goo-accent" />
            </Link>

            <button
              type="button"
              className="target-btn-secondary conic-light-btn"
              onClick={() => setVideoModalOpen(true)}
              aria-label="See How It Works video walkthrough"
            >
              <span className="btn-conic-glow-border" />
              <span className="play-circle-icon">
                <Play size={12} fill="#e8c070" stroke="#e8c070" />
              </span>
              <span className="btn-label-text">See How It Works</span>
            </button>
          </div>

          {/* Mini Feature Strip (Clean Glass Capsule with NO scrollbar) */}
          <div className="target-feature-strip-pill">
            <div className="feature-strip-item">
              <ShieldCheck size={16} className="feature-gold-icon" />
              <span>Quality Products</span>
            </div>
            <div className="feature-strip-item">
              <Wrench size={15} className="feature-gold-icon" />
              <span>Professional Installation</span>
            </div>
            <div className="feature-strip-item">
              <Star size={15} className="feature-gold-icon" />
              <span>Custom Solutions</span>
            </div>
            <div className="feature-strip-item">
              <Headphones size={15} className="feature-gold-icon" />
              <span>Service Support</span>
            </div>
          </div>
        </div>

        {/* Right Scene Area: Hotspots, Handwritten Script, Visual Depth */}
        <div className="target-hero-scene-stage">
          {/* Handwritten Script Tag: "Smarter spaces, Happier homes" positioned on dark wall above shoe rack */}
          <div className="target-script-tag">
            <span className="script-text">
              Smarter spaces<br />Happier homes
            </span>
            <svg viewBox="0 0 54 36" fill="none" className="script-arrow-svg" aria-hidden="true">
              <path
                d="M4 4 C 18 2, 44 8, 46 28 M 46 28 L 36 24 M 46 28 L 48 18"
                stroke="#e8c070"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Hotspot 1: Retractable Ceiling Hanger (on the ceiling rack mechanism) */}
          <div className="target-hotspot-group hotspot-ceiling">
            <button
              type="button"
              className="target-hotspot-pin"
              onClick={() => setActiveHotspot(activeHotspot === 'ceiling' ? null : 'ceiling')}
              aria-label="View Retractable Ceiling Hanger product card"
            >
              <span className="hotspot-pulse-ring ring-1" />
              <span className="hotspot-pulse-ring ring-2" />
              <span className="hotspot-pin-core">
                <Plus size={15} strokeWidth={2.8} />
              </span>
            </button>

            <div className={`target-floating-card conic-card-glow ${activeHotspot === 'ceiling' ? 'touch-open' : ''}`}>
              <div className="card-conic-glow-border" />
              <Link to={ceilingProductData.link} className="card-thumb-wrap">
                <img src={ceilingProductData.thumb} alt={ceilingProductData.title} />
              </Link>
              <div className="card-content-wrap">
                <h4 className="card-title">{ceilingProductData.title}</h4>
                <div className="card-price-row">
                  <strong className="card-price">{ceilingProductData.price}</strong>
                </div>
                <Link to={ceilingProductData.link} className="card-action-link">
                  View Product →
                </Link>
              </div>
            </div>
          </div>

          {/* Hotspot 2: Wall Shoe Rack (on the lit shoe rack on the right) */}
          <div className="target-hotspot-group hotspot-shoe">
            <button
              type="button"
              className="target-hotspot-pin"
              onClick={() => setActiveHotspot(activeHotspot === 'shoe' ? null : 'shoe')}
              aria-label="View Wall Shoe Rack product card"
            >
              <span className="hotspot-pulse-ring ring-1" />
              <span className="hotspot-pulse-ring ring-2" />
              <span className="hotspot-pin-core">
                <Plus size={15} strokeWidth={2.8} />
              </span>
            </button>

            <div className={`target-floating-card conic-card-glow delay-float ${activeHotspot === 'shoe' ? 'touch-open' : ''}`}>
              <div className="card-conic-glow-border" />
              <Link to={shoeRackData.link} className="card-thumb-wrap">
                <img src={shoeRackData.thumb} alt={shoeRackData.title} />
              </Link>
              <div className="card-content-wrap">
                <h4 className="card-title">{shoeRackData.title}</h4>
                <div className="card-price-row">
                  <strong className="card-price">{shoeRackData.price}</strong>
                </div>
                <Link to={shoeRackData.link} className="card-action-link">
                  View Product →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Glass Navigation Bar with 5 Glowing Category Cards */}
      <div className="target-bottom-glass-bar-wrapper">
        <div className="target-bottom-glass-bar conic-bar-glow">
          <div className="bar-conic-glow-border" />
          <div className="target-bottom-grid">
            {bottomCards.map((card, idx) => {
              const IconComp = card.icon;
              return (
                <Link
                  key={idx}
                  to={card.link}
                  className="target-bottom-card"
                >
                  <div className="bottom-card-icon-box">
                    <IconComp size={28} className="bottom-card-icon" />
                  </div>
                  <div className="bottom-card-info">
                    <strong className="bottom-card-title">{card.title}</strong>
                    <span className="bottom-card-sub">{card.sub}</span>
                  </div>
                  <span className="bottom-card-arrow-circle" aria-hidden="true">
                    <ArrowRight size={15} />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Video Walkthrough Modal */}
      {videoModalOpen && (
        <div className="video-modal-backdrop" onClick={() => setVideoModalOpen(false)}>
          <div className="video-modal-dialog" onClick={e => e.stopPropagation()}>
            <button
              type="button"
              className="video-modal-close"
              onClick={() => setVideoModalOpen(false)}
              aria-label="Close video"
            >
              ×
            </button>
            <div className="video-wrapper">
              <video autoPlay controls playsInline poster="/media/hanger-2.jpg">
                <source src="/media/hanger-demo.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
