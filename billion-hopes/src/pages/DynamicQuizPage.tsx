import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ClockIcon,
  QuestionMarkCircleIcon,
  CheckCircleIcon,
  XMarkIcon,
  ArrowLeftIcon,
  TrophyIcon,
  PlayIcon
} from '@heroicons/react/24/outline';
import { getQuiz } from '../utils/supabase';
import StudentLayout from '../components/layout/StudentLayout';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface Quiz {
  id: number;
  course_id: number;
  class_number: number;
  title: string;
  description: string;
  time_limit: number;
  questions: QuizQuestion[];
  created_at: string;
}

const DynamicQuizPage: React.FC = () => {
  const { courseId, classNumber } = useParams();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadQuiz();
  }, [courseId, classNumber]);

  useEffect(() => {
    if (quizStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && quizStarted) {
      handleSubmitQuiz();
    }
  }, [timeLeft, quizStarted]);

  const loadQuiz = async () => {
    try {
      setLoading(true);
      const courseIdNum = parseInt(courseId || '0');
      const classNum = parseInt(classNumber || '0');
      
      console.log(`Loading quiz for Course ${courseIdNum}, Class ${classNum}`);
      
      const result = await getQuiz(courseIdNum, classNum);
      
      if (result.success && result.quiz) {
        setQuiz(result.quiz);
        setTimeLeft(result.quiz.time_limit * 60);
        setSelectedAnswers(new Array(result.quiz.questions.length).fill(-1));
        console.log('Quiz loaded successfully:', result.quiz.title);
      } else {
        setError(result.error || 'Quiz not found for this class');
      }
    } catch (error) {
      console.error('Error loading quiz:', error);
      setError('Failed to load quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = () => {
    setQuizStarted(true);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quiz!.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitQuiz = () => {
    setQuizStarted(false);
    setShowResults(true);
  };

  const calculateResults = () => {
    if (!quiz) return { score: 0, percentage: 0, correct: 0, total: 0 };
    
    let correct = 0;
    quiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    
    const total = quiz.questions.length;
    const percentage = Math.round((correct / total) * 100);
    
    return { score: correct, percentage, correct, total };
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <StudentLayout showNavigation={false}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading quiz...</p>
          </div>
        </div>
      </StudentLayout>
    );
  }

  if (error || !quiz) {
    return (
      <StudentLayout showNavigation={false}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <XMarkIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Quiz Not Available</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate(-1)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </StudentLayout>
    );
  }

  if (showResults) {
    const results = calculateResults();
    const passed = results.percentage >= 70;

    return (
      <StudentLayout showNavigation={false}>
        <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {passed ? '🎉 Quiz Completed Successfully!' : '📊 Quiz Results & Analysis'}
              </h1>
              <p className="text-gray-600 text-lg">
                {quiz.title} - {passed ? 'Congratulations! You have passed!' : 'Review your performance and learn from the explanations below.'}
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Performance Summary */}
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">📈 Performance Summary</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-blue-50 p-6 rounded-xl text-center border border-blue-200">
                <div className="text-3xl font-bold text-blue-600">{results.correct}</div>
                <div className="text-sm text-blue-800">Correct Answers</div>
                <div className="text-xs text-blue-600 mt-1">out of {results.total}</div>
              </div>
              <div className={`p-6 rounded-xl text-center border ${passed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className={`text-3xl font-bold ${passed ? 'text-green-600' : 'text-red-600'}`}>
                  {results.percentage.toFixed(1)}%
                </div>
                <div className={`text-sm ${passed ? 'text-green-800' : 'text-red-800'}`}>Percentage</div>
                <div className={`text-xs mt-1 ${passed ? 'text-green-600' : 'text-red-600'}`}>
                  {passed ? 'Passed! ✓' : 'Need 70% to pass'}
                </div>
              </div>
              <div className="bg-purple-50 p-6 rounded-xl text-center border border-purple-200">
                <div className="text-3xl font-bold text-purple-600">
                  {results.total - results.correct}/{results.total}
                </div>
                <div className="text-sm text-purple-800">Incorrect</div>
                <div className="text-xs text-purple-600 mt-1">to review</div>
              </div>
              <div className="bg-yellow-50 p-6 rounded-xl text-center border border-yellow-200">
                <div className="text-3xl font-bold text-yellow-600">
                  {results.percentage >= 90 ? 'A+' : results.percentage >= 80 ? 'A' : results.percentage >= 70 ? 'B+' : results.percentage >= 60 ? 'B' : results.percentage >= 50 ? 'C' : 'F'}
                </div>
                <div className="text-sm text-yellow-800">Grade</div>
                <div className="text-xs text-yellow-600 mt-1">
                  {results.percentage >= 90 ? 'Excellent!' : results.percentage >= 80 ? 'Great!' : results.percentage >= 70 ? 'Good!' : results.percentage >= 60 ? 'Fair' : 'Need Improvement'}
                </div>
              </div>
            </div>

            {/* Performance Insights */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🔍 Performance Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Strengths:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {results.correct > 0 && <li>✓ Answered {results.correct} questions correctly</li>}
                    {passed && <li>✓ Achieved passing grade</li>}
                    {results.percentage >= 80 && <li>✓ Demonstrated strong understanding</li>}
                    {results.percentage >= 90 && <li>✓ Exceptional performance!</li>}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Areas for Improvement:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {!passed && <li>• Focus on core concepts to reach passing grade</li>}
                    {results.percentage < 50 && <li>• Consider reviewing course materials before retaking</li>}
                    <li>• Study the detailed explanations provided below</li>
                    <li>• Practice with similar questions</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Question Analysis */}
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">📝 Detailed Question Analysis</h2>
            
            <div className="space-y-8">
              {quiz.questions.map((question, index) => {
                const userAnswer = selectedAnswers[index];
                const isCorrect = userAnswer === question.correctAnswer;
                
                return (
                  <div key={question.id} className={`border-l-4 ${isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'} p-6 rounded-r-lg`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          Question {index + 1}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                        </span>
                      </div>
                      <div className={`text-2xl ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                        {isCorrect ? '🎯' : '❌'}
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{question.question}</h3>

                    <div className="mb-6">
                      <h4 className="font-medium text-gray-800 mb-3">Answer Options:</h4>
                      <div className="space-y-2">
                        {question.options.map((option, optionIndex) => {
                          const isUserChoice = userAnswer === optionIndex;
                          const isCorrectChoice = question.correctAnswer === optionIndex;
                          
                          return (
                            <div
                              key={optionIndex}
                              className={`p-3 rounded-lg border ${
                                isCorrectChoice 
                                  ? 'border-green-500 bg-green-100' 
                                  : isUserChoice 
                                  ? 'border-red-500 bg-red-100' 
                                  : 'border-gray-200 bg-white'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span className={`w-6 h-6 rounded-full text-sm font-medium flex items-center justify-center ${
                                  isCorrectChoice 
                                    ? 'bg-green-500 text-white' 
                                    : isUserChoice 
                                    ? 'bg-red-500 text-white' 
                                    : 'bg-gray-200 text-gray-600'
                                }`}>
                                  {String.fromCharCode(65 + optionIndex)}
                                </span>
                                <span className="flex-1">{option}</span>
                                <div className="flex items-center gap-2">
                                  {isCorrectChoice && <span className="text-green-600 font-medium">✓ Correct Answer</span>}
                                  {isUserChoice && !isCorrectChoice && <span className="text-red-600 font-medium">Your Choice</span>}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Explanation Section */}
                    <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-100 border border-green-200' : 'bg-blue-100 border border-blue-200'}`}>
                      <h4 className={`font-medium mb-2 ${isCorrect ? 'text-green-800' : 'text-blue-800'}`}>
                        💡 Explanation:
                      </h4>
                      <p className={`text-sm ${isCorrect ? 'text-green-700' : 'text-blue-700'}`}>
                        {question.explanation}
                      </p>
                    </div>

                    {!isCorrect && (
                      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <h4 className="font-medium text-yellow-800 mb-2">📚 Study Recommendation:</h4>
                        <p className="text-sm text-yellow-700">
                          Review the course material related to this topic. 
                          Make sure you understand the fundamentals before moving to advanced concepts.
                          Practice similar questions and discuss with peers or instructors if needed.
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Learning Recommendations */}
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">🎯 Personalized Learning Recommendations</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">📖 Study Plan</h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  {results.percentage < 70 && (
                    <>
                      <li>• Review course fundamentals</li>
                      <li>• Focus on incorrect questions above</li>
                      <li>• Practice with additional exercises</li>
                    </>
                  )}
                  {results.percentage >= 70 && results.percentage < 85 && (
                    <>
                      <li>• Review explanations for missed questions</li>
                      <li>• Practice advanced problems</li>
                      <li>• Explore related concepts</li>
                    </>
                  )}
                  {results.percentage >= 85 && (
                    <>
                      <li>• Excellent work on this topic!</li>
                      <li>• Try more advanced concepts</li>
                      <li>• Consider practical implementations</li>
                    </>
                  )}
                  <li>• Complete other course quizzes</li>
                </ul>
              </div>

              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <h3 className="text-lg font-semibold text-green-900 mb-4">🚀 Next Steps</h3>
                <ul className="space-y-2 text-sm text-green-800">
                  {passed ? (
                    <>
                      <li>• Proceed to the next class</li>
                      <li>• Apply concepts in practical exercises</li>
                      <li>• Join study group discussions</li>
                    </>
                  ) : (
                    <>
                      <li>• Retake quiz after studying</li>
                      <li>• Review course materials thoroughly</li>
                      <li>• Ask questions during office hours</li>
                    </>
                  )}
                  <li>• Track your progress across all classes</li>
                  <li>• Set learning goals for continuous improvement</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
              >
                🔄 Retake Quiz
              </button>
              <button
                onClick={() => navigate(-1)}
                className="bg-gray-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-700 transition-all flex items-center justify-center gap-2"
              >
                📚 Back to Course
              </button>
              {passed && (
                <button
                  onClick={() => alert('Proceeding to next class...')}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                >
                  ➡️ Next Class
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      </StudentLayout>
    );
  }

  if (!quizStarted) {
    return (
      <StudentLayout showNavigation={false}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="max-w-2xl mx-auto p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8 text-center"
          >
            <QuestionMarkCircleIcon className="h-16 w-16 text-blue-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{quiz.title}</h1>
            <p className="text-gray-600 text-lg mb-6">{quiz.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg">
                <ClockIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-sm text-blue-800">Time Limit</div>
                <div className="font-bold text-blue-900">{quiz.time_limit} minutes</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <QuestionMarkCircleIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-sm text-green-800">Questions</div>
                <div className="font-bold text-green-900">{quiz.questions.length}</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <TrophyIcon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-sm text-purple-800">Passing Score</div>
                <div className="font-bold text-purple-900">70%</div>
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-yellow-800 mb-2">Instructions:</h3>
              <ul className="text-sm text-yellow-700 text-left space-y-1">
                <li>• Read each question carefully before selecting your answer</li>
                <li>• You can navigate between questions using the Previous/Next buttons</li>
                <li>• The quiz will auto-submit when time runs out</li>
                <li>• Make sure you have a stable internet connection</li>
              </ul>
            </div>
            
            <button
              onClick={handleStartQuiz}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg flex items-center gap-2 mx-auto"
            >
              <PlayIcon className="h-5 w-5" />
              Start Quiz
            </button>
          </motion.div>
        </div>
      </div>
      </StudentLayout>
    );
  }

  const currentQ = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <StudentLayout showNavigation={false}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{quiz.title}</h1>
              <p className="text-sm text-gray-600">
                Question {currentQuestion + 1} of {quiz.questions.length}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-red-600">
                <ClockIcon className="h-5 w-5" />
                <span className="font-bold">{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Question */}
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {currentQ.question}
          </h2>
          
          <div className="space-y-4">
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
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedAnswers[currentQuestion] === index
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedAnswers[currentQuestion] === index && (
                      <CheckCircleIcon className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <span className="font-medium">{String.fromCharCode(65 + index)}.</span>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>
          
          {/* Navigation */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestion === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                currentQuestion === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Previous
            </button>
            
            <div className="flex gap-2">
              {quiz.questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-8 h-8 rounded-full text-sm font-medium ${
                    index === currentQuestion
                      ? 'bg-blue-600 text-white'
                      : selectedAnswers[index] !== -1
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            
            {currentQuestion === quiz.questions.length - 1 ? (
              <button
                onClick={handleSubmitQuiz}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Submit Quiz
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                Next
                <ArrowLeftIcon className="h-4 w-4 transform rotate-180" />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
    </StudentLayout>
  );
};

export default DynamicQuizPage; 