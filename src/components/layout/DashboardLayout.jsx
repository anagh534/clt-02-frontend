import { useState, useEffect, useRef } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useUiStore } from '../../store/uiStore';
import { useShortlistCount } from '../../hooks/useShortlist';
import { useShortlistStore } from '../../store/shortlistStore';
import { LayoutDashboard, TrendingUp, Bookmark, BookmarkCheck, User, Settings, LogOut, Menu, X, Sun, Moon, Bell, Search as SearchIcon } from 'lucide-react';
import NotificationsPopup from './NotificationsPopup';

export const Sidebar = ({ open, onClose }) => {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useUiStore();
  const location = useLocation();

  useEffect(() => { onClose?.(); }, [location.pathname]);

  if (!user) return null;
  const isFounder = user.role === 'founder';

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  const count = useShortlistStore((s) => s.count);

  useShortlistCount();

  const founderLinks = [
    { to: '/founder/dashboard',  icon: <LayoutDashboard size={17} />,        label: 'Dashboard' },
    { to: '/founder/investors',  icon: <SearchIcon size={17} />,             label: 'Investors' },
    { to: '/founder/saved',      icon: <BookmarkCheck size={17} />,          label: `Saved${count > 0 ? ` (${count})` : ''}` },
    { to: '/founder/onboarding', icon: <TrendingUp size={17} />,             label: 'Update Score' },
    { to: '/founder/profile',    icon: <User size={17} />,                   label: 'Profile' },
  ];

  const investorLinks = [
    { to: '/investor/dashboard', icon: <LayoutDashboard size={17} />, label: 'Dashboard' },
    { to: '/investor/saved',     icon: <Bookmark size={17} />,        label: 'Saved' },
    { to: '/investor/profile',   icon: <User size={17} />,            label: 'Profile' },
  ];

  const mainLinks = isFounder ? founderLinks : investorLinks;

  return (
    <>
      {open && <div className="sidebar-backdrop" onClick={onClose} />}

      <div className={`sidebar${open ? ' sidebar-open' : ''}`}>
        <div className="sidebar-inner">
          <div className="sidebar-head">
            <Link to={`/${user.role}/dashboard`} className="sidebar-logo">
              <span className="sidebar-logo-icon">◆</span>
              InvestScore
            </Link>
            <button className="sidebar-close-btn" onClick={onClose} aria-label="Close menu">
              <X size={18} />
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
              <span className="nav-link-ic"><Settings size={17} /></span>
              Settings
            </Link>
            <button
              className="nav-link"
              style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
              onClick={() => logout()}
            >
              <span className="nav-link-ic"><LogOut size={17} /></span>
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
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const DashboardLayout = ({ allowedRoles = [] }) => {
  const { isAuthenticated, user } = useAuthStore();
  const { theme, toggleTheme } = useUiStore(); // desktop topbar toggle only
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const desktopBellRef = useRef(null);
  const mobileBellRef = useRef(null);

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
        {/* Sticky page topbar — desktop */}
        <div className="page-topbar">
          <div className="page-topbar-left">
            <div className="page-topbar-title">
              <span style={{ color: 'var(--accent)' }}>◆</span> InvestScore
            </div>
          </div>
          <div className="page-topbar-right">
            <button
              className="topbar-icon-btn"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button
              ref={desktopBellRef}
              className="topbar-icon-btn"
              aria-label="Notifications"
              aria-expanded={notifOpen}
              onClick={() => setNotifOpen((v) => !v)}
            >
              <Bell size={16} />
              <span className="topbar-badge" />
            </button>
            <div className="topbar-divider" />
            <Link
              to={`/${user.role}/profile`}
              className="topbar-avatar topbar-avatar-link"
              title={`Go to ${user.name}'s profile`}
              aria-label="Open profile"
            >
              {user.name.charAt(0)}
            </Link>
          </div>
        </div>

        {/* Mobile top bar */}
        <div className="mobile-topnav">
          <button
            className="mobile-menu-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <span className="mobile-topnav-logo">
            <span style={{ color: 'var(--accent)' }}>◆</span> InvestScore
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              ref={mobileBellRef}
              className="mobile-menu-btn"
              aria-label="Notifications"
              aria-expanded={notifOpen}
              style={{ position: 'relative' }}
              onClick={() => setNotifOpen((v) => !v)}
            >
              <Bell size={17} />
              <span className="topbar-badge" />
            </button>
            <Link
              to={`/${user.role}/profile`}
              className="topbar-avatar topbar-avatar-link"
              title={`Go to ${user.name}'s profile`}
              aria-label="Open profile"
              style={{ width: '34px', height: '34px', fontSize: '13px' }}
            >
              {user.name.charAt(0)}
            </Link>
          </div>
        </div>

        <NotificationsPopup
          open={notifOpen}
          onClose={() => setNotifOpen(false)}
          anchorRefs={[desktopBellRef, mobileBellRef]}
        />

        <div className="main-inner">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
