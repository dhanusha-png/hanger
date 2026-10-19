import React, { useState, useEffect } from 'react';
import { Star, CheckCircle2, XCircle, Trash2, ShieldCheck } from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { api } from '../lib/api';

export function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const data = await api('/admin/reviews');
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleStatus = async (id, status) => {
    try {
      await api(`/admin/reviews/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status, approved: status === 'approved' }),
      });
      await loadReviews();
    } catch (err) {
      alert(err.message || 'Status update failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this review?')) {
      try {
        await api(`/admin/reviews/${id}`, { method: 'DELETE' });
        await loadReviews();
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
            <span className="eyebrow">CUSTOMER FEEDBACK</span>
            <h1>Product Reviews & Moderation</h1>
            <p>Moderate customer reviews, star ratings, and verified buyer badges before displaying them in the catalog.</p>
          </div>
        </div>

        <div className="admin-card" style={{ marginTop: '20px' }}>
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Product</th>
                <th>Rating</th>
                <th>Review Body</th>
                <th>Verified</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: '#95a8a0' }}>
                    Loading reviews…
                  </td>
                </tr>
              ) : reviews.length ? (
                reviews.map((r) => {
                  const isApproved = r.status === 'approved' || r.approved === true;
                  return (
                    <tr key={r._id}>
                      <td>
                        <b style={{ color: '#fff' }}>{r.name || 'Anonymous'}</b>
                      </td>
                      <td>{r.product?.name || '—'}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#e8c070' }}>
                          <Star size={13} fill="currentColor" /> {r.rating}/5
                        </div>
                      </td>
                      <td style={{ maxWidth: '300px', fontSize: '13px' }}>
                        {r.title && <strong>{r.title} — </strong>}
                        {r.body || r.comment || 'No text'}
                      </td>
                      <td>
                        {r.verified ? (
                          <span style={{ color: '#4ade80', fontSize: '11px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                            <ShieldCheck size={13} /> Verified
                          </span>
                        ) : (
                          <span style={{ color: '#6e7a76', fontSize: '11px' }}>Standard</span>
                        )}
                      </td>
                      <td>
                        <span className={`admin-badge ${isApproved ? 'active' : 'cancelled'}`}>
                          {isApproved ? 'Published' : 'Hidden'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          {isApproved ? (
                            <button
                              className="mini"
                              onClick={() => handleStatus(r._id, 'rejected')}
                              title="Hide from public catalog"
                            >
                              <XCircle size={13} /> Hide
                            </button>
                          ) : (
                            <button
                              className="mini"
                              onClick={() => handleStatus(r._id, 'approved')}
                              title="Publish on catalog"
                            >
                              <CheckCircle2 size={13} /> Approve
                            </button>
                          )}
                          <button className="mini danger" onClick={() => handleDelete(r._id)}>
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
                    No customer reviews found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
