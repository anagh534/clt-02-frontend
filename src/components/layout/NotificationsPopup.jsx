import { useEffect, useRef, useState } from 'react';
import { Bell, Eye, Bookmark, TrendingUp, MessageSquare, CheckCheck } from 'lucide-react';

const DEMO_NOTIFICATIONS = [
  {
    id: 'n1',
    icon: Eye,
    tone: 'blue',
    title: 'Your profile was viewed',
    body: 'A partner at Horizon Ventures viewed your profile.',
    time: '2m ago',
    unread: true,
  },
  {
    id: 'n2',
    icon: Bookmark,
    tone: 'gold',
    title: 'New investor saved you',
    body: 'Bob Investor added your startup to their shortlist.',
    time: '1h ago',
    unread: true,
  },
  {
    id: 'n3',
    icon: TrendingUp,
    tone: 'green',
    title: 'Your score went up',
    body: 'Latest calculation increased your score by +4 points.',
    time: 'Yesterday',
    unread: true,
  },
  {
    id: 'n4',
    icon: MessageSquare,
    tone: 'muted',
    title: 'Welcome to Theliv',
    body: 'Complete your profile to unlock the deal feed.',
    time: '3d ago',
    unread: false,
  },
];

const NotificationsPopup = ({ open, onClose, anchorRefs = [] }) => {
  const [items, setItems] = useState(DEMO_NOTIFICATIONS);
  const popupRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (popupRef.current?.contains(e.target)) return;
      if (anchorRefs.some((r) => r?.current?.contains(e.target))) return;
      onClose();
    };
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open, onClose, anchorRefs]);

  const unreadCount = items.filter((n) => n.unread).length;

  const markAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const markOneRead = (id) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  };

  if (!open) return null;

  return (
    <>
      <div className="notif-backdrop" onClick={onClose} />
      <div className="notif-popup" ref={popupRef} role="dialog" aria-label="Notifications">
        <div className="notif-head">
          <div className="notif-head-title">
            <Bell size={15} />
            <span>Notifications</span>
            {unreadCount > 0 && <span className="notif-head-count">{unreadCount}</span>}
          </div>
          {unreadCount > 0 && (
            <button className="notif-mark-btn" onClick={markAllRead}>
              <CheckCheck size={13} />
              Mark all read
            </button>
          )}
        </div>

        <div className="notif-list">
          {items.length === 0 ? (
            <div className="notif-empty">
              <Bell size={22} />
              <div className="notif-empty-title">You're all caught up</div>
              <div className="notif-empty-sub">New notifications will appear here.</div>
            </div>
          ) : (
            items.map((n) => {
              const Icon = n.icon;
              return (
                <button
                  key={n.id}
                  type="button"
                  className={`notif-item${n.unread ? ' notif-item-unread' : ''}`}
                  onClick={() => markOneRead(n.id)}
                >
                  <div className={`notif-icon notif-icon-${n.tone}`}>
                    <Icon size={15} />
                  </div>
                  <div className="notif-body">
                    <div className="notif-title">{n.title}</div>
                    <div className="notif-text">{n.body}</div>
                    <div className="notif-time">{n.time}</div>
                  </div>
                  {n.unread && <span className="notif-dot" aria-label="Unread" />}
                </button>
              );
            })
          )}
        </div>

        <div className="notif-foot">
          <button className="notif-foot-link" onClick={onClose}>Close</button>
        </div>
      </div>
    </>
  );
};

export default NotificationsPopup;
