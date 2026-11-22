import { useEffect, useState } from 'react';
import api from './api';
import Avatar from './Avatar';
import { Ic, SP } from './icons';
import { fmt, inM, hostOf } from './util';
import MatchCard from './MatchCard';

function PartnerPicks() {
  const [d, setD] = useState(null);
  useEffect(() => { api.get('/users/discover', { params: { limit: 3 } }).then((r) => setD(r.data)).catch(() => setD({ users: [] })); }, []);
  if (!d) return null;
  return (
    <>
      {d.profileIncomplete && (
        <a className="glass nudge" href="#profile"><Ic n="user" s={18} /> Add your sports, times and days to get accurate compatibility scores. <b>Complete profile</b></a>
      )}
      {d.users.length > 0 && (
        <>
          <div className="row" style={{ margin: '18px 0 10px' }}><h2 style={{ margin: 0 }}>Top partner picks</h2><a className="meta" href="#discover" style={{ color: 'var(--ac)', fontWeight: 700 }}>See all</a></div>
          <div className="picks">
            {d.users.map((u) => (
              <a className="glass pick" key={u.id} href="#discover">
                <Avatar u={u} size={56} />
                <div style={{ minWidth: 0 }}><b>{u.name}</b><div className="meta">{u.sports.slice(0, 2).join(', ') || u.skill}</div></div>
                <span className="badge" style={{ marginLeft: 'auto' }}>{u.compat.score}%</span>
              </a>
            ))}
          </div>
        </>
      )}
    </>
  );
}

export default function Dashboard({ user, matches, ...p }) {
  const [q, setQ] = useState('');
  const [c, setC] = useState('All');
  const n = Date.now();
  const list = matches.filter((m) => (c === 'All' || m.sport === c) && (m.title + m.venue + m.sport).toLowerCase().includes(q.toLowerCase()));
  const next = matches.filter((m) => inM(m, user) && new Date(m.time) > n).sort((a, b) => new Date(a.time) - new Date(b.time))[0];
  return (
    <>
      <div className="hero"><h1>Hey {user.name.split(' ')[0]}</h1><p className="meta">Find your next game{user.locality ? ' in ' + user.locality : ''}.</p></div>
      <div className="glass banner">
        <div><h3>Ready to play?</h3><p className="meta">Host a match in under a minute and let nearby players join you.</p></div>
        <a className="btn" href="#create"><Ic n="plus" s={18} /> Host a match</a>
      </div>
      <PartnerPicks />
      <div className="stats">
        <div className="glass stat"><b>{matches.length}</b><span>Open matches</span></div>
        <div className="glass stat"><b>{matches.filter((m) => hostOf(m, user)).length}</b><span>Hosted</span></div>
        <div className="glass stat"><b>{matches.filter((m) => inM(m, user) && !hostOf(m, user)).length}</b><span>Joined</span></div>
        <div className="glass stat"><b style={{ fontSize: 16 }}>{next ? next.title : 'None yet'}</b><span>{next ? 'Next: ' + fmt(next.time) : 'Join a match!'}</span></div>
      </div>
      <input placeholder="Search sport, venue or title…" value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="chips">
        {['All', ...Object.keys(SP)].map((s) => (
          <button key={s} className={'chip' + (c === s ? ' on' : '')} onClick={() => setC(s)}><Ic n={SP[s] || 'grid'} s={15} /> {s}</button>
        ))}
      </div>
      <div className="grid">
        {list.map((m, i) => <MatchCard key={m._id} m={m} i={i} user={user} {...p} />)}
        {!list.length && (
          <div className="glass empty-card" style={{ gridColumn: '1/-1' }}>
            <span className="em"><Ic n="football" s={56} /></span>
            <h3>No matches here yet</h3>
            <p className="meta">Be the first to host one in your area, or try a different filter.</p>
            <a className="btn" href="#create"><Ic n="plus" s={18} /> Create a match</a>
          </div>
        )}
      </div>
      <h2 style={{ margin: '30px 0 12px' }}>How it works</h2>
      <div className="steps">
        {[['target', '1. Find', 'Browse matches by sport, skill level and venue.'],
          ['users', '2. Join', 'Grab a slot and chat with your teammates.'],
          ['clock', '3. Play', 'Get a reminder before kickoff and show up.']].map(([i, t, d]) => (
          <div className="glass stp" key={t}><span className="em"><Ic n={i} s={34} /></span><h3>{t}</h3><p className="meta">{d}</p></div>
        ))}
      </div>
    </>
  );
}
