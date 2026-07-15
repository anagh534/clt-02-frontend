import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFounderStartup, useSaveStartupScore } from '../../hooks/useFounder';
import Spinner from '../../components/ui/Spinner';

const TOTAL_STEPS = 4;

const SECTORS = [
  { label: 'Fintech', value: 'fintech' },
  { label: 'Climate', value: 'climate' },
  { label: 'AI', value: 'ai' },
  { label: 'HealthTech', value: 'health' },
  { label: 'SaaS', value: 'saas' },
  { label: 'Commerce', value: 'commerce' },
  { label: 'Agri', value: 'agri' },
  { label: 'Other', value: 'other' }
];

const STAGES = [
  { label: 'Pre-Seed', value: 'preseed' },
  { label: 'Seed', value: 'seed' },
  { label: 'Series A', value: 'seriesA' },
  { label: 'Series B+', value: 'seriesB' }
];

const CUSTOMER_OPTIONS = ['0', 'Under 10', '10–50', '50–200', 'Over 200'];
const TEAM_SIZE_OPTIONS = ['1–3', '4–10', '11–25', '25+'];

const ScoreForm = () => {
  const navigate = useNavigate();
  const { data: initialData, isLoading } = useFounderStartup();
  const saveMutation = useSaveStartupScore();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: '',
    tagline: '',
    sector: 'saas',
    stage: 'preseed',
    raisingAmount: '',
    city: '',
    country: '',
    logoColor: '#D4AF37',
    description: '',
    inputs: {
      mrr: '',
      growth: '',
      customers: '0',
      retention: '',
      teamSize: '1–3',
      priorExit: false,
      technicalCofounder: false,
      runway: ''
    }
  });

  useEffect(() => {
    if (initialData && initialData.founder) {
      const { founder, score } = initialData;
      setFormData(prev => ({
        ...prev,
        companyName: founder.companyName || '',
        tagline: founder.tagline || '',
        sector: founder.sector || 'saas',
        stage: founder.stage || 'preseed',
        raisingAmount: founder.raisingAmount || '',
        city: founder.city || '',
        country: founder.country || '',
        logoColor: founder.logoColor || '#D4AF37',
        description: founder.description || '',
        inputs: {
          ...prev.inputs,
          ...(score?.inputs || {})
        }
      }));
    }
  }, [initialData]);

  if (isLoading) return <Spinner text="Loading..." />;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('inputs.')) {
      const fieldName = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        inputs: {
          ...prev.inputs,
          [fieldName]: type === 'checkbox' ? checked : value
        }
      }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSelect = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleInputSelect = (field, value) => {
    setFormData(prev => ({
      ...prev,
      inputs: {
        ...prev.inputs,
        [field]: value
      }
    }));
  };

  const handleSubmit = () => {
    saveMutation.mutate({
      companyName: formData.companyName,
      tagline: formData.tagline,
      sector: formData.sector,
      stage: formData.stage,
      raisingAmount: formData.raisingAmount ? Number(formData.raisingAmount) : undefined,
      city: formData.city,
      country: formData.country,
      logoColor: formData.logoColor,
      description: formData.description,
      inputs: {
        ...formData.inputs,
        mrr: formData.inputs.mrr !== '' ? Number(formData.inputs.mrr) : 0,
        growth: formData.inputs.growth !== '' ? Number(formData.inputs.growth) : 0,
        retention: formData.inputs.retention !== '' ? Number(formData.inputs.retention) : 0,
        stage: formData.stage,
        sector: formData.sector,
        priorExit: formData.inputs.priorExit,
        technicalCofounder: formData.inputs.technicalCofounder
      }
    }, {
      onSuccess: () => navigate('/founder/dashboard')
    });
  };

  const pct = Math.round((step / TOTAL_STEPS) * 100);

  return (
    <>
      <div className="page-head">
        <div>
          <div className="page-head-title">Build your score</div>
          <div className="page-head-sub">Answer a few questions to calculate your InvestScore.</div>
        </div>
      </div>

      <div className="form-layout">
        {/* ── FORM STEPS ── */}
        <div>

          {/* STEP 1 — Startup Basics */}
          {step === 1 && (
            <>
              <div className="q-group">
                <div className="q-label">Startup Basics</div>
                <div className="q-sub">Tell investors what you're building.</div>

                <div className="input-grp">
                  <label className="input-lbl">Startup Name</label>
                  <input className="input filled" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="e.g. Klimar Tech" />
                </div>
                <div className="input-grp">
                  <label className="input-lbl">Tagline</label>
                  <input className="input filled" name="tagline" value={formData.tagline} onChange={handleChange} placeholder="One-sentence pitch" />
                </div>
                <div className="input-grp">
                  <label className="input-lbl">Description</label>
                  <textarea
                    className="input filled"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="What problem are you solving? How?"
                    rows={3}
                    style={{ resize: 'vertical', lineHeight: '1.6' }}
                  />
                </div>
              </div>

              <button className="btn btn-accent" onClick={() => setStep(2)}>Continue →</button>
            </>
          )}

          {/* STEP 2 — Sector + Stage + Location + Target Capital */}
          {step === 2 && (
            <>
              <div className="q-group">
                <div className="q-label">Sector</div>
                <div className="q-sub">Pick the one that fits best.</div>
                <div className="opt-grid opt-grid-4">
                  {SECTORS.map(s => (
                    <div
                      key={s.value}
                      className={`opt${formData.sector === s.value ? ' selected' : ''}`}
                      onClick={() => handleSelect('sector', s.value)}
                    >
                      {s.label}
                    </div>
                  ))}
                </div>
              </div>

              <div className="q-group">
                <div className="q-label">Funding stage</div>
                <div className="q-sub">Where are you right now?</div>
                <div className="opt-grid">
                  {STAGES.map(stg => (
                    <div
                      key={stg.value}
                      className={`opt${formData.stage === stg.value ? ' selected' : ''}`}
                      onClick={() => handleSelect('stage', stg.value)}
                    >
                      {stg.label}
                    </div>
                  ))}
                </div>
              </div>

              <div className="q-group">
                <div className="q-label">Location</div>
                <div className="q-sub">City & Country Code</div>
                <div className="input-grp-row" style={{ display: 'flex', gap: '12px' }}>
                  <div className="input-grp" style={{ flex: 1 }}>
                    <label className="input-lbl">City</label>
                    <input className="input filled" name="city" value={formData.city} onChange={handleChange} placeholder="e.g. Lagos" />
                  </div>
                  <div className="input-grp" style={{ flex: 1 }}>
                    <label className="input-lbl">Country Code</label>
                    <input className="input filled" name="country" value={formData.country} onChange={handleChange} placeholder="e.g. NG" maxLength={2} />
                  </div>
                </div>
              </div>

              <div className="q-group">
                <div className="q-label">Raising Amount</div>
                <div className="q-sub">Target funding size in GBP</div>
                <div className="input-grp">
                  <label className="input-lbl">Target Amount (£)</label>
                  <input type="number" className="input filled" name="raisingAmount" value={formData.raisingAmount} onChange={handleChange} placeholder="e.g. 500000" />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn btn-ghost" onClick={() => setStep(1)}>← Back</button>
                <button className="btn btn-accent" onClick={() => setStep(3)}>Continue →</button>
              </div>
            </>
          )}

          {/* STEP 3 — Traction & Financial Metrics */}
          {step === 3 && (
            <>
              <div className="q-group">
                <div className="q-label">Financial & Traction Metrics</div>
                <div className="q-sub">Please enter your exact metrics.</div>

                <div className="input-grp">
                  <label className="input-lbl">Monthly Revenue (MRR) - GBP (£)</label>
                  <input
                    type="number"
                    className="input filled"
                    name="inputs.mrr"
                    value={formData.inputs.mrr}
                    onChange={handleChange}
                    placeholder="e.g. 12500"
                    min="0"
                  />
                </div>

                <div className="input-grp">
                  <label className="input-lbl">Monthly Growth Rate (%)</label>
                  <input
                    type="number"
                    className="input filled"
                    name="inputs.growth"
                    value={formData.inputs.growth}
                    onChange={handleChange}
                    placeholder="e.g. 15"
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </div>

                <div className="input-grp">
                  <label className="input-lbl">6-Month Customer Retention (%)</label>
                  <input
                    type="number"
                    className="input filled"
                    name="inputs.retention"
                    value={formData.inputs.retention}
                    onChange={handleChange}
                    placeholder="e.g. 85"
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </div>
              </div>

              <div className="q-group">
                <div className="q-label">Customer Count</div>
                <div className="q-sub">Number of active/paying users.</div>
                <div className="opt-grid">
                  {CUSTOMER_OPTIONS.map(opt => (
                    <div
                      key={opt}
                      className={`opt${formData.inputs.customers === opt ? ' selected' : ''}`}
                      onClick={() => handleInputSelect('customers', opt)}
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              </div>

              <div className="q-group">
                <div className="q-label">Runway</div>
                <div className="q-sub">Remaining cash runway (optional)</div>
                <div className="input-grp">
                  <label className="input-lbl">Cash Runway</label>
                  <input className="input filled" name="inputs.runway" value={formData.inputs.runway} onChange={handleChange} placeholder="e.g. 18 months" />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn btn-ghost" onClick={() => setStep(2)}>← Back</button>
                <button className="btn btn-accent" onClick={() => setStep(4)}>Continue →</button>
              </div>
            </>
          )}

          {/* STEP 4 — Team & Founder Background */}
          {step === 4 && (
            <>
              <div className="q-group">
                <div className="q-label">Team Size</div>
                <div className="q-sub">Total number of full-time team members.</div>
                <div className="opt-grid">
                  {TEAM_SIZE_OPTIONS.map(opt => (
                    <div
                      key={opt}
                      className={`opt${formData.inputs.teamSize === opt ? ' selected' : ''}`}
                      onClick={() => handleInputSelect('teamSize', opt)}
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              </div>

              <div className="q-group">
                <div className="q-label">Founder Background</div>
                <div className="q-sub">These signals significantly boost investor confidence.</div>

                <div className="check-group">
                  <label className={`check-opt${formData.inputs.priorExit ? ' selected' : ''}`}>
                    <input
                      type="checkbox"
                      name="inputs.priorExit"
                      checked={formData.inputs.priorExit}
                      onChange={handleChange}
                      className="check-input"
                    />
                    <div className="check-box">{formData.inputs.priorExit && <span className="check-tick">✓</span>}</div>
                    <div className="check-content">
                      <div className="check-title">Prior startup exit</div>
                      <div className="check-sub">You've previously founded and exited a company (acquisition or IPO)</div>
                    </div>
                  </label>

                  <label className={`check-opt${formData.inputs.technicalCofounder ? ' selected' : ''}`}>
                    <input
                      type="checkbox"
                      name="inputs.technicalCofounder"
                      checked={formData.inputs.technicalCofounder}
                      onChange={handleChange}
                      className="check-input"
                    />
                    <div className="check-box">{formData.inputs.technicalCofounder && <span className="check-tick">✓</span>}</div>
                    <div className="check-content">
                      <div className="check-title">Technical co-founder</div>
                      <div className="check-sub">At least one co-founder has strong engineering or product background</div>
                    </div>
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn btn-ghost" onClick={() => setStep(3)}>← Back</button>
                <button
                  className="btn btn-accent"
                  onClick={handleSubmit}
                  disabled={saveMutation.isPending}
                >
                  {saveMutation.isPending ? 'Calculating...' : 'Calculate Score →'}
                </button>
              </div>
            </>
          )}
        </div>

        {/* ── PROGRESS SIDEBAR ── */}
        <div className="form-progress">
          <div className="form-progress-card">
            <div className="form-progress-pct">{pct}%</div>
            <div className="form-progress-lbl">Step {step} of {TOTAL_STEPS}</div>
            <div className="form-progress-bar">
              <div className="form-progress-fill" style={{ width: `${pct}%` }} />
            </div>

            {/* Step indicators */}
            <div className="form-steps-list">
              {[
                { n: 1, label: 'Basics' },
                { n: 2, label: 'Sector & Stage' },
                { n: 3, label: 'Traction & Financials' },
                { n: 4, label: 'Team & Signals' },
              ].map(({ n, label }) => (
                <div key={n} className={`form-step-item${step === n ? ' active' : step > n ? ' done' : ''}`}>
                  <div className="form-step-dot">{step > n ? '✓' : n}</div>
                  <div className="form-step-lbl">{label}</div>
                </div>
              ))}
            </div>

            <div className="form-progress-note">
              The more accurate your answers, the more investors trust your score. You can update anytime.
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ScoreForm;
