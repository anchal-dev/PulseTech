const BASE = 'https://pulsetech-backend.onrender.com';

async function request(path, options = {}) {
  const token = localStorage.getItem('pt_token');
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  if (!res.ok) throw new Error((await res.json()).error || 'API error');
  return res.json();
}

export const api = {
  login:               (creds)         => request('/auth/login', { method: 'POST', body: creds }),
  getPatients:         ()              => request('/patients'),
  getPatient:          (id)            => request(`/patients/${id}`),
  updateNotes:         (id, notes)     => request(`/patients/${id}/notes`, { method: 'PATCH', body: { notes } }),
  getAppointments:     ()              => request('/appointments'),
  updateAppointment:   (id, data)      => request(`/appointments/${id}`, { method: 'PATCH', body: data }),
  getBeds:             ()              => request('/beds'),
  getDoctors:          ()              => request('/doctors'),
  getNotifications:    ()              => request('/notifications'),
  markRead:            (id)            => request(`/notifications/${id}/read`, { method: 'PATCH' }),
  markAllRead:         ()              => request('/notifications/read-all', { method: 'PATCH' }),
  getOverview:         ()              => request('/analytics/overview'),
  getTrends:           ()              => request('/analytics/trends'),
  getAIInsights:       ()              => request('/analytics/ai-insights'),
  exportReport:        ()              => `${BASE}/reports/export`,
};
