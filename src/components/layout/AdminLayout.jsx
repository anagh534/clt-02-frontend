import { useState, useEffect } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAdminAuthStore } from '../../store/adminAuthStore';
import {
  LayoutDashboard, Users, UserPlus, UserX, LogOut, Menu, X,
  Home, Shield, ChevronRight
} from 'lucide-react';

const navItems = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Overview' },
  { to: '/admin/users', icon: Users, label: 'All Users' },
  { to: '/admin/users?role=founder', icon: UserPlus, label: 'Founders' },
  { to: '/admin/users?role=investor', icon: UserX, label: 'Investors' },
];

const AdminSidebar = ({ open, onClose }) => {
  const { admin, logout } = useAdminAuthStore();
  const location = useLocation();

  useEffect(() => { onClose?.(); }, [location.pathname]);
  if (!admin) return null;

  const isActive = (path) => {
    const base = path.split('?')[0];
    const params = new URLSearchParams(path.split('?')[1] || '');
    const currentParams = new URLSearchParams(location.search);
    if (params.get('role')) {
      return currentParams.get('role') === params.get('role') && location.pathname === base;
    }
    return location.pathname === base && !currentParams.get('role');
  };

  return (
    <>
      {open && <div className="adm-side-overlay" onClick={onClose} />}
      <aside className={`adm-sidebar${open ? ' adm-sidebar-open' : ''}`}>
        <div className="adm-sidebar-inner">
          {/* Brand */}
          <div className="adm-brand">
            <Link to="/admin/dashboard" className="adm-brand-link">
              <span className="adm-brand-icon"><Shield size={22} /></span>
              <span className="adm-brand-text">Admin<span>Panel</span></span>
            </Link>
            <button className="adm-close-btn" onClick={onClose}><X size={18} /></button>
          </div>

          {/* Navigation */}
          <nav className="adm-nav">
            <div className="adm-nav-label">Management</div>
            {navItems.map(({ to, icon: Icon, label }) => (
              <Link
                key={to}
                to={to}
                className={`adm-nav-item${isActive(to) ? ' adm-nav-active' : ''}`}
              >
                <span className="adm-nav-icon"><Icon size={17} /></span>
                <span className="adm-nav-label-text">{label}</span>
                {isActive(to) && <span className="adm-nav-arrow"><ChevronRight size={14} /></span>}
              </Link>
            ))}
          </nav>

          <div className="adm-nav-divider" />

          <nav className="adm-nav">
            <div className="adm-nav-label">System</div>
            <Link to="/" className="adm-nav-item">
              <span className="adm-nav-icon"><Home size={17} /></span>
              <span className="adm-nav-label-text">Back to Site</span>
            </Link>
            <button onClick={() => logout()} className="adm-nav-item adm-nav-logout">
              <span className="adm-nav-icon"><LogOut size={17} /></span>
              <span className="adm-nav-label-text">Logout</span>
            </button>
          </nav>

          {/* User footer */}
          <div className="adm-side-footer">
            <div className="adm-footer-avatar">{admin.name.charAt(0)}</div>
            <div className="adm-footer-info">
              <div className="adm-footer-name">{admin.name}</div>
              <div className="adm-footer-role">Administrator</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

const AdminLayout = () => {
  const { isAuthenticated, admin } = useAdminAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  if (!isAuthenticated || !admin) {
    return <Navigate to="/admin/login" replace />;
  }

  const pageTitle = navItems.find(n => {
    const base = n.to.split('?')[0];
    return location.pathname.startsWith(base);
  })?.label || 'Admin';

  return (
    <div className="adm-layout">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="adm-main">
        {/* Topbar */}
        <header className="adm-topbar">
          <div className="adm-topbar-left">
            <button className="adm-hamburger" onClick={() => setSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            <div className="adm-topbar-title">
              <Shield size={16} />
              <span>{pageTitle}</span>
            </div>
          </div>
          <div className="adm-topbar-right">
            <div className="adm-topbar-avatar">{admin.name.charAt(0)}</div>
          </div>
        </header>

        {/* Content */}
        <main className="adm-content">
          <div className="adm-content-inner">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
