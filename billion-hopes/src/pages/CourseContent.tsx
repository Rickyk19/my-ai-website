import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { isPurchased } from '../utils/payment';

interface CourseClass {
  id: number;
  title: string;
  description: string;
  duration: string;
  videoUrl?: string;
  pdfUrl?: string;
  completed: boolean;
}

const CourseContent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const courseId = parseInt(id || '0');
  const [selectedClass, setSelectedClass] = useState<number>(1);
  const [showQuizModal, setShowQuizModal] = useState<boolean>(false);
  const [currentQuizClass, setCurrentQuizClass] = useState<number>(0);

  // Mock course data
  const courseClasses: CourseClass[] = [
    {
      id: 1,
      title: "Introduction to AI Fundamentals",
      description: "Learn the basic concepts and principles of Artificial Intelligence",
      duration: "45 min",
      videoUrl: "https://example.com/video1",
      pdfUrl: "/demo-course-guide.pdf",
      completed: false
    },
    {
      id: 2,
      title: "Machine Learning Basics",
      description: "Understanding supervised and unsupervised learning algorithms",
      duration: "60 min",
      videoUrl: "https://example.com/video2",
      pdfUrl: "/demo-course-guide.pdf",
      completed: false
    },
    {
      id: 3,
      title: "Neural Networks & Deep Learning",
      description: "Dive deep into neural networks and deep learning architectures",
      duration: "75 min",
      videoUrl: "https://example.com/video3",
      pdfUrl: "/demo-course-guide.pdf",
      completed: false
    },
    {
      id: 4,
      title: "AI Ethics & Future Trends",
      description: "Explore ethical considerations and future developments in AI",
      duration: "50 min",
      videoUrl: "https://example.com/video4",
      pdfUrl: "/demo-course-guide.pdf",
      completed: false
    },
    {
      id: 5,
      title: "Practical AI Applications",
      description: "Real-world applications and hands-on projects",
      duration: "90 min",
      videoUrl: "https://example.com/video5",
      pdfUrl: "/demo-course-guide.pdf",
      completed: false
    }
  ];

  useEffect(() => {
    // Redirect if course is not purchased
    if (!isPurchased(courseId)) {
      navigate('/courses');
    }
  }, [courseId, navigate]);

  const handleQuizClick = (classId: number) => {
    setCurrentQuizClass(classId);
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
              navigate('/ai-quizzes');
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
          <h1 className="text-3xl font-bold mb-2">AI Mastery Course</h1>
          <p className="text-blue-100">Complete AI Learning Journey - Members Only</p>
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
              5+ Hours Content
            </span>
          </div>
        </div>

        <div className="flex">
          {/* Class List Sidebar */}
          <div className="w-1/3 bg-gray-50 p-6 border-r">
            <h2 className="text-xl font-semibold mb-4">📚 Course Classes</h2>
            <div className="space-y-3">
              {courseClasses.map((courseClass) => (
                <motion.div
                  key={courseClass.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedClass(courseClass.id)}
                  className={`p-4 rounded-lg cursor-pointer transition-all ${
                    selectedClass === courseClass.id
                      ? 'bg-blue-100 border-2 border-blue-300'
                      : 'bg-white border-2 border-gray-200 hover:border-blue-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-sm">Class {courseClass.id}</h3>
                    <span className="text-xs text-gray-500">{courseClass.duration}</span>
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
            {courseClasses.map((courseClass) => (
              selectedClass === courseClass.id && (
                <motion.div
                  key={courseClass.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-2">
                      Class {courseClass.id}: {courseClass.title}
                    </h2>
                    <p className="text-gray-600 mb-4">{courseClass.description}</p>
                    <div className="flex items-center text-sm text-gray-500 mb-6">
                      <span className="mr-4">⏰ Duration: {courseClass.duration}</span>
                      <span>📈 Difficulty: Intermediate</span>
                    </div>
                  </div>

                  {/* Video Player Placeholder */}
                  <div className="bg-gray-900 rounded-lg aspect-video mb-6 flex items-center justify-center">
                    <div className="text-center text-white">
                      <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
                      </svg>
                      <p className="text-lg">Video Content</p>
                      <p className="text-sm text-gray-300">Click to play</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4 mb-8">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleQuizClick(courseClass.id)}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg flex items-center justify-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" clipRule="evenodd"/>
                      </svg>
                      🧠 Take Quiz
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDownloadPDF(courseClass.pdfUrl!, courseClass.title)}
                      className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition-all shadow-lg flex items-center justify-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"/>
                      </svg>
                      📄 Download PDF
                    </motion.button>
                  </div>

                  {/* Additional Resources */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">📚 Additional Resources</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center text-blue-600 hover:text-blue-700 cursor-pointer">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        Practice Exercises
                      </li>
                      <li className="flex items-center text-blue-600 hover:text-blue-700 cursor-pointer">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        Code Examples
                      </li>
                      <li className="flex items-center text-blue-600 hover:text-blue-700 cursor-pointer">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        Discussion Forum
                      </li>
                    </ul>
                  </div>
                </motion.div>
              )
            ))}
          </div>
        </div>
      </div>

      {/* Quiz Modal */}
      {showQuizModal && <QuizModal />}
    </motion.div>
  );
};

export default CourseContent; 