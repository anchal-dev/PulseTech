import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { BedDouble, Users, Clock } from 'lucide-react';

export default function ResourcesPage() {
  const [beds, setBeds] = useState([]);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    api.getBeds().then(setBeds).catch(() => {});
    api.getDoctors().then(setDoctors).catch(() => {});
    const t = setInterval(() => {
      api.getBeds().then(setBeds).catch(() => {});
    }, 15000);
    return () => clearInterval(t);
  }, []);

  const totalBeds = beds.reduce((s, b) => s + b.total, 0);
  const totalOccupied = beds.reduce((s, b) => s + b.occupied, 0);
  const totalAvail = totalBeds - totalOccupied;

  const wardGroups = {};
  beds.forEach(b => {
    if (!wardGroups[b.ward]) wardGroups[b.ward] = [];
    wardGroups[b.ward].push(b);
  });

  return (
    <div className="page-body">
      <div style={{ fontFamily: 'var(--font-head)', fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Resource Management</div>
      <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 20 }}>Bed availability · Doctor workload · Estimated wait times</div>

      {/* Overview stats */}
      <div className="grid-3" style={{ marginBottom: 20 }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--accent-glow)', color: 'var(--accent)' }}><BedDouble size={18} /></div>
          <div className="stat-value">{totalBeds}</div>
          <div className="stat-label">Total Beds</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--amber-soft)', color: 'var(--amber)' }}><BedDouble size={18} /></div>
          <div className="stat-value" style={{ color: 'var(--amber)' }}>{totalOccupied}</div>
          <div className="stat-label">Occupied</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--green-soft)', color: 'var(--green)' }}><BedDouble size={18} /></div>
          <div className="stat-value" style={{ color: 'var(--green)' }}>{totalAvail}</div>
          <div className="stat-label">Available</div>
        </div>
      </div>

      <div className="grid-2">
        {/* Bed availability */}
        <div className="card">
          <div className="section-header">
            <div><div className="section-title">🛏 Bed Availability</div><div className="section-sub">By ward</div></div>
          </div>
          {Object.entries(wardGroups).map(([ward, ws]) => (
            <div key={ward} style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text2)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{ward}</div>
              {ws.map(b => {
                const pct = b.occupancyPct;
                const color = pct >= 90 ? 'var(--red)' : pct >= 70 ? 'var(--amber)' : 'var(--green)';
                return (
                  <div key={b.ward} style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 500 }}>{b.ward}</span>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <span style={{ fontSize: 11, color: 'var(--text3)' }}>{b.occupied}/{b.total}</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color, fontWeight: 600 }}>{pct}%</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text3)', fontSize: 11 }}>
                          <Clock size={10} />{b.waitingTime}m wait
                        </div>
                      </div>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Doctor workload */}
        <div className="card">
          <div className="section-header">
            <div><div className="section-title">👨‍⚕️ Doctor Workload</div><div className="section-sub">Patient distribution</div></div>
          </div>
          {doctors.map(d => {
            const pct = Math.round((d.patients / d.maxPatients) * 100);
            const color = pct >= 80 ? 'var(--red)' : pct >= 60 ? 'var(--amber)' : 'var(--accent)';
            return (
              <div key={d.id} style={{ marginBottom: 16, padding: '12px 14px', background: 'var(--bg3)', borderRadius: 10, border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{d.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text3)' }}>{d.specialty}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: 12, padding: '2px 8px', borderRadius: 99, background: d.status === 'In Surgery' ? 'var(--red-soft)' : 'var(--green-soft)',
                      color: d.status === 'In Surgery' ? 'var(--red)' : 'var(--green)',
                      border: `1px solid ${d.status === 'In Surgery' ? 'var(--red-glow)' : 'rgba(34,197,94,0.25)'}`,
                      fontWeight: 600, fontSize: 11 }}>
                      {d.status}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: 'var(--text3)' }}>Patients: {d.patients}/{d.maxPatients}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color, fontWeight: 600 }}>{pct}% capacity</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
