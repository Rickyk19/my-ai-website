import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  AcademicCapIcon,
  ClockIcon,
  BookOpenIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface Course {
  id: number;
  name: string;
  description: string;
  instructor?: string;
  total_classes?: number;
  classes?: CourseClass[];
}

interface CourseClass {
  id: number;
  course_id: number;
  class_number: number;
  title: string;
  description?: string;
}

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface Quiz {
  id?: number;
  course_id: number;
  class_number: number;
  title: string;
  description: string;
  time_limit: number;
  questions: QuizQuestion[];
  created_at?: string;
}

const QuizManager: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseClasses, setSelectedCourseClasses] = useState<CourseClass[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);

  const [newQuiz, setNewQuiz] = useState<Omit<Quiz, 'id' | 'created_at'>>({
    course_id: 1,
    class_number: 1,
    title: '',
    description: '',
    time_limit: 15,
    questions: []
  });

  const [newQuestion, setNewQuestion] = useState<Omit<QuizQuestion, 'id'>>({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (newQuiz.course_id) {
      loadCourseClasses(newQuiz.course_id);
    }
  }, [newQuiz.course_id]);

  const loadData = async () => {
    setIsLoading(true);
    await Promise.all([loadCourses(), loadQuizzes()]);
    setIsLoading(false);
  };

  const loadCourses = async () => {
    try {
      console.log('🔄 EXTREME FORCE REFRESH - Loading all 20 courses...');
      
      // EXTREME cache busting - add random number + timestamp
      const timestamp = new Date().getTime();
      const random = Math.random().toString(36).substring(7);
      const cacheBuster = `${timestamp}_${random}`;
      
      console.log(`🚀 Cache buster: ${cacheBuster}`);
      
      const response = await fetch(`https://ahvxqultshujqtmbkjpy.supabase.co/rest/v1/courses?select=id,name,instructor,description&order=id&_nocache=${cacheBuster}`, {
        method: 'GET',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ',
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0',
          'If-Modified-Since': 'Mon, 26 Jul 1997 05:00:00 GMT'
        },
        cache: 'no-store'
      });

      if (response.ok) {
        const coursesData = await response.json();
        console.log(`✅ FRESH DATA: Successfully loaded ${coursesData.length} courses!`, coursesData);
        
        // Show first few course names for debugging
        const firstFew = coursesData.slice(0, 5).map((c: any) => `${c.id}: ${c.name}`).join(', ');
        console.log(`📋 First 5 courses: ${firstFew}`);
        
        // Now get class counts for each course with cache busting
        const coursesWithCounts = await Promise.all(
          coursesData.map(async (course: any) => {
            try {
              const classResponse = await fetch(`https://ahvxqultshujqtmbkjpy.supabase.co/rest/v1/course_classes?select=id,class_number,title&course_id=eq.${course.id}&order=class_number&_nocache=${cacheBuster}`, {
                method: 'GET',
                headers: {
                  'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ',
                  'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
                  'Pragma': 'no-cache',
                  'Expires': '0'
                },
                cache: 'no-store'
              });
              
              if (classResponse.ok) {
                const classes = await classResponse.json();
                console.log(`📚 Course ${course.id} (${course.name}): ${classes.length} classes found`);
                return {
                  ...course,
                  total_classes: classes.length,
                  classes: classes
                };
              }
            } catch (error) {
              console.error(`Error loading classes for course ${course.id}:`, error);
            }
            
            return {
              ...course,
              total_classes: 0,
              classes: []
            };
          })
        );
        
        // Only include courses that have classes (for quiz creation)
        const coursesWithClasses = coursesWithCounts.filter(course => course.total_classes > 0);
        
        console.log('📚 FINAL FILTERED COURSES (with classes only):', coursesWithClasses);
        console.log(`🎯 SHOWING ${coursesWithClasses.length} courses in dropdown (filtered from ${coursesData.length} total)`);
        
        // Show detailed breakdown
        coursesWithClasses.forEach(course => {
          console.log(`✓ ${course.id}: "${course.name}" - ${course.total_classes} classes`);
        });
        
        setCourses(coursesWithClasses);
        
      } else {
        console.error('Failed to load courses, status:', response.status);
        setCourses([]);
      }
    } catch (error) {
      console.error('Network error loading courses:', error);
      setCourses([]);
    }
  };

  const loadCourseClasses = async (courseId: number) => {
    try {
      const course = courses.find(c => c.id === courseId);
      if (course && course.classes) {
        setSelectedCourseClasses(course.classes);
      }
    } catch (error) {
      console.error('Failed to load course classes:', error);
    }
  };

  const loadQuizzes = async () => {
    try {
      // For now, show sample quizzes
      const sampleQuizzes: Quiz[] = [
        {
          id: 1,
          course_id: 1,
          class_number: 1,
          title: 'Python Basics Quiz',
          description: 'Test your Python fundamentals',
          time_limit: 15,
          questions: [],
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          course_id: 1,
          class_number: 2,
          title: 'Variables & Data Types Quiz',
          description: 'Test your knowledge of Python variables',
          time_limit: 15,
          questions: [],
          created_at: new Date().toISOString()
        }
      ];
      setQuizzes(sampleQuizzes);
    } catch (error) {
      console.error('Failed to load quizzes:', error);
    }
  };

  const handleCreateQuiz = () => {
    if (!newQuiz.title || !newQuiz.description || newQuiz.questions.length === 0) {
      alert('Please fill in all required fields and add at least one question.');
      return;
    }

    const quiz: Quiz = {
      id: Date.now(),
      ...newQuiz,
      created_at: new Date().toISOString()
    };

    setQuizzes([...quizzes, quiz]);
    setShowCreateModal(false);
    resetNewQuiz();
    alert('Quiz created successfully! Note: This is currently a demo - in the future this will save to database.');
  };

  const handleEditQuiz = (quiz: Quiz) => {
    setEditingQuiz(quiz);
    setNewQuiz({
      course_id: quiz.course_id,
      class_number: quiz.class_number,
      title: quiz.title,
      description: quiz.description,
      time_limit: quiz.time_limit,
      questions: quiz.questions
    });
    setShowEditModal(true);
  };

  const handleUpdateQuiz = () => {
    if (!editingQuiz) return;

    const updatedQuizzes = quizzes.map(quiz => 
      quiz.id === editingQuiz.id 
        ? { ...editingQuiz, ...newQuiz }
        : quiz
    );
    
    setQuizzes(updatedQuizzes);
    setShowEditModal(false);
    setEditingQuiz(null);
    resetNewQuiz();
    alert('Quiz updated successfully! Note: This is currently a demo - changes are not saved to database.');
  };

  const handleDeleteQuiz = (quizId: number) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      setQuizzes(quizzes.filter(quiz => quiz.id !== quizId));
      alert('Quiz deleted successfully! Note: This is currently a demo - deletion is not permanent.');
    }
  };

  const addQuestion = () => {
    if (!newQuestion.question || newQuestion.options.some(opt => !opt.trim()) || !newQuestion.explanation) {
      alert('Please fill in all question fields.');
      return;
    }

    const question: QuizQuestion = {
      id: Date.now(),
      ...newQuestion
    };

    setNewQuiz({
      ...newQuiz,
      questions: [...newQuiz.questions, question]
    });

    setNewQuestion({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: ''
    });
  };

  const removeQuestion = (questionId: number) => {
    setNewQuiz({
      ...newQuiz,
      questions: newQuiz.questions.filter(q => q.id !== questionId)
    });
  };

  const resetNewQuiz = () => {
    setNewQuiz({
      course_id: 1,
      class_number: 1,
      title: '',
      description: '',
      time_limit: 15,
      questions: []
    });
    setNewQuestion({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: ''
    });
  };

  const getCourseName = (courseId: number) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.name : `Course ${courseId}`;
  };

  // Force reload function
  const forceReload = () => {
    console.log('🔄 MANUAL FORCE RELOAD TRIGGERED!');
    loadData();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Quiz Manager...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-lg">
                <AcademicCapIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Professional Quiz Management</h1>
                <p className="text-gray-600 mt-1">Create advanced quizzes with proctoring, analytics & Learnyst-level features</p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Create Professional Quiz</span>
            </button>
          </div>
        </div>

        {/* Course Loading Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">📊 Database Status</h2>
            <button
              onClick={forceReload}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              🔄 Refresh Data
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{courses.length}</div>
              <div className="text-sm text-gray-600">Total Courses Loaded</div>
              <div className="text-xs text-red-600 mt-1">
                {courses.length < 20 ? `⚠️ Expected 20, got ${courses.length}` : '✅ All courses loaded'}
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{quizzes.length}</div>
              <div className="text-sm text-gray-600">Active Quizzes</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {courses.reduce((total, course) => total + (course.total_classes || 0), 0)}
              </div>
              <div className="text-sm text-gray-600">Total Classes</div>
            </div>
          </div>
        </div>

        {courses.length === 0 ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <h3 className="text-red-800 font-semibold mb-2">⚠️ No Courses Found</h3>
            <p className="text-red-700">
              Cannot load courses from database. Please check:
              <br />• Supabase connection is working
              <br />• Course data exists in the database
              <br />• API keys are correct
            </p>
          </div>
        ) : (
          <>
            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <label className="block text-sm font-medium text-gray-700">📚 Filter by Course:</label>
                  <select
                    value={selectedCourse || ''}
                    onChange={(e) => setSelectedCourse(e.target.value ? parseInt(e.target.value) : null)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm min-w-[300px]"
                  >
                    <option value="">All Courses ({courses.length} total)</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>
                        {course.name} ({course.total_classes || 0} classes) - {course.instructor}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Course List for Verification */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h3 className="text-lg font-semibold mb-4">📋 All Available Courses</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.map(course => (
                  <div key={course.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="font-medium text-gray-900">{course.name}</div>
                    <div className="text-sm text-gray-600 mt-1">{course.instructor}</div>
                    <div className="text-xs text-blue-600 mt-2">
                      📚 {course.total_classes || 0} classes available
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Existing Quizzes */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">📝 Existing Quizzes</h3>
          {quizzes.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No quizzes created yet. Click "Create Professional Quiz" to get started.</p>
          ) : (
            <div className="space-y-4">
              {quizzes.map(quiz => (
                <div key={quiz.id} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{quiz.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{quiz.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span>📚 {getCourseName(quiz.course_id)}</span>
                      <span>📖 Class {quiz.class_number}</span>
                      <span>⏱️ {quiz.time_limit} minutes</span>
                      <span>❓ {quiz.questions.length} questions</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditQuiz(quiz)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteQuiz(quiz.id!)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Quiz Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">📝 Create New Quiz</h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* Quiz Details Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📚 Select Course ({courses.length} available)
                    </label>
                    <select
                      value={newQuiz.course_id}
                      onChange={(e) => {
                        const courseId = parseInt(e.target.value);
                        setNewQuiz({...newQuiz, course_id: courseId, class_number: 1});
                        loadCourseClasses(courseId);
                      }}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      {courses.map(course => (
                        <option key={course.id} value={course.id}>
                          {course.name} ({course.total_classes || 0} classes) - {course.instructor}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📖 Select Class ({selectedCourseClasses.length} available)
                    </label>
                    <select
                      value={newQuiz.class_number}
                      onChange={(e) => setNewQuiz({...newQuiz, class_number: parseInt(e.target.value)})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      {selectedCourseClasses.length > 0 ? (
                        selectedCourseClasses.map(classItem => (
                          <option key={classItem.id} value={classItem.class_number}>
                            Class {classItem.class_number}: {classItem.title}
                          </option>
                        ))
                      ) : (
                        <option value={1}>Please select a course first</option>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quiz Title</label>
                    <input
                      type="text"
                      value={newQuiz.title}
                      onChange={(e) => setNewQuiz({...newQuiz, title: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="Enter quiz title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ⏱️ Time Limit (minutes)
                    </label>
                    <input
                      type="number"
                      value={newQuiz.time_limit}
                      onChange={(e) => setNewQuiz({...newQuiz, time_limit: parseInt(e.target.value)})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      min="5"
                      max="180"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={newQuiz.description}
                      onChange={(e) => setNewQuiz({...newQuiz, description: e.target.value})}
                      rows={3}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="Enter quiz description"
                    />
                  </div>
                </div>

                {/* Questions Section */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">❓ Quiz Questions ({newQuiz.questions.length})</h3>
                  
                  {/* Add Question Form */}
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <h4 className="font-medium mb-3">Add New Question</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
                        <input
                          type="text"
                          value={newQuestion.question}
                          onChange={(e) => setNewQuestion({...newQuestion, question: e.target.value})}
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                          placeholder="Enter your question"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {newQuestion.options.map((option, index) => (
                          <div key={index}>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Option {String.fromCharCode(65 + index)}
                              {newQuestion.correctAnswer === index && ' (Correct Answer)'}
                            </label>
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => {
                                const newOptions = [...newQuestion.options];
                                newOptions[index] = e.target.value;
                                setNewQuestion({...newQuestion, options: newOptions});
                              }}
                              className={`w-full border rounded-md px-3 py-2 ${
                                newQuestion.correctAnswer === index 
                                  ? 'border-green-500 bg-green-50' 
                                  : 'border-gray-300'
                              }`}
                              placeholder={`Option ${String.fromCharCode(65 + index)}`}
                            />
                          </div>
                        ))}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Correct Answer</label>
                        <select
                          value={newQuestion.correctAnswer}
                          onChange={(e) => setNewQuestion({...newQuestion, correctAnswer: parseInt(e.target.value)})}
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                        >
                          {newQuestion.options.map((_, index) => (
                            <option key={index} value={index}>
                              Option {String.fromCharCode(65 + index)}: {newQuestion.options[index] || 'Empty'}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Explanation</label>
                        <textarea
                          value={newQuestion.explanation}
                          onChange={(e) => setNewQuestion({...newQuestion, explanation: e.target.value})}
                          rows={2}
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                          placeholder="Explain why this is the correct answer"
                        />
                      </div>

                      <button
                        onClick={addQuestion}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
                      >
                        Add Question
                      </button>
                    </div>
                  </div>

                  {/* Existing Questions */}
                  {newQuiz.questions.length > 0 && (
                    <div className="space-y-3">
                      {newQuiz.questions.map((question, index) => (
                        <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h5 className="font-medium">Question {index + 1}: {question.question}</h5>
                              <div className="mt-2 space-y-1">
                                {question.options.map((option, optIndex) => (
                                  <div key={optIndex} className={`text-sm ${
                                    question.correctAnswer === optIndex 
                                      ? 'text-green-600 font-medium' 
                                      : 'text-gray-600'
                                  }`}>
                                    {String.fromCharCode(65 + optIndex)}. {option}
                                    {question.correctAnswer === optIndex && ' ✓'}
                                  </div>
                                ))}
                              </div>
                              <p className="text-sm text-gray-500 mt-2">💡 {question.explanation}</p>
                            </div>
                            <button
                              onClick={() => removeQuestion(question.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg ml-4"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateQuiz}
                    disabled={!newQuiz.title || !newQuiz.description || newQuiz.questions.length === 0}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Create Quiz
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizManager;
