const router = require('express').Router();
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const User = require('../models/User');
const Swipe = require('../models/Swipe');
const Connection = require('../models/Connection');
const requireAuth = require('../middleware/auth');
const publicUser = require('../utils/publicUser');
const { score } = require('../services/compat');
const { SPORTS, LEVELS, TIMES, DAYS } = require('../utils/constants');

router.use(requireAuth);

const strip = (s, n) => String(s ?? '').replace(/[<>\u0000-\u001f]/g, '').trim().slice(0, n);
const swipeLimiter = rateLimit({ windowMs: 60_000, max: 120, standardHeaders: true, legacyHeaders: false,
  message: { message: 'Too many swipes. Slow down a little.' } });
const PUBLIC_FIELDS = 'name username avatar age locality bio sports skill playTimes days lat lng blocked';

// What other players are allowed to see. Coordinates and email are never included.
const card = (u, me) => {
  const compat = score(me, u);
  return {
    id: String(u._id), name: u.name, username: u.username, avatar: u.avatar, age: u.age, city: u.locality,
    bio: u.bio, sports: u.sports, skill: u.skill, playTimes: u.playTimes, days: u.days,
    compat: { score: compat.score, label: compat.label, breakdown: compat.breakdown }, distanceKm: compat.distanceKm,
  };
};
const isBlocked = (a, b) => (a.blocked || []).some((x) => x.equals(b._id)) || (b.blocked || []).some((x) => x.equals(a._id));

// ---- update own profile (whitelisted + validated) ----
router.patch('/profile', async (req, res) => {
  try {
    const b = req.body || {};
    const u = await User.findById(req.userId);
    if (!u) return res.status(404).json({ message: 'User not found.' });
    const bad = (m) => res.status(400).json({ message: m });

    if ('name' in b) { const n = strip(b.name, 60); if (!n) return bad('Name cannot be empty.'); u.name = n; }
    if ('age' in b) {
      if (b.age === null || b.age === '') u.age = undefined;
      else { const a = Number(b.age); if (!Number.isInteger(a) || a < 13 || a > 100) return bad('Age must be between 13 and 100.'); u.age = a; }
    }
    if ('bio' in b) u.bio = strip(b.bio, 200);
    if ('locality' in b) u.locality = strip(b.locality, 60);
    if ('skill' in b) { if (!LEVELS.includes(b.skill)) return bad('Invalid skill level.'); u.skill = b.skill; }
    for (const [k, allowed, max] of [['sports', SPORTS, 8], ['playTimes', TIMES, 4], ['days', DAYS, 7]]) {
      if (!(k in b)) continue;
      if (!Array.isArray(b[k]) || b[k].length > max || !b[k].every((x) => allowed.includes(x))) return bad(`Invalid ${k}.`);
      u[k] = [...new Set(b[k])];
    }
    if (b.clearLocation) { u.lat = undefined; u.lng = undefined; }
    else if ('lat' in b || 'lng' in b) {
      if (typeof b.lat !== 'number' || typeof b.lng !== 'number' || Math.abs(b.lat) > 90 || Math.abs(b.lng) > 180) return bad('Invalid location.');
      u.lat = Math.round(b.lat * 100) / 100;   // ~1 km precision only
      u.lng = Math.round(b.lng * 100) / 100;
    }
    await u.save();
    res.json({ user: publicUser(u) });
  } catch (e) { res.status(500).json({ message: 'Could not save profile.' }); }
});

// ---- discover: ranked candidates the user has not seen, matched with, or blocked ----
router.get('/discover', async (req, res) => {
  try {
    const me = await User.findById(req.userId);
    if (!me) return res.status(404).json({ message: 'User not found.' });
    const limit = Math.min(30, Math.max(1, Number(req.query.limit) || 20));
    const [swiped, linked] = await Promise.all([
      Swipe.distinct('to', { from: me._id }),
      Connection.distinct('users', { users: me._id }),
    ]);
    const cands = await User.find({
      _id: { $nin: [me._id, ...swiped, ...linked, ...(me.blocked || [])] },
      blocked: { $ne: me._id },
    }).select(PUBLIC_FIELDS).limit(200);
    const users = cands.map((u) => card(u, me)).sort((a, b) => b.compat.score - a.compat.score).slice(0, limit);
    res.json({ users, profileIncomplete: !(me.sports && me.sports.length) });
  } catch (e) { res.status(500).json({ message: 'Could not load players.' }); }
});

// ---- like / skip. A mutual like creates exactly one connection ----
router.post('/swipe', swipeLimiter, async (req, res) => {
  try {
    const { to, action } = req.body || {};
    if (!mongoose.isValidObjectId(to) || !['like', 'skip'].includes(action)) return res.status(400).json({ message: 'Invalid request.' });
    if (String(to) === req.userId) return res.status(400).json({ message: 'You cannot swipe on yourself.' });
    const [me, other] = await Promise.all([User.findById(req.userId), User.findById(to)]);
    if (!me || !other) return res.status(404).json({ message: 'Player not found.' });
    if (isBlocked(me, other)) return res.status(403).json({ message: 'You cannot interact with this player.' });

    try { await Swipe.create({ from: me._id, to: other._id, action }); }
    catch (e) { if (e.code !== 11000) throw e; }          // already decided: ignore duplicates

    let matched = false, connectionId = null;
    if (action === 'like' && await Swipe.exists({ from: other._id, to: me._id, action: 'like' })) {
      const pair = [String(me._id), String(other._id)].sort();
      try { const c = await Connection.create({ users: pair, pair: pair.join('_') }); matched = true; connectionId = String(c._id); }
      catch (e) { if (e.code !== 11000) throw e; }          // connection already exists
    }
    res.json({ matched, connectionId, user: matched ? { id: String(other._id), name: other.name, username: other.username, avatar: other.avatar } : undefined });
  } catch (e) { res.status(500).json({ message: 'Could not save your choice.' }); }
});

// ---- my matches ----
router.get('/connections', async (req, res) => {
  try {
    const me = await User.findById(req.userId);
    const list = await Connection.find({ users: me._id }).sort('-createdAt').limit(100).populate('users', PUBLIC_FIELDS);
    const out = [];
    for (const c of list) {
      const o = c.users.find((x) => String(x._id) !== String(me._id));
      if (o && !isBlocked(me, o)) out.push({ id: String(c._id), since: c.createdAt, user: card(o, me) });
    }
    res.json(out);
  } catch (e) { res.status(500).json({ message: 'Could not load matches.' }); }
});

// ---- block a player: removes the connection and hides both of you from each other ----
router.post('/block/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id) || req.params.id === req.userId) return res.status(400).json({ message: 'Invalid request.' });
    await User.updateOne({ _id: req.userId }, { $addToSet: { blocked: req.params.id } });
    const pair = [req.userId, req.params.id].sort().join('_');
    await Connection.deleteOne({ pair });
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ message: 'Could not block this player.' }); }
});

module.exports = router;
