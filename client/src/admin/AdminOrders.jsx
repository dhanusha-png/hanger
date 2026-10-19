import React, { useState, useEffect } from 'react';
import {
  Package,
  Search,
  Filter,
  Eye,
  Printer,
  X,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { api } from '../lib/api';

export function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [statusNote, setStatusNote] = useState('');

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await api('/admin/orders');
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const filtered = orders.filter((o) => {
    const matchStatus = statusFilter === 'All' || o.status === statusFilter;
    const matchPayment = paymentFilter === 'All' || o.paymentStatus === paymentFilter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      (o.orderNumber || '').toLowerCase().includes(q) ||
      (o._id || '').toLowerCase().includes(q) ||
      (o.customer?.name || '').toLowerCase().includes(q) ||
      (o.customer?.email || '').toLowerCase().includes(q) ||
      (o.customer?.phone || '').toLowerCase().includes(q);
    return matchStatus && matchPayment && matchSearch;
  });

  const handleUpdateStatus = async (orderId, newStatus) => {
    setUpdating(true);
    try {
      const res = await api(`/admin/orders/${orderId}`, {
        method: 'PUT',
        body: JSON.stringify({
          status: newStatus,
          note: statusNote.trim() || undefined,
        }),
      });
      setSelectedOrder(res);
      setStatusNote('');
      await loadOrders();
    } catch (err) {
      alert(err.message || 'Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdatePayment = async (orderId, newPaymentStatus) => {
    setUpdating(true);
    try {
      const res = await api(`/admin/orders/${orderId}`, {
        method: 'PUT',
        body: JSON.stringify({ paymentStatus: newPaymentStatus }),
      });
      setSelectedOrder(res);
      await loadOrders();
    } catch (err) {
      alert(err.message || 'Failed to update payment status');
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Cancel this order and restore product stock units?')) {
      try {
        const res = await api(`/admin/orders/${orderId}/cancel`, {
          method: 'POST',
          body: JSON.stringify({ reason: 'Cancelled by administrator' }),
        });
        setSelectedOrder(res);
        await loadOrders();
      } catch (err) {
        alert(err.message || 'Failed to cancel order');
      }
    }
  };

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-heading">
          <div>
            <span className="eyebrow">FULFILLMENT PIPELINE</span>
            <h1>Customer Orders</h1>
            <p>Manage order fulfillment, update delivery tracking milestones, process payments and print invoices.</p>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', margin: '20px 0' }}>
          <div style={{ position: 'relative', minWidth: '260px' }}>
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6e7a76' }} />
            <input
              style={{ margin: 0, paddingLeft: '34px' }}
              placeholder="Search by order #, customer name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ margin: 0, width: 'auto' }}>
            <option value="All">All Statuses</option>
            <option value="placed">Placed</option>
            <option value="confirmed">Confirmed</option>
            <option value="packed">Packed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)} style={{ margin: 0, width: 'auto' }}>
            <option value="All">All Payments</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>

        {/* Orders Table */}
        <div className="admin-card">
          <table>
            <thead>
              <tr>
                <th>Order Number</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Fulfillment</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '30px', color: '#95a8a0' }}>
                    Loading orders…
                  </td>
                </tr>
              ) : filtered.length ? (
                filtered.map((o) => (
                  <tr key={o._id}>
                    <td>
                      <b style={{ color: '#fff' }}>#{o.orderNumber || o._id.slice(-6).toUpperCase()}</b>
                    </td>
                    <td>
                      <div>{o.customer?.name || o.user?.name || 'Guest Customer'}</div>
                      <small style={{ color: '#6e7a76' }}>{o.customer?.phone || o.customer?.email}</small>
                    </td>
                    <td>{o.items?.reduce((s, i) => s + (i.qty || 1), 0)} pcs</td>
                    <td>
                      <b style={{ color: '#e8c070' }}>₹{Number(o.total || 0).toLocaleString('en-IN')}</b>
                    </td>
                    <td>
                      <span className={`admin-badge ${(o.paymentStatus || 'pending').toLowerCase()}`}>
                        {o.paymentStatus || 'pending'}
                      </span>
                    </td>
                    <td>
                      <span className={`admin-badge ${(o.status || 'new').toLowerCase()}`}>
                        {o.status || 'new'}
                      </span>
                    </td>
                    <td>
                      <small style={{ color: '#95a8a0' }}>
                        {new Date(o.createdAt).toLocaleDateString('en-IN')}
                      </small>
                    </td>
                    <td>
                      <button className="mini" onClick={() => setSelectedOrder(o)}>
                        <Eye size={13} /> View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="admin-empty">
                    No orders match your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Order Details & Invoice Modal */}
        {selectedOrder && (
          <div className="admin-modal-backdrop">
            <div className="admin-modal-window admin-printable-invoice" style={{ maxWidth: '820px' }}>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setSelectedOrder(null)}
              >
                <X size={18} />
              </button>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(232, 192, 112, 0.2)', paddingBottom: '16px', marginBottom: '20px' }}>
                <div>
                  <span className="eyebrow">ORDER INVOICE & FULFILLMENT</span>
                  <h2 style={{ margin: '4px 0' }}>Order #{selectedOrder.orderNumber || selectedOrder._id.slice(-6).toUpperCase()}</h2>
                  <small style={{ color: '#95a8a0' }}>Placed on {new Date(selectedOrder.createdAt).toLocaleString('en-IN')}</small>
                </div>
                <button
                  type="button"
                  className="btn btn-soft mini"
                  onClick={() => window.print()}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Printer size={14} /> Print Invoice
                </button>
              </div>

              {/* Customer & Address Details */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', marginBottom: '20px' }}>
                <div>
                  <b style={{ color: '#e8c070', fontSize: '12px', textTransform: 'uppercase' }}>Customer Details</b>
                  <div style={{ marginTop: '6px', fontSize: '13px' }}>
                    <div><strong>{selectedOrder.customer?.name || selectedOrder.user?.name || 'Customer'}</strong></div>
                    <div>{selectedOrder.customer?.email || 'No email'}</div>
                    <div>{selectedOrder.customer?.phone || 'No phone'}</div>
                  </div>
                </div>

                <div>
                  <b style={{ color: '#e8c070', fontSize: '12px', textTransform: 'uppercase' }}>Shipping Address</b>
                  <div style={{ marginTop: '6px', fontSize: '13px', lineHeight: '1.4' }}>
                    <div>{selectedOrder.address?.fullName || selectedOrder.customer?.name}</div>
                    <div>{selectedOrder.address?.line1} {selectedOrder.address?.line2}</div>
                    <div>{selectedOrder.address?.city}, {selectedOrder.address?.state} - {selectedOrder.address?.pincode}</div>
                    <div>{selectedOrder.address?.country || 'India'}</div>
                  </div>
                </div>

                <div>
                  <b style={{ color: '#e8c070', fontSize: '12px', textTransform: 'uppercase' }}>Payment Information</b>
                  <div style={{ marginTop: '6px', fontSize: '13px' }}>
                    <div>Method: <strong>{selectedOrder.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Online Payment (Razorpay)'}</strong></div>
                    <div style={{ marginTop: '4px' }}>
                      Status: <span className={`admin-badge ${(selectedOrder.paymentStatus || 'pending').toLowerCase()}`}>{selectedOrder.paymentStatus}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Ordered Snapshot */}
              <div style={{ marginBottom: '20px' }}>
                <b style={{ color: '#e8c070', fontSize: '13px', display: 'block', marginBottom: '10px' }}>Items in Order</b>
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Qty</th>
                      <th>Unit Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(selectedOrder.items || []).map((it, idx) => (
                      <tr key={idx}>
                        <td>
                          <b>{it.name}</b>
                          {it.installation && <small style={{ display: 'block', color: '#e8c070' }}>+ Includes Professional Installation (₹{it.installationPrice})</small>}
                        </td>
                        <td>{it.qty}</td>
                        <td>₹{Number(it.price).toLocaleString('en-IN')}</td>
                        <td>₹{Number((it.price + (it.installation ? it.installationPrice : 0)) * it.qty).toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Price Breakdown */}
              <div style={{ marginLeft: 'auto', maxWidth: '280px', background: 'rgba(232, 192, 112, 0.05)', padding: '16px', borderRadius: '10px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                  <span>Subtotal</span>
                  <b>₹{Number(selectedOrder.subtotal || 0).toLocaleString('en-IN')}</b>
                </div>
                {selectedOrder.installationTotal > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                    <span>Installation Services</span>
                    <b>₹{Number(selectedOrder.installationTotal).toLocaleString('en-IN')}</b>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                  <span>Shipping</span>
                  <b>{selectedOrder.shipping === 0 ? 'FREE' : `₹${selectedOrder.shipping}`}</b>
                </div>
                {selectedOrder.discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px', color: '#4ade80' }}>
                    <span>Coupon Discount</span>
                    <b>-₹{Number(selectedOrder.discount).toLocaleString('en-IN')}</b>
                  </div>
                )}
                <hr style={{ borderColor: 'rgba(232, 192, 112, 0.2)', margin: '10px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: 800, color: '#e8c070' }}>
                  <span>Total Amount</span>
                  <span>₹{Number(selectedOrder.total).toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Admin Fulfillment Controls */}
              <div style={{ borderTop: '1px solid rgba(232, 192, 112, 0.2)', paddingTop: '20px' }}>
                <b style={{ color: '#fff', fontSize: '14px', display: 'block', marginBottom: '12px' }}>Update Fulfillment & Payment</b>

                <div className="admin-editor-grid">
                  <label>
                    Update Fulfillment Status
                    <select
                      value={selectedOrder.status}
                      onChange={(e) => handleUpdateStatus(selectedOrder._id, e.target.value)}
                    >
                      <option value="placed">Placed</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="packed">Packed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </label>

                  <label>
                    Update Payment Status
                    <select
                      value={selectedOrder.paymentStatus}
                      onChange={(e) => handleUpdatePayment(selectedOrder._id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="refunded">Refunded</option>
                      <option value="failed">Failed</option>
                    </select>
                  </label>
                </div>

                <label style={{ marginTop: '10px' }}>
                  Tracking Note (appended to customer order history timeline)
                  <input
                    placeholder="e.g. Dispatched via Bluedart AWB #8492049"
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                  />
                </label>

                {selectedOrder.status !== 'cancelled' && (
                  <button
                    type="button"
                    className="btn btn-soft danger"
                    style={{ marginTop: '12px' }}
                    onClick={() => handleCancelOrder(selectedOrder._id)}
                  >
                    Cancel Order & Restore Stock
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
