import { useState, useEffect } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useUiStore } from '../../store/uiStore';
import { LayoutDashboard, TrendingUp, Bookmark, User, Settings, LogOut, Menu, X, Sun, Moon } from 'lucide-react';

export const Sidebar = ({ open, onClose }) => {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useUiStore();
  const location = useLocation();

  // Close sidebar on route change (mobile)
  useEffect(() => { onClose?.(); }, [location.pathname]);

  if (!user) return null;
  const isFounder = user.role === 'founder';

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  const founderLinks = [
    { to: '/founder/dashboard',  icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
    { to: '/founder/onboarding', icon: <TrendingUp size={18} />,      label: 'Update Score' },
    { to: '/founder/profile',    icon: <User size={18} />,            label: 'Profile' },
  ];

  const investorLinks = [
    { to: '/investor/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
    { to: '/investor/saved',     icon: <Bookmark size={18} />,        label: 'Saved' },
    { to: '/investor/profile',   icon: <User size={18} />,            label: 'Profile' },
  ];

  const mainLinks = isFounder ? founderLinks : investorLinks;

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div className="sidebar-backdrop" onClick={onClose} />
      )}

      <div className={`sidebar${open ? ' sidebar-open' : ''}`}>
        <div className="sidebar-head">
          <Link to={`/${user.role}/dashboard`} className="sidebar-logo">
            InvestScore
          </Link>
          {/* Close button — mobile only */}
          <button className="sidebar-close-btn" onClick={onClose} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <div className="nav-group">
          <div className="nav-group-h">Main Menu</div>
          {mainLinks.map(({ to, icon, label }) => (
            <Link key={to} to={to} className={`nav-link${isActive(to) ? ' active' : ''}`}>
              <span className="nav-link-ic">{icon}</span>
              {label}
            </Link>
          ))}
        </div>

        <div className="nav-divider" />

        <div className="nav-group">
          <div className="nav-group-h">Support</div>
          <Link
            to={`/${user.role}/settings`}
            className={`nav-link${isActive(`/${user.role}/settings`) ? ' active' : ''}`}
          >
            <span className="nav-link-ic"><Settings size={18} /></span>
            Settings
          </Link>
          <button
            className="nav-link"
            style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
            onClick={() => logout()}
          >
            <span className="nav-link-ic"><LogOut size={18} /></span>
            Logout
          </button>
        </div>

        <div className="sidebar-foot">
          <div className="sidebar-avatar">{user.name.charAt(0)}</div>
          <div className="sidebar-user">
            <div className="sidebar-user-name">{user.name}</div>
            <div className="sidebar-user-role">{user.role}</div>
          </div>
          <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
      </div>
    </>
  );
};

const DashboardLayout = ({ allowedRoles = [] }) => {
  const { isAuthenticated, user } = useAuthStore();
  const { theme, toggleTheme } = useUiStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  return (
    <div className="app">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main">
        {/* Mobile top bar */}
        <div className="mobile-topnav">
          <button
            className="mobile-menu-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <span className="mobile-topnav-logo">InvestScore</span>
          <button
            className="mobile-menu-btn"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        <div className="main-inner">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
