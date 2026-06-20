import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Mail, Phone, MapPin, Briefcase, User, Activity } from 'lucide-react';
import { useInvestor, useDeleteInvestor } from '../hooks/useInvestors';
import Spinner from '../components/ui/Spinner';
import ErrorState from '../components/ui/ErrorState';
import ConfirmModal from '../components/ui/ConfirmModal';
import { useState } from 'react';

const InvestorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { data: investor, isLoading, isError, error, refetch } = useInvestor(id);
  const deleteMutation = useDeleteInvestor();
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  if (isLoading) return <Spinner text="Loading investor details..." />;
  if (isError) return <ErrorState message={error.message} onRetry={refetch} />;
  if (!investor) return <ErrorState message="Investor not found" />;

  const handleDelete = () => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        navigate('/investors');
      }
    });
  };

  return (
    <div className="container-fluid p-0">
      <div className="mb-4">
        <Link to="/investors" className="text-secondary text-decoration-none d-inline-flex align-items-center gap-2 mb-3 hover-primary">
          <ArrowLeft size={16} />
          <span>Back to Investors</span>
        </Link>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <h1 className="h3 fw-bold mb-0">Investor Profile</h1>
          <div className="d-flex gap-2">
            <Link to={`/investors/${id}/edit`} className="btn btn-outline-primary d-inline-flex align-items-center gap-2 bg-white">
              <Edit size={16} />
              <span>Edit</span>
            </Link>
            <button 
              className="btn btn-outline-danger d-inline-flex align-items-center gap-2 bg-white"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              <Trash2 size={16} />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm text-center p-4">
            <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold mx-auto mb-3" style={{ width: '80px', height: '80px', fontSize: '2rem' }}>
              {investor.name.charAt(0)}
            </div>
            <h3 className="h4 fw-bold mb-1">{investor.name}</h3>
            <p className="text-secondary mb-3">{investor.company}</p>
            <div>
              <span className={`status-badge ${investor.status === 'Active' ? 'status-active' : 'status-inactive'}`}>
                {investor.status}
              </span>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header border-bottom">
              <h5 className="mb-0 fw-semibold">Contact & Professional Details</h5>
            </div>
            <div className="card-body p-4">
              <div className="row g-4">
                <div className="col-12 col-md-6">
                  <div className="d-flex align-items-start gap-3">
                    <div className="bg-light p-2 rounded">
                      <Mail className="text-secondary" size={20} />
                    </div>
                    <div>
                      <small className="text-secondary d-block">Email Address</small>
                      <span className="fw-medium text-dark">{investor.email}</span>
                    </div>
                  </div>
                </div>
                
                <div className="col-12 col-md-6">
                  <div className="d-flex align-items-start gap-3">
                    <div className="bg-light p-2 rounded">
                      <Phone className="text-secondary" size={20} />
                    </div>
                    <div>
                      <small className="text-secondary d-block">Phone Number</small>
                      <span className="fw-medium text-dark">{investor.phone}</span>
                    </div>
                  </div>
                </div>
                
                <div className="col-12 col-md-6">
                  <div className="d-flex align-items-start gap-3">
                    <div className="bg-light p-2 rounded">
                      <MapPin className="text-secondary" size={20} />
                    </div>
                    <div>
                      <small className="text-secondary d-block">Location</small>
                      <span className="fw-medium text-dark">{investor.location}</span>
                    </div>
                  </div>
                </div>
                
                <div className="col-12 col-md-6">
                  <div className="d-flex align-items-start gap-3">
                    <div className="bg-light p-2 rounded">
                      <Briefcase className="text-secondary" size={20} />
                    </div>
                    <div>
                      <small className="text-secondary d-block">Investment Focus</small>
                      <span className="fw-medium text-dark">{investor.focus}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal 
        isOpen={isDeleteModalOpen}
        title="Delete Investor"
        message={`Are you sure you want to delete ${investor?.name}? This action cannot be undone.`}
        confirmText={deleteMutation.isPending ? 'Deleting...' : 'Delete'}
        isDestructive={true}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};

export default InvestorDetails;
