import { useState } from 'react';

export default function LoginPage({ onLogin, apiBase }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      onLogin(data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="adm-login-page">
      <div className="adm-login-card">
        <div className="adm-login-logo">
          <div className="adm-login-logo-icon">S</div>
          <div className="adm-login-logo-text">
            <span className="adm-login-logo-title">sanrobin</span>
            <span className="adm-login-logo-sub">Content Manager</span>
          </div>
        </div>

        <h1 className="adm-login-heading">Admin Login</h1>
        <p className="adm-login-sub">Sign in to manage your portfolio content.</p>

        {error && (
          <div className="adm-login-error" role="alert">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} autoComplete="on">
          <div className="adm-form-group">
            <label htmlFor="adm-username" className="adm-label">Username</label>
            <input
              id="adm-username"
              type="text"
              className="adm-input"
              placeholder="your username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div className="adm-form-group">
            <label htmlFor="adm-password" className="adm-label">Password</label>
            <input
              id="adm-password"
              type="password"
              className="adm-input"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <button
            id="adm-login-submit"
            type="submit"
            className="adm-btn adm-btn-primary"
            disabled={loading}
            style={{ marginTop: '0.5rem' }}
          >
            {loading ? (
              <><div className="adm-spinner" /> Signing in…</>
            ) : (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                Sign In
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
