import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Search,
  Filter,
  Copy,
  Trash2,
  Edit,
  Upload,
  X,
  AlertTriangle,
  Check,
  Boxes,
  Video,
} from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { api, img } from '../lib/api';

export function AdminProducts() {
  const [list, setList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedIds, setSelectedIds] = useState([]);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const blankProduct = {
    name: '',
    slug: '',
    sku: '',
    modelName: '',
    category: 'Hangers',
    subCategory: '',
    type: '',
    price: 0,
    compareAtPrice: 0,
    mrp: 0,
    stock: 0,
    lowStockThreshold: 5,
    shortDescription: '',
    description: '',
    images: [],
    video: '',
    tags: [],
    features: [],
    specifications: [],
    isFeatured: false,
    isActive: true,
    status: 'active',
    buyEnabled: true,
    quoteEnabled: true,
    installationAvailable: true,
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [pData, cData] = await Promise.all([
        api('/admin/products?limit=100'),
        api('/admin/categories').catch(() => []),
      ]);
      setList(Array.isArray(pData) ? pData : []);
      if (Array.isArray(cData)) setCategories(cData);
    } catch (err) {
      console.error(err);
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = loadData;

  useEffect(() => {
    loadData();
  }, []);

  const availableCategories = useMemo(() => {
    const set = new Set(['Hangers', 'Shoe Racks', 'Storage Solutions', 'Custom Solutions']);
    categories.forEach((c) => {
      if (c.name) set.add(c.name);
    });
    list.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [categories, list]);

  const filtered = list.filter((p) => {
    const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchStatus = selectedStatus === 'All' || p.status === selectedStatus;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      (p.name || '').toLowerCase().includes(q) ||
      (p.sku || '').toLowerCase().includes(q) ||
      (p.modelName || '').toLowerCase().includes(q);
    return matchCat && matchStatus && matchSearch;
  });

  const parseLines = (text) =>
    String(text || '')
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editing.name.trim()) return alert('Product name is required.');
    setSaving(true);

    try {
      const payload = {
        ...editing,
        price: Number(editing.price) || 0,
        compareAtPrice: Number(editing.compareAtPrice) || Number(editing.mrp) || 0,
        mrp: Number(editing.mrp) || Number(editing.compareAtPrice) || 0,
        stock: Number(editing.stock) || 0,
        lowStockThreshold: Number(editing.lowStockThreshold) || 5,
        tags: Array.isArray(editing.tags) ? editing.tags : parseLines(editing.tags),
        features: Array.isArray(editing.features) ? editing.features : parseLines(editing.features),
        specifications: Array.isArray(editing.specifications) ? editing.specifications : [],
      };

      if (editing._id) {
        await api(`/admin/products/${editing._id}`, { method: 'PUT', body: JSON.stringify(payload) });
      } else {
        await api('/admin/products', { method: 'POST', body: JSON.stringify(payload) });
      }

      setEditing(null);
      await loadProducts();
    } catch (err) {
      alert(err.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDuplicate = async (id) => {
    try {
      await api(`/admin/products/${id}/duplicate`, { method: 'POST' });
      await loadProducts();
    } catch (err) {
      alert(err.message || 'Failed to duplicate product');
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Permanently delete "${name}"?`)) {
      try {
        await api(`/admin/products/${id}`, { method: 'DELETE' });
        await loadProducts();
      } catch (err) {
        alert(err.message || 'Failed to delete product');
      }
    }
  };

  const handleBulkStatus = async (status) => {
    if (!selectedIds.length) return;
    try {
      await api('/admin/products/bulk-status', {
        method: 'PATCH',
        body: JSON.stringify({ ids: selectedIds, status }),
      });
      setSelectedIds([]);
      await loadProducts();
    } catch (err) {
      alert(err.message || 'Bulk update failed');
    }
  };

  const handleImageUpload = async (e) => {
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

      const uploadedUrls = data.files || [data.url];
      const newImages = uploadedUrls.map((url) => ({ url, alt: editing.name || 'Product Image' }));

      setEditing((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...newImages],
      }));
    } catch (err) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-heading">
          <div>
            <span className="eyebrow">CATALOG CONTROL</span>
            <h1>Products & Inventory</h1>
            <p>Full control over catalog items, specs, pricing, real-time inventory and media assets.</p>
          </div>
          <button className="btn btn-primary" onClick={() => setEditing({ ...blankProduct })}>
            <Plus size={16} /> Add Product
          </button>
        </div>

        {/* Filters and Controls */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', margin: '20px 0' }}>
          <div style={{ position: 'relative', minWidth: '260px' }}>
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6e7a76' }} />
            <input
              style={{ margin: 0, paddingLeft: '34px' }}
              placeholder="Search products by name, SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} style={{ margin: 0, width: 'auto' }}>
            <option value="All">All Categories</option>
            {availableCategories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} style={{ margin: 0, width: 'auto' }}>
            <option value="All">All Statuses</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>

          {selectedIds.length > 0 && (
            <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
              <span style={{ fontSize: '12px', color: '#e8c070', alignSelf: 'center' }}>
                {selectedIds.length} selected
              </span>
              <button className="mini" onClick={() => handleBulkStatus('active')}>
                Set Active
              </button>
              <button className="mini" onClick={() => handleBulkStatus('draft')}>
                Set Draft
              </button>
            </div>
          )}
        </div>

        {/* Product Table */}
        <div className="admin-card">
          <table>
            <thead>
              <tr>
                <th style={{ width: '40px' }}>
                  <input
                    type="checkbox"
                    checked={filtered.length > 0 && selectedIds.length === filtered.length}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedIds(filtered.map((p) => p._id));
                      else setSelectedIds([]);
                    }}
                  />
                </th>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: '#95a8a0' }}>
                    Loading products catalog…
                  </td>
                </tr>
              ) : filtered.length ? (
                filtered.map((p) => {
                  const isLow = p.stock <= (p.lowStockThreshold || 5);
                  return (
                    <tr key={p._id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(p._id)}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedIds([...selectedIds, p._id]);
                            else setSelectedIds(selectedIds.filter((id) => id !== p._id));
                          }}
                        />
                      </td>
                      <td>
                        <div className="admin-product-cell">
                          {p.images?.[0]?.url ? (
                            <img src={img(p.images[0].url)} alt="" />
                          ) : (
                            <div style={{ width: '42px', height: '42px', background: '#0a1a15', borderRadius: '6px', display: 'grid', placeItems: 'center' }}>
                              <Boxes size={18} color="#6e7a76" />
                            </div>
                          )}
                          <div>
                            <b style={{ color: '#fff' }}>{p.name}</b>
                            <small>{p.sku || p.modelName || 'No SKU'}</small>
                          </div>
                        </div>
                      </td>
                      <td>{p.category}</td>
                      <td>
                        <b style={{ color: '#e8c070' }}>₹{Number(p.price || 0).toLocaleString('en-IN')}</b>
                        {p.compareAtPrice > p.price && (
                          <small style={{ display: 'block', textDecoration: 'line-through', color: '#6e7a76' }}>
                            ₹{Number(p.compareAtPrice).toLocaleString('en-IN')}
                          </small>
                        )}
                      </td>
                      <td>
                        <span style={{ color: isLow ? '#f87171' : '#4ade80', fontWeight: 700 }}>
                          {p.stock} units
                        </span>
                        {isLow && <small style={{ display: 'block', color: '#f87171' }}>Low stock</small>}
                      </td>
                      <td>
                        <span className={`admin-badge ${(p.status || (p.isActive ? 'active' : 'draft')).toLowerCase()}`}>
                          {p.status || (p.isActive ? 'Active' : 'Draft')}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button className="mini" onClick={() => setEditing(p)} title="Edit product">
                            <Edit size={13} /> Edit
                          </button>
                          <button className="mini" onClick={() => handleDuplicate(p._id)} title="Duplicate product">
                            <Copy size={13} /> Copy
                          </button>
                          <button
                            className="mini danger"
                            onClick={() => handleDelete(p._id, p.name)}
                            title="Delete product"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="admin-empty">
                    No products found matching filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add / Edit Product Modal */}
        {editing && (
          <div className="admin-modal-backdrop">
            <div className="admin-modal-window">
              <button type="button" className="admin-modal-close" onClick={() => setEditing(null)}>
                <X size={18} />
              </button>

              <div className="admin-modal-title">
                <span className="eyebrow">PRODUCT SPECIFICATION</span>
                <h2>{editing._id ? 'Edit Product' : 'Add New Product'}</h2>
              </div>

              <form onSubmit={handleSave}>
                <div className="admin-editor-grid">
                  <label>
                    Product Name *
                    <input
                      required
                      value={editing.name || ''}
                      onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                    />
                  </label>
                  <label>
                    Slug (URL identifier)
                    <input
                      value={editing.slug || ''}
                      onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                      placeholder="leave empty to auto-generate"
                    />
                  </label>
                  <label>
                    SKU Code
                    <input
                      value={editing.sku || ''}
                      onChange={(e) => setEditing({ ...editing, sku: e.target.value })}
                      placeholder="e.g. HH-HGR-001"
                    />
                  </label>
                  <label>
                    Model Name
                    <input
                      value={editing.modelName || ''}
                      onChange={(e) => setEditing({ ...editing, modelName: e.target.value })}
                    />
                  </label>
                  <label>
                    Primary Category *
                    <select
                      value={editing.category}
                      onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                    >
                      {availableCategories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Catalog Status
                    <select
                      value={editing.status || (editing.isActive ? 'active' : 'draft')}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          status: e.target.value,
                          isActive: e.target.value === 'active',
                        })
                      }
                    >
                      <option value="active">Active (Visible)</option>
                      <option value="draft">Draft (Unlisted)</option>
                      <option value="archived">Archived</option>
                    </select>
                  </label>
                  <label>
                    Sub-Category
                    <input
                      value={editing.subCategory || ''}
                      onChange={(e) => setEditing({ ...editing, subCategory: e.target.value })}
                      placeholder="e.g. Retractable, Foldable"
                    />
                  </label>
                  <label>
                    Selling Price (₹) *
                    <input
                      type="number"
                      required
                      min="0"
                      value={editing.price || 0}
                      onChange={(e) => setEditing({ ...editing, price: e.target.value })}
                    />
                  </label>
                  <label>
                    MRP / Compare Price (₹)
                    <input
                      type="number"
                      min="0"
                      value={editing.compareAtPrice || editing.mrp || 0}
                      onChange={(e) =>
                        setEditing({ ...editing, compareAtPrice: e.target.value, mrp: e.target.value })
                      }
                    />
                  </label>
                  <label>
                    Stock Units *
                    <input
                      type="number"
                      required
                      min="0"
                      value={editing.stock || 0}
                      onChange={(e) => setEditing({ ...editing, stock: e.target.value })}
                    />
                  </label>
                  <label>
                    Low Stock Threshold
                    <input
                      type="number"
                      min="1"
                      value={editing.lowStockThreshold || 5}
                      onChange={(e) => setEditing({ ...editing, lowStockThreshold: e.target.value })}
                    />
                  </label>
                </div>

                <label style={{ marginTop: '14px' }}>
                  Short Summary
                  <input
                    value={editing.shortDescription || ''}
                    onChange={(e) => setEditing({ ...editing, shortDescription: e.target.value })}
                    placeholder="Brief 1-2 line highlighted benefit"
                  />
                </label>

                <label>
                  Full Description
                  <textarea
                    rows="3"
                    value={editing.description || ''}
                    onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  />
                </label>

                {/* Features & Tags */}
                <div className="admin-editor-grid">
                  <label>
                    Key Features (one per line)
                    <textarea
                      rows="3"
                      value={(editing.features || []).join('\n')}
                      onChange={(e) => setEditing({ ...editing, features: parseLines(e.target.value) })}
                      placeholder="Feature 1\nFeature 2"
                    />
                  </label>
                  <label>
                    Catalog Tags (one per line)
                    <textarea
                      rows="3"
                      value={(editing.tags || []).join('\n')}
                      onChange={(e) => setEditing({ ...editing, tags: parseLines(e.target.value) })}
                      placeholder="Premium\nSpace Saver"
                    />
                  </label>
                </div>

                {/* Technical Specifications */}
                <div className="admin-spec-editor" style={{ margin: '18px 0' }}>
                  <div className="admin-section-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <b style={{ color: '#e8c070', fontSize: '13px' }}>Technical Specifications</b>
                    <button
                      type="button"
                      className="mini"
                      onClick={() =>
                        setEditing((x) => ({
                          ...x,
                          specifications: [...(x.specifications || []), { label: '', value: '' }],
                        }))
                      }
                    >
                      <Plus size={13} /> Add Specification
                    </button>
                  </div>
                  {(editing.specifications || []).map((spec, i) => (
                    <div className="admin-spec-row" key={i} style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                      <input
                        placeholder="Label (e.g. Dimensions)"
                        value={spec.label || ''}
                        onChange={(e) =>
                          setEditing((x) => ({
                            ...x,
                            specifications: x.specifications.map((v, n) =>
                              n === i ? { ...v, label: e.target.value } : v
                            ),
                          }))
                        }
                      />
                      <input
                        placeholder="Value (e.g. 180cm x 60cm)"
                        value={spec.value || ''}
                        onChange={(e) =>
                          setEditing((x) => ({
                            ...x,
                            specifications: x.specifications.map((v, n) =>
                              n === i ? { ...v, value: e.target.value } : v
                            ),
                          }))
                        }
                      />
                      <button
                        type="button"
                        className="mini danger"
                        onClick={() =>
                          setEditing((x) => ({
                            ...x,
                            specifications: x.specifications.filter((_, n) => n !== i),
                          }))
                        }
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                {/* Product Images Uploader */}
                <div style={{ margin: '18px 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <b style={{ color: '#e8c070', fontSize: '13px' }}>Product Images</b>
                    <label className="mini upload-mini" style={{ cursor: 'pointer' }}>
                      <Upload size={13} /> {uploading ? 'Processing…' : 'Upload Images'}
                      <input hidden type="file" accept="image/*" multiple onChange={handleImageUpload} />
                    </label>
                  </div>

                  <div className="admin-media-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: '10px' }}>
                    {(editing.images || []).map((imgObj, i) => (
                      <div
                        key={i}
                        style={{
                          position: 'relative',
                          border: '1px solid rgba(232, 192, 112, 0.2)',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          height: '80px',
                        }}
                      >
                        <img src={img(imgObj.url)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button
                          type="button"
                          onClick={() =>
                            setEditing((x) => ({
                              ...x,
                              images: x.images.filter((_, n) => n !== i),
                            }))
                          }
                          style={{
                            position: 'absolute',
                            top: '4px',
                            right: '4px',
                            background: 'rgba(0,0,0,0.7)',
                            color: '#f87171',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            padding: '2px',
                          }}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Demonstration Video (URL / MP4) */}
                <div style={{ margin: '18px 0' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px' }}>
                    Demonstration Video (MP4 / WebM / URL)
                  </label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                      placeholder="e.g. /uploads/hanger-demo.mp4 or https://..."
                      value={editing.video || ''}
                      onChange={(e) => setEditing({ ...editing, video: e.target.value })}
                      style={{ margin: 0, flex: 1 }}
                    />
                    <label className="mini upload-mini" style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                      <Upload size={13} /> {uploading ? 'Uploading…' : 'Upload Video'}
                      <input
                        hidden
                        type="file"
                        accept="video/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setUploading(true);
                          try {
                            const fd = new FormData();
                            fd.append('files', file);
                            const token = localStorage.getItem('token');
                            const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                            const res = await fetch(`${baseUrl}/uploads`, {
                              method: 'POST',
                              headers: token ? { Authorization: `Bearer ${token}` } : {},
                              body: fd,
                            });
                            const data = await res.json();
                            const vUrl = data.files?.[0] || data.url;
                            if (vUrl) setEditing((x) => ({ ...x, video: vUrl }));
                          } catch (err) {
                            alert(err.message || 'Video upload failed');
                          } finally {
                            setUploading(false);
                          }
                        }}
                      />
                    </label>
                    {editing.video && (
                      <button
                        type="button"
                        className="mini danger"
                        onClick={() => setEditing({ ...editing, video: '' })}
                        title="Remove Video"
                      >
                        <X size={13} />
                      </button>
                    )}
                  </div>
                  {editing.video && (
                    <div style={{ marginTop: '8px' }}>
                      <video
                        src={img(editing.video)}
                        controls
                        style={{ maxHeight: '140px', borderRadius: '8px', maxWidth: '100%' }}
                      />
                    </div>
                  )}
                </div>

                {/* Toggles */}
                <div className="admin-toggle-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '8px', margin: '18px 0' }}>
                  {[
                    ['isActive', 'Visible in Shop'],
                    ['isFeatured', 'Featured Product'],
                    ['buyEnabled', 'Enable Online Buy'],
                    ['quoteEnabled', 'Enable Quote Request'],
                    ['installationAvailable', 'Installation Included'],
                  ].map(([k, lbl]) => (
                    <label className="admin-toggle" key={k} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                      <input
                        type="checkbox"
                        checked={Boolean(editing[k])}
                        onChange={(e) => setEditing({ ...editing, [k]: e.target.checked })}
                      />
                      <span>{lbl}</span>
                    </label>
                  ))}
                </div>

                <button type="submit" disabled={saving} className="btn btn-primary full" style={{ marginTop: '16px' }}>
                  {saving ? 'Saving Changes…' : 'Save Product'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
