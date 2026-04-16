const express = require('express');
const cors = require('cors');
const http = require('http');
const { WebSocketServer } = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(cors());
app.use(express.json());

// ─── SINGLE ADMIN USER (all features unlocked) ───────────────────────────────
const users = [
  { id: 1, username: 'admin', password: 'admin123', role: 'Admin', name: 'Hospital Admin', avatar: 'HA', department: 'Administration' },
];

// ─── PATIENTS ────────────────────────────────────────────────────────────────
const patients = [
  { id: 'P001', name: 'Arjun Kapoor',  age: 67, gender: 'Male',   condition: 'Acute MI',         riskLevel: 'High',   heartRate: 118, spo2: 91,  temperature: 38.9, bloodPressure: '158/98',  ward: 'ICU-A',      doctor: 'Dr. Priya Sharma', admittedOn: '2024-01-10', notes: 'Requires immediate cardiac intervention. Family notified.' },
  { id: 'P002', name: 'Meera Patel',   age: 54, gender: 'Female', condition: 'Hypertension',     riskLevel: 'Medium', heartRate: 88,  spo2: 96,  temperature: 37.2, bloodPressure: '142/92',  ward: 'Gen-B',      doctor: 'Dr. Priya Sharma', admittedOn: '2024-01-11', notes: 'Stable. Monitor BP every 2 hours.' },
  { id: 'P003', name: 'Vikram Singh',  age: 45, gender: 'Male',   condition: 'Pneumonia',        riskLevel: 'Medium', heartRate: 96,  spo2: 94,  temperature: 38.1, bloodPressure: '128/84',  ward: 'Gen-C',      doctor: 'Dr. Rajan Verma',  admittedOn: '2024-01-12', notes: 'Antibiotic course in progress.' },
  { id: 'P004', name: 'Sunita Reddy',  age: 72, gender: 'Female', condition: 'Stroke',           riskLevel: 'High',   heartRate: 105, spo2: 93,  temperature: 37.8, bloodPressure: '168/102', ward: 'ICU-B',      doctor: 'Dr. Aisha Khan',   admittedOn: '2024-01-09', notes: 'Post-stroke recovery. PT session scheduled.' },
  { id: 'P005', name: 'Rohit Kumar',   age: 38, gender: 'Male',   condition: 'Appendicitis',     riskLevel: 'Low',    heartRate: 78,  spo2: 98,  temperature: 37.0, bloodPressure: '120/80',  ward: 'Surgical-A', doctor: 'Dr. Dev Malhotra', admittedOn: '2024-01-13', notes: 'Post-op day 1. Vitals stable.' },
  { id: 'P006', name: 'Kavita Joshi',  age: 61, gender: 'Female', condition: 'COPD',             riskLevel: 'High',   heartRate: 112, spo2: 89,  temperature: 38.3, bloodPressure: '138/88',  ward: 'ICU-A',      doctor: 'Dr. Priya Sharma', admittedOn: '2024-01-08', notes: 'Oxygen supplementation ongoing.' },
  { id: 'P007', name: 'Amit Sharma',   age: 29, gender: 'Male',   condition: 'Fracture (Femur)', riskLevel: 'Low',    heartRate: 74,  spo2: 99,  temperature: 36.8, bloodPressure: '118/76',  ward: 'Orthopedic', doctor: 'Dr. Dev Malhotra', admittedOn: '2024-01-13', notes: 'Cast applied. Physiotherapy referral given.' },
  { id: 'P008', name: 'Pooja Nair',    age: 43, gender: 'Female', condition: 'Diabetes Type 2',  riskLevel: 'Medium', heartRate: 82,  spo2: 97,  temperature: 37.1, bloodPressure: '132/86',  ward: 'Gen-A',      doctor: 'Dr. Rajan Verma',  admittedOn: '2024-01-11', notes: 'Insulin dosage adjusted.' },
  { id: 'P009', name: 'Suresh Iyer',   age: 78, gender: 'Male',   condition: 'Heart Failure',    riskLevel: 'High',   heartRate: 108, spo2: 90,  temperature: 37.5, bloodPressure: '152/96',  ward: 'ICU-C',      doctor: 'Dr. Aisha Khan',   admittedOn: '2024-01-07', notes: 'Diuretics administered. Echo scheduled.' },
  { id: 'P010', name: 'Lakshmi Devi',  age: 55, gender: 'Female', condition: 'Kidney Stone',     riskLevel: 'Low',    heartRate: 80,  spo2: 98,  temperature: 36.9, bloodPressure: '122/78',  ward: 'Urology',    doctor: 'Dr. Rajan Verma',  admittedOn: '2024-01-12', notes: 'Lithotripsy planned.' },
  { id: 'P011', name: 'Deepak Rao',    age: 50, gender: 'Male',   condition: 'Liver Cirrhosis',  riskLevel: 'Medium', heartRate: 91,  spo2: 95,  temperature: 37.4, bloodPressure: '136/88',  ward: 'Gen-D',      doctor: 'Dr. Priya Sharma', admittedOn: '2024-01-10', notes: 'Hepatology review pending.' },
  { id: 'P012', name: 'Geeta Mishra',  age: 34, gender: 'Female', condition: 'Preeclampsia',     riskLevel: 'High',   heartRate: 101, spo2: 94,  temperature: 38.0, bloodPressure: '162/104', ward: 'Maternity',  doctor: 'Dr. Aisha Khan',   admittedOn: '2024-01-13', notes: 'Continuous fetal monitoring.' },
];

