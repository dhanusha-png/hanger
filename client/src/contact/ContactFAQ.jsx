import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, HelpCircle, X } from 'lucide-react';
import { api } from '../lib/api';

const FAQS_DATA = [
  {
    id: 'response-time',
    q: 'How quickly does the HangerHome team respond to enquiries?',
    a: 'Our customer support team typically reviews and responds to general enquiries and service requests within 2 to 4 business hours.'
  },
  {
    id: 'onsite-consultation',
    q: 'Can I request an on-site consultation before ordering?',
    a: 'Yes. If you are uncertain about ceiling suitability, balcony height, or wall strength, you can select "Site Measurement Request" in the form above and our technician will schedule a visit.'
  },
  {
    id: 'weekend-services',
    q: 'Do you provide services on weekends?',
    a: 'Yes, we schedule installation and repair appointments on Saturdays and Sundays based on technician availability and slot booking.'
  },
  {
    id: 'custom-quote-info',
    q: 'What information should I provide for a custom quote?',
    a: 'Sharing approximate balcony or room dimensions, ceiling type (e.g. concrete slab, false ceiling), and photos of the intended space helps us provide an accurate quotation rapidly.'
  }
];

export function ContactFAQ() {
  const [openIdx, setOpenIdx] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [faqList, setFaqList] = useState(FAQS_DATA);

  useEffect(() => {
    let active = true;
    api('/faqs?group=contact').then(data => {
      if (!active || !Array.isArray(data) || !data.length) return;
      const seen = new Set();
      const unique = [];
      for (const f of data) {
        const norm = (f.question || '').trim().toLowerCase();
        if (norm && !seen.has(norm)) {
          seen.add(norm);
          unique.push({ id: f._id || `faq-${unique.length}`, q: f.question, a: f.answer });
        }
      }
      if (unique.length) setFaqList(unique);
    }).catch(() => {});
    return () => { active = false; };
  }, []);

  const toggle = (idx) => {
    setOpenIdx(prev => (prev === idx ? null : idx));
  };

  const filteredFaqs = React.useMemo(() => {
    const seen = new Set();
    const query = searchQuery.trim().toLowerCase();
    return faqList.filter(faq => {
      const norm = (faq.q || '').trim().toLowerCase();
      if (seen.has(norm)) return false;
      seen.add(norm);
      if (!query) return true;
      const qLower = faq.q.toLowerCase();
      const aLower = (faq.a || '').toLowerCase();
      return qLower.includes(query) || aLower.includes(query);
    });
  }, [faqList, searchQuery]);

  return (
    <section className="contact-faq-section" id="faq-section" aria-label="Frequently Asked Questions">
      {/* Centered Section Header */}
      <div className="contact-faq-header-wrap">
        <span className="contact-section-eyebrow">ENQUIRY FAQ</span>
        <h2 className="contact-section-heading">Frequently Asked Questions</h2>
        <p className="contact-section-sub">
          Common questions about getting in touch and scheduling space consultations.
        </p>

        {/* Live Search Filter Box */}
        <div className="contact-faq-search-box">
          <Search size={16} className="faq-search-icon" />
          <input
            type="text"
            placeholder="Search questions (e.g. hours, consultation, weekend, quote)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="faq-search-input"
            aria-label="Filter FAQ questions"
          />
          {searchQuery && (
            <button
              type="button"
              className="faq-search-clear"
              onClick={() => setSearchQuery('')}
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Accordion Container */}
      <div className="contact-faq-container">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, idx) => {
            const isOpen = openIdx === idx;

            return (
              <motion.div
                key={faq.id}
                className={`contact-faq-card ${isOpen ? 'is-open' : ''}`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
              >
                <button
                  type="button"
                  className="contact-faq-trigger"
                  onClick={() => toggle(idx)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${faq.id}`}
                >
                  <span className="faq-question-text">{faq.q}</span>
                  <div className={`faq-icon-rotator ${isOpen ? 'rotated' : ''}`} aria-hidden="true">
                    <Plus size={18} />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${faq.id}`}
                      className="contact-faq-answer-collapse"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="faq-answer-inner">
                        <p>{faq.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        ) : (
          <div className="contact-faq-empty">
            <HelpCircle size={32} className="faq-empty-icon" />
            <p>No matching questions found for "{searchQuery}".</p>
            <button
              type="button"
              className="faq-empty-reset"
              onClick={() => setSearchQuery('')}
            >
              Clear filter &amp; view all questions
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
