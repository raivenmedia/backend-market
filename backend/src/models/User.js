const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    firebaseUID: {
      type: String,
      required: [true, 'Please provide a firebaseUID'],
      unique: true,
    },
    role: {
      type: String,
      enum: ['buyer', 'seller'],
      default: 'buyer',
    },
    avatar: {
      type: String,
      default: 'https://via.placeholder.com/150',
    },
    bio: String,
    phone: String,
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    darkhorse: {
      violationCount: { type: Number, default: 0 },
      lastViolation: { type: Date },
      isFlagged: { type: Boolean, default: false },
      isLocked: { type: Boolean, default: false },
      lockReason: { type: String },
      lockExpiresAt: { type: Date },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
