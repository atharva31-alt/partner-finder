const mongoose = require('mongoose');

const PlayRequestSchema = new mongoose.Schema({
    host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    game: { type: String, required: true },
    locationType: { type: String, enum: ['Home', 'Society Clubhouse', 'Local Ground'], required: true },
    specificLocation: { type: String, required: true },
    timeSlot: { type: String, required: true },
    status: { type: String, enum: ['Open', 'Matched', 'Cancelled'], default: 'Open' },
    acceptedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true });

module.exports = mongoose.model('PlayRequest', PlayRequestSchema);