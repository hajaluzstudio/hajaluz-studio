// src/services/firebaseConfig.js

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA1wWdP-dBjbKWD45NAVVyQ1_6Z7791xDE",
  authDomain: "site-haja-luz.firebaseapp.com",
  projectId: "site-haja-luz",
  storageBucket: "site-haja-luz.firebasestorage.app",
  messagingSenderId: "337766558443",
  appId: "1:337766558443:web:cadda999591a68dbe4acae",
  measurementId: "G-BTLGJNVK3V",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { app, analytics, db, firebaseConfig };
