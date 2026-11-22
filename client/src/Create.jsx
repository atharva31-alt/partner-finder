import { useState } from 'react';
import api from './api';
import { Ic, SP } from './icons';

const LV = ['Beginner', 'Intermediate', 'Advanced'];
const dflt = () => new Date(Date.now() + 2 * 36e5 - new Date().getTimezoneOffset() * 6e4).toISOString().slice(0, 16);

export default function Create({ reload, toast }) {
  const [f, setF] = useState({ title: '', sport: 'Football', skill: 'Intermediate', venue: '', time: dflt(), slots: 6, description: '' });
  const [err, setErr] = useState('');
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async () => {
    setErr('');
    if (!f.title.trim() || !f.venue.trim()) return setErr('Title and venue are required.');
    if (!(new Date(f.time) > new Date())) return setErr('Pick a future date and time.');
    try {
      await api.post('/matches', { ...f, time: new Date(f.time).toISOString() });
      await reload(); toast('Invite published'); location.hash = 'hosted';
    } catch (e) { setErr(e.response?.data?.message || 'Could not create the invite.'); }
  };

  return (
    <div className="glass" style={{ padding: 22, maxWidth: 560 }}>
      <h2>Create an invite</h2>
      <label>Title</label><input value={f.title} onChange={set('title')} placeholder="e.g. Evening 5-a-side" />
      <div className="g2">
        <div><label>Sport</label><select value={f.sport} onChange={set('sport')}>{Object.keys(SP).map((s) => <option key={s}>{s}</option>)}</select></div>
        <div><label>Skill level</label><select value={f.skill} onChange={set('skill')}>{LV.map((l) => <option key={l}>{l}</option>)}</select></div>
      </div>
      <label>Venue</label><input value={f.venue} onChange={set('venue')} placeholder="Ground / court name" />
      <div className="g2">
        <div><label>Date &amp; time</label><input type="datetime-local" value={f.time} onChange={set('time')} /></div>
        <div><label>Players needed</label><input type="number" min="2" max="30" value={f.slots} onChange={set('slots')} /></div>
      </div>
      <label>Description</label>
      <textarea rows="3" value={f.description} onChange={set('description')} placeholder="What to bring, rules, level of play…" />
      <p style={{ color: 'var(--bad)', minHeight: 20, fontSize: 13 }}>{err}</p>
      <button className="btn" onClick={submit}><Ic n="flag" s={16} /> Publish invite</button>
    </div>
  );
}
