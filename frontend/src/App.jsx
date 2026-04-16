import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import NotificationsPanel from './components/NotificationsPanel';
import DashboardPage from './pages/DashboardPage';
import AppointmentsPage from './pages/AppointmentsPage';
import PatientsPage from './pages/PatientsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ResourcesPage from './pages/ResourcesPage';
import { api } from './utils/api';
import './index.css';

const PAGE_TITLES = {
  dashboard:    ['Dashboard',    'Overview & Emergency Alerts'],
  appointments: ['Appointments', "Today's Schedule"],
  patients:     ['Patients',     'Live Vitals & ECG'],
  analytics:    ['AI Insights',  'Predictions & Risk Trends'],
  resources:    ['Resources',    'Beds & Doctor Workload'],
};

const PAGES = {
  dashboard:    DashboardPage,
  appointments: AppointmentsPage,
  patients:     PatientsPage,
  analytics:    AnalyticsPage,
  resources:    ResourcesPage,
};

function Shell() {
  const { user } = useAuth();
  const [page,       setPage]       = useState('dashboard');
  const [showNotifs, setShowNotifs] = useState(false);
  const [unread,     setUnread]     = useState(0);

  useEffect(() => {
    if (!user) return;
    const load = () =>
      api.getNotifications()
        .then(n => setUnread(n.filter(x => !x.read).length))
        .catch(() => {});
    load();
    const t = setInterval(load, 30000);
    return () => clearInterval(t);
  }, [user]);

  if (!user) return <LoginPage />;

  const [title, subtitle] = PAGE_TITLES[page] || ['PulseTech', ''];
  const PageComp = PAGES[page] || DashboardPage;

  return (
    <div className="app-shell">
      <Sidebar
        active={page}
        onNavigate={p => { setPage(p); setShowNotifs(false); }}
        unreadCount={unread}
      />
      <div className="main-content">
        <Topbar
          title={title}
          subtitle={subtitle}
          onBellClick={() => setShowNotifs(s => !s)}
          unreadCount={unread}
        />
        {showNotifs && (
          <div style={{ position: 'relative', zIndex: 200 }}>
            <NotificationsPanel
              onClose={() => { setShowNotifs(false); setUnread(0); }}
            />
          </div>
        )}
        <PageComp onNavigate={setPage} />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Shell />
    </AuthProvider>
  );
}
