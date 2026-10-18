import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import axiosInstance from '../../api/axiosInstance';
import { TrendingUp, Briefcase, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [resendMessage, setResendMessage] = useState('');

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

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleResendOtp = async () => {
    if (resendTimer > 0 || resending) return;
    setResending(true);
    setError('');
    setResendMessage('');

    try {
      const { data } = await axiosInstance.post('/auth/resend-otp', {
        email,
        type: 'login'
      });
      setResendMessage(data?.message || 'OTP resent to your email.');
      setResendTimer(30);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-logo"><span className="auth-logo-dot"></span>Theliv</div>

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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="input-lbl" style={{ marginBottom: 0 }}>Password</label>
                  <Link to="/auth/forgot-password" style={{ fontSize: '12px', color: 'var(--accent)', textDecoration: 'none' }}>Forgot Password?</Link>
                </div>
                <div className="password-input-wrapper" style={{ marginTop: '6px' }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="input filled"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
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

            {resendMessage && (
              <div style={{ color: 'var(--green, #10b981)', fontSize: '13px', textAlign: 'center', marginBottom: '16px' }}>
                {resendMessage}
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

              <div style={{ textAlign: 'center', marginTop: '14px', fontSize: '13px', color: 'var(--text-muted)' }}>
                Didn't receive the code?{' '}
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resending || resendTimer > 0}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    font: 'inherit',
                    color: resending || resendTimer > 0 ? 'var(--text-muted)' : 'var(--accent)',
                    cursor: resending || resendTimer > 0 ? 'default' : 'pointer',
                    fontWeight: 600
                  }}
                >
                  {resending ? 'Sending…' : resendTimer > 0 ? `Resend code in ${resendTimer}s` : 'Resend Code'}
                </button>
              </div>

              <div
                className="terms"
                style={{ marginTop: '16px', cursor: 'pointer' }}
                onClick={() => {
                  setStep(1);
                  setResendMessage('');
                  setError('');
                }}
              >
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
