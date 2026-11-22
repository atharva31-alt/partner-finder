import { useEffect, useRef, useState } from 'react';
import api from './api';
import { Ic, SP } from './icons';
import GoogleButton from './GoogleButton';
import Brand from './Brand';
import { UN, UN_MSG, SPORTS } from './util';

const LV = ['Beginner', 'Intermediate', 'Advanced'];
const WORDS = ['Football', 'Cricket', 'Badminton', 'Basketball', 'Tennis', 'Running'];
const FEATS = [
  ['compass', 'Find partners', 'Ranked by a clear compatibility score.'],
  ['target', 'Join games', 'Browse matches by sport and skill level.'],
  ['chat', 'Chat with your team', 'A group chat for every game.'],
  ['bell', 'Never miss kickoff', 'Reminders before every match.'],
];

export default function Auth({ onAuth }) {
  const [reg, setReg] = useState(false);
  const [f, setF] = useState({ identifier: '', name: '', username: '', email: '', password: '', locality: '', skill: 'Intermediate' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [ua, setUa] = useState({ s: 'idle', m: '' });
  const [w, setW] = useState(0);
  const card = useRef();
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  // rotating sport word
  useEffect(() => {
    const i = setInterval(() => setW((x) => (x + 1) % WORDS.length), 2300);
    return () => clearInterval(i);
  }, []);

  // live username availability (register only)
  useEffect(() => {
    if (!reg) return;
    const u = f.username.trim().toLowerCase();
    if (!u) return setUa({ s: 'idle', m: '' });
    if (!UN.test(u)) return setUa({ s: 'bad', m: UN_MSG });
    setUa({ s: 'wait', m: 'Checking…' });
    const t = setTimeout(() => api.get('/auth/username-available', { params: { u } })
      .then((r) => setUa(r.data.available ? { s: 'ok', m: `@${u} is available` } : { s: 'bad', m: r.data.reason }))
      .catch(() => setUa({ s: 'idle', m: '' })), 400);
    return () => clearTimeout(t);
  }, [f.username, reg]);

  const submit = async () => {
    setErr('');
    if (reg && ua.s === 'bad') return setErr('Please choose a valid, available username.');
    setBusy(true);
    try {
      const body = reg
        ? { name: f.name, username: f.username, email: f.email, password: f.password, locality: f.locality, skill: f.skill }
        : { identifier: f.identifier, password: f.password };
      const { data } = await api.post(reg ? '/auth/register' : '/auth/login', body);
      onAuth(data);
    } catch (e) {
      setErr(e.response?.data?.message || 'Could not reach the server.');
    }
    setBusy(false);
  };

  const home = (e) => { e.preventDefault(); setReg(false); setErr(''); scrollTo({ top: 0, behavior: 'smooth' }); };
  const goForm = (r) => { setReg(r); setErr(''); card.current && card.current.scrollIntoView({ behavior: 'smooth', block: 'center' }); };
  const mag = (e) => { const b = e.currentTarget, r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .18}px,${(e.clientY - r.top - r.height / 2) * .25}px)`; };
  const unmag = (e) => { e.currentTarget.style.transform = ''; };

  return (
    <div className="lp">
      <div className="topbar"><Brand href="/" onClick={home} /></div>

      <div className="lp-grid">
        <section className="lp-hero">
          <span className="eyebrow"><i /> Sports partner finder</span>
          <h1 className="lp-h1">
            <span className="ln">Find your next</span>
            <span className="rot" key={w}><Ic n={SP[WORDS[w]]} s={64} />{WORDS[w]}</span>
            <span className="ln">partner.</span>
          </h1>
          <p className="lp-p">Meet players at your level, join games near you and chat with your team. Everything you need to actually get on the pitch.</p>
          <div className="lp-cta">
            <button className="btn big" onMouseMove={mag} onMouseLeave={unmag} onClick={() => goForm(true)}>Get started <Ic n="arrow" s={20} /></button>
            <button className="btn g big" onMouseMove={mag} onMouseLeave={unmag} onClick={() => goForm(false)}>I have an account</button>
          </div>
        </section>

        <section className="acard" ref={card}>
          <span className="fl f1"><Ic n="football" s={26} /></span>
          <span className="fl f2"><Ic n="heart" s={26} /></span>
          <span className="fl f3"><Ic n="bell" s={26} /></span>
          <div className="af">
            <h2 style={{ margin: '0 0 2px' }}>{reg ? 'Create your account' : 'Welcome back'}</h2>
            <p className="meta" style={{ margin: 0 }}>{reg ? 'It takes less than a minute.' : 'Log in to see who’s playing today.'}</p>
            <div className="tabs">
              <button className={reg ? '' : 'on'} onClick={() => setReg(false)}>Login</button>
              <button className={reg ? 'on' : ''} onClick={() => setReg(true)}>Register</button>
            </div>
            {import.meta.env.VITE_GOOGLE_CLIENT_ID
              ? <GoogleButton onLogin={onAuth} />
              : <p className="meta">Set VITE_GOOGLE_CLIENT_ID to enable Google sign-in.</p>}
            <div className="or">or use username / email</div>
            {reg ? (
              <>
                <label>Name</label><input value={f.name} onChange={set('name')} placeholder="Your name" />
                <label>Username</label>
                <input value={f.username} onChange={set('username')} placeholder="e.g. riya_sharma" autoCapitalize="none" autoComplete="username" />
                <p className={'hint ' + ua.s}>{ua.m}</p>
                <label>Email</label><input type="email" value={f.email} onChange={set('email')} placeholder="you@email.com" autoComplete="email" />
              </>
            ) : (
              <>
                <label>Email or username</label>
                <input value={f.identifier} onChange={set('identifier')} placeholder="you@email.com or username" autoCapitalize="none" autoComplete="username" />
              </>
            )}
            <label>Password</label>
            <input type="password" value={f.password} onChange={set('password')} placeholder="At least 6 characters"
              autoComplete={reg ? 'new-password' : 'current-password'} onKeyDown={(e) => e.key === 'Enter' && submit()} />
            {reg && (
              <div className="g2">
                <div><label>Locality</label><input value={f.locality} onChange={set('locality')} placeholder="Dehradun" /></div>
                <div><label>Skill</label><select value={f.skill} onChange={set('skill')}>{LV.map((l) => <option key={l}>{l}</option>)}</select></div>
              </div>
            )}
            <p style={{ color: 'var(--bad)', minHeight: 20, fontSize: 13 }}>{err}</p>
            <button className="btn" style={{ width: '100%' }} disabled={busy} onClick={submit}>
              {busy ? 'Please wait…' : reg ? 'Create account' : 'Login'} {!busy && <Ic n="arrow" s={18} />}
            </button>
          </div>
        </section>
      </div>

      <div className="lp-feats">
        {FEATS.map(([i, t, d], n) => (
          <div className="lf" key={t} style={{ animationDelay: 200 + n * 90 + 'ms' }}>
            <span className="lfi"><Ic n={i} s={22} /></span>
            <div><b>{t}</b><p className="meta" style={{ margin: '2px 0 0' }}>{d}</p></div>
          </div>
        ))}
      </div>

      <div className="marq" aria-hidden="true">
        <div className="mtrack">{[...SPORTS, ...SPORTS].map((s, i) => <span key={i}><Ic n={SP[s]} s={24} /> {s}</span>)}</div>
      </div>
    </div>
  );
}
