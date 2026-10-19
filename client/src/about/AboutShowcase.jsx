import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const showcaseImages = [
  { url: '/media/hanger-1.jpg', label: 'Ceiling Drying System' },
  { url: '/media/hanger-4.jpg', label: 'Wall Mounted System' },
  { url: '/media/hanger-7.jpg', label: 'Balcony Utility Space' }
];

export function AboutShowcase() {
  return (
    <section className="about-showcase-section">
      <div className="container">
        <div className="install-projects-header">
          <div className="install-header" style={{ marginBottom: 0 }}>
            <span className="eyebrow">REAL ON-SITE WORK</span>
            <h2>Craftsmanship in Practice</h2>
            <p>Every photograph represents an authentic HangerHome installation completed in a residential setting.</p>
          </div>
          <Link to="/installations" className="install-btn-soft">
            View All Installations <ArrowRight size={15} />
          </Link>
        </div>

        <div className="about-showcase-grid">
          {showcaseImages.map((item, idx) => (
            <div className="about-showcase-item" key={idx}>
              <img src={item.url} alt={item.label} loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
