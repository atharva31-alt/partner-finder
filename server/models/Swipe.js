const mongoose = require('mongoose');

const swipeSchema = new mongoose.Schema({
  from:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  to:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, enum: ['like', 'skip'], required: true },
}, { timestamps: true });

swipeSchema.index({ from: 1, to: 1 }, { unique: true });   // one decision per pair, no duplicate likes
swipeSchema.index({ to: 1, action: 1 });

module.exports = mongoose.model('Swipe', swipeSchema);
