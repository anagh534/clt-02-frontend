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

const COUNTRIES = [
  { code: 'GB', name: 'United Kingdom' },
  { code: 'US', name: 'United States' },
  { code: 'AF', name: 'Afghanistan' },
  { code: 'AL', name: 'Albania' },
  { code: 'DZ', name: 'Algeria' },
  { code: 'AS', name: 'American Samoa' },
  { code: 'AD', name: 'Andorra' },
  { code: 'AO', name: 'Angola' },
  { code: 'AI', name: 'Anguilla' },
  { code: 'AQ', name: 'Antarctica' },
  { code: 'AG', name: 'Antigua and Barbuda' },
  { code: 'AR', name: 'Argentina' },
  { code: 'AM', name: 'Armenia' },
  { code: 'AW', name: 'Aruba' },
  { code: 'AU', name: 'Australia' },
  { code: 'AT', name: 'Austria' },
  { code: 'AZ', name: 'Azerbaijan' },
  { code: 'BS', name: 'Bahamas' },
  { code: 'BH', name: 'Bahrain' },
  { code: 'BD', name: 'Bangladesh' },
  { code: 'BB', name: 'Barbados' },
  { code: 'BY', name: 'Belarus' },
  { code: 'BE', name: 'Belgium' },
  { code: 'BZ', name: 'Belize' },
  { code: 'BJ', name: 'Benin' },
  { code: 'BM', name: 'Bermuda' },
  { code: 'BT', name: 'Bhutan' },
  { code: 'BO', name: 'Bolivia' },
  { code: 'BA', name: 'Bosnia and Herzegovina' },
  { code: 'BW', name: 'Botswana' },
  { code: 'BR', name: 'Brazil' },
  { code: 'BN', name: 'Brunei' },
  { code: 'BG', name: 'Bulgaria' },
  { code: 'BF', name: 'Burkina Faso' },
  { code: 'BI', name: 'Burundi' },
  { code: 'KH', name: 'Cambodia' },
  { code: 'CM', name: 'Cameroon' },
  { code: 'CA', name: 'Canada' },
  { code: 'CV', name: 'Cape Verde' },
  { code: 'KY', name: 'Cayman Islands' },
  { code: 'CF', name: 'Central African Republic' },
  { code: 'TD', name: 'Chad' },
  { code: 'CL', name: 'Chile' },
  { code: 'CN', name: 'China' },
  { code: 'CO', name: 'Colombia' },
  { code: 'KM', name: 'Comoros' },
  { code: 'CG', name: 'Congo' },
  { code: 'CD', name: 'Congo, Democratic Republic' },
  { code: 'CK', name: 'Cook Islands' },
  { code: 'CR', name: 'Costa Rica' },
  { code: 'HR', name: 'Croatia' },
  { code: 'CU', name: 'Cuba' },
  { code: 'CY', name: 'Cyprus' },
  { code: 'CZ', name: 'Czech Republic' },
  { code: 'DK', name: 'Denmark' },
  { code: 'DJ', name: 'Djibouti' },
  { code: 'DM', name: 'Dominica' },
  { code: 'DO', name: 'Dominican Republic' },
  { code: 'EC', name: 'Ecuador' },
  { code: 'EG', name: 'Egypt' },
  { code: 'SV', name: 'El Salvador' },
  { code: 'GQ', name: 'Equatorial Guinea' },
  { code: 'ER', name: 'Eritrea' },
  { code: 'EE', name: 'Estonia' },
  { code: 'ET', name: 'Ethiopia' },
  { code: 'FJ', name: 'Fiji' },
  { code: 'FI', name: 'Finland' },
  { code: 'FR', name: 'France' },
  { code: 'GA', name: 'Gabon' },
  { code: 'GM', name: 'Gambia' },
  { code: 'GE', name: 'Georgia' },
  { code: 'DE', name: 'Germany' },
  { code: 'GH', name: 'Ghana' },
  { code: 'GR', name: 'Greece' },
  { code: 'GD', name: 'Grenada' },
  { code: 'GT', name: 'Guatemala' },
  { code: 'GN', name: 'Guinea' },
  { code: 'GW', name: 'Guinea-Bissau' },
  { code: 'GY', name: 'Guyana' },
  { code: 'HT', name: 'Haiti' },
  { code: 'HN', name: 'Honduras' },
  { code: 'HK', name: 'Hong Kong' },
  { code: 'HU', name: 'Hungary' },
  { code: 'IS', name: 'Iceland' },
  { code: 'IN', name: 'India' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'IR', name: 'Iran' },
  { code: 'IQ', name: 'Iraq' },
  { code: 'IE', name: 'Ireland' },
  { code: 'IL', name: 'Israel' },
  { code: 'IT', name: 'Italy' },
  { code: 'JM', name: 'Jamaica' },
  { code: 'JP', name: 'Japan' },
  { code: 'JO', name: 'Jordan' },
  { code: 'KZ', name: 'Kazakhstan' },
  { code: 'KE', name: 'Kenya' },
  { code: 'KI', name: 'Kiribati' },
  { code: 'KP', name: 'Korea, North' },
  { code: 'KR', name: 'Korea, South' },
  { code: 'KW', name: 'Kuwait' },
  { code: 'KG', name: 'Kyrgyzstan' },
  { code: 'LA', name: 'Laos' },
  { code: 'LV', name: 'Latvia' },
  { code: 'LB', name: 'Lebanon' },
  { code: 'LS', name: 'Lesotho' },
  { code: 'LR', name: 'Liberia' },
  { code: 'LY', name: 'Libya' },
  { code: 'LI', name: 'Liechtenstein' },
  { code: 'LT', name: 'Lithuania' },
  { code: 'LU', name: 'Luxembourg' },
  { code: 'MO', name: 'Macau' },
  { code: 'MK', name: 'North Macedonia' },
  { code: 'MG', name: 'Madagascar' },
  { code: 'MW', name: 'Malawi' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'MV', name: 'Maldives' },
  { code: 'ML', name: 'Mali' },
  { code: 'MT', name: 'Malta' },
  { code: 'MH', name: 'Marshall Islands' },
  { code: 'MR', name: 'Mauritania' },
  { code: 'MU', name: 'Mauritius' },
  { code: 'MX', name: 'Mexico' },
  { code: 'FM', name: 'Micronesia' },
  { code: 'MD', name: 'Moldova' },
  { code: 'MC', name: 'Monaco' },
  { code: 'MN', name: 'Mongolia' },
  { code: 'ME', name: 'Montenegro' },
  { code: 'MS', name: 'Montserrat' },
  { code: 'MA', name: 'Morocco' },
  { code: 'MZ', name: 'Mozambique' },
  { code: 'MM', name: 'Myanmar' },
  { code: 'NA', name: 'Namibia' },
  { code: 'NR', name: 'Nauru' },
  { code: 'NP', name: 'Nepal' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'NI', name: 'Nicaragua' },
  { code: 'NE', name: 'Niger' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'NO', name: 'Norway' },
  { code: 'OM', name: 'Oman' },
  { code: 'PK', name: 'Pakistan' },
  { code: 'PW', name: 'Palau' },
  { code: 'PA', name: 'Panama' },
  { code: 'PG', name: 'Papua New Guinea' },
  { code: 'PY', name: 'Paraguay' },
  { code: 'PE', name: 'Peru' },
  { code: 'PH', name: 'Philippines' },
  { code: 'PL', name: 'Poland' },
  { code: 'PT', name: 'Portugal' },
  { code: 'PR', name: 'Puerto Rico' },
  { code: 'QA', name: 'Qatar' },
  { code: 'RO', name: 'Romania' },
  { code: 'RU', name: 'Russia' },
  { code: 'RW', name: 'Rwanda' },
  { code: 'KN', name: 'Saint Kitts and Nevis' },
  { code: 'LC', name: 'Saint Lucia' },
  { code: 'VC', name: 'Saint Vincent' },
  { code: 'WS', name: 'Samoa' },
  { code: 'SM', name: 'San Marino' },
  { code: 'ST', name: 'Sao Tome and Principe' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'SN', name: 'Senegal' },
  { code: 'RS', name: 'Serbia' },
  { code: 'SC', name: 'Seychelles' },
  { code: 'SL', name: 'Sierra Leone' },
  { code: 'SG', name: 'Singapore' },
  { code: 'SK', name: 'Slovakia' },
  { code: 'SI', name: 'Slovenia' },
  { code: 'SB', name: 'Solomon Islands' },
  { code: 'SO', name: 'Somalia' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'ES', name: 'Spain' },
  { code: 'LK', name: 'Sri Lanka' },
  { code: 'SD', name: 'Sudan' },
  { code: 'SR', name: 'Suriname' },
  { code: 'SE', name: 'Sweden' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'SY', name: 'Syria' },
  { code: 'TW', name: 'Taiwan' },
  { code: 'TJ', name: 'Tajikistan' },
  { code: 'TZ', name: 'Tanzania' },
  { code: 'TH', name: 'Thailand' },
  { code: 'TL', name: 'Timor-Leste' },
  { code: 'TG', name: 'Togo' },
  { code: 'TO', name: 'Tonga' },
  { code: 'TT', name: 'Trinidad and Tobago' },
  { code: 'TN', name: 'Tunisia' },
  { code: 'TR', name: 'Turkey' },
  { code: 'TM', name: 'Turkmenistan' },
  { code: 'UG', name: 'Uganda' },
  { code: 'UA', name: 'Ukraine' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'UY', name: 'Uruguay' },
  { code: 'UZ', name: 'Uzbekistan' },
  { code: 'VU', name: 'Vanuatu' },
  { code: 'VE', name: 'Venezuela' },
  { code: 'VN', name: 'Vietnam' },
  { code: 'YE', name: 'Yemen' },
  { code: 'ZM', name: 'Zambia' },
  { code: 'ZW', name: 'Zimbabwe' }
];

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
          <div className="page-head-sub">Answer a few questions to calculate your Theliv.</div>
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
                    <label className="input-lbl">Country</label>
                    <select
                      className="input filled"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Country</option>
                      {COUNTRIES.map(c => (
                        <option key={c.code} value={c.code}>
                          {c.name} ({c.code})
                        </option>
                      ))}
                    </select>
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
