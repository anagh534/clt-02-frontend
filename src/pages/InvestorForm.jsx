import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { useInvestor, useCreateInvestor, useUpdateInvestor } from '../hooks/useInvestors';
import Spinner from '../components/ui/Spinner';
import ErrorState from '../components/ui/ErrorState';

const InvestorForm = () => {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();

  const { data: initialData, isLoading: isLoadingInitial, isError, error } = useInvestor(id);
  const createMutation = useCreateInvestor();
  const updateMutation = useUpdateInvestor();

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    location: '',
    focus: '',
    status: 'Active'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditing && initialData) {
      setFormData(initialData);
    }
  }, [isEditing, initialData]);

  if (isEditing && isLoadingInitial) return <Spinner text="Loading investor details..." />;
  if (isEditing && isError) return <ErrorState message={error.message} />;

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.company.trim()) newErrors.company = 'Company is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (isEditing) {
      updateMutation.mutate({ id, data: formData }, {
        onSuccess: () => navigate(`/investors/${id}`)
      });
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => navigate('/investors')
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="container-fluid p-0">
      <div className="mb-4">
        <Link to={isEditing ? `/investors/${id}` : '/investors'} className="text-secondary text-decoration-none d-inline-flex align-items-center gap-2 mb-3 hover-primary">
          <ArrowLeft size={16} />
          <span>Back</span>
        </Link>
        <h1 className="h3 fw-bold mb-0">{isEditing ? 'Edit Investor' : 'Add New Investor'}</h1>
      </div>

      <div className="card border-0 shadow-sm" style={{ maxWidth: '800px' }}>
        <div className="card-body p-4 p-md-5">
          <form onSubmit={handleSubmit}>
            <div className="row g-4">
              <div className="col-md-6">
                <label className="form-label fw-medium">Full Name <span className="text-danger">*</span></label>
                <input 
                  type="text" 
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Jane Doe"
                />
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
              </div>
              
              <div className="col-md-6">
                <label className="form-label fw-medium">Company/Firm <span className="text-danger">*</span></label>
                <input 
                  type="text" 
                  className={`form-control ${errors.company ? 'is-invalid' : ''}`}
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="e.g. Acme Ventures"
                />
                {errors.company && <div className="invalid-feedback">{errors.company}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label fw-medium">Email Address <span className="text-danger">*</span></label>
                <input 
                  type="email" 
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. jane@example.com"
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label fw-medium">Phone Number</label>
                <input 
                  type="text" 
                  className="form-control"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. +1 234 567 8900"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-medium">Location</label>
                <input 
                  type="text" 
                  className="form-control"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. New York, NY"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-medium">Investment Focus</label>
                <input 
                  type="text" 
                  className="form-control"
                  name="focus"
                  value={formData.focus}
                  onChange={handleChange}
                  placeholder="e.g. Technology, Health"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-medium">Status</label>
                <select 
                  className="form-select"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="col-12 mt-5 text-end border-top pt-4">
                <Link to={isEditing ? `/investors/${id}` : '/investors'} className="btn btn-light px-4 py-2 me-3">
                  Cancel
                </Link>
                <button type="submit" className="btn btn-primary px-4 py-2 d-inline-flex align-items-center gap-2" disabled={isSaving}>
                  {isSaving ? (
                     <div className="spinner-border spinner-border-sm text-light" role="status">
                       <span className="visually-hidden">Loading...</span>
                     </div>
                  ) : <Save size={18} />}
                  <span>{isSaving ? 'Saving...' : 'Save Investor'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InvestorForm;
