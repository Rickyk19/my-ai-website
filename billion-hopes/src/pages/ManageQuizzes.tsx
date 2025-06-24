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
import { supabase } from '../utils/supabase';

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

// Simplified QuizQuestion interface that matches database expectations
interface QuizQuestion {
  id: number;
  question: string;
  type?: 'multiple-choice' | 'true-false' | 'fill-blank' | 'numerical' | 'essay';
  options?: string[];
  correctAnswer: number | string;  // Support both number and string for different question types
  explanation?: string;
  points?: number;
  image_url?: string;
  // Additional properties for UI compatibility
  section_id?: number;
  negative_marks?: number;
  difficulty?: string;
  has_multiple_correct?: boolean;
  tags?: string[];
}

// Database-compatible Quiz interface
interface Quiz {
  id: number;
  course_id: number;
  class_id: number;
  title: string;
  description: string;
  instructions?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  time_limit: number;
  total_marks?: number;
  questions: QuizQuestion[];
  created_at: string;
  is_active?: boolean;
  is_published?: boolean;
  scheduled_date?: string;
  configuration?: QuizConfiguration;
  grading_system?: GradingSystem;
  sections?: QuizSection[];
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

interface QuizSection {
  id: number;
  title: string;
  time_limit: number;
  question_count: number;
  order: number;
}

const ManageQuizzes: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseClasses, setCourseClasses] = useState<CourseClass[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [showCreateQuizModal, setShowCreateQuizModal] = useState(false);
  const [showEditQuizModal, setShowEditQuizModal] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [showViewQuizModal, setShowViewQuizModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showGradingModal, setShowGradingModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeConfigTab, setActiveConfigTab] = useState('general');

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
    correctAnswer: 0,
    explanation: '',
    points: 10,
    negative_marks: 0,
    difficulty: 'medium',
    has_multiple_correct: false,
    tags: []
  });

  // Add states for editing existing questions
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);

  useEffect(() => {
    // Load courses and quizzes from Supabase database
    loadCourses();
    loadQuizzes();
  }, []);

  useEffect(() => {
    if (courses.length > 0) {
      loadAllCourseClasses();
    }
  }, [courses]);

  useEffect(() => {
    if (selectedCourse) {
      loadCourseClasses(selectedCourse);
    }
  }, [selectedCourse]);

  const loadCourses = async () => {
    try {
      console.log('Loading courses from Supabase...');
      
      // Use direct fetch with proper CORS headers (same approach as corsRequest in supabase.ts)
      const response = await fetch('https://ahvxqultshujqtmbkjpy.supabase.co/rest/v1/courses?select=id,name,description,instructor,duration,level&order=id.asc', {
        method: 'GET',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ',
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors',
        credentials: 'omit'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Courses loaded successfully:', data);
      
      if (data && data.length > 0) {
        // Map the data to match our Course interface
        const mappedCourses: Course[] = data.map((course: any) => ({
          id: course.id,
          name: course.name,
          description: course.description || 'No description available',
          instructor: course.instructor,
          duration: course.duration,
          level: course.level
        }));
        
        setCourses(mappedCourses);
        console.log(`Successfully loaded ${mappedCourses.length} courses from database`);
      } else {
        console.warn('No courses found in database');
        setCourses([]);
      }
    } catch (error) {
      console.error('Error loading courses from Supabase:', error);
      
      // For demo purposes, load some fallback courses so the system still works
      const fallbackCourses: Course[] = [
        {
          id: 1,
          name: "Complete Python Programming Masterclass",
          description: "Master Python from basics to advanced concepts",
          instructor: "Dr. Sarah Johnson",
          duration: "40 hours",
          level: "Beginner to Advanced"
        },
        {
          id: 2,
          name: "Machine Learning & AI Fundamentals",
          description: "Comprehensive introduction to ML algorithms",
          instructor: "Prof. Michael Chen",
          duration: "45 hours",
          level: "Intermediate"
        },
        {
          id: 3,
          name: "Full Stack Web Development Bootcamp",
          description: "Build modern web applications",
          instructor: "Alex Rodriguez",
          duration: "60 hours",
          level: "Beginner to Advanced"
        }
      ];
      setCourses(fallbackCourses);
      
      // Don't show alert anymore, just log the error
      console.warn('Using fallback courses due to connection issue');
    }
  };

  const loadCourseClasses = async (courseId: number) => {
    try {
      // Generate mock classes for the specific course with unique IDs based on courseId
      const mockClasses: CourseClass[] = [
        { id: courseId * 10 + 1, course_id: courseId, class_number: 1, title: "Introduction to AI", description: "Basic AI concepts", duration_minutes: 45 },
        { id: courseId * 10 + 2, course_id: courseId, class_number: 2, title: "Machine Learning Basics", description: "ML fundamentals", duration_minutes: 60 },
        { id: courseId * 10 + 3, course_id: courseId, class_number: 3, title: "Neural Networks", description: "Understanding neural networks", duration_minutes: 75 },
        { id: courseId * 10 + 4, course_id: courseId, class_number: 4, title: "Deep Learning", description: "Advanced deep learning", duration_minutes: 90 },
        { id: courseId * 10 + 5, course_id: courseId, class_number: 5, title: "AI Applications", description: "Real-world AI applications", duration_minutes: 60 }
      ];
      
      // Add to existing classes instead of replacing them
      setCourseClasses(prevClasses => {
        const filteredClasses = prevClasses.filter(c => c.course_id !== courseId);
        return [...filteredClasses, ...mockClasses];
      });
    } catch (error) {
      console.error('Error loading course classes:', error);
    }
  };

  // New function to load all course classes
  const loadAllCourseClasses = async () => {
    try {
      const allClasses: CourseClass[] = [];
      
      // Load classes for all courses
      for (const course of courses) {
        const mockClasses: CourseClass[] = [
          { id: course.id * 10 + 1, course_id: course.id, class_number: 1, title: "Introduction to AI", description: "Basic AI concepts", duration_minutes: 45 },
          { id: course.id * 10 + 2, course_id: course.id, class_number: 2, title: "Machine Learning Basics", description: "ML fundamentals", duration_minutes: 60 },
          { id: course.id * 10 + 3, course_id: course.id, class_number: 3, title: "Neural Networks", description: "Understanding neural networks", duration_minutes: 75 },
          { id: course.id * 10 + 4, course_id: course.id, class_number: 4, title: "Deep Learning", description: "Advanced deep learning", duration_minutes: 90 },
          { id: course.id * 10 + 5, course_id: course.id, class_number: 5, title: "AI Applications", description: "Real-world AI applications", duration_minutes: 60 }
        ];
        allClasses.push(...mockClasses);
      }
      
      setCourseClasses(allClasses);
    } catch (error) {
      console.error('Error loading all course classes:', error);
    }
  };

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
        const transformedQuizzes: Quiz[] = result.quizzes.map((dbQuiz: any) => {
          // Handle questions field - it might be a string (JSON) or already an array
          let questions: QuizQuestion[] = [];
          if (dbQuiz.questions) {
            if (typeof dbQuiz.questions === 'string') {
              try {
                questions = JSON.parse(dbQuiz.questions);
              } catch (error) {
                console.warn('Failed to parse questions JSON for quiz:', dbQuiz.id, error);
                questions = [];
              }
            } else if (Array.isArray(dbQuiz.questions)) {
              questions = dbQuiz.questions;
            }
          }

          // Handle sections field - it might be a string (JSON) or already an array
          let sections: QuizSection[] = [];
          if (dbQuiz.sections) {
            if (typeof dbQuiz.sections === 'string') {
              try {
                sections = JSON.parse(dbQuiz.sections);
              } catch (error) {
                console.warn('Failed to parse sections JSON for quiz:', dbQuiz.id, error);
                sections = [];
              }
            } else if (Array.isArray(dbQuiz.sections)) {
              sections = dbQuiz.sections;
            }
          }

          // Handle configuration field - it might be a string (JSON) or already an object
          let configuration = dbQuiz.configuration;
          if (typeof configuration === 'string') {
            try {
              configuration = JSON.parse(configuration);
            } catch (error) {
              console.warn('Failed to parse configuration JSON for quiz:', dbQuiz.id, error);
              configuration = null;
            }
          }

          // Handle grading_system field - it might be a string (JSON) or already an object
          let grading_system = dbQuiz.grading_system;
          if (typeof grading_system === 'string') {
            try {
              grading_system = JSON.parse(grading_system);
            } catch (error) {
              console.warn('Failed to parse grading_system JSON for quiz:', dbQuiz.id, error);
              grading_system = null;
            }
          }

          return {
            id: dbQuiz.id,
            course_id: dbQuiz.course_id,
            class_id: dbQuiz.class_id || dbQuiz.course_id * 10 + 1, // Generate proper class_id if not specified
            title: dbQuiz.title,
            description: dbQuiz.description || '',
            instructions: dbQuiz.instructions || 'Read all questions carefully.',
            difficulty: dbQuiz.difficulty || 'beginner',
            time_limit: dbQuiz.time_limit || 30,
            questions: questions,
                          created_at: dbQuiz.created_at || new Date().toISOString(),
              is_active: dbQuiz.is_active !== undefined ? dbQuiz.is_active : true,
              is_published: dbQuiz.is_active !== undefined ? dbQuiz.is_active : false, // Map is_active from DB to is_published for UI
            sections: sections,
            configuration: configuration || {
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
            grading_system: grading_system || {
              passing_percentage: 70,
              grades: [
                { name: 'A+', min_percentage: 90, max_percentage: 100, color: '#10B981' },
                { name: 'A', min_percentage: 80, max_percentage: 89, color: '#059669' },
                { name: 'B+', min_percentage: 70, max_percentage: 79, color: '#F59E0B' },
                { name: 'B', min_percentage: 60, max_percentage: 69, color: '#D97706' },
                { name: 'C', min_percentage: 50, max_percentage: 59, color: '#DC2626' },
                { name: 'F', min_percentage: 0, max_percentage: 49, color: '#991B1B' }
              ]
            },
            total_marks: dbQuiz.total_marks
          };
        });
        
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

  const handleCreateQuiz = () => {
    console.log('handleCreateQuiz called', { selectedCourse, selectedClass });
    if (!selectedCourse || !selectedClass) {
      alert('Please select a course and class first');
      return;
    }
    console.log('Setting up new quiz and opening modal...');
    setNewQuiz({
      ...newQuiz,
      course_id: selectedCourse,
      class_id: selectedClass
    });
    setShowCreateQuizModal(true);
    console.log('Modal should be opening now, showCreateQuizModal:', true);
  };

  const addQuestion = () => {
    if (!newQuestion.question?.trim()) {
      alert('Please enter a question');
      return;
    }

    const question: QuizQuestion = {
      id: Date.now(),
      question: newQuestion.question!,
      type: newQuestion.type,
      options: newQuestion.options,
      correctAnswer: newQuestion.correctAnswer!,
      explanation: newQuestion.explanation,
      points: newQuestion.points,
      image_url: newQuestion.image_url
    };

    if (isEditingQuestion && editingQuestionIndex !== null) {
      // Update existing question
      const updatedQuestions = [...(newQuiz.questions || [])];
      updatedQuestions[editingQuestionIndex] = question;
      setNewQuiz({
        ...newQuiz,
        questions: updatedQuestions
      });
      
      // Reset editing state
      setIsEditingQuestion(false);
      setEditingQuestionIndex(null);
    } else {
      // Add new question
      setNewQuiz({
        ...newQuiz,
        questions: [...(newQuiz.questions || []), question]
      });
    }

    // Reset form
    setNewQuestion({
      question: '',
      type: 'multiple-choice',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
      points: 10,
      negative_marks: 0,
      difficulty: 'medium',
      has_multiple_correct: false,
      tags: []
    });
  };

  // Function to start editing an existing question
  const startEditingQuestion = (index: number) => {
    const questionToEdit = newQuiz.questions?.[index];
    if (questionToEdit) {
      setNewQuestion({
        question: questionToEdit.question,
        type: questionToEdit.type || 'multiple-choice',
        options: questionToEdit.options || ['', '', '', ''],
        correctAnswer: questionToEdit.correctAnswer,
        explanation: questionToEdit.explanation || '',
        points: questionToEdit.points || 10,
        image_url: questionToEdit.image_url,
        negative_marks: questionToEdit.negative_marks || 0,
        difficulty: questionToEdit.difficulty || 'medium',
        has_multiple_correct: questionToEdit.has_multiple_correct || false,
        tags: questionToEdit.tags || []
      });
      setIsEditingQuestion(true);
      setEditingQuestionIndex(index);
    }
  };

  // Function to cancel editing
  const cancelEditingQuestion = () => {
    setIsEditingQuestion(false);
    setEditingQuestionIndex(null);
    setNewQuestion({
      question: '',
      type: 'multiple-choice',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
      points: 10,
      negative_marks: 0,
      difficulty: 'medium',
      has_multiple_correct: false,
      tags: []
    });
  };

  const saveQuiz = async () => {
    if (!newQuiz.title || !newQuiz.questions?.length) {
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
          correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : 
                        typeof q.correctAnswer === 'string' ? parseInt(q.correctAnswer as string) || 0 :
                        Array.isArray(q.correctAnswer) ? (q.correctAnswer[0] as number) || 0 : 0,
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
          instructions: newQuiz.instructions || '',
          difficulty: newQuiz.difficulty || 'beginner',
          time_limit: newQuiz.time_limit!,
          questions: newQuiz.questions!,
          created_at: new Date().toISOString(),
          is_active: newQuiz.is_active,
          is_published: false,
          sections: newQuiz.sections || [],
          configuration: newQuiz.configuration || {
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
          grading_system: newQuiz.grading_system || {
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
        
        // Close appropriate modal and reset state
        if (editingQuiz) {
          setShowEditQuizModal(false);
          setEditingQuiz(null);
        } else {
          setShowCreateQuizModal(false);
        }
        
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

  const publishQuiz = async (quizId: number) => {
    try {
      console.log('📤 Publishing quiz...');
      
      // Find the quiz to publish
      const quiz = quizzes.find(q => q.id === quizId);
      if (!quiz) {
        alert('Quiz not found!');
        return;
      }

      // Update the database directly with is_active field (the actual column name)
      const response = await fetch(`https://ahvxqultshujqtmbkjpy.supabase.co/rest/v1/class_quizzes?id=eq.${quizId}`, {
        method: 'PATCH',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ',
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors',
        credentials: 'omit',
        body: JSON.stringify({ 
          is_active: true,
          updated_at: new Date().toISOString()
        })
      });
      
      if (response.ok) {
        // Update local state only if database update succeeded
        // Map is_active to is_published for UI consistency
        setQuizzes(quizzes.map(q => 
          q.id === quizId ? { ...q, is_published: true, is_active: true } : q
        ));
        alert(`✅ Quiz "${quiz.title}" published successfully! Students can now access it.`);
        console.log('✅ Quiz published in database and local state updated');
      } else {
        const errorText = await response.text();
        alert(`❌ Failed to publish quiz: ${response.status}`);
        console.error('❌ Database publish failed:', response.status, errorText);
      }
    } catch (error) {
      console.error('❌ Error publishing quiz:', error);
      alert('❌ Error publishing quiz. Please try again.');
    }
  };

  const unpublishQuiz = async (quizId: number) => {
    try {
      console.log('📥 Unpublishing quiz...');
      
      // Find the quiz to unpublish
      const quiz = quizzes.find(q => q.id === quizId);
      if (!quiz) {
        alert('Quiz not found!');
        return;
      }

      // Update the database directly with is_active field (the actual column name)
      const response = await fetch(`https://ahvxqultshujqtmbkjpy.supabase.co/rest/v1/class_quizzes?id=eq.${quizId}`, {
        method: 'PATCH',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ',
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors',
        credentials: 'omit',
        body: JSON.stringify({ 
          is_active: false,
          updated_at: new Date().toISOString()
        })
      });
      
      if (response.ok) {
        // Update local state only if database update succeeded
        // Map is_active to is_published for UI consistency
        setQuizzes(quizzes.map(q => 
          q.id === quizId ? { ...q, is_published: false, is_active: false } : q
        ));
        alert(`✅ Quiz "${quiz.title}" unpublished successfully! You can now edit it.`);
        console.log('✅ Quiz unpublished in database and local state updated');
      } else {
        const errorText = await response.text();
        alert(`❌ Failed to unpublish quiz: ${response.status}`);
        console.error('❌ Database unpublish failed:', response.status, errorText);
      }
    } catch (error) {
      console.error('❌ Error unpublishing quiz:', error);
      alert('❌ Error unpublishing quiz. Please try again.');
    }
  };

  const editQuiz = (quiz: Quiz) => {
    setEditingQuiz(quiz);
    setSelectedCourse(quiz.course_id);
    setSelectedClass(quiz.class_id);
    
    // Safely handle questions - ensure it's always an array
    let safeQuestions: QuizQuestion[] = [];
    if (quiz.questions) {
      if (typeof quiz.questions === 'string') {
        try {
          safeQuestions = JSON.parse(quiz.questions);
        } catch (error) {
          console.warn('Failed to parse questions JSON for quiz:', quiz.id, error);
          safeQuestions = [];
        }
      } else if (Array.isArray(quiz.questions)) {
        safeQuestions = quiz.questions;
      }
    }
    
    // Pre-populate the form with existing quiz data
    setNewQuiz({
      title: quiz.title,
      description: quiz.description,
      instructions: quiz.instructions || 'Read all questions carefully. You have limited time to complete this quiz.',
      difficulty: quiz.difficulty || 'beginner',
      time_limit: quiz.time_limit,
      questions: safeQuestions, // Use the safely processed questions array
      is_active: quiz.is_active !== undefined ? quiz.is_active : true,
      is_published: false, // Always set to false when editing
      sections: quiz.sections || [],
      configuration: quiz.configuration || {
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
      grading_system: quiz.grading_system || {
        passing_percentage: 60,
        grades: [
          { name: 'A+', min_percentage: 90, max_percentage: 100, color: '#10B981' },
          { name: 'A', min_percentage: 80, max_percentage: 89, color: '#059669' },
          { name: 'B+', min_percentage: 70, max_percentage: 79, color: '#F59E0B' },
          { name: 'B', min_percentage: 60, max_percentage: 69, color: '#D97706' },
          { name: 'C', min_percentage: 50, max_percentage: 59, color: '#DC2626' },
          { name: 'F', min_percentage: 0, max_percentage: 49, color: '#991B1B' }
        ]
      },
      total_marks: quiz.total_marks
    });
    
    setShowEditQuizModal(true);
  };

  const duplicateQuiz = (quiz: Quiz) => {
    const duplicatedQuiz: Quiz = {
      ...quiz,
      id: Date.now(),
      title: `${quiz.title} (Copy)`,
      is_published: false,
      created_at: new Date().toISOString()
    };
    setQuizzes([...quizzes, duplicatedQuiz]);
    alert('Quiz duplicated successfully!');
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

  // Helper function to safely parse questions data
  const safelyParseQuestions = (questions: any): QuizQuestion[] => {
    if (!questions) return [];
    
    if (Array.isArray(questions)) return questions;
    
    if (typeof questions === 'string') {
      try {
        const parsed = JSON.parse(questions);
        return Array.isArray(parsed) ? parsed : [];
      } catch (error) {
        console.warn('Failed to parse questions JSON:', error);
        return [];
      }
    }
    
    return [];
  };

  // Helper function to safely parse any JSON field
  const safelyParseJsonField = (field: any, fallback: any = null): any => {
    if (!field) return fallback;
    
    if (typeof field === 'string') {
      try {
        return JSON.parse(field);
      } catch (error) {
        console.warn('Failed to parse JSON field:', error);
        return fallback;
      }
    }
    
    return field;
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
          <h1 className="text-3xl font-bold text-gray-900">🚀 Professional Quiz Management</h1>
          <p className="text-gray-600">Create advanced quizzes with proctoring, analytics & Learnyst-level features</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCreateQuiz}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all flex items-center gap-2 shadow-lg"
          >
            <PlusIcon className="h-5 w-5" />
            Create Professional Quiz
          </button>
        </div>
      </div>

      {/* Course and Class Selection Filters */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">📚 Select Course & Class</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🎓 Select Course
            </label>
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
            {courses.length === 0 && (
              <p className="text-sm text-gray-500 mt-2">
                ⚠️ No courses found. Please add courses first.
              </p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📖 Select Class
            </label>
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
            {!selectedCourse && (
              <p className="text-sm text-gray-500 mt-2">
                Please select a course first
              </p>
            )}
            {selectedCourse && courseClasses.length === 0 && (
              <p className="text-sm text-gray-500 mt-2">
                No classes available for this course
              </p>
            )}
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

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
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
              <p className="text-purple-600 text-sm font-medium">🎥 Proctored</p>
              <p className="text-3xl font-bold text-purple-900">{quizzes.filter(q => q.configuration?.proctoring_enabled).length}</p>
            </div>
            <ShieldCheckIcon className="h-10 w-10 text-purple-600" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl shadow-md border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-medium">🏆 With Leaderboard</p>
              <p className="text-3xl font-bold text-orange-900">{quizzes.filter(q => q.configuration?.leaderboard_enabled).length}</p>
            </div>
            <TrophyIcon className="h-10 w-10 text-orange-600" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl shadow-md border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium">🖥️ Mock Tests</p>
              <p className="text-3xl font-bold text-red-900">{quizzes.filter(q => q.configuration?.mocktest_template).length}</p>
            </div>
            <ComputerDesktopIcon className="h-10 w-10 text-red-600" />
          </div>
        </div>
      </div>

      {/* Professional Quizzes Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
          <h2 className="text-2xl font-bold text-gray-900">🎯 Professional Quiz Suite (Learnyst-Level)</h2>
          <p className="text-gray-600 mt-1">Advanced quiz management with enterprise features & proctoring</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quiz Details</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">🚀 Pro Features</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">🔒 Security</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {quizzes.map((quiz) => (
                <tr key={quiz.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-lg font-semibold text-gray-900">{quiz.title}</div>
                      <div className="text-sm text-gray-500">{quiz.description}</div>
                      
                      {/* Course and Class Information */}
                      <div className="flex items-center gap-3 mt-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-1 text-xs text-blue-700">
                          <span className="font-medium">📚 Course:</span>
                          <span className="font-semibold">
                            {courses.find(c => c.id === quiz.course_id)?.name || `Course ID: ${quiz.course_id}`}
                          </span>
                        </div>
                        <div className="w-px h-3 bg-blue-300"></div>
                        <div className="flex items-center gap-1 text-xs text-blue-700">
                          <span className="font-medium">📖 Class:</span>
                          <span className="font-semibold">
                            Class {courseClasses.find(c => c.id === quiz.class_id)?.class_number || 'Unknown'}: {courseClasses.find(c => c.id === quiz.class_id)?.title || 'Unknown Class'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                        <span>⏱️ {quiz.time_limit} min</span>
                        <span>📝 {quiz.questions.length} questions</span>
                        <span>🎯 {quiz.sections?.length || 0} sections</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {quiz.configuration?.mocktest_template && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <ComputerDesktopIcon className="h-3 w-3 mr-1" />
                          🖥️ Mock Test
                        </span>
                      )}
                      {quiz.configuration?.calculator_type !== 'none' && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CalculatorIcon className="h-3 w-3 mr-1" />
                          🧮 Calculator
                        </span>
                      )}
                      {quiz.configuration?.leaderboard_enabled && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <TrophyIcon className="h-3 w-3 mr-1" />
                          🏆 Leaderboard
                        </span>
                      )}
                      {quiz.configuration?.percentile_ranking && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          <ChartBarIcon className="h-3 w-3 mr-1" />
                          📊 Percentile
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {quiz.configuration?.proctoring_enabled && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <ShieldCheckIcon className="h-3 w-3 mr-1" />
                          🎥 Proctored
                        </span>
                      )}
                      {quiz.configuration?.window_restriction && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                          🚫 No Switch
                        </span>
                      )}
                      {quiz.configuration?.full_screen_mode && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          📺 Fullscreen
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        quiz.is_published ? 'bg-green-100 text-green-800' : 
                        quiz.scheduled_date ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {quiz.is_published ? '🔴 Live' : quiz.scheduled_date ? '⏰ Scheduled' : '📝 Draft'}
                      </span>
                      {quiz.scheduled_date && (
                        <div className="text-xs text-gray-500">
                          📅 {new Date(quiz.scheduled_date).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedQuiz(quiz);
                          setShowViewQuizModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded"
                        title="View Quiz"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedQuiz(quiz);
                          setShowConfigModal(true);
                        }}
                        className="text-purple-600 hover:text-purple-900 p-1 rounded"
                        title="🚀 Professional Configure"
                      >
                        <CogIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => editQuiz(quiz)}
                        className="text-orange-600 hover:text-orange-900 p-1 rounded"
                        title="Edit Quiz"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => duplicateQuiz(quiz)}
                        className="text-green-600 hover:text-green-900 p-1 rounded"
                        title="Duplicate"
                      >
                        <DocumentDuplicateIcon className="h-5 w-5" />
                      </button>
                      {!quiz.is_published ? (
                        <button
                          onClick={() => publishQuiz(quiz.id)}
                          className="text-emerald-600 hover:text-emerald-900 p-1 rounded"
                          title="Publish"
                        >
                          <PlayIcon className="h-5 w-5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => unpublishQuiz(quiz.id)}
                          className="text-yellow-600 hover:text-yellow-900 p-1 rounded"
                          title="Unpublish"
                        >
                          <PauseIcon className="h-5 w-5" />
                        </button>
                      )}
                      <button
                        onClick={async () => {
                          if (window.confirm('Are you sure you want to delete this quiz? This action cannot be undone and will permanently remove the quiz from the database.')) {
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
                        }}
                        className="text-red-600 hover:text-red-900 p-1 rounded"
                        title="Delete"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Advanced Quiz Configuration Modal */}
      <AdvancedQuizConfig
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
        quiz={selectedQuiz}
        courses={courses}
        courseClasses={courseClasses}
        onSave={(config) => {
          if (selectedQuiz) {
            setQuizzes(quizzes.map(q => 
              q.id === selectedQuiz.id 
                ? { ...q, configuration: config }
                : q
            ));
            alert('🚀 Professional configuration saved successfully!');
          }
        }}
      />

      {/* Enhanced Quiz Creation Modal with Question Builder */}
      {showCreateQuizModal && (
        <div 
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center"
          style={{ zIndex: 99999 }}
        >
          <div className="bg-white p-8 rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
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
              <p className="text-green-600 font-medium">
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

              {/* Quiz Scoring & Marking Configuration */}
              <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">🎯 Quiz Scoring & Marking System</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Passing Criteria */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-800">📊 Passing Criteria</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Passing Percentage</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={newQuiz.grading_system?.passing_percentage || 60}
                          onChange={(e) => setNewQuiz({
                            ...newQuiz,
                            grading_system: {
                              ...newQuiz.grading_system!,
                              passing_percentage: parseInt(e.target.value) || 60
                            }
                          })}
                          className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                          min="0"
                          max="100"
                        />
                        <span className="text-gray-600">%</span>
                        <span className="text-sm text-gray-500">minimum to pass</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Total Quiz Marks</label>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={newQuiz.total_marks || 0}
                            onChange={(e) => setNewQuiz({
                              ...newQuiz,
                              total_marks: parseInt(e.target.value) || 0
                            })}
                            className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                            min="0"
                            max="1000"
                            placeholder="100"
                          />
                          <span className="text-gray-600">marks</span>
                          <button
                            type="button"
                            onClick={() => setNewQuiz({
                              ...newQuiz,
                              total_marks: newQuiz.questions?.reduce((sum, q) => sum + (q.points || 0), 0) || 0
                            })}
                            className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                          >
                            Auto-calc
                          </button>
                        </div>
                        <div className="text-xs text-gray-500">
                          Questions total: {newQuiz.questions?.reduce((sum, q) => sum + (q.points || 0), 0) || 0} marks
                          {newQuiz.total_marks !== (newQuiz.questions?.reduce((sum, q) => sum + (q.points || 0), 0) || 0) && (
                            <span className="text-orange-600 font-medium"> (Custom total set)</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Negative Marking */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-800">❌ Negative Marking</h4>
                    
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="negative-marking"
                        checked={newQuiz.configuration?.negative_marking || false}
                        onChange={(e) => setNewQuiz({
                          ...newQuiz,
                          configuration: {
                            ...newQuiz.configuration!,
                            negative_marking: e.target.checked
                          }
                        })}
                        className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500"
                      />
                      <label htmlFor="negative-marking" className="text-sm font-medium text-gray-700">
                        Enable Negative Marking
                      </label>
                    </div>

                    {newQuiz.configuration?.negative_marking && (
                      <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Negative Marks per Wrong Answer
                            </label>
                            <div className="flex items-center gap-2">
                              <span className="text-red-600">-</span>
                              <input
                                type="number"
                                step="0.25"
                                value={newQuiz.configuration?.negative_marks_value || 0.25}
                                onChange={(e) => setNewQuiz({
                                  ...newQuiz,
                                  configuration: {
                                    ...newQuiz.configuration!,
                                    negative_marks_value: parseFloat(e.target.value) || 0.25
                                  }
                                })}
                                className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                                min="0"
                                max="10"
                              />
                              <span className="text-gray-600">marks</span>
                            </div>
                          </div>

                          <div className="text-xs text-red-600 bg-red-100 p-2 rounded">
                            <strong>⚠️ Negative Marking Rules:</strong>
                            <ul className="mt-1 space-y-1">
                              <li>• Wrong answer: -{newQuiz.configuration?.negative_marks_value || 0.25} marks</li>
                              <li>• Correct answer: +{newQuestion.points || 10} marks (per question)</li>
                              <li>• No answer: 0 marks</li>
                              <li>• Minimum score: 0 (won't go below zero)</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Grading Scale */}
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-800 mb-3">🏆 Grading Scale</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {newQuiz.grading_system?.grades.map((grade, index) => (
                      <div key={index} className="bg-white p-3 rounded-lg border border-gray-200 text-center">
                        <div 
                          className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold text-sm"
                          style={{ backgroundColor: grade.color }}
                        >
                          {grade.name}
                        </div>
                        <div className="text-xs text-gray-600">
                          {grade.min_percentage}%-{grade.max_percentage}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Advanced Scoring Options */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="partial-marking"
                      checked={newQuiz.configuration?.partial_marking || false}
                      onChange={(e) => setNewQuiz({
                        ...newQuiz,
                        configuration: {
                          ...newQuiz.configuration!,
                          partial_marking: e.target.checked
                        }
                      })}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="partial-marking" className="text-sm font-medium text-gray-700">
                      🔄 Partial Marking (for multi-select questions)
                    </label>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="show-marks"
                      checked={newQuiz.configuration?.show_question_marks || true}
                      onChange={(e) => setNewQuiz({
                        ...newQuiz,
                        configuration: {
                          ...newQuiz.configuration!,
                          show_question_marks: e.target.checked
                        }
                      })}
                      className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                    />
                    <label htmlFor="show-marks" className="text-sm font-medium text-gray-700">
                      👁️ Show marks to students during quiz
                    </label>
                  </div>
                </div>

                {/* Scoring Summary */}
                <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                  <h5 className="font-semibold text-gray-800 mb-2">📈 Scoring Summary</h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Total Questions:</span>
                      <div className="font-bold text-blue-600">{newQuiz.questions?.length || 0}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Total Marks:</span>
                      <div className="font-bold text-green-600">
                        {newQuiz.questions?.reduce((sum, q) => sum + (q.points || 0), 0) || 0}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Pass Marks:</span>
                      <div className="font-bold text-yellow-600">
                        {Math.ceil(((newQuiz.questions?.reduce((sum, q) => sum + (q.points || 0), 0) || 0) * (newQuiz.grading_system?.passing_percentage || 60)) / 100)}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Negative Marking:</span>
                      <div className={`font-bold ${newQuiz.configuration?.negative_marking ? 'text-red-600' : 'text-gray-400'}`}>
                        {newQuiz.configuration?.negative_marking ? `Yes (-${newQuiz.configuration?.negative_marks_value})` : 'No'}
                      </div>
                    </div>
                  </div>
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
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
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
                      <label htmlFor="question-image" className="cursor-pointer">
                        {newQuestion.image_url ? (
                          <div>
                            <img 
                              src={newQuestion.image_url} 
                              alt="Question" 
                              className="max-w-xs mx-auto mb-2 rounded"
                            />
                            <p className="text-sm text-green-600">✅ Image uploaded! Click to change</p>
                          </div>
                        ) : (
                          <div>
                            <div className="text-4xl mb-2">📷</div>
                            <p className="text-gray-600">Click to upload question image</p>
                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                          </div>
                        )}
                      </label>
                      {newQuestion.image_url && (
                        <button
                          onClick={() => setNewQuestion({...newQuestion, image_url: undefined})}
                          className="mt-2 text-red-500 hover:text-red-700 text-sm"
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
                          options: e.target.value === 'multiple-choice' ? ['', '', '', ''] : undefined
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      >
                        <option value="multiple-choice">Multiple Choice</option>
                        <option value="true-false">True/False</option>
                        <option value="fill-blank">Fill in the Blank</option>
                        <option value="numerical">Numerical</option>
                        <option value="essay">Essay</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Points</label>
                      <input
                        type="number"
                        value={newQuestion.points || 10}
                        onChange={(e) => setNewQuestion({...newQuestion, points: parseInt(e.target.value)})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        min="1"
                        max="100"
                      />
                    </div>
                  </div>

                  {/* Multiple Choice Options */}
                  {newQuestion.type === 'multiple-choice' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">📝 Answer Options</label>
                      <div className="space-y-3">
                        {(newQuestion.options || ['', '', '', '']).map((option, index) => (
                          <div key={index} className="flex gap-3 items-center">
                            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-800">
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
                              placeholder={`Option ${String.fromCharCode(65 + index)}`}
                            />
                            <button
                              onClick={() => setNewQuestion({...newQuestion, correctAnswer: index})}
                              className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                                newQuestion.correctAnswer === index
                                  ? 'bg-green-500 text-white shadow-lg'
                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              }`}
                            >
                              {newQuestion.correctAnswer === index ? '✅ Correct' : 'Mark Correct'}
                            </button>
                          </div>
                        ))}
                      </div>
                      
                      {/* Add/Remove Options */}
                      <div className="flex gap-2 mt-3">
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
                          className="px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                          disabled={(newQuestion.options || []).length >= 6}
                        >
                          ➕ Add Option
                        </button>
                        <button
                          onClick={() => {
                            const currentOptions = newQuestion.options || ['', '', '', ''];
                            if (currentOptions.length > 2) {
                              setNewQuestion({
                                ...newQuestion,
                                options: currentOptions.slice(0, -1)
                              });
                            }
                          }}
                          className="px-3 py-2 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                          disabled={(newQuestion.options || []).length <= 2}
                        >
                          ➖ Remove Option
                        </button>
                      </div>
                    </div>
                  )}

                  {/* True/False Options */}
                  {newQuestion.type === 'true-false' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Correct Answer</label>
                      <div className="flex gap-4">
                        <button
                          onClick={() => setNewQuestion({...newQuestion, correctAnswer: 'true'})}
                          className={`px-6 py-3 rounded-lg font-medium ${
                            newQuestion.correctAnswer === 'true'
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          ✅ True
                        </button>
                        <button
                          onClick={() => setNewQuestion({...newQuestion, correctAnswer: 'false'})}
                          className={`px-6 py-3 rounded-lg font-medium ${
                            newQuestion.correctAnswer === 'false'
                              ? 'bg-green-500 text-white'
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
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Correct Answer</label>
                      <input
                        type={newQuestion.type === 'numerical' ? 'number' : 'text'}
                        value={newQuestion.correctAnswer as string || ''}
                        onChange={(e) => setNewQuestion({...newQuestion, correctAnswer: e.target.value})}
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
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all flex items-center justify-center gap-2 font-medium"
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
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {(newQuiz.questions && Array.isArray(newQuiz.questions) ? newQuiz.questions : []).map((q, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded">
                                Q{index + 1}
                              </span>
                              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                                {q.type}
                              </span>
                              <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                                {q.points} pts
                              </span>
                              {q.image_url && (
                                <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded">
                                  📷 Image
                                </span>
                              )}
                            </div>
                            <p className="font-medium text-gray-900 mb-1">
                              {q.question.length > 80 ? `${q.question.substring(0, 80)}...` : q.question}
                            </p>
                            {q.type === 'multiple-choice' && q.options && (
                              <div className="text-sm text-gray-600">
                                Options: {q.options.filter(opt => opt.trim()).length} | 
                                Correct: {q.options[q.correctAnswer as number] || 'Not set'}
                              </div>
                            )}
                            {q.type === 'true-false' && (
                              <div className="text-sm text-gray-600">
                                Correct Answer: {q.correctAnswer}
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => {
                              const updatedQuestions = newQuiz.questions?.filter((_, i) => i !== index);
                              setNewQuiz({...newQuiz, questions: updatedQuestions});
                            }}
                            className="text-red-500 hover:text-red-700 p-1"
                            title="Delete Question"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowCreateQuizModal(false)}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={saveQuiz}
                  disabled={!newQuiz.title || !newQuiz.questions?.length}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    newQuiz.title && newQuiz.questions?.length
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  🚀 Create Professional Quiz
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Quiz Modal */}
      {showEditQuizModal && (
        <div 
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center"
          style={{ zIndex: 99999 }}
        >
          <div className="bg-white p-8 rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">✏️ Edit Professional Quiz</h2>
              <button
                onClick={() => {
                  setShowEditQuizModal(false);
                  setEditingQuiz(null);
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-6">
              {editingQuiz && (
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <p className="text-orange-800 font-medium">
                    ✏️ Editing quiz: <strong>{editingQuiz.title}</strong> - 
                    {courses.find(c => c.id === editingQuiz.course_id)?.name} - 
                    Class {courseClasses.find(c => c.id === editingQuiz.class_id)?.class_number}
                  </p>
                  <p className="text-orange-600 text-sm mt-1">
                    📝 Quiz is automatically unpublished when edited. You can republish after saving changes.
                  </p>
                </div>
              )}
              
              {/* Quiz Basic Info - Same as Create Modal */}
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

              {/* Existing Questions List for Editing */}
              {newQuiz.questions && newQuiz.questions.length > 0 && (
                <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">📋 Current Questions ({newQuiz.questions.length})</h3>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {(newQuiz.questions && Array.isArray(newQuiz.questions) ? newQuiz.questions : []).map((q, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded">
                                Q{index + 1}
                              </span>
                              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                                {q.type}
                              </span>
                              <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                                {q.points} pts
                              </span>
                            </div>
                            <p className="font-medium text-gray-900 mb-1">
                              {q.question.length > 80 ? `${q.question.substring(0, 80)}...` : q.question}
                            </p>
                            {q.type === 'multiple-choice' && q.options && (
                              <div className="text-sm text-gray-600">
                                Options: {q.options.filter(opt => opt.trim()).length} | 
                                Correct: {q.options[q.correctAnswer as number] || 'Not set'}
                              </div>
                            )}
                            {q.type === 'true-false' && (
                              <div className="text-sm text-gray-600">
                                Correct Answer: {q.correctAnswer}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => startEditingQuestion(index)}
                              className="text-blue-500 hover:text-blue-700 p-1 rounded-lg hover:bg-blue-50 transition-colors"
                              title="Edit Question"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                const updatedQuestions = newQuiz.questions?.filter((_, i) => i !== index);
                                setNewQuiz({...newQuiz, questions: updatedQuestions});
                              }}
                              className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 transition-colors"
                              title="Delete Question"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add New Question Section - Same as Create Modal */}
              <div className={`p-6 rounded-lg border ${isEditingQuestion ? 'bg-orange-50 border-orange-200' : 'bg-green-50 border-green-200'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">
                    {isEditingQuestion ? '✏️ Edit Question' : '➕ Add New Question'}
                  </h3>
                  {isEditingQuestion && (
                    <button
                      onClick={cancelEditingQuestion}
                      className="text-gray-500 hover:text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
                {isEditingQuestion && (
                  <div className="mb-4 p-3 bg-orange-100 rounded-lg border border-orange-200">
                    <p className="text-orange-800 text-sm">
                      ✏️ You are editing Question {editingQuestionIndex !== null ? editingQuestionIndex + 1 : ''}. 
                      Make your changes below and click "Update Question" to save.
                    </p>
                  </div>
                )}
                <div className="space-y-4">
                  {/* Question Type Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Question Type</label>
                    <select
                      value={newQuestion.type || 'multiple-choice'}
                      onChange={(e) => setNewQuestion({...newQuestion, type: e.target.value as any})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value="multiple-choice">Multiple Choice</option>
                      <option value="true-false">True/False</option>
                      <option value="fill-blank">Fill in the Blank</option>
                      <option value="numerical">Numerical Answer</option>
                    </select>
                  </div>

                  {/* Question Text */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
                    <textarea
                      value={newQuestion.question || ''}
                      onChange={(e) => setNewQuestion({...newQuestion, question: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      rows={3}
                      placeholder="Enter your question here..."
                    />
                  </div>

                  {/* Points */}
                  <div className="grid grid-cols-2 gap-4">
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
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Answer Options</label>
                      <div className="space-y-3">
                        {(newQuestion.options || ['', '', '', '']).map((option, index) => (
                          <div key={index} className="flex gap-3 items-center">
                            <span className="text-sm font-medium text-gray-600 w-8">
                              {String.fromCharCode(65 + index)}.
                            </span>
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => {
                                const updatedOptions = [...(newQuestion.options || ['', '', '', ''])];
                                updatedOptions[index] = e.target.value;
                                setNewQuestion({...newQuestion, options: updatedOptions});
                              }}
                              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                              placeholder={`Option ${String.fromCharCode(65 + index)}`}
                            />
                            <button
                              onClick={() => setNewQuestion({...newQuestion, correctAnswer: index})}
                              className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                                newQuestion.correctAnswer === index
                                  ? 'bg-green-500 text-white shadow-lg'
                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              }`}
                            >
                              {newQuestion.correctAnswer === index ? '✅ Correct' : 'Mark Correct'}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* True/False Options */}
                  {newQuestion.type === 'true-false' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Correct Answer</label>
                      <div className="flex gap-4">
                        <button
                          onClick={() => setNewQuestion({...newQuestion, correctAnswer: 'true'})}
                          className={`px-6 py-3 rounded-lg font-medium ${
                            newQuestion.correctAnswer === 'true'
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          ✅ True
                        </button>
                        <button
                          onClick={() => setNewQuestion({...newQuestion, correctAnswer: 'false'})}
                          className={`px-6 py-3 rounded-lg font-medium ${
                            newQuestion.correctAnswer === 'false'
                              ? 'bg-green-500 text-white'
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
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Correct Answer</label>
                      <input
                        type={newQuestion.type === 'numerical' ? 'number' : 'text'}
                        value={newQuestion.correctAnswer as string || ''}
                        onChange={(e) => setNewQuestion({...newQuestion, correctAnswer: e.target.value})}
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
                    className={`w-full text-white px-6 py-3 rounded-lg transition-all flex items-center justify-center gap-2 font-medium ${
                      isEditingQuestion 
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600' 
                        : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                    }`}
                  >
                    {isEditingQuestion ? (
                      <>
                        <PencilIcon className="h-5 w-5" />
                        Update Question
                      </>
                    ) : (
                      <>
                        <PlusIcon className="h-5 w-5" />
                        Add Question to Quiz
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowEditQuizModal(false);
                    setEditingQuiz(null);
                  }}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={saveQuiz}
                  disabled={!newQuiz.title || !newQuiz.questions?.length}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    newQuiz.title && newQuiz.questions?.length
                      ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white hover:from-orange-700 hover:to-red-700 shadow-lg'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  ✏️ Save Quiz Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ManageQuizzes;
