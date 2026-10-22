import React, { useState } from 'react';
import { ArrowRight, Play } from 'lucide-react';
import cardLiving from '../assets/gallery/gallery-card-living.jpg';
import cardShoes from '../assets/gallery/gallery-card-shoes.jpg';
import cardTop from '../assets/gallery/gallery-card-top.jpg';
import './gallery-hero.css';

export function GalleryHero({
  onCardClick = () => {},
  category = 'All',
  setCategory = () => {},
  categories = ['All', 'Hangers'],
  totalPhotos = 8,
}) {
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  // Smooth scroll down to installations section
  const handleScrollToGrid = () => {
    const el = document.querySelector('.gallery-intro-bar') || document.querySelector('.gallery-filter-bar') || document.querySelector('.catalog-gallery-grid');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="gallery-hero-wrapper">
      {/* SVG Gooey Filter Definition */}
      <svg className="gallery-goo-defs" aria-hidden="true" style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
        <defs>
          <filter id="gallery-gooey-effect">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Main 40px Rounded Glass Hero Panel */}
      <section className="gallery-hero-panel conic-panel-glow" aria-label="Gallery Hero Showcase">
        <div className="panel-conic-glow-border" />

        {/* Panel Background Layer with Ken Burns Zoom */}
        <div className="gallery-hero-bg-frame">
          <div
            className="gallery-hero-bg-image"
            style={{
              backgroundImage: 'url(/gallery/hero-panel-bg.jpg), url(/src/assets/gallery/hero-panel-bg.jpg), url(/src/assets/hero/hero-bg.jpg)',
            }}
          />
          <div className="gallery-hero-gradient-overlay" />
          <div className="gallery-hero-vignette-overlay" />

          {/* Leaves Silhouette on Left Framing */}
          <div className="gallery-leaves-overlay" aria-hidden="true">
            <svg viewBox="0 0 320 540" fill="none" className="gallery-leaves-svg">
              <g opacity="0.82" filter="blur(4px)">
                <path d="M-40 -20 C 30 70, 90 150, 70 270 C 50 360, -10 430, -50 470 C 0 380, 20 290, 10 180 C 0 90, -20 20, -40 -20 Z" fill="#072218" />
                <path d="M-20 -10 C 70 60, 140 170, 110 300 C 90 380, 30 450, -20 490 C 40 410, 60 310, 40 210 C 20 120, 0 30, -20 -10 Z" fill="#0d3b2b" />
                <path d="M0 40 C 100 110, 160 230, 130 350 C 110 420, 50 490, 20 520 C 60 450, 80 360, 60 270 C 40 190, 20 100, 0 40 Z" fill="#144d39" />
              </g>
            </svg>
          </div>

          {/* Drifting Organic Ambient Blobs */}
          <div className="gallery-goo-container" aria-hidden="true">
            <div className="ggoo-blob ggoo-blob-1" />
            <div className="ggoo-blob ggoo-blob-2" />
            <div className="ggoo-blob ggoo-blob-3" />
            <div className="ggoo-blob ggoo-blob-4" />
          </div>

          {/* Golden Curved Light Streak Along Bottom Edge + Bright Center Flare */}
          <div className="gallery-bottom-streak-wrapper" aria-hidden="true">
            <svg viewBox="0 0 1400 90" fill="none" preserveAspectRatio="none" className="gallery-streak-svg">
              <path
                d="M-50 78 C 300 78, 540 68, 700 48 C 860 28, 1100 68, 1450 78"
                stroke="url(#galleryStreakGrad)"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
              <path
                d="M-50 78 C 300 78, 540 68, 700 48 C 860 28, 1100 68, 1450 78"
                stroke="rgba(255, 235, 175, 0.45)"
                strokeWidth="6"
                strokeLinecap="round"
                filter="blur(3px)"
              />
              <defs>
                <linearGradient id="galleryStreakGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#e8c070" stopOpacity="0" />
                  <stop offset="35%" stopColor="#e8c070" stopOpacity="0.75" />
                  <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
                  <stop offset="65%" stopColor="#e8c070" stopOpacity="0.75" />
                  <stop offset="100%" stopColor="#e8c070" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
            <div className="gallery-center-flare" />
          </div>
        </div>

        {/* Panel Content Layout */}
        <div className="gallery-panel-content">
          {/* Left Column: Eyebrow, Title, Description, Buttons */}
          <div className="gallery-hero-left">
            <div className="gallery-hero-eyebrow">
              <span>HANGERHOME GALLERY</span>
            </div>

            <h1 className="gallery-hero-title">
              Explore HangerHome
            </h1>

            <p className="gallery-hero-description">
              Browse real on-site installations, mechanism details, and demonstrations.
            </p>

            <div className="gallery-hero-actions">
              <button
                type="button"
                className="gallery-btn-primary conic-light-btn"
                onClick={handleScrollToGrid}
              >
                <span className="btn-conic-glow-border" />
                <span className="btn-label-text">View Installations</span>
                <ArrowRight size={17} className="btn-icon-arrow" />
                <div className="btn-goo-accent" />
              </button>

              <button
                type="button"
                className="gallery-btn-secondary conic-light-btn"
                onClick={() => setVideoModalOpen(true)}
                aria-label="View Products in action"
              >
                <span className="btn-conic-glow-border" />
                <span className="play-circle-icon">
                  <Play size={12} fill="#e8c070" stroke="#e8c070" />
                </span>
                <span className="btn-label-text">View Products</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Card Stage: Absolutely positioned in the right 48% of the hero panel */}
        <div className="gallery-cards-stage" aria-label="Tilted photo cards showcase">
          {/* Small top-right card (38% width, 4/3, right -2%, top 4%, rotate +4deg, z-index 1) */}
          <div
            className="gallery-tilted-card card-top-bg conic-card-glow"
            onClick={() => onCardClick(cardTop, 'Modern Wardrobe & Organization')}
            role="button"
            tabIndex={0}
            aria-label="View modern wardrobe installation photo"
            onKeyDown={e => e.key === 'Enter' && onCardClick(cardTop, 'Modern Wardrobe & Organization')}
          >
            <div className="card-conic-glow-border" />
            <div className="card-image-wrap">
              <img
                src={cardTop}
                alt="Modern Wardrobe & Organization"
                loading="eager"
              />
            </div>
          </div>

          {/* Large card (66% width, 4/3, left 2%, top 18%, rotate -6deg, z-index 2) */}
          <div
            className="gallery-tilted-card card-main-living conic-card-glow"
            onClick={() => onCardClick(cardLiving, 'Living Room Ceiling Hanger System')}
            role="button"
            tabIndex={0}
            aria-label="View living room ceiling hanger system"
            onKeyDown={e => e.key === 'Enter' && onCardClick(cardLiving, 'Living Room Ceiling Hanger System')}
          >
            <div className="card-conic-glow-border" />
            <div className="card-image-wrap">
              <img
                src={cardLiving}
                alt="Living Room Ceiling Hanger System"
                loading="eager"
              />
            </div>
          </div>

          {/* Lower-right card (46% width, 4/5, right 4%, bottom 8%, rotate +6deg, z-index 3) */}
          <div
            className="gallery-tilted-card card-shoe-rack conic-card-glow"
            onClick={() => onCardClick(cardShoes, 'Wall-Mounted Lit Shoe Cabinet')}
            role="button"
            tabIndex={0}
            aria-label="View wall-mounted shoe cabinet"
            onKeyDown={e => e.key === 'Enter' && onCardClick(cardShoes, 'Wall-Mounted Lit Shoe Cabinet')}
          >
            <div className="card-conic-glow-border" />
            <div className="card-image-wrap">
              <img
                src={cardShoes}
                alt="Wall-Mounted Lit Shoe Cabinet"
                loading="eager"
              />
            </div>
          </div>

          {/* "Real Installations" circular badge (22% width, max 125px, right 0, top 38%, z-index 5) */}
          <div className="gallery-real-badge conic-badge-glow" aria-label="Real Installations Verified Badge">
            <div className="badge-conic-glow-border" />
            <div className="badge-inner">
              <span className="badge-text-real">Real</span>
              <span className="badge-text-inst">Installations</span>
            </div>
          </div>
        </div>
      </section>

      {/* Video Demonstration Modal */}
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
              <video autoPlay controls playsInline poster="/media/hanger-1.jpg">
                <source src="/media/hanger-demo.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
