import React from 'react';
import { motion } from 'framer-motion';
import { Phone, MessageCircle, ArrowRight, Sparkles } from 'lucide-react';

export function ContactClosingCTA({ phone, whatsapp }) {
  const displayPhone = phone || '+91 98765 43210';
  const displayWhatsapp = whatsapp || '+91 98765 43210';

  const cleanPhone = displayPhone.replace(/[^\d+]/g, '');
  const cleanWhatsapp = displayWhatsapp.replace(/\D/g, '');

  return (
    <section className="contact-closing-cta-section" aria-label="Closing Support CTA">
      {/* Background Ambience Layer */}
      <div className="contact-cta-bg-layer" aria-hidden="true">
        <div className="contact-cta-gradient-glow" />
        <div className="contact-cta-twinkle-dot dot-a" />
        <div className="contact-cta-twinkle-dot dot-b" />
        <div className="contact-cta-twinkle-dot dot-c" />
      </div>

      <motion.div
        className="contact-closing-cta-card"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Moving gold conic border glow */}
        <div className="cta-card-conic-glow" aria-hidden="true" />

        <div className="contact-closing-cta-content">
          <div className="contact-cta-badge">
            <Sparkles size={13} className="sparkle-gold" />
            <span>WE ARE HERE FOR YOU</span>
          </div>

          <h2 className="contact-closing-cta-title">
            Still have questions? Our team is happy to help.
          </h2>

          <p className="contact-closing-cta-desc">
            Speak directly with our technical advisors for instant guidance on ceiling measurements, balcony suitability, and custom storage solutions.
          </p>

          <div className="contact-closing-cta-actions">
            <a
              href={`tel:${cleanPhone}`}
              className="contact-cta-btn cta-btn-call"
              title={`Call us at ${displayPhone}`}
            >
              <div className="btn-light-sweep" />
              <div className="btn-content-flex">
                <Phone size={17} />
                <span>Call Now</span>
                <ArrowRight size={15} className="btn-arrow" />
              </div>
            </a>

            <a
              href={`https://wa.me/${cleanWhatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-cta-btn cta-btn-whatsapp"
              title={`Chat on WhatsApp with ${displayWhatsapp}`}
            >
              <div className="btn-light-sweep" />
              <div className="btn-content-flex">
                <MessageCircle size={18} />
                <span>Chat on WhatsApp</span>
                <ArrowRight size={15} className="btn-arrow" />
              </div>
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
