import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/apiService';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { firebaseApp } from '../firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const auth = getAuth(firebaseApp);

  // Sign up with email and password
  const signup = async (email, password, displayName, role) => {
    try {
      // Create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update the user's display name
      await updateProfile(userCredential.user, { displayName });
      
      // Create user in our backend
      await apiService.post('/auth/register', {
        uid: userCredential.user.uid,
        email,
        displayName,
        role
      });

      return userCredential.user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Login with email and password
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Logout the user
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      await auth.sendPasswordResetEmail(email);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Update user profile
  const updateUserProfile = async (updates) => {
    try {
      if (updates.displayName) {
        await updateProfile(auth.currentUser, { displayName: updates.displayName });
      }
      
      // Update user in our backend
      await apiService.put('/users/profile', updates);
      
      // Refresh the current user
      setCurrentUser(prevUser => ({
        ...prevUser,
        ...updates
      }));
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Effect for handling auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Get user data from our backend
          const response = await apiService.get(`/users/profile/${user.uid}`);
          
          // Combine Firebase user with our backend data
          setCurrentUser({
            ...user,
            ...response.data,
            uid: user.uid
          });
        } catch (err) {
          console.error('Error fetching user profile:', err);
          setCurrentUser(user);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [auth]);

  // Clear error on component unmount
  useEffect(() => {
    return () => {
      setError('');
    };
  }, []);

  const value = {
    currentUser,
    loading,
    error,
    signup,
    login,
    logout,
    resetPassword,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
} 