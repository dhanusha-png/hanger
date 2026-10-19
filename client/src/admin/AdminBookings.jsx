import React, { useState, useEffect } from 'react';
import { Wrench, Search, Calendar, UserCheck, Trash2, Edit, X, Phone, MapPin } from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { api } from '../lib/api';

export function AdminBookings() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const data = await api('/admin/bookings');
      setList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api(`/admin/bookings/${editing._id}`, {
        method: 'PUT',
        body: JSON.stringify(editing),
      });
      setEditing(null);
      await loadBookings();
    } catch (err) {
      alert(err.message || 'Update failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this service booking?')) {
      try {
        await api(`/admin/bookings/${id}`, { method: 'DELETE' });
        await loadBookings();
      } catch (err) {
        alert(err.message || 'Delete failed');
      }
    }
  };

  const filtered = list.filter((b) => {
    const matchFilter = filter === 'All' || (b.status || '').toLowerCase() === filter.toLowerCase();
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      (b.customer?.name || '').toLowerCase().includes(q) ||
      (b.customer?.phone || '').toLowerCase().includes(q) ||
      (b.type || '').toLowerCase().includes(q) ||
      (b.address?.city || '').toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-heading">
          <div>
            <span className="eyebrow">SERVICE OPERATIONS</span>
            <h1>Installation & Service Bookings</h1>
            <p>Schedule on-site installation, technician visits, repairs and custom space measurement appointments.</p>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', margin: '20px 0', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', minWidth: '260px' }}>
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6e7a76' }} />
            <input
              style={{ margin: 0, paddingLeft: '34px' }}
              placeholder="Search by customer, service type, city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {['All', 'new', 'scheduled', 'in-progress', 'completed', 'cancelled'].map((st) => (
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
                <th>Service Type</th>
                <th>Scheduled Date / Slot</th>
                <th>Location</th>
                <th>Assigned Technician</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: '#95a8a0' }}>
                    Loading service bookings…
                  </td>
                </tr>
              ) : filtered.length ? (
                filtered.map((b) => (
                  <tr key={b._id}>
                    <td>
                      <b style={{ color: '#fff' }}>{b.customer?.name || 'Customer'}</b>
                      <div style={{ fontSize: '12px', color: '#6e7a76' }}>{b.customer?.phone || b.customer?.email}</div>
                    </td>
                    <td>
                      <span className="admin-badge new">{b.type || 'Installation'}</span>
                    </td>
                    <td>
                      <div>{b.preferredDate || 'Not scheduled'}</div>
                      <small style={{ color: '#95a8a0' }}>{b.preferredTime || 'Anytime'}</small>
                    </td>
                    <td>
                      <div>{b.address?.city || '—'}</div>
                      <small style={{ color: '#6e7a76' }}>{b.address?.pincode}</small>
                    </td>
                    <td>
                      {b.assignedTechnician?.name ? (
                        <div>
                          <strong>{b.assignedTechnician.name}</strong>
                          <small style={{ display: 'block', color: '#e8c070' }}>{b.assignedTechnician.phone}</small>
                        </div>
                      ) : (
                        <span style={{ color: '#6e7a76', fontSize: '12px' }}>Unassigned</span>
                      )}
                    </td>
                    <td>
                      <span className={`admin-badge ${(b.status || 'new').toLowerCase()}`}>
                        {b.status || 'New'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button className="mini" onClick={() => setEditing({ ...b })}>
                          <Edit size={12} /> Assign
                        </button>
                        <button className="mini danger" onClick={() => handleDelete(b._id)}>
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="admin-empty">
                    No bookings found matching filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Schedule & Technician Modal */}
        {editing && (
          <div className="admin-modal-backdrop">
            <div className="admin-modal-window" style={{ maxWidth: '560px' }}>
              <button type="button" className="admin-modal-close" onClick={() => setEditing(null)}>
                <X size={18} />
              </button>

              <div className="admin-modal-title">
                <span className="eyebrow">DISPATCH MANAGEMENT</span>
                <h2>{editing.type || 'Service Booking'}</h2>
                <small style={{ color: '#95a8a0' }}>Customer: {editing.customer?.name} ({editing.customer?.phone})</small>
              </div>

              <form onSubmit={handleSave} style={{ marginTop: '16px' }}>
                <div className="admin-editor-grid">
                  <label>
                    Scheduled Appointment Date
                    <input
                      type="date"
                      value={editing.preferredDate || ''}
                      onChange={(e) => setEditing({ ...editing, preferredDate: e.target.value })}
                    />
                  </label>

                  <label>
                    Time Window
                    <input
                      placeholder="e.g. 10:00 AM - 12:00 PM"
                      value={editing.preferredTime || ''}
                      onChange={(e) => setEditing({ ...editing, preferredTime: e.target.value })}
                    />
                  </label>
                </div>

                <div className="admin-editor-grid">
                  <label>
                    Assigned Technician Name
                    <input
                      placeholder="e.g. Ramesh Kumar"
                      value={editing.assignedTechnician?.name || ''}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          assignedTechnician: { ...editing.assignedTechnician, name: e.target.value },
                        })
                      }
                    />
                  </label>

                  <label>
                    Technician Phone Number
                    <input
                      placeholder="+91 9876543210"
                      value={editing.assignedTechnician?.phone || ''}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          assignedTechnician: { ...editing.assignedTechnician, phone: e.target.value },
                        })
                      }
                    />
                  </label>
                </div>

                <label>
                  Service Status
                  <select
                    value={editing.status || 'new'}
                    onChange={(e) => setEditing({ ...editing, status: e.target.value })}
                  >
                    <option value="new">New</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </label>

                <label>
                  Internal Notes & Scope of Work
                  <textarea
                    rows="3"
                    value={editing.adminNotes || editing.notes || ''}
                    onChange={(e) => setEditing({ ...editing, adminNotes: e.target.value })}
                    placeholder="e.g. Ceiling anchors verified, customer requested 6-rod hanger installation"
                  />
                </label>

                <button type="submit" className="btn btn-primary full">
                  Save Dispatch Details
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
