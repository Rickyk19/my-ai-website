import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from '../../assets/logo.png';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Tagline */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-3">
              <img src={logo} alt="ABCD CORPORATION Logo" className="h-10 w-auto object-contain" />
              <span className="flex flex-col">
                <motion.h1 
                  className="text-2xl font-bold text-blue-600"
                  whileHover={{ scale: 1.05 }}
                >
                  ABCD CORPORATION
                </motion.h1>
                
              </span>
            </Link>
          </div>

          {/* Navigation Items */}
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="text-gray-600 hover:text-blue-600">Home</Link>
            <Link to="/ai-playground" className="text-gray-600 hover:text-blue-600 font-medium">🚀 Playground</Link>
            <Link to="/progress" className="text-gray-600 hover:text-blue-600 font-medium">📊 Progress</Link>
            <Link to="/ai-quizzes" className="text-gray-600 hover:text-blue-600 font-medium">🧠 Quizzes</Link>
            <Link to="/community" className="text-gray-600 hover:text-blue-600 font-medium">💬 Community</Link>
            <Link to="/recommendations" className="text-gray-600 hover:text-blue-600 font-medium">🎯 Recommendations</Link>
            <Link to="/courses" className="text-gray-600 hover:text-blue-600">Courses</Link>
            <Link to="/ai-explained" className="text-gray-600 hover:text-blue-600">AI Explained</Link>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <Link 
              to="/login" 
              className="text-gray-600 hover:text-blue-600"
            >
              Login
            </Link>
            <Link 
              to="/signup" 
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 