let appointments = [
  { id: 'A001', patientId: 'P001', patientName: 'Arjun Kapoor',  age: 67, riskLevel: 'High',   timeSlot: '08:00', doctor: 'Dr. Priya Sharma', type: 'Emergency Review',   status: 'Confirmed',   date: new Date().toISOString().split('T')[0] },
  { id: 'A002', patientId: 'P004', patientName: 'Sunita Reddy',  age: 72, riskLevel: 'High',   timeSlot: '08:30', doctor: 'Dr. Aisha Khan',   type: 'Neuro Assessment',   status: 'Confirmed',   date: new Date().toISOString().split('T')[0] },
  { id: 'A003', patientId: 'P006', patientName: 'Kavita Joshi',  age: 61, riskLevel: 'High',   timeSlot: '09:00', doctor: 'Dr. Priya Sharma', type: 'Pulmonology Review', status: 'In Progress', date: new Date().toISOString().split('T')[0] },
  { id: 'A004', patientId: 'P009', patientName: 'Suresh Iyer',   age: 78, riskLevel: 'High',   timeSlot: '09:30', doctor: 'Dr. Aisha Khan',   type: 'Cardiology Check',   status: 'Waiting',     date: new Date().toISOString().split('T')[0] },
  { id: 'A005', patientId: 'P012', patientName: 'Geeta Mishra',  age: 34, riskLevel: 'High',   timeSlot: '10:00', doctor: 'Dr. Aisha Khan',   type: 'OB Emergency',       status: 'Waiting',     date: new Date().toISOString().split('T')[0] },
  { id: 'A006', patientId: 'P002', patientName: 'Meera Patel',   age: 54, riskLevel: 'Medium', timeSlot: '10:30', doctor: 'Dr. Priya Sharma', type: 'BP Follow-up',       status: 'Confirmed',   date: new Date().toISOString().split('T')[0] },
  { id: 'A007', patientId: 'P003', patientName: 'Vikram Singh',  age: 45, riskLevel: 'Medium', timeSlot: '11:00', doctor: 'Dr. Rajan Verma',  type: 'X-Ray Review',       status: 'Confirmed',   date: new Date().toISOString().split('T')[0] },
  { id: 'A008', patientId: 'P008', patientName: 'Pooja Nair',    age: 43, riskLevel: 'Medium', timeSlot: '11:30', doctor: 'Dr. Rajan Verma',  type: 'Diabetology Review', status: 'Scheduled',   date: new Date().toISOString().split('T')[0] },
  { id: 'A009', patientId: 'P011', patientName: 'Deepak Rao',    age: 50, riskLevel: 'Medium', timeSlot: '12:00', doctor: 'Dr. Priya Sharma', type: 'Hepatology Consult', status: 'Scheduled',   date: new Date().toISOString().split('T')[0] },
  { id: 'A010', patientId: 'P005', patientName: 'Rohit Kumar',   age: 38, riskLevel: 'Low',    timeSlot: '13:00', doctor: 'Dr. Dev Malhotra', type: 'Post-Op Checkup',    status: 'Scheduled',   date: new Date().toISOString().split('T')[0] },
  { id: 'A011', patientId: 'P007', patientName: 'Amit Sharma',   age: 29, riskLevel: 'Low',    timeSlot: '13:30', doctor: 'Dr. Dev Malhotra', type: 'Ortho Follow-up',    status: 'Scheduled',   date: new Date().toISOString().split('T')[0] },
  { id: 'A012', patientId: 'P010', patientName: 'Lakshmi Devi',  age: 55, riskLevel: 'Low',    timeSlot: '14:00', doctor: 'Dr. Rajan Verma',  type: 'Urology Consult',    status: 'Scheduled',   date: new Date().toISOString().split('T')[0] },
];

