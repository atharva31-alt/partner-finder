import Create from './Create';
import MyMatches from './MatchesList';

const TABS = [['joined', 'Joined'], ['hosted', 'Hosted'], ['create', 'Create']];

export default function MatchesHub({ tab, common, reload, toast }) {
  return (
    <>
      <div className="hero"><h1>Matches</h1><p className="meta">Games you host, games you joined, and new invites.</p></div>
      <div className="tabs" style={{ maxWidth: 420 }}>
        {TABS.map(([id, label]) => <button key={id} className={tab === id ? 'on' : ''} onClick={() => { location.hash = id; }}>{label}</button>)}
      </div>
      {tab === 'create' ? <Create reload={reload} toast={toast} /> : <MyMatches mode={tab} {...common} hideTitle />}
    </>
  );
}
