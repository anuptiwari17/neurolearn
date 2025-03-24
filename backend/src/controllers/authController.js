const { admin, db } = require('../config/firebase');

// Register a new user in Firestore after Firebase Auth signup
const registerUser = async (req, res) => {
  try {
    const { uid, displayName, email, role } = req.body;
    
    if (!uid || !email || !role) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: uid, email, or role'
      });
    }
    
    // Validate role
    if (role !== 'student' && role !== 'teacher') {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Role must be either "student" or "teacher"'
      });
    }
    
    // Check if user already exists
    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();
    
    if (userDoc.exists) {
      return res.status(409).json({
        success: false,
        message: 'User already exists'
      });
    }
    
    // Create user document
    const userData = {
      displayName: displayName || email.split('@')[0],
      email,
      role,
      createdAt: admin.firestore.Timestamp.now()
    };
    
    if (role === 'teacher') {
      userData.createdCourses = [];
    } else if (role === 'student') {
      userData.enrolledCourses = [];
    }
    
    await userRef.set(userData);
    
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: { uid, ...userData }
    });
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to register user',
      error: error.message
    });
  }
};

// Get user profile data
const getUserProfile = async (req, res) => {
  try {
    // User data is already available through auth middleware
    const userData = req.user;
    
    if (!userData) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      user: userData
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch user profile',
      error: error.message
    });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { displayName } = req.body;
    
    if (!displayName) {
      return res.status(400).json({
        success: false,
        message: 'No update data provided'
      });
    }
    
    const userRef = db.collection('users').doc(userId);
    
    const updateData = {
      displayName,
      updatedAt: admin.firestore.Timestamp.now()
    };
    
    await userRef.update(updateData);
    
    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
};

module.exports = {
  registerUser,
  getUserProfile,
  updateUserProfile
}; 