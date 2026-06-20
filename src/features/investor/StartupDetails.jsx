import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Bookmark, Mail, MapPin, Building2, TrendingUp, Calendar, Info } from 'lucide-react';
import { useStartupDetails, useToggleSaveStartup } from '../../hooks/useInvestor';
import { useAuthStore } from '../../store/authStore';
import Spinner from '../../components/ui/Spinner';
import ErrorState from '../../components/ui/ErrorState';

const StartupDetails = () => {
  const { id } = useParams();
  const { data: startup, isLoading, isError } = useStartupDetails(id);
  const toggleSave = useToggleSaveStartup();
  const user = useAuthStore(state => state.user);

  if (isLoading) return <Spinner text="Loading startup details..." />;
  if (isError || !startup) return <ErrorState message="Startup not found." />;

  const isSaved = startup.savedBy?.includes(user?.id);
  const scoreColor = startup.score >= 80 ? 'text-success' : startup.score >= 60 ? 'text-warning' : 'text-danger';

  const handleSave = () => {
    toggleSave.mutate(id);
  };

  return (
    <div className="container-fluid p-0">
      <div className="mb-4">
        <Link to="/investor/dashboard" className="text-secondary text-decoration-none d-inline-flex align-items-center gap-2 mb-3 hover-primary">
          <ArrowLeft size={16} />
          <span>Back to Feed</span>
        </Link>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div className="d-flex align-items-center gap-3">
            <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '64px', height: '64px', fontSize: '1.5rem' }}>
              {startup.name.charAt(0)}
            </div>
            <div>
              <h1 className="h3 fw-bold mb-1">{startup.name}</h1>
              <p className="text-secondary mb-0">{startup.tagline}</p>
            </div>
          </div>
          <div className="d-flex gap-2">
            <button 
              className={`btn d-inline-flex align-items-center gap-2 ${isSaved ? 'btn-primary' : 'btn-outline-primary bg-surface'}`}
              onClick={handleSave}
              disabled={toggleSave.isPending}
            >
              {toggleSave.isPending ? <div className="spinner-border spinner-border-sm" /> : <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />}
              <span>{isSaved ? 'Saved' : 'Save Deal'}</span>
            </button>
            <button className="btn btn-primary d-inline-flex align-items-center gap-2">
              <Mail size={18} />
              <span>Contact Founder</span>
            </button>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header border-bottom">
              <h5 className="mb-0 fw-semibold">About the Company</h5>
            </div>
            <div className="card-body p-4">
              <p className="text-secondary lh-lg mb-0">{startup.description}</p>
            </div>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-header border-bottom">
              <h5 className="mb-0 fw-semibold">Key Metrics</h5>
            </div>
            <div className="card-body p-4">
              <div className="row g-4">
                <div className="col-12 col-md-4">
                  <div className="bg-light p-3 rounded">
                    <small className="text-uppercase text-secondary fw-bold d-block mb-1">Current ARR</small>
                    <span className="h4 fw-bold text-dark">{startup.metrics?.arr || 'N/A'}</span>
                  </div>
                </div>
                <div className="col-12 col-md-4">
                  <div className="bg-light p-3 rounded">
                    <small className="text-uppercase text-secondary fw-bold d-block mb-1">MoM Growth</small>
                    <span className="h4 fw-bold text-dark">{startup.metrics?.growth || 'N/A'}</span>
                  </div>
                </div>
                <div className="col-12 col-md-4">
                  <div className="bg-light p-3 rounded">
                    <small className="text-uppercase text-secondary fw-bold d-block mb-1">Runway</small>
                    <span className="h4 fw-bold text-dark">{startup.metrics?.runway || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4 text-center">
              <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                 <h6 className="text-muted text-uppercase fw-bold mb-0">InvestScore</h6>
                 <Info size={16} className="text-muted" />
              </div>
              <div className={`display-1 fw-bold mb-2 ${scoreColor}`}>{startup.score}</div>
              <p className="text-secondary small mb-0">Based on stage, growth, and industry benchmarks.</p>
            </div>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-header border-bottom">
              <h5 className="mb-0 fw-semibold">Company Details</h5>
            </div>
            <div className="card-body p-4">
              <ul className="list-unstyled mb-0 d-flex flex-column gap-3">
                <li className="d-flex align-items-center gap-3">
                  <div className="bg-light p-2 rounded text-secondary"><Building2 size={18} /></div>
                  <div>
                    <small className="d-block text-secondary">Industry</small>
                    <span className="fw-medium text-dark">{startup.industry}</span>
                  </div>
                </li>
                <li className="d-flex align-items-center gap-3">
                  <div className="bg-light p-2 rounded text-secondary"><TrendingUp size={18} /></div>
                  <div>
                    <small className="d-block text-secondary">Stage</small>
                    <span className="fw-medium text-dark">{startup.stage}</span>
                  </div>
                </li>
                <li className="d-flex align-items-center gap-3">
                  <div className="bg-light p-2 rounded text-secondary"><MapPin size={18} /></div>
                  <div>
                    <small className="d-block text-secondary">Location</small>
                    <span className="fw-medium text-dark">{startup.location}</span>
                  </div>
                </li>
                <li className="d-flex align-items-center gap-3">
                  <div className="bg-light p-2 rounded text-secondary"><Calendar size={18} /></div>
                  <div>
                    <small className="d-block text-secondary">Joined InvestScore</small>
                    <span className="fw-medium text-dark">Jun 2026</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartupDetails;
