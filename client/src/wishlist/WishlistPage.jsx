import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowRight, Trash2, ArrowUpRight } from 'lucide-react';
import { img } from '../lib/api';
import './wishlist.css';

export function WishlistPage({ wishlist = [], removeFromWishlist, moveToCart, clearWishlist }) {
  const hasItems = wishlist && wishlist.length > 0;

  return (
    <section className="section container wishlist-page">
      <div className="wishlist-header">
        <div>
          <span className="eyebrow">SAVED PRODUCTS</span>
          <h1>My Wishlist</h1>
          <p className="wishlist-header-meta">
            {hasItems
              ? `${wishlist.length} ${wishlist.length === 1 ? 'product' : 'products'} saved to your personal collection`
              : 'Save items you love and revisit them anytime.'}
          </p>
        </div>
        {hasItems && clearWishlist && (
          <button
            type="button"
            className="wishlist-clear-btn"
            onClick={clearWishlist}
          >
            Clear Wishlist
          </button>
        )}
      </div>

      {hasItems ? (
        <div className="wishlist-grid">
          {wishlist.map((p, idx) => {
            const imageUrl = p.images?.[0]?.url || (typeof p.image === 'string' ? p.image : null);
            const price = Number(p.price || 0);
            const compareAt = Number(p.compareAtPrice || 0);

            return (
              <article className={`wishlist-card animated-light-border light-product light-phase-${(idx % 6) + 1}`} key={p._id || p.slug}>
                <div className="wishlist-card-media">
                  {imageUrl ? (
                    <img src={img(imageUrl)} alt={p.name} loading="lazy" />
                  ) : (
                    <div style={{ display: 'grid', placeItems: 'center', height: '100%', color: '#999' }}>
                      <Heart size={32} />
                    </div>
                  )}
                  <button
                    type="button"
                    className="wishlist-remove-btn"
                    title="Remove from wishlist"
                    aria-label={`Remove ${p.name} from wishlist`}
                    onClick={() => removeFromWishlist(p._id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="wishlist-card-body">
                  <span className="wishlist-card-cat">{p.category || 'Product'}</span>
                  <Link to={`/products/${p.slug}`} className="wishlist-card-title">
                    {p.name}
                  </Link>
                  <div className="wishlist-card-price">
                    <strong>₹{price.toLocaleString('en-IN')}</strong>
                    {compareAt > price && (
                      <del>₹{compareAt.toLocaleString('en-IN')}</del>
                    )}
                  </div>
                  <div className="wishlist-card-actions">
                    <button
                      type="button"
                      className="wishlist-move-btn"
                      onClick={() => moveToCart(p)}
                    >
                      <ShoppingBag size={15} /> Move to Cart
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="wishlist-empty">
          <div className="wishlist-empty-icon">
            <Heart size={32} />
          </div>
          <h2>Your wishlist is currently empty</h2>
          <p>
            Explore our precision ceiling drying hangers and space-saving shoe rack solutions, then click the heart icon to save your favorites.
          </p>
          <Link to="/products" className="btn btn-primary animated-light-button light-hero-btn light-phase-1">
            Explore Products <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </section>
  );
}
