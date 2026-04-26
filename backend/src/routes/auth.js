const express = require('express');
const {
  syncUser,
  getMe,
  updateProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Used for both login and register since Firebase handles auth.
// Sends the token and creates/finds the user.
router.post('/sync', syncUser);

router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

module.exports = router;
