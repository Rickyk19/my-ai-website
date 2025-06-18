import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { XMarkIcon } from '@heroicons/react/24/outline';
import logo from '../assets/logo.png';

const LoginModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Login to Your Account</h2>
        
        <form className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter your username"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export const Navbar: React.FC = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <>
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
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="text-white hover:text-blue-100 transition-colors text-lg"
              >
                Login
              </button>
              <Link
                to="/signup"
                className="bg-white text-blue-600 px-6 py-3 rounded-full hover:bg-blue-50 transition-colors text-lg font-medium"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>
      
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  );
};

export default Navbar; 