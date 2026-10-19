import React, { useState, useEffect } from 'react';
import { Layers, Plus, Edit, Trash2, ChevronRight, X, ArrowUp, ArrowDown } from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { api } from '../lib/api';

export function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const blank = {
    name: '',
    slug: '',
    parent: null,
    level: 1,
    icon: '',
    image: '',
    order: 0,
    isActive: true,
    description: '',
  };

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await api('/admin/categories');
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editing.name.trim()) return alert('Category name is required.');
    setSaving(true);

    try {
      if (editing._id) {
        await api(`/admin/categories/${editing._id}`, { method: 'PUT', body: JSON.stringify(editing) });
      } else {
        await api('/admin/categories', { method: 'POST', body: JSON.stringify(editing) });
      }
      setEditing(null);
      await loadCategories();
    } catch (err) {
      alert(err.message || 'Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete category "${name}"?`)) {
      try {
        await api(`/admin/categories/${id}`, { method: 'DELETE' });
        await loadCategories();
      } catch (err) {
        alert(err.message || 'Failed to delete category');
      }
    }
  };

  // Build tree representation
  const level1 = categories.filter((c) => c.level === 1);
  const getSubcategories = (parentId) => categories.filter((c) => String(c.parent?._id || c.parent) === String(parentId));

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-heading">
          <div>
            <span className="eyebrow">CATALOG TAXONOMY</span>
            <h1>Categories (3-Level Tree)</h1>
            <p>Structure the product catalog tree into Main Catalogs, Sub-Catalogs, and Specific Types.</p>
          </div>
          <button className="btn btn-primary" onClick={() => setEditing({ ...blank })}>
            <Plus size={16} /> Add Category
          </button>
        </div>

        {loading ? (
          <div className="admin-card">Loading taxonomy structure…</div>
        ) : (
          <div className="admin-cat-tree" style={{ marginTop: '20px' }}>
            {level1.map((cat1) => {
              const subCats = getSubcategories(cat1._id);
              return (
                <div key={cat1._id} className="admin-cat-node level-1">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontSize: '11px', color: '#e8c070', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        Level 1: Main Catalog
                      </span>
                      <h3 style={{ margin: '4px 0', color: '#fff', fontSize: '16px' }}>{cat1.name}</h3>
                      <small style={{ color: '#95a8a0' }}>slug: /{cat1.slug} · order: {cat1.order}</small>
                    </div>

                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        className="mini"
                        onClick={() =>
                          setEditing({ ...blank, parent: cat1._id, level: 2, order: subCats.length + 1 })
                        }
                      >
                        <Plus size={12} /> Add Sub
                      </button>
                      <button className="mini" onClick={() => setEditing(cat1)}>
                        <Edit size={12} />
                      </button>
                      <button className="mini danger" onClick={() => handleDelete(cat1._id, cat1.name)}>
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Level 2 Sub-categories */}
                  {subCats.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                      {subCats.map((cat2) => {
                        const types = getSubcategories(cat2._id);
                        return (
                          <div key={cat2._id} className="admin-cat-node level-2">
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <div>
                                <span style={{ fontSize: '10px', color: '#4ade80', fontWeight: 700, textTransform: 'uppercase' }}>
                                  Level 2: Sub-Catalog
                                </span>
                                <h4 style={{ margin: '2px 0', color: '#f7f3ec', fontSize: '14px' }}>{cat2.name}</h4>
                                <small style={{ color: '#889990' }}>slug: /{cat2.slug}</small>
                              </div>

                              <div style={{ display: 'flex', gap: '6px' }}>
                                <button
                                  className="mini"
                                  onClick={() =>
                                    setEditing({ ...blank, parent: cat2._id, level: 3, order: types.length + 1 })
                                  }
                                >
                                  <Plus size={12} /> Add Type
                                </button>
                                <button className="mini" onClick={() => setEditing(cat2)}>
                                  <Edit size={12} />
                                </button>
                                <button className="mini danger" onClick={() => handleDelete(cat2._id, cat2.name)}>
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>

                            {/* Level 3 Specific Types */}
                            {types.length > 0 && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px' }}>
                                {types.map((cat3) => (
                                  <div key={cat3._id} className="admin-cat-node level-3">
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                      <div>
                                        <span style={{ fontSize: '10px', color: '#60a5fa', fontWeight: 700, textTransform: 'uppercase' }}>
                                          Level 3: Specific Type
                                        </span>
                                        <div style={{ fontWeight: 600, color: '#eef1ed', fontSize: '13px' }}>{cat3.name}</div>
                                        <small style={{ color: '#6e7a76' }}>slug: /{cat3.slug}</small>
                                      </div>

                                      <div style={{ display: 'flex', gap: '6px' }}>
                                        <button className="mini" onClick={() => setEditing(cat3)}>
                                          <Edit size={12} />
                                        </button>
                                        <button className="mini danger" onClick={() => handleDelete(cat3._id, cat3.name)}>
                                          <Trash2 size={12} />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Add / Edit Category Modal */}
        {editing && (
          <div className="admin-modal-backdrop">
            <div className="admin-modal-window" style={{ maxWidth: '520px' }}>
              <button type="button" className="admin-modal-close" onClick={() => setEditing(null)}>
                <X size={18} />
              </button>

              <div className="admin-modal-title">
                <span className="eyebrow">CATEGORY FORM</span>
                <h2>{editing._id ? 'Edit Category' : 'Create Category'}</h2>
              </div>

              <form onSubmit={handleSave}>
                <label>
                  Category Name *
                  <input
                    required
                    value={editing.name || ''}
                    onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  />
                </label>

                <label>
                  Slug (URL path)
                  <input
                    value={editing.slug || ''}
                    onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                    placeholder="e.g. ceiling-hangers"
                  />
                </label>

                <div className="admin-editor-grid">
                  <label>
                    Hierarchy Level
                    <select
                      value={editing.level || 1}
                      onChange={(e) => setEditing({ ...editing, level: Number(e.target.value) })}
                    >
                      <option value={1}>Level 1: Main Catalog</option>
                      <option value={2}>Level 2: Sub-Catalog</option>
                      <option value={3}>Level 3: Specific Type</option>
                    </select>
                  </label>

                  <label>
                    Parent Category
                    <select
                      value={editing.parent?._id || editing.parent || ''}
                      onChange={(e) => setEditing({ ...editing, parent: e.target.value || null })}
                    >
                      <option value="">None (Top-Level)</option>
                      {categories
                        .filter((c) => c._id !== editing._id && c.level < 3)
                        .map((c) => (
                          <option key={c._id} value={c._id}>
                            {c.level === 1 ? '— ' : '—— '}
                            {c.name} (L{c.level})
                          </option>
                        ))}
                    </select>
                  </label>
                </div>

                <div className="admin-editor-grid">
                  <label>
                    Display Order
                    <input
                      type="number"
                      value={editing.order || 0}
                      onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })}
                    />
                  </label>

                  <label>
                    Icon / Symbol Name
                    <input
                      value={editing.icon || ''}
                      onChange={(e) => setEditing({ ...editing, icon: e.target.value })}
                      placeholder="e.g. CeilingPulleyIcon"
                    />
                  </label>
                </div>

                <label>
                  Description
                  <textarea
                    rows="2"
                    value={editing.description || ''}
                    onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  />
                </label>

                <label className="admin-toggle" style={{ margin: '14px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    checked={editing.isActive !== false}
                    onChange={(e) => setEditing({ ...editing, isActive: e.target.checked })}
                  />
                  <span>Active & Visible in Sidebar</span>
                </label>

                <button type="submit" disabled={saving} className="btn btn-primary full">
                  {saving ? 'Saving…' : 'Save Category'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
