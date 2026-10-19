import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, ArrowRight, Maximize2, ShieldCheck, Heart, Award, X } from 'lucide-react';

export function InstallationShowcase() {
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  const benefits = [
    {
      icon: Maximize2,
      title: 'Space Optimised',
      desc: 'Better utilisation',
    },
    {
      icon: ShieldCheck,
      title: 'Professional Setup',
      desc: 'Reliable installation',
    },
    {
      icon: Heart,
      title: 'Clean & Minimal',
      desc: 'Modern look',
    },
    {
      icon: Award,
      title: 'Built for Daily Use',
      desc: 'Long-lasting performance',
    },
  ];

  return (
    <>
      <section className="home-installation-section container" aria-label="Installation Showcase">
        <div className="home-installation-grid">
          {/* Left Column: Composite Visual Collage with Play Button */}
          <div className="home-installation-collage">
            <div className="home-installation-main-frame">
              <img
                src="/media/hanger-1.jpg"
                alt="Real HangerHome ceiling pulley installation"
                className="home-installation-main-img"
                loading="lazy"
              />
              <button
                type="button"
                className="home-installation-play-btn"
                onClick={() => setVideoModalOpen(true)}
                aria-label="Play installation demonstration video"
                title="Watch Installation Video"
              >
                <Play size={24} fill="currentColor" />
              </button>
            </div>

            {/* Overlapping Floating Detail Photos */}
            <div className="home-installation-float-top">
              <img
                src="/media/hanger-2.jpg"
                alt="Ceiling drying rack detail view"
                loading="lazy"
              />
            </div>
            <div className="home-installation-float-bottom">
              <img
                src="/media/hanger-7.jpg"
                alt="Smooth-action pulley system setup"
                loading="lazy"
              />
            </div>
          </div>

          {/* Right Column: Information & Key Benefits */}
          <div className="home-installation-content">
            <span className="eyebrow">INSTALLATIONS</span>
            <h2 className="home-installation-heading">See real installations</h2>
            <p className="home-installation-desc">
              Explore actual installations from our projects and get inspired for your space.
            </p>

            <Link to="/installations" className="btn btn-primary btn-lg home-installation-cta">
              View Installations <ArrowRight size={17} />
            </Link>

            <div className="home-installation-benefits-grid">
              {benefits.map((b, idx) => {
                const Icon = b.icon;
                return (
                  <div className="home-inst-benefit-item" key={idx}>
                    <div className="home-inst-benefit-icon-box">
                      <Icon size={20} className="home-inst-benefit-icon" />
                    </div>
                    <div>
                      <strong className="home-inst-benefit-title">{b.title}</strong>
                      <span className="home-inst-benefit-sub">{b.desc}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal Player */}
      {videoModalOpen && (
        <div
          className="catalog-lightbox catalog-video-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Hanger installation video player"
          onClick={() => setVideoModalOpen(false)}
        >
          <button
            className="catalog-lightbox-close"
            type="button"
            onClick={() => setVideoModalOpen(false)}
            aria-label="Close video player"
          >
            <X size={24} />
          </button>
          <video
            controls
            autoPlay
            poster="/media/hanger-1.jpg"
            onClick={e => e.stopPropagation()}
            className="home-video-player"
          >
            <source src="/media/hanger-demo.mp4" type="video/mp4" />
            Your browser does not support HTML5 video playback.
          </video>
        </div>
      )}
    </>
  );
}
