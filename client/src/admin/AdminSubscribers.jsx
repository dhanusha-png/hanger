import React, { useState, useEffect } from 'react';
import { Send, Download, Trash2 } from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { api } from '../lib/api';

export function AdminSubscribers() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadSubscribers = async () => {
    setLoading(true);
    try {
      const data = await api('/admin/subscribers');
      setList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubscribers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Remove this email from subscribers list?')) {
      try {
        await api(`/admin/subscribers/${id}`, { method: 'DELETE' });
        await loadSubscribers();
      } catch (err) {
        alert(err.message || 'Delete failed');
      }
    }
  };

  const handleExportCsv = () => {
    const token = localStorage.getItem('token');
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    window.open(`${baseUrl}/admin/subscribers/export?token=${token}`, '_blank');
  };

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-heading">
          <div>
            <span className="eyebrow">AUDIENCE & CAMPAIGNS</span>
            <h1>Newsletter Subscribers</h1>
            <p>Verified mailing list subscribers collected via the public site footer.</p>
          </div>
          <button className="btn btn-soft" onClick={handleExportCsv} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Download size={14} /> Export CSV List
          </button>
        </div>

        <div className="admin-card" style={{ marginTop: '20px' }}>
          <table>
            <thead>
              <tr>
                <th>Subscriber Email</th>
                <th>Status</th>
                <th>Source</th>
                <th>Joined Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#95a8a0' }}>
                    Loading subscribers…
                  </td>
                </tr>
              ) : list.length ? (
                list.map((s) => (
                  <tr key={s._id}>
                    <td>
                      <b style={{ color: '#fff' }}>{s.email}</b>
                    </td>
                    <td>
                      <span className={`admin-badge ${s.status === 'active' ? 'active' : 'cancelled'}`}>
                        {s.status}
                      </span>
                    </td>
                    <td>{s.source || 'Footer'}</td>
                    <td>
                      <small style={{ color: '#95a8a0' }}>
                        {new Date(s.createdAt).toLocaleDateString('en-IN')}
                      </small>
                    </td>
                    <td>
                      <button className="mini danger" onClick={() => handleDelete(s._id)}>
                        <Trash2 size={12} /> Remove
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="admin-empty">
                    No newsletter subscribers found.
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
