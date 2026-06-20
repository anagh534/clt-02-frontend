import { Link } from 'react-router-dom';
import { useFounderStartup } from '../../hooks/useFounder';
import Spinner from '../../components/ui/Spinner';
import { TrendingUp, Users, Eye, Target } from 'lucide-react';

const FounderDashboard = () => {
  const { data: startup, isLoading } = useFounderStartup();

  if (isLoading) return <Spinner text="Loading your dashboard..." />;

  if (!startup) {
    return (
      <div className="card border-0 shadow-sm text-center p-5 mt-4">
        <h3 className="fw-bold mb-3">Welcome to InvestScore!</h3>
        <p className="text-secondary mb-4">You haven't set up your startup profile or calculated your score yet.</p>
        <div>
          <Link to="/founder/onboarding" className="btn btn-primary btn-lg">
            Complete Onboarding
          </Link>
        </div>
      </div>
    );
  }

  // Dashboard Stats
  const scoreColor = startup.score >= 80 ? 'text-success' : startup.score >= 60 ? 'text-warning' : 'text-danger';

  return (
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-end mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1">Overview</h1>
          <p className="text-secondary mb-0">Here's how {startup.name} is performing.</p>
        </div>
        <Link to="/founder/onboarding" className="btn btn-outline-primary">
          Update Metrics
        </Link>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-12 col-md-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4 text-center">
              <h6 className="text-muted text-uppercase fw-bold mb-3">InvestScore</h6>
              <div className={`display-3 fw-bold mb-2 ${scoreColor}`}>{startup.score}</div>
              <p className="text-secondary small mb-0">Top 15% in {startup.industry}</p>
            </div>
          </div>
        </div>
        
        <div className="col-12 col-md-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h6 className="text-muted text-uppercase fw-bold mb-0">Profile Views</h6>
                <div className="bg-primary bg-opacity-10 text-primary p-2 rounded">
                  <Eye size={20} />
                </div>
              </div>
              <h3 className="fw-bold mb-2">142</h3>
              <p className="text-success small mb-0 d-flex align-items-center gap-1">
                <TrendingUp size={14} /> +12% this week
              </p>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h6 className="text-muted text-uppercase fw-bold mb-0">Saves</h6>
                <div className="bg-success bg-opacity-10 text-success p-2 rounded">
                  <Target size={20} />
                </div>
              </div>
              <h3 className="fw-bold mb-2">{startup.savedBy?.length || 0}</h3>
              <p className="text-secondary small mb-0">Investors tracking you</p>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h6 className="text-muted text-uppercase fw-bold mb-0">Profile Completion</h6>
                <div className="bg-info bg-opacity-10 text-info p-2 rounded">
                  <Users size={20} />
                </div>
              </div>
              <h3 className="fw-bold mb-2">85%</h3>
              <div className="progress mt-3" style={{ height: '6px' }}>
                <div className="progress-bar bg-info" style={{ width: '85%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header border-bottom">
              <h5 className="mb-0 fw-bold">Recent Activity & Recommendations</h5>
            </div>
            <div className="card-body">
              <div className="alert alert-warning border-0 bg-warning bg-opacity-10 text-warning d-flex gap-3 mb-4">
                <Target className="flex-shrink-0 mt-1" />
                <div>
                  <strong>Boost your score!</strong>
                  <p className="mb-0 mt-1">Founders with complete cap table details score 15% higher on average. <Link to="/founder/onboarding" className="text-warning text-decoration-underline">Update now</Link></p>
                </div>
              </div>
              
              <ul className="list-group list-group-flush">
                <li className="list-group-item px-0 py-3 bg-transparent border-bottom">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1">Seed Fund Partners viewed your profile</h6>
                      <small className="text-muted">2 hours ago</small>
                    </div>
                  </div>
                </li>
                <li className="list-group-item px-0 py-3 bg-transparent">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1">Your InvestScore increased by 4 points</h6>
                      <small className="text-muted">Yesterday</small>
                    </div>
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

export default FounderDashboard;
