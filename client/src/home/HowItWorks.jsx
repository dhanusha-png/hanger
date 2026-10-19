import React from 'react';
import { ShoppingBag, FileText, Calendar, CheckCircle2, ArrowRight } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      num: '01',
      icon: ShoppingBag,
      title: 'Choose your solution',
      desc: 'Browse products or tell us your requirement.',
    },
    {
      num: '02',
      icon: FileText,
      title: 'Place your order',
      desc: 'Add to cart or request a custom quote.',
    },
    {
      num: '03',
      icon: Calendar,
      title: 'Schedule installation',
      desc: 'We arrange a suitable time for installation.',
    },
    {
      num: '04',
      icon: CheckCircle2,
      title: 'Enjoy your smarter space',
      desc: 'Your hanger or storage solution is ready to use.',
    },
  ];

  return (
    <section className="home-how-section container" aria-label="How It Works">
      <div className="home-how-header">
        <span className="eyebrow">HOW IT WORKS</span>
        <h2 className="home-how-heading">Simple from selection to installation.</h2>
        <p className="home-how-subtitle">
          A smooth and hassle-free process designed around your convenience.
        </p>
      </div>

      <div className="home-how-timeline">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <React.Fragment key={idx}>
              <div className="home-how-step">
                <div className="home-how-icon-circle">
                  <Icon size={22} className="home-how-icon" />
                </div>
                <span className="home-how-num">{step.num}</span>
                <h3 className="home-how-title">{step.title}</h3>
                <p className="home-how-desc">{step.desc}</p>
              </div>

              {idx < steps.length - 1 && (
                <div className="home-how-connector" aria-hidden="true">
                  <span className="home-how-line" />
                  <ArrowRight size={16} className="home-how-arrow" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </section>
  );
}
