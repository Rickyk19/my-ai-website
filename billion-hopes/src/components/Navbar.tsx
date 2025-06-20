import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { isAuthenticated, isAdmin, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

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
            <Link to="/showcase" className="text-white hover:text-blue-100 transition-colors text-lg">
              🚀 Platform Guide
            </Link>
            <Link to="/solutions" className="text-white hover:text-blue-100 transition-colors text-lg">
              Solutions
            </Link>
            <Link to="/ai-explained" className="text-white hover:text-blue-100 transition-colors text-lg">
              AI Explained
            </Link>
            <Link to="/agi" className="text-white hover:text-blue-100 transition-colors text-lg">
              AGI
            </Link>
            <Link to="/trends" className="text-white hover:text-blue-100 transition-colors text-lg">
              Trends
            </Link>
            <Link to="/data-lab" className="text-white hover:text-blue-100 transition-colors text-lg">
              Data Lab
            </Link>
            <Link to="/resources" className="text-white hover:text-blue-100 transition-colors text-lg">
              AI Resources
            </Link>
            {isAdmin && (
              <Link to="/dashboard" className="text-white hover:text-blue-100 transition-colors text-lg">
                Dashboard
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="text-white hover:text-blue-100 transition-colors text-lg"
              >
                Logout
              </button>
            )}
            <Link
              to="/members-login"
              className="bg-white text-blue-600 px-6 py-3 rounded-full hover:bg-blue-50 transition-colors text-lg font-medium"
            >
              Members Login Area
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 