import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import {
  Search, Users, Trash2, Ban, MoreHorizontal, ChevronLeft, ChevronRight,
  Loader2, UserCheck, SlidersHorizontal, X, CheckSquare, Square, AlertTriangle
} from 'lucide-react';

const statusBadge = (user) => {
  if (user.blacklistedAt) return { label: 'Blacklisted', cls: 'adm-s-badge-red' };
  if (!user.isActive) return { label: 'Inactive', cls: 'adm-s-badge-dim' };
  return { label: 'Active', cls: 'adm-s-badge-green' };
};

const roleBadge = (role) => {
  const map = { admin: 'Red', founder: 'Blue', investor: 'Green' };
  return { label: role, cls: `adm-s-role-${map[role]?.toLowerCase() || 'dim'}` };
};

const AdminUsers = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [roleFilter, setRoleFilter] = useState(searchParams.get('role') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || '-createdAt');
  const [page, setPage] = useState(parseInt(searchParams.get('page'), 10) || 1);

  // Selection state
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkConfirm, setBulkConfirm] = useState(null); // 'delete' | 'activate' | null

  // Sync local state from URL searchParams when they change externally
  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setRoleFilter(searchParams.get('role') || '');
    setStatusFilter(searchParams.get('status') || '');
    setSort(searchParams.get('sort') || '-createdAt');
    setPage(parseInt(searchParams.get('page'), 10) || 1);
  }, [searchParams]);

  const [confirmId, setConfirmId] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [blacklistReason, setBlacklistReason] = useState('');

  // Clear selection when page changes or filters change
  useEffect(() => { setSelectedIds([]); }, [page, roleFilter, statusFilter, search]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (roleFilter) params.set('role', roleFilter);
      if (statusFilter) params.set('status', statusFilter);
      if (sort) params.set('sort', sort);
      params.set('page', page);
      const { data } = await axiosInstance.get(`/admin/users?${params}`);
      if (data.success) { setUsers(data.data); setPagination(data.pagination); }
    } catch (err) {
      if (err.response?.status === 401) { navigate('/admin/login'); return; }
      setError(err.response?.data?.message || 'Failed to load users');
    } finally { setLoading(false); }
  }, [search, roleFilter, statusFilter, sort, page, navigate]);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchUsers]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (roleFilter) params.set('role', roleFilter);
    if (statusFilter) params.set('status', statusFilter);
    if (sort) params.set('sort', sort);
    if (page > 1) params.set('page', page);
    setSearchParams(params, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, roleFilter, statusFilter, sort, page]);

  // ── Selection handlers ────────────────────────────────────────
  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === users.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(users.map((u) => u._id));
    }
  };

  const clearSelection = () => setSelectedIds([]);

  // ── Bulk action ──────────────────────────────────────────────
  const handleBulkAction = async () => {
    if (!bulkConfirm || selectedIds.length === 0) return;
    setBulkLoading(true);
    setError('');
    try {
      const { data } = await axiosInstance.post('/admin/users/bulk-action', {
        action: bulkConfirm,
        userIds: selectedIds,
      });
      if (data.success) {
        setBulkConfirm(null);
        setSelectedIds([]);
        fetchUsers();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Bulk action failed');
    } finally {
      setBulkLoading(false);
    }
  };

  // ── Single action ────────────────────────────────────────────
  const handleAction = async (userId, action) => {
    setActionLoading(userId);
    try {
      if (action === 'delete') await axiosInstance.delete(`/admin/users/${userId}`);
      else if (action === 'blacklist') await axiosInstance.patch(`/admin/users/${userId}/blacklist`, { reason: blacklistReason || undefined });
      else if (action === 'reactivate') await axiosInstance.put(`/admin/users/${userId}`, { isActive: true });
      setConfirmId(null); setConfirmAction(null); setBlacklistReason('');
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Action failed');
    } finally { setActionLoading(null); }
  };

  const openConfirm = (id, action) => {
    setConfirmId(id);
    setConfirmAction(action);
    setBlacklistReason('');
  };

  const hasActiveFilters = roleFilter || statusFilter || search;

  // ── Helpers ──────────────────────────────────────────────────
  const handleSearch = (e) => { e.preventDefault(); setPage(1); };
  const handleFilterChange = (key, value) => {
    if (key === 'role') setRoleFilter(value);
    if (key === 'status') setStatusFilter(value);
    if (key === 'sort') setSort(value);
    setPage(1);
  };
  const clearFilters = () => {
    setSearch(''); setRoleFilter(''); setStatusFilter(''); setSort('-createdAt'); setPage(1);
  };

  const allSelected = users.length > 0 && selectedIds.length === users.length;
  const someSelected = selectedIds.length > 0;

  return (
    <div className="adm-users-page">
      <div className="adm-section-header">
        <div>
          <h1 className="adm-section-title-lg">Users Management</h1>
          <p className="adm-section-sub">{pagination ? `${pagination.total} total users` : ''}</p>
        </div>
        <button className="adm-filter-toggle" onClick={() => setShowFilters(!showFilters)}>
          <SlidersHorizontal size={15} /> Filters
        </button>
      </div>

      {/* Search & Filters */}
      <div className="adm-search-bar">
        <form onSubmit={handleSearch} className="adm-search-form">
          <Search size={16} className="adm-search-ic" />
          <input
            type="text" className="adm-search-input"
            placeholder="Search by name or email..."
            value={search} onChange={(e) => setSearch(e.target.value)}
          />
          {search && <button type="button" className="adm-search-clear" onClick={() => { setSearch(''); setPage(1); }}><X size={14} /></button>}
        </form>

        {showFilters && (
          <div className="adm-filter-group">
            <select className="adm-select" value={statusFilter} onChange={(e) => handleFilterChange('status', e.target.value)}>
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="blacklisted">Blacklisted</option>
              <option value="inactive">Inactive</option>
            </select>
            <select className="adm-select" value={sort} onChange={(e) => handleFilterChange('sort', e.target.value)}>
              <option value="-createdAt">Newest</option>
              <option value="createdAt">Oldest</option>
              <option value="name">A-Z</option>
              <option value="-name">Z-A</option>
            </select>
            {hasActiveFilters && (
              <button className="adm-clear-btn" onClick={clearFilters}>Clear</button>
            )}
          </div>
        )}
      </div>

      {error && <div className="adm-error">{error}</div>}

      {/* Bulk Action Bar */}
      {someSelected && (
        <div className="adm-bulk-bar">
          <div className="adm-bulk-info">
            <CheckSquare size={16} />
            <span>{selectedIds.length} user{selectedIds.length !== 1 ? 's' : ''} selected</span>
            <button className="adm-bulk-clear" onClick={clearSelection}>Clear selection</button>
          </div>
          <div className="adm-bulk-actions">
            <button
              className="adm-btn-ghost adm-bulk-btn"
              onClick={() => setBulkConfirm('delete')}
              disabled={bulkLoading}
            >
              <Trash2 size={14} /> Deactivate All
            </button>
            <button
              className="adm-btn-ghost adm-bulk-btn"
              onClick={() => setBulkConfirm('activate')}
              disabled={bulkLoading}
            >
              <UserCheck size={14} /> Activate All
            </button>
          </div>
        </div>
      )}

      {/* Bulk Confirm Modal */}
      {bulkConfirm && (
        <div className="adm-overlay" onClick={() => setBulkConfirm(null)}>
          <div className="adm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="adm-modal-icon">
              <AlertTriangle size={28} />
            </div>
            <h3 className="adm-modal-title">
              {bulkConfirm === 'delete' ? 'Deactivate Users' : 'Activate Users'}
            </h3>
            <p className="adm-modal-text">
              {bulkConfirm === 'delete'
                ? `This will deactivate ${selectedIds.length} user account(s) and hide their profiles.`
                : `This will reactivate ${selectedIds.length} user account(s).`}
            </p>
            <div className="adm-modal-actions">
              <button className="adm-btn-ghost" onClick={() => setBulkConfirm(null)}>Cancel</button>
              <button
                className={`adm-btn-action ${bulkConfirm === 'delete' ? 'adm-btn-danger' : 'adm-btn-primary'}`}
                onClick={handleBulkAction}
                disabled={bulkLoading}
              >
                {bulkLoading ? 'Processing...' : bulkConfirm === 'delete' ? 'Yes, Deactivate' : 'Yes, Activate'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Single-action Confirm Modal */}
      {confirmId && !bulkConfirm && (
        <div className="adm-overlay" onClick={() => { setConfirmId(null); setConfirmAction(null); setBlacklistReason(''); }}>
          <div className="adm-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="adm-modal-title">
              {confirmAction === 'delete' ? 'Deactivate User' : confirmAction === 'reactivate' ? 'Reactivate User' : 'Blacklist User'}
            </h3>
            <p className="adm-modal-text">
              {confirmAction === 'delete' ? 'This will deactivate the account and hide their profile.'
              : confirmAction === 'reactivate' ? 'Restore this user to active status.'
              : 'Block this user across the platform.'}
            </p>

            {confirmAction === 'blacklist' && (
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
              <button className="adm-btn-ghost" onClick={() => { setConfirmId(null); setConfirmAction(null); setBlacklistReason(''); }}>Cancel</button>
              <button
                className={`adm-btn-action ${confirmAction === 'delete' ? 'adm-btn-danger' : confirmAction === 'reactivate' ? 'adm-btn-primary' : 'adm-btn-warn'}`}
                onClick={() => handleAction(confirmId, confirmAction)}
                disabled={actionLoading === confirmId}
              >
                {actionLoading === confirmId ? 'Processing...' : confirmAction === 'delete' ? 'Deactivate' : confirmAction === 'reactivate' ? 'Reactivate' : 'Blacklist'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="adm-table-wrap">
        {loading ? (
          <div className="adm-loading-state"><Loader2 size={24} className="adm-spin" /><span>Loading users...</span></div>
        ) : users.length === 0 ? (
          <div className="adm-empty-state">
            <Users size={40} /><h3>No users found</h3>
            <p>Try adjusting your search or filters.</p>
            {hasActiveFilters && <button className="adm-btn-ghost" onClick={clearFilters}>Clear Filters</button>}
          </div>
        ) : (
          <table className="adm-table">
            <thead>
              <tr>
                <th className="adm-th-check">
                  <button className="adm-check-btn" onClick={toggleSelectAll} title="Select all">
                    {allSelected ? <CheckSquare size={16} /> : <Square size={16} />}
                  </button>
                </th>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const status = statusBadge(user);
                const role = roleBadge(user.role);
                const isDisabled = actionLoading === user._id;
                const isSelected = selectedIds.includes(user._id);
                return (
                  <tr key={user._id} className={`adm-tr${isSelected ? ' adm-tr-selected' : ''}`}>
                    <td className="adm-td-check" onClick={(e) => e.stopPropagation()}>
                      <button className="adm-check-btn" onClick={() => toggleSelect(user._id)} title={isSelected ? 'Deselect' : 'Select'}>
                        {isSelected ? <CheckSquare size={16} /> : <Square size={16} />}
                      </button>
                    </td>
                    <td onClick={() => navigate(`/admin/users/${user._id}`)} style={{ cursor: 'pointer' }}>
                      <div className="adm-user-cell">
                        <div className={`adm-s-avatar ${role.cls}`}>{user.name.charAt(0)}</div>
                        <span className="adm-user-name">{user.name}</span>
                      </div>
                    </td>
                    <td onClick={() => navigate(`/admin/users/${user._id}`)} style={{ cursor: 'pointer' }}>
                      <span className="adm-cell-email">{user.email}</span>
                    </td>
                    <td onClick={() => navigate(`/admin/users/${user._id}`)} style={{ cursor: 'pointer' }}>
                      <span className={`adm-s-role ${role.cls}`}>{role.label}</span>
                    </td>
                    <td onClick={() => navigate(`/admin/users/${user._id}`)} style={{ cursor: 'pointer' }}>
                      <span className={`adm-s-badge ${status.cls}`}>{status.label}</span>
                    </td>
                    <td className="adm-cell-date" onClick={() => navigate(`/admin/users/${user._id}`)} style={{ cursor: 'pointer' }}>
                      {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td>
                      <div className="adm-action-group" onClick={(e) => e.stopPropagation()}>
                        <button className="adm-action-btn" title="View & Manage" onClick={() => navigate(`/admin/users/${user._id}`)}><MoreHorizontal size={15} /></button>
                        <button className="adm-action-btn adm-act-warn" title={user.blacklistedAt ? 'Unblacklist' : 'Blacklist'} onClick={() => openConfirm(user._id, 'blacklist')} disabled={isDisabled}><Ban size={14} /></button>
                        {user.isActive ? (
                          <button className="adm-action-btn adm-act-danger" title="Deactivate" onClick={() => openConfirm(user._id, 'delete')} disabled={isDisabled}><Trash2 size={14} /></button>
                        ) : (
                          <button className="adm-action-btn adm-act-primary" title="Reactivate" onClick={() => openConfirm(user._id, 'reactivate')} disabled={isDisabled}><UserCheck size={14} /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="adm-pagination">
          <button className="adm-page-btn" disabled={!pagination.hasPrevPage} onClick={() => setPage(p => Math.max(1, p - 1))}>
            <ChevronLeft size={15} /> Previous
          </button>
          <span className="adm-page-info">Page {pagination.page} of {pagination.totalPages}</span>
          <button className="adm-page-btn" disabled={!pagination.hasNextPage} onClick={() => setPage(p => p + 1)}>
            Next <ChevronRight size={15} />
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
