import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function GalleryPreview() {
  const previewItems = [
    {
      src: '/media/hanger-6.jpg',
      alt: 'Ceiling clothes drying installation in corridor space',
      title: 'Corridor Overhead System',
    },
    {
      src: '/media/hanger-2.jpg',
      alt: 'Balcony ceiling mounted pulley drying system',
      title: 'Utility Balcony Rack',
    },
    {
      src: '/media/hanger-3.jpg',
      alt: 'Precision stainless steel rods and ceiling mount',
      title: 'Stainless Rod Mechanism',
    },
    {
      src: '/media/hanger-4.jpg',
      alt: 'Full extension ceiling drying rack on balcony',
      title: 'Balcony Full Extension',
    },
  ];

  return (
    <section className="home-gallery-preview container" aria-label="Gallery Preview">
      <div className="home-gallery-header">
        <div>
          <span className="eyebrow">GALLERY PREVIEW</span>
          <h2 className="home-gallery-heading">Our Work in Real Spaces</h2>
          <p className="home-gallery-subtitle">
            Explore real installations and product images from our projects.
          </p>
        </div>

        <Link to="/gallery" className="home-gallery-view-all">
          Explore Gallery <ArrowRight size={15} />
        </Link>
      </div>

      <div className="home-gallery-strip">
        {previewItems.map((item, idx) => (
          <Link to="/gallery" className="home-gallery-card" key={idx} aria-label={item.title}>
            <img src={item.src} alt={item.alt} loading="lazy" />
            <div className="home-gallery-overlay">
              <span>{item.title}</span>
            </div>
          </Link>
        ))}

        {/* 5th Card: Dark Accent Card leading to full Gallery */}
        <Link to="/gallery" className="home-gallery-more-card" aria-label="View all photos and videos in gallery">
          <span className="home-gallery-more-count">+16</span>
          <span className="home-gallery-more-label">
            More Photos &amp; Videos <ArrowRight size={16} />
          </span>
        </Link>
      </div>
    </section>
  );
}
