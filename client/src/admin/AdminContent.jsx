import React, { useState, useEffect } from 'react';
import { HelpCircle, Star, Plus, Edit, Trash2, X, MessageSquareQuote } from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { api } from '../lib/api';

export function AdminContent() {
  const [activeTab, setActiveTab] = useState('faqs'); // 'faqs' | 'testimonials'
  const [faqs, setFaqs] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingFaq, setEditingFaq] = useState(null);
  const [editingTestimonial, setEditingTestimonial] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [fData, tData] = await Promise.all([api('/admin/faqs'), api('/admin/testimonials')]);
      setFaqs(Array.isArray(fData) ? fData : []);
      setTestimonials(Array.isArray(tData) ? tData : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // FAQ Handlers
  const handleSaveFaq = async (e) => {
    e.preventDefault();
    try {
      if (editingFaq._id) {
        await api(`/admin/faqs/${editingFaq._id}`, { method: 'PUT', body: JSON.stringify(editingFaq) });
      } else {
        await api('/admin/faqs', { method: 'POST', body: JSON.stringify(editingFaq) });
      }
      setEditingFaq(null);
      await loadData();
    } catch (err) {
      alert(err.message || 'Save failed');
    }
  };

  const handleDeleteFaq = async (id) => {
    if (window.confirm('Delete this FAQ?')) {
      try {
        await api(`/admin/faqs/${id}`, { method: 'DELETE' });
        await loadData();
      } catch (err) {
        alert(err.message || 'Delete failed');
      }
    }
  };

  // Testimonial Handlers
  const handleSaveTestimonial = async (e) => {
    e.preventDefault();
    try {
      if (editingTestimonial._id) {
        await api(`/admin/testimonials/${editingTestimonial._id}`, {
          method: 'PUT',
          body: JSON.stringify(editingTestimonial),
        });
      } else {
        await api('/admin/testimonials', { method: 'POST', body: JSON.stringify(editingTestimonial) });
      }
      setEditingTestimonial(null);
      await loadData();
    } catch (err) {
      alert(err.message || 'Save failed');
    }
  };

  const handleDeleteTestimonial = async (id) => {
    if (window.confirm('Delete this testimonial?')) {
      try {
        await api(`/admin/testimonials/${id}`, { method: 'DELETE' });
        await loadData();
      } catch (err) {
        alert(err.message || 'Delete failed');
      }
    }
  };

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-heading">
          <div>
            <span className="eyebrow">SITE COPY & PROOF</span>
            <h1>FAQs & Client Stories</h1>
            <p>Manage common questions for installation and contact pages, and featured customer testimonials.</p>
          </div>
          {activeTab === 'faqs' ? (
            <button
              className="btn btn-primary"
              onClick={() =>
                setEditingFaq({ question: '', answer: '', group: 'installation', order: faqs.length + 1, isActive: true })
              }
            >
              <Plus size={16} /> Add FAQ
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={() =>
                setEditingTestimonial({ name: '', location: '', text: '', rating: 5, image: '', order: testimonials.length + 1, isActive: true })
              }
            >
              <Plus size={16} /> Add Testimonial
            </button>
          )}
        </div>

        {/* Tab switch */}
        <div className="admin-tabs-bar" style={{ marginTop: '20px' }}>
          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'faqs' ? 'active' : ''}`}
            onClick={() => setActiveTab('faqs')}
          >
            <HelpCircle size={15} style={{ verticalAlign: 'middle', marginRight: '6px' }} /> Frequently Asked Questions ({faqs.length})
          </button>
          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'testimonials' ? 'active' : ''}`}
            onClick={() => setActiveTab('testimonials')}
          >
            <MessageSquareQuote size={15} style={{ verticalAlign: 'middle', marginRight: '6px' }} /> Client Testimonials ({testimonials.length})
          </button>
        </div>

        {/* Tab 1: FAQs */}
        {activeTab === 'faqs' && (
          <div className="admin-card">
            <table>
              <thead>
                <tr>
                  <th>Group</th>
                  <th>Question</th>
                  <th>Answer</th>
                  <th>Order</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {faqs.map((f) => (
                  <tr key={f._id}>
                    <td>
                      <span className="admin-badge new">{f.group}</span>
                    </td>
                    <td style={{ maxWidth: '280px', fontWeight: 600, color: '#fff' }}>{f.question}</td>
                    <td style={{ maxWidth: '340px', fontSize: '13px', color: '#b2c0ba' }}>{f.answer}</td>
                    <td>{f.order}</td>
                    <td>
                      <span className={`admin-badge ${f.isActive !== false ? 'active' : 'cancelled'}`}>
                        {f.isActive !== false ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button className="mini" onClick={() => setEditingFaq({ ...f })}>
                          <Edit size={12} />
                        </button>
                        <button className="mini danger" onClick={() => handleDeleteFaq(f._id)}>
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Testimonials */}
        {activeTab === 'testimonials' && (
          <div className="admin-card">
            <table>
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Location</th>
                  <th>Rating</th>
                  <th>Testimonial Quote</th>
                  <th>Order</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {testimonials.map((t) => (
                  <tr key={t._id}>
                    <td>
                      <b style={{ color: '#fff' }}>{t.name}</b>
                    </td>
                    <td>{t.location || '—'}</td>
                    <td>
                      <span style={{ color: '#e8c070', fontWeight: 700 }}>★ {t.rating}/5</span>
                    </td>
                    <td style={{ maxWidth: '360px', fontSize: '13px', color: '#b2c0ba' }}>{t.text}</td>
                    <td>{t.order}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button className="mini" onClick={() => setEditingTestimonial({ ...t })}>
                          <Edit size={12} />
                        </button>
                        <button className="mini danger" onClick={() => handleDeleteTestimonial(t._id)}>
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* FAQ Edit Modal */}
        {editingFaq && (
          <div className="admin-modal-backdrop">
            <div className="admin-modal-window" style={{ maxWidth: '520px' }}>
              <button type="button" className="admin-modal-close" onClick={() => setEditingFaq(null)}>
                <X size={18} />
              </button>
              <div className="admin-modal-title">
                <span className="eyebrow">FAQ EDITOR</span>
                <h2>{editingFaq._id ? 'Edit FAQ' : 'Create FAQ'}</h2>
              </div>
              <form onSubmit={handleSaveFaq}>
                <label>
                  Group / Placement *
                  <select
                    value={editingFaq.group || 'general'}
                    onChange={(e) => setEditingFaq({ ...editingFaq, group: e.target.value })}
                  >
                    <option value="installation">Installation & Services FAQ</option>
                    <option value="contact">Contact & Enquiry FAQ</option>
                    <option value="general">General Website FAQ</option>
                  </select>
                </label>
                <label>
                  Question Text *
                  <input
                    required
                    value={editingFaq.question || ''}
                    onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                  />
                </label>
                <label>
                  Answer *
                  <textarea
                    rows="4"
                    required
                    value={editingFaq.answer || ''}
                    onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                  />
                </label>
                <label>
                  Display Order
                  <input
                    type="number"
                    value={editingFaq.order || 0}
                    onChange={(e) => setEditingFaq({ ...editingFaq, order: Number(e.target.value) })}
                  />
                </label>
                <button type="submit" className="btn btn-primary full" style={{ marginTop: '16px' }}>
                  Save FAQ
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Testimonial Edit Modal */}
        {editingTestimonial && (
          <div className="admin-modal-backdrop">
            <div className="admin-modal-window" style={{ maxWidth: '520px' }}>
              <button type="button" className="admin-modal-close" onClick={() => setEditingTestimonial(null)}>
                <X size={18} />
              </button>
              <div className="admin-modal-title">
                <span className="eyebrow">TESTIMONIAL EDITOR</span>
                <h2>{editingTestimonial._id ? 'Edit Testimonial' : 'Create Testimonial'}</h2>
              </div>
              <form onSubmit={handleSaveTestimonial}>
                <label>
                  Client Name *
                  <input
                    required
                    value={editingTestimonial.name || ''}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, name: e.target.value })}
                  />
                </label>
                <label>
                  Location / Suburb
                  <input
                    placeholder="e.g. Bangalore · Whitefield"
                    value={editingTestimonial.location || ''}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, location: e.target.value })}
                  />
                </label>
                <label>
                  Rating (1 to 5)
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={editingTestimonial.rating || 5}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, rating: Number(e.target.value) })}
                  />
                </label>
                <label>
                  Customer Story / Quote *
                  <textarea
                    rows="3"
                    required
                    value={editingTestimonial.text || ''}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, text: e.target.value })}
                  />
                </label>
                <button type="submit" className="btn btn-primary full" style={{ marginTop: '16px' }}>
                  Save Testimonial
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
