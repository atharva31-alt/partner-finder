import { useCallback, useEffect, useRef, useState } from 'react';
import api from './api';
import { Ic } from './icons';
import { inM } from './util';
import Wallpaper from './Wallpaper';
import Auth from './Auth';
import Dashboard from './Dashboard';
import Discover from './Discover';
import MatchesHub from './MatchesHub';
import Messages from './Messages';
import ProfilePage from './ProfilePage';
import MatchModal from './MatchModal';
import Bot from './Bot';
import Brand from './Brand';
import Avatar from './Avatar';

// id, icon, label, hash routes that belong to it
const NAV = [
  ['dashboard', 'home', 'Dashboard', ['dashboard']],
  ['discover', 'compass', 'Discover', ['discover']],
  ['joined', 'target', 'Matches', ['matches', 'create', 'hosted', 'joined']],
  ['messages', 'chat', 'Messages', ['messages']],
  ['profile', 'user', 'My Profile', ['profile']],
];

export default function App() {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [matches, setMatches] = useState([]);
  const [view, setView] = useState(() => location.hash.slice(1) || 'dashboard');
  const [openId, setOpenId] = useState(null);
  const [room, setRoom] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [notifs, setNotifs] = useState([]);
  const [np, setNp] = useState(false);
  const [lead, setLead] = useState(30);
  const [bot, setBot] = useState(false);
  const seen = useRef({});
  const prevMine = useRef(null);      // matches I was in at the last refresh
  const quiet = useRef(new Set());    // matches I cancelled myself (no 'cancelled' alert needed)

  const toast = useCallback((m) => {
    const id = Math.random();
    setToasts((t) => [...t, { id, m }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4500);
  }, []);

  const notify = useCallback((title, body, mid) => {
    setNotifs((n) => [{ t: Date.now(), x: `${title} — ${body}`, mid, r: false }, ...n].slice(0, 30));
    toast(`${title} — ${body}`);
    try { if (Notification.permission === 'granted') new Notification(title, { body }); } catch {}
  }, [toast]);

  // restore session
  useEffect(() => {
    if (!localStorage.getItem('pf_token')) return setReady(true);
    api.get('/auth/me').then((r) => setUser(r.data.user)).catch(() => localStorage.removeItem('pf_token')).finally(() => setReady(true));
  }, []);
  useEffect(() => { document.body.classList.toggle('in', !!user); }, [user]);
  useEffect(() => {
    const h = () => { setView(location.hash.slice(1) || 'dashboard'); scrollTo({ top: 0 }); };
    addEventListener('hashchange', h);
    return () => removeEventListener('hashchange', h);
  }, []);

  const load = useCallback(() => api.get('/matches').then((r) => setMatches(r.data)).catch(() => {}), []);
  useEffect(() => {
    if (!user) return;
    load();
    const i = setInterval(load, 20000);
    return () => clearInterval(i);
  }, [user, load]);

  // match reminders
  useEffect(() => {
    if (!user) return;
    const check = () => {
      const n = Date.now();
      matches.forEach((m) => {
        const t = new Date(m.time).getTime(), k = m._id + '_' + lead;
        if (inM(m, user) && t > n && t - n <= lead * 60000 && !seen.current[k]) {
          seen.current[k] = 1;
          notify('Match reminder', `${m.title} starts in ${Math.max(1, Math.round((t - n) / 6e4))} min at ${m.venue}`, m._id);
        }
      });
    };
    check();
    const i = setInterval(check, 15000);
    return () => clearInterval(i);
  }, [matches, user, lead, notify]);

  // Keep notifications in sync with reality: remove reminders for matches that were cancelled,
  // expired, or that I left, and tell me when a host cancels a match I had joined.
  useEffect(() => {
    if (!user) { prevMine.current = null; return; }
    const ids = new Set(matches.map((m) => m._id));
    setNotifs((n) => {
      const keep = n.filter((x) => !x.mid || matches.some((m) => m._id === x.mid && inM(m, user)));
      return keep.length === n.length ? n : keep;
    });
    if (prevMine.current) {
      prevMine.current.forEach((m) => {
        if (!ids.has(m._id) && new Date(m.time) > Date.now() && !quiet.current.has(m._id)) {
          notify('Match cancelled', `${m.title} was cancelled by the host`);
        }
      });
    }
    prevMine.current = matches.filter((m) => inM(m, user));
  }, [matches, user, notify]);

  // close the notification panel when clicking anywhere else, or pressing Escape
  useEffect(() => {
    if (!np) return;
    const outside = (e) => { if (!e.target.closest('#np, .bellbtn')) setNp(false); };
    const esc = (e) => { if (e.key === 'Escape') setNp(false); };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', esc); };
  }, [np]);

  const forget = (id) => {
    setNotifs((n) => n.filter((x) => x.mid !== id));
    Object.keys(seen.current).forEach((k) => { if (k.startsWith(id + '_')) delete seen.current[k]; });
  };

  const act = async (type, id) => {
    if (type === 'delete') quiet.current.add(id);
    try {
      if (type === 'delete') await api.delete('/matches/' + id); else await api.post(`/matches/${id}/${type}`);
      if (type !== 'join') forget(id);
      await load();
      toast({ join: 'You joined the match', leave: 'You left the match', delete: 'Match cancelled' }[type]);
      if (type === 'delete') setOpenId(null);
    } catch (e) { quiet.current.delete(id); toast(e.response?.data?.message || 'Action failed'); }
  };
  const goChat = (id) => { setRoom(id); setOpenId(null); location.hash = 'messages'; };
  const onAuth = ({ token, user }) => { localStorage.setItem('pf_token', token); setUser(user); location.hash = 'dashboard'; toast('Welcome, ' + user.name); };
  const logout = () => { localStorage.removeItem('pf_token'); setUser(null); setMatches([]); setNotifs([]); };
  const askPerm = () => { try { Notification.requestPermission().then((p) => toast(p === 'granted' ? 'Browser alerts on' : 'Permission not granted')); } catch { toast('Not supported in this browser'); } };
  const unread = notifs.filter((x) => !x.r).length;
  const toggleNp = () => { setNp((o) => !o); setNotifs((n) => n.map((x) => ({ ...x, r: true }))); };
  const home = (e) => { e.preventDefault(); location.hash = 'dashboard'; scrollTo({ top: 0, behavior: 'smooth' }); };

  const common = { user, matches, act, setOpen: setOpenId, goChat };
  const current = NAV.find((n) => n[3].includes(view)) || NAV[0];
  const route = current[3].includes(view) ? view : 'dashboard';
  const modalMatch = matches.find((m) => m._id === openId);

  return (
    <>
      <Wallpaper />
      {ready && !user && <Auth onAuth={onAuth} />}
      {ready && user && (
        <div className="app">
          <aside className="side">
            <Brand href="#dashboard" onClick={home} />
            {NAV.map(([id, icon, label]) => (
              <a key={id} href={'#' + id} className={'sl' + (id === current[0] ? ' on' : '')}><Ic n={icon} s={20} /> {label}</a>
            ))}
            <div className="sp" />
            <a className="uchip" href="#profile"><Avatar u={user} size={38} /><span>@{user.username}</span></a>
            <button className="btn g" onClick={logout}><Ic n="logout" s={18} /> Logout</button>
          </aside>

          <main className="main">
            <div className="mtop">
              <Brand href="#dashboard" onClick={home} />
              <span style={{ marginLeft: 'auto' }} />
              <button className="ib bellbtn" aria-label="Notifications" onClick={toggleNp}><Ic n="bell" s={19} />
                {unread > 0 && <span className="dot">{unread}</span>}</button>
            </div>
            {route === 'dashboard' && <Dashboard {...common} />}
            {route === 'discover' && <Discover toast={toast} />}
            {['matches', 'create', 'hosted', 'joined'].includes(route) && (
              <MatchesHub tab={route === 'matches' ? 'joined' : route} common={common} reload={load} toast={toast} />
            )}
            {route === 'messages' && <Messages user={user} matches={matches} room={room} setRoom={setRoom} />}
            {route === 'profile' && <ProfilePage user={user} setUser={setUser} toast={toast} logout={logout} />}
          </main>

          <nav className="bnav" aria-label="Main">
            {NAV.map(([id, icon, label]) => (
              <a key={id} href={'#' + id} className={id === current[0] ? 'on' : ''}><Ic n={icon} s={22} />{label.replace('My ', '')}</a>
            ))}
          </nav>
        </div>
      )}
      {user && <div id="np" className={'glass' + (np ? ' open' : '')}>
        <b>Reminders &amp; alerts</b>
        <label>Remind me before match</label>
        <select value={lead} onChange={(e) => { setLead(+e.target.value); toast('Reminder set to ' + e.target.value + ' min'); }}>
          {[10, 30, 60, 120].map((m) => <option key={m} value={m}>{m} minutes</option>)}
        </select>
        <button className="btn g" style={{ margin: '10px 0', width: '100%' }} onClick={askPerm}>Enable browser notifications</button>
        {notifs.length > 0 && <button className="btn g" style={{ marginBottom: 10, width: '100%' }} onClick={() => setNotifs([])}>Clear all</button>}
        {notifs.map((n, i) => <div className="n" key={i}>{n.x}<br /><small className="meta">{new Date(n.t).toLocaleTimeString()}</small></div>)}
        {!notifs.length && <p className="meta">No notifications yet. Join a match to get reminders.</p>}
      </div>}
      <div id="toasts">{toasts.map((t) => <div className="t" key={t.id}><Ic n="bell" s={16} /> {t.m}</div>)}</div>
      {user && <MatchModal m={modalMatch} user={user} act={act} close={() => setOpenId(null)} goChat={goChat} />}
      {user && <Bot open={bot} setOpen={setBot} user={user} />}
    </>
  );
}
