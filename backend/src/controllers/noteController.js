const { admin, db } = require('../config/firebase');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

// Upload a new note to a course
const uploadNote = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description } = req.body;
    const teacherId = req.user.uid;
    
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }
    
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }
    
    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: `classroom-app/notes/${courseId}`,
      resource_type: 'auto'
    });
    
    // Remove the temporary file
    fs.unlinkSync(req.file.path);
    
    // Create note object
    const noteData = {
      title,
      description: description || '',
      fileUrl: result.secure_url,
      fileName: req.file.originalname,
      uploadedBy: teacherId,
      createdAt: admin.firestore.Timestamp.now()
    };
    
    // Add note to Firestore
    const noteRef = db.collection('courses').doc(courseId)
                      .collection('notes').doc();
    await noteRef.set(noteData);
    
    return res.status(201).json({
      success: true,
      message: 'Note uploaded successfully',
      noteId: noteRef.id,
      note: {
        id: noteRef.id,
        ...noteData
      }
    });
  } catch (error) {
    console.error('Error uploading note:', error);
    
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
      message: 'Failed to upload note',
      error: error.message
    });
  }
};

// Get all notes for a course
const getCourseNotes = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    // Get notes for the course
    const notesSnapshot = await db.collection('courses').doc(courseId)
                                 .collection('notes')
                                 .orderBy('createdAt', 'desc')
                                 .get();
    
    if (notesSnapshot.empty) {
      return res.status(200).json({
        success: true,
        notes: []
      });
    }
    
    // Format notes data
    const notes = [];
    notesSnapshot.forEach(doc => {
      notes.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return res.status(200).json({
      success: true,
      notes
    });
  } catch (error) {
    console.error('Error fetching notes:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch notes',
      error: error.message
    });
  }
};

// Get a single note by ID
const getNoteById = async (req, res) => {
  try {
    const { courseId, noteId } = req.params;
    
    // Get note data
    const noteSnapshot = await db.collection('courses').doc(courseId)
                                .collection('notes').doc(noteId)
                                .get();
    
    if (!noteSnapshot.exists) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }
    
    const noteData = {
      id: noteSnapshot.id,
      ...noteSnapshot.data()
    };
    
    return res.status(200).json({
      success: true,
      note: noteData
    });
  } catch (error) {
    console.error('Error fetching note:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch note',
      error: error.message
    });
  }
};

// Delete a note
const deleteNote = async (req, res) => {
  try {
    const { courseId, noteId } = req.params;
    
    // Get note data first to get the file URL
    const noteSnapshot = await db.collection('courses').doc(courseId)
                                .collection('notes').doc(noteId)
                                .get();
    
    if (!noteSnapshot.exists) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }
    
    // Delete the note from Firestore
    await db.collection('courses').doc(courseId)
           .collection('notes').doc(noteId)
           .delete();
    
    // Try to delete file from Cloudinary if needed
    // Note: This is optional and might require parsing the URL to get the public_id
    // const fileUrl = noteSnapshot.data().fileUrl;
    // Extract public_id and try to delete
    
    return res.status(200).json({
      success: true,
      message: 'Note deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting note:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete note',
      error: error.message
    });
  }
};

module.exports = {
  uploadNote,
  getCourseNotes,
  getNoteById,
  deleteNote
}; 