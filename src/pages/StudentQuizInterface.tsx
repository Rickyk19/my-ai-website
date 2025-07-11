import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ClockIcon,
  QuestionMarkCircleIcon,
  CheckCircleIcon,
  XMarkIcon,
  PlayIcon,
  PauseIcon,
  ForwardIcon,
  BackwardIcon,
  FlagIcon,
  BookOpenIcon,
  TrophyIcon,
  ChartBarIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

interface Quiz {
  id: number;
  course_id: number;
  class_id: number;
  title: string;
  description: string;
  instructions: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  time_limit: number;
  total_marks?: number;
  questions: QuizQuestion[];
  created_at: string;
  is_active: boolean;
  is_published: boolean;
  configuration: QuizConfiguration;
  grading_system: GradingSystem;
}

interface QuizQuestion {
  id: number;
  section_id: number;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'fill-blank' | 'numerical' | 'essay';
  options?: string[];
  correct_answer: string | number | string[];
  explanation?: string;
  points: number;
  negative_marks: number;
  difficulty: 'easy' | 'medium' | 'hard';
  time_limit?: number;
  image_url?: string;
  has_multiple_correct: boolean;
  tags: string[];
}

interface QuizConfiguration {
  show_question_marks: boolean;
  negative_marking: boolean;
  negative_marks_value: number;
  partial_marking: boolean;
  question_navigation: boolean;
  review_mode: boolean;
  show_answers_after: 'immediately' | 'after_submission' | 'never';
  max_attempts: number;
  quiz_pause_enabled: boolean;
  time_per_question: boolean;
  auto_submit: boolean;
}

interface GradingSystem {
  passing_percentage: number;
  grades: { name: string; min_percentage: number; max_percentage: number; color: string; }[];
}

interface StudentAnswer {
  questionId: number;
  answer: string | number | string[];
  timeSpent: number;
  isFlagged: boolean;
}

interface DemoQuestion {
  id: number;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'numerical' | 'fill-blank';
  options?: string[];
  correct: number | string | boolean;
  points: number;
  image_url?: string;
}

