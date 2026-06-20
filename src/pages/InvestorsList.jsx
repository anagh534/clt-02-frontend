import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, Edit, Trash2, Eye } from 'lucide-react';
import { useInvestors, useDeleteInvestor } from '../hooks/useInvestors';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';
import ConfirmModal from '../components/ui/ConfirmModal';

const InvestorsList = () => {
  const { data: investors, isLoading, isError, error, refetch } = useInvestors();
  const deleteMutation = useDeleteInvestor();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [focusFilter, setFocusFilter] = useState('');
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [investorToDelete, setInvestorToDelete] = useState(null);

  if (isLoading) return <Spinner text="Loading investors..." />;
  if (isError) return <ErrorState message={error.message} onRetry={refetch} />;

  // Get unique focus areas for filter dropdown
  const focusAreas = [...new Set(investors?.map(inv => inv.focus))].filter(Boolean);

  // Filter logic
  const filteredInvestors = investors?.filter(inv => {
    const matchesSearch = 
      inv.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      inv.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter ? inv.status === statusFilter : true;
    const matchesFocus = focusFilter ? inv.focus === focusFilter : true;
    
    return matchesSearch && matchesStatus && matchesFocus;
  });

  const handleDeleteClick = (investor) => {
    setInvestorToDelete(investor);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (investorToDelete) {
      deleteMutation.mutate(investorToDelete.id, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          setInvestorToDelete(null);
        }
      });
    }
  };

  return (
    <div className="container-fluid p-0">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h1 className="h3 fw-bold mb-1">Investors</h1>
          <p className="text-secondary mb-0">Manage your investor relationships and pipeline.</p>
        </div>
        <Link to="/investors/new" className="btn btn-primary d-inline-flex align-items-center gap-2 shadow-sm">
          <Plus size={20} />
          <span>Add Investor</span>
        </Link>
      </div>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <div className="row g-3">
            <div className="col-12 col-md-6 col-lg-4">
              <div className="position-relative">
                <Search className="position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary" size={20} />
                <input 
                  type="text" 
                  className="form-control ps-5 py-2 bg-light border-0" 
                  placeholder="Search by name, firm or location..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-12 col-md-3 col-lg-3">
              <select 
                className="form-select py-2 bg-light border-0 text-secondary"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="col-12 col-md-3 col-lg-3">
              <select 
                className="form-select py-2 bg-light border-0 text-secondary"
                value={focusFilter}
                onChange={(e) => setFocusFilter(e.target.value)}
              >
                <option value="">All Focus Areas</option>
                {focusAreas.map(focus => (
                  <option key={focus} value={focus}>{focus}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {filteredInvestors?.length === 0 ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <EmptyState />
          </div>
        </div>
      ) : (
        <div className="card border-0 shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="border-0">Investor</th>
                  <th className="border-0">Contact Info</th>
                  <th className="border-0">Focus & Location</th>
                  <th className="border-0">Status</th>
                  <th className="border-0 text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvestors?.map((investor) => (
                  <tr key={investor.id}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '40px', height: '40px' }}>
                          {investor.name.charAt(0)}
                        </div>
                        <div>
                          <h6 className="mb-0 fw-semibold">{investor.name}</h6>
                          <small className="text-secondary">{investor.company}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="text-dark mb-1">{investor.email}</div>
                      <small className="text-secondary">{investor.phone}</small>
                    </td>
                    <td>
                      <div className="text-dark mb-1">{investor.focus}</div>
                      <small className="text-secondary">{investor.location}</small>
                    </td>
                    <td>
                      <span className={`status-badge ${investor.status === 'Active' ? 'status-active' : 'status-inactive'}`}>
                        {investor.status}
                      </span>
                    </td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-2">
                        <Link to={`/investors/${investor.id}`} className="btn btn-sm btn-light text-primary rounded-circle p-2" title="View Details">
                          <Eye size={16} />
                        </Link>
                        <Link to={`/investors/${investor.id}/edit`} className="btn btn-sm btn-light text-secondary rounded-circle p-2" title="Edit">
                          <Edit size={16} />
                        </Link>
                        <button 
                          className="btn btn-sm btn-light text-danger rounded-circle p-2" 
                          title="Delete"
                          onClick={() => handleDeleteClick(investor)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmModal 
        isOpen={isDeleteModalOpen}
        title="Delete Investor"
        message={`Are you sure you want to delete ${investorToDelete?.name}? This action cannot be undone.`}
        confirmText={deleteMutation.isPending ? 'Deleting...' : 'Delete'}
        isDestructive={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};

export default InvestorsList;
