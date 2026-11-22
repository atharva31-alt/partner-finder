export default function Avatar({ u, size = 96, className = '' }) {
  const st = { width: size, height: size, fontSize: size / 2.3 };
  return u.avatar
    ? <img className={'av ' + className} style={st} src={u.avatar} alt="" referrerPolicy="no-referrer" />
    : <span className={'av ' + className} style={st}>{(u.name || '?')[0]}</span>;
}
