const express = require('express');
const {
  sendMessage,
  getConversation,
  getUserConversations,
  markMessagesAsRead,
  getCourseParticipants
} = require('../controllers/messageController');
const {
  verifyToken,
  isEnrolledInCourse
} = require('../middleware/authMiddleware');

const router = express.Router();

// Send a new message
router.post('/', verifyToken, sendMessage);

// Get conversation between two users
router.get('/conversation/:otherUserId/:courseId', verifyToken, getConversation);

// Get all conversations for the current user
router.get('/conversations', verifyToken, getUserConversations);

// Mark messages as read
router.put('/read/:otherUserId', verifyToken, markMessagesAsRead);

// Get all participants in a course for messaging
router.get('/participants/:courseId', verifyToken, isEnrolledInCourse, getCourseParticipants);

module.exports = router; 