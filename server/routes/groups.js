const express = require('express');
const Group = require('../models/Group');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/groups — list groups for current user
router.get('/', auth, async (req, res) => {
  try {
    const groups = await Group.find({ members: req.user._id })
      .populate('owner', 'name email avatar')
      .populate('members', 'name email avatar')
      .sort({ updatedAt: -1 });
    res.json(groups);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/groups/explore — list all groups
router.get('/explore', auth, async (req, res) => {
  try {
    const groups = await Group.find()
      .populate('owner', 'name email avatar')
      .populate('members', 'name email avatar')
      .sort({ createdAt: -1 });
    res.json(groups);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/groups/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('owner', 'name email avatar')
      .populate('members', 'name email avatar');
    if (!group) return res.status(404).json({ message: 'Group not found' });
    res.json(group);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/groups
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, subject } = req.body;
    if (!name) return res.status(400).json({ message: 'Group name is required' });

    const group = await Group.create({
      name,
      description,
      subject,
      owner: req.user._id,
      members: [req.user._id],
    });

    const populated = await Group.findById(group._id)
      .populate('owner', 'name email avatar')
      .populate('members', 'name email avatar');

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/groups/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Group not found' });
    if (group.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the owner can edit this group' });
    }

    const { name, description, subject } = req.body;
    if (name) group.name = name;
    if (description !== undefined) group.description = description;
    if (subject) group.subject = subject;

    await group.save();
    const populated = await Group.findById(group._id)
      .populate('owner', 'name email avatar')
      .populate('members', 'name email avatar');
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/groups/:id/join
router.post('/:id/join', auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    if (group.members.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already a member' });
    }

    group.members.push(req.user._id);
    await group.save();
    const populated = await Group.findById(group._id)
      .populate('owner', 'name email avatar')
      .populate('members', 'name email avatar');
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/groups/:id/leave
router.post('/:id/leave', auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    group.members = group.members.filter((m) => m.toString() !== req.user._id.toString());
    await group.save();
    res.json({ message: 'Left the group' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/groups/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Group not found' });
    if (group.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the owner can delete this group' });
    }
    await group.deleteOne();
    res.json({ message: 'Group deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
