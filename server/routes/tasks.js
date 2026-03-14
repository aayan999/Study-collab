const express = require('express');
const Task = require('../models/Task');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/tasks?group=xxx
router.get('/', auth, async (req, res) => {
  try {
    const filter = {};
    if (req.query.group) filter.group = req.query.group;

    const tasks = await Task.find(filter)
      .populate('assignee', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/tasks
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, group, assignee, priority } = req.body;
    if (!title || !group) return res.status(400).json({ message: 'Title and group are required' });

    const task = await Task.create({
      title,
      description,
      group,
      assignee: assignee || null,
      priority: priority || 'medium',
      createdBy: req.user._id,
    });

    const populated = await Task.findById(task._id)
      .populate('assignee', 'name email avatar')
      .populate('createdBy', 'name email avatar');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/tasks/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const { title, description, status, assignee, priority } = req.body;
    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (assignee !== undefined) task.assignee = assignee;

    await task.save();
    const populated = await Task.findById(task._id)
      .populate('assignee', 'name email avatar')
      .populate('createdBy', 'name email avatar');
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/tasks/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    await task.deleteOne();
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
