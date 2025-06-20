import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  AcademicCapIcon, 
  LockClosedIcon, 
  UserIcon, 
  EyeIcon, 
  EyeSlashIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { authenticateMember } from '../utils/supabase';
import { useAuth } from '../context/AuthContext';

interface LoginFormData {
  email: string;
  password: string;
}

const MembersLogin: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.email.trim()) {
      setMessage({type: 'error', text: 'Email is required'});
      return false;
    }
    if (!formData.email.includes('@')) {
      setMessage({type: 'error', text: 'Please enter a valid email address'});
      return false;
    }
    if (!formData.password.trim()) {
      setMessage({type: 'error', text: 'Password is required'});
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      // First check if this is an admin login attempt
      const isAdminAttempt = formData.email.toLowerCase() === 'sm@ptuniverse.com';
      
      if (isAdminAttempt) {
        console.log('🔑 Admin login attempt detected');
        const adminLoginSuccess = await login(formData.email, formData.password);
        
        if (adminLoginSuccess) {
          setMessage({type: 'success', text: 'Admin login successful! Redirecting to dashboard...'});
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
          return;
        } else {
          setMessage({type: 'error', text: 'Invalid admin credentials. Please check your email and password.'});
          return;
        }
      }

      // For non-admin users, use the member authentication
      console.log('👨‍🎓 Student/Member login attempt');
      const authResult = await authenticateMember(formData.email.toLowerCase(), formData.password);

      if (!authResult.success) {
        setMessage({type: 'error', text: authResult.error || 'Invalid email or password. Please check your credentials.'});
        return;
      }

      // Store user session for members
      localStorage.setItem('memberData', JSON.stringify({
        id: authResult.user.id,
        email: authResult.user.email,
        name: authResult.user.name,
        courses: authResult.purchases,
        loginTime: new Date().toISOString()
      }));

      setMessage({type: 'success', text: 'Login successful! Redirecting to your course library...'});
      
      setTimeout(() => {
        navigate('/members-dashboard');
      }, 2000);

    } catch (error: any) {
      console.error('Login error:', error);
      setMessage({type: 'error', text: 'Login failed. Please try again.'});
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8"
      >
        {/* Header */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center"
          >
            <AcademicCapIcon className="h-8 w-8 text-white" />
          </motion.div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Members Login Area
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Access your purchased courses and learning materials
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Admin can also login here using: sm@ptuniverse.com
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
                message.type === 'success' 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircleIcon className="h-5 w-5" />
              ) : (
                <XMarkIcon className="h-5 w-5" />
              )}
              {message.text}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter your email address"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-colors ${
                isLoading 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing In...
                </div>
              ) : (
                'Access Dashboard'
              )}
            </button>
          </form>

          {/* Help Links */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-gray-600">
              Don't have an account? 
              <button 
                onClick={() => navigate('/courses')}
                className="ml-1 text-blue-600 hover:text-blue-800 font-medium"
              >
                Purchase a course first
              </button>
            </p>
            <p className="text-sm text-gray-600">
              Need help? 
              <button 
                onClick={() => navigate('/contact')}
                className="ml-1 text-blue-600 hover:text-blue-800 font-medium"
              >
                Contact support
              </button>
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">What you get access to:</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
              <span className="text-sm text-gray-700">All your purchased course videos</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
              <span className="text-sm text-gray-700">Downloadable study materials & PDFs</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
              <span className="text-sm text-gray-700">Progress tracking and certificates</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
              <span className="text-sm text-gray-700">Lifetime access to purchased content</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MembersLogin; 