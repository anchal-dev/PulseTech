import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  BarElement, Tooltip, Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { BrainCircuit, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const insightIcons = {
  critical: <AlertCircle size={14} />,
  warning:  <AlertTriangle size={14} />,
  positive: <CheckCircle size={14} />,
  info:     <Info size={14} />,
};

const axisStyle = {
  ticks: { color: '#5a7199', font: { size: 11 } },
  grid:  { color: 'rgba(99,130,190,0.1)' },
};

export default function AnalyticsPage() {
  const [insights, setInsights] = useState(null);
  const [trends,   setTrends]   = useState(null);

  useEffect(() => {
    api.getAIInsights().then(setInsights).catch(() => {});
    api.getTrends().then(setTrends).catch(() => {});
  }, []);

  return (
    <div className="page-body">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <BrainCircuit size={22} color="var(--accent)" />
        <div>
          <div style={{ fontFamily: 'var(--font-head)', fontSize: 18, fontWeight: 700 }}>AI Insights & Predictions</div>
          <div style={{ fontSize: 12, color: 'var(--text3)' }}>Powered by clinical analytics engine</div>
        </div>
      </div>

      {/* Prediction cards */}
      {insights && (
        <div className="grid-3" style={{ marginBottom: 20 }}>
          <div className="stat-card">
            <div style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
              Tomorrow's Load
            </div>
            <div style={{ fontFamily: 'var(--font-head)', fontSize: 32, fontWeight: 700, color: 'var(--accent)', marginTop: 4 }}>
              ~{insights.predictions.tomorrowLoad}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text3)' }}>predicted admissions</div>
          </div>

          <div className="stat-card">
            <div style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
              ICU Demand
            </div>
            <div style={{
              fontFamily: 'var(--font-head)', fontSize: 32, fontWeight: 700, marginTop: 4,
              color: insights.predictions.icuDemand === 'High' ? 'var(--red)'
                   : insights.predictions.icuDemand === 'Moderate' ? 'var(--amber)'
                   : 'var(--green)',
            }}>
              {insights.predictions.icuDemand}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text3)' }}>ICU occupancy: {insights.predictions.icuOccupancy}%</div>
          </div>

          <div className="stat-card">
            <div style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
              Peak Hour
            </div>
            <div style={{ fontFamily: 'var(--font-head)', fontSize: 20, fontWeight: 700, color: 'var(--amber)', marginTop: 4 }}>
              {insights.predictions.peakHour}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 4 }}>
              {insights.predictions.suggestedStaff}
            </div>
          </div>
        </div>
      )}

      <div className="grid-2" style={{ marginBottom: 20 }}>
        {/* Urgent care */}
        {insights && (
          <div className="card">
            <div className="section-header">
              <div><div className="section-title">🚨 Urgent Care Needed</div><div className="section-sub">AI-flagged patients</div></div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {insights.urgentCare.map(u => (
                <div key={u.patientId} style={{
                  padding: '12px 14px', borderRadius: 10,
                  background: u.urgency === 'Critical' ? 'var(--red-soft)' : 'var(--amber-soft)',
                  border: `1px solid ${u.urgency === 'Critical' ? 'var(--red-glow)' : 'rgba(245,158,11,0.25)'}`,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: 14 }}>{u.name}</span>
                    <span className={`risk-badge ${u.urgency === 'Critical' ? 'High' : 'Medium'}`}>
                      <span className="risk-dot" />{u.urgency}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 4 }}>{u.reason}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Risk insights */}
        {insights && (
          <div className="card">
            <div className="section-header">
              <div><div className="section-title">📊 Risk Trend Insights</div><div className="section-sub">Clinical analysis</div></div>
            </div>
            {insights.riskTrends.map((r, i) => (
              <div key={i} className={`insight-item ${r.severity}`}>
                <span style={{ flexShrink: 0, marginTop: 1 }}>{insightIcons[r.severity]}</span>
                <span>{r.insight}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stacked risk bar — fixed Y axis */}
      {trends && (
        <div className="card">
          <div className="section-header">
            <div><div className="section-title">Weekly Risk Distribution</div><div className="section-sub">High / Medium / Low trend</div></div>
          </div>
          <div style={{ height: 220 }}>
            <Bar
              data={{
                labels: trends.riskTrend.map(d => d.day),
                datasets: [
                  { label: 'High',   data: trends.riskTrend.map(d => d.high),   backgroundColor: 'rgba(239,68,68,0.8)',  borderRadius: 4 },
                  { label: 'Medium', data: trends.riskTrend.map(d => d.medium), backgroundColor: 'rgba(245,158,11,0.7)', borderRadius: 4 },
                  { label: 'Low',    data: trends.riskTrend.map(d => d.low),    backgroundColor: 'rgba(34,197,94,0.7)',  borderRadius: 4 },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { labels: { color: '#8fa3c8', font: { size: 12 }, boxWidth: 12 } } },
                scales: {
                  x: { ...axisStyle, stacked: true },
                  y: {
                    ...axisStyle,
                    stacked: true,
                    min: 0,
                    max: 20,
                    ticks: { ...axisStyle.ticks, stepSize: 5 },
                  },
                },
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
