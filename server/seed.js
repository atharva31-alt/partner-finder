// Adds demo users and matches so the dashboard is not empty.  Run: npm run seed
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Match = require('./models/Match');

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const pw = await bcrypt.hash('demo1234', 10);
  // Optional development data only. These are clearly demo accounts (password: demo1234).
  const mk = (name, email, profile) => User.findOneAndUpdate(
    { email },
    { $setOnInsert: { name, username: name.toLowerCase(), email, password: pw, locality: 'Dehradun' }, $set: profile },
    { upsert: true, new: true });
  const [riya, kabir, mehul] = await Promise.all([
    mk('Riya', 'riya@demo.in', { age: 22, bio: 'Badminton addict. Weekend cricket when I can.', skill: 'Intermediate', sports: ['Badminton', 'Cricket', 'Basketball'], playTimes: ['morning', 'evening'], days: ['sat', 'sun', 'wed'] }),
    mk('Kabir', 'kabir@demo.in', { age: 24, bio: 'Football every evening. Always up for a 5K run.', skill: 'Intermediate', sports: ['Football', 'Running'], playTimes: ['evening'], days: ['mon', 'wed', 'fri', 'sat'] }),
    mk('Mehul', 'mehul@demo.in', { age: 21, bio: 'Tape-ball cricketer and table tennis regular.', skill: 'Advanced', sports: ['Cricket', 'Table Tennis'], playTimes: ['afternoon', 'evening'], days: ['sat', 'sun'] })]);
  await Promise.all([
    mk('Ananya', 'ananya@demo.in', { age: 23, bio: 'New to tennis, keen to learn with a patient partner.', skill: 'Beginner', sports: ['Tennis', 'Badminton'], playTimes: ['morning'], days: ['sat', 'sun'] }),
    mk('Rohan', 'rohan@demo.in', { age: 26, bio: 'Basketball and early morning runs.', skill: 'Advanced', sports: ['Basketball', 'Running', 'Football'], playTimes: ['morning', 'night'], days: ['tue', 'thu', 'sat'] }),
    mk('Simran', 'simran@demo.in', { age: 20, bio: 'Chess club captain who also plays table tennis.', skill: 'Intermediate', sports: ['Chess', 'Table Tennis'], playTimes: ['afternoon'], days: ['mon', 'tue', 'wed', 'thu', 'fri'] })]);

  if (await Match.countDocuments({ host: { $in: [riya._id, kabir._id, mehul._id] } })) {
    console.log('Demo matches already exist. Nothing to do.'); return mongoose.disconnect();
  }
  const H = 36e5, at = (h) => new Date(Date.now() + h * H);
  await Match.insertMany([
    { title: '5-a-side evening kickabout', sport: 'Football', venue: 'Parade Ground', time: at(3), skill: 'Intermediate', slots: 10, host: kabir._id, players: [kabir._id, mehul._id],
      description: 'Friendly 5-a-side on the open ground. Bring sports shoes and a water bottle. Two balanced teams, 40 minutes with a short break.' },
    { title: 'Doubles practice', sport: 'Badminton', venue: 'Rajpur Road Courts', time: at(6), skill: 'Beginner', slots: 4, host: riya._id, players: [riya._id],
      description: 'Relaxed doubles for beginners. Rackets and shuttles are provided. Expect partner rotations and basic footwork drills.' },
    { title: 'Weekend tape-ball match', sport: 'Cricket', venue: 'Graphic Era Ground', time: at(26), skill: 'Advanced', slots: 12, host: mehul._id, players: [mehul._id, kabir._id, riya._id],
      description: '8 overs a side. Bring your own bat if you have one. Fast pace, advanced players preferred.' },
    { title: 'Sunrise 5K at FRI', sport: 'Running', venue: 'FRI Forest Track', time: at(30), skill: 'Beginner', slots: 20, host: kabir._id, players: [kabir._id],
      description: 'Easy-pace 5K around the forest track. All fitness levels welcome. Warm-up first, stretching after.' },
    { title: 'Half-court 3v3', sport: 'Basketball', venue: 'Community Court, Ballupur', time: at(28), skill: 'Intermediate', slots: 8, host: riya._id, players: [riya._id, mehul._id],
      description: 'Casual 3v3 half-court games to 11. Bring a light and a dark shirt so teams are easy to spot.' },
    { title: 'Lunch-break table tennis', sport: 'Table Tennis', venue: 'Sports Club, Clock Tower', time: at(50), skill: 'Beginner', slots: 6, host: mehul._id, players: [mehul._id],
      description: 'Quick round-robin during lunch. Paddles and balls available at the club.' },
  ]);
  console.log('Seeded 3 demo users (password: demo1234) and 6 matches.');
  await mongoose.disconnect();
})().catch((e) => { console.error(e.message); process.exit(1); });
