import React, { useState, useEffect } from 'react';
import { Users, Search, Ban, CheckCircle2, Eye, X, Mail, Phone, MapPin } from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { api } from '../lib/api';

export function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const data = await api('/admin/customers');
      setCustomers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleToggleBlock = async (id) => {
    try {
      const res = await api(`/admin/customers/${id}/block`, { method: 'PATCH' });
      setCustomers((prev) =>
        prev.map((c) => (c._id === id ? { ...c, isBlocked: res.isBlocked } : c))
      );
      if (selectedCustomer?.customer?._id === id) {
        setSelectedCustomer((prev) => ({
          ...prev,
          customer: { ...prev.customer, isBlocked: res.isBlocked },
        }));
      }
    } catch (err) {
      alert(err.message || 'Action failed');
    }
  };

  const openCustomerDetail = async (id) => {
    setDetailLoading(true);
    try {
      const data = await api(`/admin/customers/${id}`);
      setSelectedCustomer(data);
    } catch (err) {
      alert(err.message || 'Failed to load customer profile');
    } finally {
      setDetailLoading(false);
    }
  };

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase();
    return (
      !q ||
      (c.name || '').toLowerCase().includes(q) ||
      (c.email || '').toLowerCase().includes(q) ||
      (c.phone || '').toLowerCase().includes(q) ||
      (c.city || '').toLowerCase().includes(q)
    );
  });

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-heading">
          <div>
            <span className="eyebrow">USER DIRECTORY</span>
            <h1>Customer Accounts</h1>
            <p>View registered clients, addresses, purchase history and account status.</p>
          </div>
        </div>

        {/* Search */}
        <div style={{ margin: '20px 0', maxWidth: '320px', position: 'relative' }}>
          <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6e7a76' }} />
          <input
            style={{ margin: 0, paddingLeft: '34px' }}
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="admin-card">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Contact</th>
                <th>Location</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#95a8a0' }}>
                    Loading customer accounts…
                  </td>
                </tr>
              ) : filtered.length ? (
                filtered.map((c) => (
                  <tr key={c._id}>
                    <td>
                      <b style={{ color: '#fff' }}>{c.name}</b>
                    </td>
                    <td>
                      <div>{c.email}</div>
                      <small style={{ color: '#6e7a76' }}>{c.phone || 'No phone'}</small>
                    </td>
                    <td>{c.city ? `${c.city} (${c.pincode})` : '—'}</td>
                    <td>
                      <span className={`admin-badge ${c.isBlocked ? 'cancelled' : 'active'}`}>
                        {c.isBlocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td>
                      <small style={{ color: '#95a8a0' }}>
                        {c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-IN') : '—'}
                      </small>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button className="mini" onClick={() => openCustomerDetail(c._id)}>
                          <Eye size={13} /> View
                        </button>
                        <button
                          className={`mini ${c.isBlocked ? '' : 'danger'}`}
                          onClick={() => handleToggleBlock(c._id)}
                        >
                          {c.isBlocked ? <CheckCircle2 size={13} /> : <Ban size={13} />}
                          {c.isBlocked ? 'Unblock' : 'Block'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="admin-empty">
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Customer Detail Modal */}
        {selectedCustomer && (
          <div className="admin-modal-backdrop">
            <div className="admin-modal-window" style={{ maxWidth: '640px' }}>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setSelectedCustomer(null)}
              >
                <X size={18} />
              </button>

              <div className="admin-modal-title">
                <span className="eyebrow">CUSTOMER PROFILE</span>
                <h2>{selectedCustomer.customer.name}</h2>
                <div style={{ display: 'flex', gap: '16px', color: '#95a8a0', fontSize: '13px', marginTop: '6px' }}>
                  <span><Mail size={12} /> {selectedCustomer.customer.email}</span>
                  <span><Phone size={12} /> {selectedCustomer.customer.phone || 'No phone'}</span>
                </div>
              </div>

              {/* Stats Box */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: 'rgba(232, 192, 112, 0.08)', padding: '16px', borderRadius: '12px', margin: '20px 0' }}>
                <div>
                  <span style={{ fontSize: '12px', color: '#95a8a0' }}>Total Orders</span>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#fff' }}>
                    {selectedCustomer.orders?.length || 0}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '12px', color: '#95a8a0' }}>Lifetime Value (Spend)</span>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#e8c070' }}>
                    ₹{Number(selectedCustomer.totalSpend || 0).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Saved Addresses */}
              <div style={{ marginBottom: '20px' }}>
                <b style={{ color: '#e8c070', fontSize: '13px', display: 'block', marginBottom: '8px' }}>Saved Delivery Addresses</b>
                {selectedCustomer.customer.addresses?.length ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {selectedCustomer.customer.addresses.map((a, i) => (
                      <div key={i} style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 14px', borderRadius: '8px', fontSize: '13px' }}>
                        <strong>{a.label}</strong>: {a.line1}, {a.city}, {a.state} - {a.pincode}
                      </div>
                    ))}
                  </div>
                ) : (
                  <small style={{ color: '#6e7a76' }}>No saved delivery addresses.</small>
                )}
              </div>

              {/* Order History */}
              <div>
                <b style={{ color: '#e8c070', fontSize: '13px', display: 'block', marginBottom: '8px' }}>Order History</b>
                {selectedCustomer.orders?.length ? (
                  <table>
                    <thead>
                      <tr>
                        <th>Order</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedCustomer.orders.map((o) => (
                        <tr key={o._id}>
                          <td><b>#{o.orderNumber || o._id.slice(-6).toUpperCase()}</b></td>
                          <td style={{ color: '#e8c070' }}>₹{Number(o.total).toLocaleString('en-IN')}</td>
                          <td><span className={`admin-badge ${(o.status || 'new').toLowerCase()}`}>{o.status}</span></td>
                          <td><small>{new Date(o.createdAt).toLocaleDateString('en-IN')}</small></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <small style={{ color: '#6e7a76' }}>No orders placed yet.</small>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
