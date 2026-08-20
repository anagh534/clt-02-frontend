import { useState, useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../store/authStore';
import axiosInstance from '../../api/axiosInstance';
import { useSavedStartups } from '../../hooks/useInvestor';
import { Copy, Check, Share2, ExternalLink, MapPin, Globe, Link2, AtSign, Briefcase, TrendingUp, PoundSterling, Lock, AlertCircle, Edit2, X, Save } from 'lucide-react';
import Spinner from '../../components/ui/Spinner';

const STAGE_OPTIONS = [
  { value: 'preseed', label: 'Pre-Seed' },
  { value: 'seed', label: 'Seed' },
  { value: 'seriesa', label: 'Series A' },
  { value: 'seriesb', label: 'Series B' },
  { value: 'seriesc', label: 'Series C' },
  { value: 'growth', label: 'Growth' }
];

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

const InvestorProfile = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [copied, setCopied] = useState(false);
  const formHeaderRef = useRef(null);

  const { data: profileData, isLoading } = useQuery({
    queryKey: ['investorProfile', user?.id],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/investors/me');
      return data.data?.investor || null;
    },
    enabled: !!user?.id,
  });

  const investor = profileData;
  const profileUrl = investor?.slug ? `${window.location.origin}/profile/investor/${investor.slug}` : '';

  const { data: savedStartupsData } = useSavedStartups();
  const savedStartups = Array.isArray(savedStartupsData) ? savedStartupsData : [];

  const [editMode, setEditMode] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formData, setFormData] = useState({
    company: '',
    title: '',
    investmentFocus: '',
    fundingStage: [],
    location: '',
    country: '',
    city: '',
    bio: '',
    website: '',
    linkedin: '',
    twitter: '',
    checkSizeMin: '',
    checkSizeMax: '',
    portfolioSize: ''
  });

  const saveProfile = useMutation({
    mutationFn: async (profileData) => {
      setFormError(null);
      const { data } = await axiosInstance.post('/investors', profileData);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investorProfile', user?.id] });
      setEditMode(false);
    },
    onError: (err) => {
      const msg = err?.response?.data?.message || err?.message || 'Failed to save profile. Please try again.';
      setFormError(msg);
      formHeaderRef.current?.scrollIntoView({ behavior: 'smooth' });
      console.error('Profile save error:', err);
    }
  });

  const handleFormChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleStageCheckboxChange = (stageValue) => (e) => {
    const isChecked = e.target.checked;
    setFormData(prev => {
      const currentStages = Array.isArray(prev.fundingStage) ? prev.fundingStage : [];
      const nextStages = isChecked
        ? [...currentStages, stageValue]
        : currentStages.filter(s => s !== stageValue);
      return {
        ...prev,
        fundingStage: nextStages
      };
    });
  };

  const startEditing = () => {
    // Populate form with existing data or defaults
    if (investor) {
      setFormData({
        company: investor.company || '',
        title: investor.title || '',
        investmentFocus: Array.isArray(investor.focus) ? investor.focus.join(', ') : (investor.investmentFocus || []).join(', '),
        fundingStage: Array.isArray(investor.fundingStage)
          ? investor.fundingStage
          : (investor.fundingStage ? [investor.fundingStage] : (Array.isArray(investor.stage) ? investor.stage : [])),
        location: investor.location || '',
        country: investor.country || '',
        city: investor.city || '',
        bio: investor.bio || '',
        website: investor.website || '',
        linkedin: investor.linkedin || '',
        twitter: investor.twitter || '',
        checkSizeMin: investor.checkSizeMin || investor.checkSize?.split('–')[0]?.trim() || '',
        checkSizeMax: investor.checkSizeMax || investor.checkSize?.split('–')[1]?.trim() || '',
        portfolioSize: investor.portfolioSize || ''
      });
    }
    setEditMode(true);
    setFormError(null);
  };

  const cancelEditing = () => {
    setEditMode(false);
    setFormError(null);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();

    if (!user?.name) {
      setFormError('Your name is required. Please update your account settings.');
      formHeaderRef.current?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    const minVal = formData.checkSizeMin ? Number(formData.checkSizeMin) : undefined;
    const maxVal = formData.checkSizeMax ? Number(formData.checkSizeMax) : undefined;

    if (minVal !== undefined && maxVal !== undefined && maxVal < minVal) {
      setFormError('Maximum check size cannot be less than minimum check size.');
      formHeaderRef.current?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    
    // Parse focus as array
    const focusArray = formData.investmentFocus
      ? formData.investmentFocus.split(',').map(s => s.trim()).filter(Boolean)
      : [];

    const payload = {
      name: user.name,
      company: formData.company,
      title: formData.title,
      investmentFocus: focusArray,
      fundingStage: formData.fundingStage,
      location: formData.location,
      country: formData.country,
      city: formData.city,
      bio: formData.bio,
      website: formData.website,
      linkedin: formData.linkedin,
      twitter: formData.twitter,
      checkSizeMin: formData.checkSizeMin ? Number(formData.checkSizeMin) : undefined,
      checkSizeMax: formData.checkSizeMax ? Number(formData.checkSizeMax) : undefined,
      portfolioSize: formData.portfolioSize ? Number(formData.portfolioSize) : undefined
    };

    saveProfile.mutate(payload);
  };

  const [visibilityError, setVisibilityError] = useState(null);

  const toggleVisibility = useMutation({
    mutationFn: async (isPublic) => {
      setVisibilityError(null);
      const { data } = await axiosInstance.patch('/investors/me/visibility', { isPublic });
      return data.data?.investor;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investorProfile', user?.id] });
    },
    onError: (err) => {
      const msg = err?.response?.data?.message || err?.message || 'Failed to update visibility. Please try again.';
      setVisibilityError(msg);
      console.error('Visibility update error:', err);
    }
  });

  const handleCopy = () => {
    if (!profileUrl) return;
    navigator.clipboard.writeText(profileUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleShare = async () => {
    if (!profileUrl) return;
    const shareText = `Check out ${user?.name}'s investor profile on Theliv.`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${user?.name} — Investor Profile`,
          text: shareText,
          url: profileUrl,
        });
      } catch { /* User cancelled share dialog */ }
    } else {
      handleCopy();
    }
  };

  const openShare = (url) => {
    if (!profileUrl) return;
    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=700');
  };

  if (isLoading) return <Spinner text="Loading profile..." />;

  return (
    <>
      <div className="page-head">
        <div>
          <div className="page-head-title">My Profile</div>
          <div className="page-head-sub">Manage your investor profile visibility and share link</div>
        </div>
        <div className="page-head-actions">
          {!editMode && (
            <>
              {!investor ? (
                <button className="prof-share-btn" onClick={startEditing}>
                  <Edit2 size={16} />
                  Create Profile
                </button>
              ) : (
                <>
                  <button
                    className="prof-share-btn"
                    onClick={() => toggleVisibility.mutate(!investor.isPublic)}
                    disabled={toggleVisibility.isPending}
                  >
                    <Lock size={16} />
                    {toggleVisibility.isPending ? 'Updating...' : (investor?.isPublic ? 'Make Private' : 'Make Public')}
                  </button>
                  <button className="prof-share-btn" onClick={startEditing}>
                    <Edit2 size={16} />
                    Edit Profile
                  </button>
                  {investor?.isPublic && profileUrl && (
                    <>
                      <button className="prof-share-btn" onClick={handleShare}>
                        <Share2 size={16} />
                        Share
                      </button>
                      <button className="prof-copy-btn" onClick={handleCopy}>
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                        {copied ? 'Copied!' : 'Copy Link'}
                      </button>
                    </>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Profile URL bar */}
      {editMode ? (
        <div ref={formHeaderRef} className="prof-card" style={{ marginBottom: '20px' }}>
          <div className="prof-section-h" style={{ marginBottom: '20px' }}>
            {investor ? 'Edit Profile' : 'Create Profile'}
            <button className="prof-url-copy" style={{ marginLeft: 'auto' }} onClick={cancelEditing}>
              <X size={16} /> Cancel
            </button>
          </div>

          {formError && (
            <div className="prof-error-banner" style={{ marginBottom: '16px' }}>
              <AlertCircle size={16} />
              {formError}
            </div>
          )}

          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Row 1 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label className="input-lbl">Company / Firm</label>
                <input className="input" value={formData.company} onChange={handleFormChange('company')} placeholder="e.g. Acme Ventures" />
              </div>
              <div>
                <label className="input-lbl">Title</label>
                <input className="input" value={formData.title} onChange={handleFormChange('title')} placeholder="e.g. Managing Partner" />
              </div>
            </div>

            {/* Row 2 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label className="input-lbl">City</label>
                <input className="input" value={formData.city} onChange={handleFormChange('city')} placeholder="e.g. San Francisco" />
              </div>
              <div>
                <label className="input-lbl">Country</label>
                <select className="input" value={formData.country} onChange={handleFormChange('country')}>
                  <option value="">Select country...</option>
                  {COUNTRIES.map(c => (
                    <option key={c.code} value={c.code}>{c.name} ({c.code})</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="input-lbl">Location</label>
              <input className="input" value={formData.location} onChange={handleFormChange('location')} placeholder="e.g. San Francisco, CA" />
            </div>

            <div>
              <label className="input-lbl">Investment Focus (comma-separated)</label>
              <input className="input" value={formData.investmentFocus} onChange={handleFormChange('investmentFocus')} placeholder="e.g. AI, Fintech, Climate" />
            </div>

            {/* Row 3 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label className="input-lbl">Funding Stages</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginTop: '6px' }}>
                  {STAGE_OPTIONS.map(opt => {
                    const isChecked = Array.isArray(formData.fundingStage) && formData.fundingStage.includes(opt.value);
                    return (
                      <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer', color: 'var(--ink-dim)' }}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={handleStageCheckboxChange(opt.value)}
                          style={{ cursor: 'pointer' }}
                        />
                        {opt.label}
                      </label>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="input-lbl">Portfolio Size</label>
                <input className="input" type="number" value={formData.portfolioSize} onChange={handleFormChange('portfolioSize')} placeholder="e.g. 25" />
              </div>
            </div>

            {/* Row 4 - Check Size */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label className="input-lbl">Min Check Size (£)</label>
                <input className="input" type="number" value={formData.checkSizeMin} onChange={handleFormChange('checkSizeMin')} placeholder="e.g. 250000" />
              </div>
              <div>
                <label className="input-lbl">Max Check Size (£)</label>
                <input className="input" type="number" value={formData.checkSizeMax} onChange={handleFormChange('checkSizeMax')} placeholder="e.g. 2000000" />
              </div>
            </div>

            <div>
              <label className="input-lbl">Bio</label>
              <textarea className="input" rows={4} value={formData.bio} onChange={handleFormChange('bio')} placeholder="Tell investors about your background and investment thesis…" />
            </div>

            <div>
              <label className="input-lbl">Website</label>
              <input className="input" value={formData.website} onChange={handleFormChange('website')} placeholder="https://" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label className="input-lbl">LinkedIn</label>
                <input className="input" value={formData.linkedin} onChange={handleFormChange('linkedin')} placeholder="https://linkedin.com/in/" />
              </div>
              <div>
                <label className="input-lbl">Twitter / X</label>
                <input className="input" value={formData.twitter} onChange={handleFormChange('twitter')} placeholder="https://x.com/" />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button type="button" className="btn btn-ghost" onClick={cancelEditing}>
                Cancel
              </button>
              <button type="submit" className="btn btn-accent" disabled={saveProfile.isPending}>
                <Save size={16} />
                {saveProfile.isPending ? 'Saving...' : (investor ? 'Update Profile' : 'Create Profile')}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          {investor?.isPublic && profileUrl ? (
            <div className="prof-url-bar">
              <span className="prof-url-label">Your public profile link</span>
              <div className="prof-url-row">
                <span className="prof-url-text">{profileUrl}</span>
                <button className="prof-url-copy" onClick={handleCopy}>
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <a className="prof-url-open" href={profileUrl} target="_blank" rel="noreferrer">
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          ) : (
            <div className="prof-url-bar">
              <span className="prof-url-label">Your profile is private</span>
              <div className="prof-url-row">
                <span className="prof-url-text">
                  {investor
                    ? 'Make it public to generate a shareable link and social share options.'
                    : 'Fill in your details to get started.'
                  }
                </span>
                {investor && (
                  <button className="prof-url-copy" onClick={() => toggleVisibility.mutate(true)} disabled={toggleVisibility.isPending}>
                    {toggleVisibility.isPending ? 'Publishing...' : 'Publish'}
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="prof-card" style={{ marginBottom: '20px' }}>
            <div className="prof-section-h">Visibility</div>
            <div className="prof-stat-list">
              <div className="prof-stat-item">
                <Globe size={16} className="prof-stat-ic" />
                <div>
                  <div className="prof-stat-lbl">Profile status</div>
                  <div className="prof-stat-val">{investor?.isPublic ? 'Public' : 'Private'}</div>
                </div>
              </div>
            </div>
            {visibilityError && (
              <div className="prof-error-banner">
                <AlertCircle size={16} />
                {visibilityError}
              </div>
            )}
            <p className="prof-desc" style={{ marginTop: '16px' }}>
              {investor?.isPublic
                ? 'Your profile can be viewed and shared publicly.'
                : 'Keep your profile private until you are ready to share it publicly.'}
            </p>
            {!investor && (
              <p className="prof-desc" style={{ marginTop: '12px' }}>
                Click "Create Profile" above to fill in your details.
              </p>
            )}
            {investor && toggleVisibility.isPending && (
              <p className="prof-desc" style={{ marginTop: '12px', color: 'var(--accent)' }}>
                Updating visibility...
              </p>
            )}
            {investor?.isPublic && profileUrl && (
              <div className="prof-links" style={{ marginTop: '16px' }}>
                <a className="prof-url-copy" href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${user?.name}'s investor profile on Theliv.`)}&url=${encodeURIComponent(profileUrl)}`} onClick={(e) => { e.preventDefault(); openShare(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${user?.name}'s investor profile on Theliv.`)}&url=${encodeURIComponent(profileUrl)}`); }}>
                  X
                </a>
                <a className="prof-url-copy" href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`} onClick={(e) => { e.preventDefault(); openShare(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`); }}>
                  LinkedIn
                </a>
                <a className="prof-url-copy" href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out ${user?.name}'s investor profile on Theliv. ${profileUrl}`)}`} onClick={(e) => { e.preventDefault(); openShare(`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out ${user?.name}'s investor profile on Theliv. ${profileUrl}`)}`); }}>
                  WhatsApp
                </a>
              </div>
            )}
          </div>

          <div className="prof-layout">
            {/* Left column */}
            <div className="prof-left">
              {/* Identity card */}
              <div className="prof-card">
                <div className="prof-avatar-wrap">
                  <div className="prof-avatar prof-avatar-blue">{user?.name?.charAt(0)}</div>
                  <div className="prof-verified">✓</div>
                </div>
                <div className="prof-name">{user?.name}</div>
                <div className="prof-title">{investor?.title || 'Investor'}</div>
                {investor?.company && (
                  <div className="prof-company">{investor.company}</div>
                )}
                {investor?.location && (
                  <div className="prof-meta-row">
                    <MapPin size={14} />
                    {investor.location}
                  </div>
                )}

                {investor?.bio && (
                  <p className="prof-bio">{investor.bio}</p>
                )}

                <div className="prof-links">
                  {investor?.website && (
                    <a href={investor.website} target="_blank" rel="noreferrer" className="prof-link">
                      <Globe size={15} /> Website
                    </a>
                  )}
                  {investor?.linkedin && (
                    <a href={investor.linkedin} target="_blank" rel="noreferrer" className="prof-link">
                      <Link2 size={15} /> LinkedIn
                    </a>
                  )}
                  {investor?.twitter && (
                    <a href={investor.twitter} target="_blank" rel="noreferrer" className="prof-link">
                      <AtSign size={15} /> Twitter
                    </a>
                  )}
                </div>
              </div>

              {/* Investment thesis snapshot */}
              <div className="prof-card">
                <div className="prof-section-h">Investment Focus</div>
                <div className="prof-stat-list">
                  <div className="prof-stat-item">
                    <PoundSterling size={16} className="prof-stat-ic" />
                    <div>
                      <div className="prof-stat-lbl">Check Size</div>
                      <div className="prof-stat-val">
                        {(() => {
                          const formatter = new Intl.NumberFormat('en-GB', {
                            style: 'currency',
                            currency: 'GBP',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                          });
                          const min = investor?.checkSizeMin;
                          const max = investor?.checkSizeMax;
                          if (min != null && max != null) {
                            return `${formatter.format(min)} – ${formatter.format(max)}`;
                          }
                          if (min != null) {
                            return `From ${formatter.format(min)}`;
                          }
                          if (max != null) {
                            return `Up to ${formatter.format(max)}`;
                          }
                          return investor?.checkSize || '£250k – £2M';
                        })()}
                      </div>
                    </div>
                  </div>
                  <div className="prof-stat-item">
                    <TrendingUp size={16} className="prof-stat-ic" />
                    <div>
                      <div className="prof-stat-lbl">Stage</div>
                      <div className="prof-stat-val">
                        {(() => {
                          const stages = Array.isArray(investor?.fundingStage) && investor.fundingStage.length > 0
                            ? investor.fundingStage
                            : (Array.isArray(investor?.stage) && investor.stage.length > 0 ? investor.stage : ['Seed', 'Series A']);
                          
                          return stages.map(s => {
                            const map = {
                              preseed: 'Pre-Seed',
                              seed: 'Seed',
                              seriesa: 'Series A',
                              seriesb: 'Series B',
                              seriesc: 'Series C',
                              growth: 'Growth'
                            };
                            return map[s.toLowerCase()] || s;
                          }).join(', ');
                        })()}
                      </div>
                    </div>
                  </div>
                  <div className="prof-stat-item">
                    <Briefcase size={16} className="prof-stat-ic" />
                    <div>
                      <div className="prof-stat-lbl">Portfolio Companies</div>
                      <div className="prof-stat-val">{investor?.portfolioSize != null ? investor.portfolioSize : savedStartups.length} companies</div>
                    </div>
                  </div>
                </div>

                {investor?.focus?.length > 0 && (
                  <>
                    <div className="prof-stat-lbl" style={{ marginTop: '20px', marginBottom: '10px' }}>Sectors</div>
                    <div className="prof-tags">
                      {investor.focus.map(f => (
                        <span key={f} className="prof-tag prof-tag-accent">{f}</span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Right column */}
            <div className="prof-right">
              {/* Activity stats */}
              <div className="prof-stats-row">
                <div className="prof-stat-card">
                  <div className="prof-stat-card-val">{savedStartups.length}</div>
                  <div className="prof-stat-card-lbl">Startups Saved</div>
                </div>
                <div className="prof-stat-card">
                  <div className="prof-stat-card-val">{investor?.portfolio || 42}</div>
                  <div className="prof-stat-card-lbl">Portfolio Size</div>
                </div>
                <div className="prof-stat-card">
                  <div className="prof-stat-card-val">3</div>
                  <div className="prof-stat-card-lbl">Active Reviews</div>
                </div>
              </div>

              {/* Saved / Watching */}
              <div className="prof-card">
                <div className="prof-section-h" style={{ marginBottom: '20px' }}>
                  Watching
                  <span className="prof-count">{savedStartups.length}</span>
                </div>
                {savedStartups.length === 0 ? (
                  <p style={{ color: 'var(--ink-dim)', fontSize: '14px' }}>No startups saved yet. Browse the deal feed to find opportunities.</p>
                ) : (
                  <div className="prof-watch-list">
                    {savedStartups.map(s => {
                      const id = s.id || s._id;
                      const name = s.name || s.companyName || 'Startup';
                      const industry = s.industry || s.sector || '—';
                      const stage = s.stage || '—';
                      const score = s.score ?? s.latestScore?.total ?? '—';
                      return (
                        <div key={id} className="prof-watch-row">
                          <div className="startup-logo" style={{ width: '44px', height: '44px', fontSize: '18px', borderRadius: '10px', flexShrink: 0 }}>
                            {name.charAt(0)}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div className="prof-watch-name">{name}</div>
                            <div className="prof-watch-meta">{industry} · {stage}</div>
                          </div>
                          <div className="prof-watch-score">{score}</div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Focus areas detail */}
              <div className="prof-card">
                <div className="prof-section-h">About My Thesis</div>
                <p className="prof-desc">
                  {investor?.bio || 'Investment thesis not yet provided.'}
                </p>
                <div className="prof-tags" style={{ marginTop: '16px' }}>
                  {(investor?.stage || ['Seed', 'Series A']).map(s => (
                    <span key={s} className="prof-tag">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default InvestorProfile;
