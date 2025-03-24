const { admin, db } = require('../config/firebase');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

// Create a new assignment
const createAssignment = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, dueDate, points } = req.body;
    
    if (!title || !dueDate) {
      return res.status(400).json({
        success: false,
        message: 'Title and due date are required fields'
      });
    }
    
    // Create assignment object
    const assignmentData = {
      title,
      description: description || '',
      dueDate: admin.firestore.Timestamp.fromDate(new Date(dueDate)),
      points: points || 100,
      createdAt: admin.firestore.Timestamp.now()
    };
    
    // Add assignment to Firestore
    const assignmentRef = db.collection('courses').doc(courseId)
                           .collection('assignments').doc();
    await assignmentRef.set(assignmentData);
    
    return res.status(201).json({
      success: true,
      message: 'Assignment created successfully',
      assignmentId: assignmentRef.id,
      assignment: {
        ...assignmentData,
        id: assignmentRef.id
      }
    });
  } catch (error) {
    console.error('Error creating assignment:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create assignment',
      error: error.message
    });
  }
};

// Get all assignments for a course
const getCourseAssignments = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    // Get assignments for the course
    const assignmentsSnapshot = await db.collection('courses').doc(courseId)
                                        .collection('assignments')
                                        .orderBy('dueDate', 'asc')
                                        .get();
    
    if (assignmentsSnapshot.empty) {
      return res.status(200).json({
        success: true,
        assignments: []
      });
    }
    
    // Format assignments data
    const assignments = [];
    assignmentsSnapshot.forEach(doc => {
      assignments.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return res.status(200).json({
      success: true,
      assignments
    });
  } catch (error) {
    console.error('Error fetching assignments:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch assignments',
      error: error.message
    });
  }
};

// Get a single assignment by ID
const getAssignmentById = async (req, res) => {
  try {
    const { courseId, assignmentId } = req.params;
    
    // Get assignment data
    const assignmentSnapshot = await db.collection('courses').doc(courseId)
                                       .collection('assignments').doc(assignmentId)
                                       .get();
    
    if (!assignmentSnapshot.exists) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }
    
    const assignmentData = {
      id: assignmentSnapshot.id,
      ...assignmentSnapshot.data()
    };
    
    return res.status(200).json({
      success: true,
      assignment: assignmentData
    });
  } catch (error) {
    console.error('Error fetching assignment:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch assignment',
      error: error.message
    });
  }
};

// Submit an assignment (student)
const submitAssignment = async (req, res) => {
  try {
    const { courseId, assignmentId } = req.params;
    const studentId = req.user.uid;
    const studentName = req.user.displayName;
    
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }
    
    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: `classroom-app/assignments/${courseId}/${assignmentId}`,
      resource_type: 'auto'
    });
    
    // Remove the temporary file
    fs.unlinkSync(req.file.path);
    
    // Create submission object
    const submissionData = {
      studentId,
      studentName,
      submissionDate: admin.firestore.Timestamp.now(),
      fileUrl: result.secure_url,
      fileName: req.file.originalname,
      grade: null,
      feedback: null
    };
    
    // Check if student has already submitted
    const submissionsRef = db.collection('courses').doc(courseId)
                            .collection('assignments').doc(assignmentId)
                            .collection('submissions');
    
    const existingSubmission = await submissionsRef
                                    .where('studentId', '==', studentId)
                                    .limit(1)
                                    .get();
    
    if (!existingSubmission.empty) {
      // Update existing submission
      const submissionDoc = existingSubmission.docs[0];
      await submissionsRef.doc(submissionDoc.id).update(submissionData);
      
      return res.status(200).json({
        success: true,
        message: 'Assignment resubmitted successfully',
        submission: {
          id: submissionDoc.id,
          ...submissionData
        }
      });
    }
    
    // Create new submission
    const submissionRef = await submissionsRef.add(submissionData);
    
    return res.status(201).json({
      success: true,
      message: 'Assignment submitted successfully',
      submission: {
        id: submissionRef.id,
        ...submissionData
      }
    });
  } catch (error) {
    console.error('Error submitting assignment:', error);
    
    // If file exists but upload failed, clean up
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error cleaning up temporary file:', unlinkError);
      }
    }
    
    return res.status(500).json({
      success: false,
      message: 'Failed to submit assignment',
      error: error.message
    });
  }
};

// Get all submissions for an assignment (teacher)
const getAssignmentSubmissions = async (req, res) => {
  try {
    const { courseId, assignmentId } = req.params;
    
    // Get submissions for the assignment
    const submissionsSnapshot = await db.collection('courses').doc(courseId)
                                        .collection('assignments').doc(assignmentId)
                                        .collection('submissions')
                                        .orderBy('submissionDate', 'desc')
                                        .get();
    
    if (submissionsSnapshot.empty) {
      return res.status(200).json({
        success: true,
        submissions: []
      });
    }
    
    // Format submissions data
    const submissions = [];
    submissionsSnapshot.forEach(doc => {
      submissions.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return res.status(200).json({
      success: true,
      submissions
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch submissions',
      error: error.message
    });
  }
};

// Grade a submission (teacher)
const gradeSubmission = async (req, res) => {
  try {
    const { courseId, assignmentId, submissionId } = req.params;
    const { grade, feedback } = req.body;
    
    if (grade === undefined || grade === null) {
      return res.status(400).json({
        success: false,
        message: 'Grade is required'
      });
    }
    
    // Update submission with grade and feedback
    await db.collection('courses').doc(courseId)
           .collection('assignments').doc(assignmentId)
           .collection('submissions').doc(submissionId)
           .update({
             grade,
             feedback: feedback || '',
             gradedAt: admin.firestore.Timestamp.now()
           });
    
    return res.status(200).json({
      success: true,
      message: 'Submission graded successfully'
    });
  } catch (error) {
    console.error('Error grading submission:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to grade submission',
      error: error.message
    });
  }
};

// Get student's submission for an assignment
const getStudentSubmission = async (req, res) => {
  try {
    const { courseId, assignmentId } = req.params;
    const studentId = req.user.uid;
    
    // Get student's submission
    const submissionsSnapshot = await db.collection('courses').doc(courseId)
                                        .collection('assignments').doc(assignmentId)
                                        .collection('submissions')
                                        .where('studentId', '==', studentId)
                                        .limit(1)
                                        .get();
    
    if (submissionsSnapshot.empty) {
      return res.status(404).json({
        success: false,
        message: 'No submission found'
      });
    }
    
    const submissionDoc = submissionsSnapshot.docs[0];
    const submissionData = {
      id: submissionDoc.id,
      ...submissionDoc.data()
    };
    
    return res.status(200).json({
      success: true,
      submission: submissionData
    });
  } catch (error) {
    console.error('Error fetching student submission:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch submission',
      error: error.message
    });
  }
};

module.exports = {
  createAssignment,
  getCourseAssignments,
  getAssignmentById,
  submitAssignment,
  getAssignmentSubmissions,
  gradeSubmission,
  getStudentSubmission
}; 