const express = require('express');
const {
  uploadNote,
  getCourseNotes,
  getNoteById,
  deleteNote
} = require('../controllers/noteController');
const {
  verifyToken,
  isTeacherForCourse,
  isEnrolledInCourse
} = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// Upload a new note (teacher only)
router.post('/:courseId', verifyToken, isTeacherForCourse, upload.single('file'), uploadNote);

// Get all notes for a course
router.get('/:courseId', verifyToken, isEnrolledInCourse, getCourseNotes);

// Get a specific note
router.get('/:courseId/:noteId', verifyToken, isEnrolledInCourse, getNoteById);

// Delete a note (teacher only)
router.delete('/:courseId/:noteId', verifyToken, isTeacherForCourse, deleteNote);

module.exports = router; 