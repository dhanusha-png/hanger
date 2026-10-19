import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Layers,
  Wrench,
  Sparkles,
  Calendar,
  Ruler,
  CheckCircle2,
  ShieldCheck,
  RefreshCw,
  Hammer
} from 'lucide-react';

export function InstallationSolutions({ onSelectType }) {
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'installation' | 'service'

  const scrollToBooking = (type, title) => {
    if (onSelectType) onSelectType(type);
    const el = document.getElementById('booking-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === 'installation') {
      const el = document.getElementById('installation-categories');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (tab === 'service') {
      const el = document.getElementById('service-solutions');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const installationCategories = [
    {
      id: 'ceiling',
      title: 'Ceiling Hangers Installation',
      subtitle: 'Modern & durable',
      thumb: '/installations/cat-ceiling.jpg',
      fallback: '/media/hanger-1.jpg',
      type: 'installation'
    },
    {
      id: 'wall',
      title: 'Wall Hangers Installation',
      subtitle: 'Strong & stylish',
      thumb: '/installations/cat-wall.jpg',
      fallback: '/media/hanger-4.jpg',
      type: 'installation'
    },
    {
      id: 'shoe-rack',
      title: 'Shoe Rack Installation',
      subtitle: 'Organised storage',
      thumb: '/installations/cat-shoe-rack.jpg',
      fallback: '/products/shoe-rack-compact-3-tier.jpg',
      type: 'installation'
    },
    {
      id: 'balcony',
      title: 'Balcony Systems Installation',
      subtitle: 'Maximise your space',
      thumb: '/installations/cat-balcony.jpg',
      fallback: '/media/hanger-7.jpg',
      type: 'installation'
    },
    {
      id: 'custom',
      title: 'Custom Solutions Installation',
      subtitle: 'Tailored for your home',
      thumb: '/installations/cat-custom.jpg',
      fallback: '/media/hanger-6.jpg',
      type: 'installation'
    }
  ];

  const serviceSolutions = [
    {
      id: 'repair-fixing',
      title: 'Repair & Fixing',
      subtitle: 'Quick and reliable repairs',
      thumb: '/services/service-repair.jpg',
      fallback: '/media/hanger-3.jpg',
      type: 'service'
    },
    {
      id: 'maintenance-tuneup',
      title: 'Maintenance & Tune-up',
      subtitle: 'Long-lasting performance',
      thumb: '/services/service-maintenance.jpg',
      fallback: '/media/hanger-2.jpg',
      type: 'service'
    },
    {
      id: 'part-replacement',
      title: 'Part Replacement',
      subtitle: 'Genuine spares',
      thumb: '/services/service-new-installation.jpg',
      fallback: '/media/hanger-5.jpg',
      type: 'service'
    },
    {
      id: 'adjustment-troubleshooting',
      title: 'Adjustment & Troubleshooting',
      subtitle: 'Smooth, safe operation',
      thumb: '/media/hanger-3.jpg',
      fallback: '/services/service-repair.jpg',
      type: 'service'
    },
    {
      id: 'annual-plan',
      title: 'Annual Service Plan',
      subtitle: 'Care all year',
      thumb: '/products/hanger-adjustable-drying.jpg',
      fallback: '/services/service-maintenance.jpg',
      type: 'service'
    },
    {
      id: 'custom-solutions',
      title: 'Custom Solutions',
      subtitle: 'Made for your space',
      thumb: '/services/service-custom-hanger.jpg',
      fallback: '/media/hanger-6.jpg',
      type: 'service'
    }
  ];

  const processSteps = [
    {
      num: '01',
      title: 'Book',
      desc: 'Select installation or service online or talk to our team.',
      icon: Calendar
    },
    {
      num: '02',
      title: 'Inspect / Measure',
      desc: 'We verify ceiling dimensions and plan exact alignment.',
      icon: Ruler
    },
    {
      num: '03',
      title: 'Install or Repair',
      desc: 'Trained technicians install or service with genuine parts.',
      icon: Wrench
    },
    {
      num: '04',
      title: 'Ongoing Support',
      desc: 'Quality testing, warranty coverage and yearly maintenance.',
      icon: CheckCircle2
    }
  ];

  return (
    <div className="install-solutions-wrapper">
      {/* 1. STICKY PILL TAB BAR: All · Installation · Service */}
      <section className="install-sticky-tabs-container" id="tabs-section">
        <div className="install-tabs-pill">
          {[
            { id: 'all', label: 'All Solutions' },
            { id: 'installation', label: 'Installation' },
            { id: 'service', label: 'Service' }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                className={`install-tab-btn ${isActive ? 'active' : ''}`}
                onClick={() => handleTabClick(tab.id)}
              >
                {isActive && (
                  <motion.div
                    className="install-tab-active-bg"
                    layoutId="activeTabIndicator"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="install-tab-label">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. INSTALLATION CATEGORIES SECTION */}
      {(activeTab === 'all' || activeTab === 'installation') && (
        <section className="install-cat-section" id="installation-categories">
          <div className="install-cat-header">
            <div className="install-cat-header-left">
              <span className="install-section-tag">PRECISION FITTING</span>
              <h2>Installation Categories</h2>
            </div>
            <Link to="/gallery" className="install-cat-view-all">
              <span>View All Installations</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="install-cat-grid">
            {installationCategories.map((cat, idx) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
              >
                <div
                  role="button"
                  tabIndex={0}
                  className="install-cat-card"
                  onClick={() => scrollToBooking('installation', cat.title)}
                  onKeyDown={(e) => e.key === 'Enter' && scrollToBooking('installation', cat.title)}
                >
                  <div className="install-cat-thumb">
                    <img
                      src={cat.thumb}
                      alt={cat.title}
                      onError={(e) => {
                        e.currentTarget.src = cat.fallback;
                      }}
                    />
                  </div>
                  <div className="install-cat-info">
                    <b>{cat.title}</b>
                    <small>{cat.subtitle}</small>
                  </div>
                  <div className="install-cat-arrow" aria-label="Book this installation">
                    <ArrowRight size={13} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* 3. SERVICE SOLUTIONS SECTION (Exact Same Design as Categories) */}
      {(activeTab === 'all' || activeTab === 'service') && (
        <section className="install-cat-section service-solutions-section" id="service-solutions">
          <div className="install-cat-header">
            <div className="install-cat-header-left">
              <span className="install-section-tag">CARE &amp; REPAIR</span>
              <h2>Service Solutions</h2>
            </div>
            <button
              type="button"
              className="install-cat-view-all"
              onClick={() => scrollToBooking('service', 'Service Booking')}
            >
              <span>Book a Service</span>
              <ArrowRight size={15} />
            </button>
          </div>

          <div className="install-cat-grid service-solutions-grid">
            {serviceSolutions.map((srv, idx) => (
              <motion.div
                key={srv.id}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
              >
                <div
                  role="button"
                  tabIndex={0}
                  className="install-cat-card"
                  onClick={() => scrollToBooking('service', srv.title)}
                  onKeyDown={(e) => e.key === 'Enter' && scrollToBooking('service', srv.title)}
                >
                  <div className="install-cat-thumb">
                    <img
                      src={srv.thumb}
                      alt={srv.title}
                      onError={(e) => {
                        e.currentTarget.src = srv.fallback;
                      }}
                    />
                  </div>
                  <div className="install-cat-info">
                    <b>{srv.title}</b>
                    <small>{srv.subtitle}</small>
                  </div>
                  <div className="install-cat-arrow" aria-label="Book this service">
                    <ArrowRight size={13} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* 4. NEW COMPACT "HOW IT WORKS" STRIP (4 Steps with Travelling Light) */}
      <section className="install-how-it-works-strip" aria-label="How Installation and Service Works">
        <div className="install-how-header">
          <span className="install-section-tag">SIMPLE WORKFLOW</span>
          <h3>How It Works</h3>
          <p>4 simple steps from your initial request to flawless operation.</p>
        </div>

        <div className="install-steps-track">
          {processSteps.map((st, idx) => {
            const Icon = st.icon;
            return (
              <div key={st.num} className="install-step-node">
                <div className="install-step-circle-wrap">
                  <div className="install-step-circle">
                    <Icon size={19} />
                  </div>
                  <span className="install-step-number-tag">{st.num}</span>
                  {idx < processSteps.length - 1 && (
                    <div className="install-step-connector">
                      <div className="install-travelling-light" style={{ animationDelay: `${idx * 0.9}s` }} />
                    </div>
                  )}
                </div>
                <div className="install-step-meta">
                  <b>{st.title}</b>
                  <p>{st.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
