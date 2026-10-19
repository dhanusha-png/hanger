import React, { useState, useEffect } from 'react';
import { Settings, Save, Check } from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { api } from '../lib/api';

export function AdminSettings() {
  const [form, setForm] = useState({
    businessName: 'HangerHome',
    tagline: 'Smart Space. Smarter Living.',
    phone: '',
    whatsapp: '',
    email: '',
    address: '',
    serviceArea: '',
    workingHours: '',
    announcementText: '',
    socialLinks: { instagram: '', facebook: '', youtube: '', twitter: '' },
    shippingRules: { flatRate: 99, freeShippingThreshold: 3000 },
    taxPercent: 0,
    paymentMethods: { cod: true, razorpay: true },
    stats: { homes: 1000, years: 5, products: 20, satisfaction: 99 },
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api('/admin/settings')
      .then((data) => {
        if (data) {
          setForm((prev) => ({
            ...prev,
            ...data,
            socialLinks: { ...prev.socialLinks, ...(data.socialLinks || {}) },
            shippingRules: { ...prev.shippingRules, ...(data.shippingRules || {}) },
            paymentMethods: { ...prev.paymentMethods, ...(data.paymentMethods || {}) },
            stats: { ...prev.stats, ...(data.stats || {}) },
          }));
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    try {
      await api('/admin/settings', {
        method: 'PUT',
        body: JSON.stringify(form),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert(err.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-heading">
          <div>
            <span className="eyebrow">GLOBAL SITE CONTROL</span>
            <h1>Website & Business Settings</h1>
            <p>Control contact information, shipping rules, payment gateways, announcement text and live numbers.</p>
          </div>
          {saved && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4ade80', fontSize: '13px', fontWeight: 700 }}>
              <Check size={16} /> Settings Saved & Published
            </div>
          )}
        </div>

        <form onSubmit={handleSave} style={{ marginTop: '24px' }}>
          {/* Section 1: Business Identity */}
          <div className="admin-card" style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#e8c070', fontSize: '15px', marginBottom: '16px' }}>Business Identity</h3>
            <div className="admin-editor-grid">
              <label>
                Brand Name
                <input
                  value={form.businessName || ''}
                  onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                />
              </label>

              <label>
                Brand Tagline
                <input
                  value={form.tagline || ''}
                  onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                />
              </label>
            </div>

            <div className="admin-editor-grid">
              <label>
                Official Phone
                <input
                  value={form.phone || ''}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                />
              </label>

              <label>
                WhatsApp Number
                <input
                  value={form.whatsapp || ''}
                  onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                  placeholder="+91 98765 43210"
                />
              </label>

              <label>
                Support Email
                <input
                  type="email"
                  value={form.email || ''}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="support@hangerhome.com"
                />
              </label>
            </div>

            <div className="admin-editor-grid">
              <label>
                Studio / Office Address
                <input
                  value={form.address || ''}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
              </label>

              <label>
                Service Coverage Areas
                <input
                  value={form.serviceArea || ''}
                  onChange={(e) => setForm({ ...form, serviceArea: e.target.value })}
                  placeholder="Bangalore, Mumbai, Hyderabad, Pune..."
                />
              </label>

              <label>
                Working Hours
                <input
                  value={form.workingHours || ''}
                  onChange={(e) => setForm({ ...form, workingHours: e.target.value })}
                  placeholder="Mon - Sat: 9:00 AM - 7:00 PM"
                />
              </label>
            </div>
          </div>

          {/* Section 2: Announcement & Live Metrics */}
          <div className="admin-card" style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#e8c070', fontSize: '15px', marginBottom: '16px' }}>Site Announcement & Stats</h3>
            <label>
              Header Announcement Banner Text
              <input
                value={form.announcementText || ''}
                onChange={(e) => setForm({ ...form, announcementText: e.target.value })}
                placeholder="e.g. Free site measurement and professional installation across major cities."
              />
            </label>

            <div className="admin-editor-grid" style={{ marginTop: '14px' }}>
              <label>
                Homes Transformed Count
                <input
                  type="number"
                  value={form.stats?.homes || 1000}
                  onChange={(e) => setForm({ ...form, stats: { ...form.stats, homes: Number(e.target.value) } })}
                />
              </label>

              <label>
                Years of Experience
                <input
                  type="number"
                  value={form.stats?.years || 5}
                  onChange={(e) => setForm({ ...form, stats: { ...form.stats, years: Number(e.target.value) } })}
                />
              </label>

              <label>
                Active Solutions Count
                <input
                  type="number"
                  value={form.stats?.products || 20}
                  onChange={(e) => setForm({ ...form, stats: { ...form.stats, products: Number(e.target.value) } })}
                />
              </label>

              <label>
                Customer Satisfaction %
                <input
                  type="number"
                  value={form.stats?.satisfaction || 99}
                  onChange={(e) => setForm({ ...form, stats: { ...form.stats, satisfaction: Number(e.target.value) } })}
                />
              </label>
            </div>
          </div>

          {/* Section 3: Shipping & Payment Rules */}
          <div className="admin-card" style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#e8c070', fontSize: '15px', marginBottom: '16px' }}>E-Commerce Rules & Gateways</h3>
            <div className="admin-editor-grid">
              <label>
                Free Shipping Cart Minimum (₹)
                <input
                  type="number"
                  value={form.shippingRules?.freeShippingThreshold || 3000}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      shippingRules: { ...form.shippingRules, freeShippingThreshold: Number(e.target.value) },
                    })
                  }
                />
              </label>

              <label>
                Flat Standard Shipping Fee (₹)
                <input
                  type="number"
                  value={form.shippingRules?.flatRate || 99}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      shippingRules: { ...form.shippingRules, flatRate: Number(e.target.value) },
                    })
                  }
                />
              </label>
            </div>

            <div style={{ display: 'flex', gap: '20px', marginTop: '16px' }}>
              <label className="admin-toggle" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  checked={form.paymentMethods?.cod !== false}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      paymentMethods: { ...form.paymentMethods, cod: e.target.checked },
                    })
                  }
                />
                <span>Enable Cash on Delivery (COD)</span>
              </label>

              <label className="admin-toggle" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  checked={form.paymentMethods?.razorpay !== false}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      paymentMethods: { ...form.paymentMethods, razorpay: e.target.checked },
                    })
                  }
                />
                <span>Enable Online Payments (Razorpay UPI, Cards, Netbanking)</span>
              </label>
            </div>
          </div>

          {/* Section 4: Social Media Links */}
          <div className="admin-card" style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#e8c070', fontSize: '15px', marginBottom: '16px' }}>Social Profiles</h3>
            <div className="admin-editor-grid">
              <label>
                Instagram URL
                <input
                  value={form.socialLinks?.instagram || ''}
                  onChange={(e) =>
                    setForm({ ...form, socialLinks: { ...form.socialLinks, instagram: e.target.value } })
                  }
                  placeholder="https://instagram.com/hangerhome"
                />
              </label>

              <label>
                Facebook URL
                <input
                  value={form.socialLinks?.facebook || ''}
                  onChange={(e) =>
                    setForm({ ...form, socialLinks: { ...form.socialLinks, facebook: e.target.value } })
                  }
                  placeholder="https://facebook.com/hangerhome"
                />
              </label>

              <label>
                YouTube URL
                <input
                  value={form.socialLinks?.youtube || ''}
                  onChange={(e) =>
                    setForm({ ...form, socialLinks: { ...form.socialLinks, youtube: e.target.value } })
                  }
                  placeholder="https://youtube.com/@hangerhome"
                />
              </label>
            </div>
          </div>

          <button type="submit" disabled={saving} className="btn btn-primary btn-lg">
            <Save size={16} /> {saving ? 'Publishing Settings…' : 'Save & Publish Settings'}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
