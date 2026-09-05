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

function PointsField({ id, items: rawItems, onChange }) {
  const items = Array.isArray(rawItems) ? rawItems : [];
  function update(i, v) { const a = [...items]; a[i] = v; onChange(a); }
  function remove(i)    { onChange(items.filter((_, j) => j !== i)); }

  return (
    <div className="adm-field adm-field-full">
      <label className="adm-label">Key Points</label>
      {items.map((pt, i) => (
        <div key={i} className="adm-array-item">
          <div className="adm-array-index">{i + 1}</div>
          <textarea className="adm-textarea" style={{ flex: 1, minHeight: 60 }} rows={2} value={pt} onChange={e => update(i, e.target.value)} placeholder="Key point…" />
          <button type="button" className="adm-array-remove" style={{ marginTop: '0.5rem' }} onClick={() => remove(i)}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      ))}
      <button type="button" className="adm-add-btn" id={`${id}-add`} onClick={() => onChange([...items, ''])}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Add Point
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
      <button id="adm-experience-save" className="adm-save-btn" onClick={onSave} disabled={saving}>
        {saving ? <><div className="adm-spinner" style={{ width: 13, height: 13, borderWidth: 2 }} /> Saving…</> : (
          <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> Save Changes</>
        )}
      </button>
    </div>
  );
}

function emptyExp() {
  return { date: '', title: '', org: '', location: '', points: [] };
}

export default function ExperienceEditor({ token, apiBase }) {
  const { data, setData, status, statusMsg, save } = useContentEditor(token, apiBase, 'experience');

  if (status === 'loading' || !data) {
    return <div className="adm-loading"><div className="adm-spinner" /><span>Loading experience…</span></div>;
  }

  const items = data.experience || [];
  function updateItem(i, field, val) {
    const a = [...items]; a[i] = { ...a[i], [field]: val }; setData({ ...data, experience: a });
  }
  function removeItem(i) { setData({ ...data, experience: items.filter((_, j) => j !== i) }); }
  function addItem()     { setData({ ...data, experience: [...items, emptyExp()] }); }

  return (
    <>
      <div className="adm-editor-header">
        <div className="adm-editor-label">// experience.json</div>
        <h2 className="adm-editor-title">Experience</h2>
        <p className="adm-editor-desc">Add or update work experience, roles, and achievements.</p>
      </div>

      <AnimatedList
        items={items}
        showGradients={false}
        enableArrowNavigation={false}
        renderItem={(exp, i) => (
          <div key={i} className="adm-card adm-animated-card">
            <div className="adm-card-title" style={{ justifyContent: 'space-between' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                {exp.title || `Experience ${i + 1}`}
              </span>
              <button className="adm-list-delete-btn" onClick={() => removeItem(i)}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                Remove
              </button>
            </div>
            <div className="adm-field-row">
              <Field label="Date Range"    id={`exp-${i}-date`}     value={exp.date}     onChange={v => updateItem(i, 'date', v)} />
              <Field label="Title / Role"  id={`exp-${i}-title`}    value={exp.title}    onChange={v => updateItem(i, 'title', v)} />
              <Field label="Organization"  id={`exp-${i}-org`}      value={exp.org}      onChange={v => updateItem(i, 'org', v)} />
              <Field label="Location"      id={`exp-${i}-location`} value={exp.location} onChange={v => updateItem(i, 'location', v)} />
            </div>
            <PointsField id={`exp-${i}-points`} items={exp.points || []} onChange={v => updateItem(i, 'points', v)} />
          </div>
        )}
      />

      <button className="adm-add-item-btn" id="adm-add-experience" onClick={addItem}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Add Experience
      </button>

      <SaveBar status={status} statusMsg={statusMsg} onSave={() => save(data)} />
    </>
  );
}
