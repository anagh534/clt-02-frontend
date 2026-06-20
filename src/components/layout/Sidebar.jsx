import { NavLink } from 'react-router-dom';
import { Users, PieChart, Settings, LayoutDashboard } from 'lucide-react';
import { useUiStore } from '../../store/uiStore';

const Sidebar = () => {
  const { isSidebarOpen, closeSidebar } = useUiStore();

  return (
    <>
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <NavLink to="/" className="sidebar-brand" onClick={closeSidebar}>
            <PieChart size={28} />
            <span>InvestFlow</span>
          </NavLink>
        </div>
        
        <nav className="sidebar-nav">
          <NavLink to="/" end className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'} onClick={closeSidebar}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/investors" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'} onClick={closeSidebar}>
            <Users size={20} />
            <span>Investors</span>
          </NavLink>
          <NavLink to="/settings" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'} onClick={closeSidebar}>
            <Settings size={20} />
            <span>Settings</span>
          </NavLink>
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
