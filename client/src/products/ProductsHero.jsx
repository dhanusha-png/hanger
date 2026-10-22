import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  ChevronDown,
  ArrowRight,
  Play,
  Plus,
  Award,
  Wrench,
  Home,
  Headphones
} from 'lucide-react';

// Custom SVG Icons matching target luxury design
export function HangerIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3a2 2 0 0 0-2 2c0 1.1.9 2 2 2 1.5 0 2 .8 2 2v1" />
      <path d="M12 10 2.5 17a1 1 0 0 0 .6 1.7h17.8a1 1 0 0 0 .6-1.7L12 10Z" />
    </svg>
  );
}

export function CeilingPulleyIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 5h18" />
      <path d="M6 5v14" />
      <path d="M10 5v14" />
      <path d="M14 5v14" />
      <path d="M18 5v14" />
      <circle cx="6" cy="19" r="1.5" />
      <circle cx="10" cy="19" r="1.5" />
      <circle cx="14" cy="19" r="1.5" />
      <circle cx="18" cy="19" r="1.5" />
    </svg>
  );
}

export function WallHangerIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 10h16" />
      <path d="M8 10c0 4-3 6-3 6" />
      <path d="M16 10c0 4-3 6-3 6" />
      <circle cx="5" cy="16" r="1.5" />
      <circle cx="13" cy="16" r="1.5" />
      <path d="M12 4v6" />
    </svg>
  );
}

export function ShoeIcon(props) {
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

export function StorageBoxIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}

