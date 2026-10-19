import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  Phone,
  Mail,
  MessageCircle,
  MapPin,
  Copy,
  Check,
  Zap,
  Radio
} from 'lucide-react';

export function ContactInfoCards({ phone, whatsapp, email, address, serviceAreas }) {
  const [copiedKey, setCopiedKey] = useState(null);
  const [liveStatus, setLiveStatus] = useState({ isOpen: false, text: '' });

  // Calculate live working hours status from visitor's local time
  useEffect(() => {
    function computeStatus() {
      const now = new Date();
      const day = now.getDay(); // 0 is Sunday, 1 is Monday, ... 6 is Saturday
      const hour = now.getHours();
      const isWorkingDay = day >= 1 && day <= 6; // Mon-Sat

      if (isWorkingDay) {
        if (hour >= 9 && hour < 19) {
          setLiveStatus({
            isOpen: true,
            text: 'Open now'
          });
        } else if (hour < 9) {
          setLiveStatus({
            isOpen: false,
            text: 'Closed — opens today 9:00 AM'
          });
        } else {
          // hour >= 19
          const nextDayText = day === 6 ? 'opens Monday 9:00 AM' : 'opens tomorrow 9:00 AM';
          setLiveStatus({
            isOpen: false,
            text: `Closed — ${nextDayText}`
          });
        }
      } else {
        // Sunday
        setLiveStatus({
          isOpen: false,
          text: 'Closed — opens Monday 9:00 AM'
        });
      }
    }

    computeStatus();
    const interval = setInterval(computeStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleCopy = (text, key) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(prev => (prev === key ? null : prev));
    }, 2200);
  };

  const contactItems = [
    {
      key: 'phone',
      icon: Phone,
      label: 'Phone Consultation',
      value: phone || '+91 98765 43210',
      actionHref: `tel:${(phone || '+91 98765 43210').replace(/[^\d+]/g, '')}`,
      actionLabel: 'Call'
    },
    {
      key: 'whatsapp',
      icon: MessageCircle,
      label: 'WhatsApp Support',
      value: whatsapp || '+91 98765 43210',
      actionHref: `https://wa.me/${(whatsapp || '+91 98765 43210').replace(/\D/g, '')}`,
      actionLabel: 'Chat'
    },
    {
      key: 'email',
      icon: Mail,
      label: 'Email Enquiry',
      value: email || 'support@hangerhome.com',
      actionHref: `mailto:${email || 'support@hangerhome.com'}`,
      actionLabel: 'Mail'
    },
    {
      key: 'coverage',
      icon: MapPin,
      label: 'Service Coverage',
      value: address || serviceAreas || 'Bengaluru & Major Metros',
      actionHref: '#coverage-map',
      actionLabel: 'View'
    }
  ];

  return (
    <aside className="contact-details-column" aria-label="Contact Information">
      {/* 1. WORKING HOURS CARD WITH LIVE STATUS PILL */}
      <motion.div
        className="contact-glass-card contact-hours-card"
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
      >
        <div className="contact-card-top-row">
          <div className="contact-icon-ring" aria-hidden="true">
            <Clock size={18} />
          </div>
          <div
            className={`contact-status-pill ${liveStatus.isOpen ? 'status-open' : 'status-closed'}`}
            role="status"
            aria-live="polite"
          >
            <span className="contact-status-dot" />
            <span className="contact-status-text">{liveStatus.text}</span>
          </div>
        </div>

        <div className="contact-hours-body">
          <h3 className="contact-card-title">Working Hours</h3>
          <p className="contact-hours-schedule">
            <b>Monday – Saturday:</b> 9:00 AM – 7:00 PM
          </p>
          <p className="contact-hours-sub">
            <small>Sundays: Pre-booked site measurements and priority installations by appointment.</small>
          </p>
        </div>
      </motion.div>

      {/* 2. CHANNELS ROWS WITH COPY BUTTON & TOAST */}
      <motion.div
        className="contact-glass-card contact-channels-card"
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.25 }}
      >
        <div className="contact-channels-header">
          <h3 className="contact-card-title">Direct Channels</h3>
          <span className="contact-sub-badge">Official Support</span>
        </div>

        <div className="contact-channels-list">
          {contactItems.map(item => {
            const Icon = item.icon;
            const isCopied = copiedKey === item.key;

            return (
              <div key={item.key} className="contact-channel-row">
                <div className="contact-channel-icon-wrap" aria-hidden="true">
                  <Icon size={16} />
                </div>

                <div className="contact-channel-info">
                  <span className="contact-channel-label">{item.label}</span>
                  <a
                    href={item.actionHref}
                    className="contact-channel-val"
                    target={item.actionHref.startsWith('http') ? '_blank' : undefined}
                    rel={item.actionHref.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    {item.value}
                  </a>
                </div>

                <div className="contact-channel-actions">
                  <button
                    type="button"
                    className="contact-copy-btn"
                    onClick={() => handleCopy(item.value, item.key)}
                    title={`Copy ${item.label}`}
                    aria-label={`Copy ${item.label} value`}
                  >
                    {isCopied ? (
                      <Check size={14} className="copied-icon" />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>

                  <AnimatePresence>
                    {isCopied && (
                      <motion.span
                        className="contact-copied-toast"
                        initial={{ opacity: 0, y: 4, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                      >
                        Copied ✓
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* 3. RESPONSE TIME CARD */}
      <motion.div
        className="contact-glass-card contact-response-card"
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.35 }}
      >
        <div className="contact-response-flex">
          <div className="contact-pulse-ring-wrap" aria-hidden="true">
            <svg className="contact-ring-svg" viewBox="0 0 44 44">
              <circle
                className="contact-ring-bg"
                cx="22"
                cy="22"
                r="18"
                fill="none"
                stroke="rgba(232, 192, 112, 0.15)"
                strokeWidth="3"
              />
              <circle
                className="contact-ring-progress"
                cx="22"
                cy="22"
                r="18"
                fill="none"
                stroke="#e8c070"
                strokeWidth="3"
                strokeDasharray="113"
                strokeDashoffset="28"
                strokeLinecap="round"
              />
            </svg>
            <div className="contact-ring-center-icon">
              <Zap size={14} />
            </div>
          </div>

          <div className="contact-response-text">
            <b>Swift Response</b>
            <p>We usually reply within 2 to 4 business hours to ensure quick consultation.</p>
          </div>
        </div>
      </motion.div>

      {/* 4. ABSTRACT MAP-STYLE CARD (CSS/SVG ONLY, NO EXTERNAL MAP) */}
      <motion.div
        id="coverage-map"
        className="contact-glass-card contact-map-card"
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.45 }}
      >
        <div className="contact-map-graphic" aria-hidden="true">
          <div className="contact-map-dots-canvas" />

          {/* Central Beacon Pin with expanding pulse ripple rings */}
          <div className="contact-map-beacon">
            <div className="contact-beacon-core" />
            <div className="contact-beacon-ring ring-1" />
            <div className="contact-beacon-ring ring-2" />
            <div className="contact-beacon-ring ring-3" />
          </div>

          <div className="contact-map-coord-line" />
          <div className="contact-map-badge-tag">HQ &amp; Central Hub</div>
        </div>

        <div className="contact-map-footer">
          <div className="contact-map-footer-icon">
            <MapPin size={16} />
          </div>
          <div>
            <b>{serviceAreas || 'Bengaluru & Surrounding Metro Regions'}</b>
            <small>Professional on-site survey, measurement &amp; same-week installation.</small>
          </div>
        </div>
      </motion.div>
    </aside>
  );
}
