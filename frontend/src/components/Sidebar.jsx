import { useAuth } from '../context/AuthContext';

const NAV = [
  { id: 'dashboard',    icon: '📊', label: 'Dashboard' },
  { id: 'appointments', icon: '📅', label: 'Appointments' },
  { id: 'patients',     icon: '🧑‍⚕️', label: 'Patients' },
  { id: 'analytics',    icon: '🧠', label: 'AI Insights' },
  { id: 'resources',    icon: '🏥', label: 'Resources' },
];

export default function Sidebar({ active, onNavigate, unreadCount }) {
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-mark">
          <img
            src="/pulsetech-logo.jpg"
            alt="PulseTech"
            style={{ width: 36, height: 36, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }}
          />
          <div>
            <div className="logo-text">PulseTech</div>
            <div className="logo-sub">Hospital Dashboard</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        <div className="nav-section-label">Main Menu</div>
        {NAV.map(n => (
          <div
            key={n.id}
            className={`nav-item${active === n.id ? ' active' : ''}`}
            onClick={() => onNavigate(n.id)}>
            <span style={{ fontSize: 16 }}>{n.icon}</span>
            <span>{n.label}</span>
            {n.id === 'dashboard' && unreadCount > 0 && (
              <span className="nav-badge">{unreadCount}</span>
            )}
          </div>
        ))}
      </nav>

      {/* User footer */}
      <div className="sidebar-footer">
        <div className="user-card" onClick={logout} title="Click to sign out">
          <div className="avatar" style={{ background: 'linear-gradient(135deg, #4f8ef7, #7c3aed)' }}>
            {user?.avatar}
          </div>
          <div className="user-info">
            <div className="user-name">{user?.name}</div>
            <div className="user-role">Admin · Sign Out</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
