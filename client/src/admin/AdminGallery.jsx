import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Upload, Trash2, Edit, X, Play, Eye, EyeOff } from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { api, img } from '../lib/api';

export function AdminGallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState(null);

  const loadGallery = async () => {
    setLoading(true);
    try {
      const data = await api('/admin/gallery');
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files || !files.length) return;

    setUploading(true);
    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }

      const token = localStorage.getItem('token');
      const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000/api') + '/uploads', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Upload failed');

      const urls = data.files || [data.url];
      for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        const isVideo = url.endsWith('.mp4') || url.endsWith('.webm');
        await api('/admin/gallery', {
          method: 'POST',
          body: JSON.stringify({
            url,
            title: `Installation Gallery ${items.length + i + 1}`,
            category: 'Hangers',
            type: isVideo ? 'video' : 'image',
            order: items.length + i + 1,
            isActive: true,
          }),
        });
      }

      await loadGallery();
    } catch (err) {
      alert(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleToggleActive = async (id, current) => {
    try {
      await api(`/admin/gallery/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ isActive: !current }),
      });
      await loadGallery();
    } catch (err) {
      alert(err.message || 'Toggle failed');
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      await api(`/admin/gallery/${editing._id}`, {
        method: 'PUT',
        body: JSON.stringify(editing),
      });
      setEditing(null);
      await loadGallery();
    } catch (err) {
      alert(err.message || 'Save failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this media item from gallery?')) {
      try {
        await api(`/admin/gallery/${id}`, { method: 'DELETE' });
        await loadGallery();
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
            <span className="eyebrow">PORTFOLIO & ASSETS</span>
            <h1>Gallery Media Management</h1>
            <p>Upload high-resolution installation photos and demonstration videos for the public Gallery page.</p>
          </div>
          <label className="btn btn-primary" style={{ cursor: 'pointer' }}>
            <Upload size={16} /> {uploading ? 'Processing & Optimizing…' : 'Add Media (Images / Videos)'}
            <input hidden type="file" accept="image/*,video/mp4" multiple onChange={handleUpload} />
          </label>
        </div>

        {loading ? (
          <div className="admin-card">Loading media items…</div>
        ) : (
          <div className="admin-gallery-grid" style={{ marginTop: '24px' }}>
            {items.map((item) => {
              const isVideo = item.type === 'video' || item.url?.endsWith('.mp4');
              return (
                <div
                  key={item._id}
                  className="admin-gallery-item"
                  style={{ opacity: item.isActive === false ? 0.5 : 1 }}
                >
                  <div style={{ position: 'relative', width: '100%', height: '180px', overflow: 'hidden' }}>
                    {isVideo ? (
                      <div style={{ width: '100%', height: '100%', background: '#0a1612', display: 'grid', placeItems: 'center' }}>
                        <Play size={36} color="#e8c070" />
                        <span style={{ position: 'absolute', bottom: '8px', left: '8px', background: 'rgba(0,0,0,0.7)', padding: '2px 6px', borderRadius: '4px', fontSize: '10px' }}>
                          VIDEO DEMO
                        </span>
                      </div>
                    ) : (
                      <img src={img(item.url || item.src)} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    )}
                  </div>

                  <div style={{ padding: '12px' }}>
                    <b style={{ display: 'block', fontSize: '13px', color: '#fff', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.title || 'Untitled Media'}
                    </b>
                    <span style={{ fontSize: '11px', color: '#e8c070' }}>{item.category}</span>

                    <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
                      <button className="mini" onClick={() => setEditing({ ...item })}>
                        <Edit size={12} /> Edit
                      </button>
                      <button
                        className="mini"
                        onClick={() => handleToggleActive(item._id, item.isActive !== false)}
                        title={item.isActive === false ? 'Publish' : 'Hide'}
                      >
                        {item.isActive === false ? <Eye size={12} /> : <EyeOff size={12} />}
                      </button>
                      <button className="mini danger" onClick={() => handleDelete(item._id)}>
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Edit Media Modal */}
        {editing && (
          <div className="admin-modal-backdrop">
            <div className="admin-modal-window" style={{ maxWidth: '480px' }}>
              <button type="button" className="admin-modal-close" onClick={() => setEditing(null)}>
                <X size={18} />
              </button>

              <div className="admin-modal-title">
                <span className="eyebrow">MEDIA ATTRIBUTES</span>
                <h2>Edit Gallery Item</h2>
              </div>

              <form onSubmit={handleSaveEdit}>
                <label>
                  Media Caption / Title
                  <input
                    value={editing.title || ''}
                    onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  />
                </label>

                <div className="admin-editor-grid">
                  <label>
                    Category
                    <select
                      value={editing.category || 'Hangers'}
                      onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                    >
                      <option value="Hangers">Hangers</option>
                      <option value="Shoe Racks">Shoe Racks</option>
                      <option value="Projects">Projects</option>
                    </select>
                  </label>

                  <label>
                    Display Sequence (Order)
                    <input
                      type="number"
                      value={editing.order || 0}
                      onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })}
                    />
                  </label>
                </div>

                <label className="admin-toggle" style={{ margin: '14px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    checked={editing.isActive !== false}
                    onChange={(e) => setEditing({ ...editing, isActive: e.target.checked })}
                  />
                  <span>Visible on Public Gallery Page</span>
                </label>

                <button type="submit" className="btn btn-primary full">
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
