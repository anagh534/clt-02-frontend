import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { mockUsers } from '../../api/mockData';
import { TrendingUp, Briefcase } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('founder@example.com');
  const [password, setPassword] = useState('password');
  const [role, setRole] = useState('founder');
  const [error, setError] = useState('');
  
  const login = useAuthStore(state => state.login);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    
    // In our mock logic, let's just use the selected role to map to the correct mock user
    const targetEmail = role === 'founder' ? 'founder@example.com' : 'investor@example.com';
    const user = mockUsers.find(u => u.email === targetEmail);
    
    if (user && password === 'password') {
      const { password: _, ...userData } = user;
      login(userData);
      navigate(`/${userData.role}/dashboard`);
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-logo"><span className="auth-logo-dot"></span>InvestScore</div>
        <div className="auth-title">Welcome Back</div>
        <div className="auth-sub">Sign in to your account.</div>
        
        {error && <div style={{color: 'var(--red)', textAlign: 'center', marginBottom: '16px'}}>{error}</div>}
        
        <form onSubmit={handleLogin}>
          <div className="input-grp">
            <label className="input-lbl">I am a…</label>
            <div className="role-pick">
              <div className={`role-pill ${role === 'founder' ? 'selected' : ''}`} onClick={() => setRole('founder')}>
                <div className="role-pill-ic"><TrendingUp size={22} /></div>
                <div className="role-pill-name">Founder</div>
              </div>
              <div className={`role-pill ${role === 'investor' ? 'selected' : ''}`} onClick={() => setRole('investor')}>
                <div className="role-pill-ic"><Briefcase size={22} /></div>
                <div className="role-pill-name">Investor</div>
              </div>
            </div>
          </div>
          
          <div className="input-grp">
            <label className="input-lbl">Work Email</label>
            <input 
              type="email" 
              className="input filled" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="input-grp">
            <label className="input-lbl">Password</label>
            <input 
              type="password" 
              className="input filled" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="btn btn-accent btn-full" style={{marginTop: '6px'}}>
            Sign In →
          </button>
        </form>
        
        <div className="terms">Test password is: <b>password</b></div>
        <div className="terms" style={{ marginTop: '10px' }}>
          No account?{' '}
          <Link to="/auth/signup" style={{ color: 'var(--accent)' }}>Create one</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
