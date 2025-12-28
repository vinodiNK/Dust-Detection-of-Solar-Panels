// Firebase initialization - replace config values with your project settings
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCMvRrA4q23p2bdXAZ7yVAk-SiSbwelRJo",
  authDomain: "dust-detection-of-solar-panels.firebaseapp.com",
  projectId: "dust-detection-of-solar-panels",
  storageBucket: "dust-detection-of-solar-panels.firebasestorage.app",
  messagingSenderId: "720925054070",
  appId: "1:720925054070:web:8b5514f819eade09263b57",
  measurementId: "G-L9SWZ08L1V"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Note: keep your real config secure; for local dev this file is fine.
