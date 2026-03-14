const express = require('express');
const Message = require('../models/Message');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/messages?group=xxx
router.get('/', auth, async (req, res) => {
  try {
    if (!req.query.group) return res.status(400).json({ message: 'Group ID required' });

    const messages = await Message.find({ group: req.query.group })
      .populate('sender', 'name email avatar')
      .sort({ createdAt: 1 })
      .limit(100);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
