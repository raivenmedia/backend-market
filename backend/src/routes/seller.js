const express = require('express');
const router = express.Router();
const { registerSeller, submitKYCVerification, getProfile, getNotifications, markNotificationRead } = require('../controllers/sellerController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// All seller routes are protected
router.use(protect);

// Register seller (no documents required upfront)
router.post('/register', registerSeller);

// Submit KYC verification (flexible: business or individual)
router.post('/kyc/verify', upload.fields([
  { name: 'businessPermit', maxCount: 1 },
  { name: 'nrcDocument', maxCount: 1 }
]), submitKYCVerification);

// Get seller profile
router.get('/profile', getProfile);

// Notifications
router.get('/notifications', getNotifications);
router.put('/notifications/:id/read', markNotificationRead);

module.exports = router;
