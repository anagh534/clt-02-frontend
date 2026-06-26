import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  MapPin,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Building2,
  Users,
  ExternalLink,
  X
} from 'lucide-react';
import { useInvestors } from '../../hooks/useInvestors';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';

/* ─── Skeleton card for loading state ───────────────────────── */
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
      <div className="d-flex gap-2 mt-3">
        <div className="placeholder" style={{ width: 60, height: 24, borderRadius: 100 }} />
        <div className="placeholder" style={{ width: 80, height: 24, borderRadius: 100 }} />
      </div>
      <div className="placeholder col-12 placeholder-sm mt-3" style={{ height: 36, borderRadius: 100 }} />
    </div>
  </div>
);

/* ─── Stage badge colors ────────────────────────────────────── */
const stageBadgeClass = (stage) => {
  const map = {
    preseed: 'badge-amber',
    seed: 'badge-blue',
    seriesa: 'badge-purple',
    seriesb: 'badge-green',
    seriesc: 'badge-green',
    growth: 'badge-green'
  };
  return map[stage?.toLowerCase()] || 'badge-blue';
};

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
  return map[stage.toLowerCase()] || stage;
};

/* ─── Main Component ────────────────────────────────────────── */
const InvestorsList = () => {
  const navigate = useNavigate();

  // Filter / search / sort / pagination state
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [industry, setIndustry] = useState('');
  const [stage, setStage] = useState('');
  const [location, setLocation] = useState('');
  const [sort, setSort] = useState('-createdAt');
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Debounce search with a ref-based timeout
  const searchTimerRef = useRef(null);
  const handleSearchChange = useCallback((e) => {
    const val = e.target.value;
    setSearch(val);
    clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      setDebouncedSearch(val);
      setPage(1);
    }, 350);
  }, []);

  // Query params object
  const queryParams = {
    search: debouncedSearch || undefined,
    industry: industry || undefined,
    stage: stage || undefined,
    location: location || undefined,
    sort,
    page,
    limit: 12,
  };

  const { data, isLoading, isError, error, refetch, isFetching } = useInvestors(queryParams);

  const investors = data?.data || [];
  const pagination = data?.pagination || {};
  const filterOptions = data?.filters || { focuses: [], stages: [], locations: [] };

  // Clear all filters
  const clearFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setIndustry('');
    setStage('');
    setLocation('');
    setSort('-createdAt');
    setPage(1);
  };

  const hasActiveFilters = debouncedSearch || industry || stage || location;

  return (
    <div>
      {/* Page Header */}
      <div className="page-head">
        <div>
          <div className="page-head-title">Investors Directory</div>
          <div className="page-head-sub">
            Browse and connect with investors that match your startup
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

      {/* Search Bar & Quick Filters */}
      <div className="investor-toolbar">
        <div className="investor-search-wrap">
          <Search size={18} className="investor-search-icon" />
          <input
            type="text"
            className="investor-search-input"
            placeholder="Search investors by name, company, or location..."
            value={search}
            onChange={handleSearchChange}
          />
          {search && (
            <button
              className="investor-search-clear"
              onClick={() => { setSearch(''); setDebouncedSearch(''); setPage(1); }}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="investor-sort-select">
          <ArrowUpDown size={16} />
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(1); }}
            className="investor-sort-native"
          >
            <option value="-createdAt">Newest</option>
            <option value="createdAt">Oldest</option>
            <option value="name">Name A–Z</option>
            <option value="-name">Name Z–A</option>
            <option value="-portfolioSize">Most Portfolio</option>
            <option value="portfolioSize">Least Portfolio</option>
          </select>
        </div>
      </div>

      {/* Expandable Filters */}
      {showFilters && (
        <div className="investor-filters-panel">
          <div className="investor-filters-grid">
            <div className="investor-filter-group">
              <label className="investor-filter-label">Industry / Focus</label>
              <select
                className="investor-filter-select"
                value={industry}
                onChange={(e) => { setIndustry(e.target.value); setPage(1); }}
              >
                <option value="">All Industries</option>
                {filterOptions.focuses.map((f) => (
                  <option key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</option>
                ))}
              </select>
            </div>
            <div className="investor-filter-group">
              <label className="investor-filter-label">Funding Stage</label>
              <select
                className="investor-filter-select"
                value={stage}
                onChange={(e) => { setStage(e.target.value); setPage(1); }}
              >
                <option value="">All Stages</option>
                {filterOptions.stages.map((s) => (
                  <option key={s} value={s}>{formatStage(s)}</option>
                ))}
              </select>
            </div>
            <div className="investor-filter-group">
              <label className="investor-filter-label">Location</label>
              <select
                className="investor-filter-select"
                value={location}
                onChange={(e) => { setLocation(e.target.value); setPage(1); }}
              >
                <option value="">All Locations</option>
                {filterOptions.locations.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>
          {hasActiveFilters && (
            <button className="investor-clear-filters-btn" onClick={clearFilters}>
              <X size={14} />
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Active filter tags */}
      {hasActiveFilters && !showFilters && (
        <div className="investor-active-tags">
          {debouncedSearch && (
            <span className="investor-tag">
              Search: "{debouncedSearch}"
              <button onClick={() => { setSearch(''); setDebouncedSearch(''); setPage(1); }} aria-label="Remove search">
                <X size={12} />
              </button>
            </span>
          )}
          {industry && (
            <span className="investor-tag">
              {industry}
              <button onClick={() => { setIndustry(''); setPage(1); }} aria-label="Remove industry filter">
                <X size={12} />
              </button>
            </span>
          )}
          {stage && (
            <span className="investor-tag">
              {formatStage(stage)}
              <button onClick={() => { setStage(''); setPage(1); }} aria-label="Remove stage filter">
                <X size={12} />
              </button>
            </span>
          )}
          {location && (
            <span className="investor-tag">
              {location}
              <button onClick={() => { setLocation(''); setPage(1); }} aria-label="Remove location filter">
                <X size={12} />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Results count */}
      {!isLoading && !isError && (
        <div className="investor-results-count">
          {pagination.total > 0 ? (
            <>
              <Users size={16} />
              <span>
                <strong>{pagination.total}</strong> investor{pagination.total !== 1 ? 's' : ''} found
                {pagination.totalPages > 1 && (
                  <span className="investor-results-page">
                    — Page {pagination.page} of {pagination.totalPages}
                  </span>
                )}
              </span>
            </>
          ) : (
            <span>No investors found</span>
          )}
          {isFetching && (
            <div className="spinner-border spinner-border-sm ms-2" role="status" style={{ color: 'var(--accent)' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
          )}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="investor-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && (
        <ErrorState
          message={error?.response?.data?.message || error?.message || 'Failed to load investors'}
          onRetry={refetch}
        />
      )}

      {/* Empty State */}
      {!isLoading && !isError && investors.length === 0 && (
        <EmptyState
          title="No investors found"
          message={
            hasActiveFilters
              ? 'Try adjusting your search or filters to find more investors.'
              : 'No investors have been added to the directory yet.'
          }
        />
      )}

      {/* Investor Cards Grid */}
      {!isLoading && !isError && investors.length > 0 && (
        <>
          <div className="investor-grid">
            {investors.map((investor) => (
              <div key={investor._id} className="investor-card">
                <div className="investor-card-body">
                  {/* Avatar + Name + Company */}
                  <div className="investor-card-head">
                    <div className="investor-avatar" style={{ background: investor.profilePhoto ? 'transparent' : 'var(--accent-grad)' }}>
                      {investor.profilePhoto ? (
                        <img src={investor.profilePhoto} alt={investor.name} className="investor-avatar-img" />
                      ) : (
                        <span>{investor.name?.charAt(0)?.toUpperCase() || 'I'}</span>
                      )}
                    </div>
                    <div className="investor-card-info">
                      <div className="investor-card-name">{investor.name}</div>
                      <div className="investor-card-company">
                        <Building2 size={13} />
                        {investor.company || 'Independent Investor'}
                      </div>
                      {investor.title && (
                        <div className="investor-card-title">{investor.title}</div>
                      )}
                    </div>
                  </div>

                  {/* Focus areas */}
                  {investor.investmentFocus?.length > 0 && (
                    <div className="investor-card-focus">
                      <Briefcase size={14} />
                      <span>{investor.investmentFocus.slice(0, 3).join(', ')}</span>
                      {investor.investmentFocus.length > 3 && (
                        <span className="investor-more-focus">+{investor.investmentFocus.length - 3}</span>
                      )}
                    </div>
                  )}

                  {/* Location */}
                  {investor.location && (
                    <div className="investor-card-location">
                      <MapPin size={14} />
                      <span>{investor.location}</span>
                    </div>
                  )}

                  {/* Stage & Portfolio badges */}
                  <div className="investor-card-badges">
                    {investor.fundingStage && (
                      <span className={`badge ${stageBadgeClass(investor.fundingStage)}`}>
                        {formatStage(investor.fundingStage)}
                      </span>
                    )}
                    {investor.portfolioSize > 0 && (
                      <span className="badge badge-blue">
                        {investor.portfolioSize} portfolio
                      </span>
                    )}
                  </div>

                  {/* View Profile button */}
                  <button
                    className="investor-view-btn"
                    onClick={() => navigate(`/founder/investors/${investor._id}`)}
                  >
                    <ExternalLink size={15} />
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="investor-pagination">
              <button
                className="investor-page-btn"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!pagination.hasPrevPage || isFetching}
                aria-label="Previous page"
              >
                <ChevronLeft size={18} />
                Previous
              </button>

              <div className="investor-page-numbers">
                {Array.from({ length: Math.min(pagination.totalPages, 7) }, (_, i) => {
                  // Show pages around current page
                  let pageNum;
                  const total = pagination.totalPages;
                  const current = pagination.page;

                  if (total <= 7) {
                    pageNum = i + 1;
                  } else if (current <= 4) {
                    pageNum = i + 1;
                  } else if (current >= total - 3) {
                    pageNum = total - 6 + i;
                  } else {
                    pageNum = current - 3 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      className={`investor-page-num ${pageNum === pagination.page ? 'active' : ''}`}
                      onClick={() => setPage(pageNum)}
                      disabled={isFetching}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                className="investor-page-btn"
                onClick={() => setPage((p) => p + 1)}
                disabled={!pagination.hasNextPage || isFetching}
                aria-label="Next page"
              >
                Next
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default InvestorsList;
