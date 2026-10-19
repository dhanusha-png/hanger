import React, { useState } from 'react';
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
  const itemCount = cart.reduce((sum, item) => sum + (item.qty || 1), 0);

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
      <aside className="home-floating-stack" aria-label="Quick Actions">
        {/* 1. Direct WhatsApp / Contact Action with pulsing aura */}
        <Link
          to="/contact"
          className="home-float-btn home-float-whatsapp"
          aria-label="Contact HangerHome"
          title="Contact HangerHome"
        >
          <Phone size={20} fill="currentColor" />
          <span className="home-float-pulse-aura" aria-hidden="true" />
        </Link>

        {/* 2. Floating Cart Round Glass Button with gold badge */}
        <button
          type="button"
          className="home-float-btn home-float-cart-round"
          onClick={handleCartClick}
          aria-label={`Open shopping cart with ${itemCount} items`}
          title="View Shopping Cart"
        >
          <div className="home-float-cart-icon-wrap">
            <ShoppingCart size={19} />
            {itemCount > 0 && <span className="home-float-cart-badge">{itemCount}</span>}
          </div>
        </button>

        {/* 3. AI Assistant Floating Button */}
        <button
          type="button"
          className={`home-float-btn home-float-ai ${chat ? 'active' : ''}`}
          onClick={() => setChat && setChat(!chat)}
          aria-label="Ask HangerHome"
          title="Ask HangerHome"
        >
          <MessageCircle size={20} />
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
