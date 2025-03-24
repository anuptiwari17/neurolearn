import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FiAlertCircle, FiChevronLeft } from 'react-icons/fi';
import apiService from '../../services/apiService';

const CreateCourse = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    subject: '',
    gradeLevel: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if not a teacher
  React.useEffect(() => {
    if (currentUser && currentUser.role !== 'teacher') {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.description || !formData.subject || !formData.gradeLevel) {
      setError('Please fill in all fields.');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const response = await apiService.post('/courses', formData);
      navigate(`/courses/${response.data._id}`);
      
    } catch (err) {
      console.error('Error creating course:', err);
      setError('Failed to create course. Please try again.');
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
        <h1 className="text-3xl font-bold mb-2">Create a New Course</h1>
        <p className="text-gray-600 mb-8">Fill in the details below to create your course.</p>
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 flex items-center">
            <FiAlertCircle className="mr-2" />
            <span>{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="border-3 border-black p-8 bg-white shadow-neubrutalism">
          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Course Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input-neubrutalism"
              placeholder="e.g. Introduction to Biology"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
              Subject *
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="input-neubrutalism"
              placeholder="e.g. Biology, Mathematics, History"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="gradeLevel" className="block text-sm font-medium text-gray-700 mb-2">
              Grade Level *
            </label>
            <select
              id="gradeLevel"
              name="gradeLevel"
              value={formData.gradeLevel}
              onChange={handleChange}
              className="input-neubrutalism"
              required
            >
              <option value="">Select Grade Level</option>
              <option value="Elementary">Elementary School</option>
              <option value="Middle">Middle School</option>
              <option value="High">High School</option>
              <option value="Undergraduate">Undergraduate</option>
              <option value="Graduate">Graduate</option>
              <option value="Professional">Professional</option>
            </select>
          </div>
          
          <div className="mb-8">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Course Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="input-neubrutalism"
              placeholder="Provide a brief description of your course..."
              required
            ></textarea>
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn-neubrutalism-secondary mr-4"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-neubrutalism-primary"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCourse; 