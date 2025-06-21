import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AcademicCapIcon, 
  PlayIcon,
  DocumentArrowDownIcon,
  StarIcon,
  ClockIcon,
  UserIcon,
  CalendarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ChatBubbleLeftRightIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';
import { getMemberPurchases } from '../utils/supabase';

interface Course {
  id: number;
  course_name: string;
  amount: number;
  course_details?: {
    id: number;
    name: string;
    description: string;
    instructor: string;
    duration: string;
    level: string;
    certificate_available: boolean;
    demo_pdf_url: string;
  };
}

interface CourseClass {
  id: number;
  class_number: number;
  title: string;
  description: string;
  video_url: string;
  duration_minutes: number;
}

interface Comment {
  id: number;
  user_name: string;
  comment: string;
  rating: number;
  created_at: string;
}

const MembersDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [memberData, setMemberData] = useState<any>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [expandedCourse, setExpandedCourse] = useState<number | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courseClasses, setCourseClasses] = useState<CourseClass[]>([]);
  const [courseComments, setCourseComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);

  useEffect(() => {
    loadMemberData();
  }, []);

  const loadMemberData = async () => {
    try {
      const stored = localStorage.getItem('memberData');
      if (!stored) {
        navigate('/members-login');
        return;
      }

      const data = JSON.parse(stored);
      setMemberData(data);

      // Get fresh purchases data with course details
      const result = await getMemberPurchases(data.email);
      if (result.success) {
        setCourses(result.purchases);
      }
    } catch (error) {
      console.error('Error loading member data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCourseDetails = async (courseId: number) => {
    try {
      // Load course classes
      const classesResponse = await fetch(`https://ahvxqultshujqtmbkjpy.supabase.co/rest/v1/course_classes?select=*&course_id=eq.${courseId}&order=class_number`, {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ',
        }
      });
      
      if (classesResponse.ok) {
        const classes = await classesResponse.json();
        setCourseClasses(classes);
      }

      // Load course comments
      const commentsResponse = await fetch(`https://ahvxqultshujqtmbkjpy.supabase.co/rest/v1/course_comments?select=*&course_id=eq.${courseId}&order=created_at.desc`, {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ',
        }
      });
      
      if (commentsResponse.ok) {
        const comments = await commentsResponse.json();
        setCourseComments(comments);
      }
    } catch (error) {
      console.error('Error loading course details:', error);
    }
  };

  const openCourseModal = async (course: Course) => {
    setSelectedCourse(course);
    setShowModal(true);
    if (course.course_details?.id) {
      await loadCourseDetails(course.course_details.id);
    }
  };

  const toggleCourseExpansion = (courseId: number) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
  };

  const handleLogout = () => {
    localStorage.removeItem('memberData');
    navigate('/');
  };

  const downloadPDF = (pdfUrl: string, courseName: string) => {
    // In a real app, this would download the actual PDF
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `${courseName}-guide.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // For demo, show alert
    alert(`Downloading ${courseName} PDF guide...`);
  };

  const downloadCertificate = (courseName: string) => {
    // For demo, show alert
    alert(`Downloading certificate for ${courseName}...`);
  };

  const submitComment = async () => {
    if (!newComment.trim() || !selectedCourse || !memberData) return;

    try {
      const response = await fetch('https://ahvxqultshujqtmbkjpy.supabase.co/rest/v1/course_comments', {
        method: 'POST',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          course_id: selectedCourse.course_details?.id,
          user_email: memberData.email,
          user_name: memberData.name,
          comment: newComment,
          rating: newRating
        })
      });

      if (response.ok) {
        setNewComment('');
        setNewRating(5);
        // Reload comments
        if (selectedCourse.course_details?.id) {
          await loadCourseDetails(selectedCourse.course_details.id);
        }
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  const renderStars = (rating: number, interactive = false, onClick?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => interactive && onClick?.(star)}
            className={interactive ? 'cursor-pointer' : ''}
            disabled={!interactive}
          >
            {star <= rating ? (
              <StarSolidIcon className="h-5 w-5 text-yellow-400" />
            ) : (
              <StarIcon className="h-5 w-5 text-gray-300" />
            )}
          </button>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const totalInvestment = courses.reduce((sum, course) => sum + course.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <AcademicCapIcon className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">Members Area</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-700">👤 {memberData?.name}</span>
              <button
                onClick={handleLogout}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 mb-8 text-white"
        >
          <h2 className="text-3xl font-bold mb-4">Welcome back, {memberData?.name}! 🎓</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/20 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Enrolled Courses</h3>
              <p className="text-2xl font-bold">{courses.length}</p>
            </div>
            <div className="bg-white/20 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Total Investment</h3>
              <p className="text-2xl font-bold">₹{totalInvestment.toLocaleString()}</p>
            </div>
            <div className="bg-white/20 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Member Since</h3>
              <p className="text-2xl font-bold">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </motion.div>

        {/* Course Library */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Course Library</h3>
          
          {courses.length === 0 ? (
            <div className="text-center py-8">
              <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">No courses found. Please check your purchases.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course, index) => (
                <motion.div
                  key={course.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col"
                  onClick={() => openCourseModal(course)}
                >
                  <div className="p-6 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-4">
                      <AcademicCapIcon className="h-8 w-8 text-blue-600" />
                      <span className="text-sm font-semibold text-green-600 bg-green-100 px-2 py-1 rounded">
                        ₹{course.amount.toLocaleString()}
                      </span>
                    </div>
                    
                    <h4 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                      {course.course_name}
                    </h4>
                    
                    {/* Course details with consistent spacing */}
                    <div className="flex-grow">
                      {course.course_details ? (
                        <>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                            {course.course_details.description}
                          </p>
                          
                          <div className="space-y-2 text-sm text-gray-500">
                            <div className="flex items-center">
                              <UserIcon className="h-4 w-4 mr-2" />
                              {course.course_details.instructor}
                            </div>
                            <div className="flex items-center">
                              <ClockIcon className="h-4 w-4 mr-2" />
                              {course.course_details.duration}
                            </div>
                            <div className="flex items-center">
                              <StarIcon className="h-4 w-4 mr-2" />
                              {course.course_details.level}
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="text-gray-500 text-sm mb-3">
                          Course details loading...
                        </div>
                      )}
                    </div>
                    
                    {/* Access Course Button - Always at bottom */}
                    <div className="mt-4 pt-4 border-t border-gray-200 mt-auto">
                      <button className="w-full bg-blue-600 text-white py-2 px-4 rounded font-medium hover:bg-blue-700 transition-colors">
                        Access Course
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Course Modal */}
      <AnimatePresence>
        {showModal && selectedCourse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                {/* Modal Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {selectedCourse.course_name}
                    </h2>
                    {selectedCourse.course_details && (
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <span>👨‍🏫 {selectedCourse.course_details.instructor}</span>
                        <span>⏱️ {selectedCourse.course_details.duration}</span>
                        <span>📊 {selectedCourse.course_details.level}</span>
                        <span>💰 ₹{selectedCourse.amount.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 mb-6">
                  {selectedCourse.course_details?.demo_pdf_url && (
                    <button
                      onClick={() => downloadPDF(selectedCourse.course_details!.demo_pdf_url, selectedCourse.course_name)}
                      className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      <DocumentArrowDownIcon className="h-5 w-5" />
                      Download PDF
                    </button>
                  )}
                  {/* Quiz Button - Always available for all courses */}
                  <button
                    onClick={() => {
                      // Navigate to Python quiz demo if it's a Python course, otherwise general quiz
                      if (selectedCourse.course_name.toLowerCase().includes('python')) {
                        navigate('/student-quiz-demo');
                      } else {
                        navigate('/ai-quizzes');
                      }
                      setShowModal(false);
                    }}
                    className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded hover:from-purple-700 hover:to-pink-700 transition-all"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" clipRule="evenodd"/>
                    </svg>
                    Quiz
                  </button>
                  {selectedCourse.course_details?.certificate_available && (
                    <button
                      onClick={() => downloadCertificate(selectedCourse.course_name)}
                      className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                    >
                      <AcademicCapIcon className="h-5 w-5" />
                      Get Certificate
                    </button>
                  )}
                </div>

                {/* Course Classes */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4">Course Content</h3>
                  <div className="space-y-3">
                    {courseClasses.map((classItem) => (
                      <div key={classItem.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">
                              Class {classItem.class_number}: {classItem.title}
                            </h4>
                            <p className="text-gray-600 text-sm mt-1">{classItem.description}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                              <span>⏱️ {classItem.duration_minutes} minutes</span>
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => {
                                // Download PDF for this specific class
                                const link = document.createElement('a');
                                link.href = '/demo-course-guide.pdf';
                                link.download = `Class-${classItem.class_number}-${classItem.title}.pdf`;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                              }}
                              className="flex items-center gap-1 bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 text-sm"
                            >
                              <DocumentArrowDownIcon className="h-4 w-4" />
                              PDF
                            </button>
                            <button
                              onClick={() => {
                                // Navigate to Python quiz demo if it's a Python course and Class 1, otherwise general quiz
                                if (selectedCourse.course_name.toLowerCase().includes('python') && classItem.class_number === 1) {
                                  navigate('/student-quiz-demo');
                                } else {
                                  navigate('/ai-quizzes');
                                }
                                setShowModal(false);
                              }}
                              className="flex items-center gap-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-2 rounded hover:from-purple-700 hover:to-pink-700 text-sm"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" clipRule="evenodd"/>
                              </svg>
                              Quiz
                            </button>
                            <a
                              href={classItem.video_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 text-sm"
                            >
                              <PlayIcon className="h-4 w-4" />
                              Watch
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Comments Section */}
                <div className="border-t pt-6">
                  <h3 className="text-xl font-bold mb-4">Student Reviews</h3>
                  
                  {/* Add Comment */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold mb-3">Share Your Experience</h4>
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                      {renderStars(newRating, true, setNewRating)}
                    </div>
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write your review..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                    />
                    <button
                      onClick={submitComment}
                      className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Submit Review
                    </button>
                  </div>

                  {/* Comments List */}
                  <div className="space-y-4">
                    {courseComments.map((comment) => (
                      <div key={comment.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                              {comment.user_name.charAt(0)}
                            </div>
                            <span className="font-semibold">{comment.user_name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {renderStars(comment.rating)}
                            <span className="text-sm text-gray-500">
                              {new Date(comment.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-700">{comment.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MembersDashboard; 