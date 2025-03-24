const express = require('express');
const {
  createDiscussion,
  getCourseDiscussions,
  getDiscussionById,
  addReply,
  deleteDiscussion
} = require('../controllers/discussionController');
const {
  verifyToken,
  isEnrolledInCourse
} = require('../middleware/authMiddleware');

const router = express.Router();

// Create a new discussion
router.post('/:courseId', verifyToken, isEnrolledInCourse, createDiscussion);

// Get all discussions for a course
router.get('/:courseId', verifyToken, isEnrolledInCourse, getCourseDiscussions);

// Get a specific discussion
router.get('/:courseId/:discussionId', verifyToken, isEnrolledInCourse, getDiscussionById);

// Add a reply to a discussion
router.post('/:courseId/:discussionId/replies', verifyToken, isEnrolledInCourse, addReply);

// Delete a discussion (only creator or teacher can delete)
router.delete('/:courseId/:discussionId', verifyToken, isEnrolledInCourse, deleteDiscussion);

module.exports = router; 