import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Boxes,
  Layers,
  Package,
  Users,
  Mail,
  Wrench,
  Image as ImageIcon,
  Star,
  FileText,
  Tag,
  Send,
  Settings,
  ShieldCheck,
  History,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Logo } from '../components/Logo';
import { useAuth } from '../context/AuthContext';

export function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Prevent search engine indexing for all admin screens
  useEffect(() => {
    let meta = document.querySelector('meta[name="robots"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'robots';
      document.head.appendChild(meta);
    }
    meta.content = 'noindex, nofollow';

    return () => {
      meta.content = 'index, follow';
    };
  }, []);

  const isAdmin = user?.role === 'admin';
  const isStaff = user?.role === 'staff' || isAdmin;

  // Role-filtered navigation links
  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, show: true },
    { to: '/admin/products', label: 'Products', icon: Boxes, show: isAdmin },
    { to: '/admin/categories', label: 'Categories', icon: Layers, show: isAdmin },
    { to: '/admin/banners', label: 'Promotional Banners', icon: Sparkles, show: isAdmin },
    { to: '/admin/orders', label: 'Orders', icon: Package, show: isStaff },
    { to: '/admin/customers', label: 'Customers', icon: Users, show: isAdmin },
    { to: '/admin/enquiries', label: 'Enquiries', icon: Mail, show: isStaff },
    { to: '/admin/bookings', label: 'Bookings & Services', icon: Wrench, show: isStaff },
    { to: '/admin/gallery', label: 'Gallery Media', icon: ImageIcon, show: isStaff },
    { to: '/admin/reviews', label: 'Reviews', icon: Star, show: isAdmin },
    { to: '/admin/content', label: 'FAQs & Stories', icon: FileText, show: isAdmin },
    { to: '/admin/coupons', label: 'Coupons', icon: Tag, show: isAdmin },
    { to: '/admin/subscribers', label: 'Subscribers', icon: Send, show: isAdmin },
    { to: '/admin/settings', label: 'Website Settings', icon: Settings, show: isAdmin },
    { to: '/admin/users', label: 'Staff & Roles', icon: ShieldCheck, show: isAdmin },
    { to: '/admin/audit', label: 'Audit Trail', icon: History, show: isAdmin },
  ].filter((item) => item.show);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-shell">
      {/* Mobile Drawer Backdrop */}
      {sidebarOpen && <div className="admin-backdrop" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar Navigation */}
      <aside className={`admin-side ${sidebarOpen ? 'open' : ''}`}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <Logo variant="lockup" height={36} className="admin-side-logo" />
          {sidebarOpen && (
            <button
              type="button"
              className="admin-side-close"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Current Admin Badge */}
        <div
          style={{
            background: 'rgba(232, 192, 112, 0.08)',
            border: '1px solid rgba(232, 192, 112, 0.2)',
            borderRadius: '10px',
            padding: '10px 12px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #e8c070 0%, #c9a24b 100%)',
              color: '#04120e',
              display: 'grid',
              placeItems: 'center',
              fontWeight: 800,
              fontSize: '13px',
            }}
          >
            {user?.name?.[0] || 'A'}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ color: '#fff', fontSize: '13px', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name || 'Administrator'}
            </div>
            <div style={{ color: '#e8c070', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
              {user?.role || 'admin'}
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1, overflowY: 'auto' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <Link
                to={item.to}
                key={item.to}
                onClick={() => setSidebarOpen(false)}
                className={isActive ? 'active' : ''}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  color: isActive ? '#e8c070' : '#b2c0ba',
                  background: isActive ? 'rgba(232, 192, 112, 0.12)' : 'transparent',
                  fontWeight: isActive ? 700 : 500,
                  textDecoration: 'none',
                  transition: 'all 0.18s ease',
                }}
              >
                <Icon size={17} color={isActive ? '#e8c070' : '#889990'} />
                <span>{item.label}</span>
                {isActive && <ChevronRight size={13} style={{ marginLeft: 'auto', opacity: 0.6 }} />}
              </Link>
            );
          })}
        </div>

        <button
          onClick={handleLogout}
          style={{
            marginTop: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 14px',
            background: 'rgba(248, 113, 113, 0.12)',
            border: '1px solid rgba(248, 113, 113, 0.25)',
            borderRadius: '10px',
            color: '#f87171',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 600,
            width: '100%',
          }}
        >
          <LogOut size={16} /> Sign Out
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        <header className="admin-top">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              type="button"
              className="admin-mobile-toggle"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation menu"
            >
              <Menu size={20} />
            </button>
            <span style={{ fontWeight: 700, color: '#f7f3ec' }}>HangerHome Control Center</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link to="/" className="btn btn-soft" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              View Website <ExternalLink size={13} />
            </Link>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}
