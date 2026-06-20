import { Menu, Bell, User } from 'lucide-react';
import { useUiStore } from '../../store/uiStore';

const Header = () => {
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);

  return (
    <header className="app-header">
      <button className="menu-toggle" onClick={toggleSidebar} aria-label="Toggle Sidebar">
        <Menu size={24} />
      </button>
      
      <div className="ms-auto d-flex align-items-center gap-3">
        <button className="btn btn-light rounded-circle p-2 d-flex align-items-center justify-content-center border-0 shadow-sm" aria-label="Notifications">
          <Bell size={20} className="text-secondary" />
        </button>
        <button className="btn btn-light rounded-circle p-2 d-flex align-items-center justify-content-center border-0 shadow-sm" aria-label="User Profile">
          <User size={20} className="text-secondary" />
        </button>
      </div>
    </header>
  );
};

export default Header;
