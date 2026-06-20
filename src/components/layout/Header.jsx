import { Menu, Bell, User, Moon, Sun } from 'lucide-react';
import { useUiStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';

const Header = () => {
  const { toggleSidebar, theme, toggleTheme } = useUiStore();
  const { user } = useAuthStore();

  return (
    <header className="app-header">
      <button className="btn btn-link text-secondary d-md-none p-0 me-3" onClick={toggleSidebar} aria-label="Toggle Sidebar">
        <Menu size={24} />
      </button>
      
      <div className="d-none d-md-block">
        <h5 className="mb-0 fw-semibold text-primary">Welcome back, {user?.name?.split(' ')[0]}!</h5>
      </div>
      
      <div className="ms-auto d-flex align-items-center gap-3">
        <button 
          className="btn btn-light rounded-circle p-2 d-flex align-items-center justify-content-center border-0 shadow-sm" 
          aria-label="Toggle Theme"
          onClick={toggleTheme}
        >
          {theme === 'dark' ? <Sun size={18} className="text-warning" /> : <Moon size={18} className="text-secondary" />}
        </button>
        <button className="btn btn-light rounded-circle p-2 d-flex align-items-center justify-content-center border-0 shadow-sm position-relative" aria-label="Notifications">
          <Bell size={18} className="text-secondary" />
          <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
            <span className="visually-hidden">New alerts</span>
          </span>
        </button>
        <div className="d-flex align-items-center gap-2 ms-2">
           <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '36px', height: '36px' }}>
              {user?.name?.charAt(0) || 'U'}
           </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
