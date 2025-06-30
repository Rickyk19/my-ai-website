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
  QuestionMarkCircleIcon,
  CalculatorIcon,
  ComputerDesktopIcon,
  ShieldCheckIcon,
  TrophyIcon,
  ChartBarIcon,
  CogIcon,
  DocumentDuplicateIcon,
  PlayIcon,
  PauseIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import AdvancedQuizConfig from './AdvancedQuizConfig';

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

interface QuizConfiguration {
  mocktest_template: boolean;
  show_question_marks: boolean;
  difficulty_level: 'easy' | 'medium' | 'hard' | 'expert';
  multichoice_label: 'A,B,C,D' | '1,2,3,4' | 'i,ii,iii,iv';
  calculator_type: 'none' | 'basic' | 'scientific';
  window_restriction: boolean;
  switch_window_warnings: number;
  proctoring_enabled: boolean;
  max_attempts: number;
  leaderboard_enabled: boolean;
  answer_shuffle: boolean;
  section_order_selection: boolean;
  quiz_pause_enabled: boolean;
  percentile_ranking: boolean;
  randomization_enabled: boolean;
  time_per_question: boolean;
  auto_submit: boolean;
  show_answers_after: 'immediately' | 'after_submission' | 'never';
  negative_marking: boolean;
  negative_marks_value: number;
  partial_marking: boolean;
  question_navigation: boolean;
  review_mode: boolean;
  full_screen_mode: boolean;
  copy_paste_disabled: boolean;
  right_click_disabled: boolean;
}

interface Quiz {
  id: number;
  course_id: number;
  class_id: number;
  title: string;
  description: string;
  instructions: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  time_limit: number;
  questions: QuizQuestion[];
  created_at: string;
  is_active: boolean;
  is_published: boolean;
  scheduled_date?: string;
  configuration: QuizConfiguration;
  grading_system: GradingSystem;
  sections: QuizSection[];
}

interface QuizSection {
  id: number;
  title: string;
  time_limit: number;
  question_count: number;
  order: number;
}

interface GradingSystem {
  passing_percentage: number;
  grades: Grade[];
}

interface Grade {
  name: string;
  min_percentage: number;
  max_percentage: number;
  color: string;
}

interface QuizQuestion {
  id: number;
  section_id: number;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'fill-blank' | 'numerical' | 'essay' | 'code' | 'group';
  options?: string[];
  correct_answer: string | number | string[];
  explanation?: string;
  points: number;
  negative_marks: number;
  difficulty: 'easy' | 'medium' | 'hard';
  time_limit?: number;
  image_url?: string;
  has_multiple_correct: boolean;
  answer_range?: { min: number; max: number };
  tags: string[];
}

