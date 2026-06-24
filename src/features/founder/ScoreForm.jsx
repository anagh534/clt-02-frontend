import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFounderStartup, useSaveStartupScore } from '../../hooks/useFounder';
import Spinner from '../../components/ui/Spinner';

const TOTAL_STEPS = 4;

const SECTORS = [
  'Fintech', 'Climate', 'AI', 'HealthTech', 'SaaS', 'Commerce', 'Agri', 'Other'
];

const CUSTOMER_RANGES = [
  '0 (pre-launch)', '1 – 10', '11 – 100', '101 – 1,000', '1,001 – 10,000', '10,000+'
];

const ScoreForm = () => {
  const navigate = useNavigate();
  const { data: initialData, isLoading } = useFounderStartup();
  const saveMutation = useSaveStartupScore();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    sector: 'SaaS',
    industry: 'SaaS',
    stage: 'Pre-Seed',
    location: '',
    description: '',
    customers: '0 (pre-launch)',
    priorExit: false,
    technicalCofounder: false,
    metrics: { arr: '', growth: '', runway: '' }
  });

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
        sector: initialData.sector || initialData.industry || 'SaaS',
        customers: initialData.customers || '0 (pre-launch)',
        priorExit: initialData.priorExit || false,
        technicalCofounder: initialData.technicalCofounder || false,
      }));
    }
  }, [initialData]);

  if (isLoading) return <Spinner text="Loading..." />;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('metrics.')) {
      const metricName = name.split('.')[1];
      setFormData(prev => ({ ...prev, metrics: { ...prev.metrics, [metricName]: value } }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSelect = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      ...(field === 'sector' ? { industry: value } : {}),
    }));
  };

  const handleSubmit = () => {
    saveMutation.mutate({ ...formData, industry: formData.sector }, {
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
                  <input className="input filled" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Klimar Tech" />
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

          {/* STEP 2 — Sector + Stage + Location */}
          {step === 2 && (
            <>
              <div className="q-group">
                <div className="q-label">Sector</div>
                <div className="q-sub">Pick the one that fits best.</div>
                <div className="opt-grid opt-grid-4">
                  {SECTORS.map(s => (
                    <div
                      key={s}
                      className={`opt${formData.sector === s ? ' selected' : ''}`}
                      onClick={() => handleSelect('sector', s)}
                    >
                      {s}
                    </div>
                  ))}
                </div>
              </div>

              <div className="q-group">
                <div className="q-label">Funding stage</div>
                <div className="q-sub">Where are you right now?</div>
                <div className="opt-grid">
                  {['Pre-Seed', 'Seed', 'Series A', 'Series B+'].map(stg => (
                    <div
                      key={stg}
                      className={`opt${formData.stage === stg ? ' selected' : ''}`}
                      onClick={() => handleSelect('stage', stg)}
                    >
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

              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn btn-ghost" onClick={() => setStep(1)}>← Back</button>
                <button className="btn btn-accent" onClick={() => setStep(3)}>Continue →</button>
              </div>
            </>
          )}

          {/* STEP 3 — Traction: Customers + Financial Metrics */}
          {step === 3 && (
            <>
              <div className="q-group">
                <div className="q-label">Customers</div>
                <div className="q-sub">How many users / paying customers do you have?</div>
                <div className="opt-grid">
                  {CUSTOMER_RANGES.map(r => (
                    <div
                      key={r}
                      className={`opt${formData.customers === r ? ' selected' : ''}`}
                      onClick={() => handleSelect('customers', r)}
                    >
                      {r}
                    </div>
                  ))}
                </div>
              </div>

              <div className="q-group">
                <div className="q-label">Financial Metrics</div>
                <div className="q-sub">Approximate is fine.</div>
                <div className="input-grp">
                  <label className="input-lbl">Current ARR / Revenue</label>
                  <input className="input filled" name="metrics.arr" value={formData.metrics.arr} onChange={handleChange} placeholder="e.g. $48k" />
                </div>
                <div className="input-grp">
                  <label className="input-lbl">Monthly Growth Rate</label>
                  <input className="input filled" name="metrics.growth" value={formData.metrics.growth} onChange={handleChange} placeholder="e.g. 20% MoM" />
                </div>
                <div className="input-grp">
                  <label className="input-lbl">Runway</label>
                  <input className="input filled" name="metrics.runway" value={formData.metrics.runway} onChange={handleChange} placeholder="e.g. 18 months" />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn btn-ghost" onClick={() => setStep(2)}>← Back</button>
                <button className="btn btn-accent" onClick={() => setStep(4)}>Continue →</button>
              </div>
            </>
          )}

          {/* STEP 4 — Founder Background */}
          {step === 4 && (
            <>
              <div className="q-group">
                <div className="q-label">Founder Background</div>
                <div className="q-sub">These signals significantly boost investor confidence.</div>

                <div className="check-group">
                  <label className={`check-opt${formData.priorExit ? ' selected' : ''}`}>
                    <input
                      type="checkbox"
                      name="priorExit"
                      checked={formData.priorExit}
                      onChange={handleChange}
                      className="check-input"
                    />
                    <div className="check-box">{formData.priorExit && <span className="check-tick">✓</span>}</div>
                    <div className="check-content">
                      <div className="check-title">Prior startup exit</div>
                      <div className="check-sub">You've previously founded and exited a company (acquisition or IPO)</div>
                    </div>
                    <div className="check-pts">+15 pts</div>
                  </label>

                  <label className={`check-opt${formData.technicalCofounder ? ' selected' : ''}`}>
                    <input
                      type="checkbox"
                      name="technicalCofounder"
                      checked={formData.technicalCofounder}
                      onChange={handleChange}
                      className="check-input"
                    />
                    <div className="check-box">{formData.technicalCofounder && <span className="check-tick">✓</span>}</div>
                    <div className="check-content">
                      <div className="check-title">Technical co-founder</div>
                      <div className="check-sub">At least one co-founder has strong engineering or product background</div>
                    </div>
                    <div className="check-pts">+10 pts</div>
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
                { n: 3, label: 'Traction' },
                { n: 4, label: 'Background' },
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
