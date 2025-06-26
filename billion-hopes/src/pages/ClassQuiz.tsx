import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  TrophyIcon,
  BookOpenIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { trackQuizActivity, trackCourseActivity } from '../services/activityTracker';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizData {
  title: string;
  description: string;
  timeLimit: number; // in minutes
  questions: Question[];
}

const ClassQuiz: React.FC = () => {
  const { courseId, classNumber } = useParams();
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);

  useEffect(() => {
    loadQuizData();
  }, [courseId, classNumber]);

  useEffect(() => {
    if (quizStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && quizStarted) {
      handleSubmitQuiz();
    }
  }, [timeLeft, quizStarted]);

  const loadQuizData = () => {
    const courseIdNum = parseInt(courseId || '1');
    const classNum = parseInt(classNumber || '1');

    // Class-specific quiz data
    const quizzes: { [key: string]: QuizData } = {
      '1-1': { // Python Course - Class 1
        title: 'Python Basics & Setup Quiz',
        description: 'Test your understanding of Python installation and basic concepts',
        timeLimit: 10,
        questions: [
          {
            id: 1,
            question: 'What is Python?',
            options: [
              'A type of snake',
              'A high-level programming language',
              'A web browser',
              'A database system'
            ],
            correctAnswer: 1,
            explanation: 'Python is a high-level, interpreted programming language known for its simplicity and readability.'
          },
          {
            id: 2,
            question: 'Which command is used to install Python packages?',
            options: ['install', 'pip install', 'python install', 'get'],
            correctAnswer: 1,
            explanation: 'pip install is the correct command to install Python packages from the Python Package Index (PyPI).'
          }
        ]
      },
      '1-2': { // Python Course - Class 2: Variables & Data Types
        title: 'Variables & Data Types Quiz',
        description: 'Test your knowledge of Python variables, data types, and basic operations',
        timeLimit: 15,
        questions: [
          {
            id: 1,
            question: 'Which of the following is the correct way to declare a variable in Python?',
            options: [
              'var name = "John"',
              'name = "John"',
              'string name = "John"',
              'declare name = "John"'
            ],
            correctAnswer: 1,
            explanation: 'In Python, you simply assign a value to a variable name without declaring its type explicitly. Python is dynamically typed.'
          },
          {
            id: 2,
            question: 'What data type would the expression type(5.0) return?',
            options: ['int', 'float', 'double', 'number'],
            correctAnswer: 1,
            explanation: 'The value 5.0 contains a decimal point, making it a float (floating-point number) in Python.'
          },
          {
            id: 3,
            question: 'Which method is used to convert a string to an integer in Python?',
            options: ['str()', 'int()', 'float()', 'bool()'],
            correctAnswer: 1,
            explanation: 'The int() function converts a string (or other compatible type) to an integer value.'
          },
          {
            id: 4,
            question: 'What will be the output of: print(type("Hello World"))?',
            options: [
              '<class \'str\'>',
              '<class \'string\'>',
              '<class \'text\'>',
              'string'
            ],
            correctAnswer: 0,
            explanation: 'In Python, strings are of type \'str\', and the type() function returns <class \'str\'> for string values.'
          },
          {
            id: 5,
            question: 'Which of these is NOT a valid variable name in Python?',
            options: ['my_var', '_private', '2nd_value', 'firstName'],
            correctAnswer: 2,
            explanation: 'Variable names in Python cannot start with a number. \'2nd_value\' is invalid because it starts with \'2\'.'
          },
          {
            id: 6,
            question: 'What is the result of: bool("")?',
            options: ['True', 'False', 'Error', 'None'],
            correctAnswer: 1,
            explanation: 'An empty string ("") is considered False in Python when converted to a boolean value.'
          },
          {
            id: 7,
            question: 'How do you create a multi-line string in Python?',
            options: [
              'Using single quotes',
              'Using double quotes',
              'Using triple quotes (""" or \'\'\')',
              'Using backslash (\\)'
            ],
            correctAnswer: 2,
            explanation: 'Triple quotes (""" or \'\'\') allow you to create multi-line strings in Python.'
          },
          {
            id: 8,
            question: 'What will len("Python") return?',
            options: ['5', '6', '7', 'Error'],
            correctAnswer: 1,
            explanation: 'The len() function returns the number of characters in a string. "Python" has 6 characters.'
          }
        ]
      },
      '1-3': { // Python Course - Class 3
        title: 'Control Structures Quiz',
        description: 'Test your understanding of if statements, loops, and control flow',
        timeLimit: 12,
        questions: [
          {
            id: 1,
            question: 'Which keyword is used for conditional statements in Python?',
            options: ['when', 'if', 'condition', 'check'],
            correctAnswer: 1,
            explanation: 'The "if" keyword is used to create conditional statements in Python.'
          },
          {
            id: 2,
            question: 'What does the "for" loop do in Python?',
            options: [
              'Repeats code forever',
              'Iterates over a sequence',
              'Creates a function',
              'Defines a variable'
            ],
            correctAnswer: 1,
            explanation: 'The "for" loop in Python iterates over a sequence (like a list, string, or range).'
          }
        ]
      }
    };

    const quizKey = `${courseIdNum}-${classNum}`;
    const quiz = quizzes[quizKey] || {
      title: 'General Quiz',
      description: 'Test your knowledge of this class',
      timeLimit: 10,
      questions: [
        {
          id: 1,
          question: 'This is a sample question for this class.',
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          correctAnswer: 0,
          explanation: 'This is a sample explanation.'
        }
      ]
    };

    setQuizData(quiz);
    setTimeLeft(quiz.timeLimit * 60); // Convert minutes to seconds
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setStartTime(Date.now());
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < (quizData?.questions.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitQuiz = () => {
    setShowResults(true);
    setQuizStarted(false);
    
    // Calculate quiz results for tracking
    const score = calculateScore();
    const total = quizData?.questions.length || 0;
    const percentage = Math.round((score / total) * 100);
    const timeTaken = Math.round((Date.now() - startTime) / 1000); // in seconds
    
    // Track quiz completion
    trackQuizActivity(
      `Course ${courseId}`,
      `Class ${classNumber} Quiz`,
      percentage,
      total,
      score,
      timeTaken
    );
    
    console.log('📊 Quiz completed and tracked:', {
      score: `${score}/${total}`,
      percentage: `${percentage}%`,
      timeTaken: `${timeTaken}s`
    });
  };

  const calculateScore = () => {
    if (!quizData) return 0;
    let correct = 0;
    quizData.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!quizData) {
    return <div className="min-h-screen flex items-center justify-center">Loading quiz...</div>;
  }

  if (!quizStarted && !showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <button
            onClick={() => navigate(`/course/${courseId}/class/${classNumber}`)}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Class
          </button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpenIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{quizData.title}</h1>
              <p className="text-gray-600 text-lg">{quizData.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <ClockIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900">Time Limit</h3>
                <p className="text-blue-600">{quizData.timeLimit} minutes</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <BookOpenIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900">Questions</h3>
                <p className="text-green-600">{quizData.questions.length} questions</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <TrophyIcon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900">Passing Score</h3>
                <p className="text-purple-600">60%</p>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={startQuiz}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Start Quiz
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const total = quizData.questions.length;
    const percentage = Math.round((score / total) * 100);

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="text-center mb-8">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
                percentage >= 60 ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {percentage >= 60 ? (
                  <TrophyIcon className="h-10 w-10 text-green-600" />
                ) : (
                  <XCircleIcon className="h-10 w-10 text-red-600" />
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Complete!</h1>
              <p className={`text-xl font-semibold ${getScoreColor(score, total)}`}>
                Your Score: {score}/{total} ({percentage}%)
              </p>
              <p className="text-gray-600 mt-2">
                {percentage >= 80 ? 'Excellent work!' : 
                 percentage >= 60 ? 'Good job!' : 
                 'Keep studying and try again!'}
              </p>
            </div>

            <div className="space-y-4 mb-8">
              {quizData.questions.map((question, index) => (
                <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">Q{index + 1}: {question.question}</h3>
                    {selectedAnswers[index] === question.correctAnswer ? (
                      <CheckCircleIcon className="h-6 w-6 text-green-600 flex-shrink-0" />
                    ) : (
                      <XCircleIcon className="h-6 w-6 text-red-600 flex-shrink-0" />
                    )}
                  </div>
                  <div className="space-y-2 mb-3">
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className={`p-2 rounded text-sm ${
                        optionIndex === question.correctAnswer ? 'bg-green-100 text-green-800' :
                        optionIndex === selectedAnswers[index] ? 'bg-red-100 text-red-800' :
                        'bg-gray-50 text-gray-700'
                      }`}>
                        {option}
                        {optionIndex === question.correctAnswer && ' ✓ (Correct)'}
                        {optionIndex === selectedAnswers[index] && optionIndex !== question.correctAnswer && ' ✗ (Your answer)'}
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
                    <strong>Explanation:</strong> {question.explanation}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => navigate(`/course/${courseId}/class/${classNumber}`)}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Back to Class
              </button>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retake Quiz
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const currentQ = quizData.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate(`/course/${courseId}/class/${classNumber}`)}
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Exit Quiz
          </button>
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-white px-3 py-1 rounded-full shadow">
              <ClockIcon className="h-4 w-4 text-gray-500 mr-1" />
              <span className={`font-semibold ${timeLeft < 60 ? 'text-red-600' : 'text-gray-700'}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
            <div className="bg-white px-3 py-1 rounded-full shadow">
              <span className="text-sm font-medium text-gray-700">
                {currentQuestion + 1} / {quizData.questions.length}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / quizData.questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Question {currentQuestion + 1}
          </h2>
          <p className="text-lg text-gray-700 mb-8">{currentQ.question}</p>

          <div className="space-y-3 mb-8">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  selectedAnswers[currentQuestion] === index
                    ? 'border-blue-500 bg-blue-50 text-blue-900'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                    selectedAnswers[currentQuestion] === index
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedAnswers[currentQuestion] === index && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  {option}
                </div>
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={previousQuestion}
              disabled={currentQuestion === 0}
              className="flex items-center px-4 py-2 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Previous
            </button>

            {currentQuestion === quizData.questions.length - 1 ? (
              <button
                onClick={handleSubmitQuiz}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Submit Quiz
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next
                <ArrowRightIcon className="h-4 w-4 ml-1" />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ClassQuiz;
