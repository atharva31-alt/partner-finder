/**
 * Player compatibility, 0-100, computed only from stored profile data.
 * Weights: sports 30 + skill 20 + location 20 + playing times 15 + days 15 = 100.
 * Pure function: to plug in a real AI recommender later, replace score() and keep the return shape.
 */
const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const overlap = (a = [], b = []) => a.filter((x) => b.includes(x));
const ratio = (a = [], b = []) => (a.length && b.length ? overlap(a, b).length / Math.min(a.length, b.length) : null);

function distanceKm(a, b) {
  if (![a.lat, a.lng, b.lat, b.lng].every(Number.isFinite)) return null;
  const R = 6371, t = (x) => (x * Math.PI) / 180;
  const dLa = t(b.lat - a.lat), dLo = t(b.lng - a.lng);
  const h = Math.sin(dLa / 2) ** 2 + Math.cos(t(a.lat)) * Math.cos(t(b.lat)) * Math.sin(dLo / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

const label = (s) => s >= 85 ? 'Excellent sports partner!' : s >= 70 ? 'Great match' : s >= 50 ? 'Good potential' : s >= 30 ? 'Some common ground' : 'Worth a chat';

function score(a, b) {
  const parts = [];

  // 1. Shared sports (30)
  const shared = overlap(a.sports, b.sports);
  const r = ratio(a.sports, b.sports);
  parts.push({
    key: 'sports', label: 'Shared sports', max: 30,
    points: r === null ? 0 : Math.round(30 * r),
    detail: r === null ? 'Add sports to both profiles to compare' : shared.length ? `You both play ${shared.join(', ')}` : 'No sports in common yet',
  });

  // 2. Skill level (20)
  const ia = LEVELS.indexOf(a.skill), ib = LEVELS.indexOf(b.skill);
  const gap = ia < 0 || ib < 0 ? null : Math.abs(ia - ib);
  parts.push({
    key: 'skill', label: 'Skill level', max: 20,
    points: gap === null ? 0 : [20, 10, 0][gap],
    detail: gap === null ? 'Skill level missing' : gap === 0 ? `Both ${a.skill}` : gap === 1 ? 'One level apart' : 'Very different levels',
  });

  // 3. Location (20): real distance if both shared coordinates, otherwise same city
  const km = distanceKm(a, b);
  let lp = 0, ld;
  if (km !== null) {
    lp = km <= 3 ? 20 : km <= 10 ? 15 : km <= 25 ? 10 : km <= 50 ? 5 : 0;
    ld = `About ${Math.max(1, Math.round(km))} km apart`;
  } else if (a.locality && b.locality && a.locality.trim().toLowerCase() === b.locality.trim().toLowerCase()) {
    lp = 12; ld = `Both in ${b.locality}`;
  } else ld = 'Different or unknown areas';
  parts.push({ key: 'location', label: 'Proximity', max: 20, points: lp, detail: ld });

  // 4. Preferred playing times (15)  5. Available days (15)
  const rt = ratio(a.playTimes, b.playTimes), rd = ratio(a.days, b.days);
  parts.push({
    key: 'times', label: 'Playing times', max: 15, points: rt === null ? 0 : Math.round(15 * rt),
    detail: rt === null ? 'Add preferred times to compare' : overlap(a.playTimes, b.playTimes).join(', ') || 'No overlapping times',
  });
  parts.push({
    key: 'days', label: 'Availability', max: 15, points: rd === null ? 0 : Math.round(15 * rd),
    detail: rd === null ? 'Add available days to compare' : overlap(a.days, b.days).map((d) => d.toUpperCase()).join(', ') || 'No overlapping days',
  });

  const total = parts.reduce((s, p) => s + p.points, 0);
  return { score: total, label: label(total), breakdown: parts, distanceKm: km === null ? null : Math.max(1, Math.round(km)) };
}

module.exports = { score, distanceKm };
