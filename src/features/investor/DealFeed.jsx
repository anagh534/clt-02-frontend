import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Bookmark, MapPin, Building2, TrendingUp, Target } from 'lucide-react';
import { useAllStartups, useToggleSaveStartup } from '../../hooks/useInvestor';
import { useAuthStore } from '../../store/authStore';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';

const DealFeed = () => {
  const { data: startups, isLoading } = useAllStartups();
  const toggleSave = useToggleSaveStartup();
  const user = useAuthStore(state => state.user);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');
  const [stageFilter, setStageFilter] = useState('');

  if (isLoading) return <Spinner text="Loading deal feed..." />;

  const industries = [...new Set(startups?.map(s => s.industry))].filter(Boolean);
  const stages = [...new Set(startups?.map(s => s.stage))].filter(Boolean);

  const filteredStartups = startups?.filter(s => {
    const matchesSearch = s.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.tagline?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = industryFilter ? s.industry === industryFilter : true;
    const matchesStage = stageFilter ? s.stage === stageFilter : true;
    
    // Only show startups that have completed onboarding (have a score)
    return matchesSearch && matchesIndustry && matchesStage && s.score;
  }).sort((a, b) => b.score - a.score); // Sort by highest score first

  const handleSave = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSave.mutate(id);
  };

  return (
    <div className="container-fluid p-0">
      <div className="mb-4">
        <h1 className="h3 fw-bold mb-1">Deal Feed</h1>
        <p className="text-secondary mb-0">Discover top-scoring startups curated for you.</p>
      </div>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-3">
          <div className="row g-3">
            <div className="col-12 col-md-6 col-lg-4">
              <div className="position-relative">
                <Search className="position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary" size={20} />
                <input 
                  type="text" 
                  className="form-control ps-5" 
                  placeholder="Search startups..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-12 col-md-3 col-lg-3">
              <select 
                className="form-select"
                value={industryFilter}
                onChange={(e) => setIndustryFilter(e.target.value)}
              >
                <option value="">All Industries</option>
                {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
              </select>
            </div>
            <div className="col-12 col-md-3 col-lg-3">
              <select 
                className="form-select"
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
              >
                <option value="">All Stages</option>
                {stages.map(stg => <option key={stg} value={stg}>{stg}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      {filteredStartups?.length === 0 ? (
        <div className="card border-0 shadow-sm py-5"><EmptyState title="No deals found" message="Try adjusting your filters to find matching startups." /></div>
      ) : (
        <div className="row g-4">
          {filteredStartups?.map((startup) => {
            const isSaved = startup.savedBy?.includes(user?.id);
            const scoreColor = startup.score >= 80 ? 'text-success' : startup.score >= 60 ? 'text-warning' : 'text-danger';
            
            return (
              <div className="col-12 col-xl-6" key={startup.id}>
                <Link to={`/investor/startup/${startup.id}`} className="text-decoration-none">
                  <div className="card border-0 shadow-sm h-100 position-relative" style={{ transition: 'transform 0.2s ease', '&:hover': { transform: 'translateY(-4px)' } }}>
                    <div className="card-body p-4">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div className="d-flex align-items-center gap-3">
                          <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '48px', height: '48px', fontSize: '1.2rem' }}>
                            {startup.name.charAt(0)}
                          </div>
                          <div>
                            <h5 className="mb-0 fw-bold text-dark">{startup.name}</h5>
                            <p className="text-secondary small mb-0">{startup.tagline}</p>
                          </div>
                        </div>
                        <button 
                          className={`btn btn-sm rounded-circle p-2 ${isSaved ? 'btn-primary text-white' : 'btn-light text-secondary'}`}
                          onClick={(e) => handleSave(e, startup.id)}
                          title={isSaved ? "Unsave" : "Save Deal"}
                        >
                          <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
                        </button>
                      </div>

                      <div className="d-flex flex-wrap gap-2 mb-4">
                        <span className="badge bg-light text-secondary border d-inline-flex align-items-center gap-1">
                          <Building2 size={12} /> {startup.industry}
                        </span>
                        <span className="badge bg-light text-secondary border d-inline-flex align-items-center gap-1">
                          <TrendingUp size={12} /> {startup.stage}
                        </span>
                        <span className="badge bg-light text-secondary border d-inline-flex align-items-center gap-1">
                          <MapPin size={12} /> {startup.location}
                        </span>
                      </div>

                      <div className="row g-0 rounded border overflow-hidden mt-auto">
                        <div className="col-4 border-end bg-light p-3 text-center">
                          <small className="text-uppercase text-secondary fw-bold d-block mb-1" style={{fontSize: '0.65rem'}}>InvestScore</small>
                          <span className={`h4 fw-bold mb-0 ${scoreColor}`}>{startup.score}</span>
                        </div>
                        <div className="col-4 border-end bg-light p-3 text-center">
                          <small className="text-uppercase text-secondary fw-bold d-block mb-1" style={{fontSize: '0.65rem'}}>ARR</small>
                          <span className="h6 fw-bold mb-0 text-dark">{startup.metrics?.arr || 'N/A'}</span>
                        </div>
                        <div className="col-4 bg-light p-3 text-center">
                          <small className="text-uppercase text-secondary fw-bold d-block mb-1" style={{fontSize: '0.65rem'}}>Growth</small>
                          <span className="h6 fw-bold mb-0 text-dark">{startup.metrics?.growth || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DealFeed;
