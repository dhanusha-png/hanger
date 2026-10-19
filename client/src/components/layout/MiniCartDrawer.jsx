import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  X,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles
} from 'lucide-react';
import { img } from '../../lib/api';
import './minicart-drawer.css';

const FREE_SHIPPING_THRESHOLD = 3000;

export function MiniCartDrawer({
  isOpen,
  onClose,
  cart = [],
  total = 0,
  onUpdateQty,
  onRemove
}) {
  const navigate = useNavigate();
  const itemCount = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
  const freeShippingReached = total >= FREE_SHIPPING_THRESHOLD;
  const progressPercent = Math.min(100, Math.round((total / FREE_SHIPPING_THRESHOLD) * 100));
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - total);

  // Close on Escape key press & prevent body scroll
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleCheckoutClick = () => {
    onClose();
    navigate('/checkout');
  };

  const handleCartClick = () => {
    onClose();
    navigate('/cart');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Frosted Backdrop */}
          <motion.div
            className="hh-minicart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Slide Drawer */}
          <motion.aside
            className="hh-minicart-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            role="dialog"
            aria-modal="true"
            aria-label="Shopping Cart Drawer"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="hh-minicart-head">
              <div className="hh-minicart-title-group">
                <div className="hh-minicart-icon-pill">
                  <ShoppingCart size={17} />
                </div>
                <div>
                  <h3 className="hh-minicart-heading">Shopping Bag</h3>
                  <span className="hh-minicart-item-count">
                    {itemCount} {itemCount === 1 ? 'item' : 'items'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="hh-minicart-close-btn"
                onClick={onClose}
                aria-label="Close cart drawer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Free Shipping Progress Indicator */}
            <div className="hh-minicart-shipping-banner">
              <div className="hh-minicart-shipping-text">
                <Truck size={15} className="hh-minicart-truck-icon" />
                {freeShippingReached ? (
                  <span>
                    <strong>Free Delivery Unlocked!</strong> You’re getting standard shipping on us.
                  </span>
                ) : (
                  <span>
                    Add <strong>₹{amountToFreeShipping.toLocaleString('en-IN')}</strong> more for{' '}
                    <strong>Free Delivery</strong>
                  </span>
                )}
              </div>
              <div className="hh-minicart-progress-track">
                <motion.div
                  className={`hh-minicart-progress-fill ${freeShippingReached ? 'complete' : ''}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
            </div>

            {/* Cart Items List */}
            <div className="hh-minicart-body">
              {cart.length === 0 ? (
                <div className="hh-minicart-empty-state">
                  <div className="hh-minicart-empty-orb">
                    <ShoppingCart size={32} />
                  </div>
                  <h4>Your bag is empty</h4>
                  <p>Discover our precision ceiling hangers and luxury shoe organizers.</p>
                  <button
                    type="button"
                    className="hh-minicart-shop-btn"
                    onClick={() => {
                      onClose();
                      navigate('/products');
                    }}
                  >
                    <Sparkles size={14} /> Explore Collection
                  </button>
                </div>
              ) : (
                <div className="hh-minicart-items-list">
                  {cart.map((item) => (
                    <div className="hh-minicart-item-row" key={item.product}>
                      {/* Product Thumbnail */}
                      <div className="hh-minicart-thumb">
                        {item.image ? (
                          <img src={img(item.image)} alt={item.name} />
                        ) : (
                          <div className="hh-minicart-thumb-fallback">
                            <ShoppingCart size={18} />
                          </div>
                        )}
                      </div>

                      {/* Product Info & Controls */}
                      <div className="hh-minicart-info">
                        <div className="hh-minicart-name-row">
                          <h4 className="hh-minicart-name">{item.name}</h4>
                          <button
                            type="button"
                            className="hh-minicart-del-btn"
                            onClick={() => onRemove && onRemove(item.product)}
                            aria-label={`Remove ${item.name} from bag`}
                            title="Remove"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        <div className="hh-minicart-price-unit">
                          ₹{Number(item.price || 0).toLocaleString('en-IN')}
                        </div>

                        <div className="hh-minicart-actions-row">
                          {/* Quantity Stepper */}
                          <div className="hh-minicart-stepper">
                            <button
                              type="button"
                              onClick={() =>
                                onUpdateQty &&
                                onUpdateQty(item.product, Math.max(1, (item.qty || 1) - 1))
                              }
                              aria-label="Decrease quantity"
                              disabled={item.qty <= 1}
                            >
                              <Minus size={12} />
                            </button>
                            <span className="hh-minicart-qty-num">{item.qty || 1}</span>
                            <button
                              type="button"
                              onClick={() =>
                                onUpdateQty && onUpdateQty(item.product, (item.qty || 1) + 1)
                              }
                              aria-label="Increase quantity"
                            >
                              <Plus size={12} />
                            </button>
                          </div>

                          {/* Line Item Total */}
                          <div className="hh-minicart-line-total">
                            ₹{(Number(item.price || 0) * (item.qty || 1)).toLocaleString('en-IN')}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Drawer Footer with Subtotal & CTAs */}
            {cart.length > 0 && (
              <div className="hh-minicart-foot">
                {/* Subtotal line */}
                <div className="hh-minicart-subtotal-row">
                  <span className="hh-minicart-subtotal-label">Subtotal</span>
                  <span className="hh-minicart-subtotal-val">
                    ₹{total.toLocaleString('en-IN')}
                  </span>
                </div>

                <p className="hh-minicart-tax-note">
                  Shipping & taxes calculated during checkout. Installation can be requested at booking.
                </p>

                {/* Primary & Secondary Buttons */}
                <div className="hh-minicart-btn-group">
                  <button
                    type="button"
                    className="hh-minicart-checkout-btn"
                    onClick={handleCheckoutClick}
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight size={16} />
                  </button>
                  <button
                    type="button"
                    className="hh-minicart-viewbag-btn"
                    onClick={handleCartClick}
                  >
                    View Full Bag
                  </button>
                </div>

                {/* Trust line */}
                <div className="hh-minicart-trust-note">
                  <ShieldCheck size={14} className="hh-minicart-shield" />
                  <span>Secure checkout with Razorpay Demo & Cash on Delivery</span>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
