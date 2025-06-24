import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'fill-blank' | 'code';
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  points: number;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeLimit: number; // in minutes
  questions: QuizQuestion[];
  totalPoints: number;
  icon: string;
  color: string;
  isLocked?: boolean;
}

interface QuizResult {
  quizId: string;
  score: number;
  totalPoints: number;
  percentage: number;
  timeTaken: number;
  completedAt: Date;
  answers: { [questionId: string]: string | number };
}

const AIQuizzes: React.FC = () => {
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [questionId: string]: string | number }>({});
  const [showResults, setShowResults] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);

  const quizzes: Quiz[] = [
    {
      id: 'ai-basics',
      title: 'AI Fundamentals',
      description: 'Test your knowledge of basic AI concepts and terminology',
      category: 'Fundamentals',
      difficulty: 'beginner',
      timeLimit: 15,
      totalPoints: 100,
      icon: '🤖',
      color: 'from-green-500 to-emerald-600',
      questions: [
        {
          id: 'q1',
          question: 'What does AI stand for?',
          type: 'multiple-choice',
          options: ['Artificial Intelligence', 'Automated Intelligence', 'Advanced Intelligence', 'Algorithmic Intelligence'],
          correctAnswer: 0,
          explanation: 'AI stands for Artificial Intelligence, which refers to machines that can perform tasks that typically require human intelligence.',
          difficulty: 'beginner',
          points: 10
        },
        {
          id: 'q2',
          question: 'Machine Learning is a subset of Artificial Intelligence.',
          type: 'true-false',
          options: ['True', 'False'],
          correctAnswer: 0,
          explanation: 'True. Machine Learning is indeed a subset of Artificial Intelligence that focuses on algorithms that can learn from data.',
          difficulty: 'beginner',
          points: 10
        },
        {
          id: 'q3',
          question: 'Neural networks are inspired by the structure of the human _____.',
          type: 'fill-blank',
          correctAnswer: 'brain',
          explanation: 'Neural networks are inspired by the structure and function of the human brain, particularly how neurons connect and process information.',
          difficulty: 'beginner',
          points: 15
        }
      ]
    },
    {
      id: 'ml-intermediate',
      title: 'Machine Learning Concepts',
      description: 'Dive deeper into machine learning algorithms and techniques',
      category: 'Machine Learning',
      difficulty: 'intermediate',
      timeLimit: 20,
      totalPoints: 150,
      icon: '📊',
      color: 'from-blue-500 to-indigo-600',
      questions: [
        {
          id: 'q1',
          question: 'Which algorithm is best for classification problems with a large number of features?',
          type: 'multiple-choice',
          options: ['Linear Regression', 'Support Vector Machine', 'K-Means', 'DBSCAN'],
          correctAnswer: 1,
          explanation: 'Support Vector Machines (SVM) are particularly effective for classification problems with high-dimensional data.',
          difficulty: 'intermediate',
          points: 20
        },
        {
          id: 'q2',
          question: 'Overfitting occurs when a model performs well on training data but poorly on test data.',
          type: 'true-false',
          options: ['True', 'False'],
          correctAnswer: 0,
          explanation: 'True. Overfitting happens when a model learns the training data too well, including noise, making it perform poorly on new, unseen data.',
          difficulty: 'intermediate',
          points: 15
        }
      ]
    },
    {
      id: 'deep-learning',
      title: 'Deep Learning Mastery',
      description: 'Advanced concepts in neural networks and deep learning',
      category: 'Deep Learning',
      difficulty: 'advanced',
      timeLimit: 30,
      totalPoints: 200,
      icon: '🧠',
      color: 'from-purple-500 to-pink-600',
      questions: [
        {
          id: 'q1',
          question: 'Which Python code correctly implements a simple neural network layer?',
          type: 'code',
          options: [
            'output = np.dot(input, weights) + bias',
            'output = np.multiply(input, weights) + bias',
            'output = np.add(input, weights) * bias',
            'output = np.subtract(weights, input) + bias'
          ],
          correctAnswer: 0,
          explanation: 'The correct implementation uses np.dot() for matrix multiplication between input and weights, then adds the bias.',
          difficulty: 'advanced',
          points: 25
        }
      ]
    }
  ];

  // Mock previous results
  const mockResults: QuizResult[] = [
    {
      quizId: 'ai-basics',
      score: 85,
      totalPoints: 100,
      percentage: 85,
      timeTaken: 12,
      completedAt: new Date('2024-01-15'),
      answers: {}
    },
    {
      quizId: 'ml-intermediate',
      score: 120,
      totalPoints: 150,
      percentage: 80,
      timeTaken: 18,
      completedAt: new Date('2024-01-14'),
      answers: {}
    }
  ];

  useEffect(() => {
    setQuizResults(mockResults);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (quizStarted && timeRemaining > 0 && !showResults) {
      timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
    } else if (timeRemaining === 0 && quizStarted) {
      handleSubmitQuiz();
    }
    return () => clearTimeout(timer);
  }, [timeRemaining, quizStarted, showResults]);

  const startQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setShowResults(false);
    setTimeRemaining(quiz.timeLimit * 60);
    setQuizStarted(true);
  };

  const handleAnswer = (questionId: string, answer: string | number) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const nextQuestion = () => {
    if (selectedQuiz && currentQuestionIndex < selectedQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  const handleSubmitQuiz = () => {
    if (!selectedQuiz) return;

    let score = 0;
    selectedQuiz.questions.forEach(question => {
      const userAnswer = userAnswers[question.id];
      if (userAnswer === question.correctAnswer || 
          (typeof userAnswer === 'string' && typeof question.correctAnswer === 'string' && 
           userAnswer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim())) {
        score += question.points;
      }
    });

    const result: QuizResult = {
      quizId: selectedQuiz.id,
      score,
      totalPoints: selectedQuiz.totalPoints,
      percentage: Math.round((score / selectedQuiz.totalPoints) * 100),
      timeTaken: selectedQuiz.timeLimit - Math.floor(timeRemaining / 60),
      completedAt: new Date(),
      answers: userAnswers
    };

    setQuizResults(prev => [result, ...prev]);
    setShowResults(true);
    setQuizStarted(false);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 70) return 'text-blue-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (selectedQuiz && quizStarted && !showResults) {
    const currentQuestion = selectedQuiz.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / selectedQuiz.questions.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Quiz Header */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">{selectedQuiz.title}</h1>
              <div className="flex items-center space-x-4">
                <div className="text-lg font-semibold text-blue-600">
                  ⏰ {formatTime(timeRemaining)}
                </div>
                <button
                  onClick={() => setSelectedQuiz(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ❌ Exit
                </button>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Question {currentQuestionIndex + 1} of {selectedQuiz.questions.length}
            </p>
          </div>

          {/* Current Question */}
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(currentQuestion.difficulty)}`}>
                  {currentQuestion.difficulty}
                </span>
                <span className="text-blue-600 font-semibold">{currentQuestion.points} points</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">{currentQuestion.question}</h2>
            </div>

            {currentQuestion.type === 'multiple-choice' && (
              <div className="space-y-3">
                {currentQuestion.options?.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(currentQuestion.id, index)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      userAnswers[currentQuestion.id] === index
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
                  </button>
                ))}
              </div>
            )}

            {currentQuestion.type === 'true-false' && (
              <div className="space-y-3">
                {currentQuestion.options?.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(currentQuestion.id, index)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      userAnswers[currentQuestion.id] === index
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {currentQuestion.type === 'fill-blank' && (
              <div>
                <input
                  type="text"
                  placeholder="Type your answer here..."
                  value={userAnswers[currentQuestion.id] as string || ''}
                  onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                  className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>
            )}

            {currentQuestion.type === 'code' && (
              <div className="space-y-3">
                {currentQuestion.options?.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(currentQuestion.id, index)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all font-mono text-sm ${
                      userAnswers[currentQuestion.id] === index
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                disabled={currentQuestionIndex === 0}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Previous
              </button>
              <button
                onClick={nextQuestion}
                disabled={userAnswers[currentQuestion.id] === undefined}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentQuestionIndex === selectedQuiz.questions.length - 1 ? 'Finish Quiz' : 'Next →'}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (showResults && selectedQuiz) {
    const latestResult = quizResults[0];
    const passed = latestResult.percentage >= 70;
    
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {passed ? '🎉 Quiz Completed Successfully!' : '📊 Quiz Results & Analysis'}
              </h1>
              <p className="text-gray-600 text-lg">
                {selectedQuiz.title} - {passed ? 'Congratulations! You have passed!' : 'Review your performance and learn from the explanations below.'}
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
                <div className="text-3xl font-bold text-blue-600">{latestResult.score}</div>
                <div className="text-sm text-blue-800">Total Score</div>
                <div className="text-xs text-blue-600 mt-1">out of {latestResult.totalPoints}</div>
              </div>
              <div className={`p-6 rounded-xl text-center border ${passed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className={`text-3xl font-bold ${passed ? 'text-green-600' : 'text-red-600'}`}>
                  {latestResult.percentage.toFixed(1)}%
                </div>
                <div className={`text-sm ${passed ? 'text-green-800' : 'text-red-800'}`}>Percentage</div>
                <div className={`text-xs mt-1 ${passed ? 'text-green-600' : 'text-red-600'}`}>
                  {passed ? 'Passed! ✓' : 'Need 70% to pass'}
                </div>
              </div>
              <div className="bg-purple-50 p-6 rounded-xl text-center border border-purple-200">
                <div className="text-3xl font-bold text-purple-600">
                  {Object.keys(userAnswers).filter(questionId => {
                    const question = selectedQuiz.questions.find(q => q.id === questionId);
                    return question && userAnswers[questionId] === question.correctAnswer;
                  }).length}/{selectedQuiz.questions.length}
                </div>
                <div className="text-sm text-purple-800">Correct Answers</div>
                <div className="text-xs text-purple-600 mt-1">
                  {selectedQuiz.questions.length - Object.keys(userAnswers).filter(questionId => {
                    const question = selectedQuiz.questions.find(q => q.id === questionId);
                    return question && userAnswers[questionId] === question.correctAnswer;
                  }).length} incorrect
                </div>
              </div>
              <div className="bg-yellow-50 p-6 rounded-xl text-center border border-yellow-200">
                <div className="text-3xl font-bold text-yellow-600">
                  {latestResult.percentage >= 90 ? 'A+' : latestResult.percentage >= 80 ? 'A' : latestResult.percentage >= 70 ? 'B+' : latestResult.percentage >= 60 ? 'B' : latestResult.percentage >= 50 ? 'C' : 'F'}
                </div>
                <div className="text-sm text-yellow-800">Grade</div>
                <div className="text-xs text-yellow-600 mt-1">
                  {latestResult.percentage >= 90 ? 'Excellent!' : latestResult.percentage >= 80 ? 'Great!' : latestResult.percentage >= 70 ? 'Good!' : latestResult.percentage >= 60 ? 'Fair' : 'Need Improvement'}
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
                    {latestResult.score > 0 && <li>✓ Earned {latestResult.score} points</li>}
                    {latestResult.percentage >= 70 && <li>✓ Achieved passing grade</li>}
                    {latestResult.percentage >= 80 && <li>✓ Demonstrated strong understanding</li>}
                    {latestResult.percentage >= 90 && <li>✓ Exceptional performance!</li>}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Areas for Improvement:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {latestResult.percentage < 70 && <li>• Focus on core concepts to reach passing grade</li>}
                    {latestResult.percentage < 50 && <li>• Consider reviewing course materials before retaking</li>}
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
              {selectedQuiz.questions.map((question, index) => {
                const userAnswer = userAnswers[question.id];
                const isCorrect = userAnswer === question.correctAnswer;
                
                return (
                  <div key={question.id} className={`border-l-4 ${isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'} p-6 rounded-r-lg`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          Question {index + 1}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {question.points} points
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                          {question.difficulty}
                        </span>
                      </div>
                      <div className={`text-2xl ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                        {isCorrect ? '🎯' : '❌'}
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{question.question}</h3>

                    {question.type === 'multiple-choice' && question.options && (
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
                    )}

                    {question.type === 'true-false' && question.options && (
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
                                    {option === 'True' ? 'T' : 'F'}
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
                    )}

                    {question.type === 'fill-blank' && (
                      <div className="mb-6">
                        <h4 className="font-medium text-gray-800 mb-3">Your Answer vs Correct Answer:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className={`p-3 rounded-lg border ${isCorrect ? 'border-green-500 bg-green-100' : 'border-red-500 bg-red-100'}`}>
                            <div className="text-sm font-medium text-gray-700 mb-1">Your Answer:</div>
                            <div className={`font-semibold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                              {userAnswer || 'No answer provided'}
                            </div>
                          </div>
                          <div className="p-3 rounded-lg border border-green-500 bg-green-100">
                            <div className="text-sm font-medium text-gray-700 mb-1">Correct Answer:</div>
                            <div className="font-semibold text-green-700">{question.correctAnswer}</div>
                          </div>
                        </div>
                      </div>
                    )}

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
                          Review the {selectedQuiz.category} concepts related to this question. 
                          This is a {question.difficulty} level topic - make sure you understand the fundamentals before moving to advanced concepts.
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
                  {latestResult.percentage < 70 && (
                    <>
                      <li>• Review {selectedQuiz.category} fundamentals</li>
                      <li>• Focus on incorrect questions above</li>
                      <li>• Practice with additional {selectedQuiz.difficulty} level exercises</li>
                    </>
                  )}
                  {latestResult.percentage >= 70 && latestResult.percentage < 85 && (
                    <>
                      <li>• Review explanations for missed questions</li>
                      <li>• Practice advanced {selectedQuiz.category} problems</li>
                      <li>• Explore related AI concepts</li>
                    </>
                  )}
                  {latestResult.percentage >= 85 && (
                    <>
                      <li>• Excellent work on {selectedQuiz.category}!</li>
                      <li>• Try more advanced AI topics</li>
                      <li>• Consider practical implementations</li>
                    </>
                  )}
                  <li>• Complete other quizzes to expand knowledge</li>
                </ul>
              </div>

              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <h3 className="text-lg font-semibold text-green-900 mb-4">🚀 Next Steps</h3>
                <ul className="space-y-2 text-sm text-green-800">
                  {passed ? (
                    <>
                      <li>• Try a more advanced quiz</li>
                      <li>• Apply {selectedQuiz.category} concepts in projects</li>
                      <li>• Join AI community discussions</li>
                    </>
                  ) : (
                    <>
                      <li>• Retake quiz after studying</li>
                      <li>• Review course materials on {selectedQuiz.category}</li>
                      <li>• Start with easier difficulty levels</li>
                    </>
                  )}
                  <li>• Track your progress across all quizzes</li>
                  <li>• Set learning goals for continuous improvement</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => startQuiz(selectedQuiz)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
              >
                🔄 Retake Quiz
              </button>
              <button
                onClick={() => setSelectedQuiz(null)}
                className="bg-gray-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-700 transition-all flex items-center justify-center gap-2"
              >
                📚 Back to Quizzes
              </button>
              {passed && (
                <button
                  onClick={() => setSelectedQuiz(null)}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                >
                  ➡️ Try Another Quiz
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              🧠 AI Quizzes & Assessments
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Test your AI knowledge, track your progress, and master artificial intelligence concepts!
            </p>
          </motion.div>
        </div>

        {/* Available Quizzes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {quizzes.map((quiz, index) => (
            <motion.div
              key={quiz.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow"
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${quiz.color} flex items-center justify-center mb-4`}>
                <span className="text-white text-2xl">{quiz.icon}</span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{quiz.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{quiz.description}</p>
              
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(quiz.difficulty)}`}>
                  {quiz.difficulty}
                </span>
                <span className="text-gray-500 text-sm">⏰ {quiz.timeLimit}m</span>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-600">{quiz.questions.length} questions</span>
                <span className="text-sm text-blue-600 font-medium">{quiz.totalPoints} points</span>
              </div>

              {/* Previous Results */}
              {quizResults.find(result => result.quizId === quiz.id) && (
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <div className="text-xs text-gray-500 mb-1">Best Score:</div>
                  <div className={`font-semibold ${getScoreColor(quizResults.find(result => result.quizId === quiz.id)?.percentage || 0)}`}>
                    {quizResults.find(result => result.quizId === quiz.id)?.percentage}%
                  </div>
                </div>
              )}
              
              <button
                onClick={() => startQuiz(quiz)}
                disabled={quiz.isLocked}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                  quiz.isLocked
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {quiz.isLocked ? '🔒 Locked' : 'Start Quiz'}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Quiz History */}
        {quizResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">📊 Your Quiz History</h2>
            <div className="space-y-4">
              {quizResults.map((result, index) => {
                const quiz = quizzes.find(q => q.id === result.quizId);
                return (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${quiz?.color} flex items-center justify-center`}>
                        <span className="text-white">{quiz?.icon}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{quiz?.title}</h3>
                        <p className="text-sm text-gray-600">
                          Completed {result.completedAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-xl font-bold ${getScoreColor(result.percentage)}`}>
                        {result.percentage}%
                      </div>
                      <div className="text-sm text-gray-600">
                        {result.score}/{result.totalPoints} points
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default AIQuizzes; 