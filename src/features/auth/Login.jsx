import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import axiosInstance from '../../api/axiosInstance';
import { TrendingUp, Briefcase } from 'lucide-react';

const Login = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const login = useAuthStore(state => state.login);
  const navigate = useNavigate();

  const handleInitiate = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await axiosInstance.post('/auth/login/initiate', {
        email,
        password
      });

      if (data?.user) {
        login(data.user);
        navigate(`/${data.user.role}/dashboard`);
        return;
      }

      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
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
      const { data } = await axiosInstance.post('/auth/login/verify', {
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
            <div className="auth-title">Welcome Back</div>
            <div className="auth-sub">Sign in to your account.</div>

            {error && <div style={{ color: 'var(--red)', textAlign: 'center', marginBottom: '16px', fontSize: '13px' }}>{error}</div>}

            <form onSubmit={handleInitiate}>
              <div className="input-grp">
                <label className="input-lbl">Work Email</label>
                <input
                  type="email"
                  className="input filled"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
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
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button type="submit" className="btn btn-accent btn-full" style={{ marginTop: '6px' }} disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In →'}
              </button>
            </form>

            <div className="terms" style={{ marginTop: '20px' }}>
              No account?{' '}
              <Link to="/auth/signup" style={{ color: 'var(--accent)' }}>Create one</Link>
            </div>
          </>
        ) : (
          <>
            <div className="auth-title">Verify Login</div>
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
                  placeholder="******"
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
                {loading ? 'Verifying…' : 'Verify & Login →'}
              </button>

              <div className="terms" style={{ marginTop: '16px', cursor: 'pointer' }} onClick={() => setStep(1)}>
                ← Back to login
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
