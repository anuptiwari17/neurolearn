const { admin, db } = require('../config/firebase');
const { v4: uuidv4 } = require('uuid');

// Create a new course
const createCourse = async (req, res) => {
  try {
    const { title, description, subject, code } = req.body;
    const teacherId = req.user.uid;
    const teacherName = req.user.displayName;
    
    if (!title || !subject) {
      return res.status(400).json({
        success: false,
        message: 'Title and subject are required fields'
      });
    }
    
    // Generate a unique course ID
    const courseId = uuidv4();
    
    // Create course object
    const courseData = {
      title,
      description: description || '',
      subject,
      code: code || `${subject.substring(0, 3).toUpperCase()}${Math.floor(100 + Math.random() * 900)}`,
      teacherId,
      teacherName,
      createdAt: admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now(),
      students: [],
      syllabus: []
    };
    
    // Add course to Firestore
    const courseRef = db.collection('courses').doc(courseId);
    await courseRef.set(courseData);
    
    // Update teacher's created courses
    const teacherRef = db.collection('users').doc(teacherId);
    await teacherRef.update({
      createdCourses: admin.firestore.FieldValue.arrayUnion(courseId)
    });
    
    return res.status(201).json({
      success: true,
      message: 'Course created successfully',
      courseId,
      course: courseData
    });
  } catch (error) {
    console.error('Error creating course:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create course',
      error: error.message
    });
  }
};

// Get all courses for a teacher
const getTeacherCourses = async (req, res) => {
  try {
    const teacherId = req.user.uid;
    
    // Get courses where teacherId matches
    const coursesSnapshot = await db.collection('courses')
      .where('teacherId', '==', teacherId)
      .orderBy('createdAt', 'desc')
      .get();
    
    if (coursesSnapshot.empty) {
      return res.status(200).json({
        success: true,
        courses: []
      });
    }
    
    // Format courses data
    const courses = [];
    coursesSnapshot.forEach(doc => {
      courses.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return res.status(200).json({
      success: true,
      courses
    });
  } catch (error) {
    console.error('Error fetching teacher courses:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch courses',
      error: error.message
    });
  }
};

// Get all courses for a student
const getStudentCourses = async (req, res) => {
  try {
    const studentId = req.user.uid;
    
    // Get courses where student is enrolled
    const coursesSnapshot = await db.collection('courses')
      .where('students', 'array-contains', studentId)
      .get();
    
    if (coursesSnapshot.empty) {
      return res.status(200).json({
        success: true,
        courses: []
      });
    }
    
    // Format courses data
    const courses = [];
    coursesSnapshot.forEach(doc => {
      courses.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return res.status(200).json({
      success: true,
      courses
    });
  } catch (error) {
    console.error('Error fetching student courses:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch courses',
      error: error.message
    });
  }
};

// Get a single course by ID
const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    // Get course data
    const courseSnapshot = await db.collection('courses').doc(courseId).get();
    
    if (!courseSnapshot.exists) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    const courseData = {
      id: courseSnapshot.id,
      ...courseSnapshot.data()
    };
    
    return res.status(200).json({
      success: true,
      course: courseData
    });
  } catch (error) {
    console.error('Error fetching course:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch course',
      error: error.message
    });
  }
};

// Join a course as a student
const joinCourse = async (req, res) => {
  try {
    const { courseCode } = req.body;
    const studentId = req.user.uid;
    const studentName = req.user.displayName;
    
    if (!courseCode) {
      return res.status(400).json({
        success: false,
        message: 'Course code is required'
      });
    }
    
    // Find course by code
    const coursesSnapshot = await db.collection('courses')
      .where('code', '==', courseCode)
      .limit(1)
      .get();
    
    if (coursesSnapshot.empty) {
      return res.status(404).json({
        success: false,
        message: 'Course not found with the provided code'
      });
    }
    
    const courseDoc = coursesSnapshot.docs[0];
    const courseId = courseDoc.id;
    const courseData = courseDoc.data();
    
    // Check if student is already enrolled
    if (courseData.students && courseData.students.includes(studentId)) {
      return res.status(400).json({
        success: false,
        message: 'You are already enrolled in this course'
      });
    }
    
    // Add student to course
    await db.collection('courses').doc(courseId).update({
      students: admin.firestore.FieldValue.arrayUnion(studentId)
    });
    
    // Add course to student's enrolled courses
    await db.collection('users').doc(studentId).update({
      enrolledCourses: admin.firestore.FieldValue.arrayUnion(courseId)
    });
    
    return res.status(200).json({
      success: true,
      message: 'Successfully joined the course',
      courseId,
      courseTitle: courseData.title
    });
  } catch (error) {
    console.error('Error joining course:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to join course',
      error: error.message
    });
  }
};

// Update course syllabus
const updateCourseSyllabus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { syllabus } = req.body;
    
    if (!Array.isArray(syllabus)) {
      return res.status(400).json({
        success: false,
        message: 'Syllabus must be an array'
      });
    }
    
    // Update syllabus
    await db.collection('courses').doc(courseId).update({
      syllabus,
      updatedAt: admin.firestore.Timestamp.now()
    });
    
    return res.status(200).json({
      success: true,
      message: 'Syllabus updated successfully'
    });
  } catch (error) {
    console.error('Error updating syllabus:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update syllabus',
      error: error.message
    });
  }
};

// Get course students
const getCourseStudents = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    // Get course data
    const courseSnapshot = await db.collection('courses').doc(courseId).get();
    
    if (!courseSnapshot.exists) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    const courseData = courseSnapshot.data();
    
    if (!courseData.students || courseData.students.length === 0) {
      return res.status(200).json({
        success: true,
        students: []
      });
    }
    
    // Get student details
    const studentsData = [];
    const studentPromises = courseData.students.map(studentId => 
      db.collection('users').doc(studentId).get()
    );
    
    const studentSnapshots = await Promise.all(studentPromises);
    
    studentSnapshots.forEach(doc => {
      if (doc.exists) {
        studentsData.push({
          id: doc.id,
          displayName: doc.data().displayName,
          email: doc.data().email
        });
      }
    });
    
    return res.status(200).json({
      success: true,
      students: studentsData
    });
  } catch (error) {
    console.error('Error fetching course students:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch students',
      error: error.message
    });
  }
};

module.exports = {
  createCourse,
  getTeacherCourses,
  getStudentCourses,
  getCourseById,
  joinCourse,
  updateCourseSyllabus,
  getCourseStudents
}; 