import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useFounderStartup } from '../../hooks/useFounder';
import axiosInstance from '../../api/axiosInstance';
import { Copy, Check, Share2, ExternalLink, MapPin, Globe, Link2, AtSign, TrendingUp, Lock, AlertCircle } from 'lucide-react';
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
  if (arr >= 1000000) return `£${(arr / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
  if (arr >= 1000) return `£${(arr / 1000).toFixed(0)}k`;
  return `£${arr}`;
};

const formatGrowth = (growth) => {
  if (growth === undefined || growth === null || growth === '' || isNaN(growth)) return '—';
  return `${growth}% MoM`;
};

const FounderProfile = () => {
  const { user } = useAuthStore();
  const { data: startupData, isLoading } = useFounderStartup();
  const queryClient = useQueryClient();
  const [copied, setCopied] = useState(false);

  const founder = startupData?.founder;
  const score = startupData?.score;
  const profileUrl = founder?.slug ? `${window.location.origin}/profile/founder/${founder.slug}` : '';

  const [visibilityError, setVisibilityError] = useState(null);

  const toggleVisibility = useMutation({
    mutationFn: async (isPublic) => {
      setVisibilityError(null);
      const { data } = await axiosInstance.patch('/founders/me/visibility', { isPublic });
      return data.data?.founder;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['founderStartup', user?.id] });
    },
    onError: (err) => {
      const msg = err?.response?.data?.message || err?.message || 'Failed to update visibility. Please try again.';
      setVisibilityError(msg);
      console.error('Visibility update error:', err);
    }
  });

  const handleCopy = () => {
    if (!profileUrl) return;
    navigator.clipboard.writeText(profileUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleShare = async () => {
    if (!profileUrl) return;
    const shareTitle = `${user?.name} — Founder Profile`;
    const shareText = score
      ? `Check out ${user?.name}'s founder profile on InvestScore. Score: ${score.total} (${score.tier}).`
      : `Check out ${user?.name}'s founder profile on InvestScore.`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: profileUrl,
        });
      } catch { /* User cancelled share dialog */ }
    } else {
      handleCopy();
    }
  };

  const openShare = (url) => {
    if (!profileUrl) return;
    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=700');
  };

  const shareText = score
    ? `Check out ${user?.name}'s founder profile on InvestScore. Score: ${score.total} (${score.tier}).`
    : `Check out ${user?.name}'s founder profile on InvestScore.`;

  const shareLinks = profileUrl ? {
    x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(profileUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${profileUrl}`)}`,
  } : null;

  if (isLoading) return <Spinner text="Loading profile..." />;

  const scoreTier = score?.tier || 'D';

  const breakdownItems = score ? [
    { name: 'Financial Health', val: score.breakdown?.financial || 0 },
    { name: 'Team Strength', val: score.breakdown?.team || 0 },
    { name: 'Traction', val: score.breakdown?.traction || 0 },
    { name: 'Market Size', val: score.breakdown?.market || 0 },
  ] : [];

  return (
    <>
      <div className="page-head">
        <div>
          <div className="page-head-title">My Profile</div>
          <div className="page-head-sub">Manage your founder profile visibility and share link</div>
        </div>
        <div className="page-head-actions">
          {!founder ? (
            <span style={{ fontSize: '13px', color: 'var(--ink-dim)', padding: '8px 0' }}>
              Create your startup profile first to manage visibility
            </span>
          ) : (
            <>
              <button
                className="prof-share-btn"
                onClick={() => toggleVisibility.mutate(!founder.isPublic)}
                disabled={toggleVisibility.isPending}
              >
                <Lock size={16} />
                {toggleVisibility.isPending ? 'Updating...' : (founder?.isPublic ? 'Make Private' : 'Make Public')}
              </button>
              {founder?.isPublic && profileUrl && (
                <>
                  <button className="prof-share-btn" onClick={handleShare}>
                    <Share2 size={16} />
                    Share Profile
                  </button>
                  <button className="prof-copy-btn" onClick={handleCopy}>
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? 'Copied!' : 'Copy Link'}
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Profile URL bar */}
      {founder?.isPublic && profileUrl ? (
        <div className="prof-url-bar">
          <span className="prof-url-label">Your public profile link</span>
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
      ) : (
        <div className="prof-url-bar">
          <span className="prof-url-label">Your profile is private</span>
          <div className="prof-url-row">
            <span className="prof-url-text">
              {founder
                ? 'Make it public to generate a shareable link and social share options.'
                : 'Create your startup profile first to publish a public link.'
              }
            </span>
            {founder && (
              <button className="prof-url-copy" onClick={() => toggleVisibility.mutate(true)} disabled={toggleVisibility.isPending}>
                {toggleVisibility.isPending ? 'Publishing...' : 'Publish'}
              </button>
            )}
          </div>
        </div>
      )}

      <div className="prof-card" style={{ marginBottom: '20px' }}>
        <div className="prof-section-h">Visibility</div>
        <div className="prof-stat-list">
          <div className="prof-stat-item">
            <Globe size={16} className="prof-stat-ic" />
            <div>
              <div className="prof-stat-lbl">Profile status</div>
              <div className="prof-stat-val">{founder?.isPublic ? 'Public' : 'Private'}</div>
            </div>
          </div>
        </div>
        {visibilityError && (
          <div className="prof-error-banner">
            <AlertCircle size={16} />
            {visibilityError}
          </div>
        )}
        <p className="prof-desc" style={{ marginTop: '16px' }}>
          {founder?.isPublic
            ? 'Your profile and score can be viewed and shared publicly.'
            : 'Keep your profile private until you are ready to share it publicly.'}
        </p>
        {!founder && (
          <p className="prof-desc" style={{ marginTop: '12px' }}>
            You need to create your startup profile first before you can publish a public link.
          </p>
        )}
        {founder && toggleVisibility.isPending && (
          <p className="prof-desc" style={{ marginTop: '12px', color: 'var(--accent)' }}>
            Updating visibility...
          </p>
        )}
        {founder?.isPublic && profileUrl && shareLinks && (
          <div className="prof-links" style={{ marginTop: '16px' }}>
            <a className="prof-url-copy" href={shareLinks.x} onClick={(e) => { e.preventDefault(); openShare(shareLinks.x); }}>
              X
            </a>
            <a className="prof-url-copy" href={shareLinks.linkedin} onClick={(e) => { e.preventDefault(); openShare(shareLinks.linkedin); }}>
              LinkedIn
            </a>
            <a className="prof-url-copy" href={shareLinks.whatsapp} onClick={(e) => { e.preventDefault(); openShare(shareLinks.whatsapp); }}>
              WhatsApp
            </a>
          </div>
        )}
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
            <div className="prof-title">{user?.title || 'Founder'}</div>
            {founder?.companyName && (
              <div className="prof-company">{founder.companyName}</div>
            )}
            {(founder?.city || founder?.country) && (
              <div className="prof-meta-row">
                <MapPin size={14} />
                {founder.city || ''}{founder.city && founder.country ? ', ' : ''}{founder.country || ''}
              </div>
            )}

            {user?.bio && (
              <p className="prof-bio">{user.bio}</p>
            )}

            <div className="prof-links">
              {user?.website && (
                <a href={user.website} target="_blank" rel="noreferrer" className="prof-link">
                  <Globe size={15} /> Website
                </a>
              )}
              {user?.linkedin && (
                <a href={user.linkedin} target="_blank" rel="noreferrer" className="prof-link">
                  <Link2 size={15} /> LinkedIn
                </a>
              )}
              {user?.twitter && (
                <a href={user.twitter} target="_blank" rel="noreferrer" className="prof-link">
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
