import { useEffect, useRef, useState } from 'react';
import api from './api';
import { Ic, SP } from './icons';
import { fmt, inM } from './util';

export default function Messages({ user, matches, room, setRoom }) {
  const rooms = matches.filter((m) => inM(m, user));
  const cur = rooms.find((m) => m._id === room) || rooms[0];
  const [msgs, setMsgs] = useState([]);
  const [txt, setTxt] = useState('');
  const end = useRef();

  useEffect(() => {
    if (!cur) return;
    let on = true;
    const load = () => api.get(`/matches/${cur._id}/messages`).then((r) => on && setMsgs(r.data)).catch(() => {});
    setMsgs([]); load();
    const i = setInterval(load, 4000);
    return () => { on = false; clearInterval(i); };
  }, [cur?._id]);

  useEffect(() => { if (end.current) end.current.scrollTop = end.current.scrollHeight; }, [msgs]);

  const send = async () => {
    const text = txt.trim();
    if (!text) return;
    setTxt('');
    try { const r = await api.post(`/matches/${cur._id}/messages`, { text }); setMsgs((m) => [...m, r.data]); } catch {}
  };

  if (!cur) return <div className="empty glass">Join or host a match to unlock its group chat.</div>;
  return (
    <div className="chat">
      <div className="glass rooms">
        {rooms.map((r) => (
          <div key={r._id} className={'room' + (r._id === cur._id ? ' on' : '')} onClick={() => setRoom(r._id)}>
            <Ic n={SP[r.sport] || 'target'} s={16} /> <b>{r.title}</b><div className="meta">{r.players.length} players</div>
          </div>
        ))}
      </div>
      <div className="glass pane">
        <div className="row" style={{ padding: 12, borderBottom: '1px solid var(--bd)' }}>
          <b><Ic n={SP[cur.sport] || 'target'} s={16} /> {cur.title}</b><span className="meta">{fmt(cur.time)}</span>
        </div>
        <div className="msgs" ref={end}>
          {msgs.map((x) => (
            <div key={x._id} className={'m' + (x.user._id === user.id ? ' me' : '')}><small>{x.user.name}</small>{x.text}</div>
          ))}
          {!msgs.length && <div className="empty">Say hi to your teammates.</div>}
        </div>
        <div className="send">
          <input value={txt} onChange={(e) => setTxt(e.target.value)} placeholder="Type a message…" onKeyDown={(e) => e.key === 'Enter' && send()} />
          <button className="btn" onClick={send}>Send</button>
        </div>
      </div>
    </div>
  );
}
