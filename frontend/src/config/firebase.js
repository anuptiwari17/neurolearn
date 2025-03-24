import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA0PSi5pdSet3lxiyYEIxlFvEQ-XNvMCAY",
  authDomain: "neurolearn-ded3a.firebaseapp.com",
  projectId: "neurolearn-ded3a",
  storageBucket: "neurolearn-ded3a.firebasestorage.app",
  messagingSenderId: "1024203274669",
  appId: "1:1024203274669:web:aaa51afb2a58be4449c924",
  measurementId: "G-EJPP07K0C2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {
  app,
  auth,
  db,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
}; 