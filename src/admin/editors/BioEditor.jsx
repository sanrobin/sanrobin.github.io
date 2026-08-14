import { useState, useEffect, useCallback } from 'react';

function useContentEditor(token, apiBase, file) {
  const [data, setData]     = useState(null);
  const [sha, setSha]       = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | saving | saved | error
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
      setSha(''); // will refetch on next load; force reload for fresh sha
      setStatus('saved');
      setStatusMsg('Saved & committed to GitHub ✓');
      setTimeout(() => setStatus('idle'), 3000);
      return true;
    } catch (err) {
      setStatus('error');
      setStatusMsg(err.message || 'Save failed');
      setTimeout(() => setStatus('idle'), 4000);
      return false;
    }
  }

  return { data, setData, sha, status, statusMsg, save };
}

// --- Small reusable pieces ---

function Field({ label, id, value, onChange, type = 'text' }) {
  return (
    <div className="adm-field">
      <label htmlFor={id} className="adm-label">{label}</label>
      <input id={id} type={type} className="adm-input" value={value || ''} onChange={e => onChange(e.target.value)} />
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

function ArrayField({ label, id, items, onChange, placeholder = 'Add item…' }) {
  function update(i, val) { const a = [...items]; a[i] = val; onChange(a); }
  function remove(i)      { onChange(items.filter((_, idx) => idx !== i)); }
  function add()          { onChange([...items, '']); }

  return (
    <div className="adm-field adm-field-full">
      <label className="adm-label">{label}</label>
      {items.map((item, i) => (
        <div key={i} className="adm-array-item">
          <div className="adm-array-index">{i + 1}</div>
          <input type="text" className="adm-input" style={{ flex: 1 }} value={item} onChange={e => update(i, e.target.value)} placeholder={placeholder} />
          <button type="button" className="adm-array-remove" onClick={() => remove(i)} aria-label="Remove item" title="Remove">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      ))}
      <button type="button" className="adm-add-btn" onClick={add} id={`${id}-add`}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Add {label}
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
      <button id="adm-bio-save" className="adm-save-btn" onClick={onSave} disabled={saving}>
        {saving ? <><div className="adm-spinner" style={{ width: 13, height: 13, borderWidth: 2 }} /> Saving…</> : (
          <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> Save Changes</>
        )}
      </button>
    </div>
  );
}

// ---- Main BioEditor ----

export default function BioEditor({ token, apiBase }) {
  const { data, setData, status, statusMsg, save } = useContentEditor(token, apiBase, 'bio');

  const set = useCallback((field, val) => setData(d => ({ ...d, [field]: val })), [setData]);

  if (status === 'loading' || !data) {
    return <div className="adm-loading"><div className="adm-spinner" /><span>Loading bio data…</span></div>;
  }

  async function handleSave() { await save(data); }

  return (
    <>
      <div className="adm-editor-header">
        <div className="adm-editor-label">// bio.json</div>
        <h2 className="adm-editor-title">Bio & About</h2>
        <p className="adm-editor-desc">Edit your personal information, skills, certifications, and interests.</p>
      </div>

      {/* Identity */}
      <div className="adm-card">
        <div className="adm-card-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          Identity
        </div>
        <div className="adm-field-row">
          <Field label="Full Name"   id="bio-name"   value={data.name}   onChange={v => set('name', v)} />
          <Field label="Handle"      id="bio-handle" value={data.handle} onChange={v => set('handle', v)} />
          <Field label="Title"       id="bio-title"  value={data.title}  onChange={v => set('title', v)} />
          <Field label="Status"      id="bio-status" value={data.status} onChange={v => set('status', v)} />
          <Field label="Email" type="email" id="bio-email" value={data.email} onChange={v => set('email', v)} />
          <Field label="Education"   id="bio-edu"    value={data.education} onChange={v => set('education', v)} />
        </div>
        <TextareaField label="Hero Subtitle" id="bio-subtitle" value={data.heroSubtitle} onChange={v => set('heroSubtitle', v)} />
        <Field label="Current Focus" id="bio-focus" value={data.currentFocus} onChange={v => set('currentFocus', v)} />
        <Field label="Languages"     id="bio-langs"  value={data.languages}    onChange={v => set('languages', v)} />
      </div>

      {/* About Paragraphs */}
      <div className="adm-card">
        <div className="adm-card-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/></svg>
          About Paragraphs
        </div>
        {(data.aboutParagraphs || []).map((p, i) => (
          <div key={i} className="adm-array-item" style={{ alignItems: 'flex-start' }}>
            <div className="adm-array-index" style={{ marginTop: '0.75rem' }}>{i + 1}</div>
            <textarea className="adm-textarea" style={{ flex: 1 }} rows={4} value={p} onChange={e => { const a = [...data.aboutParagraphs]; a[i] = e.target.value; set('aboutParagraphs', a); }} />
            <button type="button" className="adm-array-remove" style={{ marginTop: '0.75rem' }} onClick={() => set('aboutParagraphs', data.aboutParagraphs.filter((_, j) => j !== i))}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        ))}
        <button type="button" className="adm-add-btn" onClick={() => set('aboutParagraphs', [...(data.aboutParagraphs || []), ''])}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Paragraph
        </button>
      </div>

      {/* Skills */}
      <div className="adm-card">
        <div className="adm-card-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
          Skills
        </div>
        {(data.skills || []).map((skill, i) => (
          <div key={i} className="adm-list-item-card">
            <div className="adm-list-item-header">
              <span className="adm-list-item-num">Skill Group {i + 1}</span>
              <button className="adm-list-delete-btn" onClick={() => set('skills', data.skills.filter((_, j) => j !== i))}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                Remove
              </button>
            </div>
            <div className="adm-field-row">
              <Field label="Icon Key" id={`skill-${i}-icon`} value={skill.icon} onChange={v => { const a = [...data.skills]; a[i] = { ...a[i], icon: v }; set('skills', a); }} />
              <Field label="Title"    id={`skill-${i}-title`} value={skill.title} onChange={v => { const a = [...data.skills]; a[i] = { ...a[i], title: v }; set('skills', a); }} />
            </div>
            <ArrayField
              label="Items" id={`skill-${i}-items`}
              items={skill.items || []}
              placeholder="e.g. Python"
              onChange={items => { const a = [...data.skills]; a[i] = { ...a[i], items }; set('skills', a); }}
            />
          </div>
        ))}
        <button className="adm-add-item-btn" onClick={() => set('skills', [...(data.skills || []), { icon: 'code', title: '', items: [] }])}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Skill Group
        </button>
      </div>

      {/* Certifications */}
      <div className="adm-card">
        <div className="adm-card-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>
          Certifications
        </div>
        {(data.certifications || []).map((cert, i) => (
          <div key={i} className="adm-list-item-card">
            <div className="adm-list-item-header">
              <span className="adm-list-item-num">Category {i + 1}</span>
              <button className="adm-list-delete-btn" onClick={() => set('certifications', data.certifications.filter((_, j) => j !== i))}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                Remove
              </button>
            </div>
            <div className="adm-field-row">
              <Field label="Category" id={`cert-${i}-cat`} value={cert.category} onChange={v => { const a = [...data.certifications]; a[i] = { ...a[i], category: v }; set('certifications', a); }} />
              <Field label="Icon"     id={`cert-${i}-icon`} value={cert.icon} onChange={v => { const a = [...data.certifications]; a[i] = { ...a[i], icon: v }; set('certifications', a); }} />
            </div>
            <ArrayField
              label="Certs" id={`cert-${i}-items`}
              items={cert.items || []}
              placeholder="Certificate name…"
              onChange={items => { const a = [...data.certifications]; a[i] = { ...a[i], items }; set('certifications', a); }}
            />
          </div>
        ))}
        <button className="adm-add-item-btn" onClick={() => set('certifications', [...(data.certifications || []), { category: '', icon: 'award', items: [] }])}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Category
        </button>
      </div>

      {/* Interests */}
      <div className="adm-card">
        <div className="adm-card-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          Interests
        </div>
        {(data.interests || []).map((item, i) => (
          <div key={i} className="adm-list-item-card">
            <div className="adm-list-item-header">
              <span className="adm-list-item-num">Interest {i + 1}</span>
              <button className="adm-list-delete-btn" onClick={() => set('interests', data.interests.filter((_, j) => j !== i))}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                Remove
              </button>
            </div>
            <div className="adm-field-row">
              <Field label="Icon Key" id={`int-${i}-icon`} value={item.icon} onChange={v => { const a = [...data.interests]; a[i] = { ...a[i], icon: v }; set('interests', a); }} />
              <Field label="Title"    id={`int-${i}-title`} value={item.title} onChange={v => { const a = [...data.interests]; a[i] = { ...a[i], title: v }; set('interests', a); }} />
            </div>
            <TextareaField label="Description" id={`int-${i}-desc`} value={item.desc} rows={2}
              onChange={v => { const a = [...data.interests]; a[i] = { ...a[i], desc: v }; set('interests', a); }} />
          </div>
        ))}
        <button className="adm-add-item-btn" onClick={() => set('interests', [...(data.interests || []), { icon: 'star', title: '', desc: '' }])}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Interest
        </button>
      </div>

      <SaveBar status={status} statusMsg={statusMsg} onSave={handleSave} />
    </>
  );
}
