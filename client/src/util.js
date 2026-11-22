export const fmt = (t) => new Date(t).toLocaleString([], { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
export const inM = (m, u) => m.players.some((p) => p._id === u.id);
export const hostOf = (m, u) => m.host._id === u.id;
export const until = (t) => {
  const d = new Date(t) - Date.now();
  return d <= 0 ? 'Started' : d < 36e5 ? Math.round(d / 6e4) + ' min' : d < 864e5 ? Math.round(d / 36e5) + ' hr' : Math.round(d / 864e5) + ' days';
};
export const UN = /^[a-z][a-z0-9_]{2,19}$/;
export const UN_MSG = 'Use 3-20 characters: letters, numbers or underscore, starting with a letter.';
export const SPORTS = ['Cricket', 'Football', 'Badminton', 'Basketball', 'Tennis', 'Running', 'Table Tennis', 'Chess'];
export const TIMES = ['morning', 'afternoon', 'evening', 'night'];
export const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
export const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
export const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
