import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wrench, Calculator, ShoppingBag, ArrowRight } from 'lucide-react';

export function ContactActionCards({ productCount = 20, onRequestQuote }) {
  const cards = [
    {
      id: 'service',
      icon: Wrench,
      title: 'Book a Service',
      desc: 'Need installation, repair, or regular maintenance for an existing system?',
      btnText: 'Book Service',
      linkTo: '/installations#service-solutions',
      isInternalAction: false
    },
    {
      id: 'quote',
      icon: Calculator,
      title: 'Request a Quote',
      desc: 'Have a non-standard space or custom dimension requirement? Get a free estimate.',
      btnText: 'Request Quote',
      linkTo: '#enquiry-form-card',
      isInternalAction: true,
      action: () => {
        if (onRequestQuote) onRequestQuote('Custom Hanger Fabrication');
        const el = document.getElementById('enquiry-form-card');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          const msgInput = document.getElementById('field-message');
          if (msgInput) msgInput.focus();
        }
      }
    },
    {
      id: 'products',
      icon: ShoppingBag,
      title: 'Browse Products',
      desc: `Explore our catalog of ${productCount} ceiling drying hangers and space-saving shoe racks.`,
      btnText: 'Shop Catalog',
      linkTo: '/products',
      isInternalAction: false
    }
  ];

  return (
    <section className="contact-actions-section" aria-label="Quick Navigation Options">
      <div className="contact-actions-grid">
        {cards.map((card, idx) => {
          const Icon = card.icon;

          return (
            <motion.div
              key={card.id}
              className="contact-action-card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.12 }}
            >
              {/* Conic Glow Ambient Border */}
              <div className="action-card-conic-glow" aria-hidden="true" />

              <div className="action-card-inner">
                <div className="action-card-icon-ring" aria-hidden="true">
                  <Icon size={22} />
                </div>

                <div className="action-card-text">
                  <h3 className="action-card-title">{card.title}</h3>
                  <p className="action-card-desc">{card.desc}</p>
                </div>

                <div className="action-card-btn-wrap">
                  {card.isInternalAction ? (
                    <button
                      type="button"
                      className="action-card-link-btn"
                      onClick={card.action}
                      title={card.title}
                    >
                      <span>{card.btnText}</span>
                      <ArrowRight size={15} className="action-arrow-icon" />
                    </button>
                  ) : (
                    <Link
                      to={card.linkTo}
                      className="action-card-link-btn"
                      title={card.title}
                    >
                      <span>{card.btnText}</span>
                      <ArrowRight size={15} className="action-arrow-icon" />
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
