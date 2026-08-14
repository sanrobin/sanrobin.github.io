import { useState } from 'react';
import BioEditor from './editors/BioEditor';
import ProjectsEditor from './editors/ProjectsEditor';
import ExperienceEditor from './editors/ExperienceEditor';

const TABS = [
  { id: 'bio',        label: 'Bio & About',   icon: <UserIcon /> },
  { id: 'projects',   label: 'Projects',      icon: <LayersIcon /> },
  { id: 'experience', label: 'Experience',    icon: <BriefcaseIcon /> },
];

function UserIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
}
function LayersIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>;
}
function BriefcaseIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;
}
function LogOutIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
}

export default function Dashboard({ token, onLogout, apiBase }) {
  const [activeTab, setActiveTab] = useState('bio');

  const username = (() => {
    try { return JSON.parse(atob(token.split('.')[1])).username; } catch { return 'admin'; }
  })();

  const tabLabel = TABS.find(t => t.id === activeTab)?.label || '';

  return (
    <div className="adm-shell">
      {/* Sidebar */}
      <aside className="adm-sidebar">
        <div className="adm-sidebar-logo">
          <div className="adm-sidebar-logo-icon">S</div>
          <span className="adm-sidebar-logo-text">sanrobin CMS</span>
        </div>

        <nav className="adm-nav" role="navigation" aria-label="Admin sections">
          {TABS.map(tab => (
            <button
              key={tab.id}
              id={`adm-nav-${tab.id}`}
              className={`adm-nav-item${activeTab === tab.id ? ' active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              aria-current={activeTab === tab.id ? 'page' : undefined}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="adm-sidebar-bottom">
          <button id="adm-logout-btn" className="adm-logout-btn" onClick={onLogout}>
            <LogOutIcon /> Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="adm-main">
        <header className="adm-topbar">
          <span className="adm-topbar-title">{tabLabel}</span>
          <div className="adm-topbar-user">
            <div className="adm-topbar-dot" />
            {username}
          </div>
        </header>

        <div className="adm-content">
          {activeTab === 'bio'        && <BioEditor        token={token} apiBase={apiBase} />}
          {activeTab === 'projects'   && <ProjectsEditor   token={token} apiBase={apiBase} />}
          {activeTab === 'experience' && <ExperienceEditor token={token} apiBase={apiBase} />}
        </div>
      </div>
    </div>
  );
}
