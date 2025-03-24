import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { FiBook, FiMessageCircle, FiCpu, FiClipboard, FiUsers, FiClock } from 'react-icons/fi';
import apiService from '../services/apiService';

const Dashboard = () => {
  const { userProfile } = useUser();
  const [stats, setStats] = useState({
    courses: 0,
    assignments: 0,
    messages: 0,
  });
  const [recentCourses, setRecentCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // In a real app, these would be separate API calls
        // const statsResponse = await apiService.get('/dashboard/stats');
        // const coursesResponse = await apiService.get('/courses/recent');
        
        // Mock data for development
        setTimeout(() => {
          setStats({
            courses: 5,
            assignments: 3,
            messages: 12,
          });
          
          setRecentCourses([
            { id: 1, name: 'Introduction to Machine Learning', instructor: 'Dr. Smith' },
            { id: 2, name: 'Advanced Data Structures', instructor: 'Prof. Johnson' },
            { id: 3, name: 'Web Development Bootcamp', instructor: 'Jane Doe' },
          ]);
          
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  // Feature cards data
  const featureCards = [
    {
      id: 1,
      title: 'Doubt Solver',
      description: 'Get instant answers to your academic questions',
      icon: <FiCpu className="w-6 h-6 text-white" />,
      link: '/ai/doubt-solver',
      color: 'bg-primary',
    },
    {
      id: 2,
      title: 'Note Summarizer',
      description: 'Summarize your notes with AI assistance',
      icon: <FiBook className="w-6 h-6 text-white" />,
      link: '/ai/note-summarizer',
      color: 'bg-secondary',
    },
    {
      id: 3,
      title: 'Quiz Generator',
      description: 'Create quizzes from your course material',
      icon: <FiCpu className="w-6 h-6 text-white" />,
      link: '/ai/quiz-generator',
      color: 'bg-accent',
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">
          Welcome back, {userProfile?.name || 'User'}!
        </h2>
        <p className="text-gray-600">
          {userProfile?.role === 'teacher' 
            ? 'Manage your courses and connect with your students.' 
            : 'Track your progress and continue learning where you left off.'}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
          <div className="rounded-full p-3 bg-primary/10 mr-4">
            <FiBook className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Courses</p>
            <p className="text-2xl font-bold">{stats.courses}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
          <div className="rounded-full p-3 bg-secondary/10 mr-4">
            <FiClipboard className="h-6 w-6 text-secondary" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Pending Assignments</p>
            <p className="text-2xl font-bold">{stats.assignments}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
          <div className="rounded-full p-3 bg-accent/10 mr-4">
            <FiMessageCircle className="h-6 w-6 text-accent" />
          </div>
          <div>
            <p className="text-sm text-gray-500">New Messages</p>
            <p className="text-2xl font-bold">{stats.messages}</p>
          </div>
        </div>
      </div>

      {/* AI Features */}
      <div>
        <h3 className="text-xl font-bold mb-4">AI Tools</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featureCards.map((feature) => (
            <Link key={feature.id} to={feature.link} className="block group">
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className={`${feature.color} px-6 py-4 flex items-center`}>
                  <div className="rounded-full bg-white/20 p-2">
                    {feature.icon}
                  </div>
                  <h4 className="text-lg font-bold text-white ml-3">{feature.title}</h4>
                </div>
                <div className="p-6">
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Courses */}
      <div>
        <h3 className="text-xl font-bold mb-4">Recent Courses</h3>
        <div className="bg-white rounded-lg shadow-md">
          {recentCourses.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {recentCourses.map((course) => (
                <Link key={course.id} to={`/courses/${course.id}`} className="block p-6 hover:bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-gray-900">{course.name}</h4>
                      <p className="text-sm text-gray-500">Instructor: {course.instructor}</p>
                    </div>
                    <FiClock className="text-gray-400" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              <p>No courses enrolled yet.</p>
              {userProfile?.role === 'student' ? (
                <Link to="/courses/join" className="text-primary hover:underline mt-2 inline-block">
                  Join a course
                </Link>
              ) : (
                <Link to="/courses/create" className="text-primary hover:underline mt-2 inline-block">
                  Create a course
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {userProfile?.role === 'teacher' ? (
            <>
              <Link to="/courses/create" className="btn-neubrutalism bg-white hover:bg-gray-50 text-center py-3">
                Create Course
              </Link>
              <Link to="/assignments/create" className="btn-neubrutalism bg-white hover:bg-gray-50 text-center py-3">
                New Assignment
              </Link>
              <Link to="/announcements/create" className="btn-neubrutalism bg-white hover:bg-gray-50 text-center py-3">
                Post Announcement
              </Link>
              <Link to="/students" className="btn-neubrutalism bg-white hover:bg-gray-50 text-center py-3">
                View Students
              </Link>
            </>
          ) : (
            <>
              <Link to="/courses/join" className="btn-neubrutalism bg-white hover:bg-gray-50 text-center py-3">
                Join Course
              </Link>
              <Link to="/assignments" className="btn-neubrutalism bg-white hover:bg-gray-50 text-center py-3">
                View Assignments
              </Link>
              <Link to="/discussions" className="btn-neubrutalism bg-white hover:bg-gray-50 text-center py-3">
                Discussions
              </Link>
              <Link to="/notes" className="btn-neubrutalism bg-white hover:bg-gray-50 text-center py-3">
                My Notes
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 