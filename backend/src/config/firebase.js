const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

// Path to service account file
const serviceAccountPath = path.resolve(__dirname, '../../serviceAccountKey.json');

// Initialize Firebase Admin SDK
const initializeFirebaseAdmin = () => {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountPath)
    });
    console.log('Firebase Admin SDK initialized successfully');
    return admin;
  } catch (error) {
    console.error('Error initializing Firebase Admin SDK:', error);
    process.exit(1);
  }
};

const firebaseAdmin = initializeFirebaseAdmin();
const db = admin.firestore();

module.exports = {
  admin,
  db,
  firebaseAdmin
}; 