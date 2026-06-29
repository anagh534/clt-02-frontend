import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStartupDetails, useToggleSaveStartup, useAddInvestorScore } from '../../hooks/useInvestor';
import { useAuthStore } from '../../store/authStore';
import Spinner from '../../components/ui/Spinner';
import { ArrowLeft, Star, X, Check } from 'lucide-react';
import OutreachModal from './OutreachModal';

const CONVICTION_LEVELS = [
  { value: 'pass',   label: 'Pass',      color: '#fc1a1a' },
  { value: 'watch',  label: 'Watching',  color: '#ffb547' },
  { value: 'strong', label: 'Strong',    color: '#11ec79' },
];

const SECTORS = ['Fintech','Climate','AI','HealthTech','SaaS','Commerce','Agri','Other'];

const CUSTOMER_RANGES = [
  '0 (pre-launch)', '1 – 10', '11 – 100', '101 – 1,000', '1,001 – 10,000', '10,000+',
];

const InvestorScorePanel = ({ startup, onClose }) => {
  const addScore = useAddInvestorScore();
  const user = useAuthStore(state => state.user);

  const existing = startup.investorScores?.find(e => e.investorId === user?.id);

  const [score, setScore]         = useState(existing?.score ?? 75);
  const [note, setNote]           = useState(existing?.note ?? '');
  const [conviction, setConviction] = useState(existing?.conviction ?? 'watch');
  const [customers, setCustomers] = useState(existing?.customers ?? '');
  const [sector, setSector]       = useState(existing?.sector ?? '');
  const [priorExit, setPriorExit] = useState(existing?.priorExit ?? false);
  const [techCofounder, setTechCofounder] = useState(existing?.techCofounder ?? false);
  const [saved, setSaved]         = useState(false);

  const handleSave = () => {
    addScore.mutate(
      { startupId: startup.id, score, note, conviction, customers, sector, priorExit, techCofounder },
      {
        onSuccess: () => {
          setSaved(true);
          setTimeout(() => { setSaved(false); onClose(); }, 1200);
        }
      }
    );
  };

  return (
    <div className="iscore-overlay" onClick={onClose}>
      <div className="iscore-panel" onClick={e => e.stopPropagation()}>
        <div className="iscore-header">
          <div className="iscore-title">My Score — {startup.name}</div>
          <button className="iscore-close" onClick={onClose}><X size={18} /></button>
        </div>

        {/* Conviction */}
        <div className="iscore-section">
          <div className="iscore-lbl">Conviction</div>
          <div className="iscore-conviction-row">
            {CONVICTION_LEVELS.map(c => (
              <button
                key={c.value}
                className={`iscore-conv-btn${conviction === c.value ? ' active' : ''}`}
                style={conviction === c.value ? { borderColor: c.color, color: c.color, background: `${c.color}18` } : {}}
                onClick={() => setConviction(c.value)}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Score slider */}
        <div className="iscore-section">
          <div className="iscore-lbl" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>My Score</span>
            <span className="iscore-score-display">{score}</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={score}
            onChange={e => setScore(Number(e.target.value))}
            className="iscore-slider"
          />
          <div className="iscore-slider-labels">
            <span>0</span><span>50</span><span>100</span>
          </div>
        </div>

        {/* Customers */}
        <div className="iscore-section">
          <div className="iscore-lbl">Customers — How many users do they have?</div>
          <div className="iscore-cust-grid">
            {CUSTOMER_RANGES.map(r => (
              <button
                key={r}
                className={`iscore-cust-btn${customers === r ? ' active' : ''}`}
                onClick={() => setCustomers(customers === r ? '' : r)}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Sector */}
        <div className="iscore-section">
          <div className="iscore-lbl">Sector</div>
          <div className="iscore-sector-grid">
            {SECTORS.map(s => (
              <button
                key={s}
                className={`iscore-sector-btn${sector === s ? ' active' : ''}`}
                onClick={() => setSector(sector === s ? '' : s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Checkboxes */}
        <div className="iscore-section">
          <div className="iscore-lbl">Founder signals</div>
          <div className="iscore-checks">
            <label className={`iscore-check-opt${priorExit ? ' checked' : ''}`}>
              <span className="iscore-check-box">{priorExit && <span className="iscore-check-tick">✓</span>}</span>
              <input type="checkbox" checked={priorExit} onChange={e => setPriorExit(e.target.checked)} style={{ display: 'none' }} />
              <span className="iscore-check-text">Prior startup exit</span>
              <span className="iscore-check-pts">+15 pts</span>
            </label>
            <label className={`iscore-check-opt${techCofounder ? ' checked' : ''}`}>
              <span className="iscore-check-box">{techCofounder && <span className="iscore-check-tick">✓</span>}</span>
              <input type="checkbox" checked={techCofounder} onChange={e => setTechCofounder(e.target.checked)} style={{ display: 'none' }} />
              <span className="iscore-check-text">Technical co-founder</span>
              <span className="iscore-check-pts">+10 pts</span>
            </label>
          </div>
        </div>

        {/* Note */}
        <div className="iscore-section">
          <div className="iscore-lbl">Private note</div>
          <textarea
            className="input filled"
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Why are you interested? What concerns you?"
            rows={4}
            style={{ resize: 'vertical', lineHeight: '1.6', fontSize: '14px' }}
          />
        </div>

        <button
          className="btn btn-accent btn-full"
          onClick={handleSave}
          disabled={addScore.isPending || saved}
          style={{ marginTop: '8px' }}
        >
          {saved ? <><Check size={16} /> Saved!</> : addScore.isPending ? 'Saving...' : 'Save My Score'}
        </button>

        {existing && (
          <div className="iscore-existing-note">
            Last updated {new Date(existing.createdAt).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
};

const StartupDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: startup, isLoading } = useStartupDetails(id);
  const toggleSave = useToggleSaveStartup();
  const user = useAuthStore(state => state.user);
  const [showScorePanel, setShowScorePanel] = useState(false);
  const [showOutreach, setShowOutreach] = useState(false);

  if (isLoading) return <Spinner text="Loading startup details..." />;
  if (!startup) return <div className="main">Startup not found</div>;

  const isSaved = startup.savedBy?.includes(user?.id);
  const myScore = startup.investorScores?.find(e => e.investorId === user?.id);

  return (
    <>
      <div className="page-head">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button className="icon-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="page-head-title">{startup.name}</div>
            <div className="page-head-sub">Back to feed</div>
          </div>
        </div>
        <div className="page-head-actions">
          <button
            className={`iscore-trigger-btn${myScore ? ' has-score' : ''}`}
            onClick={() => setShowScorePanel(true)}
          >
            <Star size={15} fill={myScore ? 'currentColor' : 'none'} />
            {myScore ? `My Score: ${myScore.score}` : 'Add My Score'}
          </button>
        </div>
      </div>

      <div className="detail-layout">
        <div className="detail-main">
          <div className="detail-hero">
            <div className="detail-head">
              <div className="detail-logo">{startup.name.charAt(0)}</div>
              <div>
                <div className="detail-name">{startup.name} <span className="verif-mini">✓</span></div>
                <div className="detail-tagline">{startup.tagline}</div>
              </div>
            </div>
            <div className="detail-stats">
              <div className="dstat">
                <div className="dstat-lbl">Score</div>
                <div className="dstat-val gold">{startup.score}</div>
              </div>
              <div className="dstat">
                <div className="dstat-lbl">Stage</div>
                <div className="dstat-val">{startup.stage}</div>
              </div>
              <div className="dstat">
                <div className="dstat-lbl">Sector</div>
                <div className="dstat-val">{startup.sector || startup.industry}</div>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <div className="detail-h">About</div>
            <div className="detail-p">
              {startup.description || 'No description provided yet.'}{' '}
              We are operating in {startup.location} addressing the {startup.industry} market.
            </div>
          </div>

          <div className="detail-section">
            <div className="detail-h">Score Breakdown</div>
            <div className="card">
              <div className="score-bars">
                {[
                  { name: 'Financial Health', val: 92 },
                  { name: 'Team', val: 88 },
                  { name: 'Traction', val: 81 },
                  { name: 'Market', val: 79 },
                ].map(item => (
                  <div className="score-bar-row" key={item.name}>
                    <div className="score-bar-head">
                      <span className="score-bar-name">{item.name}</span>
                      <span className="score-bar-val">{item.val}</span>
                    </div>
                    <div className="score-bar-track">
                      <div className="score-bar-fill" style={{ width: `${item.val}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* My investor score summary */}
          {myScore && (
            <div className="detail-section">
              <div className="detail-h">My Assessment</div>
              <div className="iscore-summary-card">
                <div className="iscore-summary-row">
                  <div className="iscore-summary-item">
                    <div className="iscore-summary-lbl">My Score</div>
                    <div className="iscore-summary-val accent">{myScore.score}</div>
                  </div>
                  <div className="iscore-summary-item">
                    <div className="iscore-summary-lbl">Conviction</div>
                    <div className={`iscore-conv-badge iscore-conv-${myScore.conviction}`}>
                      {CONVICTION_LEVELS.find(c => c.value === myScore.conviction)?.label}
                    </div>
                  </div>
                </div>
                {myScore.note && (
                  <div className="iscore-summary-note">"{myScore.note}"</div>
                )}
                <button className="iscore-edit-link" onClick={() => setShowScorePanel(true)}>
                  Edit assessment →
                </button>
              </div>
            </div>
          )}

          <div className="detail-section">
            <div className="detail-h">Founders</div>
            <div className="detail-p">Verified Founder Profile</div>
          </div>
        </div>

        <div className="detail-side">
          <div className="detail-cta-card">
            <div className="detail-cta-h">Reach out to {startup.name}</div>
            <div className="detail-cta-sub">Send a verified intro. Founders see your fund and respond faster.</div>
            <button className="btn btn-outline btn-full" style={{ marginBottom: '8px' }} onClick={() => setShowOutreach(true)}>✉ Email Founder</button>
            <button
              className={`btn btn-full ${isSaved ? 'btn-ghost' : 'btn-accent'}`}
              onClick={() => toggleSave.mutate(startup.id)}
            >
              ★ {isSaved ? 'Remove from Shortlist' : 'Save to Shortlist'}
            </button>
            <div style={{ marginTop: '18px', paddingTop: '18px', borderTop: '1px solid var(--line)' }}>
              <div className="eyebrow" style={{ marginBottom: '10px' }}>Key Metrics</div>
              <div style={{ fontSize: '13px', color: 'var(--ink-dim)', lineHeight: 2 }}>
                ARR: {startup.metrics?.arr || 'N/A'}<br />
                Growth: {startup.metrics?.growth || 'N/A'}<br />
                Runway: {startup.metrics?.runway || 'N/A'}<br />
                {startup.customers && <>Customers: {startup.customers}<br /></>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showScorePanel && (
        <InvestorScorePanel startup={startup} onClose={() => setShowScorePanel(false)} />
      )}
      {showOutreach && (
        <OutreachModal startup={startup} onClose={() => setShowOutreach(false)} />
      )}
    </>
  );
};

export default StartupDetails;
