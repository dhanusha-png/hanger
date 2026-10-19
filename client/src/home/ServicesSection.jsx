import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Settings, Ruler, Calendar, ArrowRight } from 'lucide-react';

export function ServicesSection() {
  const services = [
    {
      icon: Wrench,
      title: 'Installation',
      desc: 'View installation details',
      link: '/installations',
    },
    {
      icon: Settings,
      title: 'Repair & Fixing',
      desc: 'Find booking options',
      link: '/installations#service-solutions',
    },
    {
      icon: Ruler,
      title: 'Custom Making',
      desc: 'Send a custom requirement',
      link: '/quote',
    },
    {
      icon: Calendar,
      title: 'Site Measurement',
      desc: 'Request a measurement',
      link: '/service-booking',
    },
  ];

  return (
    <section className="home-services-section container" aria-label="Our Services">
      <div className="home-services-header">
        <div>
          <span className="eyebrow">OUR SERVICES</span>
          <h2 className="home-services-heading">Product and service enquiries</h2>
          <p className="home-services-subtitle">
            Explore installation, repair and custom-making service options.
          </p>
        </div>

        <Link to="/installations#service-solutions" className="home-services-view-all">
          View All Services <ArrowRight size={15} />
        </Link>
      </div>

      <div className="home-services-grid">
        {services.map((item, idx) => {
          const Icon = item.icon;
          return (
            <Link to={item.link} className={`home-service-card animated-light-border light-service light-phase-${(idx % 6) + 1}`} key={idx}>
              <div className="home-service-icon-box">
                <Icon size={22} className="home-service-icon" />
              </div>
              <div className="home-service-body">
                <h3 className="home-service-title">{item.title}</h3>
                <span className="home-service-desc">
                  {item.desc} <ArrowRight size={14} className="home-service-arrow" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
