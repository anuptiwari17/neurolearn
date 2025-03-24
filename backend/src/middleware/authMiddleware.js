const { admin } = require('../config/firebase');
const { db } = require('../config/firebase');

// Verify Firebase Auth token
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'Unauthorized: No token provided' 
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify the token
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    if (!decodedToken) {
      return res.status(401).json({ 
        success: false, 
        message: 'Unauthorized: Invalid token' 
      });
    }
    
    // Get user data from Firestore
    const userSnapshot = await db.collection('users').doc(decodedToken.uid).get();
    
    if (!userSnapshot.exists) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found in database' 
      });
    }
    
    // Add user data to request object
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      ...userSnapshot.data()
    };
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ 
      success: false, 
      message: 'Unauthorized: Invalid token',
      error: error.message 
    });
  }
};

// Check if user is a teacher
const isTeacher = (req, res, next) => {
  if (req.user && req.user.role === 'teacher') {
    next();
  } else {
    return res.status(403).json({ 
      success: false, 
      message: 'Forbidden: Teacher access required' 
    });
  }
};

// Check if user is a student
const isStudent = (req, res, next) => {
  if (req.user && req.user.role === 'student') {
    next();
  } else {
    return res.status(403).json({ 
      success: false, 
      message: 'Forbidden: Student access required' 
    });
  }
};

// Check if user is a teacher for a specific course
const isTeacherForCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.uid;
    
    // Get course data
    const courseSnapshot = await db.collection('courses').doc(courseId).get();
    
    if (!courseSnapshot.exists) {
      return res.status(404).json({ 
        success: false, 
        message: 'Course not found' 
      });
    }
    
    const course = courseSnapshot.data();
    
    // Check if the user is the teacher for this course
    if (course.teacherId === userId) {
      next();
    } else {
      return res.status(403).json({ 
        success: false, 
        message: 'Forbidden: You are not the teacher for this course' 
      });
    }
  } catch (error) {
    console.error('Teacher authorization error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error during authorization check',
      error: error.message 
    });
  }
};

// Check if user is enrolled in a specific course
const isEnrolledInCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.uid;
    
    // Get course data
    const courseSnapshot = await db.collection('courses').doc(courseId).get();
    
    if (!courseSnapshot.exists) {
      return res.status(404).json({ 
        success: false, 
        message: 'Course not found' 
      });
    }
    
    const course = courseSnapshot.data();
    
    // Check if the user is the teacher or a student in this course
    if (course.teacherId === userId || (course.students && course.students.includes(userId))) {
      req.course = course;
      next();
    } else {
      return res.status(403).json({ 
        success: false, 
        message: 'Forbidden: You are not enrolled in this course' 
      });
    }
  } catch (error) {
    console.error('Course enrollment authorization error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error during authorization check',
      error: error.message 
    });
  }
};

module.exports = {
  verifyToken,
  isTeacher,
  isStudent,
  isTeacherForCourse,
  isEnrolledInCourse
}; 