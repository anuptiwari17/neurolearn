const { admin, db } = require('../config/firebase');

// Create a new discussion thread
const createDiscussion = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, content } = req.body;
    const userId = req.user.uid;
    const userName = req.user.displayName;
    
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required fields'
      });
    }
    
    // Create discussion object
    const discussionData = {
      title,
      content,
      createdBy: userId,
      creatorName: userName,
      createdAt: admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now(),
      replies: []
    };
    
    // Add discussion to Firestore
    const discussionRef = db.collection('courses').doc(courseId)
                           .collection('discussions').doc();
    await discussionRef.set(discussionData);
    
    return res.status(201).json({
      success: true,
      message: 'Discussion created successfully',
      discussionId: discussionRef.id,
      discussion: {
        id: discussionRef.id,
        ...discussionData
      }
    });
  } catch (error) {
    console.error('Error creating discussion:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create discussion',
      error: error.message
    });
  }
};

// Get all discussions for a course
const getCourseDiscussions = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    // Get discussions for the course
    const discussionsSnapshot = await db.collection('courses').doc(courseId)
                                       .collection('discussions')
                                       .orderBy('updatedAt', 'desc')
                                       .get();
    
    if (discussionsSnapshot.empty) {
      return res.status(200).json({
        success: true,
        discussions: []
      });
    }
    
    // Format discussions data
    const discussions = [];
    discussionsSnapshot.forEach(doc => {
      discussions.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return res.status(200).json({
      success: true,
      discussions
    });
  } catch (error) {
    console.error('Error fetching discussions:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch discussions',
      error: error.message
    });
  }
};

// Get a single discussion by ID
const getDiscussionById = async (req, res) => {
  try {
    const { courseId, discussionId } = req.params;
    
    // Get discussion data
    const discussionSnapshot = await db.collection('courses').doc(courseId)
                                      .collection('discussions').doc(discussionId)
                                      .get();
    
    if (!discussionSnapshot.exists) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found'
      });
    }
    
    const discussionData = {
      id: discussionSnapshot.id,
      ...discussionSnapshot.data()
    };
    
    return res.status(200).json({
      success: true,
      discussion: discussionData
    });
  } catch (error) {
    console.error('Error fetching discussion:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch discussion',
      error: error.message
    });
  }
};

// Add a reply to a discussion
const addReply = async (req, res) => {
  try {
    const { courseId, discussionId } = req.params;
    const { content } = req.body;
    const userId = req.user.uid;
    const userName = req.user.displayName;
    
    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Reply content is required'
      });
    }
    
    // Create reply object
    const replyData = {
      content,
      createdBy: userId,
      creatorName: userName,
      createdAt: admin.firestore.Timestamp.now()
    };
    
    // Add reply to discussion
    const discussionRef = db.collection('courses').doc(courseId)
                           .collection('discussions').doc(discussionId);
    
    await discussionRef.update({
      replies: admin.firestore.FieldValue.arrayUnion(replyData),
      updatedAt: admin.firestore.Timestamp.now()
    });
    
    return res.status(201).json({
      success: true,
      message: 'Reply added successfully',
      reply: replyData
    });
  } catch (error) {
    console.error('Error adding reply:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to add reply',
      error: error.message
    });
  }
};

// Delete a discussion (only by creator or teacher)
const deleteDiscussion = async (req, res) => {
  try {
    const { courseId, discussionId } = req.params;
    const userId = req.user.uid;
    const userRole = req.user.role;
    
    // Get discussion data
    const discussionRef = db.collection('courses').doc(courseId)
                           .collection('discussions').doc(discussionId);
    const discussionDoc = await discussionRef.get();
    
    if (!discussionDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found'
      });
    }
    
    const discussionData = discussionDoc.data();
    
    // Check if user is creator or teacher
    if (discussionData.createdBy !== userId && userRole !== 'teacher') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this discussion'
      });
    }
    
    // Delete discussion
    await discussionRef.delete();
    
    return res.status(200).json({
      success: true,
      message: 'Discussion deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting discussion:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete discussion',
      error: error.message
    });
  }
};

module.exports = {
  createDiscussion,
  getCourseDiscussions,
  getDiscussionById,
  addReply,
  deleteDiscussion
}; 