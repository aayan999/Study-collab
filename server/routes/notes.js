const express = require('express');
const Note = require('../models/Note');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/notes?group=xxx
router.get('/', auth, async (req, res) => {
  try {
    const filter = {};
    if (req.query.group) filter.group = req.query.group;

    const notes = await Note.find(filter)
      .populate('author', 'name email avatar')
      .sort({ updatedAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/notes/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id).populate('author', 'name email avatar');
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/notes
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, group, tags } = req.body;
    if (!title || !group) return res.status(400).json({ message: 'Title and group are required' });

    const note = await Note.create({ title, content, group, tags, author: req.user._id });
    const populated = await Note.findById(note._id).populate('author', 'name email avatar');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/notes/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });

    const { title, content, tags } = req.body;
    if (title) note.title = title;
    if (content !== undefined) note.content = content;
    if (tags) note.tags = tags;

    await note.save();
    const populated = await Note.findById(note._id).populate('author', 'name email avatar');
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/notes/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    await note.deleteOne();
    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
