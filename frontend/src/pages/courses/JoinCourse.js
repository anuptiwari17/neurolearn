import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FiAlertCircle, FiChevronLeft, FiCheck } from 'react-icons/fi';
import apiService from '../../services/apiService';

const JoinCourse = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [courseCode, setCourseCode] = useState('');
  const [courseDetails, setCourseDetails] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [joined, setJoined] = useState(false);

  // Redirect if not a student
  useEffect(() => {
    if (currentUser && currentUser.role !== 'student') {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const handleCodeChange = (e) => {
    setCourseCode(e.target.value);
    setCourseDetails(null);
    setError('');
  };

  const handleCheckCode = async () => {
    if (!courseCode.trim()) {
      setError('Please enter a course code.');
      return;
    }
    
    try {
      setChecking(true);
      setError('');
      
      const response = await apiService.get(`/courses/check-code/${courseCode}`);
      setCourseDetails(response.data);
      
    } catch (err) {
      console.error('Error checking course code:', err);
      setError('Invalid course code. Please check and try again.');
      setCourseDetails(null);
    } finally {
      setChecking(false);
    }
  };

  const handleJoinCourse = async () => {
    try {
      setLoading(true);
      setError('');
      
      await apiService.post(`/courses/join/${courseCode}`);
      setJoined(true);
      
      // Wait for animation, then redirect
      setTimeout(() => {
        navigate(`/courses/${courseDetails._id}`);
      }, 1500);
      
    } catch (err) {
      console.error('Error joining course:', err);
      setError('Failed to join course. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button 
        onClick={() => navigate('/dashboard')}
        className="flex items-center text-primary font-medium mb-8 hover:underline"
      >
        <FiChevronLeft className="mr-1" /> Back to Dashboard
      </button>
      
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Join a Course</h1>
        <p className="text-gray-600 mb-8">Enter the course code provided by your teacher to join a course.</p>
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 flex items-center">
            <FiAlertCircle className="mr-2" />
            <span>{error}</span>
          </div>
        )}
        
        {joined ? (
          <div className="border-3 border-black p-8 bg-white shadow-neubrutalism text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-500">
                <FiCheck className="w-8 h-8" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2">Successfully Joined!</h2>
            <p className="text-gray-600 mb-4">You have successfully joined {courseDetails.name}.</p>
            <p className="text-sm text-gray-500">Redirecting you to the course page...</p>
          </div>
        ) : (
          <div className="border-3 border-black p-8 bg-white shadow-neubrutalism">
            <div className="mb-6">
              <label htmlFor="courseCode" className="block text-sm font-medium text-gray-700 mb-2">
                Course Code *
              </label>
              <div className="flex">
                <input
                  type="text"
                  id="courseCode"
                  value={courseCode}
                  onChange={handleCodeChange}
                  className="input-neubrutalism flex-1"
                  placeholder="Enter 6-digit course code"
                  maxLength="6"
                />
                <button
                  type="button"
                  onClick={handleCheckCode}
                  className="btn-neubrutalism-primary ml-2"
                  disabled={checking || !courseCode.trim()}
                >
                  {checking ? 'Checking...' : 'Check'}
                </button>
              </div>
            </div>
            
            {courseDetails && (
              <div className="mb-8 p-4 border-3 border-black bg-primary/5">
                <h3 className="font-bold text-xl mb-2">{courseDetails.name}</h3>
                <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                  <div>
                    <span className="font-medium">Subject:</span> {courseDetails.subject}
                  </div>
                  <div>
                    <span className="font-medium">Grade Level:</span> {courseDetails.gradeLevel}
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium">Teacher:</span> {courseDetails.teacher.displayName}
                  </div>
                </div>
                <p className="text-gray-700 text-sm mb-4">{courseDetails.description}</p>
                
                <div className="text-right">
                  <button
                    type="button"
                    onClick={handleJoinCourse}
                    className="btn-neubrutalism-primary"
                    disabled={loading}
                  >
                    {loading ? 'Joining...' : 'Join This Course'}
                  </button>
                </div>
              </div>
            )}
            
            <div className="border-t pt-4 mt-4">
              <h3 className="font-medium mb-2">How to find a course code?</h3>
              <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
                <li>Ask your teacher for the 6-digit course code</li>
                <li>Enter the code in the field above</li>
                <li>Click "Check" to verify the course</li>
                <li>Review the course details and click "Join This Course"</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JoinCourse; 