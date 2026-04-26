const admin = require('firebase-admin');

let app = null;
let adminDb = null;
let adminAuth = null;
let adminStorage = null;

try {
  if (!admin.apps.length) {
    let serviceAccount;
    
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      // Use the JSON string from environment variable
      try {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      } catch (err) {
        console.error('❌ Failed to parse FIREBASE_SERVICE_ACCOUNT env var:', err.message);
      }
    } else {
      // Fallback to local file (development only)
      try {
        serviceAccount = require('../../market-place-35c6d-firebase-adminsdk-fbsvc-51532129d5.json');
      } catch (err) {
        console.warn('⚠️  Firebase service account file not found. Set FIREBASE_SERVICE_ACCOUNT in production.');
      }
    }

    if (serviceAccount) {
      app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'market-place-35c6d.firebasestorage.app',
      });
    } else {
      throw new Error('No Firebase service account credentials found.');
    }
  } else {
    app = admin.app();
  }

  adminDb = admin.firestore();
  adminAuth = admin.auth();
  adminStorage = admin.storage();

  console.log('✅ Firebase Admin SDK initialised');
} catch (err) {
  console.error('❌ Firebase Admin SDK failed to initialise:', err.message);
}

module.exports = { admin, app, adminDb, adminAuth, adminStorage };
