const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true, maxlength: 80 },
  sport:       { type: String, required: true },
  venue:       { type: String, required: true, trim: true, maxlength: 120 },
  time:        { type: Date, required: true, index: true },
  skill:       { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Intermediate' },
  slots:       { type: Number, min: 2, max: 30, default: 6 },
  description: { type: String, default: '', maxlength: 600 },
  host:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  players:     [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

module.exports = mongoose.model('Match', matchSchema);
