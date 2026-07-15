import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import {
  ArrowLeft, Mail, Phone, Calendar, Shield, Ban, Trash2,
  Edit3, X, CheckCircle, Save, Building, Globe,
  MapPin, PoundSterling, Briefcase, Eye, Target, UserCheck, AlertTriangle
} from 'lucide-react';

const AdminUserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [showBlacklistModal, setShowBlacklistModal] = useState(false);
  const [blacklistReason, setBlacklistReason] = useState('');

  const [form, setForm] = useState({ name: '', email: '', phone: '', role: '' });

  useEffect(() => { fetchUser(); }, [id]);

  const fetchUser = async () => {
    setLoading(true); setError('');
    try {
      const { data } = await axiosInstance.get(`/admin/users/${id}`);
      if (data.success) {
        setUserData(data.data.user);
        setProfile(data.data.profile);
        setForm({ name: data.data.user.name || '', email: data.data.user.email || '', phone: data.data.user.phone || '', role: data.data.user.role || '' });
      }
    } catch (err) {
      if (err.response?.status === 401) { navigate('/admin/login'); return; }
      if (err.response?.status === 404) { setError('User not found'); return; }
      setError(err.response?.data?.message || 'Failed to load user');
    } finally { setLoading(false); }
  };

  const handleSave = async () => {
    if (!form.name.trim()) { setError('Name cannot be empty'); return; }
    setSaving(true); setError('');
    try {
      const { data } = await axiosInstance.put(`/admin/users/${id}`, form);
      if (data.success) {
        setUserData(prev => ({ ...prev, ...data.data }));
        setEditMode(false);
        setSuccessMsg('User updated successfully');
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err) { setError(err.response?.data?.message || 'Failed to update'); }
    finally { setSaving(false); }
  };

  const handleAction = async (action) => {
    setActionLoading(action); setError(''); setSuccessMsg('');
    try {
      if (action === 'delete') await axiosInstance.delete(`/admin/users/${id}`);
      else if (action === 'blacklist') await axiosInstance.patch(`/admin/users/${id}/blacklist`, { reason: blacklistReason || undefined });
      else if (action === 'reactivate') await axiosInstance.put(`/admin/users/${id}`, { isActive: true });
      fetchUser();
      setShowBlacklistModal(false);
      setBlacklistReason('');
      setSuccessMsg(action === 'delete' ? 'User deactivated' : action === 'reactivate' ? 'User reactivated' : 'Blacklist status updated');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) { setError(err.response?.data?.message || 'Action failed'); }
    finally { setActionLoading(null); }
  };

  const InfoRow = ({ icon: Icon, label, value, editField }) => (
    <div className="adm-info-row">
      <div className="adm-info-icon"><Icon size={15} /></div>
      <div className="adm-info-body">
        <span className="adm-info-label">{label}</span>
        {editMode && editField ? (
          editField === 'role' ? (
            <select className="adm-edit-select" value={form.role} onChange={(e) => setForm(f => ({ ...f, role: e.target.value }))}>
              <option value="founder">Founder</option>
              <option value="investor">Investor</option>
              <option value="admin">Admin</option>
            </select>
          ) : (
            <input className="adm-edit-input" value={form[editField]} onChange={(e) => setForm(f => ({ ...f, [editField]: e.target.value }))} />
          )
        ) : (
          <span className="adm-info-val">{value || '—'}</span>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="adm-skel-detail">
        <div className="adm-skeleton adm-skel-back" />
        <div className="adm-skel-hero">
          <div className="adm-skeleton adm-skel-hero-avatar" />
          <div className="adm-skel-hero-info">
            <div className="adm-skeleton adm-skel-hero-name" />
            <div className="adm-skel-hero-meta">
              <div className="adm-skeleton adm-skel-hero-badge" />
              <div className="adm-skeleton" style={{ width: 60, height: 22, borderRadius: 20 }} />
            </div>
          </div>
          <div className="adm-skel-hero-actions">
            <div className="adm-skeleton adm-skel-hero-btn" />
            <div className="adm-skeleton adm-skel-hero-btn" />
            <div className="adm-skeleton adm-skel-hero-btn" />
          </div>
        </div>
        <div className="adm-skel-cards">
          <div className="adm-skel-card">
            <div className="adm-skeleton adm-skel-card-title" />
            {[...Array(4)].map((_, i) => (
              <div className="adm-skel-card-row" key={i}>
                <div className="adm-skeleton adm-skel-card-icon" />
                <div className="adm-skeleton adm-skel-card-label" />
                <div className="adm-skeleton adm-skel-card-value" />
              </div>
            ))}
          </div>
          <div className="adm-skel-card">
            <div className="adm-skeleton adm-skel-card-title" />
            {[...Array(6)].map((_, i) => (
              <div className="adm-skel-card-row" key={i}>
                <div className="adm-skeleton adm-skel-card-icon" />
                <div className="adm-skeleton adm-skel-card-label" />
                <div className="adm-skeleton adm-skel-card-value" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error && !userData) {
    return (
      <div className="adm-empty-state" style={{ minHeight: 400 }}>
        <AlertTriangle size={40} /><h3>{error}</h3>
        <button className="adm-btn-ghost" onClick={() => navigate('/admin/users')} style={{ marginTop: 12 }}>← Back to Users</button>
      </div>
    );
  }

  if (!userData) return null;

  const statusInfo = userData.blacklistedAt
    ? { text: 'Blacklisted', cls: 'adm-s-badge-red' }
    : userData.isActive ? { text: 'Active', cls: 'adm-s-badge-green' } : { text: 'Inactive', cls: 'adm-s-badge-dim' };

  const roleColors = { admin: '#ff4444', founder: '#4488ff', investor: '#22c55e' };
  const accent = roleColors[userData.role] || '#6366f1';

  return (
    <div className="adm-detail">
      {/* Back */}
      <button className="adm-back-btn" onClick={() => navigate('/admin/users')}>
        <ArrowLeft size={15} /> Back to Users
      </button>

      {/* Messages */}
      {successMsg && <div className="adm-success"><CheckCircle size={15} /> {successMsg}</div>}
      {error && <div className="adm-error">{error} <button onClick={() => setError('')} style={{ marginLeft: 8, background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}><X size={13} /></button></div>}

      {/* Hero */}
      <div className="adm-detail-hero">
        <div className="adm-detail-avatar" style={{ background: `${accent}18`, color: accent }}>
          {userData.name.charAt(0)}
        </div>
        <div className="adm-detail-info">
          {editMode ? (
            <input className="adm-detail-name-input" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Full name" />
          ) : (
            <h1 className="adm-detail-name">{userData.name}</h1>
          )}
          <div className="adm-detail-meta">
            <span className="adm-s-role" style={{ background: `${accent}18`, color: accent, border: `1px solid ${accent}44` }}>{userData.role}</span>
            <span className={`adm-s-badge ${statusInfo.cls}`}>{statusInfo.text}</span>
            {userData.blacklistedAt && <span className="adm-detail-flag"><Ban size={12} /> Blacklisted {new Date(userData.blacklistedAt).toLocaleDateString()}{userData.blacklistReason ? ` — ${userData.blacklistReason}` : ''}</span>}
          </div>
        </div>
        <div className="adm-detail-actions">
          {editMode ? (
            <>
              <button className="adm-btn-ghost" onClick={() => { setEditMode(false); setForm({ name: userData.name, email: userData.email, phone: userData.phone || '', role: userData.role }); }}><X size={14} /> Cancel</button>
              <button className="adm-btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : <><Save size={14} /> Save</>}</button>
            </>
          ) : (
            <>
              <button className="adm-btn-primary" onClick={() => setEditMode(true)}><Edit3 size={14} /> Edit</button>
              <button className={`adm-btn-${userData.blacklistedAt ? 'ghost' : 'warn'}`} onClick={() => { setBlacklistReason(''); setShowBlacklistModal(true); }} disabled={actionLoading === 'blacklist'}>
                <Ban size={14} /> {userData.blacklistedAt ? 'Unblacklist' : 'Blacklist'}
              </button>
              {userData.isActive ? (
                <button className="adm-btn-danger" onClick={() => handleAction('delete')} disabled={actionLoading === 'delete'}>
                  <Trash2 size={14} /> Deactivate
                </button>
              ) : (
                <button className="adm-btn-primary" onClick={() => handleAction('reactivate')} disabled={actionLoading === 'reactivate'}>
                  <UserCheck size={14} /> Reactivate
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Detail Grid */}
      <div className="adm-detail-grid">
        <div className="adm-card">
          <div className="adm-card-title"><Shield size={15} /> Account Information</div>
          <div className="adm-card-body">
            <InfoRow icon={Mail} label="Email" value={userData.email} editField="email" />
            <InfoRow icon={Phone} label="Phone" value={userData.phone} editField="phone" />
            <InfoRow icon={Calendar} label="Joined" value={new Date(userData.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} />
            <InfoRow icon={Shield} label="Role" value={userData.role} editField="role" />
          </div>
        </div>

        {profile && (
          <div className="adm-card">
            <div className="adm-card-title">
              {userData.role === 'founder' ? <Building size={15} /> : <Briefcase size={15} />}
              {userData.role === 'founder' ? ' Founder Profile' : ' Investor Profile'}
            </div>
            <div className="adm-card-body">
              {userData.role === 'investor' && (
                <>
                  <InfoRow icon={Building} label="Company" value={profile.company} />
                  <InfoRow icon={Target} label="Focus" value={profile.investmentFocus?.join(', ')} />
                  <InfoRow icon={PoundSterling} label="Stage" value={profile.fundingStage} />
                  <InfoRow icon={MapPin} label="Location" value={profile.location} />
                  <InfoRow icon={Globe} label="Website" value={profile.website} />
                  <InfoRow icon={Briefcase} label="Portfolio" value={profile.portfolioSize != null ? `${profile.portfolioSize} companies` : null} />
                  <InfoRow icon={Eye} label="Profile Views" value={profile.profileViews != null ? profile.profileViews.toString() : null} />
                </>
              )}
              {userData.role === 'founder' && (
                <>
                  <InfoRow icon={Building} label="Company" value={profile.companyName} />
                  <InfoRow icon={Target} label="Sector" value={profile.sector} />
                  <InfoRow icon={PoundSterling} label="Stage" value={profile.stage} />
                  <InfoRow icon={PoundSterling} label="Raising" value={profile.raisingAmount ? `£${(profile.raisingAmount).toLocaleString()}` : null} />
                  <InfoRow icon={MapPin} label="Location" value={profile.city ? `${profile.city}, ${profile.country}` : null} />
                  <InfoRow icon={Eye} label="Profile Views" value={profile.profileViews != null ? profile.profileViews.toString() : null} />
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Blacklist Confirm Modal */}
      {showBlacklistModal && (
        <div className="adm-overlay" onClick={() => { setShowBlacklistModal(false); setBlacklistReason(''); }}>
          <div className="adm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="adm-modal-icon"><Ban size={28} /></div>
            <h3 className="adm-modal-title">
              {userData.blacklistedAt ? 'Unblacklist User' : 'Blacklist User'}
            </h3>
            <p className="adm-modal-text">
              {userData.blacklistedAt
                ? 'Remove this user from the blacklist and restore normal access.'
                : 'Block this user across the platform.'}
            </p>

            {!userData.blacklistedAt && (
              <div className="adm-modal-field">
                <label className="adm-modal-label">Reason <span className="adm-modal-opt">(optional)</span></label>
                <textarea
                  className="adm-modal-textarea"
                  placeholder="e.g. Policy violation, suspicious activity..."
                  value={blacklistReason}
                  onChange={(e) => setBlacklistReason(e.target.value)}
                  rows={3}
                />
              </div>
            )}

            <div className="adm-modal-actions">
              <button
                className="adm-btn-ghost"
                onClick={() => { setShowBlacklistModal(false); setBlacklistReason(''); }}
              >Cancel</button>
              <button
                className={`adm-btn-action ${userData.blacklistedAt ? 'adm-btn-primary' : 'adm-btn-warn'}`}
                onClick={() => handleAction('blacklist')}
                disabled={actionLoading === 'blacklist'}
              >
                {actionLoading === 'blacklist' ? 'Processing...' : userData.blacklistedAt ? 'Yes, Unblacklist' : 'Yes, Blacklist'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserDetail;
