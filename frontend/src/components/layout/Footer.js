import React from 'react';
import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiLinkedin } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-white border-t-3 border-black py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary">NeuroLearn</span>
            </Link>
            <p className="mt-2 text-gray-600 max-w-md">
              Enhancing education with AI-powered tools for students and teachers.
              Join our platform for a smarter classroom experience.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
            <div>
              <h2 className="mb-4 text-sm font-semibold text-gray-900 uppercase">Resources</h2>
              <ul>
                <li className="mb-2">
                  <Link to="/" className="text-gray-600 hover:underline">Home</Link>
                </li>
                <li>
                  <Link to="/dashboard" className="text-gray-600 hover:underline">Dashboard</Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h2 className="mb-4 text-sm font-semibold text-gray-900 uppercase">Features</h2>
              <ul>
                <li className="mb-2">
                  <Link to="/ai-doubt-solver" className="text-gray-600 hover:underline">AI Doubt Solver</Link>
                </li>
                <li>
                  <Link to="/dashboard" className="text-gray-600 hover:underline">Courses</Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h2 className="mb-4 text-sm font-semibold text-gray-900 uppercase">Legal</h2>
              <ul>
                <li className="mb-2">
                  <a href="#" className="text-gray-600 hover:underline">Privacy Policy</a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:underline">Terms of Service</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <hr className="my-6 border-gray-300" />
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <span className="text-sm text-gray-600">
            © {new Date().getFullYear()} NeuroLearn. All Rights Reserved.
          </span>
          
          <div className="flex mt-4 space-x-6 md:mt-0">
            <a href="#" className="text-gray-600 hover:text-gray-900">
              <FiGithub className="w-5 h-5" />
              <span className="sr-only">GitHub</span>
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              <FiTwitter className="w-5 h-5" />
              <span className="sr-only">Twitter</span>
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              <FiLinkedin className="w-5 h-5" />
              <span className="sr-only">LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 