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
  total_marks?: number;
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

const ManageQuizzes: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseClasses, setCourseClasses] = useState<CourseClass[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [showCreateQuizModal, setShowCreateQuizModal] = useState(false);
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
    correct_answer: 0,
    explanation: '',
    points: 10,
    negative_marks: 0,
    difficulty: 'medium',
    has_multiple_correct: false,
    tags: []
  });

  useEffect(() => {
    // Load sample courses immediately for demo purposes
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
      },
      {
        id: 6,
        name: "Complete Python Programming Masterclass",
        description: "Master Python from basics to advanced concepts",
        instructor: "Dr. Python Master",
        duration: "20 weeks",
        level: "Beginner to Advanced"
      }
    ];
    setCourses(sampleCourses);
    
    // Create demo Python quiz
    const pythonDemoQuiz: Quiz = {
      id: 999,
      course_id: 6,
      class_id: 61, // Class 1 of Python course
      title: "Python Basics - Variables and Data Types",
      description: "Test your understanding of Python fundamentals including variables, data types, and basic operations.",
      instructions: "Read each question carefully. Some questions include code examples. You have 30 minutes to complete this quiz.",
      difficulty: 'beginner',
      time_limit: 30,
      total_marks: 100,
      questions: [
        {
          id: 1,
          section_id: 1,
          question: "What is the correct way to create a variable in Python?",
          type: 'multiple-choice',
          options: [
            'var x = 5',
            'x = 5',
            'int x = 5',
            'variable x = 5'
          ],
          correct_answer: 1,
          explanation: "In Python, variables are created by simply assigning a value using the = operator. No declaration keywords are needed.",
          points: 10,
          negative_marks: 0.25,
          difficulty: 'easy',
          image_url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmOGZmIi8+CiAgPHRleHQgeD0iMjAiIHk9IjQwIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjE4IiBmaWxsPSIjMzMzIj4jIFB5dGhvbiBWYXJpYWJsZSBFeGFtcGxlczwvdGV4dD4KICA8dGV4dCB4PSIyMCIgeT0iNzAiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiMwMDciPnggPSA1ICAgICAgIyBDb3JyZWN0PC90ZXh0PgogIDx0ZXh0IHg9IjIwIiB5PSI5MCIgZm9udC1mYW1pbHk9Im1vbm9zcGFjZSIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2Q5NTM0ZiI+dmFyIHggPSA1ICAjIEluY29ycmVjdDwvdGV4dD4KICA8dGV4dCB4PSIyMCIgeT0iMTEwIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjE0IiBmaWxsPSIjZDk1MzRmIj5pbnQgeCA9IDUgIyBJbmNvcnJlY3Q8L3RleHQ+CiAgPHRleHQgeD0iMjAiIHk9IjE0MCIgZm9udC1mYW1pbHk9Im1vbm9zcGFjZSIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzY2NiI+UHl0aG9uIGlzIGR5bmFtaWNhbGx5IHR5cGVkIC0gbm8gZGVjbGFyYXRpb24gbmVlZGVkITwvdGV4dD4KPC9zdmc+',
          has_multiple_correct: false,
          tags: ['variables', 'basics']
        },
        {
          id: 2,
          section_id: 1,
          question: "Which of the following is NOT a valid Python data type?",
          type: 'multiple-choice',
          options: [
            'int',
            'float',
            'string',
            'char'
          ],
          correct_answer: 3,
          explanation: "Python doesn't have a 'char' data type. Individual characters are just strings of length 1.",
          points: 10,
          negative_marks: 0.25,
          difficulty: 'easy',
          has_multiple_correct: false,
          tags: ['data-types']
        },
        {
          id: 3,
          section_id: 1,
          question: "What will be the output of the following code?\n\nprint(type(5.0))",
          type: 'multiple-choice',
          options: [
            "<class 'int'>",
            "<class 'float'>",
            "<class 'number'>",
            "<class 'decimal'>"
          ],
          correct_answer: 1,
          explanation: "5.0 is a floating-point number, so type() returns <class 'float'>.",
          points: 10,
          negative_marks: 0.25,
          difficulty: 'medium',
          image_url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMjEyNTJiIi8+CiAgPHRleHQgeD0iMjAiIHk9IjMwIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjE0IiBmaWxsPSIjZmZmIj4+Pj4gcHJpbnQodHlwZSg1LjApKTwvdGV4dD4KICA8dGV4dCB4PSIyMCIgeT0iNjAiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM0ZGE5MjQiPiZsdDtjbGFzcyAnZmxvYXQnJmd0OzwvdGV4dD4KICA8dGV4dCB4PSIyMCIgeT0iMTAwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzk5OSI+UHl0aG9uIENvbnNvbGU8L3RleHQ+Cjwvc3ZnPg==',
          has_multiple_correct: false,
          tags: ['data-types', 'type-function']
        },
        {
          id: 4,
          section_id: 1,
          question: "Python is case-sensitive. Which means 'Variable' and 'variable' are different.",
          type: 'true-false',
          correct_answer: 'true',
          explanation: "Python is indeed case-sensitive. 'Variable' and 'variable' would be treated as two different identifiers.",
          points: 10,
          negative_marks: 0.25,
          difficulty: 'easy',
          has_multiple_correct: false,
          tags: ['case-sensitivity', 'variables']
        },
        {
          id: 5,
          section_id: 1,
          question: "What is the result of: 10 // 3 in Python?",
          type: 'numerical',
          correct_answer: '3',
          explanation: "The // operator performs floor division, which returns the largest integer less than or equal to the result. 10 // 3 = 3.",
          points: 10,
          negative_marks: 0.25,
          difficulty: 'medium',
          image_url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzUwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjlmOWY5Ii8+CiAgPHRleHQgeD0iMjAiIHk9IjMwIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjE2IiBmaWxsPSIjMzMzIj5EaXZpc2lvbiBPcGVyYXRvcnMgaW4gUHl0aG9uOjwvdGV4dD4KICA8dGV4dCB4PSIyMCIgeT0iNjAiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiMwMDciPjEwIC8gMyA9IDMuMzMzLi4uICAjIFJlZ3VsYXIgZGl2aXNpb248L3RleHQ+CiAgPHRleHQgeD0iMjAiIHk9IjkwIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjE0IiBmaWxsPSIjZDA2NjAwIj4xMCAvLyAzID0gMyAgICAgICMgRmxvb3IgZGl2aXNpb248L3RleHQ+CiAgPHRleHQgeD0iMjAiIHk9IjEyMCIgZm9udC1mYW1pbHk9Im1vbm9zcGFjZSIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzAwNyI+MTAgJSAzID0gMSAgICAgICAjIE1vZHVsbyAocmVtYWluZGVyKTwvdGV4dD4KICA8dGV4dCB4PSIyMCIgeT0iMTUwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzY2NiI+Ly8gcmV0dXJucyB0aGUgZmxvb3IgdmFsdWUgKGludGVnZXIgcGFydCk8L3RleHQ+Cjwvc3ZnPg==',
          has_multiple_correct: false,
          tags: ['operators', 'floor-division']
        },
        {
          id: 6,
          section_id: 1,
          question: "Which method is used to get user input in Python?",
          type: 'fill-blank',
          correct_answer: 'input',
          explanation: "The input() function is used to get user input in Python. It always returns a string.",
          points: 10,
          negative_marks: 0.25,
          difficulty: 'easy',
          has_multiple_correct: false,
          tags: ['input', 'functions']
        },
        {
          id: 7,
          section_id: 1,
          question: "What will this code output?\n\nx = '5'\ny = '10'\nprint(x + y)",
          type: 'multiple-choice',
          options: [
            '15',
            '510',
            'Error',
            '5 10'
          ],
          correct_answer: 1,
          explanation: "When you use + with strings, it concatenates them. So '5' + '10' = '510'.",
          points: 10,
          negative_marks: 0.25,
          difficulty: 'medium',
          image_url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjE2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMjEyNTJiIi8+CiAgPHRleHQgeD0iMjAiIHk9IjMwIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjE0IiBmaWxsPSIjZmZmIj4+Pj4geCA9ICc1JzwvdGV4dD4KICA8dGV4dCB4PSIyMCIgeT0iNTAiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiNmZmYiPj4+PiB5ID0gJzEwJzwvdGV4dD4KICA8dGV4dCB4PSIyMCIgeT0iNzAiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiNmZmYiPj4+PiBwcmludCh4ICsgeSkKPC90ZXh0PgogIDx0ZXh0IHg9IjIwIiB5PSIxMDAiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM0ZGE5MjQiPjUxMDwvdGV4dD4KICA8dGV4dCB4PSIyMCIgeT0iMTMwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzk5OSI+U3RyaW5nIGNvbmNhdGVuYXRpb24sIG5vdCBhZGRpdGlvbiE8L3RleHQ+Cjwvc3ZnPg==',
          has_multiple_correct: false,
          tags: ['strings', 'concatenation', 'operators']
        },
        {
          id: 8,
          section_id: 1,
          question: "Which of the following are valid Python variable names? (Select all that apply)",
          type: 'multiple-choice',
          options: [
            '_my_var',
            '2nd_variable',
            'my-variable',
            'MyVariable123'
          ],
          correct_answer: ['0', '3'], // Multiple correct answers as strings
          explanation: "_my_var and MyVariable123 are valid. Variable names cannot start with numbers (2nd_variable) or contain hyphens (my-variable).",
          points: 15,
          negative_marks: 0.5,
          difficulty: 'medium',
          has_multiple_correct: true,
          tags: ['variables', 'naming-rules']
        },
        {
          id: 9,
          section_id: 1,
          question: "What is the purpose of the 'len()' function in Python?",
          type: 'multiple-choice',
          options: [
            'To get the length of a string or list',
            'To convert to lowercase',
            'To check if a value exists',
            'To create a new variable'
          ],
          correct_answer: 0,
          explanation: "The len() function returns the number of items in an object (string, list, tuple, etc.).",
          points: 10,
          negative_marks: 0.25,
          difficulty: 'easy',
          image_url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzUwIiBoZWlnaHQ9IjE0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmOGZmIi8+CiAgPHRleHQgeD0iMjAiIHk9IjMwIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjE2IiBmaWxsPSIjMzMzIj5sZW4oKSBGdW5jdGlvbiBFeGFtcGxlczo8L3RleHQ+CiAgPHRleHQgeD0iMjAiIHk9IjYwIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMDA3Ij5sZW4oIkhlbGxvIikgPT4gNTwvdGV4dD4KICA8dGV4dCB4PSIyMCIgeT0iODAiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiMwMDciPmxlbihbMSwgMiwgMywgNF0pID0+IDQ8L3RleHQ+CiAgPHRleHQgeD0iMjAiIHk9IjEwMCIgZm9udC1mYW1pbHk9Im1vbm9zcGFjZSIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzAwNyI+bGVuKCIiKSA9PiAwPC90ZXh0PgogIDx0ZXh0IHg9IjIwIiB5PSIxMjAiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmaWxsPSIjNjY2Ij5Db3VudHMgY2hhcmFjdGVycyBpbiBzdHJpbmdzLCBpdGVtcyBpbiBsaXN0czwvdGV4dD4KPC9zdmc+',
          has_multiple_correct: false,
          tags: ['functions', 'len', 'built-in-functions']
        },
        {
          id: 10,
          section_id: 1,
          question: "Complete the code to convert a string to an integer:\n\nnum_str = '42'\nnum_int = _____(num_str)",
          type: 'fill-blank',
          correct_answer: 'int',
          explanation: "The int() function converts a string representation of a number to an integer.",
          points: 10,
          negative_marks: 0.25,
          difficulty: 'easy',
          image_url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjE0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmZmOGVkIi8+CiAgPHRleHQgeD0iMjAiIHk9IjMwIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjE2IiBmaWxsPSIjMzMzIj5UeXBlIENvbnZlcnNpb24gaW4gUHl0aG9uOjwvdGV4dD4KICA8dGV4dCB4PSIyMCIgeT0iNjAiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiNkOTUzNGYiPm51bV9zdHIgPSAnNDInICAjIFN0cmluZzwvdGV4dD4KICA8dGV4dCB4PSIyMCIgeT0iODAiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiMwMDciPm51bV9pbnQgPSBpbnQobnVtX3N0cikgICMgSW50ZWdlcjwvdGV4dD4KICA8dGV4dCB4PSIyMCIgeT0iMTAwIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMDA3Ij5wcmludChudW1faW50ICsgMTApICAjIDUyPC90ZXh0PgogIDx0ZXh0IHg9IjIwIiB5PSIxMjAiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmaWxsPSIjNjY2Ij5Db252ZXJ0cyBzdHJpbmcgdG8gaW50ZWdlcjwvdGV4dD4KPC9zdmc+',
          has_multiple_correct: false,
          tags: ['type-conversion', 'int-function']
        }
      ],
      created_at: new Date().toISOString(),
      is_active: true,
      is_published: true,
      configuration: {
        mocktest_template: false,
        show_question_marks: true,
        difficulty_level: 'easy',
        multichoice_label: 'A,B,C,D',
        calculator_type: 'none',
        window_restriction: false,
        switch_window_warnings: 3,
        proctoring_enabled: false,
        max_attempts: 3,
        leaderboard_enabled: true,
        answer_shuffle: false,
        section_order_selection: false,
        quiz_pause_enabled: true,
        percentile_ranking: true,
        randomization_enabled: false,
        time_per_question: false,
        auto_submit: true,
        show_answers_after: 'after_submission',
        negative_marking: true,
        negative_marks_value: 0.25,
        partial_marking: true,
        question_navigation: true,
        review_mode: true,
        full_screen_mode: false,
        copy_paste_disabled: false,
        right_click_disabled: false
      },
      grading_system: {
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
      sections: [
        {
          id: 1,
          title: "Python Fundamentals",
          time_limit: 30,
          question_count: 10,
          order: 1
        }
      ]
    };
    
    // Add the demo quiz to the quiz list
    setQuizzes([pythonDemoQuiz]);
    setIsLoading(false);
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
        if (data.length > 0) {
          setCourses(data);
        } else {
          // If no courses found, add sample courses for immediate use
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
              name: "Computer Vision & NLP",
              description: "Computer Vision and Natural Language Processing",
              instructor: "Dr. Alex Kumar",
              duration: "14 weeks",
              level: "Advanced"
            }
          ];
          setCourses(sampleCourses);
        }
      } else {
        // If API fails, use sample courses so the system still works
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
          }
        ];
        setCourses(sampleCourses);
      }
    } catch (error) {
      console.error('Error loading courses:', error);
      // If there's an error, use sample courses so the system still works
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
        }
      ];
      setCourses(sampleCourses);
    }
  };

  const loadCourseClasses = async (courseId: number) => {
    try {
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
      const mockQuizzes: Quiz[] = [
        {
          id: 1,
          course_id: 1,
          class_id: 1,
          title: "AI Fundamentals - Professional Assessment",
          description: "Comprehensive test covering AI basics with advanced proctoring",
          instructions: "This is a proctored exam. Window switching is not allowed. Calculator is provided.",
          difficulty: 'beginner',
          time_limit: 60,
          questions: [],
          created_at: '2024-01-15',
          is_active: true,
          is_published: true,
          sections: [
            { id: 1, title: "Theory", time_limit: 30, question_count: 15, order: 1 },
            { id: 2, title: "Practical", time_limit: 30, question_count: 10, order: 2 }
          ],
          configuration: {
            mocktest_template: true,
            show_question_marks: true,
            difficulty_level: 'medium',
            multichoice_label: 'A,B,C,D',
            calculator_type: 'scientific',
            window_restriction: true,
            switch_window_warnings: 2,
            proctoring_enabled: true,
            max_attempts: 2,
            leaderboard_enabled: true,
            answer_shuffle: true,
            section_order_selection: false,
            quiz_pause_enabled: false,
            percentile_ranking: true,
            randomization_enabled: true,
            time_per_question: true,
            auto_submit: true,
            show_answers_after: 'after_submission',
            negative_marking: true,
            negative_marks_value: 0.25,
            partial_marking: true,
            question_navigation: true,
            review_mode: true,
            full_screen_mode: true,
            copy_paste_disabled: true,
            right_click_disabled: true
          },
          grading_system: {
            passing_percentage: 70,
            grades: [
              { name: 'Excellent', min_percentage: 90, max_percentage: 100, color: '#10B981' },
              { name: 'Good', min_percentage: 80, max_percentage: 89, color: '#059669' },
              { name: 'Average', min_percentage: 70, max_percentage: 79, color: '#F59E0B' },
              { name: 'Below Average', min_percentage: 60, max_percentage: 69, color: '#DC2626' },
              { name: 'Fail', min_percentage: 0, max_percentage: 59, color: '#991B1B' }
            ]
          }
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
      section_id: 1,
      question: newQuestion.question!,
      type: newQuestion.type!,
      options: newQuestion.type === 'multiple-choice' ? newQuestion.options : undefined,
      correct_answer: newQuestion.correct_answer!,
      explanation: newQuestion.explanation,
      points: newQuestion.points || 10,
      negative_marks: newQuestion.negative_marks || 0,
      difficulty: newQuestion.difficulty || 'medium',
      has_multiple_correct: newQuestion.has_multiple_correct || false,
      tags: newQuestion.tags || []
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

    try {
      const quiz: Quiz = {
        id: Date.now(),
        course_id: newQuiz.course_id!,
        class_id: newQuiz.class_id!,
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

      setQuizzes([...quizzes, quiz]);
      setShowCreateQuizModal(false);
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
      
      alert('Professional Quiz created successfully with advanced features!');
    } catch (error) {
      console.error('Error saving quiz:', error);
      alert('Error saving quiz');
    }
  };

  const publishQuiz = (quizId: number) => {
    setQuizzes(quizzes.map(q => 
      q.id === quizId ? { ...q, is_published: true } : q
    ));
    alert('Quiz published successfully!');
  };

  const scheduleQuiz = (quizId: number, date: string) => {
    setQuizzes(quizzes.map(q => 
      q.id === quizId ? { ...q, scheduled_date: date, is_published: false } : q
    ));
    alert('Quiz scheduled successfully!');
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
          
          {/* Debug Info */}
          <div className="mt-2 p-2 bg-yellow-100 rounded text-xs">
            <strong>Debug:</strong> showCreateQuizModal: {showCreateQuizModal.toString()}, 
            selectedCourse: {selectedCourse}, selectedClass: {selectedClass}
          </div>
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
              <p className="text-3xl font-bold text-purple-900">{quizzes.filter(q => q.configuration.proctoring_enabled).length}</p>
            </div>
            <ShieldCheckIcon className="h-10 w-10 text-purple-600" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl shadow-md border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-medium">🏆 With Leaderboard</p>
              <p className="text-3xl font-bold text-orange-900">{quizzes.filter(q => q.configuration.leaderboard_enabled).length}</p>
            </div>
            <TrophyIcon className="h-10 w-10 text-orange-600" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl shadow-md border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium">🖥️ Mock Tests</p>
              <p className="text-3xl font-bold text-red-900">{quizzes.filter(q => q.configuration.mocktest_template).length}</p>
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
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                        <span>⏱️ {quiz.time_limit} min</span>
                        <span>📝 {quiz.questions.length} questions</span>
                        <span>🎯 {quiz.sections.length} sections</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {quiz.configuration.mocktest_template && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <ComputerDesktopIcon className="h-3 w-3 mr-1" />
                          🖥️ Mock Test
                        </span>
                      )}
                      {quiz.configuration.calculator_type !== 'none' && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CalculatorIcon className="h-3 w-3 mr-1" />
                          🧮 Calculator
                        </span>
                      )}
                      {quiz.configuration.leaderboard_enabled && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <TrophyIcon className="h-3 w-3 mr-1" />
                          🏆 Leaderboard
                        </span>
                      )}
                      {quiz.configuration.percentile_ranking && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          <ChartBarIcon className="h-3 w-3 mr-1" />
                          📊 Percentile
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {quiz.configuration.proctoring_enabled && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <ShieldCheckIcon className="h-3 w-3 mr-1" />
                          🎥 Proctored
                        </span>
                      )}
                      {quiz.configuration.window_restriction && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                          🚫 No Switch
                        </span>
                      )}
                      {quiz.configuration.full_screen_mode && (
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
                        onClick={() => duplicateQuiz(quiz)}
                        className="text-green-600 hover:text-green-900 p-1 rounded"
                        title="Duplicate"
                      >
                        <DocumentDuplicateIcon className="h-5 w-5" />
                      </button>
                      {!quiz.is_published && (
                        <button
                          onClick={() => publishQuiz(quiz.id)}
                          className="text-emerald-600 hover:text-emerald-900 p-1 rounded"
                          title="Publish"
                        >
                          <PlayIcon className="h-5 w-5" />
                        </button>
                      )}
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this quiz?')) {
                            setQuizzes(quizzes.filter(q => q.id !== quiz.id));
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
                              onClick={() => setNewQuestion({...newQuestion, correct_answer: index})}
                              className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                                newQuestion.correct_answer === index
                                  ? 'bg-green-500 text-white shadow-lg'
                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              }`}
                            >
                              {newQuestion.correct_answer === index ? '✅ Correct' : 'Mark Correct'}
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
                          onClick={() => setNewQuestion({...newQuestion, correct_answer: 'true'})}
                          className={`px-6 py-3 rounded-lg font-medium ${
                            newQuestion.correct_answer === 'true'
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          ✅ True
                        </button>
                        <button
                          onClick={() => setNewQuestion({...newQuestion, correct_answer: 'false'})}
                          className={`px-6 py-3 rounded-lg font-medium ${
                            newQuestion.correct_answer === 'false'
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
                    {newQuiz.questions.map((q, index) => (
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
                                Correct: {q.options[q.correct_answer as number] || 'Not set'}
                              </div>
                            )}
                            {q.type === 'true-false' && (
                              <div className="text-sm text-gray-600">
                                Correct Answer: {q.correct_answer}
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
    </motion.div>
  );
};

export default ManageQuizzes;
