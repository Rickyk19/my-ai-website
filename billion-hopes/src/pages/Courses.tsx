import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AcademicCapIcon, 
  StarIcon,
  ClockIcon,
  UserIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  XMarkIcon,
  CheckCircleIcon,
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

interface Course {
  id: number;
  name: string;
  description: string;
  price: number;
  instructor: string;
  duration: string;
  level: string;
  certificate_available: boolean;
  image_url?: string;
}

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [priceRange, setPriceRange] = useState('All');

  // Purchase form state
  const [purchaseForm, setPurchaseForm] = useState({
    name: '',
    email: '',
    phone: '',
    paymentMethod: 'card'
  });
  const [purchaseStatus, setPurchaseStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const response = await fetch('https://ahvxqultshujqtmbkjpy.supabase.co/rest/v1/courses?select=*&order=price.asc', {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ',
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      }
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openPurchaseModal = (course: Course) => {
    setSelectedCourse(course);
    setShowPurchaseModal(true);
    setPurchaseStatus({ type: null, message: '' });
  };

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !purchaseForm.name || !purchaseForm.email) {
      setPurchaseStatus({ type: 'error', message: 'Please fill in all required fields.' });
      return;
    }

    try {
      // Create order record
      const orderResponse = await fetch('https://ahvxqultshujqtmbkjpy.supabase.co/rest/v1/orders', {
        method: 'POST',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          course_name: selectedCourse.name,
          course_id: selectedCourse.id,
          amount: selectedCourse.price,
          customer_name: purchaseForm.name,
          customer_email: purchaseForm.email,
          status: 'completed', // In real app, this would be 'pending' until payment confirmation
          transaction_id: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        })
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create order');
      }

      // Create or update user record
      const userResponse = await fetch('https://ahvxqultshujqtmbkjpy.supabase.co/rest/v1/users', {
        method: 'POST',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ',
          'Content-Type': 'application/json',
          'Prefer': 'resolution=ignore-duplicates'
        },
        body: JSON.stringify({
          name: purchaseForm.name,
          email: purchaseForm.email
        })
      });

      setPurchaseStatus({
        type: 'success',
        message: `🎉 Purchase successful! You can now access "${selectedCourse.name}" in your Members Area. Login with email: ${purchaseForm.email}`
      });

      // Reset form
      setPurchaseForm({
        name: '',
        email: '',
        phone: '',
        paymentMethod: 'card'
      });

    } catch (error: any) {
      setPurchaseStatus({
        type: 'error',
        message: `Purchase failed: ${error.message}`
      });
    }
  };

  // Filter courses based on search and filters
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === 'All' || course.level === selectedLevel;
    const matchesPrice = priceRange === 'All' || 
                        (priceRange === 'Under 5000' && course.price < 5000) ||
                        (priceRange === '5000-7000' && course.price >= 5000 && course.price <= 7000) ||
                        (priceRange === 'Above 7000' && course.price > 7000);
    
    return matchesSearch && matchesLevel && matchesPrice;
  });

  const renderStars = (rating: number = 5) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarSolidIcon
            key={star}
            className={`h-4 w-4 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Amazing Header Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 text-white py-16">
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
          <motion.div
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/3 right-1/3 w-16 h-16 bg-pink-400 opacity-40 rounded-full"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Main Heading with Animation */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <div className="flex justify-center items-center gap-3 mb-6">
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <AcademicCapIcon className="h-16 w-16 text-yellow-300" />
                </motion.div>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200 bg-clip-text text-transparent">
                  EXPLORE OUR COURSES
                </h1>
                <motion.div
                  animate={{ rotate: [0, -15, 15, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                >
                  <StarSolidIcon className="h-16 w-16 text-pink-300" />
                </motion.div>
              </div>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-2xl md:text-3xl font-bold text-yellow-100 mb-4"
              >
                🎓 Professional Courses to Advance Your Career!
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="text-lg md:text-xl text-white/90 max-w-4xl mx-auto"
              >
                Discover premium courses designed by industry experts. Purchase any course and get lifetime access in your Members Area with certificates, projects, and community support!
              </motion.p>
            </motion.div>

            {/* Enhanced Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
            >
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <AcademicCapIcon className="h-8 w-8 text-yellow-300" />
                  </motion.div>
                  <span className="text-3xl font-bold text-white">20+</span>
                </div>
                <p className="text-white/90 font-semibold">Expert Courses</p>
              </div>
              
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  >
                    <PlayIcon className="h-8 w-8 text-pink-300" />
                  </motion.div>
                  <span className="text-3xl font-bold text-white">200+</span>
                </div>
                <p className="text-white/90 font-semibold">HD Videos</p>
              </div>
              
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                      >
                        <StarSolidIcon className="h-6 w-6 text-yellow-400" />
                      </motion.div>
                    ))}
                  </div>
                </div>
                <p className="text-white/90 font-semibold">5-Star Rated</p>
              </div>
              
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  >
                    <CheckCircleIcon className="h-8 w-8 text-green-300" />
                  </motion.div>
                  <span className="text-3xl font-bold text-white">∞</span>
                </div>
                <p className="text-white/90 font-semibold">Lifetime Access</p>
              </div>
            </motion.div>

            {/* Investment Value */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.8 }}
              className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 max-w-2xl mx-auto"
            >
              <p className="text-white font-bold text-2xl mb-2">
                💎 Total Course Library Value: ₹1,25,976
              </p>
              <p className="text-white/90 text-lg">
                Individual courses starting from ₹2,499 - Invest in your future today!
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Courses</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by course or instructor..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="All">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Beginner to Advanced">Beginner to Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="All">All Prices</option>
                <option value="Under 5000">Under ₹5,000</option>
                <option value="5000-7000">₹5,000 - ₹7,000</option>
                <option value="Above 7000">Above ₹7,000</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedLevel('All');
                  setPriceRange('All');
                }}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredCourses.length} of {courses.length} courses
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow h-full flex flex-col"
            >
              <div className="p-6 flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                  <AcademicCapIcon className="h-8 w-8 text-blue-600" />
                  <span className="text-sm font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded">
                    {course.level}
                  </span>
                </div>
                
                <h3 className="font-bold text-xl text-gray-900 mb-3 line-clamp-2">
                  {course.name}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {course.description}
                </p>
                
                <div className="space-y-2 text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <UserIcon className="h-4 w-4 mr-2" />
                    {course.instructor}
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="h-4 w-4 mr-2" />
                    {course.duration}
                  </div>
                  <div className="flex items-center">
                    <StarIcon className="h-4 w-4 mr-2" />
                    {renderStars()}
                    <span className="ml-2 text-xs">(4.8/5)</span>
                  </div>
                </div>

                {/* Certificate badge with consistent spacing */}
                <div className="mb-4 h-6 flex items-center">
                  {course.certificate_available && (
                    <div className="flex items-center text-sm text-green-600">
                      <CheckCircleIcon className="h-4 w-4 mr-1" />
                      Certificate Included
                    </div>
                  )}
                </div>
                
                {/* Spacer to push content to bottom */}
                <div className="flex-grow"></div>
                
                {/* Price and Purchase Button - Always at bottom */}
                <div className="border-t pt-4 mt-auto">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">₹{(course.price || 0).toLocaleString()}</span>
                      <span className="text-sm text-gray-500 ml-2">One-time payment</span>
                    </div>
                  </div>
                  <button
                    onClick={() => openPurchaseModal(course)}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingCartIcon className="h-5 w-5" />
                    Purchase Course
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">No courses match your search criteria.</p>
          </div>
        )}
      </div>

      {/* Purchase Modal */}
      <AnimatePresence>
        {showPurchaseModal && selectedCourse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowPurchaseModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Purchase Course</h2>
                    <h3 className="text-lg text-gray-700">{selectedCourse.name}</h3>
                    <p className="text-xl font-bold text-blue-600 mt-2">₹{(selectedCourse.price || 0).toLocaleString()}</p>
                  </div>
                  <button
                    onClick={() => setShowPurchaseModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {purchaseStatus.type && (
                  <div
                    className={`mb-6 p-4 rounded-lg ${
                      purchaseStatus.type === 'success'
                        ? 'bg-green-100 border border-green-400 text-green-700'
                        : 'bg-red-100 border border-red-400 text-red-700'
                    }`}
                  >
                    {purchaseStatus.message}
                  </div>
                )}

                <form onSubmit={handlePurchase} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={purchaseForm.name}
                      onChange={(e) => setPurchaseForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={purchaseForm.email}
                      onChange={(e) => setPurchaseForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your email (for Members Area access)"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={purchaseForm.phone}
                      onChange={(e) => setPurchaseForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Method
                    </label>
                    <select
                      value={purchaseForm.paymentMethod}
                      onChange={(e) => setPurchaseForm(prev => ({ ...prev, paymentMethod: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="card">Credit/Debit Card</option>
                      <option value="upi">UPI</option>
                      <option value="netbanking">Net Banking</option>
                      <option value="wallet">Digital Wallet</option>
                    </select>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">What You'll Get:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>✅ Lifetime access to course content</li>
                      <li>✅ Video lectures by expert instructors</li>
                      <li>✅ Downloadable resources and materials</li>
                      <li>✅ Certificate of completion</li>
                      <li>✅ Access to student community</li>
                    </ul>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-3 px-4 rounded font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <CurrencyDollarIcon className="h-5 w-5" />
                    Complete Purchase - ₹{(selectedCourse.price || 0).toLocaleString()}
                  </button>

                  <p className="text-xs text-gray-500 text-center">
                    By purchasing, you agree to our Terms of Service and Privacy Policy.
                    You'll receive login details via email to access your Members Area.
                  </p>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Courses; 
