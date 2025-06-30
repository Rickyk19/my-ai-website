import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { isPurchased } from '../utils/payment';
import { getCourseClasses, getCourses } from '../utils/supabase';

interface CourseClass {
  id: number;
  course_id: number;
  class_number: number;
  title: string;
  description: string;
  duration_minutes?: number;
  video_url?: string;
  pdf_materials?: string[];
  learning_objectives?: string[];
  prerequisites?: string[];
  quiz_files?: string[];
  assignment_files?: string[];
  completed?: boolean;
}

interface Course {
  id: number;
  name: string;
  description: string;
  instructor?: string;
  duration?: string;
  price?: number;
}

const CourseContent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const courseId = parseInt(id || '0');
  const [selectedClass, setSelectedClass] = useState<number>(1);
  const [showQuizModal, setShowQuizModal] = useState<boolean>(false);
  const [currentQuizClass, setCurrentQuizClass] = useState<number>(0);
  const [courseClasses, setCourseClasses] = useState<CourseClass[]>([]);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Redirect if course is not purchased
    if (!isPurchased(courseId)) {
      navigate('/courses');
      return;
    }

    loadCourseData();
  }, [courseId, navigate]);

  const loadCourseData = async () => {
    try {
      setLoading(true);
      setError('');

      // Load course details
      const coursesResult = await getCourses();
      if (coursesResult.success) {
        const foundCourse = coursesResult.courses.find((c: Course) => c.id === courseId);
        if (foundCourse) {
          setCourse(foundCourse);
        } else {
          setError('Course not found');
          return;
        }
      }

      // Load course classes
      const classesResult = await getCourseClasses(courseId);
      if (classesResult.success) {
        const classes = classesResult.classes.map((cls: any) => ({
          ...cls,
          completed: false, // You can implement completion tracking later
          duration: cls.duration_minutes ? `${cls.duration_minutes} min` : '45 min'
        }));
        
        setCourseClasses(classes);
        
        // Set first class as selected by default
        if (classes.length > 0) {
          setSelectedClass(classes[0].class_number);
        }
      } else {
        console.error('Failed to load course classes:', classesResult.error);
        setError('Failed to load course content');
      }

    } catch (error) {
      console.error('Error loading course data:', error);
      setError('Failed to load course data');
    } finally {
      setLoading(false);
    }
  };

  const handleQuizClick = (classNumber: number) => {
    setCurrentQuizClass(classNumber);
    setShowQuizModal(true);
  };

  const handleDownloadPDF = (pdfUrl: string, title: string) => {
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `${title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getSelectedClassData = () => {
    return courseClasses.find(cls => cls.class_number === selectedClass);
  };

  const QuizModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl p-8 max-w-md w-full mx-4"
      >
        <h3 className="text-2xl font-bold mb-4">🧠 Class Quiz</h3>
        <p className="text-gray-600 mb-6">
          Ready to test your knowledge from Class {currentQuizClass}?
        </p>
        <div className="flex space-x-4">
          <button
            onClick={() => {
              setShowQuizModal(false);
              navigate(`/student-quiz?course=${courseId}&class=${currentQuizClass}`);
            }}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Quiz 🚀
          </button>
          <button
            onClick={() => setShowQuizModal(false)}
            className="flex-1 bg-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading course content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Course</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/courses')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  const selectedClassData = getSelectedClassData();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Course Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
          <h1 className="text-3xl font-bold mb-2">{course?.name || 'Course'}</h1>
          <p className="text-blue-100">{course?.description || 'Complete Learning Journey - Members Only'}</p>
          <div className="mt-4 flex items-center space-x-6">
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
              </svg>
              {courseClasses.length} Classes
            </span>
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
              </svg>
              {course?.duration || 'Multiple Hours'} Content
            </span>
            {course?.instructor && (
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                </svg>
                {course.instructor}
              </span>
            )}
          </div>
        </div>

        <div className="flex">
          {/* Class List Sidebar */}
          <div className="w-1/3 bg-gray-50 p-6 border-r">
            <h2 className="text-xl font-semibold mb-4">📚 Course Classes</h2>
            <div className="space-y-3">
              {courseClasses.map((courseClass) => (
                <motion.div
                  key={courseClass.class_number}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedClass(courseClass.class_number)}
                  className={`p-4 rounded-lg cursor-pointer transition-all ${
                    selectedClass === courseClass.class_number
                      ? 'bg-blue-100 border-2 border-blue-300'
                      : 'bg-white border-2 border-gray-200 hover:border-blue-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-sm">Class {courseClass.class_number}</h3>
                    <span className="text-xs text-gray-500">
                      {courseClass.duration_minutes ? `${courseClass.duration_minutes} min` : '45 min'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{courseClass.title}</p>
                  {courseClass.completed && (
                    <div className="mt-2">
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        ✅ Completed
                      </span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-8">
            {selectedClassData ? (
              <motion.div
                key={selectedClassData.class_number}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">
                    Class {selectedClassData.class_number}: {selectedClassData.title}
                  </h2>
                  <p className="text-gray-600 mb-4">{selectedClassData.description}</p>

                  {/* Learning Objectives */}
                  {selectedClassData.learning_objectives && selectedClassData.learning_objectives.length > 0 && (
                    <div className="mb-4">
                      <h3 className="font-semibold mb-2">🎯 Learning Objectives:</h3>
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        {selectedClassData.learning_objectives.map((objective, index) => (
                          <li key={index}>{objective}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Prerequisites */}
                  {selectedClassData.prerequisites && selectedClassData.prerequisites.length > 0 && (
                    <div className="mb-6">
                      <h3 className="font-semibold mb-2">📋 Prerequisites:</h3>
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        {selectedClassData.prerequisites.map((prerequisite, index) => (
                          <li key={index}>{prerequisite}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Video Section */}
                {selectedClassData.video_url && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4">🎥 Class Video</h3>
                    <div className="bg-gray-100 rounded-lg p-8 text-center">
                      <div className="mb-4">
                        <svg className="w-16 h-16 mx-auto text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
                        </svg>
                      </div>
                      <p className="text-gray-600 mb-4">Video content will be available here</p>
                      <a 
                        href={selectedClassData.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
                      >
                        Watch Video 📺
                      </a>
                    </div>
                  </div>
                )}

                {/* Materials Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* PDF Materials */}
                  {selectedClassData.pdf_materials && selectedClassData.pdf_materials.length > 0 && (
                    <div className="bg-blue-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        📄 Course Materials
                      </h3>
                      <div className="space-y-2">
                        {selectedClassData.pdf_materials.map((pdf, index) => (
                          <button
                            key={index}
                            onClick={() => handleDownloadPDF(`/demo-course-guide.pdf`, pdf)}
                            className="w-full text-left p-3 bg-white rounded-lg hover:bg-blue-100 transition-colors flex items-center"
                          >
                            <svg className="w-5 h-5 mr-3 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"/>
                            </svg>
                            <span className="text-sm">{pdf}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quiz Section */}
                  <div className="bg-purple-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      🧠 Class Quiz
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Test your understanding of this class material
                    </p>
                    <button
                      onClick={() => handleQuizClick(selectedClassData.class_number)}
                      className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Take Quiz 🚀
                    </button>
                  </div>
                </div>

                {/* Assignment Files */}
                {selectedClassData.assignment_files && selectedClassData.assignment_files.length > 0 && (
                  <div className="bg-green-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      📝 Assignments
                    </h3>
                    <div className="space-y-2">
                      {selectedClassData.assignment_files.map((assignment, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg">
                          <span className="text-sm">{assignment}</span>
                          <button className="text-green-600 hover:text-green-700 font-medium">
                            Download
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">Select a class to view its content</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showQuizModal && <QuizModal />}
    </motion.div>
  );
};

export default CourseContent; 