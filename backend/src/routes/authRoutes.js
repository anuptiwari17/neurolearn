const express = require('express');
const { registerUser, getUserProfile, updateUserProfile } = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Register a new user
router.post('/register', registerUser);

// Get user profile
router.get('/profile', verifyToken, getUserProfile);

// Update user profile
router.put('/profile', verifyToken, updateUserProfile);

module.exports = router; 