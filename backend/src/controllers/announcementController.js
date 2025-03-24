const { admin, db } = require('../config/firebase');

// Create a new announcement for a course
const createAnnouncement = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { content } = req.body;
    const userId = req.user.uid;
    
    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Announcement content is required'
      });
    }
    
    // Create announcement object
    const announcementData = {
      content,
      createdAt: admin.firestore.Timestamp.now(),
      createdBy: userId
    };
    
    // Add announcement to Firestore
    const announcementRef = db.collection('courses').doc(courseId)
                             .collection('announcements').doc();
    await announcementRef.set(announcementData);
    
    return res.status(201).json({
      success: true,
      message: 'Announcement created successfully',
      announcementId: announcementRef.id,
      announcement: announcementData
    });
  } catch (error) {
    console.error('Error creating announcement:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create announcement',
      error: error.message
    });
  }
};

// Get all announcements for a course
const getCourseAnnouncements = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    // Get announcements for the course
    const announcementsSnapshot = await db.collection('courses').doc(courseId)
                                         .collection('announcements')
                                         .orderBy('createdAt', 'desc')
                                         .get();
    
    if (announcementsSnapshot.empty) {
      return res.status(200).json({
        success: true,
        announcements: []
      });
    }
    
    // Format announcements data
    const announcements = [];
    announcementsSnapshot.forEach(doc => {
      announcements.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    // Get creator details for each announcement
    const userIds = [...new Set(announcements.map(a => a.createdBy))];
    const userPromises = userIds.map(userId => 
      db.collection('users').doc(userId).get()
    );
    
    const userSnapshots = await Promise.all(userPromises);
    const userMap = {};
    
    userSnapshots.forEach(doc => {
      if (doc.exists) {
        userMap[doc.id] = {
          displayName: doc.data().displayName
        };
      }
    });
    
    // Attach creator names to announcements
    const announcementsWithCreators = announcements.map(announcement => ({
      ...announcement,
      creatorName: userMap[announcement.createdBy]?.displayName || 'Unknown User'
    }));
    
    return res.status(200).json({
      success: true,
      announcements: announcementsWithCreators
    });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch announcements',
      error: error.message
    });
  }
};

// Delete an announcement
const deleteAnnouncement = async (req, res) => {
  try {
    const { courseId, announcementId } = req.params;
    
    // Delete announcement from Firestore
    await db.collection('courses').doc(courseId)
           .collection('announcements').doc(announcementId)
           .delete();
    
    return res.status(200).json({
      success: true,
      message: 'Announcement deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete announcement',
      error: error.message
    });
  }
};

module.exports = {
  createAnnouncement,
  getCourseAnnouncements,
  deleteAnnouncement
}; 