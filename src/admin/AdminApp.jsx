import { useState, useEffect } from 'react';
import LoginPage from './LoginPage';
import Dashboard from './Dashboard';
import DotField from '../components/DotField/DotField';
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

  return (
    <div className="adm-wrapper">
      <div className="adm-bg-layer" aria-hidden="true">
        <DotField
          dotRadius={1.5}
          dotSpacing={14}
          bulgeStrength={67}
          glowRadius={180}
          sparkle={true}
          waveAmplitude={0}
          gradientFrom="rgba(220, 20, 60, 0.45)"
          gradientTo="rgba(232, 117, 26, 0.35)"
          glowColor="rgba(220, 20, 60, 0.15)"
        />
      </div>

      <div className="adm-foreground">
        {checking ? (
          <div className="adm-loading">
            <div className="adm-spinner" />
            <span>Checking session…</span>
          </div>
        ) : token ? (
          <Dashboard token={token} onLogout={handleLogout} apiBase={API} />
        ) : (
          <LoginPage onLogin={handleLogin} apiBase={API} />
        )}
      </div>
    </div>
  );
}

