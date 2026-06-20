import { useParams, useNavigate } from 'react-router-dom';
import { useStartupDetails, useToggleSaveStartup } from '../../hooks/useInvestor';
import { useAuthStore } from '../../store/authStore';
import Spinner from '../../components/ui/Spinner';

const StartupDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: startup, isLoading } = useStartupDetails(id);
  const toggleSave = useToggleSaveStartup();
  const user = useAuthStore(state => state.user);

  if (isLoading) return <Spinner text="Loading startup details..." />;
  if (!startup) return <div className="main">Startup not found</div>;

  const isSaved = startup.savedBy?.includes(user?.id);

  return (
    <>
      <div className="topbar">
        <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
          <div className="icon-btn" onClick={() => navigate(-1)}>←</div>
          <div>
            <div className="topbar-title">{startup.name}</div>
            <div className="topbar-sub">Back to feed</div>
          </div>
        </div>
        <div className="topbar-actions">
          <div className="icon-btn">⤴</div>
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
                <div className="dstat-lbl">Raising</div>
                <div className="dstat-val">$2.5M</div>
              </div>
            </div>
          </div>
          
          <div className="detail-section">
            <div className="detail-h">About</div>
            <div className="detail-p">{startup.description || 'No description provided yet.'} We are operating in {startup.location} addressing the {startup.industry} market.</div>
          </div>
          
          <div className="detail-section">
            <div className="detail-h">Score Breakdown</div>
            <div className="card">
              <div className="score-bars">
                <div className="score-bar-row"><div className="score-bar-head"><span className="score-bar-name">Financial Health</span><span className="score-bar-val">92</span></div><div className="score-bar-track"><div className="score-bar-fill" style={{width:'92%'}}></div></div></div>
                <div className="score-bar-row"><div className="score-bar-head"><span className="score-bar-name">Team</span><span className="score-bar-val">88</span></div><div className="score-bar-track"><div className="score-bar-fill" style={{width:'88%'}}></div></div></div>
                <div className="score-bar-row"><div className="score-bar-head"><span className="score-bar-name">Traction</span><span className="score-bar-val">81</span></div><div className="score-bar-track"><div className="score-bar-fill" style={{width:'81%'}}></div></div></div>
                <div className="score-bar-row"><div className="score-bar-head"><span className="score-bar-name">Market</span><span className="score-bar-val">79</span></div><div className="score-bar-track"><div className="score-bar-fill" style={{width:'79%'}}></div></div></div>
              </div>
            </div>
          </div>
          
          <div className="detail-section">
            <div className="detail-h">Founders</div>
            <div className="detail-p">Verified Founder Profile</div>
          </div>
        </div>
        
        <div className="detail-side">
          <div className="detail-cta-card">
            <div className="detail-cta-h">Reach out to {startup.name}</div>
            <div className="detail-cta-sub">Send a verified intro. Founders see your fund and respond faster.</div>
            <button className="btn btn-white btn-full" style={{marginBottom: '8px'}}>✉ Email Founder</button>
            <button 
              className={`btn btn-full ${isSaved ? 'btn-ghost' : 'btn-saved'}`}
              onClick={() => toggleSave.mutate(startup.id)}
            >
              ★ {isSaved ? 'Remove from Shortlist' : 'Save to Shortlist'}
            </button>
            <div style={{marginTop: '18px', paddingTop: '18px', borderTop: '1px solid var(--line)'}}>
              <div className="eyebrow" style={{marginBottom: '10px'}}>Key Metrics</div>
              <div style={{fontSize: '12px', color: 'var(--ink-dim)', lineHeight: 2}}>
                ARR: {startup.metrics?.arr || 'N/A'}<br/>
                Growth: {startup.metrics?.growth || 'N/A'}<br/>
                Runway: {startup.metrics?.runway || 'N/A'}<br/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StartupDetails;
