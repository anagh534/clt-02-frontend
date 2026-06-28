import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useFounderStartup } from '../../hooks/useFounder';
import { mockUsers } from '../../api/mockData';
import { Copy, Check, Share2, ExternalLink, MapPin, Globe, Link2, AtSign, TrendingUp } from 'lucide-react';
import Spinner from '../../components/ui/Spinner';

const formatStage = (stg) => {
  if (!stg) return '';
  if (stg === 'preseed') return 'Pre-Seed';
  if (stg === 'seed') return 'Seed';
  if (stg === 'seriesA') return 'Series A';
  if (stg === 'seriesB') return 'Series B+';
  return stg;
};

const formatSector = (sec) => {
  if (!sec) return '';
  if (sec === 'ai') return 'AI';
  return sec.charAt(0).toUpperCase() + sec.slice(1);
};

const formatARR = (mrr) => {
  if (mrr === undefined || mrr === null || mrr === '' || isNaN(mrr)) return '—';
  const arr = Number(mrr) * 12;
  if (arr >= 1000000) return `$${(arr / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
  if (arr >= 1000) return `$${(arr / 1000).toFixed(0)}k`;
  return `$${arr}`;
};

const formatGrowth = (growth) => {
  if (growth === undefined || growth === null || growth === '' || isNaN(growth)) return '—';
  return `${growth}% MoM`;
};

const FounderProfile = () => {
  const { user } = useAuthStore();
  const { data: startupData, isLoading } = useFounderStartup();
  const [copied, setCopied] = useState(false);

  const founder = startupData?.founder;
  const score = startupData?.score;

  const fullUser = mockUsers.find(u => u.id === user?.id) || user;
  const profileUrl = `${window.location.origin}/profile/founder/${founder?.slug || user?.id}`;

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

  const scoreTier = score?.tier || 'D';

  const breakdownItems = score ? [
    { name: 'Financial Health', val: score.breakdown?.financial || 0 },
    { name: 'Team Strength',    val: score.breakdown?.team || 0 },
    { name: 'Traction',         val: score.breakdown?.traction || 0 },
    { name: 'Market Size',      val: score.breakdown?.market || 0 },
  ] : [];

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
              <div className="prof-avatar" style={{ backgroundColor: founder?.logoColor || '#D4AF37' }}>
                {user?.name?.charAt(0)}
              </div>
              <div className="prof-verified">✓</div>
            </div>
            <div className="prof-name">{user?.name}</div>
            <div className="prof-title">{fullUser?.title || 'Founder'}</div>
            {founder?.companyName && (
              <div className="prof-company">{founder.companyName}</div>
            )}
            {(founder?.city || founder?.country) && (
              <div className="prof-meta-row">
                <MapPin size={14} />
                {founder.city || ''}{founder.city && founder.country ? ', ' : ''}{founder.country || ''}
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
          {score && (
            <div className="prof-card prof-score-card">
              <div className="prof-score-label">InvestScore</div>
              <div className="prof-score-num">{score.total}</div>
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
          {founder ? (
            <div className="prof-card">
              <div className="prof-section-h">Startup</div>
              <div className="prof-startup-head">
                <div className="startup-logo" style={{ backgroundColor: founder.logoColor || '#D4AF37' }}>
                  {founder.companyName?.charAt(0)}
                </div>
                <div>
                  <div className="prof-startup-name">{founder.companyName}</div>
                  <div className="prof-startup-tagline">{founder.tagline}</div>
                </div>
              </div>
              <div className="prof-tags">
                <span className="prof-tag">{formatSector(founder.sector)}</span>
                <span className="prof-tag">{formatStage(founder.stage)}</span>
                <span className="prof-tag">{founder.city || ''}{founder.city && founder.country ? ', ' : ''}{founder.country || ''}</span>
              </div>
              {founder.description && (
                <p className="prof-desc">{founder.description}</p>
              )}
              <div className="prof-metrics-grid">
                <div className="prof-metric">
                  <div className="prof-metric-lbl">ARR</div>
                  <div className="prof-metric-val">{formatARR(score?.inputs?.mrr)}</div>
                </div>
                <div className="prof-metric">
                  <div className="prof-metric-lbl">Growth</div>
                  <div className="prof-metric-val text-green">{formatGrowth(score?.inputs?.growth)}</div>
                </div>
                <div className="prof-metric">
                  <div className="prof-metric-lbl">Runway</div>
                  <div className="prof-metric-val">{score?.inputs?.runway || '—'}</div>
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
          {score && (
            <div className="prof-card">
              <div className="prof-section-h">Score Breakdown</div>
              <div className="score-bars">
                {breakdownItems.map(item => (
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
