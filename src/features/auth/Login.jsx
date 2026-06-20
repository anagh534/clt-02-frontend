import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { mockUsers } from '../../api/mockData';

const Login = () => {
  const [email, setEmail] = useState('founder@example.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  
  const login = useAuthStore(state => state.login);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    
    // Mock authentication
    const user = mockUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
      // Don't store password in real app
      const { password: _, ...userData } = user;
      login(userData);
      navigate(`/${userData.role}/dashboard`);
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="card shadow-lg border-0">
      <div className="card-body p-4 p-md-5">
        <h2 className="text-center mb-4 fw-bold">Welcome Back</h2>
        
        {error && <div className="alert alert-danger py-2">{error}</div>}
        
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label text-secondary fw-medium">Email address</label>
            <input 
              type="email" 
              className="form-control form-control-lg" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="form-label text-secondary fw-medium">Password</label>
            <input 
              type="password" 
              className="form-control form-control-lg" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-lg w-100 d-flex align-items-center justify-content-center gap-2">
            <LogIn size={20} />
            <span>Sign In</span>
          </button>
        </form>

        <div className="text-center mt-4 pt-3 border-top">
           <p className="text-secondary mb-2">Test Accounts:</p>
           <div className="d-flex flex-column gap-1 text-muted small">
             <div>Founder: <strong>founder@example.com</strong> (password)</div>
             <div>Investor: <strong>investor@example.com</strong> (password)</div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
