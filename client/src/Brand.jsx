import { Ic } from './icons';

// Big clickable site name. Pass href + onClick to control where it goes.
export default function Brand({ href = '#dashboard', onClick }) {
  return (
    <a className="brand" href={href} onClick={onClick} aria-label="Partner-Finder home">
      <span className="bi"><Ic n="logo" s={28} /></span>
      <span>Partner-Finder</span>
    </a>
  );
}
