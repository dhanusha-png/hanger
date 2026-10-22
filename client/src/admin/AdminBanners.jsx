import React, { useState, useEffect } from 'react';
import {
  Image as ImageIcon,
  Plus,
  Edit,
  Trash2,
  X,
  Upload,
  Eye,
  EyeOff,
  ExternalLink,
  Sparkles,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
} from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { api, img } from '../lib/api';

export function AdminBanners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterPlacement, setFilterPlacement] = useState('All');
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const blankBanner = {
    title: '',
    subtitle: '',
    description: '',
    badge: 'NEW ARRIVAL',
    image: '',
    link: '/products',
    buttonText: 'Explore Solutions',
    placement: 'home_hero',
    order: 0,
    isActive: true,
  };

  const loadBanners = async () => {
    setLoading(true);
    try {
      const data = await api('/admin/banners');
      setBanners(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load banners:', err);
      setBanners([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('files', file);

      const token = localStorage.getItem('token');
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${baseUrl}/uploads`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Image upload failed');

      const uploadedUrl = data.files?.[0] || data.url;
      if (uploadedUrl) {
        setEditing((prev) => ({ ...prev, image: uploadedUrl }));
      }
    } catch (err) {
      setUploadError(err.message || 'Image upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editing.title.trim()) return alert('Banner title is required.');
    if (!editing.image) return alert('Please upload a banner image.');

    setSaving(true);
    try {
      if (editing._id) {
        await api(`/admin/banners/${editing._id}`, {
          method: 'PUT',
          body: JSON.stringify(editing),
        });
      } else {
        await api('/admin/banners', {
          method: 'POST',
          body: JSON.stringify(editing),
        });
      }
      setEditing(null);
      await loadBanners();
    } catch (err) {
      alert(err.message || 'Failed to save banner');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete banner "${title}"?`)) {
      try {
        await api(`/admin/banners/${id}`, { method: 'DELETE' });
        await loadBanners();
      } catch (err) {
        alert(err.message || 'Failed to delete banner');
      }
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      await api(`/admin/banners/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      await loadBanners();
    } catch (err) {
      alert(err.message || 'Failed to toggle banner status');
    }
  };

  const filtered = banners.filter(
    (b) => filterPlacement === 'All' || b.placement === filterPlacement
  );

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-heading">
          <div>
            <span className="eyebrow">VISUAL MERCHANDISING</span>
            <h1>Promotional Banners</h1>
            <p>
              Manage hero campaign slides, promo spotlight cards, and seasonal announcements across the website.
            </p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => {
              setEditing({ ...blankBanner, order: banners.length + 1 });
              setUploadError('');
            }}
          >
            <Plus size={16} /> Add Banner
          </button>
        </div>

        {/* Placement Filter Tabs */}
        <div style={{ display: 'flex', gap: '8px', margin: '20px 0', flexWrap: 'wrap' }}>
          {[
            { id: 'All', label: 'All Banners' },
            { id: 'home_hero', label: 'Homepage Hero Slides' },
            { id: 'home_middle', label: 'Homepage Showcase' },
            { id: 'products_top', label: 'Catalog Top Banner' },
            { id: 'announcement', label: 'Announcement Bar' },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`mini ${filterPlacement === tab.id ? 'btn-primary' : ''}`}
              style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '13px' }}
              onClick={() => setFilterPlacement(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Banners Grid / Table */}
        <div className="admin-card">
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#95a8a0' }}>
              Loading banners…
            </div>
          ) : filtered.length ? (
            <table>
              <thead>
                <tr>
                  <th style={{ width: '120px' }}>Banner Preview</th>
                  <th>Title & Content</th>
                  <th>Placement</th>
                  <th>Action Link</th>
                  <th>Order</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => (
                  <tr key={b._id}>
                    <td>
                      <div
                        style={{
                          width: '110px',
                          height: '62px',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          background: '#04120e',
                          border: '1px solid rgba(232, 192, 112, 0.2)',
                          position: 'relative',
                        }}
                      >
                        {b.image ? (
                          <img
                            src={img(b.image)}
                            alt={b.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <div
                            style={{
                              width: '100%',
                              height: '100%',
                              display: 'grid',
                              placeItems: 'center',
                              color: '#6e7a76',
                            }}
                          >
                            <ImageIcon size={20} />
                          </div>
                        )}
                        {b.badge && (
                          <span
                            style={{
                              position: 'absolute',
                              top: '4px',
                              left: '4px',
                              background: 'rgba(0,0,0,0.75)',
                              color: '#e8c070',
                              fontSize: '9px',
                              fontWeight: 800,
                              padding: '2px 5px',
                              borderRadius: '4px',
                              letterSpacing: '0.05em',
                            }}
                          >
                            {b.badge}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <b style={{ color: '#fff', fontSize: '14px', display: 'block' }}>{b.title}</b>
                      {b.subtitle && (
                        <small style={{ color: '#e8c070', display: 'block', margin: '2px 0' }}>
                          {b.subtitle}
                        </small>
                      )}
                      {b.description && (
                        <p
                          style={{
                            margin: 0,
                            color: '#95a8a0',
                            fontSize: '12px',
                            maxWidth: '300px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {b.description}
                        </p>
                      )}
                    </td>
                    <td>
                      <span
                        className="admin-badge"
                        style={{
                          background: 'rgba(232, 192, 112, 0.1)',
                          color: '#e8c070',
                          border: '1px solid rgba(232, 192, 112, 0.25)',
                        }}
                      >
                        {b.placement.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: '12px' }}>
                        <span style={{ color: '#fff', fontWeight: 600 }}>{b.buttonText || 'Link'}</span>
                        <div style={{ color: '#95a8a0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {b.link}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <b style={{ color: '#e8c070' }}>#{b.order || 0}</b>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleToggleActive(b._id, b.isActive)}
                        className={`admin-badge ${b.isActive ? 'active' : 'cancelled'}`}
                        style={{ cursor: 'pointer', border: 'none' }}
                        title="Click to toggle visibility"
                      >
                        {b.isActive ? 'Active' : 'Hidden'}
                      </button>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          className="mini"
                          onClick={() => {
                            setEditing({ ...b });
                            setUploadError('');
                          }}
                          title="Edit Banner"
                        >
                          <Edit size={13} /> Edit
                        </button>
                        <button
                          className="mini danger"
                          onClick={() => handleDelete(b._id, b.title)}
                          title="Delete Banner"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ padding: '40px', textAlign: 'center', color: '#95a8a0' }}>
              No banners found for this placement. Click "Add Banner" to publish one.
            </div>
          )}
        </div>

        {/* Create / Edit Banner Modal */}
        {editing && (
          <div className="admin-modal-backdrop">
            <div className="admin-modal-window" style={{ maxWidth: '580px' }}>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setEditing(null)}
              >
                <X size={18} />
              </button>

              <div className="admin-modal-title">
                <span className="eyebrow">BANNER DESIGN & COPY</span>
                <h2>{editing._id ? 'Edit Promotional Banner' : 'Create New Banner'}</h2>
              </div>

              <form onSubmit={handleSave}>
                {/* Image Upload & Live Preview */}
                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '13px' }}>
                    Banner Image *
                  </label>
                  <div
                    style={{
                      border: '2px dashed rgba(232, 192, 112, 0.3)',
                      borderRadius: '10px',
                      padding: '16px',
                      background: 'rgba(0,0,0,0.2)',
                      textAlign: 'center',
                    }}
                  >
                    {editing.image ? (
                      <div style={{ position: 'relative', marginBottom: '12px' }}>
                        <img
                          src={img(editing.image)}
                          alt="Banner Preview"
                          style={{
                            width: '100%',
                            maxHeight: '180px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            border: '1px solid rgba(232, 192, 112, 0.3)',
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setEditing({ ...editing, image: '' })}
                          style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            background: 'rgba(0,0,0,0.8)',
                            color: '#f87171',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '4px',
                            cursor: 'pointer',
                          }}
                          title="Remove Image"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : null}

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                      <label
                        className="btn btn-soft"
                        style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}
                      >
                        <Upload size={14} /> {uploading ? 'Uploading…' : editing.image ? 'Replace Image' : 'Upload Banner Image'}
                        <input
                          hidden
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploading}
                        />
                      </label>
                    </div>

                    <div style={{ marginTop: '10px' }}>
                      <input
                        placeholder="Or paste external image URL (e.g. /media/banner.jpg or https://...)"
                        value={editing.image || ''}
                        onChange={(e) => setEditing({ ...editing, image: e.target.value })}
                        style={{ fontSize: '12px', margin: 0 }}
                      />
                    </div>

                    {uploadError && (
                      <small style={{ color: '#f87171', display: 'block', marginTop: '6px' }}>
                        {uploadError}
                      </small>
                    )}
                  </div>
                </div>

                <div className="admin-editor-grid">
                  <label>
                    Placement Target *
                    <select
                      value={editing.placement}
                      onChange={(e) => setEditing({ ...editing, placement: e.target.value })}
                    >
                      <option value="home_hero">Homepage Hero Slides</option>
                      <option value="home_middle">Homepage Showcase</option>
                      <option value="products_top">Catalog Top Banner</option>
                      <option value="announcement">Announcement Bar</option>
                    </select>
                  </label>

                  <label>
                    Badge / Tag (e.g. FESTIVE OFFER)
                    <input
                      value={editing.badge || ''}
                      onChange={(e) => setEditing({ ...editing, badge: e.target.value })}
                      placeholder="e.g. LUXURY SPACES"
                    />
                  </label>
                </div>

                <label>
                  Banner Heading *
                  <input
                    required
                    value={editing.title || ''}
                    onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                    placeholder="e.g. Premium Ceiling Cloth Hangers"
                  />
                </label>

                <label>
                  Subheading
                  <input
                    value={editing.subtitle || ''}
                    onChange={(e) => setEditing({ ...editing, subtitle: e.target.value })}
                    placeholder="e.g. Save 80% Balcony & Utility Space"
                  />
                </label>

                <label>
                  Description
                  <textarea
                    rows="2"
                    value={editing.description || ''}
                    onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                    placeholder="Brief description or feature highlights for this promotion"
                  />
                </label>

                <div className="admin-editor-grid">
                  <label>
                    Button Text
                    <input
                      value={editing.buttonText || ''}
                      onChange={(e) => setEditing({ ...editing, buttonText: e.target.value })}
                      placeholder="e.g. Explore Products"
                    />
                  </label>

                  <label>
                    Button Target Link
                    <input
                      value={editing.link || ''}
                      onChange={(e) => setEditing({ ...editing, link: e.target.value })}
                      placeholder="e.g. /products or /installations"
                    />
                  </label>
                </div>

                <div className="admin-editor-grid">
                  <label>
                    Display Sequence (Order)
                    <input
                      type="number"
                      value={editing.order || 0}
                      onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })}
                    />
                  </label>

                  <label className="admin-toggle" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '22px' }}>
                    <input
                      type="checkbox"
                      checked={editing.isActive !== false}
                      onChange={(e) => setEditing({ ...editing, isActive: e.target.checked })}
                    />
                    <span>Active & Published on Website</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="btn btn-primary full"
                  style={{ marginTop: '20px' }}
                >
                  {saving ? 'Saving Banner…' : 'Save Banner'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
