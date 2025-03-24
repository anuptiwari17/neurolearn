import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { 
  FiHome, 
  FiBook, 
  FiMessageCircle, 
  FiCpu, 
  FiLogOut, 
  FiMenu, 
  FiX,
  FiUser
} from 'react-icons/fi';

const Layout = ({ children }) => {
  const { userProfile, logout } = useUser();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white border-r border-gray-200 transition duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-4 py-6 border-b border-gray-200">
          <div className="text-2xl font-bold text-primary">NeuroLearn</div>
          <button 
            onClick={closeSidebar}
            className="p-2 rounded-md lg:hidden hover:bg-gray-100"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
              {userProfile?.name?.[0] || <FiUser />}
            </div>
            <div className="ml-3">
              <p className="font-medium">{userProfile?.name || 'User'}</p>
              <p className="text-sm text-gray-500 capitalize">{userProfile?.role || 'Student'}</p>
            </div>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="px-4 py-4 space-y-1">
          <Link 
            to="/dashboard" 
            className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-primary hover:text-white"
            onClick={closeSidebar}
          >
            <FiHome className="w-5 h-5 mr-3" />
            Dashboard
          </Link>
          
          <Link 
            to="/courses" 
            className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-primary hover:text-white"
            onClick={closeSidebar}
          >
            <FiBook className="w-5 h-5 mr-3" />
            Courses
          </Link>
          
          <Link 
            to="/messages" 
            className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-primary hover:text-white"
            onClick={closeSidebar}
          >
            <FiMessageCircle className="w-5 h-5 mr-3" />
            Messages
          </Link>
          
          <div className="pt-4 pb-2 px-4 text-xs font-semibold text-gray-400 uppercase">
            AI Tools
          </div>
          
          <Link 
            to="/ai/doubt-solver" 
            className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-primary hover:text-white"
            onClick={closeSidebar}
          >
            <FiCpu className="w-5 h-5 mr-3" />
            Doubt Solver
          </Link>
          
          <Link 
            to="/ai/note-summarizer" 
            className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-primary hover:text-white"
            onClick={closeSidebar}
          >
            <FiCpu className="w-5 h-5 mr-3" />
            Note Summarizer
          </Link>
          
          <Link 
            to="/ai/quiz-generator" 
            className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-primary hover:text-white"
            onClick={closeSidebar}
          >
            <FiCpu className="w-5 h-5 mr-3" />
            Quiz Generator
          </Link>
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-gray-700 rounded-lg hover:bg-red-100 hover:text-red-500"
          >
            <FiLogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-md lg:hidden hover:bg-gray-100"
          >
            <FiMenu className="w-6 h-6" />
          </button>
          
          <h1 className="text-xl font-semibold text-gray-800">
            {/* This could be dynamically set based on the current route */}
            Dashboard
          </h1>
          
          <div className="flex items-center">
            {/* Notification bell or other top-bar elements could go here */}
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout; 