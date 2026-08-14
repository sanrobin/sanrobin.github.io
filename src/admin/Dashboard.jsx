import { useState } from 'react';
import BioEditor from './editors/BioEditor';
import ProjectsEditor from './editors/ProjectsEditor';
import ExperienceEditor from './editors/ExperienceEditor';
import Dock from '../components/Dock/Dock';

function UserIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
}
function LayersIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>;
}
function BriefcaseIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;
}
function GlobeIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
}
function LogOutIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
}

export default function Dashboard({ token, onLogout, apiBase }) {
  const [activeTab, setActiveTab] = useState('bio');

  const username = (() => {
    try { return JSON.parse(atob(token.split('.')[1])).username; } catch { return 'admin'; }
  })();

  const tabTitles = {
    bio: 'Bio & About',
    projects: 'Projects',
    experience: 'Experience'
  };

  const dockItems = [
    {
      icon: <UserIcon />,
      label: 'Bio & About',
      onClick: () => setActiveTab('bio'),
      className: activeTab === 'bio' ? 'dock-item-active' : ''
    },
    {
      icon: <LayersIcon />,
      label: 'Projects',
      onClick: () => setActiveTab('projects'),
      className: activeTab === 'projects' ? 'dock-item-active' : ''
    },
    {
      icon: <BriefcaseIcon />,
      label: 'Experience',
      onClick: () => setActiveTab('experience'),
      className: activeTab === 'experience' ? 'dock-item-active' : ''
    },
    {
      icon: <GlobeIcon />,
      label: 'View Portfolio',
      onClick: () => window.open('/', '_blank')
    },
    {
      icon: <LogOutIcon />,
      label: 'Sign Out',
      onClick: onLogout
    }
  ];

  return (
    <div className="adm-dashboard-container">
      {/* Top Header Bar */}
      <header className="adm-topbar">
        <div className="adm-topbar-brand">
          <div className="adm-topbar-logo-icon">S</div>
          <span className="adm-topbar-logo-text">sanrobin CMS</span>
          <span className="adm-topbar-badge">{tabTitles[activeTab]}</span>
        </div>

        <div className="adm-topbar-actions">
          <div className="adm-topbar-user">
            <div className="adm-topbar-dot" />
            <span>{username}</span>
          </div>
          <button id="adm-top-logout" className="adm-top-logout-btn" onClick={onLogout} title="Sign Out">
            <LogOutIcon />
            <span className="adm-top-logout-text">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="adm-main-full">
        <div className="adm-content-container">
          {activeTab === 'bio'        && <BioEditor        token={token} apiBase={apiBase} />}
          {activeTab === 'projects'   && <ProjectsEditor   token={token} apiBase={apiBase} />}
          {activeTab === 'experience' && <ExperienceEditor token={token} apiBase={apiBase} />}
        </div>
      </main>

      {/* Floating Bottom Dock Navigation */}
      <div className="adm-dock-wrapper">
        <Dock
          items={dockItems}
          className="adm-dock-panel"
          magnification={65}
          distance={160}
          baseItemSize={46}
          panelHeight={64}
        />
      </div>
    </div>
  );
}

