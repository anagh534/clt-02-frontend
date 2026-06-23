import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useFounderStartup } from '../../hooks/useFounder';
import { mockUsers } from '../../api/mockData';
import { Copy, Check, Share2, ExternalLink, MapPin, Globe, Link2, AtSign, TrendingUp } from 'lucide-react';
import Spinner from '../../components/ui/Spinner';

const FounderProfile = () => {
  const { user } = useAuthStore();
  const { data: startup, isLoading } = useFounderStartup();
  const [copied, setCopied] = useState(false);

  const fullUser = mockUsers.find(u => u.id === user?.id) || user;
  const profileUrl = `${window.location.origin}/profile/founder/${fullUser?.profileSlug || user?.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(profileUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${user?.name} — Founder Profile`,
          text: `Check out ${user?.name}'s founder profile on InvestScore`,
          url: profileUrl,
        });
      } catch (_) {}
    } else {
      handleCopy();
    }
  };

  if (isLoading) return <Spinner text="Loading profile..." />;

  const scoreTier = startup?.score >= 90 ? 'A+' : startup?.score >= 80 ? 'A' : startup?.score >= 70 ? 'B' : 'C';

  return (
    <>
      <div className="page-head">
        <div>
          <div className="page-head-title">My Profile</div>
          <div className="page-head-sub">Your public founder page</div>
        </div>
        <div className="page-head-actions">
          <button className="prof-share-btn" onClick={handleShare}>
            <Share2 size={16} />
            Share Profile
          </button>
          <button className="prof-copy-btn" onClick={handleCopy}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>
      </div>

      {/* Profile URL bar */}
      <div className="prof-url-bar">
        <span className="prof-url-label">Your profile link</span>
        <div className="prof-url-row">
          <span className="prof-url-text">{profileUrl}</span>
          <button className="prof-url-copy" onClick={handleCopy}>
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <a className="prof-url-open" href={profileUrl} target="_blank" rel="noreferrer">
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      <div className="prof-layout">
        {/* Left column */}
        <div className="prof-left">
          {/* Identity card */}
          <div className="prof-card">
            <div className="prof-avatar-wrap">
              <div className="prof-avatar">{user?.name?.charAt(0)}</div>
              <div className="prof-verified">✓</div>
            </div>
            <div className="prof-name">{user?.name}</div>
            <div className="prof-title">{fullUser?.title || 'Founder'}</div>
            {fullUser?.company && (
              <div className="prof-company">{fullUser.company}</div>
            )}
            {fullUser?.location && (
              <div className="prof-meta-row">
                <MapPin size={14} />
                {fullUser.location}
              </div>
            )}

            {fullUser?.bio && (
              <p className="prof-bio">{fullUser.bio}</p>
            )}

            <div className="prof-links">
              {fullUser?.website && (
                <a href={fullUser.website} target="_blank" rel="noreferrer" className="prof-link">
                  <Globe size={15} /> Website
                </a>
              )}
              {fullUser?.linkedin && (
                <a href={fullUser.linkedin} target="_blank" rel="noreferrer" className="prof-link">
                  <Link2 size={15} /> LinkedIn
                </a>
              )}
              {fullUser?.twitter && (
                <a href={fullUser.twitter} target="_blank" rel="noreferrer" className="prof-link">
                  <AtSign size={15} /> Twitter
                </a>
              )}
            </div>
          </div>

          {/* InvestScore card */}
          {startup?.score && (
            <div className="prof-card prof-score-card">
              <div className="prof-score-label">InvestScore</div>
              <div className="prof-score-num">{startup.score}</div>
              <div className="prof-score-tier">
                <span className="tier-badge">{scoreTier}</span>
                Tier {scoreTier}
              </div>
              <div className="prof-score-delta">
                <TrendingUp size={13} /> +23 this week
              </div>
              <Link to="/founder/onboarding" className="btn btn-accent btn-full" style={{ marginTop: '20px', fontSize: '14px', padding: '14px' }}>
                Update Metrics
              </Link>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="prof-right">
          {/* Startup card */}
          {startup ? (
            <div className="prof-card">
              <div className="prof-section-h">Startup</div>
              <div className="prof-startup-head">
                <div className="startup-logo">{startup.name?.charAt(0)}</div>
                <div>
                  <div className="prof-startup-name">{startup.name}</div>
                  <div className="prof-startup-tagline">{startup.tagline}</div>
                </div>
              </div>
              <div className="prof-tags">
                <span className="prof-tag">{startup.industry}</span>
                <span className="prof-tag">{startup.stage}</span>
                <span className="prof-tag">{startup.location}</span>
              </div>
              {startup.description && (
                <p className="prof-desc">{startup.description}</p>
              )}
              <div className="prof-metrics-grid">
                <div className="prof-metric">
                  <div className="prof-metric-lbl">ARR</div>
                  <div className="prof-metric-val">{startup.metrics?.arr || '—'}</div>
                </div>
                <div className="prof-metric">
                  <div className="prof-metric-lbl">Growth</div>
                  <div className="prof-metric-val text-green">{startup.metrics?.growth || '—'}</div>
                </div>
                <div className="prof-metric">
                  <div className="prof-metric-lbl">Runway</div>
                  <div className="prof-metric-val">{startup.metrics?.runway || '—'}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="prof-card" style={{ textAlign: 'center', padding: '48px 32px' }}>
              <div className="prof-section-h" style={{ marginBottom: '12px' }}>No startup yet</div>
              <p style={{ color: 'var(--ink-dim)', marginBottom: '24px', fontSize: '14px' }}>
                Complete your startup profile to appear in the deal feed.
              </p>
              <Link to="/founder/onboarding" className="btn btn-accent">Calculate InvestScore →</Link>
            </div>
          )}

          {/* Score breakdown */}
          {startup?.score && (
            <div className="prof-card">
              <div className="prof-section-h">Score Breakdown</div>
              <div className="score-bars">
                {[
                  { name: 'Financial Health', val: 92 },
                  { name: 'Team', val: 88 },
                  { name: 'Traction', val: 81 },
                  { name: 'Market Size', val: 79 },
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
          )}
        </div>
      </div>
    </>
  );
};

export default FounderProfile;
