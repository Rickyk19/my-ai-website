import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpenIcon, 
  PlayIcon, 
  ClockIcon, 
  QuestionMarkCircleIcon,
  TrophyIcon,
  StarIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const QuizDemoPage: React.FC = () => {
  const navigate = useNavigate();

  const courseData = {
    courseName: "Complete Python Programming Masterclass",
    className: "Class 1: Python Fundamentals - Variables and Data Types",
    instructor: "Dr. Python Master",
    duration: "20 weeks",
    level: "Beginner to Advanced",
    price: "₹2,999"
  };

  const quizData = {
    title: "Python Basics - Variables and Data Types",
    totalQuestions: 10,
    timeLimit: 30,
    totalMarks: 100,
    passingPercentage: 70,
    features: [
      "Multiple choice questions with images",
      "True/False questions",
      "Fill-in-the-blank questions",
      "Numerical answer questions",
      "Instant feedback and explanations",
      "Negative marking system",
      "Question navigation and flagging",
      "Pause and resume functionality",
      "Detailed results with grade"
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <BookOpenIcon className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Quiz Integration Demo</h1>
            </div>
            <button
              onClick={() => navigate('/members-dashboard')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Course Context */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How Paid Students Access Quizzes
            </h2>
            <p className="text-gray-600 text-lg">
              This demo shows how quiz functionality is integrated into each course and class
            </p>
          </div>

          {/* Course Card */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 mb-8">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-green-800 mb-2">
                  📚 {courseData.courseName}
                </h3>
                <p className="text-green-700 text-lg mb-4">{courseData.className}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center text-green-700">
                    <span className="mr-2">👨‍🏫</span>
                    {courseData.instructor}
                  </div>
                  <div className="flex items-center text-green-700">
                    <ClockIcon className="h-4 w-4 mr-2" />
                    {courseData.duration}
                  </div>
                  <div className="flex items-center text-green-700">
                    <StarIcon className="h-4 w-4 mr-2" />
                    {courseData.level}
                  </div>
                  <div className="flex items-center text-green-700">
                    <span className="mr-2">💰</span>
                    {courseData.price}
                  </div>
                </div>
              </div>
              
              <div className="ml-6">
                <div className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold">
                  ✅ Purchased
                </div>
              </div>
            </div>
          </div>

          {/* Quiz Integration Points */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Course Level Quiz */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h4 className="text-xl font-bold text-blue-800 mb-4">
                🎯 Course-Level Quiz Access
              </h4>
              <p className="text-blue-700 mb-4">
                Students can access quizzes from the main course modal with a dedicated quiz button.
              </p>
              <div className="bg-white p-4 rounded-lg border border-blue-200">
                <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" clipRule="evenodd"/>
                  </svg>
                  🐍 Python Quiz Demo
                </button>
              </div>
            </div>

            {/* Class Level Quiz */}
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
              <h4 className="text-xl font-bold text-purple-800 mb-4">
                📝 Class-Level Quiz Access
              </h4>
              <p className="text-purple-700 mb-4">
                Each class has its own quiz button for targeted assessment of that specific lesson.
              </p>
              <div className="bg-white p-4 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-semibold">Class 1: Variables & Data Types</h5>
                    <p className="text-sm text-gray-600">⏱️ 45 minutes</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="bg-green-600 text-white px-3 py-1 rounded text-sm">PDF</button>
                    <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded text-sm">🐍 Demo Quiz</button>
                    <button className="bg-red-600 text-white px-3 py-1 rounded text-sm">Watch</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quiz Features */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h4 className="text-xl font-bold text-gray-900 mb-6">🚀 Quiz Features Demonstration</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <QuestionMarkCircleIcon className="h-8 w-8 text-blue-600 mb-2" />
                <h5 className="font-semibold mb-2">{quizData.totalQuestions} Questions</h5>
                <p className="text-sm text-gray-600">Mix of multiple choice, true/false, and fill-in-the-blank</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <ClockIcon className="h-8 w-8 text-green-600 mb-2" />
                <h5 className="font-semibold mb-2">{quizData.timeLimit} Minutes</h5>
                <p className="text-sm text-gray-600">Timed quiz with countdown and auto-submit</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <TrophyIcon className="h-8 w-8 text-yellow-600 mb-2" />
                <h5 className="font-semibold mb-2">{quizData.totalMarks} Marks</h5>
                <p className="text-sm text-gray-600">Pass at {quizData.passingPercentage}% with grading system</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg">
              <h5 className="font-bold text-gray-900 mb-4">✨ Advanced Features</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quizData.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Demo Button */}
          <div className="text-center">
            <button
              onClick={() => navigate('/student-quiz-demo')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
            >
              <PlayIcon className="h-6 w-6 inline mr-2" />
              Experience the Full Quiz Demo
            </button>
            <p className="text-gray-600 mt-4">
              Click above to see exactly how paid students will experience quizzes in your courses
            </p>
          </div>
        </div>

        {/* Integration Instructions */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">🔧 Implementation Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-bold text-gray-800 mb-4">Admin Side (Manage Quizzes)</h4>
              <ul className="space-y-2 text-gray-700">
                <li>• Create quizzes for any course and class</li>
                <li>• Add questions with images and explanations</li>
                <li>• Configure timing, scoring, and difficulty</li>
                <li>• Set negative marking and grading scales</li>
                <li>• Enable advanced features like proctoring</li>
                <li>• View student performance analytics</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold text-gray-800 mb-4">Student Side (Take Quizzes)</h4>
              <ul className="space-y-2 text-gray-700">
                <li>• Access quizzes from course dashboard</li>
                <li>• Read instructions and start when ready</li>
                <li>• Navigate between questions freely</li>
                <li>• Flag questions for review</li>
                <li>• Pause and resume as needed</li>
                <li>• Get instant results and feedback</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="text-lg font-bold text-green-800 mb-2">✅ Ready for Production</h4>
            <p className="text-green-700">
              The quiz system is fully integrated with your course structure and ready to be used by paid students. 
              Each course can have multiple quizzes, and each class can have its own targeted assessment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizDemoPage; 