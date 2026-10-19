import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Wrench } from 'lucide-react';

export function AboutCTA() {
  return (
    <div className="container" style={{ paddingBottom: '30px' }}>
      <div className="about-cta-banner">
        <div className="about-cta-content">
          <h2>Let's create a solution for your space.</h2>
          <p>
            Whether you are outfitting a new balcony, replacing an older clothesline, or organizing an entryway, we are here to help.
          </p>
        </div>

        <div className="about-cta-btns">
          <Link to="/products" className="install-cta-btn-white">
            Explore Products <ArrowRight size={16} />
          </Link>
          <Link to="/installations#service-solutions" className="install-cta-btn-outline">
            <Wrench size={16} /> Explore Services
          </Link>
        </div>
      </div>
    </div>
  );
}
