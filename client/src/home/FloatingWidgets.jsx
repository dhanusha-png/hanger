import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, MessageCircle, Phone } from 'lucide-react';
import { MiniCartDrawer } from '../components/layout/MiniCartDrawer';

export function FloatingWidgets({
  cart = [],
  total = 0,
  onUpdateQty,
  onRemove,
  chat,
  setChat,
  onOpenCart
}) {
  const [localDrawerOpen, setLocalDrawerOpen] = useState(false);
  const [bottomOffset, setBottomOffset] = useState(() => (typeof window !== 'undefined' && window.innerWidth <= 768 ? 18 : 24));
  const stackRef = useRef(null);
  const itemCount = cart.reduce((sum, item) => sum + (item.qty || 1), 0);

  useEffect(() => {
    let ticking = false;

    const updateStackPosition = () => {
      const footerBottom = document.querySelector('.hh-footer-bottom-container');
      const stack = stackRef.current;
      const isMobile = window.innerWidth <= 768;
      const defaultBottom = isMobile ? 16 : 24;

      if (!footerBottom || !stack) {
        setBottomOffset(defaultBottom);
        ticking = false;
        return;
      }

      const rect = footerBottom.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // When the bottom copyright / legal bar enters the viewport
      if (rect.top < viewportHeight) {
        const overlap = Math.max(0, viewportHeight - rect.top);
        const maxLift = isMobile ? 76 : 88;
        const targetBottom = defaultBottom + Math.min(overlap, maxLift);
        setBottomOffset(targetBottom);
      } else {
        setBottomOffset(defaultBottom);
      }
      ticking = false;
    };

    const onScrollOrResize = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateStackPosition);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });
    updateStackPosition();

    return () => {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, []);

  const handleCartClick = () => {
    if (onOpenCart) {
      onOpenCart();
    } else {
      window.dispatchEvent(new CustomEvent('hh-open-cart-drawer'));
      setLocalDrawerOpen(true);
    }
  };

  return (
    <>
      <aside
        ref={stackRef}
        className="home-floating-stack"
        aria-label="Quick Actions"
        style={{
          bottom: `calc(${bottomOffset}px + env(safe-area-inset-bottom, 0px))`
        }}
      >
        {/* 1. Direct WhatsApp Action with pulsing aura */}
        <a
          href="https://wa.me/919876543210?text=Hello%20HangerHome%2C%20I%20am%20interested%20in%20your%20products%20and%20installation%20services."
          target="_blank"
          rel="noopener noreferrer"
          className="home-float-btn home-float-whatsapp"
          aria-label="Chat on WhatsApp (+91 98765 43210)"
          title="WhatsApp HangerHome"
        >
          <Phone size={22} fill="currentColor" strokeWidth={1.5} />
          <span className="home-float-pulse-aura" aria-hidden="true" />
        </a>

        {/* 2. Floating Cart Round Glass Button with gold badge */}
        <button
          type="button"
          className="home-float-btn home-float-cart-round"
          onClick={handleCartClick}
          aria-label={`Open shopping cart with ${itemCount} items`}
          title="View Shopping Cart"
        >
          <div className="home-float-cart-icon-wrap">
            <ShoppingCart size={22} strokeWidth={2} />
            {itemCount > 0 && <span className="home-float-cart-badge">{itemCount}</span>}
          </div>
        </button>

        {/* 3. AI Assistant Floating Button */}
        <button
          type="button"
          className={`home-float-btn home-float-ai ${chat ? 'active' : ''}`}
          onClick={() => setChat && setChat(!chat)}
          aria-label="Ask HangerHome AI Assistant"
          title="Ask HangerHome"
        >
          <MessageCircle size={22} strokeWidth={2} />
          {!chat && <span className="home-float-ai-pill">Ask HangerHome</span>}
        </button>
      </aside>

      {/* Fallback Drawer if not handled globally */}
      <MiniCartDrawer
        isOpen={localDrawerOpen}
        onClose={() => setLocalDrawerOpen(false)}
        cart={cart}
        total={total}
        onUpdateQty={onUpdateQty}
        onRemove={onRemove}
      />
    </>
  );
}
