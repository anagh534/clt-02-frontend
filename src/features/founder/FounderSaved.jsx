import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  MapPin,
  Briefcase,
  Building2,
  Users,
  ExternalLink,
  X,
  BookmarkCheck,
  Trash2,
  Mail
} from 'lucide-react';
import { useShortlist, useToggleShortlist } from '../../hooks/useShortlist';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';

/* ─── Stage helpers ─────────────────────────────────────────── */
const formatStage = (stage) => {
  if (!stage) return 'N/A';
  if (Array.isArray(stage)) return stage.map(formatStage).join(', ');
  if (typeof stage !== 'string') return String(stage);
  const map = { preseed: 'Pre-Seed', seed: 'Seed', seriesa: 'Series A', seriesb: 'Series B', seriesc: 'Series C', growth: 'Growth' };
  return map[stage.toLowerCase()] || stage;
};
const stageBadgeClass = (stage) => {
  if (Array.isArray(stage)) stage = stage[0];
  if (typeof stage !== 'string') return 'badge-blue';
  const map = { preseed: 'badge-amber', seed: 'badge-blue', seriesa: 'badge-purple', seriesb: 'badge-green', seriesc: 'badge-green', growth: 'badge-green' };
  return map[stage?.toLowerCase()] || 'badge-blue';
};

/* ─── Skeleton ──────────────────────────────────────────────── */
const SkeletonCard = () => (
  <div className="investor-card placeholder-glow" aria-hidden="true">
    <div className="investor-card-body">
      <div className="d-flex align-items-center gap-3 mb-3">
        <div className="placeholder rounded-circle" style={{ width: 52, height: 52 }} />
        <div className="flex-grow-1">
          <div className="placeholder col-8 placeholder-sm mb-1" />
          <div className="placeholder col-6 placeholder-xs" />
        </div>
      </div>
      <div className="placeholder col-10 placeholder-xs mb-2" />
      <div className="placeholder col-7 placeholder-xs mb-2" />
      <div className="d-flex gap-2 mt-3"><div className="placeholder" style={{ width: 60, height: 24, borderRadius: 100 }} /><div className="placeholder" style={{ width: 80, height: 24, borderRadius: 100 }} /></div>
      <div className="d-flex gap-2 mt-3"><div className="placeholder col-6 placeholder-sm" style={{ height: 36, borderRadius: 100 }} /><div className="placeholder col-6 placeholder-sm" style={{ height: 36, borderRadius: 100 }} /></div>
    </div>
  </div>
);

