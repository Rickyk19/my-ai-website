import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  PlayIcon,
  DocumentIcon,
  ClockIcon,
  CheckCircleIcon,
  StarIcon,
  ArrowRightOnRectangleIcon,
  UserIcon,
  AcademicCapIcon,
  ArrowDownTrayIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';

interface MemberData {
  id: number;
  email: string;
  name: string;
  courses: PurchasedCourse[];
  loginTime: string;
}

interface PurchasedCourse {
  id: number;
  course_name: string;
  amount: number;
}

interface CourseDetails {
  id: number;
  name: string;
  description: string;
  video_link?: string;
  instructor: string;
  duration: string;
  level: string;
  prerequisites?: string;
  learning_outcomes?: string;
}

const MembersDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [memberData, setMemberData] = useState<MemberData | null>(null);
  const [courseDetails, setCourseDetails] = useState<CourseDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<CourseDetails | null>(null);
  const [showCourseModal, setShowCourseModal] = useState(false);

  useEffect(() => {
    loadMemberData();
  }, []);

  const loadMemberData = async () => {
    try {
      const memberDataString = localStorage.getItem('memberData');
      if (!memberDataString) {
        navigate('/members-login');
        return;
      }

      const member: MemberData = JSON.parse(memberDataString);
      setMemberData(member);

      // Load detailed course information
      if (member.courses.length > 0) {
        const courseNames = member.courses.map(course => course.course_name);
        
        const { data: courses, error } = await supabase
          .from('courses')
          .select('*')
          .in('name', courseNames);

        if (error) {
          console.error('Error loading course details:', error);
        } else {
          setCourseDetails(courses || []);
        }
      }
    } catch (error) {
      console.error('Error loading member data:', error);
      navigate('/members-login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('memberData');
    navigate('/');
  };

  const handleCourseAccess = (course: CourseDetails) => {
    setSelectedCourse(course);
    setShowCourseModal(true);
  };

  const formatPrerequisites = (prerequisites?: string) => {
    if (!prerequisites) return [];
    return prerequisites.split('|').filter(p => p.trim());
  };

  const formatLearningOutcomes = (outcomes?: string) => {
    if (!outcomes) return [];
    return outcomes.split('|').filter(o => o.trim());
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your courses...</p>
        </div>
      </div>
    );
  }

  if (!memberData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <AcademicCapIcon className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">Members Area</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <UserIcon className="h-5 w-5 text-gray-400" />
                <span className="text-gray-700">{memberData.name || memberData.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-8 mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome back, {memberData.name || 'Student'}! 🎓
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900">Enrolled Courses</h3>
              <p className="text-2xl font-bold text-blue-600">{memberData.courses.length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900">Total Investment</h3>
              <p className="text-2xl font-bold text-green-600">
                ₹{memberData.courses.reduce((sum, course) => sum + course.amount, 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-900">Member Since</h3>
              <p className="text-lg font-bold text-purple-600">
                {new Date(memberData.loginTime).toLocaleDateString()}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courseDetails.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <AcademicCapIcon className="h-6 w-6 text-blue-600" />
                    <span className="text-sm font-medium text-blue-600">{course.level}</span>
                  </div>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    Purchased
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">{course.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{course.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <UserIcon className="h-4 w-4" />
                    <span>{course.instructor}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ClockIcon className="h-4 w-4" />
                    <span>{course.duration}</span>
                  </div>
                </div>
                
                <button
                  onClick={() => handleCourseAccess(course)}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <PlayIcon className="h-5 w-5" />
                  <span>Access Course</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {courseDetails.length === 0 && (
          <div className="text-center py-12">
            <AcademicCapIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Course Details Found</h3>
            <p className="text-gray-600">
              Course information is being updated. Please contact support if this persists.
            </p>
          </div>
        )}
      </div>

      {/* Course Details Modal */}
      {showCourseModal && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{selectedCourse.name}</h2>
              <button
                onClick={() => setShowCourseModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Course Info */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Course Information</h3>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-700">Instructor:</span>
                    <span className="ml-2">{selectedCourse.instructor}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Duration:</span>
                    <span className="ml-2">{selectedCourse.duration}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Level:</span>
                    <span className="ml-2">{selectedCourse.level}</span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedCourse.description}</p>
                </div>
              </div>

              {/* Course Content */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Course Content</h3>
                
                {selectedCourse.video_link && (
                  <div className="mb-6">
                    <a
                      href={selectedCourse.video_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 bg-blue-100 text-blue-700 p-4 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      <PlayIcon className="h-6 w-6" />
                      <span className="font-medium">Watch Course Video</span>
                    </a>
                  </div>
                )}

                <div className="space-y-3">
                  <button className="w-full flex items-center space-x-2 bg-green-100 text-green-700 p-3 rounded-lg hover:bg-green-200 transition-colors">
                    <DocumentIcon className="h-5 w-5" />
                    <span>Download Study Materials</span>
                    <ArrowDownTrayIcon className="h-4 w-4 ml-auto" />
                  </button>
                  
                  <button className="w-full flex items-center space-x-2 bg-purple-100 text-purple-700 p-3 rounded-lg hover:bg-purple-200 transition-colors">
                    <CheckCircleIcon className="h-5 w-5" />
                    <span>View Certificate</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Prerequisites & Learning Outcomes */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold mb-3">Prerequisites</h4>
                {formatPrerequisites(selectedCourse.prerequisites).length > 0 ? (
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {formatPrerequisites(selectedCourse.prerequisites).map((prereq, index) => (
                      <li key={index}>{prereq}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No specific prerequisites</p>
                )}
              </div>

              <div>
                <h4 className="font-semibold mb-3">Learning Outcomes</h4>
                {formatLearningOutcomes(selectedCourse.learning_outcomes).length > 0 ? (
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {formatLearningOutcomes(selectedCourse.learning_outcomes).map((outcome, index) => (
                      <li key={index}>{outcome}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">Learning outcomes will be updated soon</p>
                )}
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <button
                onClick={() => setShowCourseModal(false)}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MembersDashboard; 