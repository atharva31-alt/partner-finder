import { Ic, SP } from './icons';
import { fmt, inM, hostOf } from './util';

export default function MatchCard({ m, user, i = 0, act, setOpen, goChat, manage }) {
  const inn = inM(m, user), host = hostOf(m, user), full = m.players.length >= m.slots;
  let action;
  if (host) action = manage
    ? <button className="btn r" onClick={() => act('delete', m._id)}>Cancel match</button>
    : <span className="badge">You host</span>;
  else if (inn) action = manage
    ? <button className="btn g" onClick={() => act('leave', m._id)}>Leave</button>
    : <span className="badge" style={{ background: 'rgba(16,185,129,.18)', color: 'var(--ok)' }}><Ic n="check" s={12} /> Joined</span>;
  else action = <button className="btn" disabled={full} onClick={() => act('join', m._id)}>{full ? 'Full' : 'Join'}</button>;

  return (
    <div className="glass card cd" style={{ animationDelay: i * 60 + 'ms' }} onClick={() => setOpen(m._id)}>
      <div className="row"><span className="em"><Ic n={SP[m.sport] || 'target'} s={34} /></span><span className="badge">{m.skill}</span></div>
      <h3 style={{ margin: '8px 0 2px' }}>{m.title}</h3>
      <div className="meta">
        <Ic n="pin" s={14} /> {m.venue}<br />
        <Ic n="clock" s={14} /> {fmt(m.time)}<br />
        <Ic n="user" s={14} /> Host: {m.host.name}
      </div>
      <div className="bar"><i style={{ width: (m.players.length / m.slots) * 100 + '%' }} /></div>
      <div className="row">
        <span className="meta">{m.players.length}/{m.slots} players</span>
        <span onClick={(e) => e.stopPropagation()}>
          {(inn || host) && <button className="btn g" aria-label="Open chat" onClick={() => goChat(m._id)}><Ic n="chat" s={16} /></button>} {action}
        </span>
      </div>
    </div>
  );
}
