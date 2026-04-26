const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fullName: {
      type: String,
      trim: true,
    },
    businessName: {
      type: String,
      required: [true, 'Please provide a business name'],
      trim: true,
    },
    businessType: {
      type: String,
      enum: ['individual', 'company'],
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    location: {
      address: String,
      city: String,
      country: String,
    },
    // Flexible KYC Fields
    verificationType: {
      type: String,
      enum: ['business', 'individual', 'unverified'],
      default: 'unverified',
    },
    verificationStatus: {
      type: String,
      enum: ['unverified', 'pending', 'verified', 'rejected'],
      default: 'unverified',
    },
    // Business Verification
    businessPermit: {
      url: String,
      cloudinaryId: String,
    },
    // Individual Verification
    nrcDocument: {
      url: String,
      cloudinaryId: String,
    },
    address: String,
    // Legacy KYC Fields (kept for backward compatibility)
    kycStatus: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Approved',
    },
    documents: [
      {
        docType: { type: String, enum: ['ID', 'BusinessLicense', 'Other'] },
        url: String,
        cloudinaryId: String,
      }
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Seller', sellerSchema);
