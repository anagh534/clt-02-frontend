import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { mockUsers, mockStartups } from '../../api/mockData';
import { Copy, Check, Share2, ExternalLink, MapPin, Globe, Link2, AtSign, Briefcase, TrendingUp, DollarSign } from 'lucide-react';

const InvestorProfile = () => {
  const { user } = useAuthStore();
  const [copied, setCopied] = useState(false);

  const fullUser = mockUsers.find(u => u.id === user?.id) || user;
  const profileUrl = `${window.location.origin}/profile/investor/${fullUser?.profileSlug || user?.id}`;

  const savedStartups = mockStartups.filter(s => s.savedBy?.includes(user?.id));

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
          title: `${user?.name} — Investor Profile`,
          text: `Check out ${user?.name}'s investor profile on InvestScore`,
          url: profileUrl,
        });
      } catch (_) {}
    } else {
      handleCopy();
    }
  };

  return (
    <>
      <div className="topbar">
        <div>
          <div className="topbar-title">My Profile</div>
          <div className="topbar-sub">Your public investor page</div>
        </div>
        <div className="topbar-actions">
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
              <div className="prof-avatar prof-avatar-blue">{user?.name?.charAt(0)}</div>
              <div className="prof-verified">✓</div>
            </div>
            <div className="prof-name">{user?.name}</div>
            <div className="prof-title">{fullUser?.title || 'Investor'}</div>
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

          {/* Investment thesis snapshot */}
          <div className="prof-card">
            <div className="prof-section-h">Investment Focus</div>
            <div className="prof-stat-list">
              <div className="prof-stat-item">
                <DollarSign size={16} className="prof-stat-ic" />
                <div>
                  <div className="prof-stat-lbl">Check Size</div>
                  <div className="prof-stat-val">{fullUser?.checkSize || '$250k – $2M'}</div>
                </div>
              </div>
              <div className="prof-stat-item">
                <TrendingUp size={16} className="prof-stat-ic" />
                <div>
                  <div className="prof-stat-lbl">Stage</div>
                  <div className="prof-stat-val">{(fullUser?.stage || ['Seed', 'Series A']).join(', ')}</div>
                </div>
              </div>
              <div className="prof-stat-item">
                <Briefcase size={16} className="prof-stat-ic" />
                <div>
                  <div className="prof-stat-lbl">Portfolio Companies</div>
                  <div className="prof-stat-val">{fullUser?.portfolio || savedStartups.length} companies</div>
                </div>
              </div>
            </div>

            {fullUser?.focus?.length > 0 && (
              <>
                <div className="prof-stat-lbl" style={{ marginTop: '20px', marginBottom: '10px' }}>Sectors</div>
                <div className="prof-tags">
                  {fullUser.focus.map(f => (
                    <span key={f} className="prof-tag prof-tag-accent">{f}</span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="prof-right">
          {/* Activity stats */}
          <div className="prof-stats-row">
            <div className="prof-stat-card">
              <div className="prof-stat-card-val">{savedStartups.length}</div>
              <div className="prof-stat-card-lbl">Startups Saved</div>
            </div>
            <div className="prof-stat-card">
              <div className="prof-stat-card-val">{fullUser?.portfolio || 42}</div>
              <div className="prof-stat-card-lbl">Portfolio Size</div>
            </div>
            <div className="prof-stat-card">
              <div className="prof-stat-card-val">3</div>
              <div className="prof-stat-card-lbl">Active Reviews</div>
            </div>
          </div>

          {/* Saved / Watching */}
          <div className="prof-card">
            <div className="prof-section-h" style={{ marginBottom: '20px' }}>
              Watching
              <span className="prof-count">{savedStartups.length}</span>
            </div>
            {savedStartups.length === 0 ? (
              <p style={{ color: 'var(--ink-dim)', fontSize: '14px' }}>No startups saved yet. Browse the deal feed to find opportunities.</p>
            ) : (
              <div className="prof-watch-list">
                {savedStartups.map(s => (
                  <div key={s.id} className="prof-watch-row">
                    <div className="startup-logo" style={{ width: '44px', height: '44px', fontSize: '18px', borderRadius: '10px', flexShrink: 0 }}>
                      {s.name.charAt(0)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="prof-watch-name">{s.name}</div>
                      <div className="prof-watch-meta">{s.industry} · {s.stage}</div>
                    </div>
                    <div className="prof-watch-score">{s.score}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Focus areas detail */}
          <div className="prof-card">
            <div className="prof-section-h">About My Thesis</div>
            <p className="prof-desc">
              {fullUser?.bio || 'Investment thesis not yet provided.'}
            </p>
            <div className="prof-tags" style={{ marginTop: '16px' }}>
              {(fullUser?.stage || ['Seed', 'Series A']).map(s => (
                <span key={s} className="prof-tag">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvestorProfile;
