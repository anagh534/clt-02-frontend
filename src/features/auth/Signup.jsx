import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const generateId = () => 'u' + Math.random().toString(36).slice(2, 9);

const Signup = () => {
  const [role, setRole] = useState('founder');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
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

  const handleSignup = (e) => {
    e.preventDefault();
    setError('');
    const err = validate();
    if (err) { setError(err); return; }

    setLoading(true);
    // Simulate async signup — create a local user and log in
    setTimeout(() => {
      const newUser = {
        id: generateId(),
        email: email.trim().toLowerCase(),
        role,
        name: name.trim(),
        title: role === 'founder' ? 'Founder' : 'Investor',
        company: '',
        location: '',
        bio: '',
        avatar: null,
        profileSlug: name.trim().toLowerCase().replace(/\s+/g, '-') + '-' + generateId(),
      };
      login(newUser);
      navigate(`/${role}/dashboard`);
    }, 600);
  };

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-logo"><span className="auth-logo-dot"></span>InvestScore</div>
        <div className="auth-title">Create Account</div>
        <div className="auth-sub">Join as a founder or investor.</div>

        {error && (
          <div style={{ color: 'var(--red)', fontSize: '13px', textAlign: 'center', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSignup}>
          <div className="input-grp">
            <label className="input-lbl">I am a…</label>
            <div className="role-pick">
              <div className={`role-pill ${role === 'founder' ? 'selected' : ''}`} onClick={() => setRole('founder')}>
                <div className="role-pill-ic">🚀</div>
                <div className="role-pill-name">Founder</div>
              </div>
              <div className={`role-pill ${role === 'investor' ? 'selected' : ''}`} onClick={() => setRole('investor')}>
                <div className="role-pill-ic">💼</div>
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
            {loading ? 'Creating account…' : 'Create Account →'}
          </button>
        </form>

        <div className="terms">
          Already have an account?{' '}
          <Link to="/auth/login" style={{ color: 'var(--accent)' }}>Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
