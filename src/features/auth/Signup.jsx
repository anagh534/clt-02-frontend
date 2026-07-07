import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import axiosInstance from '../../api/axiosInstance';
import { TrendingUp, Briefcase } from 'lucide-react';

const Signup = () => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('founder');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const login = useAuthStore(state => state.login);
  const navigate = useNavigate();

  const validate = () => {
    if (!name.trim()) return 'Full name is required.';
    if (!email.trim()) return 'Email is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Enter a valid email address.';
    if (password.length < 6) return 'Password must be at least 6 characters.';
    if (password !== confirm) return 'Passwords do not match.';
    return null;
  };

  const handleInitiate = async (e) => {
    e.preventDefault();
    setError('');
    const err = validate();
    if (err) { setError(err); return; }

    setLoading(true);
    try {
      const { data } = await axiosInstance.post('/auth/register/initiate', {
        name,
        email,
        password,
        role
      });

      if (data?.user) {
        login(data.user);
        navigate(`/${data.user.role}/dashboard`);
        return;
      }

      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to initiate signup');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    if (otp.length !== 6) {
      setError('OTP must be 6 digits.');
      return;
    }
    
    setLoading(true);
    try {
      const { data } = await axiosInstance.post('/auth/register/verify', {
        email,
        otp
      });
      login(data.user);
      navigate(`/${data.user.role}/dashboard`);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-logo"><span className="auth-logo-dot"></span>InvestScore</div>
        
        {step === 1 ? (
          <>
            <div className="auth-title">Create Account</div>
            <div className="auth-sub">Join as a founder or investor.</div>
            
            {error && (
              <div style={{ color: 'var(--red)', fontSize: '13px', textAlign: 'center', marginBottom: '16px' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleInitiate}>
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
                <label className="input-lbl">Full Name</label>
                <input
                  type="text"
                  className="input filled"
                  placeholder="Your full name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>

              <div className="input-grp">
                <label className="input-lbl">Work Email</label>
                <input
                  type="email"
                  className="input filled"
                  placeholder="you@company.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="input-grp">
                <label className="input-lbl">Password</label>
                <input
                  type="password"
                  className="input filled"
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="input-grp">
                <label className="input-lbl">Confirm Password</label>
                <input
                  type="password"
                  className="input filled"
                  placeholder="Repeat your password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-accent btn-full"
                style={{ marginTop: '6px' }}
                disabled={loading}
              >
                {loading ? 'Sending OTP…' : 'Create Account →'}
              </button>
            </form>
            
            <div className="terms">
              Already have an account?{' '}
              <Link to="/auth/login" style={{ color: 'var(--accent)' }}>Sign in</Link>
            </div>
          </>
        ) : (
          <>
            <div className="auth-title">Verify Email</div>
            <div className="auth-sub">Enter the 6-digit code sent to {email}.</div>
            
            {error && (
              <div style={{ color: 'var(--red)', fontSize: '13px', textAlign: 'center', marginBottom: '16px' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleVerify}>
              <div className="input-grp">
                <label className="input-lbl">OTP Code</label>
                <input
                  type="text"
                  className="input filled"
                  placeholder="123456"
                  maxLength="6"
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                  required
                  style={{ letterSpacing: '8px', fontSize: '18px', textAlign: 'center' }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-accent btn-full"
                style={{ marginTop: '6px' }}
                disabled={loading}
              >
                {loading ? 'Verifying…' : 'Verify & Complete →'}
              </button>
              
              <div className="terms" style={{ marginTop: '16px', cursor: 'pointer' }} onClick={() => setStep(1)}>
                ← Back
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Signup;
