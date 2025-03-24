import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white border-b-3 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-primary">NeuroLearn</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center">
            {currentUser ? (
              <>
                <Link to="/dashboard" className="px-3 py-2 mx-2 font-medium hover:text-primary">
                  Dashboard
                </Link>
                
                {userProfile?.role === 'teacher' && (
                  <Link to="/courses/create" className="px-3 py-2 mx-2 font-medium hover:text-primary">
                    Create Course
                  </Link>
                )}
                
                {userProfile?.role === 'student' && (
                  <Link to="/courses/join" className="px-3 py-2 mx-2 font-medium hover:text-primary">
                    Join Course
                  </Link>
                )}
                
                <Link to="/messaging" className="px-3 py-2 mx-2 font-medium hover:text-primary">
                  Messages
                </Link>
                
                <Link to="/ai-doubt-solver" className="px-3 py-2 mx-2 font-medium hover:text-primary">
                  AI Doubt Solver
                </Link>
                
                <div className="mx-4 border-l border-gray-300 h-6"></div>
                
                <div className="relative group">
                  <button className="flex items-center px-3 py-2 font-medium">
                    {userProfile?.displayName || currentUser.email}
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white border-3 border-black shadow-neubrutalism-sm hidden group-hover:block z-50">
                    <div className="py-1">
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="btn-neubrutalism-primary ml-3"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="btn-neubrutalism ml-3"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {isMenuOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {currentUser ? (
              <>
                <Link
                  to="/dashboard"
                  className="block px-3 py-2 text-base font-medium hover:text-primary"
                  onClick={toggleMenu}
                >
                  Dashboard
                </Link>
                
                {userProfile?.role === 'teacher' && (
                  <Link
                    to="/courses/create"
                    className="block px-3 py-2 text-base font-medium hover:text-primary"
                    onClick={toggleMenu}
                  >
                    Create Course
                  </Link>
                )}
                
                {userProfile?.role === 'student' && (
                  <Link
                    to="/courses/join"
                    className="block px-3 py-2 text-base font-medium hover:text-primary"
                    onClick={toggleMenu}
                  >
                    Join Course
                  </Link>
                )}
                
                <Link
                  to="/messaging"
                  className="block px-3 py-2 text-base font-medium hover:text-primary"
                  onClick={toggleMenu}
                >
                  Messages
                </Link>
                
                <Link
                  to="/ai-doubt-solver"
                  className="block px-3 py-2 text-base font-medium hover:text-primary"
                  onClick={toggleMenu}
                >
                  AI Doubt Solver
                </Link>
                
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:text-red-800"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 text-base font-medium hover:text-primary"
                  onClick={toggleMenu}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 text-base font-medium hover:text-primary"
                  onClick={toggleMenu}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 