import { useEffect, useState } from 'react';
import api from './api';
import { Ic, SP } from './icons';
import { SPORTS, TIMES, DAYS, LEVELS, UN, UN_MSG, cap } from './util';
import Avatar from './Avatar';

const toggle = (arr, v) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

export default function ProfilePage({ user, setUser, toast, logout }) {
  const [f, setF] = useState({
    name: user.name, age: user.age ?? '', bio: user.bio || '', locality: user.locality || '', skill: user.skill || 'Intermediate',
    sports: user.sports || [], playTimes: user.playTimes || [], days: user.days || [],
  });
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  // username
  const [u, setU] = useState(user.username || '');
  const [st, setSt] = useState({ s: 'idle', m: '' });
  useEffect(() => {
    const v = u.trim().toLowerCase();
    if (v === user.username) return setSt({ s: 'idle', m: '' });
    if (!UN.test(v)) return setSt({ s: 'bad', m: UN_MSG });
    setSt({ s: 'wait', m: 'Checking…' });
    const t = setTimeout(() => api.get('/auth/username-available', { params: { u: v } })
      .then((r) => setSt(r.data.available ? { s: 'ok', m: `@${v} is available` } : { s: 'bad', m: r.data.reason }))
      .catch(() => setSt({ s: 'idle', m: '' })), 400);
    return () => clearTimeout(t);
  }, [u, user.username]);
  const saveUsername = async () => {
    try { const { data } = await api.patch('/auth/username', { username: u }); setUser(data.user); toast('Username updated'); }
    catch (e) { setSt({ s: 'bad', m: e.response?.data?.message || 'Could not save.' }); }
  };

  const save = async () => {
    setBusy(true);
    try {
      const { data } = await api.patch('/users/profile', { ...f, age: f.age === '' ? null : Number(f.age) });
      setUser(data.user); toast('Profile saved');
    } catch (e) { toast(e.response?.data?.message || 'Could not save profile'); }
    setBusy(false);
  };

  const useLocation = () => {
    if (!navigator.geolocation) return toast('Location is not supported in this browser');
    navigator.geolocation.getCurrentPosition(
      async (p) => {
        try { const { data } = await api.patch('/users/profile', { lat: p.coords.latitude, lng: p.coords.longitude }); setUser(data.user); toast('Location saved (approximate, never shown to others)'); }
        catch { toast('Could not save location'); }
      },
      () => toast('Location permission denied. You can still set your city above.'),
      { timeout: 10000 });
  };
  const clearLocation = async () => {
    try { const { data } = await api.patch('/users/profile', { clearLocation: true }); setUser(data.user); toast('Location removed'); } catch { toast('Could not remove location'); }
  };

  const checks = [f.bio.trim(), f.age, f.locality.trim(), f.sports.length, f.playTimes.length, f.days.length];
  const pct = Math.round((checks.filter(Boolean).length / checks.length) * 100);

  return (
    <>
      <div className="hero"><h1>My profile</h1><p className="meta">A complete profile gives you more accurate compatibility scores.</p></div>
      <div className="pf">
        <div className="glass pfc">
          <Avatar u={user} size={132} />
          <h2 style={{ margin: '12px 0 0' }}>{user.name}</h2>
          <span className="meta">@{user.username}</span>
          <span className="meta">{user.email}</span>
          <div style={{ width: '100%', marginTop: 16 }}>
            <div className="row"><b>Profile {pct}% complete</b></div>
            <div className="bar"><i style={{ width: pct + '%' }} /></div>
          </div>
          <button className="btn g" style={{ width: '100%', marginTop: 8 }} onClick={logout}><Ic n="logout" s={18} /> Logout</button>
        </div>

        <div className="glass" style={{ padding: 22 }}>
          <h2>About you</h2>
          <div className="g2">
            <div><label>Name</label><input value={f.name} onChange={set('name')} /></div>
            <div><label>Age</label><input type="number" min="13" max="100" value={f.age} onChange={set('age')} placeholder="Optional" /></div>
          </div>
          <label>Bio ({f.bio.length}/200)</label>
          <textarea rows="3" maxLength={200} value={f.bio} onChange={set('bio')} placeholder="What do you play, and what are you looking for?" />
          <div className="g2">
            <div><label>City</label><input value={f.locality} onChange={set('locality')} placeholder="Dehradun" /></div>
            <div><label>Skill level</label><select value={f.skill} onChange={set('skill')}>{LEVELS.map((l) => <option key={l}>{l}</option>)}</select></div>
          </div>
          <label>Sports you play</label>
          <div className="chips">{SPORTS.map((s) => <button key={s} className={'chip' + (f.sports.includes(s) ? ' on' : '')} onClick={() => setF({ ...f, sports: toggle(f.sports, s) })}><Ic n={SP[s]} s={15} /> {s}</button>)}</div>
          <label>Preferred playing times</label>
          <div className="chips">{TIMES.map((t) => <button key={t} className={'chip' + (f.playTimes.includes(t) ? ' on' : '')} onClick={() => setF({ ...f, playTimes: toggle(f.playTimes, t) })}>{cap(t)}</button>)}</div>
          <label>Days you are free</label>
          <div className="chips">{DAYS.map((d) => <button key={d} className={'chip' + (f.days.includes(d) ? ' on' : '')} onClick={() => setF({ ...f, days: toggle(f.days, d) })}>{cap(d)}</button>)}</div>
          <button className="btn" style={{ marginTop: 14 }} disabled={busy} onClick={save}>{busy ? 'Saving…' : 'Save profile'}</button>

          <h2 style={{ marginTop: 30 }}>Location</h2>
          <p className="meta">Used only to calculate distance. We store an approximate position (about 1 km), and it is never shown to other players. Only the rounded distance is shown.</p>
          <div className="row" style={{ justifyContent: 'flex-start', gap: 10, flexWrap: 'wrap' }}>
            <button className="btn g" onClick={useLocation}><Ic n="pin" s={16} /> {user.hasLocation ? 'Update my location' : 'Use my location'}</button>
            {user.hasLocation && <button className="btn g" onClick={clearLocation}>Remove location</button>}
          </div>
          <p className="hint">{user.hasLocation ? 'Approximate location saved.' : 'Not shared. Matching will use your city instead.'}</p>

          <h2 style={{ marginTop: 20 }}>Username</h2>
          <input value={u} onChange={(e) => setU(e.target.value)} autoCapitalize="none" />
          <p className={'hint ' + st.s}>{st.m}</p>
          <button className="btn g" disabled={st.s !== 'ok'} onClick={saveUsername}>Save username</button>
        </div>
      </div>
    </>
  );
}
