import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Boxes,
  Package,
  Users,
  Wrench,
  Mail,
  Quote,
  Plus,
  Image as ImageIcon,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { AdminLayout } from './AdminLayout';
import { api } from '../lib/api';

export function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [revDays, setRevDays] = useState(30);

  useEffect(() => {
    let active = true;
    api('/admin/stats')
      .then((data) => {
        if (active && data) setStats(data);
      })
      .catch((err) => console.error('Failed to load stats:', err))
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  // Format 30-day sales data
  const revData = useMemo(() => {
    if (!stats.salesLast30Days || !stats.salesLast30Days.length) {
      // Build fallback empty days
      const days = [];
      const now = new Date();
      const count = revDays;
      for (let i = count - 1; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        days.push({
          label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          revenue: 0,
        });
      }
      return days;
    }

    const sliceCount = revDays === 7 ? 7 : 30;
    return stats.salesLast30Days.slice(-sliceCount).map((d) => ({
      label: new Date(d._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      revenue: Number(d.revenue || 0),
    }));
  }, [stats.salesLast30Days, revDays]);

  // Format order status donut data
  const orderStatusData = useMemo(() => {
    if (!stats.ordersByStatus || !stats.ordersByStatus.length) return [];
    const palette = {
      delivered: '#4ade80',
      shipped: '#60a5fa',
      processing: '#e8c070',
      confirmed: '#c9a24b',
      placed: '#facc15',
      new: '#facc15',
      cancelled: '#f87171',
    };
    return stats.ordersByStatus.map((item) => ({
      name: (item._id || 'Pending').toUpperCase(),
      value: item.count || 0,
      color: palette[String(item._id).toLowerCase()] || '#e8c070',
    }));
  }, [stats.ordersByStatus]);

  const statCards = [
    { label: 'Products', value: stats.products, icon: Boxes, trend: '+4.2%', up: true },
    { label: 'Orders', value: stats.orders, icon: Package, trend: '+12.5%', up: true },
    { label: 'Customers', value: stats.customers, icon: Users, trend: '+18.0%', up: true },
    { label: 'Bookings', value: stats.bookings || stats.services, icon: Wrench, trend: '+5.4%', up: true },
    { label: 'Enquiries', value: stats.enquiries || stats.contacts, icon: Mail, trend: '+14.1%', up: true },
    {
      label: 'Gross Revenue',
      value: '₹' + Number(stats.revenue || 0).toLocaleString('en-IN'),
      icon: Quote,
      trend: '+22.3%',
      up: true,
    },
  ];

  return (
    <AdminLayout>
      <div className="admin-page">
        <span className="eyebrow">PLATFORM OVERVIEW</span>
        <h1>Executive Dashboard</h1>

        {/* Low Stock Alert Banner */}
        {stats.lowStockProducts && stats.lowStockProducts.length > 0 && (
          <div
            style={{
              background: 'rgba(250, 204, 21, 0.1)',
              border: '1px solid rgba(250, 204, 21, 0.3)',
              borderRadius: '12px',
              padding: '12px 18px',
              margin: '16px 0 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#facc15',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertTriangle size={18} />
              <span style={{ fontSize: '13px', fontWeight: 600 }}>
                Inventory Alert: {stats.lowStockProducts.length} product(s) currently have 5 or fewer units in stock.
              </span>
            </div>
            <Link
              to="/admin/products"
              style={{
                color: '#facc15',
                fontSize: '12px',
                fontWeight: 700,
                textDecoration: 'underline',
              }}
            >
              Review Stock
            </Link>
          </div>
        )}

        {/* Stat Cards */}
        {loading ? (
          <div className="admin-stats">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="admin-skeleton skeleton-stat-card" />
            ))}
          </div>
        ) : (
          <div className="admin-stats">
            {statCards.map(({ label, value, icon: Icon, trend, up }) => (
              <div key={label} className="admin-stat-card">
                <div className="admin-stat-header">
                  <div className="admin-stat-icon-wrap">
                    <Icon size={18} />
                  </div>
                  <span className={`admin-stat-trend ${up ? 'up' : 'down'}`}>
                    {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />} {trend}
                  </span>
                </div>
                <span className="admin-stat-label">{label}</span>
                <b className="admin-stat-value">{value ?? '—'}</b>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="admin-quick-actions">
          <Link to="/admin/products" className="admin-quick-btn">
            <Plus size={15} /> <span>Add Product</span>
          </Link>
          <Link to="/admin/orders" className="admin-quick-btn">
            <Package size={15} /> <span>View Orders</span>
          </Link>
          <Link to="/admin/enquiries" className="admin-quick-btn">
            <Mail size={15} /> <span>Customer Enquiries</span>
          </Link>
          <Link to="/admin/bookings" className="admin-quick-btn">
            <Wrench size={15} /> <span>Installation Bookings</span>
          </Link>
          <Link to="/admin/gallery" className="admin-quick-btn">
            <ImageIcon size={15} /> <span>Manage Gallery</span>
          </Link>
        </div>

        {/* Charts Grid */}
        <div className="admin-charts-grid">
          {/* Revenue Chart */}
          <div className="admin-chart-card">
            <div className="admin-chart-header">
              <div>
                <h3>
                  <TrendingUp size={18} /> Sales & Revenue Trend
                </h3>
                <p>Gross sales from paid customer orders</p>
              </div>
              <div className="admin-chart-toggle">
                <button
                  type="button"
                  className={revDays === 7 ? 'active' : ''}
                  onClick={() => setRevDays(7)}
                >
                  7 Days
                </button>
                <button
                  type="button"
                  className={revDays === 30 ? 'active' : ''}
                  onClick={() => setRevDays(30)}
                >
                  30 Days
                </button>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={revData} margin={{ top: 10, right: 12, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGold" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e8c070" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#e8c070" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="label" stroke="#6a7c75" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#6a7c75"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(v) => '₹' + (v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v)}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(4,18,14,0.96)',
                    borderColor: 'rgba(232,192,112,0.35)',
                    borderRadius: '10px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  itemStyle={{ color: '#e8c070', fontWeight: 700 }}
                  formatter={(val) => ['₹' + Number(val).toLocaleString('en-IN'), 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#e8c070" strokeWidth={2.5} fillOpacity={1} fill="url(#revGold)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Orders by Status Donut */}
          <div className="admin-chart-card">
            <div className="admin-chart-header">
              <div>
                <h3>
                  <Package size={18} /> Orders by Status
                </h3>
                <p>Current fulfillment and delivery pipeline</p>
              </div>
            </div>

            {orderStatusData.length > 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', flexWrap: 'wrap', gap: '16px' }}>
                <ResponsiveContainer width="55%" height={240} minWidth={180}>
                  <PieChart>
                    <Pie data={orderStatusData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
                      {orderStatusData.map((e, idx) => (
                        <Cell key={idx} fill={e.color} stroke="transparent" />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(4,18,14,0.96)',
                        borderColor: 'rgba(232,192,112,0.35)',
                        borderRadius: '10px',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                      formatter={(val) => [val + ' orders', 'Count']}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="donut-legend-wrap">
                  {orderStatusData.map((item) => (
                    <div key={item.name} className="donut-legend-item">
                      <span>
                        <span className="donut-legend-dot" style={{ background: item.color }} />
                        {item.name}
                      </span>
                      <span className="donut-legend-val">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="admin-chart-empty">
                <Package size={36} />
                <p>No orders recorded yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity Tables */}
        <div className="admin-charts-grid" style={{ marginTop: '24px' }}>
          {/* Recent Orders */}
          <div className="admin-chart-card">
            <div className="admin-chart-header">
              <div>
                <h3>
                  <Package size={18} /> Recent Orders
                </h3>
                <p>Latest customer purchases</p>
              </div>
              <Link to="/admin/orders" className="mini">
                View All <ArrowRight size={12} />
              </Link>
            </div>
            <div className="admin-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders && stats.recentOrders.length > 0 ? (
                    stats.recentOrders.map((o) => (
                      <tr key={o._id}>
                        <td>
                          <b>#{o.orderNumber || o._id.slice(-6).toUpperCase()}</b>
                        </td>
                        <td>{o.customer?.name || o.user?.name || 'Customer'}</td>
                        <td style={{ color: '#e8c070', fontWeight: 700 }}>
                          ₹{Number(o.total || 0).toLocaleString('en-IN')}
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
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '24px', color: '#95a8a0' }}>
                        No orders recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Enquiries */}
          <div className="admin-chart-card">
            <div className="admin-chart-header">
              <div>
                <h3>
                  <Mail size={18} /> Incoming Enquiries
                </h3>
                <p>Latest leads and customer requests</p>
              </div>
              <Link to="/admin/enquiries" className="mini">
                View All <ArrowRight size={12} />
              </Link>
            </div>
            <div className="admin-enquiries-list">
              {stats.recentEnquiries && stats.recentEnquiries.length > 0 ? (
                stats.recentEnquiries.map((c) => (
                  <div key={c._id} className="admin-enquiry-item">
                    <div className="admin-enquiry-top">
                      <span className="admin-enquiry-name">{c.name}</span>
                      <span className={`admin-badge ${(c.status || 'new').toLowerCase()}`}>{c.status || 'New'}</span>
                    </div>
                    <p className="admin-enquiry-msg">{c.message || 'No message provided.'}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                      <small style={{ color: '#6e7a76' }}>
                        {c.requirement || 'General'} · {c.phone || c.email || 'Direct'}
                      </small>
                      <small style={{ color: '#95a8a0' }}>
                        {new Date(c.createdAt).toLocaleDateString('en-IN')}
                      </small>
                    </div>
                  </div>
                ))
              ) : (
                <div className="admin-chart-empty" style={{ minHeight: '160px' }}>
                  <Mail size={32} />
                  <p>No recent customer enquiries.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
