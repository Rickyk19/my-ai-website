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
import { supabase } from '../utils/supabase';

interface LoginFormData {
  email: string;
  password: string;
}

const MembersLoginDebug: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginFormData>({
    email: 'student@example.com', // Pre-fill for testing
    password: 'test123'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error' | 'info', text: string} | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const testDatabaseConnection = async () => {
    try {
      setMessage({type: 'info', text: 'Testing database connection...'});
      
      // Test basic connection
      const { data: testData, error: testError } = await supabase
        .from('users')
        .select('count')
        .limit(1);

      if (testError) {
        setMessage({type: 'error', text: `Database connection failed: ${testError.message}`});
        return false;
      }

      // Check if users exist
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('*');

      // Check if orders exist
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*');

      // Check if courses exist
      const { data: courses, error: coursesError } = await supabase
        .from('courses')
        .select('*');

      setDebugInfo({
        users: users || [],
        usersError: usersError?.message,
        orders: orders || [],
        ordersError: ordersError?.message,
        courses: courses || [],
        coursesError: coursesError?.message
      });

      setMessage({type: 'info', text: `Found ${users?.length || 0} users, ${orders?.length || 0} orders, ${courses?.length || 0} courses`});
      return true;
    } catch (error: any) {
      setMessage({type: 'error', text: `Connection test failed: ${error.message}`});
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    setDebugInfo(null);

    try {
      setMessage({type: 'info', text: 'Step 1: Checking if user exists...'});
      
      // Check if user exists
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, email, name, status')
        .eq('email', formData.email.toLowerCase())
        .single();

      console.log('User query result:', { userData, userError });

      if (userError) {
        setMessage({type: 'error', text: `User lookup failed: ${userError.message}`});
        setDebugInfo({ userError: userError.message, step: 'user_lookup' });
        return;
      }

      if (!userData) {
        setMessage({type: 'error', text: 'No user found with this email address'});
        setDebugInfo({ message: 'User not found', email: formData.email });
        return;
      }

      setMessage({type: 'info', text: 'Step 2: User found! Checking course purchases...'});

      // Check if user has any course purchases
      const { data: purchaseData, error: purchaseError } = await supabase
        .from('orders')
        .select('id, course_name, amount, status')
        .eq('customer_email', formData.email.toLowerCase())
        .eq('status', 'completed');

      console.log('Purchase query result:', { purchaseData, purchaseError });

      if (purchaseError) {
        setMessage({type: 'error', text: `Purchase lookup failed: ${purchaseError.message}`});
        setDebugInfo({ purchaseError: purchaseError.message, step: 'purchase_lookup' });
        return;
      }

      if (!purchaseData || purchaseData.length === 0) {
        setMessage({type: 'error', text: 'No completed course purchases found for this email'});
        setDebugInfo({ 
          message: 'No purchases found', 
          email: formData.email,
          userData,
          purchaseData: purchaseData || []
        });
        return;
      }

      setMessage({type: 'success', text: `Success! Found ${purchaseData.length} course(s). Redirecting...`});

      // Store user session
      localStorage.setItem('memberData', JSON.stringify({
        id: userData.id,
        email: userData.email,
        name: userData.name,
        courses: purchaseData,
        loginTime: new Date().toISOString()
      }));

      setDebugInfo({
        success: true,
        userData,
        purchaseData,
        coursesCount: purchaseData.length
      });
      
      setTimeout(() => {
        navigate('/members-dashboard');
      }, 2000);

    } catch (error: any) {
      console.error('Login error:', error);
      setMessage({type: 'error', text: `Unexpected error: ${error.message}`});
      setDebugInfo({ unexpectedError: error.message });
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
        className="max-w-2xl w-full space-y-8"
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
            Members Login (Debug Mode)
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Testing database connection and login functionality
          </p>
        </div>

        {/* Test Connection Button */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <button
            onClick={testDatabaseConnection}
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Test Database Connection
          </button>
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
                  : message.type === 'info'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
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
                  Testing Login...
                </div>
              ) : (
                'Test Login'
              )}
            </button>
          </form>
        </div>

        {/* Debug Information */}
        {debugInfo && (
          <div className="bg-gray-900 text-green-400 rounded-xl p-6 text-sm font-mono">
            <h3 className="text-white font-bold mb-4">Debug Information:</h3>
            <pre className="whitespace-pre-wrap overflow-auto max-h-96">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        )}

        {/* Back to Normal Login */}
        <div className="text-center">
          <button
            onClick={() => navigate('/members-login')}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Normal Login
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default MembersLoginDebug; 