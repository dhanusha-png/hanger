import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Wrench,
  Settings,
  PenTool,
  Headphones,
  ShieldCheck,
  Instagram,
  Facebook,
  Youtube,
  Share2,
  ChevronDown,
  Mail,
  Check
} from 'lucide-react';
import { GoldDivider } from '../../design-system/GoldDivider';
import { Logo } from '../Logo';
import { api } from '../../lib/api';
import './footer.css';

export function Footer() {
  const [openSection, setOpenSection] = useState(null);
  const [settings, setSettings] = useState(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [submittingSub, setSubmittingSub] = useState(false);
  const [subMsg, setSubMsg] = useState('');
  const footerRef = React.useRef(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setRevealed(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05 }
    );
    if (footerRef.current) {
      observer.observe(footerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let active = true;
    api('/settings').then(s => {
      if (active && s) setSettings(s);
    }).catch(() => {});
    return () => { active = false; };
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) return;
    setSubmittingSub(true);
    setSubMsg('');
    try {
      await api('/subscribers', { method: 'POST', body: JSON.stringify({ email: newsletterEmail }) });
      setSubMsg('Subscribed! Thank you for joining.');
      setNewsletterEmail('');
    } catch (err) {
      setSubMsg(err.message || 'Already subscribed or invalid email.');
    } finally {
      setSubmittingSub(false);
    }
  };

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <footer className="hh-footer-root" role="contentinfo" aria-label="Site Footer">
      {/* ==================================================================
          1. Premium CTA Section (Matching Reference Image 2)
          ================================================================== */}
      <div className="container hh-footer-cta-container">
        <div className="hh-footer-cta-card">
          {/* Subtle architectural & ambient light overlays */}
          <div className="hh-footer-cta-glow" aria-hidden="true" />
          <div className="hh-footer-cta-image-backdrop" aria-hidden="true" />

          <div className="hh-footer-cta-content">
            {/* Top Eyebrow with gold accent line */}
            <div className="hh-footer-cta-eyebrow">
              <span>HANGERHOME</span>
              <span className="hh-footer-cta-eyebrow-line" />
            </div>

            {/* Headline with elegant gold italic highlight */}
            <h2 className="hh-footer-cta-headline">
              Better spaces start <br className="hh-desktop-br" />
              with the <em className="hh-footer-cta-em">right solution.</em>
            </h2>

            {/* Supporting Text */}
            <p className="hh-footer-cta-desc">
              Explore premium hanger and storage solutions with professional installation and service support.
            </p>

            {/* CTA Action Buttons */}
            <div className="hh-footer-cta-actions">
              <Link to="/products" className="hh-footer-btn-primary">
                Explore Products <ArrowRight size={16} />
              </Link>
              <Link to="/installations#service-solutions" className="hh-footer-btn-secondary">
                Book a Service <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* 4 Feature Pillars (Exact match to Reference Image 2) */}
          <div className="hh-footer-cta-features">
            <div className="hh-cta-feature-item">
              <div className="hh-cta-feature-icon">
                <Wrench size={20} />
              </div>
              <span className="hh-cta-feature-label">
                Professional <br />Installation
              </span>
            </div>

            <div className="hh-cta-feature-item">
              <div className="hh-cta-feature-icon">
                <Settings size={20} />
              </div>
              <span className="hh-cta-feature-label">
                Repair & <br />Maintenance
              </span>
            </div>

            <div className="hh-cta-feature-item">
              <div className="hh-cta-feature-icon">
                <PenTool size={20} />
              </div>
              <span className="hh-cta-feature-label">
                Custom <br />Solutions
              </span>
            </div>

            <div className="hh-cta-feature-item">
              <div className="hh-cta-feature-icon">
                <Headphones size={20} />
              </div>
              <span className="hh-cta-feature-label">
                Service <br />Support
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================================
          2. Main Dark Footer (5-Column Structure + Contact Glass Card)
          ================================================================== */}
      <div ref={footerRef} className={`hh-footer-main ${revealed ? 'hh-revealed' : ''}`}>
        {/* Subtle architectural wireframe illustration in background */}
        <div className="hh-footer-arch-lines" aria-hidden="true">
          <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M200 40L380 150V290H20V150L200 40Z" stroke="rgba(200, 168, 107, 0.08)" strokeWidth="1.5" />
            <path d="M70 180H330" stroke="rgba(200, 168, 107, 0.05)" strokeWidth="1" />
            <path d="M100 230H300" stroke="rgba(200, 168, 107, 0.05)" strokeWidth="1" />
            <path d="M200 40V290" stroke="rgba(200, 168, 107, 0.06)" strokeWidth="1" strokeDasharray="4 4" />
          </svg>
        </div>

        <div className="container hh-footer-grid">
          {/* Column 1: Brand Column */}
          <div className="hh-footer-col hh-footer-brand-col">
            <div className="hh-footer-brand-logo-wrap">
              <Logo variant="lockup" height={36} className="hh-footer-logo" />
            </div>

            <p className="hh-footer-brand-desc">
              Premium hanger, shoe-rack and home space solutions with professional installation and local service.
            </p>

            <div className="hh-footer-tagline-wrap">
              <p className="hh-footer-tagline">
                <em>Designed for your space.</em> <strong>Built for everyday living.</strong>
              </p>
              <div className="hh-footer-tagline-dash" />
            </div>

            {/* Newsletter Subscription */}
            <form className="hh-footer-newsletter-wrap" onSubmit={handleSubscribe}>
              <div className="hh-newsletter-input-group">
                <input
                  type="email"
                  className="hh-newsletter-input"
                  placeholder="Enter email for newsletter..."
                  value={newsletterEmail}
                  onChange={e => setNewsletterEmail(e.target.value)}
                  required
                  aria-label="Email address for newsletter"
                />
                <button
                  type="submit"
                  disabled={submittingSub}
                  className="hh-newsletter-submit-btn"
                  aria-label="Subscribe"
                >
                  <ArrowRight size={13} />
                </button>
              </div>
              {subMsg && <small className="hh-newsletter-msg">{subMsg}</small>}
            </form>

            {/* Social Icons (Dynamic from Settings) */}
            <div className="hh-footer-socials" aria-label="Social connections">
              <a
                href={settings?.socialLinks?.instagram || '#instagram'}
                target={settings?.socialLinks?.instagram ? '_blank' : '_self'}
                rel="noreferrer"
                className="hh-social-link"
                aria-label="HangerHome on Instagram"
                title="Instagram"
                onClick={(e) => { if (!settings?.socialLinks?.instagram) e.preventDefault(); }}
              >
                <Instagram size={15} />
              </a>
              <a
                href={settings?.socialLinks?.facebook || '#facebook'}
                target={settings?.socialLinks?.facebook ? '_blank' : '_self'}
                rel="noreferrer"
                className="hh-social-link"
                aria-label="HangerHome on Facebook"
                title="Facebook"
                onClick={(e) => { if (!settings?.socialLinks?.facebook) e.preventDefault(); }}
              >
                <Facebook size={15} />
              </a>
              <a
                href={settings?.socialLinks?.youtube || '#youtube'}
                target={settings?.socialLinks?.youtube ? '_blank' : '_self'}
                rel="noreferrer"
                className="hh-social-link"
                aria-label="HangerHome on YouTube"
                title="YouTube"
                onClick={(e) => { if (!settings?.socialLinks?.youtube) e.preventDefault(); }}
              >
                <Youtube size={15} />
              </a>
              <a
                href={settings?.whatsapp ? `https://wa.me/${settings.whatsapp.replace(/\D/g, '')}` : '#share'}
                target={settings?.whatsapp ? '_blank' : '_self'}
                rel="noreferrer"
                className="hh-social-link"
                aria-label="Share or Chat on WhatsApp"
                title="WhatsApp"
                onClick={(e) => { if (!settings?.whatsapp) e.preventDefault(); }}
              >
                <Share2 size={15} />
              </a>
            </div>
          </div>

          {/* Column 2: Shop Links */}
          <div className="hh-footer-col">
            <button
              type="button"
              className="hh-footer-col-header"
              onClick={() => toggleSection('shop')}
              aria-expanded={openSection === 'shop'}
            >
              <span>Shop</span>
              <ChevronDown className="hh-mobile-chevron" size={16} />
            </button>
            <div className="hh-col-gold-line" />
            <div className={`hh-footer-links ${openSection === 'shop' ? 'open' : ''}`}>
              <Link to="/products">All Products</Link>
              <Link to="/products?category=Hangers">Hangers</Link>
              <Link to="/products?category=Shoe Racks">Shoe Racks</Link>
              <Link to="/products?sort=newest">New Arrivals</Link>
              <Link to="/products?featured=true">Featured Products</Link>
            </div>
          </div>

          {/* Column 3: Services Links */}
          <div className="hh-footer-col">
            <button
              type="button"
              className="hh-footer-col-header"
              onClick={() => toggleSection('services')}
              aria-expanded={openSection === 'services'}
            >
              <span>Services</span>
              <ChevronDown className="hh-mobile-chevron" size={16} />
            </button>
            <div className="hh-col-gold-line" />
            <div className={`hh-footer-links ${openSection === 'services' ? 'open' : ''}`}>
              <Link to="/installations#service-solutions">Installation & Service</Link>
              <Link to="/installations#service-solutions">Repair & Fixing</Link>
              <Link to="/installations#service-solutions">Custom Solutions</Link>
              <Link to="/installations#service-solutions">Maintenance & Tune-up</Link>
              <Link to="/installations#service-solutions">Site Measurement</Link>
              <Link to="/installations#service-solutions">Shoe Rack Installation</Link>
            </div>
          </div>

          {/* Column 4: Company Links */}
          <div className="hh-footer-col">
            <button
              type="button"
              className="hh-footer-col-header"
              onClick={() => toggleSection('company')}
              aria-expanded={openSection === 'company'}
            >
              <span>Company</span>
              <ChevronDown className="hh-mobile-chevron" size={16} />
            </button>
            <div className="hh-col-gold-line" />
            <div className={`hh-footer-links ${openSection === 'company' ? 'open' : ''}`}>
              <Link to="/about">About HangerHome</Link>
              <Link to="/gallery">Gallery</Link>
              <Link to="/installations">Installation & Service</Link>
              <Link to="/contact">Contact</Link>
            </div>
          </div>

          {/* Column 5: Support Links */}
          <div className="hh-footer-col">
            <button
              type="button"
              className="hh-footer-col-header"
              onClick={() => toggleSection('support')}
              aria-expanded={openSection === 'support'}
            >
              <span>Support</span>
              <ChevronDown className="hh-mobile-chevron" size={16} />
            </button>
            <div className="hh-col-gold-line" />
            <div className={`hh-footer-links ${openSection === 'support' ? 'open' : ''}`}>
              <Link to="/account">My Account</Link>
              <Link to="/wishlist">Wishlist</Link>
              <Link to="/cart">Cart</Link>
              <Link to="/installations#faq">FAQs</Link>
              <Link to="/policies">Policies</Link>
            </div>
          </div>

          {/* Column 6: Distinct Contact / Support Card (Exact Match to Image 2) */}
          <div className="hh-footer-col hh-footer-contact-col">
            <div className="hh-contact-glass-card">
              <div className="hh-contact-card-icon-wrap" aria-hidden="true">
                <Headphones size={22} />
              </div>
              <h3 className="hh-contact-card-title">Need help choosing?</h3>
              <p className="hh-contact-card-text">
                Talk to HangerHome about products, installation or custom requirements.
              </p>
              <Link to="/contact" className="hh-contact-card-btn">
                Contact Us <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>

        {/* ==================================================================
            3. Bottom Bar: Divider, Copyright, Policies & Demo Security Note
            ================================================================== */}
        <div className="container hh-footer-bottom-container">
          <GoldDivider glow opacity={0.28} className="hh-footer-gold-divider" style={{ margin: '12px 0 14px 0' }} />
          <div className="hh-footer-bottom-row">
            <div className="hh-footer-copyright">
              © 2026 HangerHome. All rights reserved.
            </div>

            <div className="hh-footer-legal-links">
              <Link to="/policies">Privacy Policy</Link>
              <span className="hh-footer-dot">|</span>
              <Link to="/policies">Terms & Conditions</Link>
              <span className="hh-footer-dot">|</span>
              <Link to="/policies">Shipping & Returns</Link>
            </div>

            <div className="hh-footer-checkout-note">
              <ShieldCheck size={14} className="hh-checkout-shield-icon" />
              <span>Secure checkout · Razorpay demo · COD</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
