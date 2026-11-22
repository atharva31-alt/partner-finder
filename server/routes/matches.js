const router = require('express').Router();
const Match = require('../models/Match');
const Message = require('../models/Message');
const requireAuth = require('../middleware/auth');

const pop = (q) => q.populate('host', 'name avatar').populate('players', 'name avatar');
const isPlayer = (m, id) => m.players.some((p) => p.equals(id));

router.use(requireAuth);

// All upcoming matches
router.get('/', async (req, res) => {
  const list = await pop(Match.find({ time: { $gt: new Date(Date.now() - 36e5) } }).sort('time'));
  res.json(list);
});

// Create
router.post('/', async (req, res) => {
  const { title, sport, venue, time, skill, slots, description } = req.body;
  if (!title || !sport || !venue || !(new Date(time) > new Date()))
    return res.status(400).json({ message: 'Title, sport, venue and a future date are required.' });
  const m = await Match.create({
    title, sport, venue, time, skill, description,
    slots: Math.min(30, Math.max(2, Number(slots) || 6)),
    host: req.userId, players: [req.userId],
  });
  res.status(201).json(await pop(Match.findById(m._id)));
});

// Join
router.post('/:id/join', async (req, res) => {
  const m = await Match.findById(req.params.id);
  if (!m) return res.status(404).json({ message: 'Match not found.' });
  if (!isPlayer(m, req.userId)) {
    if (m.players.length >= m.slots) return res.status(400).json({ message: 'This match is full.' });
    m.players.push(req.userId);
    await m.save();
  }
  res.json(await pop(Match.findById(m._id)));
});

// Leave
router.post('/:id/leave', async (req, res) => {
  const m = await Match.findById(req.params.id);
  if (!m) return res.status(404).json({ message: 'Match not found.' });
  if (m.host.equals(req.userId)) return res.status(400).json({ message: 'Hosts can cancel the match instead of leaving.' });
  m.players = m.players.filter((p) => !p.equals(req.userId));
  await m.save();
  res.json(await pop(Match.findById(m._id)));
});

// Cancel (host only)
router.delete('/:id', async (req, res) => {
  const m = await Match.findById(req.params.id);
  if (!m) return res.status(404).json({ message: 'Match not found.' });
  if (!m.host.equals(req.userId)) return res.status(403).json({ message: 'Only the host can cancel.' });
  await Promise.all([m.deleteOne(), Message.deleteMany({ match: m._id })]);
  res.json({ ok: true });
});

// Match chat (participants only)
router.get('/:id/messages', async (req, res) => {
  const m = await Match.findById(req.params.id);
  if (!m || !isPlayer(m, req.userId)) return res.status(403).json({ message: 'Join the match to see its chat.' });
  res.json(await Message.find({ match: m._id }).sort('createdAt').limit(200).populate('user', 'name'));
});

router.post('/:id/messages', async (req, res) => {
  const m = await Match.findById(req.params.id);
  if (!m || !isPlayer(m, req.userId)) return res.status(403).json({ message: 'Join the match to chat.' });
  const text = (req.body.text || '').trim();
  if (!text) return res.status(400).json({ message: 'Message is empty.' });
  const msg = await Message.create({ match: m._id, user: req.userId, text });
  res.status(201).json(await msg.populate('user', 'name'));
});

module.exports = router;
