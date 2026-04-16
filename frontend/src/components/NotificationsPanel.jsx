import { useEffect, useState } from 'react';
import { api } from '../utils/api';
import { X, CheckCheck, AlertCircle, AlertTriangle, Info } from 'lucide-react';

const icons = { critical: <AlertCircle size={14} />, warning: <AlertTriangle size={14} />, info: <Info size={14} /> };
const colors = { critical: 'var(--red)', warning: 'var(--amber)', info: 'var(--accent)' };

function timeAgo(iso) {
  const diff = Math.floor((Date.now() - new Date(iso)) / 60000);
  if (diff < 1) return 'just now';
  if (diff < 60) return `${diff}m ago`;
  return `${Math.floor(diff/60)}h ago`;
}

export default function NotificationsPanel({ onClose }) {
  const [notifs, setNotifs] = useState([]);

  useEffect(() => {
    api.getNotifications().then(setNotifs).catch(() => {});
  }, []);

  const markAllRead = async () => {
    await api.markAllRead();
    setNotifs(n => n.map(x => ({ ...x, read: true })));
  };

  const markOne = async (id) => {
    await api.markRead(id);
    setNotifs(n => n.map(x => x.id === id ? { ...x, read: true } : x));
  };

  return (
    <div className="notif-panel">
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontWeight: 700, fontSize: 14 }}>Notifications</span>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button className="btn btn-ghost btn-sm" onClick={markAllRead} style={{ gap: 4, padding: '4px 8px', fontSize: 11 }}>
            <CheckCheck size={12} /> All read
          </button>
          <div className="icon-btn" style={{ width: 28, height: 28 }} onClick={onClose}><X size={14} /></div>
        </div>
      </div>
      <div style={{ overflowY: 'auto', flex: 1 }}>
        {notifs.length === 0 && <div className="empty-state" style={{ padding: 32 }}>No notifications</div>}
        {notifs.map(n => (
          <div key={n.id} className={`notif-item${n.read ? '' : ' unread'}`} onClick={() => markOne(n.id)}>
            <span style={{ color: colors[n.type], marginTop: 2, flexShrink: 0 }}>{icons[n.type]}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, lineHeight: 1.4, color: n.read ? 'var(--text2)' : 'var(--text)' }}>{n.message}</div>
              <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 3 }}>{timeAgo(n.time)}</div>
            </div>
            {!n.read && <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0, marginTop: 5 }} />}
          </div>
        ))}
      </div>
    </div>
  );
}
