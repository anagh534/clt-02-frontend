import { Outlet, Navigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { LogOut } from 'lucide-react';

export const Sidebar = () => {
  const { user, logout } = useAuthStore();
  
  if (!user) return null;
  const isFounder = user.role === 'founder';
  
  return (
    <div className="sidebar">
      <Link to={`/${user.role}/dashboard`} className="sidebar-logo">
        <span className="sidebar-logo-dot"></span>InvestScore
      </Link>
      <div className="nav-group">
        <div className="nav-group-h">Menu</div>
        {isFounder ? (
          <>
            <Link to="/founder/dashboard" className="nav-link">
              <span className="nav-link-ic">📊</span>My Score
            </Link>
            <Link to="/founder/onboarding" className="nav-link">
              <span className="nav-link-ic">✎</span>Update
            </Link>
            <Link to="/founder/profile" className="nav-link">
              <span className="nav-link-ic">◐</span>Profile
            </Link>
          </>
        ) : (
          <>
            <Link to="/investor/dashboard" className="nav-link">
              <span className="nav-link-ic">⌂</span>Deal Feed
            </Link>
            <Link to="/investor/saved" className="nav-link">
              <span className="nav-link-ic">★</span>Saved
            </Link>
            <Link to="/investor/profile" className="nav-link">
              <span className="nav-link-ic">◐</span>Profile
            </Link>
          </>
        )}
      </div>
      <div className="sidebar-foot" style={{cursor: 'pointer'}} onClick={() => logout()}>
        <div className="sidebar-avatar">{user.name.charAt(0)}</div>
        <div className="sidebar-user">
          <div className="sidebar-user-name">{user.name}</div>
          <div className="sidebar-user-role">{user.role}</div>
        </div>
        <LogOut size={14} className="text-muted" style={{color: 'var(--ink-faint)'}}/>
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
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
