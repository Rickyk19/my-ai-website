import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AcademicCapIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CheckCircleIcon,
  XMarkIcon,
  ClockIcon,
  BookOpenIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';

interface Course {
  id: number;
  name: string;
  description: string;
  instructor: string;
  duration: string;
  level: string;
}

interface CourseClass {
  id: number;
  course_id: number;
  class_number: number;
  title: string;
  description: string;
  duration_minutes: number;
}

interface Quiz {
  id: number;
  course_id: number;
  class_id: number;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  time_limit: number;
  questions: QuizQuestion[];
  created_at: string;
  is_active: boolean;
}

interface QuizQuestion {
  id: number;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'fill-blank' | 'code';
  options?: string[];
  correct_answer: string | number;
  explanation?: string;
  points: number;
}

const ManageQuizzes: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseClasses, setCourseClasses] = useState<CourseClass[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [showCreateQuizModal, setShowCreateQuizModal] = useState(false);
  const [showViewQuizModal, setShowViewQuizModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [newQuiz, setNewQuiz] = useState<Partial<Quiz>>({
    title: '',
    description: '',
    difficulty: 'beginner',
    time_limit: 30,
    questions: [],
    is_active: true
  });

  const [newQuestion, setNewQuestion] = useState<Partial<QuizQuestion>>({
    question: '',
    type: 'multiple-choice',
    options: ['', '', '', ''],
    correct_answer: 0,
    explanation: '',
    points: 10
  });

  useEffect(() => {
    loadCourses();
    loadQuizzes();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      loadCourseClasses(selectedCourse);
    }
  }, [selectedCourse]);

  const loadCourses = async () => {
    try {
      const response = await fetch('https://ahvxqultshujqtmbkjpy.supabase.co/rest/v1/courses?select=*', {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ',
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      }
    } catch (error) {
      console.error('Error loading courses:', error);
    }
  };

  const loadCourseClasses = async (courseId: number) => {
    try {
      // Mock data for course classes since we need to create this table
      const mockClasses: CourseClass[] = [
        { id: 1, course_id: courseId, class_number: 1, title: "Introduction to AI", description: "Basic AI concepts", duration_minutes: 45 },
        { id: 2, course_id: courseId, class_number: 2, title: "Machine Learning Basics", description: "ML fundamentals", duration_minutes: 60 },
        { id: 3, course_id: courseId, class_number: 3, title: "Neural Networks", description: "Understanding neural networks", duration_minutes: 75 },
        { id: 4, course_id: courseId, class_number: 4, title: "Deep Learning", description: "Advanced deep learning", duration_minutes: 90 },
        { id: 5, course_id: courseId, class_number: 5, title: "AI Applications", description: "Real-world AI applications", duration_minutes: 60 }
      ];
      setCourseClasses(mockClasses);
    } catch (error) {
      console.error('Error loading course classes:', error);
    }
  };

  const loadQuizzes = async () => {
    try {
      // Mock quiz data
      const mockQuizzes: Quiz[] = [
        {
          id: 1,
          course_id: 1,
          class_id: 1,
          title: "AI Fundamentals Quiz",
          description: "Test your understanding of basic AI concepts",
          difficulty: 'beginner',
          time_limit: 30,
          questions: [
            {
              id: 1,
              question: "What does AI stand for?",
              type: 'multiple-choice',
              options: ['Artificial Intelligence', 'Automated Intelligence', 'Advanced Intelligence', 'Applied Intelligence'],
              correct_answer: 0,
              explanation: "AI stands for Artificial Intelligence",
              points: 10
            }
          ],
          created_at: '2024-01-15',
          is_active: true
        },
        {
          id: 2,
          course_id: 1,
          class_id: 2,
          title: "Machine Learning Quiz",
          description: "Test your ML knowledge",
          difficulty: 'intermediate',
          time_limit: 45,
          questions: [],
          created_at: '2024-01-16',
          is_active: true
        }
      ];
      setQuizzes(mockQuizzes);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading quizzes:', error);
      setIsLoading(false);
    }
  };

  const handleCreateQuiz = () => {
    if (!selectedCourse || !selectedClass) {
      alert('Please select a course and class first');
      return;
    }
    setNewQuiz({
      ...newQuiz,
      course_id: selectedCourse,
      class_id: selectedClass
    });
    setShowCreateQuizModal(true);
  };

  const addQuestion = () => {
    if (!newQuestion.question?.trim()) {
      alert('Please enter a question');
      return;
    }

    const question: QuizQuestion = {
      id: Date.now(),
      question: newQuestion.question!,
      type: newQuestion.type!,
      options: newQuestion.type === 'multiple-choice' ? newQuestion.options : undefined,
      correct_answer: newQuestion.correct_answer!,
      explanation: newQuestion.explanation,
      points: newQuestion.points || 10
    };

    setNewQuiz({
      ...newQuiz,
      questions: [...(newQuiz.questions || []), question]
    });

    setNewQuestion({
      question: '',
      type: 'multiple-choice',
      options: ['', '', '', ''],
      correct_answer: 0,
      explanation: '',
      points: 10
    });
  };

  const removeQuestion = (questionId: number) => {
    setNewQuiz({
      ...newQuiz,
      questions: newQuiz.questions?.filter(q => q.id !== questionId) || []
    });
  };

  const saveQuiz = async () => {
    if (!newQuiz.title || !newQuiz.questions?.length) {
      alert('Please provide quiz title and at least one question');
      return;
    }

    try {
      const quiz: Quiz = {
        id: Date.now(),
        course_id: newQuiz.course_id!,
        class_id: newQuiz.class_id!,
        title: newQuiz.title!,
        description: newQuiz.description!,
        difficulty: newQuiz.difficulty!,
        time_limit: newQuiz.time_limit!,
        questions: newQuiz.questions!,
        created_at: new Date().toISOString(),
        is_active: newQuiz.is_active!
      };

      setQuizzes([...quizzes, quiz]);
      setShowCreateQuizModal(false);
      setNewQuiz({
        title: '',
        description: '',
        difficulty: 'beginner',
        time_limit: 30,
        questions: [],
        is_active: true
      });
      
      alert('Quiz created successfully!');
    } catch (error) {
      console.error('Error saving quiz:', error);
      alert('Error saving quiz');
    }
  };

  const deleteQuiz = (quizId: number) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      setQuizzes(quizzes.filter(q => q.id !== quizId));
    }
  };

  const toggleQuizStatus = (quizId: number) => {
    setQuizzes(quizzes.map(q => 
      q.id === quizId ? { ...q, is_active: !q.is_active } : q
    ));
  };

  const getFilteredQuizzes = () => {
    return quizzes.filter(quiz => {
      if (selectedCourse && quiz.course_id !== selectedCourse) return false;
      if (selectedClass && quiz.class_id !== selectedClass) return false;
      return true;
    });
  };

  const getCourseName = (courseId: number) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.name : 'Unknown Course';
  };

  const getClassName = (classId: number) => {
    const classItem = courseClasses.find(c => c.id === classId);
    return classItem ? `Class ${classItem.class_number}: ${classItem.title}` : 'Unknown Class';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quiz Management</h1>
          <p className="text-gray-600">Create and manage quizzes for your courses</p>
        </div>
        <button
          onClick={handleCreateQuiz}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          Create Quiz
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
            <select
              value={selectedCourse || ''}
              onChange={(e) => {
                const courseId = e.target.value ? parseInt(e.target.value) : null;
                setSelectedCourse(courseId);
                setSelectedClass(null);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Courses</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>{course.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
            <select
              value={selectedClass || ''}
              onChange={(e) => setSelectedClass(e.target.value ? parseInt(e.target.value) : null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              disabled={!selectedCourse}
            >
              <option value="">All Classes</option>
              {courseClasses.map(classItem => (
                <option key={classItem.id} value={classItem.id}>
                  Class {classItem.class_number}: {classItem.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Quiz Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Quizzes</p>
              <p className="text-2xl font-bold text-gray-900">{quizzes.length}</p>
            </div>
            <QuestionMarkCircleIcon className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Quizzes</p>
              <p className="text-2xl font-bold text-green-900">{quizzes.filter(q => q.is_active).length}</p>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Questions</p>
              <p className="text-2xl font-bold text-purple-900">{quizzes.reduce((sum, q) => sum + q.questions.length, 0)}</p>
            </div>
            <BookOpenIcon className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Avg Time Limit</p>
              <p className="text-2xl font-bold text-orange-900">{Math.round(quizzes.reduce((sum, q) => sum + q.time_limit, 0) / quizzes.length || 0)} min</p>
            </div>
            <ClockIcon className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Quizzes List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Quizzes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quiz</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Questions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Limit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {getFilteredQuizzes().map((quiz) => (
                <tr key={quiz.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{quiz.title}</div>
                      <div className="text-sm text-gray-500">{quiz.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getCourseName(quiz.course_id)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getClassName(quiz.class_id)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      quiz.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                      quiz.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {quiz.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {quiz.questions.length}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {quiz.time_limit} min
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleQuizStatus(quiz.id)}
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        quiz.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {quiz.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedQuiz(quiz);
                          setShowViewQuizModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteQuiz(quiz.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Quiz Modal */}
      <AnimatePresence>
        {showCreateQuizModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Create New Quiz</h2>
                  <button
                    onClick={() => setShowCreateQuizModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Quiz Basic Info */}
                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quiz Title</label>
                      <input
                        type="text"
                        value={newQuiz.title}
                        onChange={(e) => setNewQuiz({...newQuiz, title: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter quiz title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Time Limit (minutes)</label>
                      <input
                        type="number"
                        value={newQuiz.time_limit}
                        onChange={(e) => setNewQuiz({...newQuiz, time_limit: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        min="1"
                        max="180"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={newQuiz.description}
                      onChange={(e) => setNewQuiz({...newQuiz, description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      placeholder="Enter quiz description"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                    <select
                      value={newQuiz.difficulty}
                      onChange={(e) => setNewQuiz({...newQuiz, difficulty: e.target.value as any})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                {/* Add Question Section */}
                <div className="border-t pt-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4">Add Question</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                      <textarea
                        value={newQuestion.question}
                        onChange={(e) => setNewQuestion({...newQuestion, question: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        rows={2}
                        placeholder="Enter your question"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Question Type</label>
                        <select
                          value={newQuestion.type}
                          onChange={(e) => setNewQuestion({...newQuestion, type: e.target.value as any})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="multiple-choice">Multiple Choice</option>
                          <option value="true-false">True/False</option>
                          <option value="fill-blank">Fill in the Blank</option>
                          <option value="code">Code Question</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Points</label>
                        <input
                          type="number"
                          value={newQuestion.points}
                          onChange={(e) => setNewQuestion({...newQuestion, points: parseInt(e.target.value)})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          min="1"
                          max="100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Correct Answer</label>
                        {newQuestion.type === 'multiple-choice' ? (
                          <select
                            value={newQuestion.correct_answer}
                            onChange={(e) => setNewQuestion({...newQuestion, correct_answer: parseInt(e.target.value)})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          >
                            <option value={0}>Option 1</option>
                            <option value={1}>Option 2</option>
                            <option value={2}>Option 3</option>
                            <option value={3}>Option 4</option>
                          </select>
                        ) : (
                          <input
                            type="text"
                            value={newQuestion.correct_answer}
                            onChange={(e) => setNewQuestion({...newQuestion, correct_answer: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter correct answer"
                          />
                        )}
                      </div>
                    </div>

                    {newQuestion.type === 'multiple-choice' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Options</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {newQuestion.options?.map((option, index) => (
                            <input
                              key={index}
                              type="text"
                              value={option}
                              onChange={(e) => {
                                const newOptions = [...(newQuestion.options || [])];
                                newOptions[index] = e.target.value;
                                setNewQuestion({...newQuestion, options: newOptions});
                              }}
                              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                              placeholder={`Option ${index + 1}`}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Explanation (Optional)</label>
                      <textarea
                        value={newQuestion.explanation}
                        onChange={(e) => setNewQuestion({...newQuestion, explanation: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        rows={2}
                        placeholder="Explain the correct answer"
                      />
                    </div>

                    <button
                      onClick={addQuestion}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Add Question
                    </button>
                  </div>
                </div>

                {/* Questions List */}
                {newQuiz.questions && newQuiz.questions.length > 0 && (
                  <div className="border-t pt-6 mb-6">
                    <h3 className="text-lg font-semibold mb-4">Questions ({newQuiz.questions.length})</h3>
                    <div className="space-y-4">
                      {newQuiz.questions.map((question, index) => (
                        <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">Q{index + 1}: {question.question}</h4>
                              <p className="text-sm text-gray-600 mt-1">
                                Type: {question.type} | Points: {question.points}
                              </p>
                              {question.type === 'multiple-choice' && question.options && (
                                <div className="mt-2">
                                  {question.options.map((option, optIndex) => (
                                    <div key={optIndex} className={`text-sm ${optIndex === question.correct_answer ? 'text-green-600 font-medium' : 'text-gray-600'}`}>
                                      {optIndex + 1}. {option} {optIndex === question.correct_answer && '✓'}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() => removeQuestion(question.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Save Quiz */}
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowCreateQuizModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveQuiz}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Save Quiz
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Quiz Modal */}
      <AnimatePresence>
        {showViewQuizModal && selectedQuiz && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedQuiz.title}</h2>
                  <button
                    onClick={() => setShowViewQuizModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <p className="text-gray-600">{selectedQuiz.description}</p>
                    <div className="mt-2 flex flex-wrap gap-4 text-sm">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {selectedQuiz.difficulty}
                      </span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                        {selectedQuiz.time_limit} minutes
                      </span>
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                        {selectedQuiz.questions.length} questions
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Questions</h3>
                    <div className="space-y-4">
                      {selectedQuiz.questions.map((question, index) => (
                        <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-2">
                            Q{index + 1}: {question.question} ({question.points} points)
                          </h4>
                          {question.type === 'multiple-choice' && question.options && (
                            <div className="space-y-1">
                              {question.options.map((option, optIndex) => (
                                <div key={optIndex} className={`text-sm p-2 rounded ${
                                  optIndex === question.correct_answer 
                                    ? 'bg-green-100 text-green-800 font-medium' 
                                    : 'bg-gray-50 text-gray-600'
                                }`}>
                                  {optIndex + 1}. {option}
                                  {optIndex === question.correct_answer && ' ✓ (Correct)'}
                                </div>
                              ))}
                            </div>
                          )}
                          {question.type !== 'multiple-choice' && (
                            <div className="bg-green-100 text-green-800 p-2 rounded text-sm">
                              Correct Answer: {question.correct_answer}
                            </div>
                          )}
                          {question.explanation && (
                            <div className="mt-2 p-2 bg-blue-50 text-blue-800 rounded text-sm">
                              <strong>Explanation:</strong> {question.explanation}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ManageQuizzes;