export function RulerTriangleIcon(props) {
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

export function ProductsHero({
  products = [],
  query = '',
  setQuery = () => {},
  sort = 'featured',
  setSort = () => {},
  category = 'All',
  selectCategory = () => {},
  tag = 'All',
  setTag = () => {},
  onBrowseClick = () => {},
}) {
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  // Dynamic counts derived from real catalog
  const totalCount = products.length || 20;
  const hangerProducts = products.filter(p => p.category === 'Hangers');
  const shoeProducts = products.filter(p => p.category === 'Shoe Racks');

  const ceilingCount = hangerProducts.length > 0
    ? Math.max(1, hangerProducts.filter(p => (p.name || '').toLowerCase().includes('ceiling') || (p.tags || []).some(t => t.toLowerCase().includes('ceiling')) || (p.name || '').toLowerCase().includes('balcony')).length)
    : 4;

  const wallCount = hangerProducts.length > 0
    ? Math.max(1, hangerProducts.filter(p => (p.name || '').toLowerCase().includes('wall') || (p.tags || []).some(t => t.toLowerCase().includes('wall') || t.toLowerCase().includes('foldable'))).length)
    : 6;

  const shoeCount = shoeProducts.length > 0 ? shoeProducts.length : 10;

  // Real product links
  const ceilingProduct = hangerProducts.find(p => (p.name || '').toLowerCase().includes('ceiling') || (p.name || '').toLowerCase().includes('balcony')) || hangerProducts[0] || products[0];
  const shoeProduct = shoeProducts[0] || products[1] || products[0];

  const ceilingLink = ceilingProduct ? `/products/${ceilingProduct.slug}` : '/products/compact-balcony-drying-hanger';
  const shoeLink = shoeProduct ? `/products/${shoeProduct.slug}` : '/products/compact-3-tier-shoe-rack';

  const categoryCards = [
    {
      id: 'all',
      title: 'All Products',
      subtitle: `${totalCount} Products`,
      icon: HangerIcon,
      active: category === 'All' && tag === 'All',
      onClick: () => {
        selectCategory('All');
        setTag('All');
      },
    },
    {
      id: 'ceiling',
      title: 'Ceiling Hangers',
      subtitle: `${ceilingCount} Products`,
      icon: CeilingPulleyIcon,
      active: category === 'Ceiling Hangers' || (category === 'Hangers' && tag === 'Ceiling'),
      onClick: () => {
        selectCategory('Ceiling Hangers');
      },
    },
    {
      id: 'wall',
      title: 'Wall Hangers',
      subtitle: `${wallCount} Products`,
      icon: WallHangerIcon,
      active: category === 'Wall Hangers' || (category === 'Hangers' && tag === 'Wall'),
      onClick: () => {
        selectCategory('Wall Hangers');
      },
    },
    {
      id: 'shoes',
      title: 'Shoe Racks',
      subtitle: `${shoeCount} Products`,
      icon: ShoeIcon,
      active: category === 'Shoe Racks',
      onClick: () => {
        selectCategory('Shoe Racks');
        setTag('All');
      },
    },
    {
      id: 'storage',
      title: 'Storage Solutions',
      subtitle: 'Practical Storage',
      icon: StorageBoxIcon,
      active: category === 'Storage Solutions',
      onClick: () => {
        selectCategory('Storage Solutions');
      },
    },
    {
      id: 'custom',
      title: 'Custom Solutions',
      subtitle: 'Made for Your Space',
      icon: RulerTriangleIcon,
      active: category === 'Custom Solutions',
      onClick: () => {
        selectCategory('Custom Solutions');
      },
    },
  ];

  const handleBrowseScroll = () => {
    if (onBrowseClick) onBrowseClick();
    const target = document.querySelector('.products-catalog-anchor') || document.querySelector('.catalog-section');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="products-hero-master">
      {/* SVG Gooey Filter Definition */}
      <svg className="products-goo-defs" aria-hidden="true" style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
        <defs>
          <filter id="products-gooey-effect">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Full-Bleed Viewport Hero Section with Centered Layout */}
      <section className="products-hero-section centered-hero-mode" aria-label="Products Collection Introduction">
        {/* Background Image with slow Ken Burns effect (1 -> 1.05) */}
        <div className="products-hero-bg-frame">
          <div
            className="products-hero-bg-image"
            style={{
              backgroundImage: 'url(/products/products-hero-bg.webp), url(/products/products-hero-bg.jpg), url(/src/assets/products/products-hero-bg.jpg)',
            }}
          />
          {/* Dark green radial gradient centered behind the text block + top/bottom vignette */}
          <div className="products-hero-gradient-overlay" />
          <div className="products-hero-vignette-overlay" />

          {/* Soft Organic Gooey Blobs behind the centered headline */}
          <div className="products-hero-goo-container centered-goo" aria-hidden="true">
            <div className="pgoo-blob pgoo-blob-1" />
            <div className="pgoo-blob pgoo-blob-2" />
            <div className="pgoo-blob pgoo-blob-3" />
            <div className="pgoo-blob pgoo-blob-4" />
          </div>
        </div>

        {/* Desktop Left Floating Card & Hotspot: Wall Shoe Rack ₹1,899 */}
        <div className="products-floating-stage stage-left">
          <div className="products-hotspot-wrap hotspot-left-shoe">
            <button
              type="button"
              className="products-hotspot-pin"
              onClick={() => setActiveHotspot(activeHotspot === 'shoe' ? null : 'shoe')}
              aria-label="View Wall Shoe Rack card"
            >
              <span className="photspot-pulse-ring ring-1" />
              <span className="photspot-pulse-ring ring-2" />
              <span className="photspot-pin-core">
                <Plus size={15} strokeWidth={2.8} />
              </span>
            </button>

            <div className={`products-floating-card conic-card-glow delay-float ${activeHotspot === 'shoe' ? 'touch-open' : ''}`}>
              <div className="card-conic-glow-border" />
              <Link to={shoeLink} className="pcard-thumb">
                <img
                  src="/products/card-shoe-rack.jpg"
                  alt="Wall Shoe Rack"
                  onError={e => { e.currentTarget.src = '/products/shoe-rack-compact-3-tier.jpg'; }}
                />
              </Link>
              <div className="pcard-info">
                <h4 className="pcard-title">Wall Shoe Rack</h4>
                <div className="pcard-price">₹1,899</div>
                <Link to={shoeLink} className="pcard-link">
                  View Product →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Right Floating Card & Hotspot: Retractable Ceiling Hanger ₹2,999 + Curved Dotted Gold Line */}
        <div className="products-floating-stage stage-right">
          {/* Curved Dotted Gold Line connecting toward ceiling hanger in top center */}
          <svg className="ceiling-connector-svg" viewBox="0 0 320 220" fill="none" aria-hidden="true">
            <path
              d="M 280 180 C 220 130, 120 70, 20 20"
              stroke="#e8c070"
              strokeWidth="1.6"
              strokeDasharray="4 4"
              strokeOpacity="0.85"
            />
            <circle cx="20" cy="20" r="3.5" fill="#e8c070" />
            <circle cx="20" cy="20" r="7" stroke="#e8c070" strokeWidth="1" strokeOpacity="0.45" />
          </svg>

          <div className="products-hotspot-wrap hotspot-right-ceiling">
            <button
              type="button"
              className="products-hotspot-pin"
              onClick={() => setActiveHotspot(activeHotspot === 'ceiling' ? null : 'ceiling')}
              aria-label="View Retractable Ceiling Hanger card"
            >
              <span className="photspot-pulse-ring ring-1" />
              <span className="photspot-pulse-ring ring-2" />
              <span className="photspot-pin-core">
                <Plus size={15} strokeWidth={2.8} />
              </span>
            </button>

            <div className={`products-floating-card conic-card-glow ${activeHotspot === 'ceiling' ? 'touch-open' : ''}`}>
              <div className="card-conic-glow-border" />
              <Link to={ceilingLink} className="pcard-thumb">
                <img
                  src="/products/card-ceiling-hanger.jpg"
                  alt="Retractable Ceiling Hanger"
                  onError={e => { e.currentTarget.src = '/products/hanger-compact-balcony.jpg'; }}
                />
              </Link>
              <div className="pcard-info">
                <h4 className="pcard-title">Retractable Ceiling Hanger</h4>
                <div className="pcard-price">₹2,999</div>
                <Link to={ceilingLink} className="pcard-link">
                  View Product →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Centered Main Hero Content */}
        <div className="products-hero-container centered-hero-container">
          <div className="products-hero-centered-content">
            {/* Eyebrow */}
            <div className="products-hero-eyebrow centered-eyebrow">
              <span>PRODUCT COLLECTION</span>
            </div>

            {/* 2-Line Centered Headline: "Premium Solutions" in white, "for Every Space" in gold */}
            <h1 className="products-hero-title centered-title">
              <span className="p-title-line">Premium Solutions</span>
              <span className="p-title-line p-title-gold">for Every Space</span>
            </h1>

            {/* Centered Lead Paragraph: max-width ~720px */}
            <p className="products-hero-description centered-description">
              Discover our complete range of ceiling hangers, wall hangers, shoe racks and storage solutions — designed for modern homes.
            </p>

            {/* Centered CTAs Side-by-Side */}
            <div className="products-hero-actions centered-actions">
              <button
                type="button"
                className="products-btn-primary conic-light-btn"
                onClick={handleBrowseScroll}
              >
                <span className="btn-conic-glow-border" />
                <span className="btn-label-text">Browse All Products</span>
                <ArrowRight size={17} className="btn-icon-arrow" />
                <div className="btn-goo-accent" />
              </button>

              <button
                type="button"
                className="products-btn-secondary conic-light-btn"
                onClick={() => setVideoModalOpen(true)}
                aria-label="Watch Collection video"
              >
                <span className="btn-conic-glow-border" />
                <span className="play-circle-icon">
                  <Play size={12} fill="#e8c070" stroke="#e8c070" />
                </span>
                <span className="btn-label-text">Watch Collection</span>
              </button>
            </div>

            {/* Handwritten Script Tag: centered under the buttons */}
            <div className="products-script-centered">
              <span className="p-script-line">Organised Homes, Happier Lives</span>
              <svg viewBox="0 0 60 14" fill="none" className="p-script-underline-centered" aria-hidden="true">
                <path d="M2 7 C 20 12, 42 11, 58 3" stroke="#e8c070" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>

            {/* Feature Row: Centered in one line, no scrollbar, wraps to 2x2 on mobile */}
            <div className="products-feature-strip centered-feature-strip">
              <div className="products-feature-item">
                <div className="feature-icon-circle">
                  <Award size={16} />
                </div>
                <div className="feature-item-text">
                  <strong>Premium</strong>
                  <span>Quality</span>
                </div>
              </div>

              <div className="products-feature-item">
                <div className="feature-icon-circle">
                  <Wrench size={15} />
                </div>
                <div className="feature-item-text">
                  <strong>Professional</strong>
                  <span>Installation</span>
                </div>
              </div>

              <div className="products-feature-item">
                <div className="feature-icon-circle">
                  <Home size={15} />
                </div>
                <div className="feature-item-text">
                  <strong>Modern</strong>
                  <span>Design</span>
                </div>
              </div>

              <div className="products-feature-item">
                <div className="feature-icon-circle">
                  <Headphones size={15} />
                </div>
                <div className="feature-item-text">
                  <strong>Service</strong>
                  <span>Support</span>
                </div>
              </div>
            </div>

            {/* Mobile / Tablet Row of the two floating cards */}
            <div className="products-mobile-cards-row">
              <div className="products-floating-card conic-card-glow mobile-card-inline">
                <div className="card-conic-glow-border" />
                <Link to={shoeLink} className="pcard-thumb">
                  <img
                    src="/products/card-shoe-rack.jpg"
                    alt="Wall Shoe Rack"
                    onError={e => { e.currentTarget.src = '/products/shoe-rack-compact-3-tier.jpg'; }}
                  />
                </Link>
                <div className="pcard-info">
                  <h4 className="pcard-title">Wall Shoe Rack</h4>
                  <div className="pcard-price">₹1,899</div>
                  <Link to={shoeLink} className="pcard-link">View Product →</Link>
                </div>
              </div>

              <div className="products-floating-card conic-card-glow mobile-card-inline">
                <div className="card-conic-glow-border" />
                <Link to={ceilingLink} className="pcard-thumb">
                  <img
                    src="/products/card-ceiling-hanger.jpg"
                    alt="Retractable Ceiling Hanger"
                    onError={e => { e.currentTarget.src = '/products/hanger-compact-balcony.jpg'; }}
                  />
                </Link>
                <div className="pcard-info">
                  <h4 className="pcard-title">Retractable Ceiling Hanger</h4>
                  <div className="pcard-price">₹2,999</div>
                  <Link to={ceilingLink} className="pcard-link">View Product →</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1 (Odd): Search & Sort Bar + Shop by Category (Dark Emerald #061C14) */}
      <div className="home-tonal-odd" style={{ paddingTop: '32px', paddingBottom: '16px' }}>
        {/* Target Search & Sort Bar (Wide Glass Bar Below Hero) */}
        <div className="products-search-bar-wrapper" style={{ marginTop: 0 }}>
          <div className="products-search-bar-card conic-bar-glow">
            <div className="bar-conic-glow-border" />
            <div className="search-bar-inner">
              <div className="search-input-group">
                <span className="search-icon-circle">
                  <Search size={16} />
                </span>
                <input
                  type="text"
                  className="search-input-field"
                  placeholder="Search products, categories or features..."
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  aria-label="Search products, categories or features"
                />
              </div>

              <div className="sort-dropdown-group">
                <span className="sort-by-label">Sort by</span>
                <div className="sort-select-wrapper">
                  <select
                    value={sort}
                    onChange={e => setSort(e.target.value)}
                    className="sort-select-control"
                    aria-label="Sort products by"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: low to high</option>
                    <option value="price-high">Price: high to low</option>
                    <option value="name">Name</option>
                  </select>
                  <ChevronDown size={14} className="sort-chevron-icon" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Target Shop by Category Section (6 Horizontal Quick Cards) */}
        <section className="products-category-section" aria-label="Shop by Category">
          <div className="category-section-header">
            <h2 className="category-section-title">Shop by Category</h2>
            <button
              type="button"
              className="category-view-all-link"
              onClick={() => {
                selectCategory('All');
                setTag('All');
                setQuery('');
              }}
            >
              View All Products →
            </button>
          </div>

          {/* 6 Category Cards Row */}
          <div className="category-cards-grid">
            {categoryCards.map(cat => {
              const IconComp = cat.icon;
              return (
                <div
                  key={cat.id}
                  className={`category-item-card ${cat.active ? 'active conic-card-glow' : ''}`}
                  onClick={cat.onClick}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && cat.onClick()}
                >
                  {cat.active && <div className="card-conic-glow-border" />}
                  <div className="category-card-icon-box">
                    <IconComp size={24} className="category-gold-icon" />
                  </div>
                  <div className="category-card-body">
                    <strong className="category-card-name">{cat.title}</strong>
                    <span className="category-card-count">{cat.subtitle}</span>
                  </div>
                  <ArrowRight size={15} className="category-card-arrow" />
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Anchor for Smooth Scroll */}
      <div className="products-catalog-anchor" />

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
              <video autoPlay controls playsInline poster="/products/products-hero-bg.jpg">
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
