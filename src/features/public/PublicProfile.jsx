import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';
import Spinner from '../../components/ui/Spinner';
import { MapPin, Globe, Link2, AtSign, TrendingUp, Briefcase, DollarSign, ArrowLeft, Copy, Check, Share2, ExternalLink } from 'lucide-react';
import { useState } from 'react';

const PublicProfile = () => {
  const { role, slug } = useParams();
  const [copied, setCopied] = useState(false);

  const { data: profileData, isLoading, isError } = useQuery({
    queryKey: ['publicProfile', role, slug],
    queryFn: async () => {
      const endpoint = role === 'founder'
        ? `/founders/public/${slug}`
        : role === 'investor'
          ? `/investors/public/${slug}`
          : null;

      if (!endpoint) {
        throw new Error('Profile not found');
      }

      const { data } = await axiosInstance.get(endpoint);
      return data.data;
    },
    enabled: !!role && !!slug,
    retry: false,
  });

  const isFounder = role === 'founder';
  const founder = profileData?.founder || null;
  const investor = profileData?.investor || null;
  const profileUser = isFounder ? founder : investor;
  const displayName = isFounder
    ? profileUser?.companyName || 'Founder'
    : profileUser?.name || 'Investor';
  const score = profileData?.score || null;
  const profileUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/profile/${role}/${slug}`
    : '';

  const handleCopy = () => {
    if (!profileUrl) return;
    navigator.clipboard.writeText(profileUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleShare = async () => {
    if (!profileUrl) return;

    const shareText = isFounder && score
      ? `Check out ${displayName}'s profile on InvestScore. Score: ${score.total} (${score.tier}).`
      : `Check out ${displayName}'s profile on InvestScore.`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${displayName} — ${isFounder ? 'Founder' : 'Investor'} Profile`,
          text: shareText,
          url: profileUrl,
        });
      } catch (_) { }
    } else {
      handleCopy();
    }
  };

  const openShare = (url) => {
    if (!profileUrl) return;
    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=700');
  };

  if (isLoading) {
    return <Spinner text="Loading profile..." />;
  }

  if (isError || !profileUser) {
    return (
      <div className="pub-not-found">
        <div className="pub-logo-bar">
          <Link to="/auth/login" className="sidebar-logo" style={{ textDecoration: 'none' }}>InvestScore</Link>
        </div>
        <div className="pub-not-found-body">
          <div className="prof-card" style={{ textAlign: 'center', padding: '64px 32px', maxWidth: '480px', margin: '0 auto' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>404</div>
            <div className="prof-section-h" style={{ marginBottom: '8px' }}>Profile not found</div>
            <p style={{ color: 'var(--ink-dim)', fontSize: '14px', marginBottom: '24px' }}>
              This profile link may be invalid or the owner has kept the profile private.
            </p>
            <Link to="/auth/login" className="btn btn-accent">Go to InvestScore →</Link>
          </div>
        </div>
      </div>
    );
  }
  const scoreTier = score?.tier || 'C';
  const shareText = isFounder && score
    ? `Check out ${displayName}'s profile on InvestScore. Score: ${score.total} (${score.tier}).`
    : `Check out ${displayName}'s profile on InvestScore.`;
  const shareLinks = profileUrl ? {
    x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(profileUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${profileUrl}`)}`,
  } : null;

  return (
    <div className="pub-profile-wrap">
      {/* Top bar */}
      <div className="pub-topbar">
        <Link to="/auth/login" className="pub-back">
          <ArrowLeft size={16} /> InvestScore
        </Link>
        <div className="pub-topbar-badge">
          {isFounder ? 'Founder Profile' : 'Investor Profile'}
        </div>
      </div>

      <div className="pub-body">
        <div className="prof-url-bar">
          <span className="prof-url-label">Public profile link</span>
          <div className="prof-url-row">
            <span className="prof-url-text">{profileUrl}</span>
            <button className="prof-url-copy" onClick={handleCopy}>
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button className="prof-url-copy" onClick={handleShare}>
              <Share2 size={14} />
              Share
            </button>
            <a className="prof-url-open" href={profileUrl} target="_blank" rel="noreferrer">
              <ExternalLink size={14} />
            </a>
          </div>
        </div>

        {shareLinks && (
          <div className="prof-card" style={{ marginBottom: '20px' }}>
            <div className="prof-section-h">Share</div>
            <p className="prof-desc" style={{ marginTop: '10px' }}>
              {isFounder && score
                ? `Share ${profileUser?.companyName || profileUser?.name} with a score of ${score.total} (${score.tier}).`
                : `Share ${profileUser?.name}'s profile across your networks.`}
            </p>
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
          </div>
        )}

        <div className="prof-layout">
          {/* Left column */}
          <div className="prof-left">
            <div className="prof-card">
              <div className="prof-avatar-wrap">
                <div className={`prof-avatar ${!isFounder ? 'prof-avatar-blue' : ''}`}>
                  {displayName.charAt(0)}
                </div>
                <div className="prof-verified">✓</div>
              </div>
              <div className="prof-name">{displayName}</div>
              <div className="prof-title">{profileUser.title || (isFounder ? 'Founder' : 'Investor')}</div>
              {profileUser.company && (
                <div className="prof-company">{profileUser.company}</div>
              )}
              {profileUser.location && (
                <div className="prof-meta-row">
                  <MapPin size={14} /> {profileUser.location}
                </div>
              )}
              {profileUser.bio && (
                <p className="prof-bio">{profileUser.bio}</p>
              )}
              <div className="prof-links">
                {profileUser.website && (
                  <a href={profileUser.website} target="_blank" rel="noreferrer" className="prof-link">
                    <Globe size={15} /> Website
                  </a>
                )}
                {profileUser.linkedin && (
                  <a href={profileUser.linkedin} target="_blank" rel="noreferrer" className="prof-link">
                    <Link2 size={15} /> LinkedIn
                  </a>
                )}
                {profileUser.twitter && (
                  <a href={profileUser.twitter} target="_blank" rel="noreferrer" className="prof-link">
                    <AtSign size={15} /> Twitter
                  </a>
                )}
              </div>
            </div>

            {/* Score card for founder */}
            {isFounder && score && (
              <div className="prof-card prof-score-card">
                <div className="prof-score-label">InvestScore</div>
                <div className="prof-score-num">{score.total}</div>
                <div className="prof-score-tier">
                  <span className="tier-badge">{scoreTier}</span>
                  Tier {scoreTier}
                </div>
                <div className="prof-score-delta">
                  <TrendingUp size={13} /> Investor Ready
                </div>
              </div>
            )}

            {/* Investment focus for investor */}
            {!isFounder && (
              <div className="prof-card">
                <div className="prof-section-h">Investment Focus</div>
                <div className="prof-stat-list">
                  <div className="prof-stat-item">
                    <DollarSign size={16} className="prof-stat-ic" />
                    <div>
                      <div className="prof-stat-lbl">Check Size</div>
                      <div className="prof-stat-val">{profileUser.checkSize || '$250k – $2M'}</div>
                    </div>
                  </div>
                  <div className="prof-stat-item">
                    <TrendingUp size={16} className="prof-stat-ic" />
                    <div>
                      <div className="prof-stat-lbl">Stage</div>
                      <div className="prof-stat-val">{(profileUser.stage || ['Seed']).join(', ')}</div>
                    </div>
                  </div>
                  <div className="prof-stat-item">
                    <Briefcase size={16} className="prof-stat-ic" />
                    <div>
                      <div className="prof-stat-lbl">Portfolio</div>
                      <div className="prof-stat-val">{profileUser.portfolio || '—'} companies</div>
                    </div>
                  </div>
                </div>
                {profileUser.focus?.length > 0 && (
                  <>
                    <div className="prof-stat-lbl" style={{ marginTop: '20px', marginBottom: '10px' }}>Sectors</div>
                    <div className="prof-tags">
                      {profileUser.focus.map(f => (
                        <span key={f} className="prof-tag prof-tag-accent">{f}</span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="prof-right">
            {isFounder && founder ? (
              <>
                <div className="prof-card">
                  <div className="prof-section-h">Startup</div>
                  <div className="prof-startup-head">
                    <div className="startup-logo">{founder.companyName?.charAt(0)}</div>
                    <div>
                      <div className="prof-startup-name">{founder.companyName}</div>
                      <div className="prof-startup-tagline">{founder.tagline}</div>
                    </div>
                  </div>
                  <div className="prof-tags">
                    <span className="prof-tag">{founder.sector}</span>
                    <span className="prof-tag">{founder.stage}</span>
                    <span className="prof-tag">{[founder.city, founder.country].filter(Boolean).join(', ')}</span>
                  </div>
                  {founder.description && (
                    <p className="prof-desc" style={{ marginTop: '16px' }}>{founder.description}</p>
                  )}
                  <div className="prof-metrics-grid">
                    <div className="prof-metric">
                      <div className="prof-metric-lbl">ARR</div>
                      <div className="prof-metric-val">{score?.inputs?.mrr ? `$${Number(score.inputs.mrr) * 12}` : '—'}</div>
                    </div>
                    <div className="prof-metric">
                      <div className="prof-metric-lbl">Growth</div>
                      <div className="prof-metric-val text-green">{score?.inputs?.growth ? `${score.inputs.growth}% MoM` : '—'}</div>
                    </div>
                    <div className="prof-metric">
                      <div className="prof-metric-lbl">Runway</div>
                      <div className="prof-metric-val">{score?.inputs?.runway || '—'}</div>
                    </div>
                  </div>
                </div>

                <div className="prof-card">
                  <div className="prof-section-h">Score Breakdown</div>
                  <div className="score-bars">
                    {[
                      { name: 'Financial Health', val: score?.breakdown?.financial || 0 },
                      { name: 'Team', val: score?.breakdown?.team || 0 },
                      { name: 'Traction', val: score?.breakdown?.traction || 0 },
                      { name: 'Market Size', val: score?.breakdown?.market || 0 },
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
              </>
            ) : isFounder ? (
              <div className="prof-card" style={{ textAlign: 'center', padding: '48px 32px' }}>
                <p style={{ color: 'var(--ink-dim)', fontSize: '14px' }}>
                  This founder hasn't published their startup profile yet.
                </p>
              </div>
            ) : (
              <div className="prof-card">
                <div className="prof-section-h">About My Thesis</div>
                <p className="prof-desc">{profileUser.bio || 'Investment thesis not yet provided.'}</p>
                <div className="prof-tags" style={{ marginTop: '16px' }}>
                  {(profileUser.stage || ['Seed', 'Series A']).map(s => (
                    <span key={s} className="prof-tag">{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CTA footer */}
        <div className="pub-cta">
          <div className="pub-cta-text">
            <div className="pub-cta-title">Discover top startups on InvestScore</div>
            <div className="pub-cta-sub">AI-powered investment scoring for smarter decisions</div>
          </div>
          <Link to="/auth/login" className="btn btn-accent">Get Started Free →</Link>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
