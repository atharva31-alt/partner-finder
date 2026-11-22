import { useCallback, useEffect, useRef, useState } from 'react';
import api from './api';
import { Ic, SP } from './icons';
import { cap } from './util';
import Avatar from './Avatar';

function Breakdown({ items }) {
  return (
    <div className="why">
      {items.map((b) => (
        <div key={b.key}>
          <div className="row"><b>{b.label}</b><span className="meta">{b.points}/{b.max}</span></div>
          <div className="bar"><i style={{ width: (b.points / b.max) * 100 + '%' }} /></div>
          <span className="meta">{b.detail}</span>
        </div>
      ))}
    </div>
  );
}

function PlayerBody({ u }) {
  return (
    <div className="pbody">
      <p className="meta" style={{ margin: '0 0 8px', fontWeight: 700, color: 'var(--ac)' }}>{u.compat.label}</p>
      <div className="chips" style={{ margin: '0 0 8px' }}>
        {u.sports.map((s) => <span key={s} className="badge"><Ic n={SP[s] || 'target'} s={13} /> {s}</span>)}
        <span className="badge">{u.skill}</span>
      </div>
      {u.bio && <p style={{ margin: '8px 0' }}>{u.bio}</p>}
      <b style={{ fontSize: 13 }} className="meta">WHY YOU MATCH</b>
      <Breakdown items={u.compat.breakdown} />
    </div>
  );
}

function Card({ u, back, dx, fly, dragging, h }) {
  const x = fly ? (fly === 'like' ? 700 : -700) : dx;
  const style = back ? undefined : {
    transform: `translateX(${x}px) rotate(${x / 18}deg)`,
    transition: dragging ? 'none' : 'transform .28s ease',
  };
  return (
    <div className={'pc' + (back ? ' back' : '')} style={style} {...(back ? {} : h)}>
      <div className="pimg">
        {u.avatar ? <img src={u.avatar} alt="" referrerPolicy="no-referrer" draggable="false" /> : <span className="ini">{u.name[0]}</span>}
        <div className="cmp"><b>{u.compat.score}%</b><span>MATCH</span></div>
        {!back && <><span className="stamp l" style={{ opacity: Math.min(1, Math.max(0, x / 90)) }}>LIKE</span>
          <span className="stamp s" style={{ opacity: Math.min(1, Math.max(0, -x / 90)) }}>SKIP</span></>}
        <div className="pname">
          <h2>{u.name}{u.age ? ', ' + u.age : ''}</h2>
          <span className="meta" style={{ color: '#ddd' }}><Ic n="pin" s={14} /> {u.city || 'Location not set'}{u.distanceKm ? ` · ~${u.distanceKm} km` : ''} · @{u.username}</span>
        </div>
      </div>
      <PlayerBody u={u} />
    </div>
  );
}

