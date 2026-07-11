import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../store/authStore';
import axiosInstance from '../../api/axiosInstance';
import { useSavedStartups } from '../../hooks/useInvestor';
import { Copy, Check, Share2, ExternalLink, MapPin, Globe, Link2, AtSign, Briefcase, TrendingUp, DollarSign, Lock } from 'lucide-react';
import Spinner from '../../components/ui/Spinner';

const InvestorProfile = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [copied, setCopied] = useState(false);

  const { data: profileData, isLoading } = useQuery({
    queryKey: ['investorProfile', user?.id],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/investors/me');
      return data.data?.investor || null;
    },
    enabled: !!user?.id,
  });

  const investor = profileData;
  const profileUrl = investor?.slug ? `${window.location.origin}/profile/investor/${investor.slug}` : '';

  const { data: savedStartupsData } = useSavedStartups();
  const savedStartups = Array.isArray(savedStartupsData) ? savedStartupsData : [];

  const toggleVisibility = useMutation({
    mutationFn: async (isPublic) => {
      const { data } = await axiosInstance.patch('/investors/me/visibility', { isPublic });
      return data.data?.investor;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investorProfile', user?.id] });
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
    const shareText = `Check out ${user?.name}'s investor profile on InvestScore.`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${user?.name} — Investor Profile`,
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

  if (isLoading) return <Spinner text="Loading profile..." />;

  return (
    <>
      <div className="page-head">
        <div>
          <div className="page-head-title">My Profile</div>
          <div className="page-head-sub">Manage your investor profile visibility and share link</div>
        </div>
        <div className="page-head-actions">
          <button
            className="prof-share-btn"
            onClick={() => investor && toggleVisibility.mutate(!investor.isPublic)}
            disabled={!investor || toggleVisibility.isPending}
          >
            <Lock size={16} />
            {investor?.isPublic ? 'Make Private' : 'Make Public'}
          </button>
          {investor?.isPublic && profileUrl && (
            <>
              <button className="prof-share-btn" onClick={handleShare}>
                <Share2 size={16} />
                Share
              </button>
              <button className="prof-copy-btn" onClick={handleCopy}>
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Profile URL bar */}
      {investor?.isPublic && profileUrl ? (
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
            <span className="prof-url-text">Make it public to generate a shareable link and social share options.</span>
            <button className="prof-url-copy" onClick={() => investor && toggleVisibility.mutate(true)} disabled={!investor}>
              Publish
            </button>
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
              <div className="prof-stat-val">{investor?.isPublic ? 'Public' : 'Private'}</div>
            </div>
          </div>
        </div>
        <p className="prof-desc" style={{ marginTop: '16px' }}>
          {investor?.isPublic
            ? 'Your profile can be viewed and shared publicly.'
            : 'Keep your profile private until you are ready to share it publicly.'}
        </p>
        {!investor && (
          <p className="prof-desc" style={{ marginTop: '12px' }}>
            Create your investor profile first to publish a public link.
          </p>
        )}
        {investor?.isPublic && profileUrl && (
          <div className="prof-links" style={{ marginTop: '16px' }}>
            <a className="prof-url-copy" href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${user?.name}'s investor profile on InvestScore.`)}&url=${encodeURIComponent(profileUrl)}`} onClick={(e) => { e.preventDefault(); openShare(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${user?.name}'s investor profile on InvestScore.`)}&url=${encodeURIComponent(profileUrl)}`); }}>
              X
            </a>
            <a className="prof-url-copy" href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`} onClick={(e) => { e.preventDefault(); openShare(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`); }}>
              LinkedIn
            </a>
            <a className="prof-url-copy" href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out ${user?.name}'s investor profile on InvestScore. ${profileUrl}`)}`} onClick={(e) => { e.preventDefault(); openShare(`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out ${user?.name}'s investor profile on InvestScore. ${profileUrl}`)}`); }}>
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
              <div className="prof-avatar prof-avatar-blue">{user?.name?.charAt(0)}</div>
              <div className="prof-verified">✓</div>
            </div>
            <div className="prof-name">{user?.name}</div>
            <div className="prof-title">{investor?.title || 'Investor'}</div>
            {investor?.company && (
              <div className="prof-company">{investor.company}</div>
            )}
            {investor?.location && (
              <div className="prof-meta-row">
                <MapPin size={14} />
                {investor.location}
              </div>
            )}

            {investor?.bio && (
              <p className="prof-bio">{investor.bio}</p>
            )}

            <div className="prof-links">
              {investor?.website && (
                <a href={investor.website} target="_blank" rel="noreferrer" className="prof-link">
                  <Globe size={15} /> Website
                </a>
              )}
              {investor?.linkedin && (
                <a href={investor.linkedin} target="_blank" rel="noreferrer" className="prof-link">
                  <Link2 size={15} /> LinkedIn
                </a>
              )}
              {investor?.twitter && (
                <a href={investor.twitter} target="_blank" rel="noreferrer" className="prof-link">
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
                  <div className="prof-stat-val">{investor?.checkSize || '$250k – $2M'}</div>
                </div>
              </div>
              <div className="prof-stat-item">
                <TrendingUp size={16} className="prof-stat-ic" />
                <div>
                  <div className="prof-stat-lbl">Stage</div>
                  <div className="prof-stat-val">{(investor?.stage || ['Seed', 'Series A']).join(', ')}</div>
                </div>
              </div>
              <div className="prof-stat-item">
                <Briefcase size={16} className="prof-stat-ic" />
                <div>
                  <div className="prof-stat-lbl">Portfolio Companies</div>
                  <div className="prof-stat-val">{investor?.portfolio || savedStartups.length} companies</div>
                </div>
              </div>
            </div>

            {investor?.focus?.length > 0 && (
              <>
                <div className="prof-stat-lbl" style={{ marginTop: '20px', marginBottom: '10px' }}>Sectors</div>
                <div className="prof-tags">
                  {investor.focus.map(f => (
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
              <div className="prof-stat-card-val">{investor?.portfolio || 42}</div>
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
                {savedStartups.map(s => {
                  const id = s.id || s._id;
                  const name = s.name || s.companyName || 'Startup';
                  const industry = s.industry || s.sector || '—';
                  const stage = s.stage || '—';
                  const score = s.score ?? s.latestScore?.total ?? '—';
                  return (
                    <div key={id} className="prof-watch-row">
                      <div className="startup-logo" style={{ width: '44px', height: '44px', fontSize: '18px', borderRadius: '10px', flexShrink: 0 }}>
                        {name.charAt(0)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="prof-watch-name">{name}</div>
                        <div className="prof-watch-meta">{industry} · {stage}</div>
                      </div>
                      <div className="prof-watch-score">{score}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Focus areas detail */}
          <div className="prof-card">
            <div className="prof-section-h">About My Thesis</div>
            <p className="prof-desc">
              {investor?.bio || 'Investment thesis not yet provided.'}
            </p>
            <div className="prof-tags" style={{ marginTop: '16px' }}>
              {(investor?.stage || ['Seed', 'Series A']).map(s => (
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
