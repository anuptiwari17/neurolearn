const express = require('express');
const {
  createAnnouncement,
  getCourseAnnouncements,
  deleteAnnouncement
} = require('../controllers/announcementController');
const {
  verifyToken,
  isTeacherForCourse,
  isEnrolledInCourse
} = require('../middleware/authMiddleware');

const router = express.Router();

// Create a new announcement (teacher only)
router.post('/:courseId', verifyToken, isTeacherForCourse, createAnnouncement);

// Get all announcements for a course
router.get('/:courseId', verifyToken, isEnrolledInCourse, getCourseAnnouncements);

// Delete an announcement (teacher only)
router.delete('/:courseId/:announcementId', verifyToken, isTeacherForCourse, deleteAnnouncement);

module.exports = router; 