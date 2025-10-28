// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyALpR2a_8scEDIsR1GfwV3nBDUV08ddfEk",
  authDomain: "signup-login-to-dashboard.firebaseapp.com",
  projectId: "signup-login-to-dashboard",
  storageBucket: "signup-login-to-dashboard.firebasestorage.app",
  messagingSenderId: "271698937578",
  appId: "1:271698937578:web:a65c2a1f352d028cfef993",
  measurementId: "G-FT11VYYD7L",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Storage
export const storage = getStorage(app);

export default app;
