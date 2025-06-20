import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { XMarkIcon } from '@heroicons/react/24/outline';
import logo from '../assets/logo.png';
import { useAuth } from '../context/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const success = await login(username, password);
      if (success) {
        onSuccess();
      } else {
        setError('Invalid username or password');
        // Clear password field on failed attempt
        setPassword('');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      setPassword('');
    }
  };

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
        
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Login to Access Courses</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter your username"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Login
          </button>
        </form>

        <div className="mt-4 text-sm text-gray-600 text-center">
          <p>Use the following credentials:</p>
          <p>Username: admin</p>
          <p>Password: billion123</p>
        </div>
      </div>
    </div>
  );
};

const Home: React.FC = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Newsletter subscription state
  const [email, setEmail] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleExploreClick = () => {
    if (isAuthenticated) {
      navigate('/courses');
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false);
    navigate('/courses');
  };

  // Handle newsletter subscription
  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubscribing) return;
    if (!email.trim()) return;

    setIsSubscribing(true);
    setSubscriptionStatus({ type: null, message: '' });

    try {
      const response = await fetch('https://ahvxqultshujqtmbkjpy.supabase.co/rest/v1/newsletter%20subscribers', {
        method: 'POST',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ',
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          email: email.trim(),
          created_at: new Date().toISOString()
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      setSubscriptionStatus({
        type: 'success',
        message: 'Successfully subscribed to our newsletter!'
      });
      setEmail('');
    } catch (error: any) {
      console.error('Error subscribing to newsletter:', error);
      setSubscriptionStatus({
        type: 'error',
        message: `Failed to subscribe: ${error.message}`
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="w-full py-8 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center -space-y-4"
        >
          <motion.img
            src={logo}
            alt="Billion Hopes Logo"
            className="w-40 h-40 md:w-56 md:h-56 lg:w-64 lg:h-64 object-contain"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          />
          <div className="space-y-2 text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">Welcome to Billion Hopes</h1>
            <p className="text-base md:text-lg lg:text-xl">Empowering the future through AI education and innovation</p>
            <button
              onClick={handleExploreClick}
              className="bg-white text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-blue-50 transition-colors inline-block mt-2"
            >
              Explore Courses
            </button>
          </div>
        </motion.div>
      </section>

      {/* Featured Sections */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <h2 className="text-2xl font-semibold mb-4">AI Explained</h2>
          <p className="text-gray-600 mb-4">
            Discover the fundamentals of artificial intelligence and its applications.
          </p>
          <Link to="/ai-explained" className="text-blue-600 hover:text-blue-800">
            Learn More →
          </Link>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <h2 className="text-2xl font-semibold mb-4">Latest Trends</h2>
          <p className="text-gray-600 mb-4">
            Stay updated with the latest developments in AI and technology.
          </p>
          <Link to="/trends" className="text-blue-600 hover:text-blue-800">
            Explore Trends →
          </Link>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <h2 className="text-2xl font-semibold mb-4">Data Lab</h2>
          <p className="text-gray-600 mb-4">
            Access datasets and resources for your AI projects.
          </p>
          <Link to="/data-lab" className="text-blue-600 hover:text-blue-800">
            Visit Data Lab →
          </Link>
        </motion.div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-gray-100 p-8 rounded-lg text-center">
        <h2 className="text-3xl font-semibold mb-4">Stay Updated</h2>
        <p className="text-gray-600 mb-6">
          Subscribe to our newsletter for the latest updates in AI and technology.
        </p>
        
        {/* Status Message */}
        {subscriptionStatus.type && (
          <div
            className={`mb-4 p-3 rounded-md max-w-md mx-auto ${
              subscriptionStatus.type === 'success' 
                ? 'bg-green-100 border border-green-400 text-green-700' 
                : 'bg-red-100 border border-red-400 text-red-700'
            }`}
          >
            {subscriptionStatus.message}
          </div>
        )}
        
        <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto flex gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            disabled={isSubscribing}
            className={`px-6 py-2 rounded-md transition-colors ${
              isSubscribing 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            {isSubscribing ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
      </section>

      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default Home; 