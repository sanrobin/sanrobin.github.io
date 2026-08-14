import { useState, useEffect } from 'react';
import LoginPage from './LoginPage';
import Dashboard from './Dashboard';
import './admin.css';

const API = import.meta.env.VITE_API_URL || 'https://sanrobin-github-io-git-main-phoenix-f59c.vercel.app';

export { API };

export default function AdminApp() {
  const [token, setToken] = useState(() => sessionStorage.getItem('adm_token'));
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Quick token presence check (JWT expiry is enforced server-side)
    if (token) {
      const [, payload] = token.split('.');
      try {
        const { exp } = JSON.parse(atob(payload));
        if (Date.now() / 1000 > exp) {
          sessionStorage.removeItem('adm_token');
          setToken(null);
        }
      } catch {
        setToken(null);
      }
    }
    setChecking(false);
  }, [token]);

  function handleLogin(t) {
    sessionStorage.setItem('adm_token', t);
    setToken(t);
  }

  function handleLogout() {
    sessionStorage.removeItem('adm_token');
    setToken(null);
  }

  if (checking) {
    return (
      <div className="adm-loading">
        <div className="adm-spinner" />
        <span>Checking session…</span>
      </div>
    );
  }

  return token
    ? <Dashboard token={token} onLogout={handleLogout} apiBase={API} />
    : <LoginPage onLogin={handleLogin} apiBase={API} />;
}
