import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { Eye, EyeOff } from 'lucide-react';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleInitiate = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const { data } = await axiosInstance.post('/auth/forgot-password', { email });
      setMessage(data.message || 'OTP sent to your email.');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Error sending OTP. Make sure the email is registered.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    if (otp.length !== 6) {
      setError('OTP must be 6 digits.');
      return;
    }
    
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const { data } = await axiosInstance.post('/auth/reset-password', {
        email,
        otp,
        newPassword
      });
      setMessage(data.message || 'Password reset successful!');
      setTimeout(() => {
        navigate('/auth/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP or error resetting password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-logo"><span className="auth-logo-dot"></span>Theliv</div>

        {step === 1 ? (
          <>
            <div className="auth-title">Forgot Password</div>
            <div className="auth-sub">Enter your email to receive a reset code.</div>

            {error && <div style={{ color: 'var(--red)', textAlign: 'center', marginBottom: '16px', fontSize: '13px' }}>{error}</div>}
            {message && <div style={{ color: 'var(--green)', textAlign: 'center', marginBottom: '16px', fontSize: '13px' }}>{message}</div>}

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

              <button type="submit" className="btn btn-accent btn-full" style={{ marginTop: '6px' }} disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Code →'}
              </button>
            </form>

            <div className="terms" style={{ marginTop: '20px' }}>
              Remembered your password?{' '}
              <Link to="/auth/login" style={{ color: 'var(--accent)' }}>Sign In</Link>
            </div>
          </>
        ) : (
          <>
            <div className="auth-title">Reset Password</div>
            <div className="auth-sub">Enter the 6-digit code sent to {email}.</div>

            {error && <div style={{ color: 'var(--red)', fontSize: '13px', textAlign: 'center', marginBottom: '16px' }}>{error}</div>}
            {message && <div style={{ color: 'var(--green)', fontSize: '13px', textAlign: 'center', marginBottom: '16px' }}>{message}</div>}

            <form onSubmit={handleReset}>
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

              <div className="input-grp">
                <label className="input-lbl">New Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="input filled"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
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

              <button
                type="submit"
                className="btn btn-accent btn-full"
                style={{ marginTop: '6px' }}
                disabled={loading}
              >
                {loading ? 'Resetting...' : 'Reset Password →'}
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

export default ForgotPassword;
