import React, { useState, useEffect } from 'react';
import { ShieldCheck, Plus, Trash2, Ban, CheckCircle2, X } from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { api } from '../lib/api';

export function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'staff', phone: '' });
  const [saving, setSaving] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await api('/admin/users');
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api('/admin/users', { method: 'POST', body: JSON.stringify(form) });
      setModalOpen(false);
      setForm({ name: '', email: '', password: '', role: 'staff', phone: '' });
      await loadUsers();
    } catch (err) {
      alert(err.message || 'Creation failed');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleDisable = async (id, currentBlocked) => {
    try {
      await api(`/admin/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ isBlocked: !currentBlocked }),
      });
      await loadUsers();
    } catch (err) {
      alert(err.message || 'Action failed');
    }
  };

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-heading">
          <div>
            <span className="eyebrow">ROLE-BASED ACCESS CONTROL</span>
            <h1>Staff & Admin Accounts</h1>
            <p>Manage administrative personnel and assign access permissions to orders, catalog and operations.</p>
          </div>
          <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
            <Plus size={16} /> Add Staff Account
          </button>
        </div>

        <div className="admin-card" style={{ marginTop: '20px' }}>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#95a8a0' }}>
                    Loading staff accounts…
                  </td>
                </tr>
              ) : users.length ? (
                users.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <b style={{ color: '#fff' }}>{u.name}</b>
                    </td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`admin-badge ${u.role === 'admin' ? 'new' : 'active'}`}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <span className={`admin-badge ${u.isBlocked ? 'cancelled' : 'active'}`}>
                        {u.isBlocked ? 'Disabled' : 'Active'}
                      </span>
                    </td>
                    <td>
                      <button
                        className={`mini ${u.isBlocked ? '' : 'danger'}`}
                        onClick={() => handleToggleDisable(u._id, u.isBlocked)}
                      >
                        {u.isBlocked ? <CheckCircle2 size={13} /> : <Ban size={13} />}
                        {u.isBlocked ? 'Enable' : 'Disable'}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="admin-empty">
                    No staff accounts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Create Staff Modal */}
        {modalOpen && (
          <div className="admin-modal-backdrop">
            <div className="admin-modal-window" style={{ maxWidth: '480px' }}>
              <button type="button" className="admin-modal-close" onClick={() => setModalOpen(false)}>
                <X size={18} />
              </button>

              <div className="admin-modal-title">
                <span className="eyebrow">STAFF REGISTRATION</span>
                <h2>New Administrative Account</h2>
              </div>

              <form onSubmit={handleCreate}>
                <label>
                  Full Name *
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </label>

                <label>
                  Staff Email *
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </label>

                <label>
                  Temporary Password *
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                </label>

                <div className="admin-editor-grid">
                  <label>
                    Account Role
                    <select
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                    >
                      <option value="staff">Staff (Orders, Enquiries, Bookings, Gallery)</option>
                      <option value="admin">Administrator (Complete Platform Access)</option>
                    </select>
                  </label>

                  <label>
                    Contact Phone
                    <input
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </label>
                </div>

                <button type="submit" disabled={saving} className="btn btn-primary full" style={{ marginTop: '16px' }}>
                  {saving ? 'Creating Account…' : 'Create Staff Member'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
