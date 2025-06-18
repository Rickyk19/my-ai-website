import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 w-full bg-blue-600 shadow-md z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24">
        <div className="flex justify-between items-center h-full">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="Billion Hopes Logo" className="h-16 w-auto" />
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/solutions" className="text-white hover:text-blue-100 transition-colors text-lg">
              Solutions
            </Link>
            <Link to="/ai-explained" className="text-white hover:text-blue-100 transition-colors text-lg">
              AI Explained
            </Link>
            <Link to="/trends" className="text-white hover:text-blue-100 transition-colors text-lg">
              Trends
            </Link>
            <Link to="/data-lab" className="text-white hover:text-blue-100 transition-colors text-lg">
              Data Lab
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="text-white hover:text-blue-100 transition-colors text-lg"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-white text-blue-600 px-6 py-2 rounded-full hover:bg-blue-50 transition-colors text-lg font-medium"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-blue-100 transition-colors"
            >
              <span className="sr-only">Open menu</span>
              {/* Hamburger icon */}
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/solutions"
                className="block text-white hover:text-blue-100 transition-colors text-lg py-2"
              >
                Solutions
              </Link>
              <Link
                to="/ai-explained"
                className="block text-white hover:text-blue-100 transition-colors text-lg py-2"
              >
                AI Explained
              </Link>
              <Link
                to="/trends"
                className="block text-white hover:text-blue-100 transition-colors text-lg py-2"
              >
                Trends
              </Link>
              <Link
                to="/data-lab"
                className="block text-white hover:text-blue-100 transition-colors text-lg py-2"
              >
                Data Lab
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 