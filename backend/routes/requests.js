const express = require('express');
const router = express.Router();
const PlayRequest = require('../models/PlayRequest');
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1] || req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey123');
        req.userId = decoded.userId; 
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

router.post('/create', authMiddleware, async (req, res) => {
    try {
        const { game, locationType, specificLocation, timeSlot } = req.body;

        const newPlayRequest = new PlayRequest({
            host: req.userId,
            game,
            locationType,
            specificLocation,
            timeSlot
        });

        const savedRequest = await newPlayRequest.save();
        res.status(201).json(savedRequest);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: err.message || 'Server error while creating invite' });
    }
});

router.get('/open', authMiddleware, async (req, res) => {
    try {
        const feedMatches = await PlayRequest.find({ host: { $ne: req.userId }, status: 'Open' })
            .populate('host', 'name skillLevel')
            .sort({ createdAt: -1 });
        res.json(feedMatches);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error retrieving feed' });
    }
});

router.put('/:id/accept', authMiddleware, async (req, res) => {
    try {
        const playRequest = await PlayRequest.findById(req.params.id);

        if (!playRequest) {
            return res.status(404).json({ message: 'Match request not found' });
        }

        if (playRequest.status !== 'Open') {
            return res.status(400).json({ message: 'This match is no longer open' });
        }

        if (playRequest.host.toString() === req.userId) {
            return res.status(400).json({ message: 'You cannot accept your own match request' });
        }

        playRequest.status = 'Matched';
        playRequest.acceptedBy = req.userId;

        await playRequest.save();
        res.json({ message: 'Match accepted successfully!', playRequest });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error while accepting match' });
    }
});

router.get('/my-matches', authMiddleware, async (req, res) => {
    try {
        const hosted = await PlayRequest.find({ host: req.userId }).sort({ createdAt: -1 });
        const joined = await PlayRequest.find({ acceptedBy: req.userId })
            .populate('host', 'name skillLevel')
            .sort({ createdAt: -1 });

        res.json({ hosted, joined });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error fetching user match ledger' });
    }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const playRequest = await PlayRequest.findById(req.params.id);

        if (!playRequest) {
            return res.status(404).json({ message: 'Match request not found' });
        }

        if (playRequest.host.toString() !== req.userId) {
            return res.status(401).json({ message: 'Unauthorized to delete this request' });
        }

        await PlayRequest.findByIdAndDelete(req.params.id);
        res.json({ message: 'Match request deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error while deleting request' });
    }
});

module.exports = router;