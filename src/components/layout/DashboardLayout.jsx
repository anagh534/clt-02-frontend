import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { LayoutDashboard, TrendingUp, BarChart2, Globe, Users, HeartHandshake, Briefcase, Bookmark, User, Settings, LogOut } from 'lucide-react';

export const Sidebar = () => {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  if (!user) return null;
  const isFounder = user.role === 'founder';

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const founderLinks = [
    { to: '/founder/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/founder/onboarding', icon: <TrendingUp size={20} />, label: 'Update Score' },
    { to: '/founder/profile', icon: <User size={20} />, label: 'Profile' },
  ];

  const investorLinks = [
    { to: '/investor/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/investor/saved', icon: <Bookmark size={20} />, label: 'Saved' },
    { to: '/investor/profile', icon: <User size={20} />, label: 'Profile' },
  ];

  const supportLinks = [
    { to: `/${user.role}/settings`, icon: <Settings size={20} />, label: 'Settings' },
  ];

  const mainLinks = isFounder ? founderLinks : investorLinks;

  return (
    <div className="sidebar">
      <Link to={`/${user.role}/dashboard`} className="sidebar-logo">
        InvestScore
      </Link>

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
        {supportLinks.map(({ to, icon, label }) => (
          <Link key={to} to={to} className={`nav-link${isActive(to) ? ' active' : ''}`}>
            <span className="nav-link-ic">{icon}</span>
            {label}
          </Link>
        ))}
        <button className="nav-link" style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }} onClick={() => logout()}>
          <span className="nav-link-ic"><LogOut size={20} /></span>
          Logout
        </button>
      </div>

      <div className="sidebar-foot">
        <div className="sidebar-avatar">{user.name.charAt(0)}</div>
        <div className="sidebar-user">
          <div className="sidebar-user-name">{user.name}</div>
          <div className="sidebar-user-role">{user.role}</div>
        </div>
      </div>
    </div>
  );
};

const DashboardLayout = ({ allowedRoles = [] }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  return (
    <div className="app">
      <Sidebar />
      <div className="main">
        <div className="main-inner">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