const beds = {
  'ICU-A':     { total: 8,  occupied: 6, ward: 'ICU' },
  'ICU-B':     { total: 6,  occupied: 5, ward: 'ICU' },
  'ICU-C':     { total: 6,  occupied: 4, ward: 'ICU' },
  'Gen-A':     { total: 20, occupied: 14,ward: 'General' },
  'Gen-B':     { total: 20, occupied: 11,ward: 'General' },
  'Gen-C':     { total: 20, occupied: 13,ward: 'General' },
  'Gen-D':     { total: 20, occupied: 9, ward: 'General' },
  'Surgical-A':{ total: 12, occupied: 7, ward: 'Surgical' },
  'Orthopedic':{ total: 10, occupied: 5, ward: 'Orthopedic' },
  'Maternity': { total: 15, occupied: 8, ward: 'Maternity' },
  'Urology':   { total: 8,  occupied: 3, ward: 'Urology' },
};

const doctors = [
  { id: 'D001', name: 'Dr. Priya Sharma', specialty: 'Cardiology',   patients: 4, maxPatients: 8, status: 'Active' },
  { id: 'D002', name: 'Dr. Aisha Khan',   specialty: 'Neurology',    patients: 3, maxPatients: 6, status: 'Active' },
  { id: 'D003', name: 'Dr. Rajan Verma',  specialty: 'Internal Med', patients: 3, maxPatients: 8, status: 'Active' },
  { id: 'D004', name: 'Dr. Dev Malhotra', specialty: 'Surgery',      patients: 2, maxPatients: 6, status: 'In Surgery' },
];

let notifications = [
  { id: 'N001', type: 'critical', message: 'Patient P001 Arjun Kapoor – SpO2 dropped to 91%. Immediate attention required.', time: new Date(Date.now()-5*60000).toISOString(), read: false },
  { id: 'N002', type: 'critical', message: 'Patient P006 Kavita Joshi – SpO2 critically low at 89%. Oxygen needed.', time: new Date(Date.now()-12*60000).toISOString(), read: false },
  { id: 'N003', type: 'warning',  message: 'Patient P009 Suresh Iyer – Heart rate elevated to 108 bpm.', time: new Date(Date.now()-20*60000).toISOString(), read: false },
  { id: 'N004', type: 'info',     message: 'Appointment A006 for Meera Patel confirmed at 10:30 AM.', time: new Date(Date.now()-35*60000).toISOString(), read: true },
  { id: 'N005', type: 'warning',  message: 'ICU-A bed occupancy at 75%. Consider patient transfer planning.', time: new Date(Date.now()-60*60000).toISOString(), read: true },
];

// ─── AUTH ─────────────────────────────────────────────────────────────────────
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const { password: _, ...safeUser } = user;
  res.json({ user: safeUser, token: `token_${safeUser.id}_${Date.now()}` });
});

// ─── PATIENTS ─────────────────────────────────────────────────────────────────
app.get('/api/patients', (req, res) => {
  const live = patients.map(p => ({
    ...p,
    heartRate:   Math.max(40, Math.min(180, p.heartRate + Math.floor(Math.random()*5-2))),
    spo2:        Math.max(80, Math.min(100, p.spo2 + Math.floor(Math.random()*3-1))),
    temperature: parseFloat((p.temperature + (Math.random()*0.2-0.1)).toFixed(1)),
    ecgData:     generateECG(p.riskLevel),
    lastUpdated: new Date().toISOString(),
  }));
  res.json(live);
});

