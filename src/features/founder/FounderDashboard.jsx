import { Link } from 'react-router-dom';
import { useFounderStartup } from '../../hooks/useFounder';
import { useAuthStore } from '../../store/authStore';
import Spinner from '../../components/ui/Spinner';
import { Eye, Bookmark, TrendingUp, Star } from 'lucide-react';

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
          <div className="topbar-title"><span className="dim">Dashboard</span></div>
          <div className="topbar-sub">{startup.name} · {startup.stage} · Last updated today</div>
        </div>
        <div className="topbar-actions">
          <Link to="/founder/onboarding" className="btn btn-accent btn-sm">✎ Update Metrics</Link>
        </div>
      </div>

      <div className="dash-grid">
        <div className="hero-score">
          <div className="score-label">Your InvestScore™</div>
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
            {[
              { name: 'Financial Health', val: 92 },
              { name: 'Team Strength',    val: 88 },
              { name: 'Traction',         val: 81 },
              { name: 'Market Size',      val: 79 },
            ].map(({ name, val }) => (
              <div className="score-bar-row" key={name}>
                <div className="score-bar-head">
                  <span className="score-bar-name">{name}</span>
                  <span className="score-bar-val">{val}</span>
                </div>
                <div className="score-bar-track">
                  <div className="score-bar-fill" style={{ width: `${val}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="stat-row">
        <div className="stat-card">
          <div className="stat-icon"><Eye size={18} /></div>
          <div className="stat-lbl">Profile Views</div>
          <div className="stat-val">2,341</div>
          <div className="stat-trend">↑ 18% this week</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><Bookmark size={18} /></div>
          <div className="stat-lbl">Investor Saves</div>
          <div className="stat-val">{startup.savedBy?.length || 0}</div>
          <div className="stat-trend">Tracking you</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><TrendingUp size={18} /></div>
          <div className="stat-lbl">Score Rank</div>
          <div className="stat-val">#14</div>
          <div className="stat-trend">Top 5% in SaaS</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><Star size={18} /></div>
          <div className="stat-lbl">Investor Interest</div>
          <div className="stat-val">High</div>
          <div className="stat-trend">↑ 3 new this month</div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 'var(--sp-5)' }}>
        <div className="card-h">Improve your score</div>
        {[
          { icon: '📈', title: 'Add complete revenue data', sub: 'Unlock +40 points and reach Tier A+', pts: '+40 pts' },
          { icon: '👥', title: 'Add co-founder details', sub: 'Team completeness boosts credibility', pts: '+15 pts' },
        ].map(({ icon, title, sub, pts }) => (
          <div className="tip-card" key={title}>
            <div className="tip-ic">{icon}</div>
            <div className="tip-info">
              <div className="tip-ttl">{title}</div>
              <div className="tip-sub">{sub}</div>
            </div>
            <div className="tip-pts">{pts}</div>
          </div>
        ))}
      </div>
    </>
  );
};

export default FounderDashboard;
