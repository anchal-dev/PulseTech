import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, User } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const [form, setForm]     = useState({ username: 'admin', password: 'admin123' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try { await login(form.username, form.password); }
    catch { setError('Invalid username or password.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="login-page">
      <div className="login-bg" />
      <div>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <img
            src="/pulsetech-logo.jpg"
            alt="PulseTech Logo"
            style={{ width: 96, height: 96, borderRadius: 24, objectFit: 'cover', marginBottom: 14, boxShadow: '0 8px 32px rgba(79,142,247,0.25)' }}
          />
          <div style={{ fontFamily: 'var(--font-head)', fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em' }}>PulseTech</div>
          <div style={{ color: 'var(--text3)', fontSize: 13, marginTop: 4 }}>Hospital Intelligence Dashboard</div>
        </div>

        <div className="login-card">
          <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Admin Sign In</h2>
          <p style={{ color: 'var(--text3)', fontSize: 13, marginBottom: 24 }}>Full access to all hospital features</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <div style={{ position: 'relative' }}>
                <User size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)' }} />
                <input
                  className="form-input"
                  style={{ paddingLeft: 32, width: '100%' }}
                  placeholder="admin"
                  value={form.username}
                  onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)' }} />
                <input
                  className="form-input"
                  style={{ paddingLeft: 32, width: '100%' }}
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                />
              </div>
            </div>

            {error && (
              <p style={{ color: 'var(--red)', fontSize: 13, marginBottom: 12 }}>⚠ {error}</p>
            )}

            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: 4, fontSize: 14 }}>
              {loading ? 'Signing in…' : '→  Sign In to Dashboard'}
            </button>
          </form>

          <div className="divider" />

          {/* Quick fill hint */}
          <div style={{
            padding: '10px 14px', borderRadius: 10,
            background: 'var(--bg3)', border: '1px solid var(--border)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div>
              <div style={{ fontSize: 12, color: 'var(--text2)', fontWeight: 600 }}>Default credentials</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>
                admin / admin123
              </div>
            </div>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setForm({ username: 'admin', password: 'admin123' })}>
              Fill
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
