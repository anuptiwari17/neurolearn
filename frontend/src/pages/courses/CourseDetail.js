import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FiChevronLeft, FiUsers, FiAlertCircle, FiClipboard, 
  FiMessageSquare, FiFileText, FiInfo, FiLink, FiCopy 
} from 'react-icons/fi';
import apiService from '../../services/apiService';

const CourseDetail = () => {
  const { courseId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [announcements, setAnnouncements] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [notes, setNotes] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState('');

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Fetch course details
        const courseResponse = await apiService.get(`/courses/${courseId}`);
        setCourse(courseResponse.data);
        
        // Fetch course content based on active tab
        await fetchTabContent(activeTab);
        
      } catch (err) {
        console.error('Error fetching course data:', err);
        setError('Failed to load course data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

  const fetchTabContent = async (tab) => {
    try {
      switch (tab) {
        case 'announcements':
          const announcementsResponse = await apiService.get(`/courses/${courseId}/announcements`);
          setAnnouncements(announcementsResponse.data);
          break;
        case 'assignments':
          const assignmentsResponse = await apiService.get(`/courses/${courseId}/assignments`);
          setAssignments(assignmentsResponse.data);
          break;
        case 'notes':
          const notesResponse = await apiService.get(`/courses/${courseId}/notes`);
          setNotes(notesResponse.data);
          break;
        case 'discussions':
          const discussionsResponse = await apiService.get(`/courses/${courseId}/discussions`);
          setDiscussions(discussionsResponse.data);
          break;
        default:
          break;
      }
    } catch (err) {
      console.error(`Error fetching ${tab}:`, err);
    }
  };

  const handleTabChange = async (tab) => {
    setActiveTab(tab);
    await fetchTabContent(tab);
  };

  const copyJoinCode = () => {
    if (course && course.joinCode) {
      navigator.clipboard.writeText(course.joinCode);
      setCopySuccess('Copied!');
      setTimeout(() => setCopySuccess(''), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse text-xl">Loading course...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8">
          <p>Course not found or you don't have access to this course.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-primary font-medium mt-2 hover:underline"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const isTeacher = currentUser.role === 'teacher' && course.teacher?._id === currentUser.uid;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div>
            <div className="bg-white border-3 border-black p-6 shadow-neubrutalism mb-6">
              <h3 className="text-xl font-bold mb-4">Course Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Subject</p>
                  <p className="font-medium">{course.subject}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Grade Level</p>
                  <p className="font-medium">{course.gradeLevel}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Teacher</p>
                  <p className="font-medium">{course.teacher?.displayName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Students</p>
                  <p className="font-medium">{course.students?.length || 0} enrolled</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Description</p>
                <p className="text-gray-700">{course.description}</p>
              </div>
            </div>
            
            {isTeacher && (
              <div className="bg-white border-3 border-black p-6 shadow-neubrutalism mb-6">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <FiLink className="mr-2" /> 
                  Course Join Code
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Share this code with your students to allow them to join your course:
                </p>
                <div className="flex items-center">
                  <div className="border-3 border-black px-4 py-3 font-mono font-bold text-xl mr-2 flex-1 text-center">
                    {course.joinCode}
                  </div>
                  <button
                    onClick={copyJoinCode}
                    className="btn-neubrutalism-primary flex items-center"
                  >
                    <FiCopy className="mr-2" />
                    {copySuccess || 'Copy'}
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white border-3 border-black p-6 shadow-neubrutalism">
              <h3 className="text-xl font-bold mb-4">Quick Access</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <button
                  onClick={() => handleTabChange('announcements')}
                  className="p-4 border-3 border-black text-center bg-white hover:bg-gray-50 shadow-neubrutalism-sm"
                >
                  <FiAlertCircle className="mx-auto text-2xl mb-2 text-blue-500" />
                  <span className="font-medium">Announcements</span>
                </button>
                <button
                  onClick={() => handleTabChange('assignments')}
                  className="p-4 border-3 border-black text-center bg-white hover:bg-gray-50 shadow-neubrutalism-sm"
                >
                  <FiClipboard className="mx-auto text-2xl mb-2 text-yellow-500" />
                  <span className="font-medium">Assignments</span>
                </button>
                <button
                  onClick={() => handleTabChange('notes')}
                  className="p-4 border-3 border-black text-center bg-white hover:bg-gray-50 shadow-neubrutalism-sm"
                >
                  <FiFileText className="mx-auto text-2xl mb-2 text-green-500" />
                  <span className="font-medium">Notes</span>
                </button>
                <button
                  onClick={() => handleTabChange('discussions')}
                  className="p-4 border-3 border-black text-center bg-white hover:bg-gray-50 shadow-neubrutalism-sm"
                >
                  <FiMessageSquare className="mx-auto text-2xl mb-2 text-purple-500" />
                  <span className="font-medium">Discussions</span>
                </button>
                <button
                  onClick={() => handleTabChange('people')}
                  className="p-4 border-3 border-black text-center bg-white hover:bg-gray-50 shadow-neubrutalism-sm"
                >
                  <FiUsers className="mx-auto text-2xl mb-2 text-gray-500" />
                  <span className="font-medium">People</span>
                </button>
              </div>
            </div>
          </div>
        );
      
      case 'announcements':
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Announcements</h3>
              {isTeacher && (
                <Link 
                  to={`/courses/${courseId}/announcements/create`}
                  className="btn-neubrutalism-primary"
                >
                  + New Announcement
                </Link>
              )}
            </div>
            
            {announcements.length === 0 ? (
              <div className="bg-white border-3 border-black p-6 shadow-neubrutalism text-center">
                <p className="text-gray-500">No announcements yet.</p>
                {isTeacher && (
                  <Link 
                    to={`/courses/${courseId}/announcements/create`}
                    className="inline-block btn-neubrutalism-primary mt-4"
                  >
                    Create your first announcement
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {announcements.map(announcement => (
                  <div 
                    key={announcement._id} 
                    className="bg-white border-3 border-black p-6 shadow-neubrutalism"
                  >
                    <div className="flex justify-between mb-2">
                      <h4 className="font-bold">{announcement.title}</h4>
                      <span className="text-sm text-gray-500">
                        {new Date(announcement.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-4">{announcement.content}</p>
                    <div className="text-sm text-gray-500">
                      Posted by {announcement.author.displayName}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      
      case 'assignments':
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Assignments</h3>
              {isTeacher && (
                <Link 
                  to={`/courses/${courseId}/assignments/create`}
                  className="btn-neubrutalism-primary"
                >
                  + New Assignment
                </Link>
              )}
            </div>
            
            {assignments.length === 0 ? (
              <div className="bg-white border-3 border-black p-6 shadow-neubrutalism text-center">
                <p className="text-gray-500">No assignments yet.</p>
                {isTeacher && (
                  <Link 
                    to={`/courses/${courseId}/assignments/create`}
                    className="inline-block btn-neubrutalism-primary mt-4"
                  >
                    Create your first assignment
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {assignments.map(assignment => (
                  <div 
                    key={assignment._id} 
                    className="bg-white border-3 border-black p-6 shadow-neubrutalism"
                  >
                    <div className="flex justify-between mb-2">
                      <h4 className="font-bold">{assignment.title}</h4>
                      <span className="text-sm text-gray-500">
                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-4">{assignment.description}</p>
                    <Link
                      to={`/courses/${courseId}/assignments/${assignment._id}`}
                      className="inline-block btn-neubrutalism-secondary"
                    >
                      View Details
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      
      case 'notes':
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Notes</h3>
              <Link 
                to={`/courses/${courseId}/notes/create`}
                className="btn-neubrutalism-primary"
              >
                + Add Note
              </Link>
            </div>
            
            {notes.length === 0 ? (
              <div className="bg-white border-3 border-black p-6 shadow-neubrutalism text-center">
                <p className="text-gray-500">No notes yet.</p>
                <Link 
                  to={`/courses/${courseId}/notes/create`}
                  className="inline-block btn-neubrutalism-primary mt-4"
                >
                  Create your first note
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {notes.map(note => (
                  <div 
                    key={note._id} 
                    className="bg-white border-3 border-black p-6 shadow-neubrutalism-sm hover:shadow-neubrutalism transition-shadow"
                    onClick={() => navigate(`/courses/${courseId}/notes/${note._id}`)}
                  >
                    <div className="flex justify-between mb-2">
                      <h4 className="font-bold">{note.title}</h4>
                      <span className="text-xs text-gray-500">
                        {new Date(note.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-4 line-clamp-3">{note.content}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        By {note.author.displayName}
                      </span>
                      <Link
                        to={`/courses/${courseId}/notes/${note._id}`}
                        className="text-primary text-sm font-medium hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Read more
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      
      case 'discussions':
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Discussions</h3>
              <Link 
                to={`/courses/${courseId}/discussions/create`}
                className="btn-neubrutalism-primary"
              >
                + New Discussion
              </Link>
            </div>
            
            {discussions.length === 0 ? (
              <div className="bg-white border-3 border-black p-6 shadow-neubrutalism text-center">
                <p className="text-gray-500">No discussions yet.</p>
                <Link 
                  to={`/courses/${courseId}/discussions/create`}
                  className="inline-block btn-neubrutalism-primary mt-4"
                >
                  Start a new discussion
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {discussions.map(discussion => (
                  <div 
                    key={discussion._id} 
                    className="bg-white border-3 border-black p-6 shadow-neubrutalism"
                  >
                    <div className="flex justify-between mb-2">
                      <h4 className="font-bold">{discussion.title}</h4>
                      <span className="text-sm text-gray-500">
                        {new Date(discussion.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-4 line-clamp-2">{discussion.content}</p>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        <span>Started by {discussion.author.displayName}</span>
                        <span className="mx-2">•</span>
                        <span>{discussion.replies?.length || 0} replies</span>
                      </div>
                      <Link
                        to={`/courses/${courseId}/discussions/${discussion._id}`}
                        className="inline-block btn-neubrutalism-secondary"
                      >
                        View Discussion
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      
      case 'people':
        return (
          <div>
            <h3 className="text-xl font-bold mb-6">People</h3>
            
            <div className="bg-white border-3 border-black p-6 shadow-neubrutalism mb-6">
              <h4 className="font-bold mb-4">Teacher</h4>
              <div className="flex items-center p-3 border-b">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                  <span className="font-bold text-primary">
                    {course.teacher?.displayName?.charAt(0) || '?'}
                  </span>
                </div>
                <div>
                  <p className="font-medium">{course.teacher?.displayName}</p>
                  <p className="text-sm text-gray-500">{course.teacher?.email}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white border-3 border-black p-6 shadow-neubrutalism">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold">Students ({course.students?.length || 0})</h4>
                {isTeacher && (
                  <button className="text-primary text-sm font-medium hover:underline">
                    Manage Students
                  </button>
                )}
              </div>
              
              {!course.students || course.students.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No students enrolled yet.</p>
              ) : (
                <div className="space-y-2">
                  {course.students.map(student => (
                    <div key={student._id} className="flex items-center p-3 border-b">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                        <span className="font-bold text-gray-500">
                          {student.displayName?.charAt(0) || '?'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{student.displayName}</p>
                        <p className="text-sm text-gray-500">{student.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      
      default:
        return <div>Select a tab to view content</div>;
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
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8">
          <FiAlertCircle className="inline mr-2" />
          {error}
        </div>
      )}
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">{course.name}</h1>
          <p className="text-gray-600">{course.subject} • {course.gradeLevel}</p>
        </div>
      </div>
      
      {/* Tab navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-8">
          <button
            className={`tab-button ${activeTab === 'overview' ? 'tab-active' : ''}`}
            onClick={() => handleTabChange('overview')}
          >
            <FiInfo className="mr-2" />
            Overview
          </button>
          <button
            className={`tab-button ${activeTab === 'announcements' ? 'tab-active' : ''}`}
            onClick={() => handleTabChange('announcements')}
          >
            <FiAlertCircle className="mr-2" />
            Announcements
          </button>
          <button
            className={`tab-button ${activeTab === 'assignments' ? 'tab-active' : ''}`}
            onClick={() => handleTabChange('assignments')}
          >
            <FiClipboard className="mr-2" />
            Assignments
          </button>
          <button
            className={`tab-button ${activeTab === 'notes' ? 'tab-active' : ''}`}
            onClick={() => handleTabChange('notes')}
          >
            <FiFileText className="mr-2" />
            Notes
          </button>
          <button
            className={`tab-button ${activeTab === 'discussions' ? 'tab-active' : ''}`}
            onClick={() => handleTabChange('discussions')}
          >
            <FiMessageSquare className="mr-2" />
            Discussions
          </button>
          <button
            className={`tab-button ${activeTab === 'people' ? 'tab-active' : ''}`}
            onClick={() => handleTabChange('people')}
          >
            <FiUsers className="mr-2" />
            People
          </button>
        </nav>
      </div>
      
      {/* Tab content */}
      {renderTabContent()}
    </div>
  );
};

export default CourseDetail; 