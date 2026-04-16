import { useState, useEffect, useCallback } from 'react';
import { api } from '../utils/api';
import { useWebSocket } from '../hooks/useWebSocket';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale,
  BarElement, LineElement, PointElement,
  ArcElement, Tooltip, Legend, Filler,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { AlertTriangle, Users, CalendarDays, BedDouble, HeartPulse, Zap } from 'lucide-react';

ChartJS.register(
  CategoryScale, LinearScale,
  BarElement, LineElement, PointElement,
  ArcElement, Tooltip, Legend, Filler
);

// Shared axis style
const axisStyle = {
  ticks: { color: '#5a7199', font: { size: 11 } },
  grid:  { color: 'rgba(99,130,190,0.1)' },
};

export default function DashboardPage({ onNavigate }) {
  const [overview, setOverview] = useState(null);
  const [trends,   setTrends]   = useState(null);
  const [patients, setPatients] = useState([]);

  const loadData = useCallback(() => {
    api.getOverview().then(setOverview).catch(() => {});
    api.getTrends().then(setTrends).catch(() => {});
    api.getPatients().then(d => setPatients(d.filter(p => p.riskLevel === 'High'))).catch(() => {});
  }, []);

  useEffect(() => {
    loadData();
    const t = setInterval(loadData, 15000);
    return () => clearInterval(t);
  }, [loadData]);

  useWebSocket(useCallback((msg) => {
    if (msg.type === 'VITALS_UPDATE') loadData();
  }, [loadData]));

  const STATS = overview ? [
    { icon: <Users size={18} />,       label: 'Total Patients',      value: overview.totalPatients,     color: 'var(--accent)', bg: 'var(--accent-glow)' },
    { icon: <CalendarDays size={18} />, label: "Today's Appointments",value: overview.totalAppointments, color: '#a78bfa',       bg: 'rgba(167,139,250,0.12)' },
    { icon: <AlertTriangle size={18} />,label: 'High Risk',           value: overview.highRisk,          color: 'var(--red)',    bg: 'var(--red-soft)' },
    { icon: <BedDouble size={18} />,    label: 'ICU Occupied',        value: `${overview.icuOccupied}/${overview.icuTotal}`, color: 'var(--amber)', bg: 'var(--amber-soft)' },
    { icon: <HeartPulse size={18} />,   label: 'Avg Heart Rate',      value: `${overview.avgHeartRate} bpm`, color: 'var(--red)', bg: 'var(--red-soft)' },
    { icon: <Zap size={18} />,          label: 'Avg SpO₂',            value: `${overview.avgSpo2}%`,    color: 'var(--green)',  bg: 'var(--green-soft)' },
  ] : [];

  return (
    <div className="page-body">

      {/* Emergency Banner */}
      {patients.length > 0 && (
        <div className="emergency-banner" style={{ marginBottom: 20 }}>
          <span style={{ fontSize: 20 }}>🚨</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, color: 'var(--red)', fontSize: 14 }}>
              {patients.length} HIGH RISK {patients.length === 1 ? 'PATIENT' : 'PATIENTS'} — IMMEDIATE ATTENTION REQUIRED
            </div>
            <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>
              {patients.map(p => p.name).join(' · ')}
            </div>
          </div>
          <button className="btn btn-danger btn-sm" onClick={() => onNavigate('patients')}>
            View All
          </button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid-3" style={{ marginBottom: 20 }}>
        {STATS.map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
            <div className="stat-value" style={{ color: s.color }}>{s.value ?? '—'}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid-2" style={{ marginBottom: 20 }}>

        {/* Patient Trend — fixed Y axis range 0–80 */}
        <div className="card">
          <div className="section-header" style={{ marginBottom: 14 }}>
            <div>
              <div className="section-title">Patient Trend</div>
              <div className="section-sub">Weekly admissions</div>
            </div>
          </div>
          <div style={{ height: 200 }}>
            {trends ? (
              <Line
                data={{
                  labels: trends.patientTrend.map(d => d.day),
                  datasets: [{
                    label: 'Patients',
                    data: trends.patientTrend.map(d => d.patients),
                    borderColor: '#4f8ef7',
                    backgroundColor: 'rgba(79,142,247,0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointBackgroundColor: '#4f8ef7',
                    pointBorderColor: '#1a2236',
                    pointBorderWidth: 2,
                  }],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    x: axisStyle,
                    y: {
                      ...axisStyle,
                      min: 0,
                      max: 80,
                      ticks: { ...axisStyle.ticks, stepSize: 20 },
                    },
                  },
                }}
              />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text3)' }}>
                Loading…
              </div>
            )}
          </div>
        </div>

        {/* Risk Distribution */}
        <div className="card">
          <div className="section-header" style={{ marginBottom: 14 }}>
            <div>
              <div className="section-title">Risk Distribution</div>
              <div className="section-sub">Current patient risk levels</div>
            </div>
          </div>
          {overview ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              <div style={{ width: 160, height: 160, flexShrink: 0 }}>
                <Doughnut
                  data={{
                    labels: ['High Risk', 'Medium Risk', 'Low Risk'],
                    datasets: [{
                      data: [overview.highRisk, overview.mediumRisk, overview.lowRisk],
                      backgroundColor: ['#ef4444', '#f59e0b', '#22c55e'],
                      borderColor: '#1a2236',
                      borderWidth: 3,
                    }],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
                    cutout: '68%',
                    plugins: {
                      legend: { display: false },
                      tooltip: {
                        callbacks: {
                          label: ctx => ` ${ctx.label}: ${ctx.raw} patients`,
                        },
                      },
                    },
                  }}
                />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  ['High',   'var(--red)',   overview.highRisk],
                  ['Medium', 'var(--amber)', overview.mediumRisk],
                  ['Low',    'var(--green)', overview.lowRisk],
                ].map(([label, color, val]) => (
                  <div key={label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ fontSize: 13, color: 'var(--text2)' }}>{label} Risk</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color, fontWeight: 700 }}>{val}</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{
                        width: `${Math.round((val / overview.totalPatients) * 100)}%`,
                        background: color,
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ color: 'var(--text3)', textAlign: 'center', padding: 32 }}>Loading…</div>
          )}
        </div>
      </div>

      {/* Admissions vs Discharges — fixed Y axis */}
      <div className="card">
        <div className="section-header" style={{ marginBottom: 14 }}>
          <div>
            <div className="section-title">Admissions vs Discharges</div>
            <div className="section-sub">Weekly comparison</div>
          </div>
        </div>
        <div style={{ height: 220 }}>
          {trends ? (
            <Bar
              data={{
                labels: trends.admissions.map(d => d.day),
                datasets: [
                  {
                    label: 'Admitted',
                    data: trends.admissions.map(d => d.admitted),
                    backgroundColor: 'rgba(79,142,247,0.75)',
                    borderRadius: 6,
                    barPercentage: 0.5,
                    categoryPercentage: 0.7,
                  },
                  {
                    label: 'Discharged',
                    data: trends.admissions.map(d => d.discharged),
                    backgroundColor: 'rgba(34,197,94,0.7)',
                    borderRadius: 6,
                    barPercentage: 0.5,
                    categoryPercentage: 0.7,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    labels: { color: '#8fa3c8', font: { size: 12 }, boxWidth: 12 },
                  },
                },
                scales: {
                  x: axisStyle,
                  y: {
                    ...axisStyle,
                    min: 0,
                    max: 16,
                    ticks: { ...axisStyle.ticks, stepSize: 4 },
                  },
                },
              }}
            />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text3)' }}>
              Loading…
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
