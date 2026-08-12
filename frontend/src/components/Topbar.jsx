import { useState, useEffect } from 'react';
import { Bell, Download, Sun, Moon } from 'lucide-react';
import { api } from '../utils/api';
import { useTheme } from '../context/ThemeContext';

export default function Topbar({ title, subtitle, onBellClick, unreadCount }) {
  const [time, setTime] = useState(new Date());
  const { theme, toggle } = useTheme();
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);

  const fmt = t => t.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  const fmtDate = t => t.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="topbar">
      <div>
        <div className="topbar-title">{title}</div>
        {subtitle && <div className="topbar-subtitle">{subtitle}</div>}
      </div>
      <div className="topbar-right">
        <div className="live-pill"><span className="live-dot" />Live Sync</div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 500 }}>{fmt(time)}</div>
          <div style={{ fontSize: 11, color: 'var(--text3)' }}>{fmtDate(time)}</div>
        </div>
        <button
          className="theme-toggle"
          onClick={toggle}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        <div className="icon-btn" onClick={onBellClick} title="Notifications">
          <Bell size={16} />
          {unreadCount > 0 && <span className="notif-dot" />}
        </div>
        <a href={api.exportReport()} download className="btn btn-ghost btn-sm" title="Export Report">
          <Download size={13} /> Export
        </a>
      </div>
    </div>
  );
}
