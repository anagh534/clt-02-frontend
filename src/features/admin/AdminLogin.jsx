import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuthStore } from '../../store/adminAuthStore';
import axiosInstance from '../../api/axiosInstance';
import { Shield, Eye, EyeOff, ArrowRight } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const login = useAdminAuthStore(state => state.login);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Please enter email and password');
      return;
    }
    setLoading(true);
    try {
      const { data } = await axiosInstance.post('/admin/login', {
        email: email.trim(),
        password
      });
      if (data.success) {
        login(data.user);
        navigate('/admin/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="adm-login-page">
      <div className="adm-login-bg">
        <div className="adm-login-orb adm-login-orb-1" />
        <div className="adm-login-orb adm-login-orb-2" />
        <div className="adm-login-orb adm-login-orb-3" />
      </div>

      <div className="adm-login-container">
        <div className="adm-login-card">
          <div className="adm-login-brand">
            <div className="adm-login-shield">
              <Shield size={24} />
            </div>
            <h1 className="adm-login-title">Admin Panel</h1>
            <p className="adm-login-desc">Sign in to manage the platform</p>
          </div>

          {error && <div className="adm-login-error">{error}</div>}

          <form onSubmit={handleLogin} className="adm-login-form">
            <div className="adm-input-group">
              <label className="adm-input-label">Email Address</label>
              <input
                type="email"
                className="adm-input"
                placeholder="admin@investscore.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="adm-input-group">
              <label className="adm-input-label">Password</label>
              <div className="adm-pw-wrap">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="adm-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="adm-pw-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="adm-login-btn" disabled={loading}>
              {loading ? (
                <><span className="adm-spinner" /> Signing in...</>
              ) : (
                <>Sign In <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <div className="adm-login-footer">
            <a href="/" className="adm-login-back">← Back to main site</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
