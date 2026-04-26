const mongoose = require('mongoose');

const darkHorseLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // Could be null if event is pre-auth or system level
    },
    ipAddress: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['info', 'warning', 'violation', 'enforcement', 'system'],
    },
    action: {
      type: String,
      required: true,
    },
    severity: {
      type: Number,
      default: 1, // 1: Low, 2: Medium, 3: High, 4: Critical
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('DarkHorseLog', darkHorseLogSchema);
