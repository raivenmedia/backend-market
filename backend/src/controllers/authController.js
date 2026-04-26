const User = require('../models/User');
const { adminAuth } = require('../utils/firebase-admin');

// POST /api/auth/sync — Called after Firebase login/register on frontend
// Frontend sends the Firebase ID token, backend verifies it and syncs user to MongoDB
exports.syncUser = async (req, res) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify Firebase token using Admin SDK
    const decodedToken = await adminAuth.verifyIdToken(token);
    const { uid, email, name: fbName } = decodedToken;

    // Check if user already exists in MongoDB
    let user = await User.findOne({ firebaseUID: uid });

    if (!user) {
      // First-time user — create their MongoDB record
      const name = req.body.name || fbName || (email ? email.split('@')[0] : 'User');
      const role = req.body.role || 'buyer'; // Role comes from registration form

      user = await User.create({
        firebaseUID: uid,
        name,
        email,
        role,
      });

      console.log(`✅ New user synced to MongoDB: ${email} (${role})`);
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        firebaseUID: user.firebaseUID,
      },
    });
  } catch (error) {
    console.error('Sync user error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, bio, address } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, bio, address },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
