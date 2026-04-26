const { adminAuth } = require('../utils/firebase-admin');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  try {
    // Securely verify the Firebase ID token using Admin SDK
    const decodedToken = await adminAuth.verifyIdToken(token);

    // Find the user in MongoDB using their Firebase UID
    const user = await User.findOne({ firebaseUID: decodedToken.uid });

    if (!user) {
      return res.status(401).json({ message: 'Not authorized, user not found. Please register first.' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Firebase token verification failed:', error.message);
    return res.status(401).json({ message: 'Not authorized, invalid or expired token' });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({
          message: `Access denied. Your account role '${req.user.role}' cannot access this resource.`,
        });
    }
    next();
  };
};
