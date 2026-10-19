import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function HomeCTA() {
  return (
    <section className="home-cta-section container" aria-label="Call to Action">
      <div className="home-cta-card">
        {/* Decorative Botanical Leaf Graphic (Left) */}
        <div className="home-cta-leaves" aria-hidden="true">
          <svg viewBox="0 0 200 180" fill="none" className="home-cta-leaf-svg">
            <path
              d="M30 160C25 110 50 60 110 40C85 85 90 130 140 160C100 165 60 170 30 160Z"
              fill="#144638"
              opacity="0.85"
            />
            <path
              d="M70 170C60 130 90 90 150 70C130 110 135 150 185 170C150 175 110 175 70 170Z"
              fill="#1C5E4C"
              opacity="0.75"
            />
            <path
              d="M10 175C12 145 35 120 75 110C60 135 65 160 95 175C70 178 40 180 10 175Z"
              fill="#0E382D"
              opacity="0.9"
            />
          </svg>
        </div>

        <div className="home-cta-content">
          <h2 className="home-cta-title">Let's build a smarter space.</h2>
          <p className="home-cta-desc">
            From product selection to installation and custom solutions, HangerHome helps you make better use of every space.
          </p>
        </div>

        <div className="home-cta-actions">
          <Link to="/products" className="btn btn-light btn-lg home-cta-btn-white animated-light-button light-final-cta light-phase-1">
            Explore Products <ArrowRight size={17} />
          </Link>
          <Link to="/service-booking" className="btn btn-outline-white btn-lg home-cta-btn-outline animated-light-button light-hero-btn light-phase-3">
            Book a Service <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}
