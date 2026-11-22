import { useEffect, useRef, useState } from 'react';
import { Ic } from './icons';

const KB = [
  [/join|participate|enter/, 'Open the Dashboard, pick a match and tap Join. Check the skill level and free slots first. Joined matches appear under “Joined”.'],
  [/creat|host|invite|organi[sz]e|publish/, 'Go to Create, add title, sport, venue, time and players needed, then publish. You’ll find it under “Hosted” where you can cancel it.'],
  [/remind|notif|alert|bell/, 'Tap the bell icon to choose how early you’re reminded (10 minutes to 2 hours) and to enable browser notifications. Reminders fire for matches you host or joined.'],
  [/chat|messag|talk|dm/, 'Every match you host or join has a group chat under Messages. Tap the chat button on a card to jump straight in.'],
  [/skill|level|beginner|advanced/, 'Pick Beginner if you’re new, Intermediate if you play regularly, Advanced for competitive play. Matches show the level so you can find equals.'],
  [/cancel|leave|quit|delete/, 'Under Hosted you can cancel your match; under Joined you can leave one.'],
  [/rule|play|tip|warm|safe|injur/, 'Warm up for 10 minutes, hydrate, and arrive early. Agree on rules in the match chat before starting.'],
  [/password|account|login|logout|register|sign|google/, 'Use Register to create an account, or continue with Google. Logout is at the top right.'],
  [/hi|hello|hey|help/, 'Hi! I can help with joining, hosting, reminders, chat and sports tips. What’s your doubt?'],
];
const FALLBACK = 'I’m not sure about that yet. Try asking about joining, hosting, reminders, chat or sports tips.';

export default function Bot({ open, setOpen, user }) {
  const [log, setLog] = useState([{ w: 'b', x: `Hi ${user.name.split(' ')[0]}. I’m your Partner-Finder assistant. Ask me anything.` }]);
  const [q, setQ] = useState('');
  const [typing, setTyping] = useState(false);
  const box = useRef();
  useEffect(() => { if (box.current) box.current.scrollTop = box.current.scrollHeight; }, [log, typing]);

  const ask = (text) => {
    const t = (text ?? q).trim();
    if (!t) return;
    setQ(''); setLog((l) => [...l, { w: 'u', x: t }]); setTyping(true);
    const hit = KB.find((k) => k[0].test(t.toLowerCase()));
    setTimeout(() => { setTyping(false); setLog((l) => [...l, { w: 'b', x: hit ? hit[1] : FALLBACK }]); }, 800);
  };

  return (
    <>
      <button className={'btn ib' + (open ? ' hide' : '')} id="fab" aria-label="AI assistant" onClick={() => setOpen(!open)}><Ic n="bot" s={30} /></button>
      <div id="bot" className={'glass' + (open ? ' open' : '')}>
        <div className="bh">
          <span className="bav"><Ic n="bot" s={22} /></span>
          <div><b>Partner-Finder AI</b><small>Online · ask me anything</small></div>
          <button className="bx" aria-label="Close" onClick={() => setOpen(false)}><Ic n="close" s={16} /></button>
        </div>
        <div className="msgs" ref={box}>
          {log.map((m, i) => <div key={i} className={'m' + (m.w === 'u' ? ' me' : '')}>{m.x}</div>)}
          {typing && <div className="m"><span className="typing"><i /><i /><i /></span></div>}
        </div>
        <div className="chips" style={{ padding: '0 10px' }}>
          {['How to join?', 'Set a reminder', 'Host a match', 'Sports tips'].map((s) => <button key={s} className="chip" onClick={() => ask(s)}>{s}</button>)}
        </div>
        <div className="send">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ask a doubt…" onKeyDown={(e) => e.key === 'Enter' && ask()} />
          <button className="btn" onClick={() => ask()}><Ic n="send" s={18} /></button>
        </div>
      </div>
    </>
  );
}
