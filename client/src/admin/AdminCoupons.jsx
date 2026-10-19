import React, { useState, useEffect } from 'react';
import { Tag, Plus, Edit, Trash2, X, CheckCircle2, Percent, IndianRupee } from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { api } from '../lib/api';

export function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  const blankCoupon = {
    code: '',
    type: 'percent',
    value: 10,
    minimumOrder: 1500,
    usageLimit: 100,
    isActive: true,
  };

  const loadCoupons = async () => {
    setLoading(true);
    try {
      const data = await api('/admin/coupons');
      setCoupons(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editing.code.trim()) return alert('Coupon code is required.');

    try {
      if (editing._id) {
        await api(`/admin/coupons/${editing._id}`, { method: 'PUT', body: JSON.stringify(editing) });
      } else {
        await api('/admin/coupons', { method: 'POST', body: JSON.stringify(editing) });
      }
      setEditing(null);
      await loadCoupons();
    } catch (err) {
      alert(err.message || 'Save failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this promotional coupon?')) {
      try {
        await api(`/admin/coupons/${id}`, { method: 'DELETE' });
        await loadCoupons();
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
            <span className="eyebrow">DISCOUNTS & PROMOTIONS</span>
            <h1>Coupons & Promo Codes</h1>
            <p>Create percentage and fixed discount codes with minimum purchase requirements and usage limits.</p>
          </div>
          <button className="btn btn-primary" onClick={() => setEditing({ ...blankCoupon })}>
            <Plus size={16} /> Create Coupon
          </button>
        </div>

        <div className="admin-card" style={{ marginTop: '20px' }}>
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Discount</th>
                <th>Min. Order</th>
                <th>Usage / Limit</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#95a8a0' }}>
                    Loading coupons…
                  </td>
                </tr>
              ) : coupons.length ? (
                coupons.map((c) => (
                  <tr key={c._id}>
                    <td>
                      <b style={{ color: '#e8c070', letterSpacing: '0.08em', fontSize: '14px' }}>{c.code}</b>
                    </td>
                    <td>
                      {c.type === 'percent' ? (
                        <span>{c.value}% OFF</span>
                      ) : (
                        <span>₹{c.value} OFF</span>
                      )}
                    </td>
                    <td>₹{Number(c.minimumOrder || c.minOrder || 0).toLocaleString('en-IN')}</td>
                    <td>
                      <span>{c.usedCount || 0}</span> / <span>{c.usageLimit || '∞'}</span>
                    </td>
                    <td>
                      <span className={`admin-badge ${c.isActive !== false ? 'active' : 'cancelled'}`}>
                        {c.isActive !== false ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button className="mini" onClick={() => setEditing({ ...c })}>
                          <Edit size={12} />
                        </button>
                        <button className="mini danger" onClick={() => handleDelete(c._id)}>
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="admin-empty">
                    No active discount coupons found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Coupon Form Modal */}
        {editing && (
          <div className="admin-modal-backdrop">
            <div className="admin-modal-window" style={{ maxWidth: '480px' }}>
              <button type="button" className="admin-modal-close" onClick={() => setEditing(null)}>
                <X size={18} />
              </button>

              <div className="admin-modal-title">
                <span className="eyebrow">COUPON CONFIG</span>
                <h2>{editing._id ? 'Edit Coupon' : 'Create Coupon'}</h2>
              </div>

              <form onSubmit={handleSave}>
                <label>
                  Coupon Code (auto-uppercased) *
                  <input
                    required
                    style={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}
                    value={editing.code || ''}
                    onChange={(e) => setEditing({ ...editing, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. FESTIVE20"
                  />
                </label>

                <div className="admin-editor-grid">
                  <label>
                    Discount Type
                    <select
                      value={editing.type || 'percent'}
                      onChange={(e) => setEditing({ ...editing, type: e.target.value })}
                    >
                      <option value="percent">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (₹)</option>
                    </select>
                  </label>

                  <label>
                    Discount Value *
                    <input
                      type="number"
                      required
                      min="1"
                      value={editing.value || 0}
                      onChange={(e) => setEditing({ ...editing, value: Number(e.target.value) })}
                    />
                  </label>
                </div>

                <div className="admin-editor-grid">
                  <label>
                    Minimum Order Amount (₹)
                    <input
                      type="number"
                      min="0"
                      value={editing.minimumOrder || editing.minOrder || 0}
                      onChange={(e) => setEditing({ ...editing, minimumOrder: Number(e.target.value), minOrder: Number(e.target.value) })}
                    />
                  </label>

                  <label>
                    Maximum Usage Limit
                    <input
                      type="number"
                      min="1"
                      value={editing.usageLimit || 100}
                      onChange={(e) => setEditing({ ...editing, usageLimit: Number(e.target.value) })}
                    />
                  </label>
                </div>

                <label className="admin-toggle" style={{ margin: '14px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    checked={editing.isActive !== false}
                    onChange={(e) => setEditing({ ...editing, isActive: e.target.checked })}
                  />
                  <span>Active & Redeemable at Checkout</span>
                </label>

                <button type="submit" className="btn btn-primary full">
                  Save Coupon
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
