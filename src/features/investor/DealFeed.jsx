import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAllStartups, useToggleSaveStartup } from '../../hooks/useInvestor';
import { useAuthStore } from '../../store/authStore';
import Spinner from '../../components/ui/Spinner';

const DealFeed = () => {
  const { data: startups, isLoading } = useAllStartups();
  const toggleSave = useToggleSaveStartup();
  const user = useAuthStore(state => state.user);
  
  if (isLoading) return <Spinner text="Loading deal feed..." />;

  const filteredStartups = startups?.filter(s => s.score).sort((a, b) => b.score - a.score);

  return (
    <>
      <div className="feed-toolbar">
        <div className="feed-toolbar-l">Showing <b>{filteredStartups?.length} startups</b> · sorted by score</div>
        <div className="feed-toolbar-r">FINTECH · CLIMATE · HEALTH</div>
      </div>
      
      <div className="feed-grid">
        {filteredStartups?.map((startup, idx) => {
          const isSaved = startup.savedBy?.includes(user?.id);
          const isNew = idx < 2; // Mocking new tag
          const scoreTier = startup.score >= 90 ? 'Tier A+' : startup.score >= 80 ? 'Tier A' : startup.score >= 70 ? 'Tier B' : 'Tier C';
          const isHigh = startup.score >= 70;
          
          return (
            <Link to={`/investor/startup/${startup.id}`} className="startup-card" key={startup.id}>
              <div className="startup-head">
                <div className={`startup-logo${!isHigh ? ' b' : ''}`}>{startup.name.charAt(0)}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="startup-name">{startup.name} <span className="verif-mini">✓</span></div>
                  <div className="startup-sector">{startup.industry} · {startup.location}</div>
                </div>
                <div className="startup-score-wrap">
                  {isNew && <span className="new-badge">NEW</span>}
                  <div className={`startup-score-num${!isHigh ? ' b' : ''}`}>{startup.score}</div>
                  <div className="startup-score-lbl">{scoreTier}</div>
                </div>
              </div>
              <div className="startup-meta">
                <div>Raising <b>${startup.metrics?.raising || `${((idx + 1) * 0.5).toFixed(1)}M`}</b></div>
                <div>MRR <b>{startup.metrics?.arr || 'N/A'}</b></div>
                <div>Growth <b>{startup.metrics?.growth || 'N/A'}</b></div>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
};

export default DealFeed;
