const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const requireAuth = require('../middleware/auth');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const sign = (user) => jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
const publicUser = require('../utils/publicUser');

// ---- username helpers ----
const UN = /^[a-z][a-z0-9_]{2,19}$/;                 // 3-20 chars, starts with a letter
const UN_MSG = 'Username must be 3-20 characters: letters, numbers or underscore, starting with a letter.';
const RESERVED = ['admin', 'root', 'support', 'system', 'partnerfinder', 'partner_finder', 'null', 'undefined'];
const clean = (s) => String(s || '').trim().toLowerCase();
const taken = async (u) => RESERVED.includes(u) || !!(await User.exists({ username: u }));

async function uniqueUsername(seed) {
  let base = clean(seed).replace(/[^a-z0-9_]/g, '');
  if (!/^[a-z]/.test(base)) base = 'u' + base;
  if (base.length < 3) base += '_pf';
  base = base.slice(0, 14);
  let name = base;
  while (await taken(name)) name = base + Math.floor(100 + Math.random() * 900);
  return name;
}
// accounts created before usernames existed (or via Google) get one automatically
async function ensureUsername(user) {
  if (!user.username) {
    user.username = await uniqueUsername(user.email.split('@')[0]);
    await user.save();
  }
  return user;
}

// ---- register ----
router.post('/register', async (req, res) => {
  try {
    const { name, password, locality, skill } = req.body;
    const email = clean(req.body.email), username = clean(req.body.username);
    if (!name || !email || !password || password.length < 6)
      return res.status(400).json({ message: 'Name, email and a 6+ character password are required.' });
    if (!UN.test(username) || RESERVED.includes(username)) return res.status(400).json({ message: UN_MSG });
    if (await User.exists({ email })) return res.status(409).json({ message: 'This email is already registered.' });
    if (await taken(username)) return res.status(409).json({ message: 'That username is taken.' });
    const user = await User.create({
      name, email, username, locality, skill, password: await bcrypt.hash(password, 10),
    });
    res.status(201).json({ token: sign(user), user: publicUser(user) });
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ message: 'Email or username is already taken.' });
    res.status(500).json({ message: 'Registration failed.' });
  }
});

// ---- login with email OR username ----
router.post('/login', async (req, res) => {
  try {
    const id = clean(req.body.identifier || req.body.email);
    const user = id && await User.findOne(id.includes('@') ? { email: id } : { username: id }).select('+password');
    if (!user || !user.password)
      return res.status(401).json({ message: 'Wrong email/username or password. If you signed up with Google, use the Google button.' });
    if (!(await bcrypt.compare(req.body.password || '', user.password)))
      return res.status(401).json({ message: 'Wrong email/username or password.' });
    await ensureUsername(user);
    res.json({ token: sign(user), user: publicUser(user) });
  } catch (e) { res.status(500).json({ message: 'Login failed.' }); }
});

// ---- Google sign-in ----
router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) return res.status(400).json({ message: 'Missing Google credential.' });
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const p = ticket.getPayload();
    if (!p.email_verified) return res.status(401).json({ message: 'Google email is not verified.' });
    const email = p.email.toLowerCase();

    let user = await User.findOne({ $or: [{ googleId: p.sub }, { email }] });
    if (!user) {
      user = await User.create({
        name: p.name, email, googleId: p.sub, avatar: p.picture || '', provider: 'google',
        username: await uniqueUsername(email.split('@')[0]),
      });
    } else {
      if (!user.googleId) user.googleId = p.sub;
      if (!user.avatar) user.avatar = p.picture || '';
      await user.save();
      await ensureUsername(user);
    }
    res.json({ token: sign(user), user: publicUser(user) });
  } catch (e) {
    res.status(401).json({ message: 'Google sign-in failed. Please try again.' });
  }
});

// ---- username availability (public) and change (logged in) ----
router.get('/username-available', async (req, res) => {
  const u = clean(req.query.u);
  if (!UN.test(u)) return res.json({ available: false, reason: UN_MSG });
  if (await taken(u)) return res.json({ available: false, reason: 'That username is taken.' });
  res.json({ available: true });
});

router.patch('/username', requireAuth, async (req, res) => {
  try {
    const u = clean(req.body.username);
    if (!UN.test(u)) return res.status(400).json({ message: UN_MSG });
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    if (u !== user.username && await taken(u)) return res.status(409).json({ message: 'That username is taken.' });
    user.username = u;
    await user.save();
    res.json({ user: publicUser(user) });
  } catch (e) {
    res.status(e.code === 11000 ? 409 : 500).json({ message: e.code === 11000 ? 'That username is taken.' : 'Could not update username.' });
  }
});

router.get('/me', requireAuth, async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ message: 'User not found.' });
  await ensureUsername(user);
  res.json({ user: publicUser(user) });
});

module.exports = router;
