import { Link } from 'react-router-dom';
import { useFounderStartup } from '../../hooks/useFounder';
import { useAuthStore } from '../../store/authStore';
import Spinner from '../../components/ui/Spinner';
import { Eye, Bookmark, TrendingUp, Star } from 'lucide-react';

const formatStage = (stg) => {
  if (!stg) return '';
  if (stg === 'preseed') return 'Pre-Seed';
  if (stg === 'seed') return 'Seed';
  if (stg === 'seriesA') return 'Series A';
  if (stg === 'seriesB') return 'Series B+';
  return stg;
};

const tierLabels = {
  'A': 'Investor Ready',
  'B': 'Promising',
  'C': 'Early',
  'D': 'Needs Work'
};

const FounderDashboard = () => {
  const { data: startupData, isLoading } = useFounderStartup();
  const { user } = useAuthStore();

  if (isLoading) return <Spinner text="Loading your dashboard..." />;

  const founder = startupData?.founder;
  const score = startupData?.score;

  if (!founder || !score) {
    return (
      <>
        <div className="page-head">
          <div>
            <div className="page-head-title">Welcome, {user?.name?.split(' ')[0]}</div>
            <div className="page-head-sub">Let's get you set up.</div>
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

  const scoreTier = score.tier || 'D';
  const tierLabel = tierLabels[scoreTier] || 'Needs Work';

  const breakdownItems = [
    { name: 'Financial Health', val: score.breakdown?.financial || 0 },
    { name: 'Team Strength',    val: score.breakdown?.team || 0 },
    { name: 'Traction',         val: score.breakdown?.traction || 0 },
    { name: 'Market Size',      val: score.breakdown?.market || 0 },
  ];

  return (
    <>
      <div className="page-head">
        <div>
          <div className="page-head-title">Dashboard</div>
          <div className="page-head-sub">{founder.companyName} · {formatStage(founder.stage)} · Last updated today</div>
        </div>
        <div className="page-head-actions">
          <Link to="/founder/onboarding" className="btn btn-accent btn-sm">✎ Update Metrics</Link>
        </div>
      </div>

      <div className="dash-grid">
        <div className="hero-score">
          <div className="score-label">Your InvestScore™</div>
          <div className="score-row">
            <div className="score-big">{score.total}</div>
            <div className="score-max">/ 1000</div>
          </div>
          <div className="score-delta">↑ +23 this week</div>
          <div className="score-tier">
            <span className="tier-badge">{scoreTier}</span>
            Tier {scoreTier} — {tierLabel}
          </div>
        </div>

        <div className="card">
          <div className="card-h">Score Breakdown</div>
          <div className="score-bars">
            {breakdownItems.map(({ name, val }) => (
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
          <div className="stat-val">{founder.profileViews || 0}</div>
          <div className="stat-trend">↑ 18% this week</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><Bookmark size={18} /></div>
          <div className="stat-lbl">Investor Saves</div>
          <div className="stat-val">{founder.savedBy?.length || 0}</div>
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
