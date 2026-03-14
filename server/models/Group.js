const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    subject: { type: String, default: 'General' },
    color: {
      type: String,
      default: function () {
        const colors = ['#7c3aed', '#2563eb', '#059669', '#dc2626', '#ea580c', '#0891b2', '#7c2d12'];
        return colors[Math.floor(Math.random() * colors.length)];
      },
    },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Group', groupSchema);
