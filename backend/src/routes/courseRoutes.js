const express = require('express');
const { 
  createCourse, 
  getTeacherCourses, 
  getStudentCourses,
  getCourseById, 
  joinCourse,
  updateCourseSyllabus,
  getCourseStudents
} = require('../controllers/courseController');
const { 
  verifyToken, 
  isTeacher, 
  isStudent, 
  isTeacherForCourse, 
  isEnrolledInCourse 
} = require('../middleware/authMiddleware');

const router = express.Router();

// Create a new course (teacher only)
router.post('/', verifyToken, isTeacher, createCourse);

// Get all courses for the current teacher
router.get('/teacher', verifyToken, isTeacher, getTeacherCourses);

// Get all courses for the current student
router.get('/student', verifyToken, isStudent, getStudentCourses);

// Get a specific course by ID (if enrolled or is teacher)
router.get('/:courseId', verifyToken, isEnrolledInCourse, getCourseById);

// Join a course as a student
router.post('/join', verifyToken, isStudent, joinCourse);

// Update course syllabus (teacher only)
router.put('/:courseId/syllabus', verifyToken, isTeacherForCourse, updateCourseSyllabus);

// Get students in a course (teacher only)
router.get('/:courseId/students', verifyToken, isTeacherForCourse, getCourseStudents);

module.exports = router; 