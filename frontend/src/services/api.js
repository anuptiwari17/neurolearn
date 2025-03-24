import axios from 'axios';
import { auth } from '../config/firebase';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  async (config) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API endpoints
const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
};

const courseAPI = {
  createCourse: (courseData) => api.post('/courses', courseData),
  getTeacherCourses: () => api.get('/courses/teacher'),
  getStudentCourses: () => api.get('/courses/student'),
  getCourseById: (courseId) => api.get(`/courses/${courseId}`),
  joinCourse: (courseCode) => api.post('/courses/join', { courseCode }),
  updateSyllabus: (courseId, syllabus) => api.put(`/courses/${courseId}/syllabus`, { syllabus }),
  getStudents: (courseId) => api.get(`/courses/${courseId}/students`),
};

const announcementAPI = {
  createAnnouncement: (courseId, content) => api.post(`/announcements/${courseId}`, { content }),
  getCourseAnnouncements: (courseId) => api.get(`/announcements/${courseId}`),
  deleteAnnouncement: (courseId, announcementId) => api.delete(`/announcements/${courseId}/${announcementId}`),
};

const assignmentAPI = {
  createAssignment: (courseId, assignmentData) => api.post(`/assignments/${courseId}`, assignmentData),
  getCourseAssignments: (courseId) => api.get(`/assignments/${courseId}`),
  getAssignmentById: (courseId, assignmentId) => api.get(`/assignments/${courseId}/${assignmentId}`),
  submitAssignment: (courseId, assignmentId, formData) => {
    return api.post(`/assignments/${courseId}/${assignmentId}/submit`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getAssignmentSubmissions: (courseId, assignmentId) => api.get(`/assignments/${courseId}/${assignmentId}/submissions`),
  gradeSubmission: (courseId, assignmentId, submissionId, gradeData) => 
    api.put(`/assignments/${courseId}/${assignmentId}/submissions/${submissionId}/grade`, gradeData),
  getMySubmission: (courseId, assignmentId) => api.get(`/assignments/${courseId}/${assignmentId}/my-submission`),
};

const noteAPI = {
  uploadNote: (courseId, formData) => {
    return api.post(`/notes/${courseId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getCourseNotes: (courseId) => api.get(`/notes/${courseId}`),
  getNoteById: (courseId, noteId) => api.get(`/notes/${courseId}/${noteId}`),
  deleteNote: (courseId, noteId) => api.delete(`/notes/${courseId}/${noteId}`),
};

const discussionAPI = {
  createDiscussion: (courseId, discussionData) => api.post(`/discussions/${courseId}`, discussionData),
  getCourseDiscussions: (courseId) => api.get(`/discussions/${courseId}`),
  getDiscussionById: (courseId, discussionId) => api.get(`/discussions/${courseId}/${discussionId}`),
  addReply: (courseId, discussionId, content) => api.post(`/discussions/${courseId}/${discussionId}/replies`, { content }),
  deleteDiscussion: (courseId, discussionId) => api.delete(`/discussions/${courseId}/${discussionId}`),
};

const messageAPI = {
  sendMessage: (messageData) => api.post('/messages', messageData),
  getConversation: (otherUserId, courseId) => api.get(`/messages/conversation/${otherUserId}/${courseId}`),
  getUserConversations: () => api.get('/messages/conversations'),
  markMessagesAsRead: (otherUserId) => api.put(`/messages/read/${otherUserId}`),
  getCourseParticipants: (courseId) => api.get(`/messages/participants/${courseId}`),
};

const aiAPI = {
  solveDoubt: (question) => api.post('/ai/solve-doubt', { question }),
  summarizeNotes: (text) => api.post('/ai/summarize', { text }),
  generateQuiz: (topic, numQuestions) => api.post('/ai/generate-quiz', { topic, numQuestions }),
};

export {
  api,
  authAPI,
  courseAPI,
  announcementAPI,
  assignmentAPI,
  noteAPI,
  discussionAPI,
  messageAPI,
  aiAPI,
}; 