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
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  const loadData = async () => {
    setIsLoading(true);
    await Promise.all([loadCourses(), loadQuizzes()]);
    setIsLoading(false);
  };

  const loadCourses = async () => {
    try {
      const response = await fetch('https://ahvxqultshujqtmbkjpy.supabase.co/rest/v1/courses?select=*', {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ',
        }
      });
      if (response.ok) {
        const coursesData = await response.json();
        setCourses(coursesData);
      }
    } catch (error) {
      console.error('Failed to load courses:', error);
    }
  };

  const loadQuizzes = async () => {
    try {
      // Mock data - shows current hardcoded quizzes
      const mockQuizzes: Quiz[] = [
        {
          id: 1,
          course_id: 1,
          class_number: 1,
          title: 'Python Basics & Setup Quiz',
          description: 'Test your understanding of Python installation and basic concepts',
          time_limit: 10,
          questions: [
            {
              id: 1,
              question: 'What is Python?',
              options: ['A type of snake', 'A high-level programming language', 'A web browser', 'A database system'],
              correctAnswer: 1,
              explanation: 'Python is a high-level, interpreted programming language known for its simplicity and readability.'
            }
          ],
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          course_id: 1,
          class_number: 2,
          title: 'Variables & Data Types Quiz',
          description: 'Test your knowledge of Python variables, data types, and basic operations',
          time_limit: 15,
          questions: [
            {
              id: 1,
              question: 'Which of the following is the correct way to declare a variable in Python?',
              options: ['var name = "John"', 'name = "John"', 'string name = "John"', 'declare name = "John"'],
              correctAnswer: 1,
              explanation: 'In Python, you simply assign a value to a variable name without declaring its type explicitly.'
            }
          ],
          created_at: new Date().toISOString()
        }
      ];
      setQuizzes(mockQuizzes);
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

  const filteredQuizzes = selectedCourse 
    ? quizzes.filter(quiz => quiz.course_id === selectedCourse)
    : quizzes;

  const getCourseName = (courseId: number) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.name : `Course ${courseId}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading quiz manager...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quiz Manager</h1>
            <p className="text-gray-600 mt-2">Create and manage quizzes for your courses</p>
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 rounded mt-4">
              <strong>Demo Mode:</strong> Currently showing mock data. Database integration coming soon!
            </div>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Create Quiz
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center space-x-4">
            <label className="block text-sm font-medium text-gray-700">Filter by Course:</label>
            <select
              value={selectedCourse || ''}
              onChange={(e) => setSelectedCourse(e.target.value ? parseInt(e.target.value) : null)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="">All Courses</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>{course.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Quizzes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map(quiz => (
            <motion.div
              key={quiz.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{quiz.title}</h3>
                  <p className="text-sm text-gray-600">{getCourseName(quiz.course_id)} - Class {quiz.class_number}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditQuiz(quiz)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteQuiz(quiz.id!)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <p className="text-gray-700 text-sm mb-4">{quiz.description}</p>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  {quiz.time_limit} minutes
                </div>
                <div className="flex items-center">
                  <BookOpenIcon className="h-4 w-4 mr-1" />
                  {quiz.questions.length} questions
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <button
                  onClick={() => window.open(`/quiz/course/${quiz.course_id}/class/${quiz.class_number}`, '_blank')}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  <EyeIcon className="h-4 w-4 mr-2" />
                  Preview Quiz
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredQuizzes.length === 0 && (
          <div className="text-center py-12">
            <AcademicCapIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No quizzes found</h3>
            <p className="text-gray-600 mb-4">
              {selectedCourse ? 'No quizzes found for the selected course.' : 'Create your first quiz to get started.'}
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Quiz
            </button>
          </div>
        )}

        {/* Create/Edit Quiz Modal */}
        {(showCreateModal || showEditModal) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {showEditModal ? 'Edit Quiz' : 'Create New Quiz'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowCreateModal(false);
                      setShowEditModal(false);
                      setEditingQuiz(null);
                      resetNewQuiz();
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Quiz Details Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
                    <select
                      value={newQuiz.course_id}
                      onChange={(e) => setNewQuiz({...newQuiz, course_id: parseInt(e.target.value)})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      {courses.map(course => (
                        <option key={course.id} value={course.id}>{course.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Class Number</label>
                    <input
                      type="number"
                      min="1"
                      value={newQuiz.class_number}
                      onChange={(e) => setNewQuiz({...newQuiz, class_number: parseInt(e.target.value)})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quiz Title</label>
                    <input
                      type="text"
                      value={newQuiz.title}
                      onChange={(e) => setNewQuiz({...newQuiz, title: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="e.g., Variables & Data Types Quiz"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time Limit (minutes)</label>
                    <input
                      type="number"
                      min="1"
                      value={newQuiz.time_limit}
                      onChange={(e) => setNewQuiz({...newQuiz, time_limit: parseInt(e.target.value)})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={newQuiz.description}
                      onChange={(e) => setNewQuiz({...newQuiz, description: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      rows={3}
                      placeholder="Brief description of what this quiz covers..."
                    />
                  </div>
                </div>

                {/* Questions Section */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quiz Questions ({newQuiz.questions.length})</h3>
                  
                  {/* Existing Questions */}
                  <div className="space-y-4 mb-6">
                    {newQuiz.questions.map((question, index) => (
                      <div key={question.id} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-900">Question {index + 1}</h4>
                          <button
                            onClick={() => removeQuestion(question.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-gray-700 mb-2">{question.question}</p>
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          {question.options.map((option, optIndex) => (
                            <div key={optIndex} className={`text-sm p-2 rounded ${
                              optIndex === question.correctAnswer ? 'bg-green-100 text-green-800' : 'bg-white text-gray-700'
                            }`}>
                              {String.fromCharCode(65 + optIndex)}. {option}
                            </div>
                          ))}
                        </div>
                        <p className="text-sm text-gray-600">Explanation: {question.explanation}</p>
                      </div>
                    ))}
                  </div>

                  {/* Add New Question Form */}
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-4">Add New Question</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
                        <textarea
                          value={newQuestion.question}
                          onChange={(e) => setNewQuestion({...newQuestion, question: e.target.value})}
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                          rows={2}
                          placeholder="Enter your question here..."
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {newQuestion.options.map((option, index) => (
                          <div key={index}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Option {String.fromCharCode(65 + index)}
                            </label>
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => {
                                const newOptions = [...newQuestion.options];
                                newOptions[index] = e.target.value;
                                setNewQuestion({...newQuestion, options: newOptions});
                              }}
                              className="w-full border border-gray-300 rounded-md px-3 py-2"
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
                              Option {String.fromCharCode(65 + index)}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Explanation</label>
                        <textarea
                          value={newQuestion.explanation}
                          onChange={(e) => setNewQuestion({...newQuestion, explanation: e.target.value})}
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                          rows={2}
                          placeholder="Explain why this is the correct answer..."
                        />
                      </div>

                      <button
                        onClick={addQuestion}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Add Question
                      </button>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 mt-8 pt-6 border-t">
                  <button
                    onClick={() => {
                      setShowCreateModal(false);
                      setShowEditModal(false);
                      setEditingQuiz(null);
                      resetNewQuiz();
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={showEditModal ? handleUpdateQuiz : handleCreateQuiz}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {showEditModal ? 'Update Quiz' : 'Create Quiz'}
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
