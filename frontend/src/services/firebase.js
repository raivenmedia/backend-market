// Firebase SDK imports
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase project configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDAg38kjMc5-y31xFzfPcYf0brJHgfamB4",
  authDomain: "market-place-35c6d.firebaseapp.com",
  projectId: "market-place-35c6d",
  storageBucket: "market-place-35c6d.firebasestorage.app",
  messagingSenderId: "1081774319141",
  appId: "1:1081774319141:web:2534c3ec9e96da5a3781cc",
  measurementId: "G-M0VKRGTHBM",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const analytics = getAnalytics(app); // Usage tracking & analytics
const auth = getAuth(app);           // Authentication (login, register, OAuth)
const db = getFirestore(app);        // Firestore database
const storage = getStorage(app);     // Cloud Storage (product images, avatars)

export { app, analytics, auth, db, storage };
