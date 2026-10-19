import React, { useState } from 'react';
import { ArrowRight, Calendar, Check, HardHat, Wrench, Phone, MapPin, Sparkles } from 'lucide-react';
import { api } from '../lib/api';

export function InstallationCTA({ initialType = 'installation' }) {
  const [selectedType, setSelectedType] = useState(initialType);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    serviceItem: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Sync if parent updates initialType
  React.useEffect(() => {
    if (initialType) setSelectedType(initialType);
  }, [initialType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      alert('Please provide your name and phone number.');
      return;
    }
    setSubmitting(true);
    try {
      await api('/services', {
        method: 'POST',
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          address: form.address,
          type: selectedType === 'installation' ? 'Hanger Installation' : 'Hanger Repair & Fixing',
          preferredTime: form.serviceItem || (selectedType === 'installation' ? 'New Installation' : 'Maintenance & Repair'),
          message: form.message
        })
      });
      setSubmitted(true);
    } catch (err) {
      alert(err.message || 'Unable to record request right now. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="install-closing-cta-section" id="booking-section" aria-label="Book Installation or Service">
      <div className="container">
        <div className="install-cta-glass-card">
          {/* Top Segmented Toggle: Installation | Service */}
          <div className="install-toggle-wrapper">
            <span className="install-toggle-eyebrow">CHOOSE SERVICE TYPE</span>
            <div className="install-segmented-toggle" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={selectedType === 'installation'}
                className={`install-toggle-btn ${selectedType === 'installation' ? 'active' : ''}`}
                onClick={() => setSelectedType('installation')}
              >
                <HardHat size={16} />
                <span>Installation</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={selectedType === 'service'}
                className={`install-toggle-btn ${selectedType === 'service' ? 'active' : ''}`}
                onClick={() => setSelectedType('service')}
              >
                <Wrench size={15} />
                <span>Service</span>
              </button>
            </div>
          </div>

          <div className="install-cta-header-block">
            <h2>
              {selectedType === 'installation'
                ? 'Ready for a Flawless Installation?'
                : 'Need Fast, Expert Service or Repair?'}
            </h2>
            <p>
              {selectedType === 'installation'
                ? 'From balcony ceiling hangers to wall units and shoe organizers, our skilled technicians ensure laser-straight alignment, safe anchoring and no mess left behind.'
                : 'Keep your hangers and storage systems gliding effortlessly. We replace cords, fix pulleys, realign rods and carry out comprehensive tune-ups with genuine parts.'}
            </p>
          </div>

          {submitted ? (
            <div className="install-booking-success">
              <div className="install-success-icon-wrap">
                <Check size={28} />
              </div>
              <h3>Thank You! Request Recorded</h3>
              <p>
                Our installation and service coordinator will call you at <b>{form.phone}</b> shortly to confirm your schedule and details.
              </p>
              <button
                type="button"
                className="install-btn-gold"
                style={{ marginTop: '16px' }}
                onClick={() => {
                  setSubmitted(false);
                  setForm({ name: '', phone: '', address: '', serviceItem: '', message: '' });
                }}
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form className="install-cta-form" onSubmit={handleSubmit}>
              <div className="install-form-row two-cols">
                <div className="install-input-group">
                  <label htmlFor="cta-name">Your Full Name *</label>
                  <input
                    id="cta-name"
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="install-input-group">
                  <label htmlFor="cta-phone">Phone Number *</label>
                  <input
                    id="cta-phone"
                    type="tel"
                    required
                    placeholder="e.g. +91 98765 43210"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="install-form-row two-cols">
                <div className="install-input-group">
                  <label htmlFor="cta-address">Your Area / Address</label>
                  <input
                    id="cta-address"
                    type="text"
                    placeholder="e.g. Indiranagar, Bangalore"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                  />
                </div>
                <div className="install-input-group">
                  <label htmlFor="cta-service-item">
                    {selectedType === 'installation' ? 'Installation Type' : 'Service Requirement'}
                  </label>
                  <select
                    id="cta-service-item"
                    value={form.serviceItem}
                    onChange={(e) => setForm({ ...form, serviceItem: e.target.value })}
                  >
                    {selectedType === 'installation' ? (
                      <>
                        <option value="Ceiling Hangers Installation">Ceiling Hangers Installation</option>
                        <option value="Wall Hangers Installation">Wall Hangers Installation</option>
                        <option value="Shoe Rack Installation">Shoe Rack Installation</option>
                        <option value="Balcony Systems Installation">Balcony Systems Installation</option>
                        <option value="Custom Solutions Installation">Custom Solutions Installation</option>
                      </>
                    ) : (
                      <>
                        <option value="Repair & Fixing">Repair &amp; Fixing</option>
                        <option value="Maintenance & Tune-up">Maintenance &amp; Tune-up</option>
                        <option value="Part Replacement">Part Replacement</option>
                        <option value="Adjustment & Troubleshooting">Adjustment &amp; Troubleshooting</option>
                        <option value="Annual Service Plan">Annual Service Plan</option>
                        <option value="Custom Solutions">Custom Solutions</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div className="install-input-group">
                <label htmlFor="cta-message">Additional Notes (Optional)</label>
                <textarea
                  id="cta-message"
                  rows={3}
                  placeholder="Tell us about ceiling height, number of rods, or specific repairs needed..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
              </div>

              {/* Both Buttons Equal Weight in CTA Form */}
              <div className="install-form-actions">
                <button
                  type="submit"
                  disabled={submitting}
                  className="install-btn-gold"
                  id="cta-submit-primary"
                >
                  <Calendar size={18} />
                  <span>
                    {submitting
                      ? 'Submitting...'
                      : selectedType === 'installation'
                      ? 'Request an Installation'
                      : 'Book a Service'}
                  </span>
                  <ArrowRight size={16} className="btn-arrow-icon" />
                </button>

                <button
                  type="button"
                  className="install-btn-gold-outline"
                  id="cta-switch-mode"
                  onClick={() => setSelectedType(selectedType === 'installation' ? 'service' : 'installation')}
                >
                  {selectedType === 'installation' ? (
                    <>
                      <Wrench size={16} />
                      <span>Switch to Book a Service</span>
                    </>
                  ) : (
                    <>
                      <HardHat size={16} />
                      <span>Switch to Request an Installation</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
