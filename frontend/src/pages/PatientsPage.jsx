import { useState, useEffect, useCallback } from 'react';
import { api } from '../utils/api';
import { useWebSocket } from '../hooks/useWebSocket';
import ECGChart from '../components/ECGChart';
import { Thermometer, Heart, Wind, Save, Pin } from 'lucide-react';

export default function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState({});
  const [saved, setSaved] = useState({});
  const [filter, setFilter] = useState('All');

  const load = useCallback(() => {
    api.getPatients().then(d => {
      setPatients(d);
      const n = {};
      d.forEach(p => { n[p.id] = p.notes || ''; });
      setNotes(n);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => { load(); const t = setInterval(load, 8000); return () => clearInterval(t); }, [load]);

  useWebSocket(useCallback((msg) => {
    if (msg.type === 'VITALS_UPDATE') {
      setPatients(prev => prev.map(p => {
        const updated = msg.data.find(u => u.id === p.id);
        return updated ? { ...p, ...updated } : p;
      }));
    }
  }, []));

  const saveNotes = async (id) => {
    await api.updateNotes(id, notes[id]);
    setSaved(s => ({ ...s, [id]: true }));
    setTimeout(() => setSaved(s => ({ ...s, [id]: false })), 2000);
  };

  const filtered = filter === 'All' ? patients : patients.filter(p => p.riskLevel === filter);
  const sorted = [...filtered].sort((a, b) => {
    const o = { High: 0, Medium: 1, Low: 2 };
    return o[a.riskLevel] - o[b.riskLevel];
  });

  return (
    <div className="page-body">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-head)', fontSize: 18, fontWeight: 700 }}>Patient Data</div>
          <div style={{ fontSize: 12, color: 'var(--text3)' }}>Live vitals · ECG snapshots · Doctor notes</div>
        </div>
        <div className="tabs">
          {['All','High','Medium','Low'].map(f => (
            <div key={f} className={`tab${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>{f}</div>
          ))}
        </div>
      </div>

      {loading ? <div className="empty-state">Loading patient data…</div> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {sorted.map(p => (
            <PatientCard key={p.id} patient={p} note={notes[p.id] || ''} isSaved={saved[p.id]}
              onNoteChange={(v) => setNotes(n => ({ ...n, [p.id]: v }))}
              onSave={() => saveNotes(p.id)} />
          ))}
        </div>
      )}
    </div>
  );
}

function PatientCard({ patient: p, note, isSaved, onNoteChange, onSave }) {
  const [expanded, setExpanded] = useState(false);
  const isHigh = p.riskLevel === 'High';
  const hrWarn = p.heartRate > 100 || p.heartRate < 55;
  const spo2Warn = p.spo2 < 93;
  const tempWarn = p.temperature > 38.5;

  return (
    <div className="card" style={{
      borderColor: isHigh ? 'rgba(239,68,68,0.3)' : 'var(--border)',
      background: isHigh ? 'linear-gradient(135deg, rgba(239,68,68,0.04), var(--surface))' : 'var(--surface)',
    }}>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        {/* ID + Name */}
        <div style={{ minWidth: 180 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {isHigh && <Pin size={13} color="var(--red)" />}
            <span style={{ fontWeight: 700, fontSize: 15 }}>{p.name}</span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>
            <span className="mono">{p.id}</span> · {p.gender}, {p.age}y · {p.ward}
          </div>
          <div style={{ marginTop: 6 }}><span className={`risk-badge ${p.riskLevel}`}><span className="risk-dot" />{p.riskLevel} Risk</span></div>
        </div>

        {/* ECG */}
        <div style={{ padding: '4px 8px', background: 'var(--bg3)', borderRadius: 8, border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.08em' }}>ECG</div>
          <ECGChart data={p.ecgData || []} riskLevel={p.riskLevel} width={130} height={38} />
        </div>

        {/* Vitals */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span className={`vitals-chip${hrWarn ? ' warn' : ''}`}><Heart size={11} /> {p.heartRate} bpm</span>
          <span className={`vitals-chip${spo2Warn ? ' warn' : ''}`}><Wind size={11} /> SpO₂ {p.spo2}%</span>
          <span className={`vitals-chip${tempWarn ? ' warn' : ''}`}><Thermometer size={11} /> {p.temperature}°C</span>
          <span className="vitals-chip" style={{ fontSize: 11 }}>BP {p.bloodPressure}</span>
        </div>

        {/* Condition */}
        <div style={{ flex: 1, minWidth: 140 }}>
          <div style={{ fontSize: 12, color: 'var(--text3)' }}>Condition</div>
          <div style={{ fontWeight: 600, fontSize: 13, marginTop: 2 }}>{p.condition}</div>
          <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>{p.doctor}</div>
        </div>

        {/* Toggle */}
        <button className="btn btn-ghost btn-sm" onClick={() => setExpanded(e => !e)}>
          {expanded ? 'Less' : 'Notes ↓'}
        </button>
      </div>

      {isHigh && (
        <div style={{ marginTop: 10, padding: '8px 12px', background: 'var(--red-soft)', borderRadius: 8, border: '1px solid var(--red-glow)' }}>
          <span style={{ color: 'var(--red)', fontSize: 12, fontWeight: 600 }}>🚨 IMMEDIATE ATTENTION REQUIRED — Critical vitals detected</span>
        </div>
      )}

      {expanded && (
        <div style={{ marginTop: 14, borderTop: '1px solid var(--border)', paddingTop: 14 }}>
          <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Doctor Notes
          </div>
          <textarea className="notes-textarea" value={note}
            onChange={e => onNoteChange(e.target.value)}
            placeholder="Add clinical notes, observations, treatment plans…" />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
            <button className="btn btn-primary btn-sm" onClick={onSave}><Save size={12} /> Save Notes</button>
            {isSaved && <span style={{ color: 'var(--green)', fontSize: 12 }}>✓ Saved</span>}
            <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text3)' }}>Admitted: {p.admittedOn}</span>
          </div>
        </div>
      )}
    </div>
  );
}