app.get('/api/patients/:id', (req, res) => {
  const p = patients.find(p => p.id === req.params.id);
  if (!p) return res.status(404).json({ error: 'Not found' });
  res.json({ ...p, ecgData: generateECG(p.riskLevel) });
});

app.patch('/api/patients/:id/notes', (req, res) => {
  const p = patients.find(p => p.id === req.params.id);
  if (!p) return res.status(404).json({ error: 'Not found' });
  p.notes = req.body.notes;
  res.json({ success: true });
});

// ─── APPOINTMENTS ─────────────────────────────────────────────────────────────
app.get('/api/appointments', (req, res) => {
  const sorted = [...appointments].sort((a, b) => {
    const r = { High: 0, Medium: 1, Low: 2 };
    if (r[a.riskLevel] !== r[b.riskLevel]) return r[a.riskLevel] - r[b.riskLevel];
    return b.age - a.age;
  });
  res.json(sorted);
});

app.patch('/api/appointments/:id', (req, res) => {
  const a = appointments.find(a => a.id === req.params.id);
  if (!a) return res.status(404).json({ error: 'Not found' });
  Object.assign(a, req.body);
  broadcastUpdate({ type: 'APPOINTMENT_UPDATE', data: a });
  res.json(a);
});

// ─── BEDS ─────────────────────────────────────────────────────────────────────
app.get('/api/beds', (req, res) => {
  res.json(Object.entries(beds).map(([ward, d]) => ({
    ward, ...d,
    available: d.total - d.occupied,
    occupancyPct: Math.round((d.occupied / d.total) * 100),
    waitingTime: Math.round((d.occupied / d.total) * 45),
  })));
});

// ─── DOCTORS ──────────────────────────────────────────────────────────────────
app.get('/api/doctors', (req, res) => res.json(doctors));

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────
app.get('/api/notifications', (req, res) => res.json(notifications));
app.patch('/api/notifications/:id/read', (req, res) => {
  const n = notifications.find(n => n.id === req.params.id);
  if (n) n.read = true;
  res.json({ success: true });
});
app.patch('/api/notifications/read-all', (req, res) => {
  notifications.forEach(n => n.read = true);
  res.json({ success: true });
});

// ─── ANALYTICS ────────────────────────────────────────────────────────────────
app.get('/api/analytics/overview', (req, res) => {
  const high   = patients.filter(p => p.riskLevel === 'High').length;
  const medium = patients.filter(p => p.riskLevel === 'Medium').length;
  const low    = patients.filter(p => p.riskLevel === 'Low').length;
  const icuOccupied = ['ICU-A','ICU-B','ICU-C'].reduce((s,w) => s + beds[w].occupied, 0);
  const icuTotal    = ['ICU-A','ICU-B','ICU-C'].reduce((s,w) => s + beds[w].total, 0);
  res.json({
    totalPatients: patients.length,
    totalAppointments: appointments.length,
    highRisk: high, mediumRisk: medium, lowRisk: low,
    icuOccupied, icuTotal,
    avgHeartRate: Math.round(patients.reduce((s,p)=>s+p.heartRate,0)/patients.length),
    avgSpo2:      Math.round(patients.reduce((s,p)=>s+p.spo2,0)/patients.length),
    criticalAlerts: notifications.filter(n=>n.type==='critical'&&!n.read).length,
  });
});

// FIXED: stable, realistic trend data (no random spikes)
app.get('/api/analytics/trends', (req, res) => {
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const basePatients = [48, 52, 49, 55, 51, 47, 50];
  const baseAdmit    = [8,  10,  7,  11,  9,  6,  8];
  const baseDisch    = [6,   8,  7,   9,  8,  5,  7];
  const baseHigh     = [4,   5,  4,   6,  5,  4,  5];
  const baseMed      = [5,   5,  6,   5,  5,  4,  4];
  const baseLow      = [3,   3,  4,   3,  3,  3,  3];
  res.json({
    patientTrend: days.map((d,i) => ({ day: d, patients: basePatients[i] })),
    riskTrend:    days.map((d,i) => ({ day: d, high: baseHigh[i], medium: baseMed[i], low: baseLow[i] })),
    admissions:   days.map((d,i) => ({ day: d, admitted: baseAdmit[i], discharged: baseDisch[i] })),
  });
});

