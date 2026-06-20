import { Link } from 'react-router-dom';
import { Bookmark, MapPin, Building2, TrendingUp } from 'lucide-react';
import { useAllStartups, useToggleSaveStartup } from '../../hooks/useInvestor';
import { useAuthStore } from '../../store/authStore';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';

const SavedStartups = () => {
  const { data: startups, isLoading } = useAllStartups();
  const toggleSave = useToggleSaveStartup();
  const user = useAuthStore(state => state.user);

  if (isLoading) return <Spinner text="Loading saved deals..." />;

  const savedStartups = startups?.filter(s => s.savedBy?.includes(user?.id)) || [];

  const handleUnsave = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSave.mutate(id);
  };

  return (
    <div className="container-fluid p-0">
      <div className="mb-4">
        <h1 className="h3 fw-bold mb-1">Saved Startups</h1>
        <p className="text-secondary mb-0">Your watchlist of high-potential deals.</p>
      </div>

      {savedStartups.length === 0 ? (
        <div className="card border-0 shadow-sm py-5">
          <EmptyState title="No saved deals" message="You haven't saved any startups yet. Browse the Deal Feed to find opportunities." />
          <div className="text-center mt-3">
             <Link to="/investor/dashboard" className="btn btn-outline-primary">Browse Deal Feed</Link>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {savedStartups.map((startup) => {
            const scoreColor = startup.score >= 80 ? 'text-success' : startup.score >= 60 ? 'text-warning' : 'text-danger';
            
            return (
              <div className="col-12 col-xl-6" key={startup.id}>
                <Link to={`/investor/startup/${startup.id}`} className="text-decoration-none">
                  <div className="card border-0 shadow-sm h-100 position-relative">
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
                          className="btn btn-sm rounded-circle p-2 btn-primary text-white"
                          onClick={(e) => handleUnsave(e, startup.id)}
                          title="Remove from saved"
                        >
                          <Bookmark size={18} fill="currentColor" />
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

export default SavedStartups;
