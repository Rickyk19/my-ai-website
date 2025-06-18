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
              <img src={logo} alt="Billion Hopes Logo" className="h-10 w-auto object-contain" />
              <span className="flex flex-col">
                <motion.h1 
                  className="text-2xl font-bold text-blue-600"
                  whileHover={{ scale: 1.05 }}
                >
                  Billion Hopes
                </motion.h1>
                <span className="text-sm text-gray-600">AI for Real Impact</span>
              </span>
            </Link>
          </div>

          {/* Navigation Items */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-600 hover:text-blue-600">Home</Link>
            <Link to="/ai-explained" className="text-gray-600 hover:text-blue-600">AI Explained</Link>
            <Link to="/solutions" className="text-gray-600 hover:text-blue-600">Solutions</Link>
            <Link to="/trends" className="text-gray-600 hover:text-blue-600">Trends</Link>
            <Link to="/data-lab" className="text-gray-600 hover:text-blue-600">Data Lab</Link>
            <Link to="/agi" className="text-gray-600 hover:text-blue-600">AGI</Link>
            <Link to="/resources" className="text-gray-600 hover:text-blue-600">AI Resources</Link>
            <Link to="/contact" className="text-gray-600 hover:text-blue-600">Contact</Link>
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