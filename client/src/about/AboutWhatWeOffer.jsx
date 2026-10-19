import React from 'react';
import { Layers, Wrench, RefreshCw, Sparkles } from 'lucide-react';

const offers = [
  {
    icon: Layers,
    title: 'Product Solutions',
    desc: 'Precision-engineered drying hangers, foldable wall systems, and space-saving tiered shoe racks.'
  },
  {
    icon: Wrench,
    title: 'Professional Installation',
    desc: 'Clean, dust-conscious on-site mounting by experienced technicians using heavy-duty anchoring.'
  },
  {
    icon: RefreshCw,
    title: 'Repair & Fixing',
    desc: 'Restoration, re-roping, pulley replacement, and maintenance to keep your home systems operating like new.'
  },
  {
    icon: Sparkles,
    title: 'Custom Fabrication',
    desc: 'Bespoke dimensions, unique brackets, and tailored solutions for architectural constraints.'
  }
];

export function AboutWhatWeOffer() {
  return (
    <section className="about-offer-section">
      <div className="container">
        <div className="install-header" style={{ textAlign: 'center', margin: '0 auto 40px' }}>
          <span className="eyebrow">WHAT WE OFFER</span>
          <h2>Comprehensive Space Care</h2>
          <p style={{ margin: '0 auto' }}>
            From individual product delivery to turnkey installation and aftercare, we cover every aspect of home utility organization.
          </p>
        </div>

        <div className="about-offer-grid">
          {offers.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div className="about-offer-card" key={idx}>
                <div className="about-offer-card-icon">
                  <Icon size={20} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
