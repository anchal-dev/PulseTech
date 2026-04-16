import { useState, useEffect, useCallback } from 'react';
import { api } from '../utils/api';
import { Clock, RefreshCw } from 'lucide-react';

const STATUSES = ['Scheduled','Waiting','In Progress','Confirmed','Completed'];

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const load = useCallback(() => {
    setLoading(true);
    api.getAppointments().then(d => { setAppointments(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id, status) => {
    await api.updateAppointment(id, { status });
    setAppointments(a => a.map(x => x.id === id ? { ...x, status } : x));
  };

  const filters = ['All', 'High', 'Medium', 'Low'];
  const filtered = filter === 'All' ? appointments : appointments.filter(a => a.riskLevel === filter);
  const counts = { High: appointments.filter(a=>a.riskLevel==='High').length, Medium: appointments.filter(a=>a.riskLevel==='Medium').length, Low: appointments.filter(a=>a.riskLevel==='Low').length };

  return (
    <div className="page-body">
      {/* Summary cards */}
      <div className="grid-4" style={{ marginBottom: 20 }}>
        {[
          { label: "Today's Total", value: appointments.length, color: 'var(--accent)' },
          { label: 'High Priority', value: counts.High, color: 'var(--red)' },
          { label: 'Medium Priority', value: counts.Medium, color: 'var(--amber)' },
          { label: 'Low Priority', value: counts.Low, color: 'var(--green)' },
        ].map(s => (
          <div key={s.label} className="stat-card" style={{ padding: 16 }}>
            <div className="stat-value" style={{ fontSize: 22, color: s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="section-header">
          <div>
            <div className="section-title">Today's Appointments</div>
            <div className="section-sub">Sorted by risk level · Age priority</div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div className="tabs">
              {filters.map(f => (
                <div key={f} className={`tab${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>{f}</div>
              ))}
            </div>
            <button className="btn btn-ghost btn-sm" onClick={load}><RefreshCw size={13} /></button>
          </div>
        </div>

        {loading ? (
          <div className="empty-state">Loading appointments…</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th><th>Patient</th><th>Age</th><th>Risk</th>
                  <th>Time</th><th>Type</th><th>Doctor</th><th>Status</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a, i) => (
                  <tr key={a.id} className={a.riskLevel === 'High' ? 'high-risk' : ''}>
                    <td><span className="mono" style={{ color: 'var(--text3)', fontSize: 12 }}>{a.id}</span></td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{a.patientName}</div>
                      {a.riskLevel === 'High' && (
                        <div style={{ fontSize: 11, color: 'var(--red)', marginTop: 2 }}>⚠ Immediate Attention Required</div>
                      )}
                    </td>
                    <td><span className="mono">{a.age}</span></td>
                    <td>
                      <span className={`risk-badge ${a.riskLevel}`}>
                        <span className="risk-dot" />
                        {a.riskLevel}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <Clock size={12} style={{ color: 'var(--text3)' }} />
                        <span className="mono" style={{ fontSize: 13 }}>{a.timeSlot}</span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text2)', fontSize: 12.5 }}>{a.type}</td>
                    <td style={{ fontSize: 12.5, color: 'var(--text2)' }}>{a.doctor}</td>
                    <td><span className={`status-badge ${a.status}`}>{a.status}</span></td>
                    <td>
                      <select
                        value={a.status}
                        onChange={e => updateStatus(a.id, e.target.value)}
                        style={{
                          background: 'var(--bg3)', border: '1px solid var(--border2)',
                          color: 'var(--text)', borderRadius: 6, padding: '4px 8px',
                          fontSize: 12, cursor: 'pointer',
                        }}>
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