const StudentQuizInterface: React.FC = () => {
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{[key: number]: any}>({});
  const [timeRemaining, setTimeRemaining] = useState(1800); // 30 minutes
  const [showResults, setShowResults] = useState(false);
  const [realQuiz, setRealQuiz] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load real quiz data from database
  useEffect(() => {
    loadQuizData();
  }, []);

  const loadQuizData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Load YOUR quiz from Course 1, Class 1 directly - this is connected to admin dashboard
      const { getQuiz } = await import('../utils/supabase');
      console.log('🎯 Loading quiz from Course 1, Class 1...');
      const result = await getQuiz(1, 1);
      console.log('📋 Raw quiz result:', result);
      
      // 🔍 CRITICAL DEBUG: Check what quizzes actually exist in the database
      const { getAllQuizzes } = await import('../utils/supabase');
      const allQuizzesResult = await getAllQuizzes();
      if (allQuizzesResult.success && allQuizzesResult.quizzes) {
        console.log('🗂️ ALL QUIZZES IN DATABASE:', allQuizzesResult.quizzes.map((q: any) => ({
          id: q.id,
          title: q.title,
          course_id: q.course_id,
          class_number: q.class_number,
          question_count: Array.isArray(q.questions) ? q.questions.length : (typeof q.questions === 'string' ? JSON.parse(q.questions).length : 0)
        })));
        
        // Try to find ANY quiz that has 15 questions (your quiz!)
        const quizWith15Questions = allQuizzesResult.quizzes.find((q: any) => {
          const questions = Array.isArray(q.questions) ? q.questions : (typeof q.questions === 'string' ? JSON.parse(q.questions) : []);
          return questions.length === 15;
        });
        
        if (quizWith15Questions) {
          console.log('🎯 FOUND YOUR 15-QUESTION QUIZ!', {
            id: quizWith15Questions.id,
            title: quizWith15Questions.title,
            course_id: quizWith15Questions.course_id,
            class_number: quizWith15Questions.class_number,
            stored_at: `Course ${quizWith15Questions.course_id}, Class ${quizWith15Questions.class_number}`,
            looking_for: 'Course 1, Class 1'
          });
        } else {
          console.error('❌ NO QUIZ WITH 15 QUESTIONS FOUND!');
        }
      }
      
      if (result && result.success && result.quiz) {
        console.log('✅ Loaded quiz data:', result.quiz);
        
        // Parse questions if they're stored as JSON string
        let questions = result.quiz.questions;
        if (typeof questions === 'string') {
          try {
            questions = JSON.parse(questions);
          } catch (error) {
            console.error('Failed to parse quiz questions:', error);
            questions = [];
          }
        }
        
        // Get the REAL course and class data from the same source as admin dashboard
        const { getCourses, getAllCourseClasses } = await import('../utils/supabase');
        const [coursesResult, classesResult] = await Promise.all([
          getCourses(),
          getAllCourseClasses()
        ]);
        
        let courseName = "Complete Python Programming Masterclass";
        let classTitle = "Fundamentals & Introduction";
        
        if (coursesResult.success && coursesResult.courses) {
          console.log('📚 Available courses from database:', coursesResult.courses);
          const course = coursesResult.courses.find((c: any) => c.id === 1);
          if (course) {
            courseName = course.name;
            console.log('✅ Found Course 1:', courseName);
          }
        }
        
        if (classesResult.success && classesResult.classes) {
          console.log('📚 Available classes from database:', classesResult.classes);
          // Find class with course_id=1 and class_number=1
          const classData = classesResult.classes.find((c: any) => c.course_id === 1 && c.class_number === 1);
          if (classData) {
            classTitle = classData.title;
            console.log('✅ Found Class 1:', classTitle);
          }
        }
        
        // Helper function to format class title (same as admin dashboard)
        const formatClassTitle = (classNumber: number, title: string) => {
          // Check if title already starts with "Class {number}:"
          if (title.startsWith(`Class ${classNumber}:`)) {
            return title; // Use title as-is
          } else {
            return `Class ${classNumber}: ${title}`; // Add class number prefix
          }
        };
        
        // Transform database quiz data to match our interface
        const transformedQuiz = {
          title: result.quiz.title,
          course: courseName,
          class: formatClassTitle(1, classTitle),
          totalQuestions: questions.length,
          totalMarks: questions.reduce((sum: number, q: any) => sum + (q.points || 10), 0),
          timeLimit: result.quiz.time_limit || 30,
          questions: questions.map((q: any, index: number) => ({
            id: q.id || index + 1,
            question: q.question,
            type: q.type || 'multiple-choice',
            options: q.options || [],
            correct: q.correctAnswer !== undefined ? q.correctAnswer : q.correct_answer,
            points: q.points || 10,
            image_url: q.image_url // REAL IMAGES FROM ADMIN DASHBOARD!
          }))
        };
        
        setRealQuiz(transformedQuiz);
        setTimeRemaining(transformedQuiz.timeLimit * 60);
        console.log('✅ Quiz loaded with', transformedQuiz.questions.length, 'questions');
        console.log('📋 ALL QUESTIONS:', transformedQuiz.questions.map((q: any, i: number) => ({
          index: i + 1,
          question: q.question?.substring(0, 50) + '...',
          has_image: !!q.image_url,
          image_length: q.image_url?.length || 0
        })));
        
        // Special check for Question 11 - FORCE DEBUGGING
        if (transformedQuiz.questions.length >= 11) {
          const q11 = transformedQuiz.questions[10];
          const rawQ11 = questions[10];
          
          console.log('🎯 QUESTION 11 DETAILED DEBUG:');
          console.log('Question text:', q11.question);
          console.log('Has image_url:', !!q11.image_url);
          console.log('Image URL:', q11.image_url || 'NONE');
          console.log('Raw question keys:', rawQ11 ? Object.keys(rawQ11) : 'NOT FOUND');
          console.log('Raw image_url:', rawQ11?.image_url || 'NONE');
          
          // FORCE ALERT TO SHOW DEBUGGING
          alert(`Question 11 Debug:
Question: ${q11.question?.substring(0, 50)}...
Has Image: ${!!q11.image_url}
Image URL: ${q11.image_url ? 'EXISTS' : 'MISSING'}
Raw Image: ${rawQ11?.image_url ? 'EXISTS' : 'MISSING'}`);
          
        } else {
          console.error(`❌ QUIZ ONLY HAS ${transformedQuiz.questions.length} QUESTIONS - CANNOT SHOW QUESTION 11!`);
          alert(`ERROR: Quiz only has ${transformedQuiz.questions.length} questions!`);
        }
      } else {
        console.warn('No real quiz found, using demo data');
        setRealQuiz(null);
      }
    } catch (error) {
      console.error('Failed to load quiz data:', error);
      setError('Failed to load quiz. Please try again.');
      setRealQuiz(null);
    } finally {
      setIsLoading(false);
    }
  };

  const demoQuiz = {
    title: "Python Basics - Variables and Data Types",
    course: "Complete Python Programming Masterclass",
    class: "Class 1: Python Fundamentals",
    totalQuestions: 5,
    totalMarks: 50,
    timeLimit: 30,
    questions: [
      {
        id: 1,
        question: "What is the correct way to create a variable in Python?",
        type: "multiple-choice" as const,
        options: ["var x = 5", "x = 5", "int x = 5", "variable x = 5"],
        correct: 1,
        points: 10,
        image_url: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmOGZmIi8+CiAgPHRleHQgeD0iMjAiIHk9IjMwIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjE2IiBmaWxsPSIjMzMzIj4jIFB5dGhvbiBWYXJpYWJsZSBFeGFtcGxlczo8L3RleHQ+CiAgPHRleHQgeD0iMjAiIHk9IjU1IiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMDA3Ij54ID0gNSAgICMgQ29ycmVjdDwvdGV4dD4KICA8dGV4dCB4PSIyMCIgeT0iNzUiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiNkOTUzNGYiPnZhciB4ID0gNSAgIyBJbmNvcnJlY3Q8L3RleHQ+CiAgPHRleHQgeD0iMjAiIHk9IjEwMCIgZm9udC1mYW1pbHk9Im1vbm9zcGFjZSIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2Q5NTM0ZiI+aW50IHggPSA1ICAjIEluY29ycmVjdDwvdGV4dD4KICA8dGV4dCB4PSIyMCIgeT0iMTMwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzY2NiI+UHl0aG9uIGlzIGR5bmFtaWNhbGx5IHR5cGVkPC90ZXh0Pgo8L3N2Zz4="
      },
      {
        id: 2,
        question: "Which is NOT a valid Python data type?",
        type: "multiple-choice" as const,
        options: ["int", "float", "string", "char"],
        correct: 3,
        points: 10
      },
      {
        id: 3,
        question: "Python is case-sensitive",
        type: "true-false" as const,
        correct: true,
        points: 10
      },
      {
        id: 4,
        question: "What is 10 // 3 in Python?",
        type: "numerical" as const,
        correct: "3",
        points: 10
      },
      {
        id: 5,
        question: "Which function gets user input in Python?",
        type: "fill-blank" as const,
        correct: "input",
        points: 10
      }
    ] as DemoQuestion[]
  };

  // Use real quiz if available, fallback to demo quiz
  const currentQuizData = realQuiz || demoQuiz;
  
  // Critical debugging for quiz selection
  console.log('🎯 CRITICAL DEBUG - Quiz Selection:', {
    has_real_quiz: !!realQuiz,
    real_quiz_questions: realQuiz?.questions?.length || 0,
    using_demo: !realQuiz,
    demo_questions: demoQuiz.questions.length,
    selected_quiz_questions: currentQuizData.questions.length,
    selected_quiz_title: currentQuizData.title
  });

  useEffect(() => {
    if (quizStarted && timeRemaining > 0 && !showResults) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [quizStarted, timeRemaining, showResults]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (answer: any) => {
    setAnswers(prev => ({ ...prev, [currentQuestion]: answer }));
  };

  const nextQuestion = () => {
    if (currentQuestion < currentQuizData.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const submitQuiz = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    let score = 0;
    let correct = 0;
    currentQuizData.questions.forEach((q: any, idx: number) => {
      const userAnswer = answers[idx];
      if (userAnswer !== undefined) {
        if (q.type === 'multiple-choice' && userAnswer === q.correct) {
          score += q.points;
          correct++;
        } else if (q.type === 'true-false' && userAnswer === q.correct) {
          score += q.points;
          correct++;
        } else if ((q.type === 'numerical' || q.type === 'fill-blank') && 
                   userAnswer.toString().toLowerCase() === q.correct.toString().toLowerCase()) {
          score += q.points;
          correct++;
        }
      }
    });
    return { score, correct, percentage: (score / currentQuizData.totalMarks) * 100 };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Quiz...</h2>
          <p className="text-gray-600">Please wait while we load your quiz data</p>
        </div>
      </div>
    );
  }



  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentQuizData.title}</h1>
              <p className="text-gray-600 text-lg">Test your knowledge</p>
              {/* Critical Quiz Source Indicator */}
              {realQuiz ? (
                <div className="mt-3 inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  ✅ Real Quiz Loaded ({realQuiz.questions.length} questions)
                </div>
              ) : (
                <div className="mt-3 inline-flex items-center px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                  ⚠️ Using Demo Quiz ({demoQuiz.questions.length} questions)
                </div>
              )}
              {isLoading && <p className="text-blue-600">Loading quiz data...</p>}
              {error && <p className="text-red-600">Error: {error}</p>}
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl mb-8 border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-2">📚 {currentQuizData.course}</h3>
              <p className="text-green-700">{currentQuizData.class}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <ClockIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">{currentQuizData.timeLimit}</div>
                <div className="text-sm text-blue-800">Minutes</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <CheckCircleIcon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-600">{currentQuizData.totalQuestions}</div>
                <div className="text-sm text-purple-800">Questions</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">{currentQuizData.totalMarks}</div>
                <div className="text-sm text-green-800">Total Marks</div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">📋 Instructions</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>You have {currentQuizData.timeLimit} minutes to complete the quiz</li>
                <li>Each question shows the marks allocated</li>
                <li>You can navigate between questions</li>
                <li>Some questions include images for reference</li>
                <li>Passing percentage: 70%</li>
              </ul>
            </div>

            <div className="text-center">
              <button
                onClick={() => setQuizStarted(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
              >
                <PlayIcon className="h-6 w-6 inline mr-2" />
                Start Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    const results = calculateScore();
    const passed = results.percentage >= 70;
    
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
                {passed ? 'Congratulations! You have successfully passed the quiz!' : 'Review your performance and learn from the explanations below.'}
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
                <div className="text-3xl font-bold text-blue-600">{results.score}</div>
                <div className="text-sm text-blue-800">Total Score</div>
                <div className="text-xs text-blue-600 mt-1">out of {currentQuizData.totalMarks}</div>
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
                <div className="text-3xl font-bold text-purple-600">{results.correct}/{currentQuizData.questions.length}</div>
                <div className="text-sm text-purple-800">Correct Answers</div>
                <div className="text-xs text-purple-600 mt-1">{currentQuizData.questions.length - results.correct} incorrect</div>
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
                    {results.percentage >= 70 && <li>✓ Achieved passing grade</li>}
                    {results.percentage >= 80 && <li>✓ Demonstrated strong understanding</li>}
                    {results.percentage >= 90 && <li>✓ Exceptional performance!</li>}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Areas for Improvement:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {(currentQuizData.questions.length - results.correct) > 0 && <li>• Review {currentQuizData.questions.length - results.correct} incorrect answers below</li>}
                    {results.percentage < 70 && <li>• Focus on core concepts to reach passing grade</li>}
                    {results.percentage < 50 && <li>• Consider reviewing course materials before retaking</li>}
                    <li>• Study the detailed explanations provided</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Question Analysis */}
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">📝 Detailed Question Analysis</h2>
            
            <div className="space-y-8">
              {currentQuizData.questions.map((question: any, index: number) => {
                const userAnswer = answers[index];
                const correctAnswer = question.correct;
                const isCorrect = userAnswer === correctAnswer;
                
                return (
                  <div key={question.id} className={`border-l-4 ${isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'} p-6 rounded-r-lg`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          Question {index + 1}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {question.points} marks
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
                    
                    {question.image_url && (
                      <div className="mb-4">
                        <img 
                          src={question.image_url} 
                          alt="Question illustration" 
                          className="max-w-sm h-auto rounded-lg border border-gray-200 shadow-sm"
                        />
                      </div>
                    )}

                    {question.type === 'multiple-choice' && question.options && (
                      <div className="mb-6">
                        <h4 className="font-medium text-gray-800 mb-3">Answer Options:</h4>
                        <div className="space-y-2">
                          {question.options.map((option: string, optionIndex: number) => {
                            const isUserChoice = userAnswer === optionIndex;
                            const isCorrectChoice = correctAnswer === optionIndex;
                            
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

                    {question.type === 'true-false' && (
                      <div className="mb-6">
                        <h4 className="font-medium text-gray-800 mb-3">Answer Options:</h4>
                        <div className="space-y-2">
                          {[true, false].map((option) => {
                            const isUserChoice = userAnswer === option;
                            const isCorrectChoice = correctAnswer === option;
                            
                            return (
                              <div
                                key={option.toString()}
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
                                    {option ? 'T' : 'F'}
                                  </span>
                                  <span className="flex-1">{option ? 'True' : 'False'}</span>
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

                    {/* Explanation Section */}
                    <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-100 border border-green-200' : 'bg-blue-100 border border-blue-200'}`}>
                      <h4 className={`font-medium mb-2 ${isCorrect ? 'text-green-800' : 'text-blue-800'}`}>
                        💡 Explanation:
                      </h4>
                      <p className={`text-sm ${isCorrect ? 'text-green-700' : 'text-blue-700'}`}>
                        {/* Default explanation based on question type */}
                        {question.type === 'multiple-choice' && question.options && (
                          <>
                            The correct answer is <strong>{question.options[correctAnswer as number]}</strong>. 
                            {!isCorrect && (
                              <> You selected <strong>{question.options[userAnswer as number]}</strong>, which is incorrect.</>
                            )}
                            <br /><br />
                            <strong>Why this is correct:</strong> This question tests your understanding of {demoQuiz.course} concepts. 
                            {correctAnswer === 0 && "The first option represents the fundamental principle being tested."}
                            {correctAnswer === 1 && "The second option demonstrates the key concept in question."}
                            {correctAnswer === 2 && "The third option shows the correct application of the principle."}
                            {correctAnswer === 3 && "The fourth option represents the most accurate answer."}
                          </>
                        )}
                        {question.type === 'true-false' && (
                          <>
                            The correct answer is <strong>{correctAnswer ? 'True' : 'False'}</strong>. 
                            {!isCorrect && (
                              <> You selected <strong>{userAnswer ? 'True' : 'False'}</strong>, which is incorrect.</>
                            )}
                            <br /><br />
                            <strong>Why this is {correctAnswer ? 'true' : 'false'}:</strong> This statement {correctAnswer ? 'accurately represents' : 'does not correctly represent'} the core concept being tested. 
                            Review the course materials to better understand this principle.
                          </>
                        )}
                      </p>
                    </div>

                    {!isCorrect && (
                      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <h4 className="font-medium text-yellow-800 mb-2">📚 Study Recommendation:</h4>
                        <p className="text-sm text-yellow-700">
                          To improve your understanding of this topic, review Chapter {index + 1} of the course materials. 
                          Focus on the key concepts and practice similar problems. 
                          Consider discussing this topic with your instructor or peers.
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
                      <li>• Review course materials before retaking</li>
                      <li>• Focus on incorrect questions above</li>
                      <li>• Practice with additional exercises</li>
                    </>
                  )}
                  {results.percentage >= 70 && results.percentage < 85 && (
                    <>
                      <li>• Review explanations for missed questions</li>
                      <li>• Practice advanced problems</li>
                      <li>• Explore additional resources</li>
                    </>
                  )}
                  {results.percentage >= 85 && (
                    <>
                      <li>• Excellent work! Consider advanced topics</li>
                      <li>• Help other students understand concepts</li>
                      <li>• Explore practical applications</li>
                    </>
                  )}
                  <li>• Schedule regular review sessions</li>
                </ul>
              </div>

              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <h3 className="text-lg font-semibold text-green-900 mb-4">🚀 Next Steps</h3>
                <ul className="space-y-2 text-sm text-green-800">
                  {passed ? (
                    <>
                      <li>• Proceed to the next lesson</li>
                      <li>• Apply concepts in practical exercises</li>
                      <li>• Join discussion forums</li>
                    </>
                  ) : (
                    <>
                      <li>• Retake quiz after studying</li>
                      <li>• Attend office hours if available</li>
                      <li>• Form study groups with classmates</li>
                    </>
                  )}
                  <li>• Track your progress regularly</li>
                  <li>• Set learning goals for improvement</li>
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
                <ArrowPathIcon className="h-5 w-5" />
                Retake Quiz
              </button>
              <button
                onClick={() => alert('Returning to course dashboard...')}
                className="bg-gray-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-700 transition-all flex items-center justify-center gap-2"
              >
                📚 Back to Course
              </button>
              {passed && (
                <button
                  onClick={() => alert('Proceeding to next lesson...')}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                >
                  ➡️ Next Lesson
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const question = currentQuizData.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-gray-900">{currentQuizData.title}</h1>
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                Question {currentQuestion + 1} of {currentQuizData.questions.length}
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
                timeRemaining < 300 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
              }`}>
                <ClockIcon className="h-5 w-5" />
                <span>{formatTime(timeRemaining)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">Questions</h3>
              <div className="grid grid-cols-5 gap-2">
                {currentQuizData.questions.map((_: any, index: number) => {
                  const hasAnswer = answers[index] !== undefined;
                  return (
                    <button
                      key={index}
                      onClick={() => setCurrentQuestion(index)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                        index === currentQuestion
                          ? 'bg-blue-600 text-white'
                          : hasAnswer
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Question */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                    Question {currentQuestion + 1}
                  </span>
                  <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                    {question.points} marks
                  </span>
                </div>
                <button className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200">
                  <FlagIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">{question.question}</h2>
                
                {/* Debug info for ANY question */}
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    🔍 <strong>Current Question {currentQuestion + 1} Debug:</strong> 
                    Has image: {question.image_url ? 'YES' : 'NO'}
                    {question.image_url && ` (${question.image_url.length} chars)`}
                    <br />
                    Total questions in quiz: {currentQuizData.questions.length}
                  </p>
                </div>
                
                {/* Debug info for Question 11 */}
                {currentQuestion === 10 && (
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      🔍 <strong>Question 11 Debug:</strong> Has image: {question.image_url ? 'YES' : 'NO'}
                      {question.image_url && ` (${question.image_url.length} chars)`}
                    </p>
                  </div>
                )}
                
                {question.image_url && (
                  <div className="mb-6">
                    <div className="mb-2 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-800">
                      ✅ Image found for Question {currentQuestion + 1}: {question.image_url.substring(0, 50)}...
                    </div>
                    <img 
                      src={question.image_url} 
                      alt="Question illustration" 
                      className="max-w-full h-auto rounded-lg border border-gray-200 shadow-sm"
                      onLoad={() => console.log('🖼️ Image loaded successfully for question', currentQuestion + 1)}
                      onError={(e) => {
                        console.error('❌ Image failed to load for question', currentQuestion + 1, e);
                        console.error('❌ Image URL:', question.image_url);
                      }}
                    />
                  </div>
                )}
                
                {/* Force show Question 11 image debug info */}
                {currentQuestion === 10 && (
                  <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-bold text-yellow-800 mb-2">🔍 Question 11 FULL DEBUG:</h4>
                    <div className="text-sm text-yellow-800 space-y-1">
                      <div><strong>Has image_url:</strong> {question.image_url ? 'YES' : 'NO'}</div>
                      {question.image_url && (
                        <>
                          <div><strong>Image URL length:</strong> {question.image_url.length} characters</div>
                          <div><strong>URL starts with:</strong> {question.image_url.substring(0, 50)}...</div>
                          <div><strong>URL type:</strong> {question.image_url.startsWith('data:image/') ? 'Base64 Data URL' : 'Regular URL'}</div>
                        </>
                      )}
                      <div><strong>Question object keys:</strong> {Object.keys(question).join(', ')}</div>
                    </div>
                  </div>
                )}
                
                {/* Show if image should be there but isn't */}
                {currentQuestion === 10 && !question.image_url && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800">
                      ⚠️ <strong>Expected Image Missing:</strong> Question 11 should have an image but none found!
                    </p>
                  </div>
                )}
              </div>

              {/* Answer Options */}
              <div className="mb-8">
                {question.type === 'multiple-choice' && question.options && (
                  <div className="space-y-3">
                    {question.options.map((option: string, index: number) => (
                      <label
                        key={index}
                        className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
                          answers[currentQuestion] === index
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200'
                        }`}
                      >
                        <input
                          type="radio"
                          name="answer"
                          checked={answers[currentQuestion] === index}
                          onChange={() => handleAnswer(index)}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${
                          answers[currentQuestion] === index
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                        }`}>
                          {answers[currentQuestion] === index && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="bg-gray-100 text-gray-700 text-sm font-medium px-2 py-1 rounded">
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span className="text-gray-900">{option}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                )}

                {question.type === 'true-false' && (
                  <div className="space-y-3">
                    {[true, false].map((option) => (
                      <label
                        key={option.toString()}
                        className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
                          answers[currentQuestion] === option
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200'
                        }`}
                      >
                        <input
                          type="radio"
                          name="answer"
                          checked={answers[currentQuestion] === option}
                          onChange={() => handleAnswer(option)}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${
                          answers[currentQuestion] === option
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                        }`}>
                          {answers[currentQuestion] === option && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                        <span className="text-gray-900 font-medium">
                          {option ? '✅ True' : '❌ False'}
                        </span>
                      </label>
                    ))}
                  </div>
                )}

                {(question.type === 'fill-blank' || question.type === 'numerical') && (
                  <input
                    type={question.type === 'numerical' ? 'number' : 'text'}
                    value={answers[currentQuestion] || ''}
                    onChange={(e) => handleAnswer(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={`Enter your ${question.type === 'numerical' ? 'numerical' : 'text'} answer...`}
                  />
                )}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <button
                  onClick={prevQuestion}
                  disabled={currentQuestion === 0}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    currentQuestion === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-600 text-white hover:bg-gray-700'
                  }`}
                >
                  Previous
                </button>

                <div className="flex gap-4">
                  {currentQuestion === currentQuizData.questions.length - 1 ? (
                    <button
                      onClick={submitQuiz}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all"
                    >
                      Submit Quiz
                    </button>
                  ) : (
                    <button
                      onClick={nextQuestion}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-all"
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentQuizInterface; 