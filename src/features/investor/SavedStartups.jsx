import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSavedStartups } from '../../hooks/useInvestor';
import Spinner from '../../components/ui/Spinner';
import OutreachModal from './OutreachModal';

const SavedStartups = () => {
  const { data: savedStartups, isLoading } = useSavedStartups();
  const [outreachStartup, setOutreachStartup] = useState(null);

  if (isLoading) return <Spinner text="Loading saved deals..." />;

  return (
    <>
      {(!savedStartups || savedStartups.length === 0) ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div className="card-h">No startups saved yet</div>
          <p style={{ color: 'var(--ink-dim)', marginBottom: '24px' }}>Browse the deal feed and save interesting startups.</p>
          <Link to="/investor/dashboard" className="btn btn-outline">Go to Deal Feed</Link>
        </div>
      ) : (
        <div className="saved-table">
          {savedStartups.map(startup => {
            const isHigh = startup.score >= 70;
            return (
              <Link to={`/investor/startup/${startup.id}`} className="saved-row" key={startup.id}>
                <div className={`saved-logo${!isHigh ? ' b' : ''}`}>{startup.name.charAt(0)}</div>
                <div className="saved-info">
                  <div className="saved-name">
                    {startup.name}
                    <span className="verif-mini">✓</span>
                  </div>
                  <div className="saved-meta">{startup.industry} · {startup.stage}</div>
                </div>
                <div className={`saved-score${!isHigh ? ' b' : ''}`}>{startup.score}</div>
                <div className="saved-action">
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      setOutreachStartup(startup);
                    }}
                  >
                    ✉ Email
                  </button>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {outreachStartup && (
        <OutreachModal
          startup={outreachStartup}
          onClose={() => setOutreachStartup(null)}
        />
      )}
    </>
  );
};

export default SavedStartups;
