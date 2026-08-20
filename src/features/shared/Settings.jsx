import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useUiStore } from '../../store/uiStore';
import {
  Sun, Moon, User, Mail, Bell, Shield, LogOut, Palette, ChevronRight, Check
} from 'lucide-react';

const NotifKey = 'theliv-notif-prefs';

const readPrefs = () => {
  try {
    return JSON.parse(localStorage.getItem(NotifKey)) || {
      productUpdates: true,
      weeklyDigest: true,
      profileViews: false,
    };
  } catch {
    return { productUpdates: true, weeklyDigest: true, profileViews: false };
  }
};

const Settings = () => {
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useUiStore();
  const [prefs, setPrefs] = useState(readPrefs);
  const [savedPing, setSavedPing] = useState(null);

  const togglePref = (key) => {
    const next = { ...prefs, [key]: !prefs[key] };
    setPrefs(next);
    localStorage.setItem(NotifKey, JSON.stringify(next));
    setSavedPing(key);
    setTimeout(() => setSavedPing(null), 1200);
  };

  if (!user) return null;

  return (
    <>
      <div className="page-head">
        <div>
          <div className="page-head-title">Settings</div>
          <div className="page-head-sub">Manage your account, appearance, and notifications</div>
        </div>
      </div>

      <div className="settings-layout">
        {/* Account card */}
        <section className="card settings-card">
          <div className="settings-card-h">
            <User size={16} />
            <span>Account</span>
          </div>

          <div className="settings-account-row">
            <div className="settings-avatar">{user.name?.charAt(0)?.toUpperCase()}</div>
            <div className="settings-account-info">
              <div className="settings-account-name">{user.name}</div>
              <div className="settings-account-meta">
                <Mail size={13} />
                <span>{user.email}</span>
              </div>
              <span className={`settings-role-badge role-${user.role}`}>{user.role}</span>
            </div>
          </div>
        </section>

        {/* Appearance card */}
        <section className="card settings-card">
          <div className="settings-card-h">
            <Palette size={16} />
            <span>Appearance</span>
          </div>

          <div className="settings-row">
            <div className="settings-row-info">
              <div className="settings-row-title">Theme</div>
              <div className="settings-row-sub">Choose how Theliv looks to you</div>
            </div>
            <div className="settings-seg" role="tablist" aria-label="Theme">
              <button
                role="tab"
                aria-selected={theme === 'light'}
                className={`settings-seg-btn${theme === 'light' ? ' active' : ''}`}
                onClick={() => setTheme('light')}
              >
                <Sun size={14} />
                <span>Light</span>
              </button>
              <button
                role="tab"
                aria-selected={theme === 'dark'}
                className={`settings-seg-btn${theme === 'dark' ? ' active' : ''}`}
                onClick={() => setTheme('dark')}
              >
                <Moon size={14} />
                <span>Dark</span>
              </button>
            </div>
          </div>
        </section>

        {/* Notifications card */}
        <section className="card settings-card">
          <div className="settings-card-h">
            <Bell size={16} />
            <span>Notifications</span>
          </div>

          {[
            { key: 'productUpdates', title: 'Product updates', sub: 'New features, improvements, and releases' },
            { key: 'weeklyDigest',   title: 'Weekly digest',   sub: 'A summary of activity every Monday' },
            { key: 'profileViews',   title: 'Profile views',   sub: 'Get notified when someone views your profile' },
          ].map((row, i, arr) => (
            <div key={row.key} className={`settings-row${i < arr.length - 1 ? ' settings-row-divide' : ''}`}>
              <div className="settings-row-info">
                <div className="settings-row-title">
                  {row.title}
                  {savedPing === row.key && (
                    <span className="settings-saved-ping"><Check size={11} /> Saved</span>
                  )}
                </div>
                <div className="settings-row-sub">{row.sub}</div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={prefs[row.key]}
                aria-label={row.title}
                className={`settings-switch${prefs[row.key] ? ' on' : ''}`}
                onClick={() => togglePref(row.key)}
              >
                <span className="settings-switch-thumb" />
              </button>
            </div>
          ))}
        </section>

        {/* Security / danger card */}
        <section className="card settings-card">
          <div className="settings-card-h">
            <Shield size={16} />
            <span>Security</span>
          </div>

          <button className="settings-link-row" type="button" onClick={() => alert('Password reset flow coming soon.')}>
            <div className="settings-row-info">
              <div className="settings-row-title">Change password</div>
              <div className="settings-row-sub">Update your account password</div>
            </div>
            <ChevronRight size={16} className="settings-link-chev" />
          </button>

          <div className="settings-row settings-row-divide-top">
            <div className="settings-row-info">
              <div className="settings-row-title">Sign out of this device</div>
              <div className="settings-row-sub">You will need to log in again to access your account</div>
            </div>
            <button className="settings-danger-btn" type="button" onClick={() => logout()}>
              <LogOut size={14} />
              <span>Log out</span>
            </button>
          </div>
        </section>
      </div>
    </>
  );
};

export default Settings;