/* ─── Main Component ────────────────────────────────────────── */
const FounderSaved = () => {
  const navigate = useNavigate();
  const toggleShortlist = useToggleShortlist();

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [industry, setIndustry] = useState('');
  const [stage, setStage] = useState('');
  const [location, setLocation] = useState('');
  const [sort, setSort] = useState('-createdAt');
  const [showFilters, setShowFilters] = useState(false);

  const searchTimerRef = useRef(null);
  const handleSearchChange = useCallback((e) => {
    const val = e.target.value;
    setSearch(val);
    clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => { setDebouncedSearch(val); }, 350);
  }, []);

  const queryParams = {
    search: debouncedSearch || undefined,
    industry: industry || undefined,
    stage: stage || undefined,
    location: location || undefined,
    sort,
  };

  const { data, isLoading, isError, error, refetch } = useShortlist(queryParams);
  const investors = data?.data || [];

  const hasActiveFilters = debouncedSearch || industry || stage || location;

  const clearFilters = () => {
    setSearch(''); setDebouncedSearch(''); setIndustry(''); setStage(''); setLocation('');
  };

  // Extract unique filter options from data
  const allFocuses = [...new Set(investors.flatMap(i => i.investmentFocus || []))].sort();
  const allStages = [...new Set(investors.map(i => i.fundingStage).filter(Boolean))].sort();
  const allLocations = [...new Set(investors.map(i => i.location).filter(Boolean))].sort();

  return (
    <div>
      {/* Page Header */}
      <div className="page-head">
        <div>
          <div className="page-head-title">
            <BookmarkCheck size={24} style={{ color: 'var(--accent)', marginRight: 8 }} />
            Saved Investors
          </div>
          <div className="page-head-sub">
            {investors.length > 0
              ? `You have ${investors.length} investor${investors.length !== 1 ? 's' : ''} saved`
              : 'Investors you save will appear here'}
          </div>
        </div>
        <div className="page-head-actions">
          <button
            className={`icon-btn ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
            title="Toggle filters"
            style={showFilters ? { background: 'var(--accent-dim)', color: 'var(--accent)', borderColor: 'var(--accent)' } : {}}
          >
            <SlidersHorizontal size={18} />
          </button>
        </div>
      </div>

      {/* Search & Sort */}
      <div className="investor-toolbar">
        <div className="investor-search-wrap">
          <Search size={18} className="investor-search-icon" />
          <input
            type="text"
            className="investor-search-input"
            placeholder="Search saved investors..."
            value={search}
            onChange={handleSearchChange}
          />
          {search && (
            <button className="investor-search-clear" onClick={() => { setSearch(''); setDebouncedSearch(''); }} aria-label="Clear search">
              <X size={16} />
            </button>
          )}
        </div>
        <div className="investor-sort-select">
          <ArrowUpDown size={16} />
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="investor-sort-native">
            <option value="-createdAt">Recently Saved</option>
            <option value="createdAt">Oldest Saved</option>
            <option value="name">Name A–Z</option>
            <option value="-name">Name Z–A</option>
            <option value="-portfolioSize">Most Portfolio</option>
            <option value="portfolioSize">Least Portfolio</option>
          </select>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="investor-filters-panel">
          <div className="investor-filters-grid">
            <div className="investor-filter-group">
              <label className="investor-filter-label">Industry / Focus</label>
              <select className="investor-filter-select" value={industry} onChange={(e) => setIndustry(e.target.value)}>
                <option value="">All Industries</option>
                {allFocuses.map((f) => (<option key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</option>))}
              </select>
            </div>
            <div className="investor-filter-group">
              <label className="investor-filter-label">Funding Stage</label>
              <select className="investor-filter-select" value={stage} onChange={(e) => setStage(e.target.value)}>
                <option value="">All Stages</option>
                {allStages.map((s) => (<option key={s} value={s}>{formatStage(s)}</option>))}
              </select>
            </div>
            <div className="investor-filter-group">
              <label className="investor-filter-label">Location</label>
              <select className="investor-filter-select" value={location} onChange={(e) => setLocation(e.target.value)}>
                <option value="">All Locations</option>
                {allLocations.map((l) => (<option key={l} value={l}>{l}</option>))}
              </select>
            </div>
          </div>
          {hasActiveFilters && (
            <button className="investor-clear-filters-btn" onClick={clearFilters}><X size={14} /> Clear all filters</button>
          )}
        </div>
      )}

      {/* Active filter tags */}
      {hasActiveFilters && !showFilters && (
        <div className="investor-active-tags">
          {debouncedSearch && (
            <span className="investor-tag">Search: "{debouncedSearch}"<button onClick={() => { setSearch(''); setDebouncedSearch(''); }}><X size={12} /></button></span>
          )}
          {industry && <span className="investor-tag">{industry}<button onClick={() => setIndustry('')}><X size={12} /></button></span>}
          {stage && <span className="investor-tag">{formatStage(stage)}<button onClick={() => setStage('')}><X size={12} /></button></span>}
          {location && <span className="investor-tag">{location}<button onClick={() => setLocation('')}><X size={12} /></button></span>}
        </div>
      )}

      {/* Results count */}
      {!isLoading && !isError && (
        <div className="investor-results-count">
          {investors.length > 0 ? (
            <><BookmarkCheck size={16} /><span><strong>{investors.length}</strong> saved investor{investors.length !== 1 ? 's' : ''}</span></>
          ) : (
            <span>No saved investors found</span>
          )}
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="investor-grid">
          {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Error */}
      {isError && <ErrorState message={error?.response?.data?.message || error?.message} onRetry={refetch} />}

      {/* Empty */}
      {!isLoading && !isError && investors.length === 0 && (
        <EmptyState
          title="No saved investors"
          message={hasActiveFilters ? 'Try adjusting your search or filters.' : 'Browse the Investors Directory and save investors to your shortlist for quick access.'}
        />
      )}

      {/* Cards */}
      {!isLoading && !isError && investors.length > 0 && (
        <div className="investor-grid">
          {investors.map((investor) => (
            <div key={investor._id} className="investor-card">
              <div className="investor-card-body">
                {/* Header */}
                <div className="investor-card-head">
                  <div className="investor-avatar" style={{ background: 'var(--accent-grad)' }}>
                    <span>{investor.name?.charAt(0)?.toUpperCase() || 'I'}</span>
                  </div>
                  <div className="investor-card-info">
                    <div className="investor-card-name">{investor.name}</div>
                    <div className="investor-card-company"><Building2 size={13} />{investor.company || 'Independent Investor'}</div>
                    {investor.title && <div className="investor-card-title">{investor.title}</div>}
                  </div>
                </div>

                {/* Focus */}
                {investor.investmentFocus?.length > 0 && (
                  <div className="investor-card-focus"><Briefcase size={14} /><span>{investor.investmentFocus.slice(0, 3).join(', ')}</span>{investor.investmentFocus.length > 3 && <span className="investor-more-focus">+{investor.investmentFocus.length - 3}</span>}</div>
                )}

                {/* Location */}
                {investor.location && <div className="investor-card-location"><MapPin size={14} /><span>{investor.location}</span></div>}

                {/* Badges */}
                <div className="investor-card-badges">
                  {investor.fundingStage && (Array.isArray(investor.fundingStage) ? investor.fundingStage : [investor.fundingStage]).map((stg, idx) => (
                      <span key={idx} className={`badge ${stageBadgeClass(stg)}`}>{formatStage(stg)}</span>
                    ))}
                  {investor.portfolioSize > 0 && <span className="badge badge-blue">{investor.portfolioSize} portfolio</span>}
                </div>

                {/* Action buttons */}
                <div className="investor-card-actions">
                  <button
                    className="investor-save-btn saved"
                    onClick={() => toggleShortlist.mutate({ investorId: investor._id, isShortlisted: true })}
                    disabled={toggleShortlist.isPending}
                    title="Remove from shortlist"
                  >
                    <BookmarkCheck size={15} /> Saved
                  </button>
                  <button className="investor-view-btn" onClick={() => navigate(`/founder/investors/${investor._id}`)}>
                    <ExternalLink size={15} /> View Profile
                  </button>
                </div>

                {/* Contact + Remove row */}
                <div className="saved-card-footer">
                  <button
                    className="saved-contact-btn"
                    onClick={() => window.location.href = `mailto:${investor.email}`}
                    disabled={!investor.email}
                    title={investor.email ? `Email ${investor.name}` : 'No email available'}
                  >
                    <Mail size={14} /> Contact
                  </button>
                  <button
                    className="saved-remove-btn"
                    onClick={() => toggleShortlist.mutate({ investorId: investor._id, isShortlisted: true })}
                    disabled={toggleShortlist.isPending}
                    title="Remove from shortlist"
                  >
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FounderSaved;
