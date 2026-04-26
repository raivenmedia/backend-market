const admin = require('firebase-admin');

let app = null;
let adminDb = null;
let adminAuth = null;
let adminStorage = null;

try {
  if (!admin.apps.length) {
    // Load service account directly from the key file in the backend folder
    const serviceAccount = require('../../market-place-35c6d-firebase-adminsdk-fbsvc-51532129d5.json');

    app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'market-place-35c6d.firebasestorage.app',
    });
  } else {
    app = admin.app();
  }

  adminDb = admin.firestore();
  adminAuth = admin.auth();
  adminStorage = admin.storage();

  console.log('✅ Firebase Admin SDK initialised (market-place-35c6d)');
} catch (err) {
  console.error('❌ Firebase Admin SDK failed to initialise:', err.message);
}

module.exports = { admin, app, adminDb, adminAuth, adminStorage };
