import { useState, useEffect } from 'react';
import AnimatedList from '../../components/AnimatedList/AnimatedList';

function useContentEditor(token, apiBase, file) {
  const [data, setData]     = useState(null);
  const [sha, setSha]       = useState('');
  const [status, setStatus] = useState('idle');
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    setStatus('loading');
    fetch(`${apiBase}/api/content?file=${file}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(d => { setData(d.content); setSha(d.sha); setStatus('idle'); })
      .catch(() => setStatus('error'));
  }, [file, token, apiBase]);

  async function save(updated) {
    setStatus('saving');
    try {
      const res = await fetch(`${apiBase}/api/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ file, content: updated, sha }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      if (d.sha) setSha(d.sha);
      setStatus('saved'); setStatusMsg('Saved & committed to GitHub ✓');
      setTimeout(() => setStatus('idle'), 3000);
      return true;
    } catch (err) {
      setStatus('error'); setStatusMsg(err.message || 'Save failed');
      setTimeout(() => setStatus('idle'), 4000);
      return false;
    }
  }
  return { data, setData, sha, status, statusMsg, save };
}

function Field({ label, id, value, onChange }) {
  return (
    <div className="adm-field">
      <label htmlFor={id} className="adm-label">{label}</label>
      <input id={id} type="text" className="adm-input" value={value || ''} onChange={e => onChange(e.target.value)} />
    </div>
  );
}

function TextareaField({ label, id, value, onChange, rows = 3 }) {
  return (
    <div className="adm-field">
      <label htmlFor={id} className="adm-label">{label}</label>
      <textarea id={id} className="adm-textarea" rows={rows} value={value || ''} onChange={e => onChange(e.target.value)} />
    </div>
  );
}

function TechTagsField({ id, items: rawItems, onChange }) {
  const items = Array.isArray(rawItems) ? rawItems : [];
  function update(i, v) { const a = [...items]; a[i] = v; onChange(a); }
  function remove(i)    { onChange(items.filter((_, j) => j !== i)); }

  return (
    <div className="adm-field adm-field-full">
      <label className="adm-label">Tech Stack</label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
        {items.map((tag, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <input type="text" className="adm-input" style={{ width: 120, padding: '0.35rem 0.6rem', fontSize: '0.8rem' }} value={tag} onChange={e => update(i, e.target.value)} />
            <button type="button" className="adm-array-remove" style={{ marginTop: 0, width: 24, height: 24 }} onClick={() => remove(i)}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        ))}
      </div>
      <button type="button" className="adm-add-btn" id={`${id}-add`} onClick={() => onChange([...items, ''])}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Add Tech
      </button>
    </div>
  );
}

function SaveBar({ status, statusMsg, onSave }) {
  const saving = status === 'saving';
  return (
    <div className="adm-save-bar">
      {status !== 'idle' && (
        <span className={`adm-save-status ${status === 'saved' ? 'success' : status === 'error' ? 'error' : ''}`}>
          {saving ? <><div className="adm-spinner" style={{ width: 12, height: 12, borderWidth: 2 }} /> Saving…</> : statusMsg}
        </span>
      )}
      <button id="adm-projects-save" className="adm-save-btn" onClick={onSave} disabled={saving}>
        {saving ? <><div className="adm-spinner" style={{ width: 13, height: 13, borderWidth: 2 }} /> Saving…</> : (
          <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> Save Changes</>
        )}
      </button>
    </div>
  );
}

function emptyProject() {
  return { date: '', title: '', concept: '', desc: '', tech: [] };
}

export default function ProjectsEditor({ token, apiBase }) {
  const { data, setData, status, statusMsg, save } = useContentEditor(token, apiBase, 'projects');

  if (status === 'loading' || !data) {
    return <div className="adm-loading"><div className="adm-spinner" /><span>Loading projects…</span></div>;
  }

  const projects = data.projects || [];
  function updateProject(i, field, val) {
    const a = [...projects]; a[i] = { ...a[i], [field]: val }; setData({ ...data, projects: a });
  }
  function removeProject(i) { setData({ ...data, projects: projects.filter((_, j) => j !== i) }); }
  function addProject()     { setData({ ...data, projects: [...projects, emptyProject()] }); }

  return (
    <>
      <div className="adm-editor-header">
        <div className="adm-editor-label">// projects.json</div>
        <h2 className="adm-editor-title">Projects</h2>
        <p className="adm-editor-desc">Add, edit, or remove portfolio projects.</p>
      </div>

      <AnimatedList
        items={projects}
        showGradients={false}
        enableArrowNavigation={false}
        renderItem={(proj, i) => (
          <div key={i} className="adm-card adm-animated-card">
            <div className="adm-card-title" style={{ justifyContent: 'space-between' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
                {proj.title || `Project ${i + 1}`}
              </span>
              <button className="adm-list-delete-btn" onClick={() => removeProject(i)}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                Remove
              </button>
            </div>
            <div className="adm-field-row">
              <Field label="Date Range" id={`proj-${i}-date`}    value={proj.date}    onChange={v => updateProject(i, 'date', v)} />
              <Field label="Title"      id={`proj-${i}-title`}   value={proj.title}   onChange={v => updateProject(i, 'title', v)} />
              <Field label="Concept"    id={`proj-${i}-concept`} value={proj.concept} onChange={v => updateProject(i, 'concept', v)} />
            </div>
            <TextareaField label="Description" id={`proj-${i}-desc`} value={proj.desc} rows={3} onChange={v => updateProject(i, 'desc', v)} />
            <TechTagsField id={`proj-${i}-tech`} items={proj.tech || []} onChange={v => updateProject(i, 'tech', v)} />
          </div>
        )}
      />

      <button className="adm-add-item-btn" id="adm-add-project" onClick={addProject}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Add Project
      </button>

      <SaveBar status={status} statusMsg={statusMsg} onSave={() => save(data)} />
    </>
  );
}
