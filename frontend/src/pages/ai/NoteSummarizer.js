import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiLoader, FiFileText, FiCheck, FiX, FiSave } from 'react-icons/fi';
import apiService from '../../services/apiService';
import { useAuth } from '../../contexts/AuthContext';

const NoteSummarizer = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [notes, setNotes] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [saveToStorage, setSaveToStorage] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [userCourses, setUserCourses] = useState([]);
  const [step, setStep] = useState(1); // 1: Input, 2: Summary

  React.useEffect(() => {
    // Fetch user's courses for saving
    const fetchUserCourses = async () => {
      try {
        const response = await apiService.get('/courses/user');
        setUserCourses(response.data);
      } catch (err) {
        console.error('Error fetching courses:', err);
      }
    };

    fetchUserCourses();
  }, []);

  React.useEffect(() => {
    // Update word count whenever notes change
    const words = notes.trim() ? notes.trim().split(/\s+/).length : 0;
    setWordCount(words);
  }, [notes]);

  const handleSummarize = async () => {
    if (notes.trim().length < 50) {
      setError('Please enter at least 50 characters to summarize.');
      return;
    }

    setLoading(true);
    setError('');
    setSummary('');

    try {
      const response = await apiService.post('/ai/summarize-notes', { notes });
      setSummary(response.data.summary);
      setStep(2);
    } catch (err) {
      console.error('Error summarizing notes:', err);
      setError('Failed to summarize notes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNote = async () => {
    if (!noteTitle.trim()) {
      setError('Please enter a title for your note.');
      return;
    }

    if (!selectedCourse && saveToStorage) {
      setError('Please select a course to save the note to.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const noteData = {
        title: noteTitle,
        content: notes,
        summary: summary,
        course: saveToStorage ? selectedCourse : null
      };

      await apiService.post('/notes', noteData);
      setSuccess('Note saved successfully!');
      
      // Clear after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error saving note:', err);
      setError('Failed to save note. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSummary('');
    setStep(1);
  };

  const renderInputStep = () => (
    <div className="bg-white border-3 border-black p-6 shadow-neubrutalism">
      <h2 className="text-xl font-bold mb-4">Enter Your Notes</h2>
      <div className="mb-6">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Paste or type your study notes here..."
          className="input-neubrutalism w-full min-h-[300px] resize-none"
          disabled={loading}
        ></textarea>
        <div className="flex justify-between text-sm text-gray-500 mt-2">
          <span>{wordCount} words</span>
          <span>{notes.length} characters</span>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSummarize}
          disabled={loading || notes.trim().length < 50}
          className="btn-neubrutalism-primary"
        >
          {loading ? (
            <>
              <FiLoader className="animate-spin mr-2" />
              Summarizing...
            </>
          ) : (
            <>
              <FiFileText className="mr-2" />
              Summarize Notes
            </>
          )}
        </button>
      </div>
    </div>
  );

  const renderSummaryStep = () => (
    <div className="space-y-6">
      <div className="bg-white border-3 border-black p-6 shadow-neubrutalism">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Your Summary</h2>
          <button
            onClick={handleReset}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX className="text-xl" />
          </button>
        </div>
        <div className="p-4 bg-primary/5 border-3 border-black mb-4">
          <p className="whitespace-pre-wrap">{summary}</p>
        </div>
        <div className="text-sm text-gray-500">
          Original: {wordCount} words | Summary: {summary.split(/\s+/).length} words
        </div>
      </div>

      <div className="bg-white border-3 border-black p-6 shadow-neubrutalism">
        <h2 className="text-xl font-bold mb-4">Save Your Notes</h2>
        
        <div className="mb-4">
          <label htmlFor="noteTitle" className="block text-sm font-medium text-gray-700 mb-1">
            Note Title *
          </label>
          <input
            type="text"
            id="noteTitle"
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            className="input-neubrutalism w-full"
            placeholder="Enter a title for your note"
            required
          />
        </div>
        
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="saveToStorage"
              checked={saveToStorage}
              onChange={(e) => setSaveToStorage(e.target.checked)}
              className="mr-2 h-4 w-4"
            />
            <label htmlFor="saveToStorage" className="text-sm font-medium text-gray-700">
              Save to a course
            </label>
          </div>
          
          {saveToStorage && (
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="input-neubrutalism w-full"
              disabled={!saveToStorage}
            >
              <option value="">Select a course</option>
              {userCourses.map(course => (
                <option key={course._id} value={course._id}>
                  {course.name}
                </option>
              ))}
            </select>
          )}
        </div>
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 flex items-center">
            <FiX className="mr-2" />
            <span>{error}</span>
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 flex items-center">
            <FiCheck className="mr-2" />
            <span>{success}</span>
          </div>
        )}
        
        <div className="flex justify-end">
          <button
            onClick={handleSaveNote}
            disabled={loading}
            className="btn-neubrutalism-primary"
          >
            {loading ? (
              <>
                <FiLoader className="animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <FiSave className="mr-2" />
                Save Note
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <button 
        onClick={() => navigate('/dashboard')}
        className="flex items-center text-primary font-medium mb-8 hover:underline"
      >
        <FiChevronLeft className="mr-1" /> Back to Dashboard
      </button>
      
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">AI Note Summarizer</h1>
          <p className="text-gray-600">
            Transform your lengthy study notes into concise, easy-to-review summaries
          </p>
        </div>
        
        {error && step === 1 && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 flex items-center">
            <FiX className="mr-2" />
            <span>{error}</span>
          </div>
        )}
        
        {step === 1 ? renderInputStep() : renderSummaryStep()}
        
        <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="font-medium mb-2">Tips for better summaries:</h3>
          <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
            <li>Enter complete sentences and paragraphs for more accurate summarization</li>
            <li>Make sure your notes are well-structured with clear sections</li>
            <li>The more context you provide, the better the summary will be</li>
            <li>You can edit the summary after it's generated if needed</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NoteSummarizer; 