app.get('/api/analytics/ai-insights', (req, res) => {
  const highRisk = patients.filter(p => p.riskLevel === 'High');
  const icuOcc   = Math.round(
    ['ICU-A','ICU-B','ICU-C'].reduce((s,w)=>s+beds[w].occupied,0) /
    ['ICU-A','ICU-B','ICU-C'].reduce((s,w)=>s+beds[w].total,0) * 100
  );
  res.json({
    urgentCare: highRisk.map(p => ({
      patientId: p.id, name: p.name,
      reason: `${p.condition} — HR: ${p.heartRate}, SpO₂: ${p.spo2}%`,
      urgency: p.spo2 < 92 ? 'Critical' : 'High',
    })),
    predictions: {
      tomorrowLoad: patients.length + 3,
      icuDemand: icuOcc > 75 ? 'High' : icuOcc > 50 ? 'Moderate' : 'Low',
      icuOccupancy: icuOcc,
      peakHour: '10:00 – 12:00',
      suggestedStaff: icuOcc > 75 ? 'Add 2 nurses to ICU' : 'Current staffing adequate',
    },
    riskTrends: [
      { insight: 'High-risk patient count increased 20% vs last week', severity: 'warning' },
      { insight: 'SpO2 levels improving in ICU-A patients', severity: 'positive' },
      { insight: 'Appointment no-show rate: 8% (below 15% threshold)', severity: 'positive' },
      { insight: `ICU occupancy at ${icuOcc}% — consider early discharge planning`, severity: icuOcc > 75 ? 'critical' : 'info' },
    ],
  });
});

app.get('/api/reports/export', (req, res) => {
  res.setHeader('Content-Disposition', 'attachment; filename=pulsetech-report.json');
  res.json({
    generatedAt: new Date().toISOString(),
    summary: { totalPatients: patients.length, highRisk: patients.filter(p=>p.riskLevel==='High').length },
    patients: patients.map(({id,name,age,condition,riskLevel,ward,doctor})=>({id,name,age,condition,riskLevel,ward,doctor})),
    appointments: appointments.map(({id,patientName,timeSlot,status,type})=>({id,patientName,timeSlot,status,type})),
  });
});

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function generateECG(riskLevel) {
  const pts = [];
  for (let i = 0; i < 60; i++) {
    const pos = i % 15;
    let v = 0;
    if (pos === 3) v = 0.3;
    else if (pos === 5) v = -0.1;
    else if (pos === 6) v = riskLevel === 'High' ? 1.8 : 1.4;
    else if (pos === 7) v = -0.5;
    else if (pos === 8) v = 0.2;
    else if (pos >= 10 && pos <= 12) v = 0.15;
    if (riskLevel === 'High') v += (Math.random()-0.5)*0.2;
    else if (riskLevel === 'Medium') v += (Math.random()-0.5)*0.08;
    pts.push(parseFloat(v.toFixed(3)));
  }
  return pts;
}

function broadcastUpdate(data) {
  wss.clients.forEach(c => { if (c.readyState === 1) c.send(JSON.stringify(data)); });
}

wss.on('connection', ws => {
  ws.send(JSON.stringify({ type: 'CONNECTED', message: 'Real-time sync active' }));
});

setInterval(() => {
  broadcastUpdate({
    type: 'VITALS_UPDATE',
    data: patients.map(p => ({
      id: p.id,
      heartRate:   Math.max(40, Math.min(180, p.heartRate + Math.floor(Math.random()*4-2))),
      spo2:        Math.max(80, Math.min(100, p.spo2 + Math.floor(Math.random()*2-1))),
      temperature: parseFloat((p.temperature + (Math.random()*0.2-0.1)).toFixed(1)),
      lastUpdated: new Date().toISOString(),
    })),
  });
}, 5000);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`✅ PulseTech API running on http://localhost:${PORT}`));
