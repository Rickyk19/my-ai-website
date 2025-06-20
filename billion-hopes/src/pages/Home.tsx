import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  XMarkIcon, 
  AcademicCapIcon, 
  StarIcon, 
  PlayIcon, 
  FireIcon,
  SparklesIcon,
  RocketLaunchIcon,
  BoltIcon
} from '@heroicons/react/24/outline';
import { 
  StarIcon as StarSolidIcon, 
  FireIcon as FireSolidIcon,
  SparklesIcon as SparklesSolidIcon 
} from '@heroicons/react/24/solid';
import logo from '../assets/logo.png';
import { useAuth } from '../context/AuthContext';
import FeatureCards from '../components/FeatureCards';

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
              Email
            </label>
            <input
              type="email"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter your email"
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
          <p>Email: sm@ptuniverse.com</p>
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
    navigate('/courses');
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
      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden w-full py-16 bg-gradient-to-br from-blue-600 via-purple-700 to-indigo-800 text-white">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.3, 1],
            }}
            transition={{ 
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -top-20 -left-20 w-64 h-64 bg-gradient-to-r from-cyan-400 to-blue-400 opacity-10 rounded-full blur-xl"
          />
          <motion.div
            animate={{ 
              rotate: -360,
              scale: [1.2, 1, 1.2],
            }}
            transition={{ 
              duration: 30,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-400 opacity-10 rounded-full blur-xl"
          />
          <motion.div
            animate={{ 
              y: [-30, 30, -30],
              x: [-20, 20, -20],
            }}
            transition={{ 
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/4 left-1/3 w-32 h-32 bg-gradient-to-r from-yellow-400 to-orange-400 opacity-15 rounded-full blur-lg"
          />
          <motion.div
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-gradient-to-r from-green-400 to-teal-400 opacity-20 rounded-full blur-md"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center"
          >
            {/* Logo with Enhanced Styling */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, type: "spring", stiffness: 100 }}
              className="mb-8"
            >
              <div className="relative inline-block">
                {/* Glow effect behind logo */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 rounded-full blur-2xl opacity-50"
                />
                
                <motion.img
                  src={logo}
                  alt="Billion Hopes Logo"
                  className="relative w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 object-contain drop-shadow-2xl"
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.02, 1]
                  }}
                  transition={{ 
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                {/* Sparkle effects around logo */}
                <motion.div
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute -top-4 -right-4"
                >
                  <SparklesSolidIcon className="h-8 w-8 text-yellow-300" />
                </motion.div>
                
                <motion.div
                  animate={{ 
                    rotate: -360,
                    scale: [1.2, 1, 1.2]
                  }}
                  transition={{ 
                    duration: 5,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute -bottom-4 -left-4"
                >
                  <SparklesSolidIcon className="h-6 w-6 text-pink-300" />
                </motion.div>
              </div>
            </motion.div>

            {/* Company Name with Dramatic Styling */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mb-6"
            >
              <div className="flex justify-center items-center gap-4 mb-4">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <FireSolidIcon className="h-12 w-12 md:h-16 md:w-16 text-orange-400" />
                </motion.div>
                
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black bg-gradient-to-r from-yellow-200 via-orange-200 to-pink-200 bg-clip-text text-transparent drop-shadow-2xl">
                  BILLION HOPES
                </h1>
                
                <motion.div
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                >
                  <RocketLaunchIcon className="h-12 w-12 md:h-16 md:w-16 text-cyan-400" />
                </motion.div>
              </div>
              
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, type: "spring", stiffness: 150 }}
                className="inline-block bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-1 rounded-full"
              >
                <div className="bg-white/10 backdrop-blur-sm px-8 py-3 rounded-full border border-white/20">
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-white">
                    🤖 AI FOR REAL IMPACT 🚀
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* Welcome Message with Animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="mb-8"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                Welcome to the Future of Learning! 🎓
              </h2>
              <p className="text-xl md:text-2xl lg:text-3xl text-blue-100 font-semibold max-w-4xl mx-auto">
                Empowering the future through AI education and innovation
              </p>
            </motion.div>

            {/* Call-to-Action Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-4xl mb-2"
                >
                  🎯
                </motion.div>
                <p className="text-2xl font-bold text-white">20+ Courses</p>
                <p className="text-blue-200">Premium Learning</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  className="text-4xl mb-2"
                >
                  ⭐
                </motion.div>
                <p className="text-2xl font-bold text-white">5-Star Rated</p>
                <p className="text-blue-200">Excellence</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="text-4xl mb-2"
                >
                  🚀
                </motion.div>
                <p className="text-2xl font-bold text-white">Lifetime Access</p>
                <p className="text-blue-200">Forever Learning</p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white opacity-30 rounded-full"
              animate={{
                y: [Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800), -100],
                x: [Math.random() * 100 - 50, Math.random() * 100 - 50],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
      </section>

      {/* Amazing Explore Courses Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 text-white py-16 px-6">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.2, 1],
            }}
            transition={{ 
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -top-10 -left-10 w-40 h-40 bg-yellow-400 opacity-20 rounded-full"
          />
          <motion.div
            animate={{ 
              rotate: -360,
              scale: [1.2, 1, 1.2],
            }}
            transition={{ 
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -bottom-20 -right-20 w-60 h-60 bg-blue-400 opacity-20 rounded-full"
          />
          <motion.div
            animate={{ 
              y: [-20, 20, -20],
              x: [-10, 10, -10],
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/2 left-1/4 w-20 h-20 bg-green-400 opacity-30 rounded-full"
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          {/* Main Heading with Animation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="flex justify-center items-center gap-3 mb-4">
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <FireSolidIcon className="h-12 w-12 text-yellow-300" />
              </motion.div>
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200 bg-clip-text text-transparent">
                EXPLORE COURSES
              </h2>
              <motion.div
                animate={{ rotate: [0, -15, 15, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              >
                <SparklesSolidIcon className="h-12 w-12 text-pink-300" />
              </motion.div>
            </div>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-xl md:text-2xl font-bold text-yellow-100 mb-2"
            >
              🚀 Transform Your Future with AI & Tech Skills!
            </motion.p>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto"
            >
              Join thousands of students mastering cutting-edge technology. From Python to Machine Learning - Start your journey today!
            </motion.p>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-center gap-2 mb-2">
                <AcademicCapIcon className="h-8 w-8 text-yellow-300" />
                <span className="text-3xl font-bold text-white">20+</span>
              </div>
              <p className="text-white/90 font-semibold">Premium Courses</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-center gap-2 mb-2">
                <PlayIcon className="h-8 w-8 text-pink-300" />
                <span className="text-3xl font-bold text-white">200+</span>
              </div>
              <p className="text-white/90 font-semibold">Video Lessons</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <StarSolidIcon key={i} className="h-6 w-6 text-yellow-400" />
                  ))}
                </div>
              </div>
              <p className="text-white/90 font-semibold">5-Star Rated</p>
            </div>
          </motion.div>

          {/* Main CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="mb-8"
          >
            <motion.button
              onClick={handleExploreClick}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
              }}
              whileTap={{ scale: 0.95 }}
              className="group relative inline-flex items-center gap-4 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white font-black text-xl md:text-2xl px-12 py-6 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <RocketLaunchIcon className="h-8 w-8" />
              </motion.div>
              
              <span className="relative z-10">
                START LEARNING NOW!
              </span>
              
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <BoltIcon className="h-8 w-8" />
              </motion.div>

              {/* Animated glow effect */}
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full blur-xl opacity-50 -z-10"
              />
            </motion.button>
          </motion.div>

          {/* Feature highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm md:text-base"
          >
            <div className="flex items-center gap-2 justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <SparklesIcon className="h-5 w-5 text-yellow-300" />
              </motion.div>
              <span className="text-white/90 font-semibold">Lifetime Access</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <AcademicCapIcon className="h-5 w-5 text-pink-300" />
              <span className="text-white/90 font-semibold">Certificates</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <PlayIcon className="h-5 w-5 text-blue-300" />
              <span className="text-white/90 font-semibold">HD Videos</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <BoltIcon className="h-5 w-5 text-green-300" />
              <span className="text-white/90 font-semibold">Quick Start</span>
            </div>
          </motion.div>

          {/* Urgent Call-to-Action */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="mt-8 p-4 bg-red-600/80 backdrop-blur-sm rounded-2xl border border-red-400/50 max-w-2xl mx-auto"
          >
            <p className="text-white font-bold text-lg mb-2">
              🔥 Limited Time: Unlock Your Potential Today!
            </p>
            <p className="text-red-100">
              Join the AI revolution and future-proof your career with our comprehensive course library
            </p>
          </motion.div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <FeatureCards />
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