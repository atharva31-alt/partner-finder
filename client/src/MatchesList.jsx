import { inM, hostOf } from './util';
import MatchCard from './MatchCard';

export default function MatchesList({ mode, user, matches, hideTitle, ...p }) {
  const list = matches.filter((m) => mode === 'hosted' ? hostOf(m, user) : inM(m, user) && !hostOf(m, user));
  return (
    <>
      {!hideTitle && <h2>{mode === 'hosted' ? 'Hosted matches' : 'Joined matches'}</h2>}
      <div className="grid">
        {list.map((m, i) => <MatchCard key={m._id} m={m} i={i} user={user} manage {...p} />)}
        {!list.length && <div className="empty" style={{ gridColumn: '1/-1' }}>
          {mode === 'hosted' ? 'You haven’t hosted anything yet.' : 'You haven’t joined a match yet.'}</div>}
      </div>
    </>
  );
}
