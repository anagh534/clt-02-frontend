import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { useFounderStartup, useSaveStartupScore } from '../../hooks/useFounder';
import Spinner from '../../components/ui/Spinner';

const ScoreForm = () => {
  const navigate = useNavigate();
  const { data: initialData, isLoading } = useFounderStartup();
  const saveMutation = useSaveStartupScore();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    industry: 'SaaS',
    stage: 'Pre-Seed',
    location: '',
    description: '',
    metrics: { arr: '', growth: '', runway: '' }
  });

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  if (isLoading) return <Spinner text="Loading your data..." />;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('metrics.')) {
      const metricName = name.split('.')[1];
      setFormData(prev => ({ ...prev, metrics: { ...prev.metrics, [metricName]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate(formData, {
      onSuccess: () => {
        navigate('/founder/dashboard');
      }
    });
  };

  return (
    <div className="card shadow-sm border-0 mx-auto" style={{ maxWidth: '800px' }}>
      <div className="card-header border-bottom p-4">
        <h4 className="fw-bold mb-1">Calculate Your InvestScore</h4>
        <p className="text-secondary mb-0">Step {step} of 3</p>
        
        <div className="progress mt-3" style={{ height: '8px' }}>
          <div className="progress-bar bg-primary" style={{ width: `${(step / 3) * 100}%` }}></div>
        </div>
      </div>
      
      <div className="card-body p-4 p-md-5">
        <form onSubmit={handleSubmit}>
          
          {/* STEP 1: Basic Info */}
          {step === 1 && (
            <div className="row g-4">
              <h5 className="fw-bold mb-2">Startup Basics</h5>
              <div className="col-12">
                <label className="form-label fw-medium">Startup Name</label>
                <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="col-12">
                <label className="form-label fw-medium">Tagline</label>
                <input type="text" className="form-control" name="tagline" value={formData.tagline} onChange={handleChange} required placeholder="What do you do in 1 sentence?" />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-medium">Industry</label>
                <select className="form-select" name="industry" value={formData.industry} onChange={handleChange}>
                  <option>SaaS / AI</option>
                  <option>HealthTech</option>
                  <option>FinTech</option>
                  <option>CleanTech</option>
                  <option>Consumer</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-medium">Location</label>
                <input type="text" className="form-control" name="location" value={formData.location} onChange={handleChange} required />
              </div>
            </div>
          )}

          {/* STEP 2: Details & Stage */}
          {step === 2 && (
            <div className="row g-4">
              <h5 className="fw-bold mb-2">Stage & Details</h5>
              <div className="col-12">
                <label className="form-label fw-medium">Current Stage</label>
                <select className="form-select" name="stage" value={formData.stage} onChange={handleChange}>
                  <option>Pre-Seed</option>
                  <option>Seed</option>
                  <option>Series A</option>
                  <option>Series B+</option>
                </select>
              </div>
              <div className="col-12">
                <label className="form-label fw-medium">Problem & Solution (Description)</label>
                <textarea className="form-control" name="description" rows="4" value={formData.description} onChange={handleChange} required></textarea>
              </div>
            </div>
          )}

          {/* STEP 3: Metrics */}
          {step === 3 && (
            <div className="row g-4">
              <h5 className="fw-bold mb-2">Key Metrics</h5>
              <p className="text-secondary small mb-4">Investors rely heavily on traction and financial health.</p>
              
              <div className="col-md-4">
                <label className="form-label fw-medium">Current ARR / Revenue</label>
                <input type="text" className="form-control" name="metrics.arr" value={formData.metrics.arr} onChange={handleChange} placeholder="e.g. $100k" />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-medium">Growth Rate</label>
                <input type="text" className="form-control" name="metrics.growth" value={formData.metrics.growth} onChange={handleChange} placeholder="e.g. 10% MoM" />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-medium">Runway</label>
                <input type="text" className="form-control" name="metrics.runway" value={formData.metrics.runway} onChange={handleChange} placeholder="e.g. 12 months" />
              </div>
            </div>
          )}

          <div className="d-flex justify-content-between mt-5 pt-4 border-top">
            <button 
              type="button" 
              className="btn btn-light d-flex align-items-center gap-2" 
              onClick={prevStep} 
              disabled={step === 1}
            >
              <ArrowLeft size={18} /> Back
            </button>
            
            {step < 3 ? (
              <button 
                type="button" 
                className="btn btn-primary d-flex align-items-center gap-2" 
                onClick={nextStep}
              >
                Next <ArrowRight size={18} />
              </button>
            ) : (
              <button 
                type="submit" 
                className="btn btn-success d-flex align-items-center gap-2 text-white"
                disabled={saveMutation.isPending}
              >
                {saveMutation.isPending ? <div className="spinner-border spinner-border-sm" /> : <CheckCircle size={18} />}
                Complete & Calculate Score
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScoreForm;
