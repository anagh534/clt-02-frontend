import { NavLink, useNavigate } from 'react-router-dom';
import { Activity, Search, Bookmark, Settings, LogOut, User, PieChart } from 'lucide-react';
import { useUiStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';

const Sidebar = () => {
  const { isSidebarOpen, closeSidebar } = useUiStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const isFounder = user?.role === 'founder';

  return (
    <>
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <NavLink to={`/${user?.role}/dashboard`} className="d-flex align-items-center gap-2 text-decoration-none" onClick={closeSidebar}>
            <Activity className="text-primary" size={28} />
            <span className="h4 mb-0 fw-bold score-gradient">Theliv</span>
          </NavLink>
        </div>
        
        <nav className="sidebar-nav">
          {isFounder ? (
            <>
              <NavLink to="/founder/dashboard" end className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'} onClick={closeSidebar}>
                <PieChart size={20} />
                <span>Dashboard</span>
              </NavLink>
              <NavLink to="/founder/onboarding" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'} onClick={closeSidebar}>
                <Activity size={20} />
                <span>Update Score</span>
              </NavLink>
              <NavLink to="/founder/profile" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'} onClick={closeSidebar}>
                <User size={20} />
                <span>Startup Profile</span>
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/investor/dashboard" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'} onClick={closeSidebar}>
                <Search size={20} />
                <span>Deal Feed</span>
              </NavLink>
              <NavLink to="/investor/saved" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'} onClick={closeSidebar}>
                <Bookmark size={20} />
                <span>Saved Startups</span>
              </NavLink>
              <NavLink to="/investor/profile" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'} onClick={closeSidebar}>
                <User size={20} />
                <span>Investor Profile</span>
              </NavLink>
            </>
          )}

          <div className="mt-4 px-3">
            <small className="text-muted fw-bold text-uppercase px-2">Account</small>
            <NavLink to={`/${user?.role}/settings`} className={({isActive}) => isActive ? 'nav-item active mt-2' : 'nav-item mt-2'} onClick={closeSidebar}>
              <Settings size={20} />
              <span>Settings</span>
            </NavLink>
            <button onClick={handleLogout} className="nav-item w-100 border-0 bg-transparent text-start mt-1">
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </div>
      
      {/* Overlay for mobile */}
      <div 
        className="sidebar-overlay" 
        onClick={closeSidebar}
        aria-hidden="true"
      />
    </>
  );
};

export default Sidebar;
