import { Link } from 'react-router-dom';
import { useSavedStartups } from '../../hooks/useInvestor';
import Spinner from '../../components/ui/Spinner';

const SavedStartups = () => {
  const { data: savedStartups, isLoading } = useSavedStartups();

  if (isLoading) return <Spinner text="Loading saved deals..." />;

  return (
    <>
      <div className="topbar">
        <div>
          <div className="topbar-title">Your shortlist</div>
          <div className="topbar-sub">{savedStartups?.length || 0} startups · updated live</div>
        </div>
      </div>
      
      {(!savedStartups || savedStartups.length === 0) ? (
        <div className="card" style={{textAlign: 'center', padding: '60px 20px'}}>
          <div className="card-h">No startups saved yet</div>
          <p style={{color: 'var(--ink-dim)', marginBottom: '24px'}}>Browse the deal feed and save interesting startups.</p>
          <Link to="/investor/dashboard" className="btn btn-white">Go to Deal Feed</Link>
        </div>
      ) : (
        <div className="saved-table">
          {savedStartups.map(startup => {
            const isHigh = startup.score >= 70;
            return (
              <Link to={`/investor/startup/${startup.id}`} className="saved-row" key={startup.id}>
                <div className={`saved-logo ${!isHigh ? 'b' : ''}`}>{startup.name.charAt(0)}</div>
                <div className="saved-name">{startup.name} <span className="verif-mini">✓</span></div>
                <div className="saved-meta">{startup.industry} · {startup.stage} · RAISING ${(startup.id * 0.5).toFixed(1)}M</div>
                <div className={`saved-score ${!isHigh ? 'b' : ''}`}>{startup.score}</div>
                <div className="saved-action">
                  <button className="btn btn-ghost" onClick={(e) => { e.preventDefault(); }}>✉ Email</button>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </>
  );
};

export default SavedStartups;
