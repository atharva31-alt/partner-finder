const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  username: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, select: false },
  googleId: { type: String, unique: true, sparse: true },
  avatar:   { type: String, default: '' },
  provider: { type: String, enum: ['local', 'google'], default: 'local' },
  age:      { type: Number, min: 13, max: 100 },
  bio:      { type: String, default: '', maxlength: 200 },
  sports:   [{ type: String, enum: ['Cricket', 'Football', 'Badminton', 'Basketball', 'Tennis', 'Running', 'Table Tennis', 'Chess'] }],
  playTimes:[{ type: String, enum: ['morning', 'afternoon', 'evening', 'night'] }],
  days:     [{ type: String, enum: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] }],
  lat:      { type: Number, min: -90, max: 90 },     // rounded to ~1 km, never returned to other users
  lng:      { type: Number, min: -180, max: 180 },
  blocked:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  locality: { type: String, default: '' },
  skill:    { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Intermediate' },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
