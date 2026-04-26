const Seller = require('../models/Seller');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { uploadToCloudinary } = require('../utils/cloudinaryHelpers');

// Register seller (no verification required - just create profile)
exports.registerSeller = async (req, res) => {
  try {
    const { businessName, businessType, phone, address, city, country } = req.body;
    
    // Check if seller already exists for this user
    let seller = await Seller.findOne({ userId: req.user._id });
    if (seller) {
      return res.status(400).json({ message: 'Seller profile already exists for this user.' });
    }

    // Create seller profile WITHOUT requiring verification
    seller = await Seller.create({
      userId: req.user._id,
      businessName,
      businessType,
      email: req.user.email,
      phone,
      location: {
        address,
        city,
        country,
      },
      // New flexible KYC fields
      verificationType: 'unverified',
      verificationStatus: 'unverified',
      // Legacy fields for backward compatibility
      kycStatus: 'Approved', // Allow sellers to use platform immediately
    });

    // Update user role to seller if not already
    if (req.user.role !== 'seller') {
      await User.findByIdAndUpdate(req.user._id, { role: 'seller' });
    }

    res.status(201).json({
      success: true,
      seller,
      message: 'Seller profile created! You can now start selling. Verify your shop later to build trust with buyers.',
    });
  } catch (error) {
    console.error('Register seller error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Submit KYC verification (flexible - can be business or individual)
exports.submitKYCVerification = async (req, res) => {
  try {
    const { verificationType, address } = req.body;
    
    if (!verificationType || !['business', 'individual'].includes(verificationType)) {
      return res.status(400).json({ message: 'Valid verification type is required (business or individual)' });
    }

    let seller = await Seller.findOne({ userId: req.user._id });
    if (!seller) {
      return res.status(404).json({ message: 'Seller profile not found' });
    }

    // Update verification type
    seller.verificationType = verificationType;
    seller.verificationStatus = 'pending';

    // Handle Business Verification
    if (verificationType === 'business') {
      if (!req.files?.businessPermit) {
        return res.status(400).json({ message: 'Business permit document is required' });
      }
      const permitResult = await uploadToCloudinary(req.files.businessPermit[0].buffer);
      seller.businessPermit = {
        url: permitResult.secure_url,
        cloudinaryId: permitResult.public_id,
      };
    }

    // Handle Individual Verification
    if (verificationType === 'individual') {
      if (!req.files?.nrcDocument) {
        return res.status(400).json({ message: 'NRC/ID document is required' });
      }
      if (!address) {
        return res.status(400).json({ message: 'Home address is required' });
      }
      const nrcResult = await uploadToCloudinary(req.files.nrcDocument[0].buffer);
      seller.nrcDocument = {
        url: nrcResult.secure_url,
        cloudinaryId: nrcResult.public_id,
      };
      seller.address = address;
    }

    await seller.save();

    res.status(200).json({
      success: true,
      seller,
      message: 'Verification documents submitted. Your shop will be verified within 24-48 hours.',
    });
  } catch (error) {
    console.error('KYC verification error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const seller = await Seller.findOne({ userId: req.user._id }).populate('userId', 'name email avatar');
    if (!seller) {
      return res.status(404).json({ message: 'Seller profile not found. Please complete onboarding.' });
    }
    res.status(200).json({
      success: true,
      seller,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const seller = await Seller.findOne({ userId: req.user._id });
    if (!seller) {
      return res.status(404).json({ message: 'Seller profile not found' });
    }

    const notifications = await Notification.find({ sellerId: seller._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndUpdate(id, { read: true }, { new: true });
    res.status(200).json({ success: true, notification });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
