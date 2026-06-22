import { Link, useParams } from 'react-router-dom';
import { mockUsers, mockStartups } from '../../api/mockData';
import { MapPin, Globe, Link2, AtSign, TrendingUp, Briefcase, DollarSign, ArrowLeft } from 'lucide-react';

const PublicProfile = () => {
  const { role, slug } = useParams();

  const profileUser = mockUsers.find(
    u => u.profileSlug === slug || u.id === slug
  );

  if (!profileUser) {
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
              This profile link may be invalid or the user hasn't set up their profile yet.
            </p>
            <Link to="/auth/login" className="btn btn-accent">Go to InvestScore →</Link>
          </div>
        </div>
      </div>
    );
  }

  const isFounder = profileUser.role === 'founder';
  const startup = isFounder ? mockStartups.find(s => s.founderId === profileUser.id) : null;
  const scoreTier = startup?.score >= 90 ? 'A+' : startup?.score >= 80 ? 'A' : startup?.score >= 70 ? 'B' : 'C';

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
        <div className="prof-layout">
          {/* Left column */}
          <div className="prof-left">
            <div className="prof-card">
              <div className="prof-avatar-wrap">
                <div className={`prof-avatar ${!isFounder ? 'prof-avatar-blue' : ''}`}>
                  {profileUser.name?.charAt(0)}
                </div>
                <div className="prof-verified">✓</div>
              </div>
              <div className="prof-name">{profileUser.name}</div>
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
            {isFounder && startup?.score && (
              <div className="prof-card prof-score-card">
                <div className="prof-score-label">InvestScore</div>
                <div className="prof-score-num">{startup.score}</div>
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
            {isFounder && startup ? (
              <>
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
                    <p className="prof-desc" style={{ marginTop: '16px' }}>{startup.description}</p>
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
