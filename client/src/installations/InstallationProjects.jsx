import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers, Home, Maximize2, ShieldCheck, Package, Sparkles, X } from 'lucide-react';

const projects = [
  {
    image: '/media/hanger-1.jpg',
    tag: 'Ceiling Mounted',
    icon: Layers,
    title: 'Precision ceiling drying system'
  },
  {
    image: '/media/hanger-2.jpg',
    tag: 'Balcony Installation',
    icon: Home,
    title: 'Apartment balcony drying installation'
  },
  {
    image: '/media/hanger-3.jpg',
    tag: 'Indoor Installation',
    icon: Maximize2,
    title: 'Utility area ceiling drying rack'
  },
  {
    image: '/media/hanger-4.jpg',
    tag: 'Wall Mounted',
    icon: ShieldCheck,
    title: 'Foldable stainless steel wall hanger'
  },
  {
    image: '/media/hanger-5.jpg',
    tag: 'Balcony System',
    icon: Home,
    title: 'Weatherproof ceiling hanger system'
  },
  {
    image: '/media/hanger-6.jpg',
    tag: 'Custom Installation',
    icon: Sparkles,
    title: 'Bespoke high-ceiling installation'
  }
];

export function InstallationProjects() {
  const [activeImage, setActiveImage] = useState(null);

  return (
    <section className="section container install-section">
      <div className="install-projects-header">
        <div className="install-header" style={{ marginBottom: 0 }}>
          <span className="eyebrow">OUR INSTALLATION PROJECTS</span>
          <h2>Real Installations, Real Spaces</h2>
          <p>Explore photographs from our recent installation projects.</p>
        </div>
        <Link to="/gallery" className="install-btn-primary">
          View Full Gallery <ArrowRight size={16} />
        </Link>
      </div>

      <div className="install-projects-grid">
        {projects.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              className="install-project-card"
              key={idx}
              onClick={() => setActiveImage(item.image)}
              title="Click to view full image"
            >
              <img src={item.image} alt={item.title} loading="lazy" />
              <div className="install-project-tag">
                <Icon size={14} />
                <span>{item.tag}</span>
              </div>
            </div>
          );
        })}
      </div>

      {activeImage && (
        <div className="install-lightbox" onClick={() => setActiveImage(null)}>
          <button className="install-lightbox-close" onClick={() => setActiveImage(null)} aria-label="Close">
            <X size={20} />
          </button>
          <img src={activeImage} alt="Full view" className="install-lightbox-img" onClick={e => e.stopPropagation()} />
        </div>
      )}
    </section>
  );
}
