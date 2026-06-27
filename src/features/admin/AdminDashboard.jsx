import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import {
  Users, UserPlus, UserX, Shield, TrendingUp, Activity,
  Clock, AlertTriangle, Loader2, Eye, ArrowRight
} from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color, sub }) => (
  <div className="adm-stat-card" style={{ '--card-accent': color }}>
    <div className="adm-stat-top">
      <div className="adm-stat-icon" style={{ background: `${color}18`, color }}>
        <Icon size={20} />
      </div>
      <div className="adm-stat-trend" style={{ color: sub?.startsWith('+') ? '#22c55e' : '#ff4444' }}>
        <TrendingUp size={13} />
        <span>{sub || '—'}</span>
      </div>
    </div>
    <div className="adm-stat-value">{value.toLocaleString()}</div>
    <div className="adm-stat-label">{label}</div>
  </div>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([
          axiosInstance.get('/admin/stats'),
          axiosInstance.get('/admin/users?sort=-createdAt&limit=5'),
        ]);
        if (statsRes.data.success) setStats(statsRes.data.data);
        if (usersRes.data.success) setRecentUsers(usersRes.data.data);
      } catch (err) {
        if (err.response?.status === 401) navigate('/admin/login');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="adm-loading-state">
        <Loader2 size={28} className="adm-spin" />
        <span>Loading dashboard...</span>
      </div>
    );
  }

  if (!stats) return null;

  const cardData = [
    { icon: Users, label: 'Total Users', value: stats.totalUsers, color: '#6366f1', sub: `${stats.recentSignups} this week` },
    { icon: UserPlus, label: 'Founders', value: stats.totalFounders, color: '#4488ff', sub: `${Math.round(stats.totalFounders / (stats.totalUsers || 1) * 100)}% of total` },
    { icon: UserX, label: 'Investors', value: stats.totalInvestors, color: '#22c55e', sub: `${Math.round(stats.totalInvestors / (stats.totalUsers || 1) * 100)}% of total` },
    { icon: Shield, label: 'Admins', value: stats.totalAdmins, color: '#ff4444', sub: 'System administrators' },
    { icon: Activity, label: 'Active Users', value: stats.activeUsers, color: '#22c55e', sub: 'Healthy accounts' },
    { icon: AlertTriangle, label: 'Blacklisted', value: stats.blacklistedUsers, color: '#ff4444', sub: 'Flagged accounts' },
  ];

  const statusBadge = (user) => {
    if (user.blacklistedAt) return { label: 'Blacklisted', cls: 'adm-s-badge-red' };
    if (!user.isActive) return { label: 'Inactive', cls: 'adm-s-badge-dim' };
    return { label: 'Active', cls: 'adm-s-badge-green' };
  };

  const roleBadge = (role) => {
    const map = { admin: 'Red', founder: 'Blue', investor: 'Green' };
    return { label: role, cls: `adm-s-role-${map[role]?.toLowerCase() || 'dim'}` };
  };

  return (
    <div className="adm-dashboard">
      <div className="adm-dash-header">
        <div>
          <h1 className="adm-dash-title">Dashboard Overview</h1>
          <p className="adm-dash-sub">Real-time platform statistics and user activity.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="adm-stats-grid">
        {cardData.map((card, i) => (
          <StatCard key={i} {...card} />
        ))}
      </div>

      {/* Recent Users */}
      <div className="adm-section">
        <div className="adm-section-header">
          <div className="adm-section-title"><Clock size={16} /> Recent Registrations</div>
          <button className="adm-section-link" onClick={() => navigate('/admin/users')}>
            View All <ArrowRight size={14} />
          </button>
        </div>

        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.length === 0 ? (
                <tr><td colSpan={5} className="adm-table-empty">No users yet</td></tr>
              ) : (
                recentUsers.map((user) => {
                  const status = statusBadge(user);
                  const role = roleBadge(user.role);
                  return (
                    <tr key={user._id} className="adm-tr" onClick={() => navigate(`/admin/users/${user._id}`)}>
                      <td>
                        <div className="adm-user-cell">
                          <div className={`adm-s-avatar ${role.cls}`}>{user.name.charAt(0)}</div>
                          <span className="adm-user-name">{user.name}</span>
                        </div>
                      </td>
                      <td><span className="adm-cell-email">{user.email}</span></td>
                      <td><span className={`adm-s-role ${role.cls}`}>{role.label}</span></td>
                      <td><span className={`adm-s-badge ${status.cls}`}>{status.label}</span></td>
                      <td className="adm-cell-date">
                        {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