function Swipe({ toast, goMatches }) {
  const [users, setUsers] = useState(null);
  const [incomplete, setIncomplete] = useState(false);
  const [dx, setDx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [fly, setFly] = useState(null);
  const [hit, setHit] = useState(null);
  const start = useRef(null);
  const busy = useRef(false);

  const load = useCallback(() => api.get('/users/discover').then((r) => { setUsers(r.data.users); setIncomplete(r.data.profileIncomplete); })
    .catch(() => { setUsers([]); toast('Could not load players'); }), [toast]);
  useEffect(() => { load(); }, [load]);

  const decide = useCallback(async (action) => {
    if (busy.current || !users || !users.length) return;
    busy.current = true; setFly(action);
    const u = users[0];
    try {
      const { data } = await api.post('/users/swipe', { to: u.id, action });
      if (data.matched) setHit(data.user);
    } catch (e) { toast(e.response?.data?.message || 'Could not save your choice'); }
    setTimeout(() => {
      setFly(null); setDx(0); busy.current = false;
      setUsers((l) => { const n = l.slice(1); if (n.length === 0) setTimeout(load, 0); return n; });
    }, 260);
  }, [users, toast, load]);

  useEffect(() => {
    const k = (e) => { if (hit) return; if (e.key === 'ArrowRight') decide('like'); if (e.key === 'ArrowLeft') decide('skip'); };
    addEventListener('keydown', k); return () => removeEventListener('keydown', k);
  }, [decide, hit]);

  const h = {
    onPointerDown: (e) => { if (busy.current) return; start.current = e.clientX; setDragging(true); e.currentTarget.setPointerCapture(e.pointerId); },
    onPointerMove: (e) => { if (start.current != null) setDx(e.clientX - start.current); },
    onPointerUp: () => { if (start.current == null) return; start.current = null; setDragging(false); Math.abs(dx) > 110 ? decide(dx > 0 ? 'like' : 'skip') : setDx(0); },
    onPointerCancel: () => { start.current = null; setDragging(false); setDx(0); },
  };

  if (!users) return <div className="empty">Finding players…</div>;
  return (
    <div className="dsc">
      {incomplete && <a className="glass nudge" href="#profile"><Ic n="user" s={18} /> Add your sports and times so compatibility scores are accurate. <b>Edit profile</b></a>}
      {users.length === 0 ? (
        <div className="glass empty-card">
          <span className="em"><Ic n="compass" s={56} /></span>
          <h3>You’re all caught up</h3>
          <p className="meta">No new players right now. Check back soon or share the app with your friends.</p>
          <button className="btn" onClick={load}>Refresh</button>
        </div>
      ) : (
        <>
          <div className="stack">
            {users[1] && <Card key={users[1].id} u={users[1]} back />}
            <Card key={users[0].id} u={users[0]} dx={dx} fly={fly} dragging={dragging} h={h} />
          </div>
          <div className="acts">
            <button className="rb sk" aria-label="Skip" onClick={() => decide('skip')}><Ic n="close" s={30} /></button>
            <button className="rb lk" aria-label="Like" onClick={() => decide('like')}><Ic n="heart" s={30} /></button>
          </div>
          <p className="meta" style={{ textAlign: 'center' }}>Swipe or use the buttons · keyboard: ← skip, → like</p>
        </>
      )}
      {hit && (
        <div className="mo open">
          <div className="glass md mcard">
            <h1 className="mtitle">It’s a match!</h1>
            <p className="meta">You and {hit.name} liked each other.</p>
            <div className="mavs"><Avatar u={{ name: 'You' }} size={96} className="l" /><Avatar u={hit} size={96} className="r" /></div>
            <div className="row" style={{ justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
              <button className="btn g" onClick={() => setHit(null)}>Keep swiping</button>
              <button className="btn" onClick={() => { setHit(null); goMatches(); }}>View my matches</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MyMatches({ toast }) {
  const [list, setList] = useState(null);
  const load = useCallback(() => api.get('/users/connections').then((r) => setList(r.data)).catch(() => setList([])), []);
  useEffect(() => { load(); }, [load]);
  const block = async (id, name) => {
    if (!confirm(`Block ${name}? They will be removed from your matches and hidden from each other.`)) return;
    try { await api.post('/users/block/' + id); toast(name + ' blocked'); load(); } catch { toast('Could not block this player'); }
  };
  if (!list) return <div className="empty">Loading matches…</div>;
  if (!list.length) return <div className="glass empty-card"><span className="em"><Ic n="heart" s={56} /></span><h3>No matches yet</h3><p className="meta">Like players on the Discover tab. When they like you back, they appear here.</p></div>;
  return (
    <div className="grid">
      {list.map((c, i) => (
        <div className="glass card" key={c.id} style={{ animationDelay: i * 60 + 'ms' }}>
          <div className="row" style={{ justifyContent: 'flex-start', gap: 14 }}>
            <Avatar u={c.user} size={64} />
            <div><h3 style={{ margin: 0 }}>{c.user.name}</h3><span className="meta">@{c.user.username} · {c.user.city || 'Location not set'}</span></div>
            <span className="badge" style={{ marginLeft: 'auto' }}>{c.user.compat.score}%</span>
          </div>
          <div className="chips" style={{ margin: '12px 0 4px' }}>{c.user.sports.map((s) => <span key={s} className="badge">{s}</span>)}</div>
          <p className="meta" style={{ margin: '6px 0' }}>Matched {new Date(c.since).toLocaleDateString()} · {c.user.compat.label}</p>
          <button className="btn g" onClick={() => block(c.user.id, c.user.name)}>Block</button>
        </div>
      ))}
    </div>
  );
}

export default function Discover({ toast }) {
  const [tab, setTab] = useState('discover');
  return (
    <>
      <div className="hero"><h1>Discover players</h1><p className="meta">Ranked by a transparent compatibility score from your profile data.</p></div>
      <div className="tabs" style={{ maxWidth: 420 }}>
        <button className={tab === 'discover' ? 'on' : ''} onClick={() => setTab('discover')}>Discover</button>
        <button className={tab === 'matches' ? 'on' : ''} onClick={() => setTab('matches')}>My matches</button>
      </div>
      {tab === 'discover' ? <Swipe toast={toast} goMatches={() => setTab('matches')} /> : <MyMatches toast={toast} />}
    </>
  );
}
