const { admin, db } = require('../config/firebase');

// Send a new message
const sendMessage = async (req, res) => {
  try {
    const { recipientId, content, courseId } = req.body;
    const senderId = req.user.uid;
    const senderName = req.user.displayName;
    
    if (!recipientId || !content || !courseId) {
      return res.status(400).json({
        success: false,
        message: 'Recipient ID, content, and course ID are required fields'
      });
    }
    
    // Validate that recipient exists
    const recipientDoc = await db.collection('users').doc(recipientId).get();
    
    if (!recipientDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Recipient not found'
      });
    }
    
    // Create message object
    const messageData = {
      senderId,
      senderName,
      recipientId,
      recipientName: recipientDoc.data().displayName,
      content,
      timestamp: admin.firestore.Timestamp.now(),
      read: false,
      courseId
    };
    
    // Add message to Firestore
    const messageRef = db.collection('messages').doc();
    await messageRef.set(messageData);
    
    return res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      messageId: messageRef.id,
      messageData: {
        id: messageRef.id,
        ...messageData
      }
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send message',
      error: error.message
    });
  }
};

// Get all messages between current user and another user
const getConversation = async (req, res) => {
  try {
    const { otherUserId, courseId } = req.params;
    const userId = req.user.uid;
    
    // Get messages where current user is sender or recipient
    const messagesSnapshot = await db.collection('messages')
      .where('courseId', '==', courseId)
      .where(admin.firestore.FieldPath.documentId(), 'in', [
        // Messages sent by current user to other user
        db.collection('messages')
          .where('senderId', '==', userId)
          .where('recipientId', '==', otherUserId)
          .get(),
        // Messages sent by other user to current user
        db.collection('messages')
          .where('senderId', '==', otherUserId)
          .where('recipientId', '==', userId)
          .get()
      ])
      .orderBy('timestamp', 'asc')
      .get();
    
    // Format messages data
    const messages = [];
    messagesSnapshot.forEach(doc => {
      messages.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return res.status(200).json({
      success: true,
      messages
    });
  } catch (error) {
    console.error('Error fetching conversation:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch conversation',
      error: error.message
    });
  }
};

// Get all conversations for current user (grouped by other user)
const getUserConversations = async (req, res) => {
  try {
    const userId = req.user.uid;
    
    // Get messages where current user is sender or recipient
    const sentMessagesSnapshot = await db.collection('messages')
      .where('senderId', '==', userId)
      .orderBy('timestamp', 'desc')
      .get();
    
    const receivedMessagesSnapshot = await db.collection('messages')
      .where('recipientId', '==', userId)
      .orderBy('timestamp', 'desc')
      .get();
    
    // Combine and format messages
    const conversationsMap = new Map();
    
    // Process sent messages
    sentMessagesSnapshot.forEach(doc => {
      const message = {
        id: doc.id,
        ...doc.data()
      };
      
      const otherUserId = message.recipientId;
      
      if (!conversationsMap.has(otherUserId)) {
        conversationsMap.set(otherUserId, {
          userId: otherUserId,
          userName: message.recipientName,
          lastMessage: message,
          unreadCount: 0,
          courseId: message.courseId
        });
      } else if (message.timestamp.toMillis() > conversationsMap.get(otherUserId).lastMessage.timestamp.toMillis()) {
        conversationsMap.get(otherUserId).lastMessage = message;
      }
    });
    
    // Process received messages
    receivedMessagesSnapshot.forEach(doc => {
      const message = {
        id: doc.id,
        ...doc.data()
      };
      
      const otherUserId = message.senderId;
      
      if (!conversationsMap.has(otherUserId)) {
        conversationsMap.set(otherUserId, {
          userId: otherUserId,
          userName: message.senderName,
          lastMessage: message,
          unreadCount: message.read ? 0 : 1,
          courseId: message.courseId
        });
      } else {
        const conversation = conversationsMap.get(otherUserId);
        
        if (message.timestamp.toMillis() > conversation.lastMessage.timestamp.toMillis()) {
          conversation.lastMessage = message;
        }
        
        if (!message.read) {
          conversation.unreadCount += 1;
        }
      }
    });
    
    // Convert Map to Array
    const conversations = Array.from(conversationsMap.values());
    
    // Sort by last message timestamp
    conversations.sort((a, b) => 
      b.lastMessage.timestamp.toMillis() - a.lastMessage.timestamp.toMillis()
    );
    
    return res.status(200).json({
      success: true,
      conversations
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch conversations',
      error: error.message
    });
  }
};

// Mark messages as read
const markMessagesAsRead = async (req, res) => {
  try {
    const { otherUserId } = req.params;
    const userId = req.user.uid;
    
    // Get unread messages from other user
    const unreadMessagesSnapshot = await db.collection('messages')
      .where('senderId', '==', otherUserId)
      .where('recipientId', '==', userId)
      .where('read', '==', false)
      .get();
    
    if (unreadMessagesSnapshot.empty) {
      return res.status(200).json({
        success: true,
        message: 'No unread messages to mark as read'
      });
    }
    
    // Update messages in batch
    const batch = db.batch();
    
    unreadMessagesSnapshot.forEach(doc => {
      batch.update(doc.ref, { read: true });
    });
    
    await batch.commit();
    
    return res.status(200).json({
      success: true,
      message: `Marked ${unreadMessagesSnapshot.size} messages as read`
    });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to mark messages as read',
      error: error.message
    });
  }
};

// Get all course participants for messaging
const getCourseParticipants = async (req, res) => {
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
    const participantIds = [...courseData.students];
    
    // Add teacher
    if (!participantIds.includes(courseData.teacherId)) {
      participantIds.push(courseData.teacherId);
    }
    
    // Get user details
    const participants = [];
    const userPromises = participantIds.map(userId => 
      db.collection('users').doc(userId).get()
    );
    
    const userSnapshots = await Promise.all(userPromises);
    
    userSnapshots.forEach(doc => {
      if (doc.exists) {
        const userData = doc.data();
        participants.push({
          id: doc.id,
          displayName: userData.displayName,
          role: userData.role
        });
      }
    });
    
    return res.status(200).json({
      success: true,
      participants
    });
  } catch (error) {
    console.error('Error fetching course participants:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch participants',
      error: error.message
    });
  }
};

module.exports = {
  sendMessage,
  getConversation,
  getUserConversations,
  markMessagesAsRead,
  getCourseParticipants
}; 