import React, { useState, useEffect } from 'react';
import { Mail, Search, Download, Trash2, Edit, X, Phone, Plus } from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { api } from '../lib/api';

export function AdminEnquiries() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);

  const blankEnquiry = {
    name: '',
    email: '',
    phone: '',
    requirement: 'Ceiling Cloth Hangers',
    message: '',
    status: 'new',
    adminNotes: '',
  };

  const loadEnquiries = async () => {
    setLoading(true);
    try {
      const data = await api('/admin/enquiries');
      setList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editing.name.trim() || !editing.email.trim()) {
      return alert('Name and email are required.');
    }
    try {
      if (editing._id) {
        await api(`/admin/enquiries/${editing._id}`, {
          method: 'PUT',
          body: JSON.stringify(editing),
        });
      } else {
        await api('/admin/enquiries', {
          method: 'POST',
          body: JSON.stringify(editing),
        });
      }
      setEditing(null);
      await loadEnquiries();
    } catch (err) {
      alert(err.message || 'Save failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this enquiry record?')) {
      try {
        await api(`/admin/enquiries/${id}`, { method: 'DELETE' });
        await loadEnquiries();
      } catch (err) {
        alert(err.message || 'Delete failed');
      }
    }
  };

  const handleExportCsv = () => {
    const token = localStorage.getItem('token');
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    window.open(`${baseUrl}/admin/enquiries/export?token=${token}`, '_blank');
  };

  const filtered = list.filter((c) => {
    const matchFilter = filter === 'All' || (c.status || '').toLowerCase() === filter.toLowerCase();
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      (c.name || '').toLowerCase().includes(q) ||
      (c.email || '').toLowerCase().includes(q) ||
      (c.phone || '').toLowerCase().includes(q) ||
      (c.requirement || '').toLowerCase().includes(q) ||
      (c.message || '').toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-heading">
          <div>
            <span className="eyebrow">CUSTOMER INQUIRIES & LEADS</span>
            <h1>Contact Form Enquiries</h1>
            <p>Review customer questions, consultation requests, and update contact status.</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-primary" onClick={() => setEditing({ ...blankEnquiry })} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Plus size={14} /> New Lead
            </button>
            <button className="btn btn-soft" onClick={handleExportCsv} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Download size={14} /> Export CSV
            </button>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', margin: '20px 0', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', minWidth: '260px' }}>
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6e7a76' }} />
            <input
              style={{ margin: 0, paddingLeft: '34px' }}
              placeholder="Search enquiries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {['All', 'new', 'contacted', 'in-progress', 'resolved'].map((st) => (
              <button
                key={st}
                className={`mini ${filter === st ? 'btn-primary' : ''}`}
                style={{ padding: '8px 14px', borderRadius: '8px', textTransform: 'capitalize' }}
                onClick={() => setFilter(st)}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="admin-card">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Requirement</th>
                <th>Message</th>
                <th>Status</th>
                <th>Received</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#95a8a0' }}>
                    Loading enquiries…
                  </td>
                </tr>
              ) : filtered.length ? (
                filtered.map((c) => (
                  <tr key={c._id}>
                    <td>
                      <b style={{ color: '#fff' }}>{c.name}</b>
                      <div style={{ fontSize: '12px', color: '#b2c0ba' }}>{c.email}</div>
                      <small style={{ color: '#6e7a76' }}>{c.phone || 'No phone'}</small>
                    </td>
                    <td>
                      <span className="admin-badge new">{c.requirement || 'General'}</span>
                    </td>
                    <td style={{ maxWidth: '280px', fontSize: '13px', lineHeight: '1.4' }}>
                      {c.message}
                      {c.adminNotes && (
                        <div style={{ marginTop: '4px', fontSize: '11px', color: '#e8c070', background: 'rgba(232,192,112,0.1)', padding: '4px 8px', borderRadius: '4px' }}>
                          Note: {c.adminNotes}
                        </div>
                      )}
                    </td>
                    <td>
                      <select
                        value={(c.status || 'new').toLowerCase()}
                        onChange={(e) => handleUpdate(c._id, e.target.value, c.adminNotes)}
                        style={{ margin: 0, padding: '4px 8px', fontSize: '12px' }}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </td>
                    <td>
                      <small style={{ color: '#95a8a0' }}>
                        {new Date(c.createdAt).toLocaleDateString('en-IN')}
                      </small>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button className="mini" onClick={() => setEditing(c)}>
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
                    No customer enquiries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Edit Note Modal */}
        {editing && (
          <div className="admin-modal-backdrop">
            <div className="admin-modal-window" style={{ maxWidth: '480px' }}>
              <button type="button" className="admin-modal-close" onClick={() => setEditing(null)}>
                <X size={18} />
              </button>
              <div className="admin-modal-title">
                <span className="eyebrow">ENQUIRY DETAILS</span>
                <h2>{editing._id ? 'Edit Lead / Enquiry' : 'Log New Customer Lead'}</h2>
              </div>

              <form onSubmit={handleSave}>
                <label>
                  Customer Name *
                  <input
                    required
                    value={editing.name || ''}
                    onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                    placeholder="Full name"
                  />
                </label>

                <div className="admin-editor-grid">
                  <label>
                    Email Address *
                    <input
                      required
                      type="email"
                      value={editing.email || ''}
                      onChange={(e) => setEditing({ ...editing, email: e.target.value })}
                      placeholder="customer@example.com"
                    />
                  </label>

                  <label>
                    Phone Number
                    <input
                      value={editing.phone || ''}
                      onChange={(e) => setEditing({ ...editing, phone: e.target.value })}
                      placeholder="+91 9876543210"
                    />
                  </label>
                </div>

                <div className="admin-editor-grid">
                  <label>
                    Requirement
                    <input
                      value={editing.requirement || ''}
                      onChange={(e) => setEditing({ ...editing, requirement: e.target.value })}
                      placeholder="e.g. Ceiling Cloth Hangers"
                    />
                  </label>

                  <label>
                    Status
                    <select
                      value={editing.status || 'new'}
                      onChange={(e) => setEditing({ ...editing, status: e.target.value })}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </label>
                </div>

                <label>
                  Customer Message / Inquired Specifications
                  <textarea
                    rows="3"
                    value={editing.message || ''}
                    onChange={(e) => setEditing({ ...editing, message: e.target.value })}
                    placeholder="Customer requirement details..."
                  />
                </label>

                <label>
                  Admin Follow-up Notes
                  <textarea
                    rows="2"
                    value={editing.adminNotes || ''}
                    onChange={(e) => setEditing({ ...editing, adminNotes: e.target.value })}
                    placeholder="e.g. Called customer on 19th Oct, scheduled balcony site visit"
                  />
                </label>

                <button
                  type="submit"
                  className="btn btn-primary full"
                  style={{ marginTop: '14px' }}
                >
                  Save Enquiry
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
