import { Ic, SP } from './icons';
import { fmt, inM, hostOf, until } from './util';

export default function MatchModal({ m, user, act, close, goChat }) {
  const open = !!m;
  const body = () => {
    const inn = inM(m, user), host = hostOf(m, user), full = m.players.length >= m.slots;
    return (
      <>
        <div className="row"><span className="em"><Ic n={SP[m.sport] || 'target'} s={40} /></span>
          <button className="ib" onClick={close} aria-label="Close"><Ic n="close" s={18} /></button></div>
        <h2 style={{ margin: '10px 0 6px' }}>{m.title}</h2>
        <span className="badge">{m.sport}</span> <span className="badge">{m.skill}</span>
        <p style={{ margin: '14px 0' }}>{m.description || 'The host hasn’t added a description yet.'}</p>
        <div className="det">
          <div><span className="meta"><Ic n="pin" s={14} /> Venue</span><br /><b>{m.venue}</b></div>
          <div><span className="meta"><Ic n="clock" s={14} /> When</span><br /><b>{fmt(m.time)}</b></div>
          <div><span className="meta"><Ic n="user" s={14} /> Host</span><br /><b>{m.host.name}</b></div>
          <div><span className="meta">Starts in</span><br /><b>{until(m.time)}</b></div>
        </div>
        <div className="row"><b>Players ({m.players.length}/{m.slots})</b><span className="meta">{m.slots - m.players.length} spots left</span></div>
        <div className="bar"><i style={{ width: (m.players.length / m.slots) * 100 + '%' }} /></div>
        <div className="pl">{m.players.map((p) => <span className="badge" key={p._id}>{p.name}{p._id === m.host._id ? ' (host)' : ''}</span>)}</div>
        <div className="row" style={{ marginTop: 16, gap: 8, flexWrap: 'wrap', justifyContent: 'flex-start' }}>
          {(inn || host) && <button className="btn g" onClick={() => goChat(m._id)}><Ic n="chat" s={16} /> Open chat</button>}
          {host ? <button className="btn r" onClick={() => act('delete', m._id)}>Cancel match</button>
            : inn ? <button className="btn g" onClick={() => act('leave', m._id)}>Leave match</button>
            : <button className="btn" disabled={full} onClick={() => act('join', m._id)}>{full ? 'Match full' : 'Join this match'}</button>}
        </div>
      </>
    );
  };
  return (
    <div className={'mo' + (open ? ' open' : '')} onClick={(e) => e.target === e.currentTarget && close()}>
      <div className="glass md">{open && body()}</div>
    </div>
  );
}
