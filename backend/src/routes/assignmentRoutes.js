const express = require('express');
const {
  createAssignment,
  getCourseAssignments,
  getAssignmentById,
  submitAssignment,
  getAssignmentSubmissions,
  gradeSubmission,
  getStudentSubmission
} = require('../controllers/assignmentController');
const {
  verifyToken,
  isTeacherForCourse,
  isEnrolledInCourse,
  isStudent
} = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// Create a new assignment (teacher only)
router.post('/:courseId', verifyToken, isTeacherForCourse, createAssignment);

// Get all assignments for a course
router.get('/:courseId', verifyToken, isEnrolledInCourse, getCourseAssignments);

// Get a specific assignment
router.get('/:courseId/:assignmentId', verifyToken, isEnrolledInCourse, getAssignmentById);

// Submit an assignment (student only)
router.post('/:courseId/:assignmentId/submit', verifyToken, isStudent, upload.single('file'), submitAssignment);

// Get all submissions for an assignment (teacher only)
router.get('/:courseId/:assignmentId/submissions', verifyToken, isTeacherForCourse, getAssignmentSubmissions);

// Grade a submission (teacher only)
router.put('/:courseId/:assignmentId/submissions/:submissionId/grade', verifyToken, isTeacherForCourse, gradeSubmission);

// Get student's own submission
router.get('/:courseId/:assignmentId/my-submission', verifyToken, isStudent, getStudentSubmission);

module.exports = router; 