import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

  if (isLoading) return <Spinner text="Loading..." />;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('metrics.')) {
      const metricName = name.split('.')[1];
      setFormData(prev => ({ ...prev, metrics: { ...prev.metrics, [metricName]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSelect = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    saveMutation.mutate(formData, {
      onSuccess: () => navigate('/founder/dashboard')
    });
  };

  return (
    <>
      <div className="topbar">
        <div>
          <div className="topbar-title">Build your score</div>
          <div className="topbar-sub">Answer a few questions to calculate your InvestScore.</div>
        </div>
      </div>
      
      <div className="form-layout">
        <div>
          {step === 1 && (
            <>
              <div className="q-group">
                <div className="q-label">Startup Basics</div>
                <div className="q-sub">What do you do?</div>
                <div className="input-grp">
                  <label className="input-lbl">Startup Name</label>
                  <input className="input filled" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Klimar Tech" />
                </div>
                <div className="input-grp">
                  <label className="input-lbl">Tagline</label>
                  <input className="input filled" name="tagline" value={formData.tagline} onChange={handleChange} placeholder="1 sentence pitch" />
                </div>
                <div className="input-grp">
                  <label className="input-lbl">Industry</label>
                  <select className="input filled" name="industry" value={formData.industry} onChange={handleChange}>
                    <option>SaaS</option><option>Fintech</option><option>Climate</option><option>HealthTech</option>
                  </select>
                </div>
              </div>
              <button className="btn btn-white" onClick={() => setStep(2)}>Continue →</button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="q-group">
                <div className="q-label">What stage are you?</div>
                <div className="q-sub">Pick one</div>
                <div className="opt-grid">
                  {['Pre-Seed', 'Seed', 'Series A', 'Series B+'].map(stg => (
                    <div key={stg} className={`opt ${formData.stage === stg ? 'selected' : ''}`} onClick={() => handleSelect('stage', stg)}>
                      {stg}
                    </div>
                  ))}
                </div>
              </div>
              <div className="q-group">
                <div className="q-label">Location</div>
                <div className="q-sub">City, Country</div>
                <input className="input filled" name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Lagos, NG" />
              </div>
              <div style={{display: 'flex', gap: '12px'}}>
                <button className="btn btn-ghost" onClick={() => setStep(1)}>← Back</button>
                <button className="btn btn-white" onClick={() => setStep(3)}>Continue →</button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="q-group">
                <div className="q-label">Financial Metrics</div>
                <div className="q-sub">Approximate is fine for now</div>
                <div className="input-grp">
                  <label className="input-lbl">Current ARR / Revenue</label>
                  <input className="input filled" name="metrics.arr" value={formData.metrics.arr} onChange={handleChange} placeholder="e.g. $48k" />
                </div>
                <div className="input-grp">
                  <label className="input-lbl">Monthly Growth Rate</label>
                  <input className="input filled" name="metrics.growth" value={formData.metrics.growth} onChange={handleChange} placeholder="e.g. 20%" />
                </div>
                <div className="input-grp">
                  <label className="input-lbl">Runway</label>
                  <input className="input filled" name="metrics.runway" value={formData.metrics.runway} onChange={handleChange} placeholder="e.g. 12 months" />
                </div>
              </div>
              <div style={{display: 'flex', gap: '12px'}}>
                <button className="btn btn-ghost" onClick={() => setStep(2)}>← Back</button>
                <button className="btn btn-white" onClick={handleSubmit} disabled={saveMutation.isPending}>
                  {saveMutation.isPending ? 'Calculating...' : 'Calculate Score →'}
                </button>
              </div>
            </>
          )}
        </div>

        <div className="form-progress">
          <div className="form-progress-card">
            <div className="form-progress-pct">{Math.round((step / 3) * 100)}%</div>
            <div className="form-progress-lbl">Step {step} of 3</div>
            <div className="form-progress-bar">
              <div className="form-progress-fill" style={{width: `${(step / 3) * 100}%`}}></div>
            </div>
            <div className="form-progress-note">The more accurate your answers, the more investors trust your score. You can update this later.</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ScoreForm;
