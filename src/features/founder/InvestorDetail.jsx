import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  Building2,
  Globe,
  Link2,
  AtSign,
  PoundSterling,
  TrendingUp,
  Users,
  ExternalLink,
  Mail,
  Phone,
  Bookmark,
  BookmarkCheck
} from 'lucide-react';
import { useInvestor } from '../../hooks/useInvestors';
import { useToggleShortlist, useSyncShortlistStore } from '../../hooks/useShortlist';
import { useShortlistStore } from '../../store/shortlistStore';
import Spinner from '../../components/ui/Spinner';
import ErrorState from '../../components/ui/ErrorState';

const formatStage = (stage) => {
  if (!stage) return 'N/A';
  const map = {
    preseed: 'Pre-Seed',
    seed: 'Seed',
    seriesa: 'Series A',
    seriesb: 'Series B',
    seriesc: 'Series C',
    growth: 'Growth'
  };
  if (Array.isArray(stage)) {
    return stage.map(s => map[s.toLowerCase()] || s).join(', ');
  }
  return map[stage.toLowerCase()] || stage;
};

const InvestorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, error, refetch } = useInvestor(id);
  const toggleShortlist = useToggleShortlist();
  const shortlistedIds = useShortlistStore((s) => s.shortlistedIds);

  // Sync shortlisted IDs into store on mount
  useSyncShortlistStore();

  const isShortlisted = shortlistedIds.has(id);

  const investor = data?.data || data;

  if (isLoading) {
    return (
      <div className="spinner-wrap">
        <Spinner text="Loading investor details..." />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        message={error?.response?.data?.message || error?.message || 'Failed to load investor'}
        onRetry={refetch}
      />
    );
  }

  if (!investor) {
    return <ErrorState message="Investor not found" />;
  }

  // Format check size
  const checkSizeDisplay = () => {
    const formatter = new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      notation: 'compact',
      maximumFractionDigits: 1
    });
    if (investor.checkSizeMin && investor.checkSizeMax) {
      return `${formatter.format(investor.checkSizeMin)} – ${formatter.format(investor.checkSizeMax)}`;
    }
    if (investor.checkSizeMin) {
      return `From ${formatter.format(investor.checkSizeMin)}`;
    }
    return 'Not specified';
  };

  return (
    <div>
      {/* Back button */}
      <button
        className="investor-back-btn"
        onClick={() => navigate('/founder/investors')}
      >
        <ArrowLeft size={16} />
        Back to Investors
      </button>

      {/* Profile header */}
      <div className="investor-detail-hero">
        <div className="investor-detail-hero-inner">
          <div className="investor-detail-avatar" style={{ background: investor.profilePhoto ? 'transparent' : 'var(--accent-grad)' }}>
            {investor.profilePhoto ? (
              <img src={investor.profilePhoto} alt={investor.name} className="investor-detail-avatar-img" />
            ) : (
              <span>{investor.name?.charAt(0)?.toUpperCase() || 'I'}</span>
            )}
          </div>
          <div className="investor-detail-head-info">
            <h1 className="investor-detail-name">{investor.name}</h1>
            {investor.title && (
              <div className="investor-detail-title">{investor.title}</div>
            )}
            {investor.company && (
              <div className="investor-detail-company">
                <Building2 size={15} />
                {investor.company}
              </div>
            )}
            {investor.location && (
              <div className="investor-detail-meta">
                <MapPin size={14} />
                {investor.location}
              </div>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div className="investor-detail-stats">
          {investor.fundingStage && (
            <div className="investor-detail-stat">
              <div className="investor-detail-stat-lbl">Stage Focus</div>
              <div className="investor-detail-stat-val">{formatStage(investor.fundingStage)}</div>
            </div>
          )}
          <div className="investor-detail-stat">
            <div className="investor-detail-stat-lbl">Check Size</div>
            <div className="investor-detail-stat-val">{checkSizeDisplay()}</div>
          </div>
          <div className="investor-detail-stat">
            <div className="investor-detail-stat-lbl">Portfolio</div>
            <div className="investor-detail-stat-val">{investor.portfolioSize || 0} companies</div>
          </div>
          <div className="investor-detail-stat">
            <div className="investor-detail-stat-lbl">Profile Views</div>
            <div className="investor-detail-stat-val">{investor.profileViews || 0}</div>
          </div>
        </div>

        {/* Shortlist toggle button */}
        <button
          className={`investor-detail-save-btn ${isShortlisted ? 'saved' : ''}`}
          onClick={() => toggleShortlist.mutate({ investorId: id, isShortlisted })}
          disabled={toggleShortlist.isPending}
        >
          {isShortlisted ? (
            <><BookmarkCheck size={18} /> Saved — Remove from Shortlist</>
          ) : (
            <><Bookmark size={18} /> Save to Shortlist</>
          )}
        </button>
      </div>

      <div className="investor-detail-layout">
        {/* Left column — Details */}
        <div className="investor-detail-main">
          {/* Bio */}
          {investor.bio && (
            <div className="investor-detail-section">
              <h3 className="investor-detail-section-h">About</h3>
              <p className="investor-detail-text">{investor.bio}</p>
            </div>
          )}

          {/* Investment Focus */}
          {investor.investmentFocus?.length > 0 && (
            <div className="investor-detail-section">
              <h3 className="investor-detail-section-h">
                <Briefcase size={18} />
                Investment Focus
              </h3>
              <div className="investor-detail-tags">
                {investor.investmentFocus.map((focus) => (
                  <span key={focus} className="investor-detail-tag">
                    {focus.charAt(0).toUpperCase() + focus.slice(1)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Contact */}
          <div className="investor-detail-section">
            <h3 className="investor-detail-section-h">
              <Mail size={18} />
              Contact
            </h3>
            <div className="investor-detail-contact-list">
              {investor.email && (
                <div className="investor-detail-contact-item">
                  <Mail size={15} />
                  <a href={`mailto:${investor.email}`} className="investor-detail-contact-link">{investor.email}</a>
                </div>
              )}
              {investor.phone && (
                <div className="investor-detail-contact-item">
                  <Phone size={15} />
                  <span>{investor.phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column — Links & Sidebar */}
        <div className="investor-detail-side">
          {/* Social & Links */}
          {(investor.website || investor.linkedin || investor.twitter) && (
            <div className="investor-detail-side-card">
              <h3 className="investor-detail-section-h" style={{ marginBottom: 16 }}>Links</h3>
              <div className="investor-detail-links">
                {investor.website && (
                  <a href={investor.website} target="_blank" rel="noreferrer" className="investor-detail-link">
                    <Globe size={16} />
                    Website
                    <ExternalLink size={13} className="investor-detail-link-icon" />
                  </a>
                )}
                {investor.linkedin && (
                  <a href={investor.linkedin} target="_blank" rel="noreferrer" className="investor-detail-link">
                    <Link2 size={16} />
                    LinkedIn
                    <ExternalLink size={13} className="investor-detail-link-icon" />
                  </a>
                )}
                {investor.twitter && (
                  <a href={investor.twitter} target="_blank" rel="noreferrer" className="investor-detail-link">
                    <AtSign size={16} />
                    Twitter / X
                    <ExternalLink size={13} className="investor-detail-link-icon" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Quick Info */}
          <div className="investor-detail-side-card">
            <h3 className="investor-detail-section-h" style={{ marginBottom: 16 }}>Quick Info</h3>
            <div className="investor-detail-quick-list">
              {investor.fundingStage && (
                <div className="investor-detail-quick-item">
                  <TrendingUp size={15} />
                  <div>
                    <div className="investor-detail-quick-lbl">Preferred Stage</div>
                    <div className="investor-detail-quick-val">{formatStage(investor.fundingStage)}</div>
                  </div>
                </div>
              )}
              {investor.checkSizeMin && (
                <div className="investor-detail-quick-item">
                  <PoundSterling size={15} />
                  <div>
                    <div className="investor-detail-quick-lbl">Check Size</div>
                    <div className="investor-detail-quick-val">{checkSizeDisplay()}</div>
                  </div>
                </div>
              )}
              {investor.portfolioSize > 0 && (
                <div className="investor-detail-quick-item">
                  <Users size={15} />
                  <div>
                    <div className="investor-detail-quick-lbl">Portfolio Companies</div>
                    <div className="investor-detail-quick-val">{investor.portfolioSize}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestorDetail;