const ManageQuizzesEnhanced: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseClasses, setCourseClasses] = useState<CourseClass[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [showCreateQuizModal, setShowCreateQuizModal] = useState(false);
  const [showViewQuizModal, setShowViewQuizModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [newQuiz, setNewQuiz] = useState<Partial<Quiz>>({
    title: '',
    description: '',
    instructions: 'Read all questions carefully. You have limited time to complete this quiz.',
    difficulty: 'beginner',
    time_limit: 30,
    questions: [],
    is_active: true,
    is_published: false,
    sections: [],
    configuration: {
      mocktest_template: false,
      show_question_marks: true,
      difficulty_level: 'medium',
      multichoice_label: 'A,B,C,D',
      calculator_type: 'none',
      window_restriction: false,
      switch_window_warnings: 3,
      proctoring_enabled: false,
      max_attempts: 1,
      leaderboard_enabled: false,
      answer_shuffle: false,
      section_order_selection: false,
      quiz_pause_enabled: false,
      percentile_ranking: false,
      randomization_enabled: false,
      time_per_question: false,
      auto_submit: true,
      show_answers_after: 'after_submission',
      negative_marking: false,
      negative_marks_value: 0.25,
      partial_marking: false,
      question_navigation: true,
      review_mode: true,
      full_screen_mode: false,
      copy_paste_disabled: false,
      right_click_disabled: false
    },
    grading_system: {
      passing_percentage: 60,
      grades: [
        { name: 'A+', min_percentage: 90, max_percentage: 100, color: '#10B981' },
        { name: 'A', min_percentage: 80, max_percentage: 89, color: '#059669' },
        { name: 'B+', min_percentage: 70, max_percentage: 79, color: '#F59E0B' },
        { name: 'B', min_percentage: 60, max_percentage: 69, color: '#D97706' },
        { name: 'C', min_percentage: 50, max_percentage: 59, color: '#DC2626' },
        { name: 'F', min_percentage: 0, max_percentage: 49, color: '#991B1B' }
      ]
    }
  });

  const [newQuestion, setNewQuestion] = useState<Partial<QuizQuestion>>({
    question: '',
    type: 'multiple-choice',
    options: ['', '', '', ''],
    correct_answer: 0,
    explanation: '',
    points: 10,
    negative_marks: 0,
    difficulty: 'medium',
    has_multiple_correct: false,
    tags: []
  });

  useEffect(() => {
    // Load sample courses and real quizzes from database
    const sampleCourses: Course[] = [
      {
        id: 1,
        name: "AI Fundamentals",
        description: "Introduction to Artificial Intelligence",
        instructor: "Dr. Sarah Johnson",
        duration: "8 weeks",
        level: "Beginner"
      },
      {
        id: 2,
        name: "Machine Learning Mastery",
        description: "Advanced Machine Learning Concepts",
        instructor: "Prof. Michael Chen",
        duration: "12 weeks",
        level: "Intermediate"
      },
      {
        id: 3,
        name: "Deep Learning & Neural Networks",
        description: "Deep Learning with TensorFlow and PyTorch",
        instructor: "Dr. Emily Rodriguez",
        duration: "10 weeks",
        level: "Advanced"
      },
      {
        id: 4,
        name: "AI in Business",
        description: "Practical AI Applications for Business",
        instructor: "James Wilson",
        duration: "6 weeks",
        level: "Beginner"
      },
      {
        id: 5,
        name: "Cybersecurity Ethical Hacking",
        description: "Learn ethical hacking and cybersecurity",
        instructor: "Alex Thompson",
        duration: "16 weeks",
        level: "Advanced"
      }
    ];
    setCourses(sampleCourses);
    
    // Load real quizzes from database
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      console.log('📚 Loading quizzes from database...');
      setIsLoading(true);
      
      // Load quizzes from database using the getQuizzes function
      const { getQuizzes } = await import('../utils/supabase');
      const result = await getQuizzes();
      
      if (result.success && result.quizzes) {
        console.log(`✅ Loaded ${result.quizzes.length} quizzes from database`);
        
        // Transform database quizzes to match our Quiz interface
        const transformedQuizzes: Quiz[] = result.quizzes.map((dbQuiz: any) => ({
          id: dbQuiz.id,
          course_id: dbQuiz.course_id,
          class_id: dbQuiz.class_id || 1,
          title: dbQuiz.title,
          description: dbQuiz.description || '',
          instructions: dbQuiz.instructions || 'Read all questions carefully.',
          difficulty: dbQuiz.difficulty || 'beginner',
          time_limit: dbQuiz.time_limit || 30,
          questions: dbQuiz.questions || [],
          created_at: dbQuiz.created_at || new Date().toISOString(),
          is_active: dbQuiz.is_active !== undefined ? dbQuiz.is_active : true,
          is_published: dbQuiz.is_published !== undefined ? dbQuiz.is_published : false,
          sections: dbQuiz.sections || [],
          configuration: dbQuiz.configuration || {
            mocktest_template: false,
            show_question_marks: true,
            difficulty_level: 'medium',
            multichoice_label: 'A,B,C,D',
            calculator_type: 'none',
            window_restriction: false,
            switch_window_warnings: 3,
            proctoring_enabled: false,
            max_attempts: 1,
            leaderboard_enabled: false,
            answer_shuffle: false,
            section_order_selection: false,
            quiz_pause_enabled: false,
            percentile_ranking: false,
            randomization_enabled: false,
            time_per_question: false,
            auto_submit: true,
            show_answers_after: 'after_submission',
            negative_marking: false,
            negative_marks_value: 0.25,
            partial_marking: false,
            question_navigation: true,
            review_mode: true,
            full_screen_mode: false,
            copy_paste_disabled: false,
            right_click_disabled: false
          },
          grading_system: dbQuiz.grading_system || {
            passing_percentage: 70,
            grades: [
              { name: 'A+', min_percentage: 90, max_percentage: 100, color: '#10B981' },
              { name: 'A', min_percentage: 80, max_percentage: 89, color: '#059669' },
              { name: 'B+', min_percentage: 70, max_percentage: 79, color: '#F59E0B' },
              { name: 'B', min_percentage: 60, max_percentage: 69, color: '#D97706' },
              { name: 'C', min_percentage: 50, max_percentage: 59, color: '#DC2626' },
              { name: 'F', min_percentage: 0, max_percentage: 49, color: '#991B1B' }
            ]
          }
        }));
        
        setQuizzes(transformedQuizzes);
      } else {
        console.log('📝 No quizzes found in database');
        setQuizzes([]);
      }
    } catch (error) {
      console.error('❌ Error loading quizzes:', error);
      setQuizzes([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCourse) {
      loadCourseClasses(selectedCourse);
    }
  }, [selectedCourse]);

  const loadCourseClasses = async (courseId: number) => {
    // Generate sample classes for each course
    const sampleClasses: CourseClass[] = [
      { id: courseId * 10 + 1, course_id: courseId, class_number: 1, title: "Introduction to AI", description: "Basic concepts", duration_minutes: 60 },
      { id: courseId * 10 + 2, course_id: courseId, class_number: 2, title: "Machine Learning Basics", description: "ML fundamentals", duration_minutes: 75 },
      { id: courseId * 10 + 3, course_id: courseId, class_number: 3, title: "Neural Networks", description: "Deep learning intro", duration_minutes: 90 },
      { id: courseId * 10 + 4, course_id: courseId, class_number: 4, title: "Deep Learning", description: "Advanced concepts", duration_minutes: 120 },
      { id: courseId * 10 + 5, course_id: courseId, class_number: 5, title: "AI Applications", description: "Real-world usage", duration_minutes: 105 }
    ];
    setCourseClasses(sampleClasses);
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

    // Validate based on question type
    if (newQuestion.type === 'multiple-choice') {
      const validOptions = newQuestion.options?.filter(opt => opt.trim()) || [];
      if (validOptions.length < 2) {
        alert('Please provide at least 2 options for multiple choice questions');
        return;
      }
      if (newQuestion.correct_answer === undefined || newQuestion.correct_answer === null) {
        alert('Please select the correct answer');
        return;
      }
    } else if (newQuestion.type === 'true-false') {
      if (!newQuestion.correct_answer) {
        alert('Please select True or False as the correct answer');
        return;
      }
    } else if (newQuestion.type === 'fill-blank' || newQuestion.type === 'numerical') {
      if (!newQuestion.correct_answer) {
        alert('Please provide the correct answer');
        return;
      }
    }

    const question: QuizQuestion = {
      id: Date.now(),
      section_id: 1,
      question: newQuestion.question!,
      type: newQuestion.type!,
      options: newQuestion.type === 'multiple-choice' ? newQuestion.options : undefined,
      correct_answer: newQuestion.correct_answer!,
      explanation: newQuestion.explanation,
      points: newQuestion.points || 10,
      negative_marks: newQuestion.negative_marks || 0,
      difficulty: newQuestion.difficulty || 'medium',
      image_url: newQuestion.image_url,
      has_multiple_correct: newQuestion.has_multiple_correct || false,
      tags: newQuestion.tags || []
    };

    setNewQuiz({
      ...newQuiz,
      questions: [...(newQuiz.questions || []), question]
    });

    // Reset question form
    setNewQuestion({
      question: '',
      type: 'multiple-choice',
      options: ['', '', '', ''],
      correct_answer: 0,
      explanation: '',
      points: 10,
      negative_marks: 0,
      difficulty: 'medium',
      image_url: undefined,
      has_multiple_correct: false,
      tags: []
    });
  };

  const saveQuiz = async () => {
    if (!newQuiz.title?.trim() || !newQuiz.questions?.length) {
      alert('Please provide quiz title and at least one question');
      return;
    }

    if (!selectedCourse || !selectedClass) {
      alert('Please select both course and class');
      return;
    }

    try {
      console.log('🔄 Saving quiz to database...');
      
      // Get the class number from the selected class
      const selectedClassObj = courseClasses.find(c => c.id === selectedClass);
      const classNumber = selectedClassObj?.class_number || 1;
      
      // Prepare quiz data for database (match the expected interface)
      const quizData = {
        course_id: selectedCourse,
        class_number: classNumber,
        title: newQuiz.title!,
        description: newQuiz.description || '',
        time_limit: newQuiz.time_limit || 30,
        questions: newQuiz.questions!.map(q => ({
          id: q.id,
          question: q.question,
          options: q.options || [],
          correctAnswer: typeof q.correct_answer === 'number' ? q.correct_answer : 
                        typeof q.correct_answer === 'string' ? parseInt(q.correct_answer as string) || 0 :
                        Array.isArray(q.correct_answer) ? (typeof q.correct_answer[0] === 'number' ? q.correct_answer[0] : parseInt(String(q.correct_answer[0])) || 0) : 0,
          explanation: q.explanation || ''
        }))
      };

      // Save to database using the createQuiz function from supabase.ts
      const { createQuiz } = await import('../utils/supabase');
      const result = await createQuiz(quizData);
      
      if (result.success) {
        const isUpdate = result.action === 'updated';
        const actionText = isUpdate ? 'updated' : 'created';
        
        console.log(`✅ Quiz ${actionText} successfully!`);
        
        // Update local state
        const quiz: Quiz = {
          id: result.quiz?.id || Date.now(),
          course_id: selectedCourse,
          class_id: selectedClass,
          title: newQuiz.title!,
          description: newQuiz.description!,
          instructions: newQuiz.instructions!,
          difficulty: newQuiz.difficulty!,
          time_limit: newQuiz.time_limit!,
          questions: newQuiz.questions!,
          created_at: new Date().toISOString(),
          is_active: newQuiz.is_active!,
          is_published: false,
          sections: newQuiz.sections!,
          configuration: newQuiz.configuration!,
          grading_system: newQuiz.grading_system!
        };

        // If updating, replace existing quiz in state; if creating, add new quiz
        if (isUpdate) {
          // Find and update existing quiz or add new one if not found locally
          const existingIndex = quizzes.findIndex(q => q.course_id === selectedCourse && q.class_id === selectedClass);
          if (existingIndex >= 0) {
            const updatedQuizzes = [...quizzes];
            updatedQuizzes[existingIndex] = quiz;
            setQuizzes(updatedQuizzes);
          } else {
            setQuizzes([...quizzes, quiz]);
          }
        } else {
          setQuizzes([...quizzes, quiz]);
        }
        
        setShowCreateQuizModal(false);
        
        // Reset form
        setNewQuiz({
          title: '',
          description: '',
          instructions: 'Read all questions carefully. You have limited time to complete this quiz.',
          difficulty: 'beginner',
          time_limit: 30,
          questions: [],
          is_active: true,
          is_published: false,
          sections: [],
          configuration: newQuiz.configuration,
          grading_system: newQuiz.grading_system
        });
        
        // Show success with detailed info
        const actionEmoji = isUpdate ? '🔄' : '✅';
        const actionMessage = isUpdate ? 
          `${actionEmoji} Quiz "${newQuiz.title}" updated successfully!\n\n📝 The existing quiz for this course/class has been replaced with your new content.` :
          `${actionEmoji} Quiz "${newQuiz.title}" created successfully!`;
        
        alert(`${actionMessage}\n\n📚 Course: ${courses.find(c => c.id === selectedCourse)?.name}\n📖 Class: ${classNumber}\n❓ Questions: ${newQuiz.questions!.length}\n⏱️ Time Limit: ${newQuiz.time_limit} minutes\n\nStudents can now access this quiz!`);
      } else {
        console.error('❌ Failed to save quiz:', result.error);
        alert(`Failed to save quiz: ${result.error}`);
      }
    } catch (error) {
      console.error('❌ Error saving quiz:', error);
      alert('Error saving quiz. Please try again.');
    }
  };

  const publishQuiz = (quizId: number) => {
    setQuizzes(quizzes.map(q => 
      q.id === quizId ? { ...q, is_published: true } : q
    ));
    alert('Quiz published successfully!');
  };

  const unpublishQuiz = (quizId: number) => {
    setQuizzes(quizzes.map(q => 
      q.id === quizId ? { ...q, is_published: false } : q
    ));
    alert('Quiz unpublished successfully! You can now edit it.');
  };

  const editQuiz = (quiz: Quiz) => {
    // Pre-populate the form with existing quiz data
    setNewQuiz({
      title: quiz.title,
      description: quiz.description,
      instructions: quiz.instructions || 'Read all questions carefully. You have limited time to complete this quiz.',
      difficulty: quiz.difficulty || 'beginner',
      time_limit: quiz.time_limit,
      questions: quiz.questions || [],
      is_active: quiz.is_active,
      is_published: false, // Always set to false when editing
      sections: quiz.sections || [],
      configuration: quiz.configuration,
      grading_system: quiz.grading_system
    });
    
    setSelectedCourse(quiz.course_id);
    setSelectedClass(quiz.class_id);
    setShowCreateQuizModal(true);
    
    alert('📝 Quiz loaded for editing! Make your changes and save to update the quiz.');
  };

  const deleteQuizFromDatabase = async (quiz: Quiz) => {
    if (window.confirm(`Are you sure you want to delete "${quiz.title}"? This action cannot be undone and will permanently remove the quiz from the database.`)) {
      try {
        console.log('🗑️ Deleting quiz:', quiz.title);
        
        // Import deleteQuiz function and delete from database
        const { deleteQuiz } = await import('../utils/supabase');
        const result = await deleteQuiz(quiz.id);
        
        if (result.success) {
          // Remove from local state only if database deletion succeeded
          setQuizzes(quizzes.filter(q => q.id !== quiz.id));
          alert(`✅ Quiz "${quiz.title}" deleted successfully!`);
          console.log('✅ Quiz deleted from both database and local state');
        } else {
          alert(`❌ Failed to delete quiz: ${result.error}`);
          console.error('❌ Database deletion failed:', result.error);
        }
      } catch (error) {
        console.error('❌ Error during quiz deletion:', error);
        alert('❌ Error deleting quiz. Please try again.');
      }
    }
  };

  const clearAllQuizzesFromDatabase = async () => {
    if (window.confirm('⚠️ WARNING: This will DELETE ALL QUIZZES from the database permanently! This action cannot be undone. Are you absolutely sure?')) {
      try {
        console.log('🗑️ Clearing all quizzes from database...');
        
        // Delete all quizzes one by one
        const deletePromises = quizzes.map(async (quiz) => {
          const { deleteQuiz } = await import('../utils/supabase');
          return deleteQuiz(quiz.id);
        });
        
        const results = await Promise.all(deletePromises);
        const successCount = results.filter(r => r.success).length;
        
        if (successCount === quizzes.length) {
          setQuizzes([]);
          alert(`✅ Successfully deleted all ${successCount} quizzes from the database!`);
          console.log('✅ All quizzes cleared successfully');
        } else {
          alert(`⚠️ Deleted ${successCount} out of ${quizzes.length} quizzes. Some may have failed.`);
          // Reload quizzes to see what's left
          loadQuizzes();
        }
      } catch (error) {
        console.error('❌ Error clearing all quizzes:', error);
        alert('❌ Error clearing quizzes. Please try again.');
      }
    }
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
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">🎯 Professional Quiz Suite (Learnyst-Level)</h1>
            <p className="text-gray-600 mt-2">Advanced quiz management with enterprise features & proctoring</p>
          </div>
          <div className="flex gap-3">
            {quizzes.length > 0 && (
              <button
                onClick={clearAllQuizzesFromDatabase}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                title="Clear all demo/fake quizzes from database"
              >
                <TrashIcon className="h-5 w-5" />
                Clear All Demo Data ({quizzes.length})
              </button>
            )}
            <button
              onClick={handleCreateQuiz}
              disabled={!selectedCourse || !selectedClass}
              className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                selectedCourse && selectedClass
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg transform hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <PlusIcon className="h-6 w-6" />
              Create Professional Quiz
            </button>
          </div>
        </div>
      </div>

      {/* Course and Class Selection */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">📚 Select Course & Class</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">🎓 Select Course</label>
            <select
              value={selectedCourse || ''}
              onChange={(e) => setSelectedCourse(e.target.value ? Number(e.target.value) : null)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Choose a course...</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name} - {course.instructor}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">📖 Select Class</label>
            <select
              value={selectedClass || ''}
              onChange={(e) => setSelectedClass(e.target.value ? Number(e.target.value) : null)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={!selectedCourse}
            >
              <option value="">Choose a class...</option>
              {courseClasses.map((classItem) => (
                <option key={classItem.id} value={classItem.id}>
                  Class {classItem.class_number}: {classItem.title}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {selectedCourse && selectedClass && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-medium">
              ✅ Ready to create quiz for: {courses.find(c => c.id === selectedCourse)?.name} - 
              Class {courseClasses.find(c => c.id === selectedClass)?.class_number}
            </p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-md border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total Quizzes</p>
              <p className="text-3xl font-bold text-blue-900">{quizzes.length}</p>
            </div>
            <QuestionMarkCircleIcon className="h-10 w-10 text-blue-600" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-md border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Published</p>
              <p className="text-3xl font-bold text-green-900">{quizzes.filter(q => q.is_published).length}</p>
            </div>
            <CheckCircleIcon className="h-10 w-10 text-green-600" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl shadow-md border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Total Questions</p>
              <p className="text-3xl font-bold text-purple-900">{quizzes.reduce((sum, q) => sum + q.questions.length, 0)}</p>
            </div>
            <BookOpenIcon className="h-10 w-10 text-purple-600" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl shadow-md border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-medium">With Images</p>
              <p className="text-3xl font-bold text-orange-900">{quizzes.filter(q => q.questions.some(qu => qu.image_url)).length}</p>
            </div>
            <div className="text-4xl">📷</div>
          </div>
        </div>
      </div>

      {/* Enhanced Quiz Creation Modal */}
      {showCreateQuizModal && (
        <div 
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center"
          style={{ zIndex: 99999 }}
        >
          <div className="bg-white p-6 rounded-lg max-w-5xl w-full mx-4 max-h-[95vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">🚀 Create Professional Quiz</h2>
              <button
                onClick={() => setShowCreateQuizModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-6">
              <p className="text-green-600 font-medium bg-green-50 p-3 rounded-lg border border-green-200">
                ✅ Creating quiz for: {courses.find(c => c.id === selectedCourse)?.name} - 
                Class {courseClasses.find(c => c.id === selectedClass)?.class_number}
              </p>
              
              {/* Quiz Basic Info */}
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">📝 Quiz Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quiz Title</label>
                    <input
                      type="text"
                      value={newQuiz.title || ''}
                      onChange={(e) => setNewQuiz({...newQuiz, title: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter quiz title..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time Limit (minutes)</label>
                    <input
                      type="number"
                      value={newQuiz.time_limit || 30}
                      onChange={(e) => setNewQuiz({...newQuiz, time_limit: parseInt(e.target.value)})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      min="5"
                      max="300"
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newQuiz.description || ''}
                    onChange={(e) => setNewQuiz({...newQuiz, description: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Enter quiz description..."
                  />
                </div>
              </div>

              {/* Question Creation Section */}
              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">❓ Add Questions</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Question Text</label>
                    <textarea
                      value={newQuestion.question || ''}
                      onChange={(e) => setNewQuestion({...newQuestion, question: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      rows={3}
                      placeholder="Enter your question here..."
                    />
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">📷 Question Image (Optional)</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-green-400 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              setNewQuestion({
                                ...newQuestion,
                                image_url: event.target?.result as string
                              });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                        id="question-image"
                      />
                      <label htmlFor="question-image" className="cursor-pointer block">
                        {newQuestion.image_url ? (
                          <div>
                            <img 
                              src={newQuestion.image_url} 
                              alt="Question" 
                              className="max-w-xs max-h-48 mx-auto mb-2 rounded shadow-md"
                            />
                            <p className="text-sm text-green-600 font-medium">✅ Image uploaded! Click to change</p>
                          </div>
                        ) : (
                          <div className="py-8">
                            <div className="text-5xl mb-3">📷</div>
                            <p className="text-gray-600 font-medium">Click to upload question image</p>
                            <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                          </div>
                        )}
                      </label>
                      {newQuestion.image_url && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setNewQuestion({...newQuestion, image_url: undefined});
                          }}
                          className="mt-3 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          🗑️ Remove Image
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Question Type</label>
                      <select
                        value={newQuestion.type || 'multiple-choice'}
                        onChange={(e) => setNewQuestion({
                          ...newQuestion, 
                          type: e.target.value as any,
                          options: e.target.value === 'multiple-choice' ? ['', '', '', ''] : undefined,
                          correct_answer: e.target.value === 'multiple-choice' ? 0 : ''
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      >
                        <option value="multiple-choice">📝 Multiple Choice</option>
                        <option value="true-false">✅ True/False</option>
                        <option value="fill-blank">📝 Fill in the Blank</option>
                        <option value="numerical">🔢 Numerical</option>
                        <option value="essay">📄 Essay</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Points</label>
                      <input
                        type="number"
                        value={newQuestion.points || 10}
                        onChange={(e) => setNewQuestion({...newQuestion, points: parseInt(e.target.value) || 10})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        min="1"
                        max="100"
                      />
                    </div>
                  </div>

                  {/* Multiple Choice Options */}
                  {newQuestion.type === 'multiple-choice' && (
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <label className="block text-sm font-medium text-gray-700 mb-3">📝 Answer Options</label>
                      <div className="space-y-3">
                        {(newQuestion.options || ['', '', '', '']).map((option, index) => (
                          <div key={index} className="flex gap-3 items-center">
                            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-800">
                              {String.fromCharCode(65 + index)}
                            </div>
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => {
                                const newOptions = [...(newQuestion.options || ['', '', '', ''])];
                                newOptions[index] = e.target.value;
                                setNewQuestion({...newQuestion, options: newOptions});
                              }}
                              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                              placeholder={`Enter option ${String.fromCharCode(65 + index)}...`}
                            />
                            <button
                              onClick={() => setNewQuestion({...newQuestion, correct_answer: index})}
                              className={`px-4 py-3 rounded-lg font-medium transition-all ${
                                newQuestion.correct_answer === index
                                  ? 'bg-green-500 text-white shadow-lg transform scale-105'
                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              }`}
                            >
                              {newQuestion.correct_answer === index ? '✅ Correct' : 'Mark Correct'}
                            </button>
                          </div>
                        ))}
                      </div>
                      
                      {/* Add/Remove Options */}
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => {
                            const currentOptions = newQuestion.options || ['', '', '', ''];
                            if (currentOptions.length < 6) {
                              setNewQuestion({
                                ...newQuestion,
                                options: [...currentOptions, '']
                              });
                            }
                          }}
                          className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                          disabled={(newQuestion.options || []).length >= 6}
                        >
                          ➕ Add Option
                        </button>
                        <button
                          onClick={() => {
                            const currentOptions = newQuestion.options || ['', '', '', ''];
                            if (currentOptions.length > 2) {
                              const newOptions = currentOptions.slice(0, -1);
                              const correctAnswer = newQuestion.correct_answer as number;
                              setNewQuestion({
                                ...newQuestion,
                                options: newOptions,
                                correct_answer: correctAnswer >= newOptions.length ? 0 : correctAnswer
                              });
                            }
                          }}
                          className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                          disabled={(newQuestion.options || []).length <= 2}
                        >
                          ➖ Remove Option
                        </button>
                      </div>
                    </div>
                  )}

                  {/* True/False Options */}
                  {newQuestion.type === 'true-false' && (
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <label className="block text-sm font-medium text-gray-700 mb-3">Select Correct Answer</label>
                      <div className="flex gap-4">
                        <button
                          onClick={() => setNewQuestion({...newQuestion, correct_answer: 'true'})}
                          className={`px-8 py-4 rounded-lg font-medium transition-all ${
                            newQuestion.correct_answer === 'true'
                              ? 'bg-green-500 text-white shadow-lg transform scale-105'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          ✅ True
                        </button>
                        <button
                          onClick={() => setNewQuestion({...newQuestion, correct_answer: 'false'})}
                          className={`px-8 py-4 rounded-lg font-medium transition-all ${
                            newQuestion.correct_answer === 'false'
                              ? 'bg-green-500 text-white shadow-lg transform scale-105'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          ❌ False
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Fill in the Blank / Numerical Answer */}
                  {(newQuestion.type === 'fill-blank' || newQuestion.type === 'numerical') && (
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Correct Answer</label>
                      <input
                        type={newQuestion.type === 'numerical' ? 'number' : 'text'}
                        value={newQuestion.correct_answer as string || ''}
                        onChange={(e) => setNewQuestion({...newQuestion, correct_answer: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        placeholder={newQuestion.type === 'numerical' ? 'Enter the correct number' : 'Enter the correct answer'}
                      />
                    </div>
                  )}

                  {/* Explanation */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">💡 Explanation (Optional)</label>
                    <textarea
                      value={newQuestion.explanation || ''}
                      onChange={(e) => setNewQuestion({...newQuestion, explanation: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      rows={2}
                      placeholder="Explain why this is the correct answer..."
                    />
                  </div>

                  <button
                    onClick={addQuestion}
                    disabled={!newQuestion.question?.trim()}
                    className={`w-full px-6 py-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                      newQuestion.question?.trim()
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 shadow-lg'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <PlusIcon className="h-5 w-5" />
                    Add Question to Quiz
                  </button>
                </div>
              </div>

              {/* Added Questions List */}
              {newQuiz.questions && newQuiz.questions.length > 0 && (
                <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">📋 Added Questions ({newQuiz.questions.length})</h3>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {newQuiz.questions.map((q, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full">
                                Q{index + 1}
                              </span>
                              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                                {q.type.replace('-', ' ')}
                              </span>
                              <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                                {q.points} pts
                              </span>
                              {q.image_url && (
                                <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">
                                  📷 Image
                                </span>
                              )}
                            </div>
                            <p className="font-medium text-gray-900 mb-1">
                              {q.question.length > 100 ? `${q.question.substring(0, 100)}...` : q.question}
                            </p>
                            {q.type === 'multiple-choice' && q.options && (
                              <div className="text-sm text-gray-600">
                                <span className="font-medium">Options:</span> {q.options.filter(opt => opt.trim()).length} | 
                                <span className="font-medium"> Correct:</span> {q.options[q.correct_answer as number] || 'Not set'}
                              </div>
                            )}
                            {(q.type === 'true-false' || q.type === 'fill-blank' || q.type === 'numerical') && (
                              <div className="text-sm text-gray-600">
                                <span className="font-medium">Correct Answer:</span> {q.correct_answer}
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => {
                              const updatedQuestions = newQuiz.questions?.filter((_, i) => i !== index);
                              setNewQuiz({...newQuiz, questions: updatedQuestions});
                            }}
                            className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                            title="Delete Question"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowCreateQuizModal(false)}
                  className="px-8 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveQuiz}
                  disabled={!newQuiz.title?.trim() || !newQuiz.questions?.length}
                  className={`px-8 py-3 rounded-lg font-medium transition-all ${
                    newQuiz.title?.trim() && newQuiz.questions?.length
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg transform hover:scale-105'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  🚀 Create Professional Quiz ({newQuiz.questions?.length || 0} questions)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quizzes List */}
      {quizzes.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">📝 Created Quizzes</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {quizzes.map((quiz) => (
                <div key={quiz.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{quiz.title}</h3>
                      <p className="text-gray-600 mt-1">{quiz.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span>⏱️ {quiz.time_limit} minutes</span>
                        <span>❓ {quiz.questions.length} questions</span>
                        <span>📊 {quiz.questions.reduce((sum, q) => sum + q.points, 0)} total points</span>
                        <span>📷 {quiz.questions.filter(q => q.image_url).length} with images</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedQuiz(quiz);
                          setShowViewQuizModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 p-2 rounded"
                        title="View Quiz"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => editQuiz(quiz)}
                        className="text-orange-600 hover:text-orange-900 p-2 rounded"
                        title="Edit Quiz"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      {!quiz.is_published ? (
                        <button
                          onClick={() => publishQuiz(quiz.id)}
                          className="text-emerald-600 hover:text-emerald-900 p-2 rounded"
                          title="Publish"
                        >
                          <PlayIcon className="h-5 w-5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => unpublishQuiz(quiz.id)}
                          className="text-yellow-600 hover:text-yellow-900 p-2 rounded"
                          title="Unpublish"
                        >
                          <PauseIcon className="h-5 w-5" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteQuizFromDatabase(quiz)}
                        className="text-red-600 hover:text-red-900 p-2 rounded"
                        title="Delete"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ManageQuizzesEnhanced; 