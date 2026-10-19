import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { img } from '../lib/api';

export function FeaturedSolutions({ products, onAdd, onWishlist = () => {}, isInWishlist = () => false }) {
  const [activeCategory, setActiveCategory] = useState('All');
  // Specific 5 signature products highlighted in Reference Image 5 (matching exact slugs/types)
  const signatureSlugs = [
    'compact-balcony-drying-hanger',
    'multi-tier-folding-clothes-drying-rack',
    'slim-entryway-shoe-rack',
    'premium-4-tier-shoe-organizer',
    'premium-wall-mounted-clothes-hanger',
  ];

  // Pick top 5 featured items matching the reference, or dynamic filtered items
  const displayProducts = useMemo(() => {
    if (!products || !products.length) return [];

    let filtered = products;
    if (activeCategory !== 'All') {
      filtered = products.filter(p => p.category === activeCategory);
    } else {
      // Sort to prioritize the 5 signature reference products on "All" view
      filtered = [...products].sort((a, b) => {
        const aIdx = signatureSlugs.indexOf(a.slug);
        const bIdx = signatureSlugs.indexOf(b.slug);
        if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
        if (aIdx !== -1) return -1;
        if (bIdx !== -1) return 1;
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
    }

    return filtered.slice(0, 5);
  }, [products, activeCategory]);

  return (
    <section className="home-featured-section container" aria-label="Signature Home Solutions">
      {/* Header with Title, Category Tabs and View All Link */}
      <div className="home-featured-header">
        <div className="home-featured-title-group">
          <span className="eyebrow">FEATURED COLLECTION</span>
          <h2 className="home-featured-heading">Signature Home Solutions</h2>
          <p className="home-featured-subtitle">
            Thoughtful drying systems and space-saving shoe storage engineered for modern living.
          </p>
        </div>

        <div className="home-featured-nav-group">
          <div className="home-featured-tabs" role="tablist">
            {['All', 'Hangers', 'Shoe Racks'].map(cat => (
              <button
                key={cat}
                type="button"
                className={`home-featured-tab ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
                role="tab"
                aria-selected={activeCategory === cat}
              >
                {cat}
              </button>
            ))}
          </div>

          <Link to="/products" className="home-featured-view-all">
            View All Products <ArrowRight size={15} />
          </Link>
        </div>
      </div>

      {/* 5 Compact Product Cards Grid */}
      <div className="home-compact-product-grid">
        {displayProducts.map((product, idx) => {
          const isWishlisted = isInWishlist(product._id);
          const hasImage = Boolean(product.images?.[0]?.url);
          const imageUrl = hasImage ? img(product.images[0].url) : '/products/hanger-premium-wall-mounted.jpg';

          return (
            <article className={`home-compact-card animated-light-border light-product light-phase-${(idx % 6) + 1}`} key={product._id || product.slug}>
              <div className="home-compact-media-wrap">
                <Link to={`/products/${product.slug}`} className="home-compact-media-link" aria-label={`View ${product.name}`}>
                  <img
                    src={imageUrl}
                    alt={product.images?.[0]?.alt || product.name}
                    className="home-compact-img"
                    loading="lazy"
                  />
                </Link>

                {/* Wishlist Heart Button */}
                <button
                  type="button"
                  className={`home-compact-wishlist ${isWishlisted ? 'liked' : ''}`}
                  onClick={e => { e.preventDefault(); e.stopPropagation(); onWishlist(product); }}
                  aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                  title="Save to wishlist"
                >
                  <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
                </button>
              </div>

              <div className="home-compact-body">
                <span className="home-compact-category">{product.category}</span>
                <Link to={`/products/${product.slug}`} className="home-compact-title">
                  <h3>{product.name}</h3>
                </Link>

                <div className="home-compact-footer">
                  <div className="home-compact-price-wrap">
                    <strong className="home-compact-price">
                      ₹{Number(product.price || 0).toLocaleString('en-IN')}
                    </strong>
                    {product.compareAtPrice > product.price && (
                      <del className="home-compact-compare">
                        ₹{Number(product.compareAtPrice).toLocaleString('en-IN')}
                      </del>
                    )}
                  </div>

                  <button
                    type="button"
                    className="home-compact-cart-btn"
                    onClick={() => onAdd(product, 1)}
                    aria-label={`Add ${product.name} to cart`}
                    title="Add to Cart"
                  >
                    <ShoppingBag size={16} />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
