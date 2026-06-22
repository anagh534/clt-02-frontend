import { Link } from 'react-router-dom';
import { useFounderStartup } from '../../hooks/useFounder';
import { useAuthStore } from '../../store/authStore';
import Spinner from '../../components/ui/Spinner';

const FounderDashboard = () => {
  const { data: startup, isLoading } = useFounderStartup();
  const { user } = useAuthStore();

  if (isLoading) return <Spinner text="Loading your dashboard..." />;

  if (!startup || !startup.score) {
    return (
      <>
        <div className="topbar">
          <div>
            <div className="topbar-title"><span className="dim">Welcome,</span> <strong>{user?.name?.split(' ')[0]}</strong></div>
            <div className="topbar-sub">Let's get you set up.</div>
          </div>
        </div>
        <div className="card" style={{textAlign: 'center', padding: '60px 20px'}}>
          <div className="card-h">Calculate your InvestScore</div>
          <p style={{color: 'var(--ink-dim)', marginBottom: '24px'}}>You haven't set up your startup profile yet.</p>
          <Link to="/founder/onboarding" className="btn btn-accent">Start Scoring →</Link>
        </div>
      </>
    );
  }

  const scoreTier = startup.score >= 90 ? 'A+' : startup.score >= 80 ? 'A' : startup.score >= 70 ? 'B' : 'C';

  return (
    <>
      <div className="topbar">
        <div>
          <div className="topbar-title"><span className="dim">Welcome,</span> <strong>{user?.name?.split(' ')[0]}</strong></div>
          <div className="topbar-sub">{startup.name} · {startup.stage}</div>
        </div>
        <div className="topbar-actions">
          <div className="icon-btn">🔔</div>
          <Link to="/founder/onboarding" className="btn btn-accent btn-pill-sm">✎ Update Metrics</Link>
        </div>
      </div>

      <div className="dash-grid">
        <div className="hero-score">
          <div className="score-label">Your InvestScore</div>
          <div className="score-row">
            <div className="score-big">{startup.score}</div>
            <div className="score-max">/ 100</div>
          </div>
          <div className="score-delta">↑ +23 this week</div>
          <div className="score-tier">
            <span className="tier-badge">{scoreTier}</span>
            Tier {scoreTier} — Investor Ready
          </div>
        </div>
        
        <div className="card">
          <div className="card-h">Score Breakdown</div>
          <div className="score-bars">
            <div className="score-bar-row">
              <div className="score-bar-head"><span className="score-bar-name">Financial Health</span><span className="score-bar-val">92</span></div>
              <div className="score-bar-track"><div className="score-bar-fill" style={{width:'92%'}}></div></div>
            </div>
            <div className="score-bar-row">
              <div className="score-bar-head"><span className="score-bar-name">Team</span><span className="score-bar-val">88</span></div>
              <div className="score-bar-track"><div className="score-bar-fill" style={{width:'88%'}}></div></div>
            </div>
            <div className="score-bar-row">
              <div className="score-bar-head"><span className="score-bar-name">Traction</span><span className="score-bar-val">81</span></div>
              <div className="score-bar-track"><div className="score-bar-fill" style={{width:'81%'}}></div></div>
            </div>
            <div className="score-bar-row">
              <div className="score-bar-head"><span className="score-bar-name">Market</span><span className="score-bar-val">79</span></div>
              <div className="score-bar-track"><div className="score-bar-fill" style={{width:'79%'}}></div></div>
            </div>
          </div>
        </div>
      </div>

      <div className="stat-row">
        <div className="stat-card">
          <div className="stat-lbl">Profile Views</div>
          <div className="stat-val">2,341</div>
          <div className="stat-trend">↑ 18% this week</div>
        </div>
        <div className="stat-card">
          <div className="stat-lbl">Investor Saves</div>
          <div className="stat-val">{startup.savedBy?.length || 0}</div>
          <div className="stat-trend">Tracking you</div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 'var(--sp-6)' }}>
        <div className="card-h">Improve your score</div>
        <div className="tip-card">
          <div className="tip-ic">📈</div>
          <div className="tip-info">
            <div className="tip-ttl">Add complete revenue data</div>
            <div className="tip-sub">Unlock +40 points and reach Tier A+</div>
          </div>
          <div className="tip-pts">+40 pts</div>
        </div>
      </div>
    </>
  );
};

export default FounderDashboard;
