import React, { useState, useEffect } from 'react';
import { Plus, Minus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';

const faqs = [
  {
    q: 'Do you provide professional installation with product purchases?',
    a: 'Yes, we provide certified professional installation for all ceiling-mounted, wall-mounted, and balcony clothes drying systems as well as multi-tier shoe racks to guarantee safety, precision, and longevity.'
  },
  {
    q: 'Do you provide on-site measurements before installation?',
    a: 'Yes. Our technician visits your home to inspect the ceiling or wall structure, measure dimensions, check clearance heights, and recommend the ideal rod length and spacing before fitting.'
  },
  {
    q: 'Can you repair or service existing hanger systems?',
    a: 'Yes! We repair and service all kinds of existing ceiling and wall hangers, including replacing frayed nylon or wire ropes, replacing stuck or squeaky pulleys, realigning rods, and tension balancing.'
  },
  {
    q: 'What types of ceiling materials can you install into?',
    a: 'We securely anchor into concrete slabs, RCC ceilings, and reinforced balconies using heavy-duty industrial anchor fasteners. For false ceilings, we install custom extension rods securely anchored to the true concrete ceiling above.'
  },
  {
    q: 'Can you install multi-tier shoe racks and storage organizers?',
    a: 'Yes, our team provides full assembly and anti-tip wall anchoring for entryway shoe racks, heavy-duty organizers, and custom shelving to prevent tipping and keep your home tidy.'
  },
  {
    q: 'Can I request a custom hanger design for non-standard balconies?',
    a: 'Absolutely. For narrow balconies, slanted roofs, or non-standard architectural alcoves, we engineer custom length stainless steel rods and custom pulley arrangements.'
  },
  {
    q: 'What is covered under the Annual Service Plan?',
    a: 'Our Annual Service Plan includes scheduled periodic visits, complete safety checks, pulley lubrication, cord tension adjustment, free cord replacements, and priority support for any unexpected issues.'
  },
  {
    q: 'How quickly can an installation or service visit be scheduled?',
    a: 'We usually schedule visits within 24 to 48 hours of your request. Same-day appointments are also available in selected coverage zones.'
  }
];

export function InstallationFAQ() {
  const [openIdx, setOpenIdx] = useState(0);
  const [faqList, setFaqList] = useState(faqs);

  useEffect(() => {
    let active = true;
    api('/faqs?group=installation').then(data => {
      if (!active || !Array.isArray(data) || !data.length) return;
      setFaqList(data.map(f => ({ q: f.question, a: f.answer })));
    }).catch(() => {});
    return () => { active = false; };
  }, []);

  const toggle = (idx) => setOpenIdx(openIdx === idx ? null : idx);

  return (
    <section className="section container install-section" id="faq" aria-label="Installation and Service FAQs">
      <div className="install-projects-header">
        <div className="install-header" style={{ marginBottom: 0 }}>
          <span className="eyebrow">FREQUENTLY ASKED QUESTIONS</span>
          <h2>Common Questions</h2>
          <p>Quick answers about our professional installation, repair, and ongoing maintenance.</p>
        </div>
        <Link to="/contact" className="install-btn-soft">
          Ask a Question <ArrowRight size={15} />
        </Link>
      </div>

      <div className="install-faq-grid">
        {faqList.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div className="install-faq-item" key={idx}>
              <div
                className="install-faq-q"
                onClick={() => toggle(idx)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && toggle(idx)}
                aria-expanded={isOpen}
              >
                <span>{faq.q}</span>
                {isOpen ? <Minus size={16} /> : <Plus size={16} />}
              </div>
              {isOpen && <div className="install-faq-a"><p>{faq.a}</p></div>}
            </div>
          );
        })}
      </div>
    </section>
  );
}
