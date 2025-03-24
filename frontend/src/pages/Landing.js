import React from 'react';
import { Link } from 'react-router-dom';
import { FiBook, FiMessageCircle, FiCpu, FiClipboard, FiUsers } from 'react-icons/fi';

const Landing = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                AI-Powered Classroom for Better Learning
              </h1>
              <p className="mt-5 text-lg text-gray-700">
                Enhance your educational experience with NeuroLearn. Our platform integrates AI to solve doubts, summarize notes, generate quizzes, and foster communication between students and teachers.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link to="/register" className="btn-neubrutalism-primary text-center">
                  Get Started
                </Link>
                <Link to="/login" className="btn-neubrutalism text-center">
                  Login
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="relative">
                <div className="bg-white border-3 border-black shadow-neubrutalism p-6 rounded-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
                    alt="Students learning"
                    className="rounded-lg w-full h-auto"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-accent border-3 border-black shadow-neubrutalism p-4 rounded-lg">
                  <div className="text-white font-bold">
                    <div className="text-sm">AI-Powered</div>
                    <div className="text-xl">Learning</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Key Features</h2>
            <p className="mt-4 text-lg text-gray-700 max-w-2xl mx-auto">
              Our platform provides everything you need for a modern educational experience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white border-3 border-black shadow-neubrutalism p-6 rounded-lg">
              <div className="w-12 h-12 bg-primary/20 flex items-center justify-center rounded-lg mb-4">
                <FiCpu className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">AI Doubt Solver</h3>
              <p className="text-gray-700">
                Get instant answers to your academic questions with our AI-powered doubt solver.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white border-3 border-black shadow-neubrutalism p-6 rounded-lg">
              <div className="w-12 h-12 bg-secondary/20 flex items-center justify-center rounded-lg mb-4">
                <FiBook className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Smart Notes</h3>
              <p className="text-gray-700">
                Upload and organize notes with AI-powered summarization to enhance learning efficiency.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white border-3 border-black shadow-neubrutalism p-6 rounded-lg">
              <div className="w-12 h-12 bg-accent/20 flex items-center justify-center rounded-lg mb-4">
                <FiClipboard className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">Assignment Tracking</h3>
              <p className="text-gray-700">
                Never miss a deadline with our comprehensive assignment management system.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white border-3 border-black shadow-neubrutalism p-6 rounded-lg">
              <div className="w-12 h-12 bg-primary/20 flex items-center justify-center rounded-lg mb-4">
                <FiMessageCircle className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Real-Time Chat</h3>
              <p className="text-gray-700">
                Connect with teachers and classmates through instant messaging for better collaboration.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white border-3 border-black shadow-neubrutalism p-6 rounded-lg">
              <div className="w-12 h-12 bg-secondary/20 flex items-center justify-center rounded-lg mb-4">
                <FiUsers className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Discussion Forums</h3>
              <p className="text-gray-700">
                Engage in course-specific discussions to deepen understanding and share insights.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white border-3 border-black shadow-neubrutalism p-6 rounded-lg">
              <div className="w-12 h-12 bg-accent/20 flex items-center justify-center rounded-lg mb-4">
                <FiCpu className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">Quiz Generator</h3>
              <p className="text-gray-700">
                Test your knowledge with AI-generated quizzes tailored to your courses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border-3 border-black shadow-neubrutalism-lg p-10 rounded-lg">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold">Ready to Revolutionize Your Learning?</h2>
              <p className="mt-4 text-lg text-gray-700 max-w-2xl mx-auto">
                Join thousands of students and teachers who are already experiencing the benefits of AI-powered education.
              </p>
              <div className="mt-8">
                <Link to="/register" className="btn-neubrutalism-primary text-center">
                  Sign Up Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing; 