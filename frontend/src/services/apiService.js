import axios from 'axios';
import { getAuth } from 'firebase/auth';
import { firebaseApp } from '../firebase';

// Get the current API URL (different for development and production)
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Create axios instance
const apiService = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiService.interceptors.request.use(
  async (config) => {
    try {
      const auth = getAuth(firebaseApp);
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

export default apiService; 