const mongoose = require('mongoose');

// A mutual like between two players ("match"). Named Connection to avoid confusion with game Matches.
const connectionSchema = new mongoose.Schema({
  users: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], validate: (v) => v.length === 2 },
  pair:  { type: String, required: true, unique: true },   // sorted "idA_idB": blocks duplicate matches
}, { timestamps: true });

connectionSchema.index({ users: 1 });

module.exports = mongoose.model('Connection', connectionSchema);
