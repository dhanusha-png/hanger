import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers, Package, Wrench, RefreshCw, ShieldCheck, Ruler } from 'lucide-react';

const pillars = [
  {
    title: 'Hanger Products',
    desc: 'Designed for everyday use',
    icon: Layers
  },
  {
    title: 'Shoe Racks',
    desc: 'Practical storage solutions',
    icon: Package
  },
  {
    title: 'Installation',
    desc: 'Professional and neat setup',
    icon: Wrench
  },
  {
    title: 'Repair & Fixing',
    desc: 'Keep your systems working',
    icon: RefreshCw
  },
  {
    title: 'Maintenance',
    desc: 'Regular checking and support',
    icon: ShieldCheck
  },
  {
    title: 'Custom Solutions',
    desc: 'For unique spaces and needs',
    icon: Ruler
  }
];

export function AboutWhoWeAre() {
  return (
    <section className="about-who-section">
      <div className="container about-who-grid">
        <div className="about-who-text">
          <span className="eyebrow">WHO WE ARE</span>
          <h2>More than just a hanger.</h2>
          <p>
            HangerHome is focused on making everyday spaces more practical, organized and easier to use. We bring together hanger products, shoe racks and related services such as installation, repair, maintenance and custom solutions.
          </p>
          <div className="about-who-actions">
            <Link to="/products" className="install-btn-primary">
              Browse Products <ArrowRight size={15} />
            </Link>
            <Link to="/installations#service-solutions" className="install-btn-soft">
              Explore Services
            </Link>
          </div>
        </div>

        <div className="about-who-media">
          <img src="/media/hanger-6.jpg" alt="HangerHome Precision Installation" />
        </div>

        <div className="about-who-list">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div className="about-who-item" key={idx}>
                <div className="about-who-item-icon">
                  <Icon size={18} />
                </div>
                <div>
                  <b>{item.title}</b>
                  <small>{item.desc}</small>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
