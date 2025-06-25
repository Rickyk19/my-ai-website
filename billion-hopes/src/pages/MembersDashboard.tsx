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
  XMarkIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';
import { getMemberPurchases, getQuiz } from '../utils/supabase';

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
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courseClasses, setCourseClasses] = useState<CourseClass[]>([]);
  const [courseComments, setCourseComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);

  // User stats for dashboard
  const userStats = {
    totalXP: 12500,
    studyStreak: 7,
    memberSince: '2024-01-15'
  };

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
        console.log('📚 Raw purchases from database:', result.purchases);
        console.log('📊 Total purchases found:', result.purchases.length);
        
        // Remove duplicate courses by course_name using a simpler approach
        const seenCourseNames = new Set<string>();
        const uniqueCourses: Course[] = [];
        
        for (const course of result.purchases) {
          if (!seenCourseNames.has(course.course_name)) {
            seenCourseNames.add(course.course_name);
            uniqueCourses.push(course);
          } else {
            console.log('🔄 Duplicate course removed:', course.course_name);
          }
        }
        
        console.log('✅ Unique courses after deduplication:', uniqueCourses.length);
        console.log('📋 Unique course names:', uniqueCourses.map(course => course.course_name));
        
        setCourses(uniqueCourses);
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

  const handleLogout = () => {
    localStorage.removeItem('memberData');
    navigate('/');
  };

  const downloadPDF = (pdfUrl: string, courseName: string) => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `${courseName}-guide.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    alert(`Downloading ${courseName} PDF guide...`);
  };

  const downloadCertificate = (courseName: string) => {
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
        if (selectedCourse.course_details?.id) {
          await loadCourseDetails(selectedCourse.course_details.id);
        }
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  const handleQuizClick = async (courseId: number, classNumber: number) => {
    try {
      console.log(`🎯 Checking for quiz: Course ${courseId}, Class ${classNumber}`);
      
      // Check if admin has created a quiz for this specific course/class
      const quizResult = await getQuiz(courseId, classNumber);
      
      if (quizResult.success && quizResult.quiz) {
        // Quiz exists! Navigate to the dynamic quiz interface
        console.log('✅ Quiz found! Redirecting to quiz interface...');
        navigate(`/course/${courseId}/class/${classNumber}/quiz`);
      } else {
        // No quiz found, show fallback or demo
        console.log('❌ No quiz found for this class. Showing demo...');
        if (selectedCourse?.course_name.toLowerCase().includes('python') && classNumber === 1) {
          navigate('/student-quiz-demo');
        } else {
          alert(`No quiz available for Class ${classNumber} yet. The instructor hasn't created one.`);
        }
      }
      
      setShowModal(false);
    } catch (error) {
      console.error('Error checking for quiz:', error);
      alert('Error loading quiz. Please try again.');
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!memberData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">Please log in to access your dashboard.</p>
          <button
            onClick={() => navigate('/members-login')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const totalInvestment = courses.reduce((sum, course) => sum + course.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {memberData.name}! 🎓
              </h1>
              <p className="text-gray-600">Ready to continue your AI learning journey?</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-red-600 transition-colors font-medium"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Simple Navigation */}
          <nav className="flex space-x-1 bg-gray-100 p-1 rounded-xl mb-4">
            <div className="flex-1 flex items-center justify-center py-3 px-4 rounded-lg font-medium bg-white text-blue-600 shadow-md">
              <AcademicCapIcon className="h-5 w-5 mr-2" />
              My Courses Dashboard
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <AcademicCapIcon className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{courses.length}</span>
            </div>
            <h3 className="font-semibold text-gray-900">Enrolled Courses</h3>
            <p className="text-gray-600 text-sm">Total courses purchased</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <TrophyIcon className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{(userStats.totalXP || 0).toLocaleString()}</span>
            </div>
            <h3 className="font-semibold text-gray-900">Total XP</h3>
            <p className="text-gray-600 text-sm">Experience points earned</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <ClockIcon className="h-6 w-6 text-orange-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{userStats.studyStreak}</span>
            </div>
            <h3 className="font-semibold text-gray-900">Study Streak</h3>
            <p className="text-gray-600 text-sm">Days in a row</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <CalendarIcon className="h-6 w-6 text-purple-600" />
              </div>
              <span className="text-sm font-bold text-gray-900">
                ₹{(totalInvestment || 0).toLocaleString()}
              </span>
            </div>
            <h3 className="font-semibold text-gray-900">Total Investment</h3>
            <p className="text-gray-600 text-sm">Course value</p>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <AcademicCapIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
              <p className="text-gray-600 mb-4">You haven't purchased any courses yet.</p>
            </div>
          ) : (
            courses.map((course) => (
              <motion.div
                key={course.id}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden h-full"
              >
                <div className="p-6 h-full flex flex-col">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900 leading-tight">{course.course_name}</h3>
                    <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium whitespace-nowrap ml-2">
                      Purchased
                    </span>
                  </div>
                  
                  {/* Description */}
                  <p className="text-gray-600 mb-6 flex-grow min-h-[3rem]">
                    {course.course_details?.description || 'Complete course with comprehensive materials and certification.'}
                  </p>
                  
                  {/* Course Details */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-gray-600">
                      <UserIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{course.course_details?.instructor || 'Expert Instructor'}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <ClockIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{course.course_details?.duration || '8-12 hours'}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <AcademicCapIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{course.course_details?.level || 'Intermediate'}</span>
                    </div>
                  </div>

                  {/* Action Buttons - Always at bottom */}
                  <div className="flex space-x-3 mt-auto">
                    <button
                      onClick={() => openCourseModal(course)}
                      className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center min-h-[48px]"
                    >
                      <PlayIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="truncate">Start Learning</span>
                    </button>
                    
                    {course.course_details?.demo_pdf_url && (
                      <button
                        onClick={() => downloadPDF(course.course_details!.demo_pdf_url, course.course_name)}
                        className="bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center min-h-[48px]"
                      >
                        <DocumentArrowDownIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </main>

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
                        <span>💰 ₹{(selectedCourse.amount || 0).toLocaleString()}</span>
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

                {/* Action Buttons - Only Certificate */}
                <div className="flex gap-4 mb-6">
                  {selectedCourse.course_details?.certificate_available && (
                    <button
                      onClick={() => {
                        // TODO: Check if all classes completed before allowing certificate download
                        const allClassesCompleted = false; // This should be calculated based on actual progress
                        if (allClassesCompleted) {
                          downloadCertificate(selectedCourse.course_name);
                        } else {
                          alert('Complete all classes to unlock your certificate!');
                        }
                      }}
                      className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                        false // Replace with actual completion check
                          ? 'bg-purple-600 text-white hover:bg-purple-700 cursor-pointer'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      disabled={true} // Enable when course completion logic is implemented
                    >
                      <AcademicCapIcon className="h-5 w-5" />
                      Get Certificate
                      {!false && <span className="text-xs ml-2">(Complete all classes)</span>}
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
                            <button
                              onClick={() => {
                                navigate(`/course/${selectedCourse.course_details?.id}/class/${classItem.class_number}`);
                                setShowModal(false);
                              }}
                              className="text-left w-full group"
                            >
                              <h4 className="font-semibold text-blue-600 group-hover:text-blue-800 transition-colors cursor-pointer">
                                {classItem.title.startsWith(`Class ${classItem.class_number}:`) ? classItem.title : `Class ${classItem.class_number}: ${classItem.title}`}
                              </h4>
                              <p className="text-gray-600 text-sm mt-1">{classItem.description}</p>
                              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                <span>⏱️ {classItem.duration_minutes} minutes</span>
                                <span className="text-blue-500 text-xs">👆 Click to open class</span>
                              </div>
                            </button>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => {
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
                              onClick={() => handleQuizClick(selectedCourse.course_details?.id || selectedCourse.id, classItem.class_number)}
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

                  <div className="space-y-4">
                    {courseComments.map((comment) => (
                      <div key={comment.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h5 className="font-semibold text-gray-900">{comment.user_name}</h5>
                            <div className="flex items-center gap-2">
                              {renderStars(comment.rating)}
                              <span className="text-sm text-gray-500">
                                {new Date(comment.created_at).toLocaleDateString()}
                              </span>
                            </div>
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
