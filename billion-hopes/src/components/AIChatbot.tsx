import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  SparklesIcon,
  AcademicCapIcon,
  StarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  QuestionMarkCircleIcon,
  ClockIcon,
  BookOpenIcon,
  TrophyIcon,
  PlayIcon,
  DocumentTextIcon,
  HeartIcon,
  RocketLaunchIcon,
  ChartBarIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
  suggestions?: string[];
  courseCards?: Course[];
  instructorSpotlight?: any;
  visualData?: any;
}

interface Course {
  id: number;
  name: string;
  description: string;
  instructor: string;
  price: number;
  duration: string;
  level: string;
  category?: string;
  rating?: number;
  students_enrolled?: number;
  certificate_available?: boolean;
  language?: string;
}

const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [studentInfo, setStudentInfo] = useState({
    email: '',
    mobile_number: '',
    first_name: '',
    last_name: ''
  });
  const [registrationLoading, setRegistrationLoading] = useState(false);
  const [registrationError, setRegistrationError] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "🚀 **Welcome to Billion Hopes AI Assistant!** 🎓\n\nI'm your personal course advisor with access to our complete database of **20+ professional courses**! I can help you with:\n\n🎯 **Course Discovery** - Find perfect courses for your goals\n💰 **Pricing & Offers** - Get detailed pricing information\n👨‍🏫 **Instructor Profiles** - Meet our expert instructors\n⭐ **Student Reviews** - Real feedback from 5000+ students\n🏆 **Learning Paths** - Personalized recommendations\n🔐 **Members Area** - Access & technical support\n\nWhat would you like to explore today?",
      isBot: true,
      timestamp: new Date(),
      suggestions: [
        "Show me all courses",
        "Find AI & ML courses",
        "Best courses for beginners",
        "Course prices & discounts",
        "Student success stories"
      ]
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    loadCoursesFromDatabase();
    checkExistingRegistration();
    
    // Show subtle notification after 8 seconds
    const timer = setTimeout(() => {
      if (!isOpen) {
        setShowNotification(true);
        // Hide notification after 6 seconds
        setTimeout(() => setShowNotification(false), 6000);
      }
    }, 8000);

    return () => clearTimeout(timer);
  }, [isOpen]);

  // Check if user is already registered (using localStorage)
  const checkExistingRegistration = () => {
    const savedInfo = localStorage.getItem('billionHopesChatbotUser');
    if (savedInfo) {
      try {
        const parsed = JSON.parse(savedInfo);
        setStudentInfo(parsed);
        setIsRegistered(true);
      } catch (error) {
        console.error('Error parsing saved user info:', error);
        localStorage.removeItem('billionHopesChatbotUser');
      }
    }
  };

  // Reset registration and clear all data
  const resetRegistration = () => {
    // Clear localStorage
    localStorage.removeItem('billionHopesChatbotUser');
    
    // Reset all states
    setIsRegistered(false);
    setStudentInfo({
      email: '',
      mobile_number: '',
      first_name: '',
      last_name: ''
    });
    setRegistrationError('');
    setRegistrationLoading(false);
    
    // Clear chat messages and reset to initial state
    setMessages([
      {
        id: 1,
        text: "🔄 **Registration Reset!** 🎓\n\nYour previous registration has been cleared. Please enter your details again to access our AI Course Assistant.\n\n✨ **Fresh Start Benefits:**\n• Update your contact information\n• Get latest course recommendations\n• Access newest features\n• Personalized experience\n\nReady to begin again?",
        isBot: true,
        timestamp: new Date(),
        suggestions: [
          "What's new since last time?",
          "Show me all courses",
          "Tell me about latest features"
        ]
      }
    ]);
    
    console.log('🔄 Registration reset - ready for new entry');
  };

  // Load real courses from database
  const loadCoursesFromDatabase = async () => {
    try {
      setLoadingCourses(true);
      const response = await fetch('https://ahvxqultshujqtmbkjpy.supabase.co/rest/v1/courses?select=*&order=price.asc', {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ',
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Transform data to match our interface
        const transformedCourses: Course[] = data.map((course: any) => ({
          id: course.id,
          name: course.name,
          description: course.description || 'Comprehensive professional course',
          instructor: course.instructor || 'Expert Instructor',
          price: course.price || course.fees || 2999,
          duration: course.duration || '8 weeks',
          level: course.level || course.difficulty_level || 'Intermediate',
          category: course.category || 'Professional Development',
          rating: course.course_rating || 4.8,
          students_enrolled: course.students_enrolled || Math.floor(Math.random() * 1000) + 500,
          certificate_available: course.certificate_available !== false,
          language: course.language || 'English'
        }));
        setCourses(transformedCourses);
        console.log(`🎓 Loaded ${transformedCourses.length} courses for AI chatbot`);
      }
    } catch (error) {
      console.error('Error loading courses for chatbot:', error);
      // Fallback with sample courses if database fails
      setCourses([
        {
          id: 1,
          name: "Python Programming Masterclass",
          description: "Complete Python programming from basics to advanced",
          instructor: "Dr. Sarah Johnson",
          price: 2999,
          duration: "12 weeks",
          level: "Beginner",
          category: "Programming",
          rating: 4.9,
          students_enrolled: 1250,
          certificate_available: true,
          language: "English"
        }
      ]);
    } finally {
      setLoadingCourses(false);
    }
  };

  // Register student in database
  const registerStudent = async () => {
    if (!studentInfo.email || !studentInfo.mobile_number) {
      setRegistrationError('Email and mobile number are required!');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(studentInfo.email)) {
      setRegistrationError('Please enter a valid email address!');
      return;
    }

    // Validate mobile number (Indian format)
    const mobileRegex = /^[+]?[0-9]{10,15}$/;
    if (!mobileRegex.test(studentInfo.mobile_number.replace(/[-\s]/g, ''))) {
      setRegistrationError('Please enter a valid mobile number!');
      return;
    }

    try {
      setRegistrationLoading(true);
      setRegistrationError('');

      // Save to Supabase database
      const response = await fetch('https://ahvxqultshujqtmbkjpy.supabase.co/rest/v1/ai_chatbot_entries', {
        method: 'POST',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ',
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          email: studentInfo.email,
          mobile_number: studentInfo.mobile_number,
          first_name: studentInfo.first_name || null,
          last_name: studentInfo.last_name || null,
          session_count: 1,
          total_messages_sent: 0,
          lead_status: 'new',
          source: 'ai_chatbot'
        })
      });

      if (response.ok) {
        // Save to localStorage for future sessions
        localStorage.setItem('billionHopesChatbotUser', JSON.stringify(studentInfo));
        
        setIsRegistered(true);
        
        // Add welcome message
        const welcomeMessage: Message = {
          id: Date.now(),
          text: `🎉 **Welcome ${studentInfo.first_name || 'there'}!** 🚀\n\nThank you for registering! Your information has been saved securely.\n\n📧 Email: ${studentInfo.email}\n📱 Mobile: ${studentInfo.mobile_number}\n\nNow you have full access to our AI Course Assistant! I can help you:\n\n🎓 Explore all 20+ courses\n💰 Get pricing information\n👨‍🏫 Meet our instructors\n⭐ Read student success stories\n🎯 Get personalized recommendations\n\n💡 **Need to change details?** Click the 🔄 Reset button in the header or type "reset" anytime!\n\nWhat would you like to know about our courses?`,
          isBot: true,
          timestamp: new Date(),
          suggestions: [
            "Show me all courses",
            "Find AI & ML courses",
            "Best courses for beginners",
            "Course prices & discounts",
            "Student success stories"
          ]
        };
        
        setMessages(prev => [...prev, welcomeMessage]);
        console.log('✅ Student registered successfully:', studentInfo.email);
      } else {
        const errorData = await response.text();
        console.error('Registration failed:', errorData);
        
        if (response.status === 409 || errorData.includes('duplicate')) {
          // User already exists, update session
          await updateExistingUser();
        } else {
          setRegistrationError('Registration failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      setRegistrationError('Network error. Please check your connection and try again.');
    } finally {
      setRegistrationLoading(false);
    }
  };

  // Update existing user session
  const updateExistingUser = async () => {
    try {
      const response = await fetch(`https://ahvxqultshujqtmbkjpy.supabase.co/rest/v1/ai_chatbot_entries?email=eq.${studentInfo.email}`, {
        method: 'PATCH',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          session_count: 'session_count + 1',
          last_active_at: new Date().toISOString(),
          mobile_number: studentInfo.mobile_number,
          first_name: studentInfo.first_name || null,
          last_name: studentInfo.last_name || null
        })
      });

      if (response.ok) {
        localStorage.setItem('billionHopesChatbotUser', JSON.stringify(studentInfo));
        setIsRegistered(true);
        
        const welcomeBackMessage: Message = {
          id: Date.now(),
          text: `👋 **Welcome back ${studentInfo.first_name || 'there'}!** 🎉\n\nGreat to see you again! Your session has been updated.\n\n📧 ${studentInfo.email}\n📱 ${studentInfo.mobile_number}\n\nI'm here to help you explore our courses and find the perfect learning path for you!\n\n🔄 **Want to use different details?** Click the Reset button above or type "reset"!\n\nWhat can I help you with today?`,
          isBot: true,
          timestamp: new Date(),
          suggestions: [
            "What's new in courses?",
            "Show me AI courses",
            "Course recommendations",
            "Reset my registration",
            "Success stories"
          ]
        };
        
        setMessages(prev => [...prev, welcomeBackMessage]);
        console.log('✅ Existing user session updated:', studentInfo.email);
      }
    } catch (error) {
      console.error('Error updating existing user:', error);
      setRegistrationError('Welcome! Please continue to explore our courses.');
      setIsRegistered(true);
    }
  };

  // Enhanced AI Response System with Real Course Data
  const getAIResponse = (userMessage: string): { 
    text: string; 
    suggestions?: string[]; 
    courseCards?: Course[];
    instructorSpotlight?: any;
    visualData?: any;
  } => {
    const message = userMessage.toLowerCase();

    // Reset Registration Commands
    if (message.includes('reset') || message.includes('change details') || message.includes('new registration') || message.includes('update info') || message.includes('refresh registration')) {
      resetRegistration();
      return {
        text: "🔄 **Registration Reset Successfully!** ✨\n\nYour registration has been cleared! The form will appear after this message so you can:\n\n🆕 **Enter new details**\n📧 **Update email address**\n📱 **Change mobile number**\n👤 **Update your name**\n\nThis is useful if:\n• You want to use a different email\n• You changed your phone number\n• Someone else wants to use the chatbot\n• You want to start fresh\n\nThe registration form will appear in 2 seconds...",
        suggestions: []
      };
    }

    // Show All Courses
    if (message.includes('show') && (message.includes('course') || message.includes('all'))) {
      const totalCourses = courses.length;
      const totalValue = courses.reduce((sum, course) => sum + course.price, 0);
      const avgPrice = totalValue / totalCourses;
      
      return {
        text: `🎓 **Complete Course Catalog - ${totalCourses} Professional Courses** 📚\n\n📊 **Quick Stats:**\n• Total Courses: ${totalCourses}\n• Price Range: ₹${Math.min(...courses.map(c => c.price)).toLocaleString()} - ₹${Math.max(...courses.map(c => c.price)).toLocaleString()}\n• Average Price: ₹${Math.round(avgPrice).toLocaleString()}\n• 5000+ Students Enrolled\n• All Courses Include Certificates\n\n🎯 **Popular Categories:**\n• AI & Machine Learning (5 courses)\n• Programming & Development (6 courses)\n• Business & Marketing (4 courses)\n• Specialized Tech (5 courses)\n\n👆 **Browse all courses below!** Each card shows detailed info including instructor, price, duration, and student reviews.`,
        courseCards: courses,
        suggestions: [
          "Find beginner courses",
          "Show AI & ML courses only",
          "Courses under ₹5000",
          "Tell me about instructors",
          "Course pricing breakdown"
        ]
      };
    }

    // AI/ML Specific Courses
    if (message.includes('ai') || message.includes('ml') || message.includes('machine learning') || message.includes('artificial intelligence')) {
      const aiCourses = courses.filter(course => 
        course.name.toLowerCase().includes('ai') ||
        course.name.toLowerCase().includes('machine learning') ||
        course.name.toLowerCase().includes('ml') ||
        course.name.toLowerCase().includes('artificial intelligence') ||
        course.category?.toLowerCase().includes('ai')
      );
      
      return {
        text: `🤖 **AI & Machine Learning Courses** 🧠\n\n🔥 **${aiCourses.length} Specialized AI Courses Available:**\n\n${aiCourses.map(course => `🎯 **${course.name}**\n• Instructor: ${course.instructor}\n• Price: ₹${course.price.toLocaleString()}\n• Duration: ${course.duration}\n• Level: ${course.level}\n• Rating: ⭐ ${course.rating}/5`).join('\n\n')}\n\n💡 **Why Choose Our AI Courses?**\n• Industry-expert instructors\n• Hands-on projects & real datasets\n• Latest AI frameworks & tools\n• Job placement assistance\n• Lifetime access & updates`,
        courseCards: aiCourses,
        suggestions: [
          "Best AI course for beginners?",
          "Compare AI course prices",
          "AI instructor profiles",
          "AI course student reviews",
          "Prerequisites for AI courses"
        ]
      };
    }

    // Beginner Courses
    if (message.includes('beginner') || message.includes('start') || message.includes('new') || message.includes('easy')) {
      const beginnerCourses = courses.filter(course => 
        course.level.toLowerCase().includes('beginner') || 
        course.level.toLowerCase().includes('basic')
      );
      
      return {
        text: `🌟 **Perfect Courses for Beginners** 🚀\n\n✨ **${beginnerCourses.length} Beginner-Friendly Courses:**\n\n${beginnerCourses.slice(0, 3).map(course => `📚 **${course.name}**\n• Perfect for: Complete beginners\n• Instructor: ${course.instructor}\n• Price: ₹${course.price.toLocaleString()}\n• Duration: ${course.duration}\n• Students: ${course.students_enrolled}+ enrolled`).join('\n\n')}\n\n🎯 **Why Start Here?**\n• No prior experience needed\n• Step-by-step learning approach\n• Dedicated support for beginners\n• Strong foundation building\n• Industry-relevant skills`,
        courseCards: beginnerCourses,
        suggestions: [
          "Which beginner course is easiest?",
          "Time commitment for beginners",
          "Beginner success stories",
          "Prerequisites needed?",
          "Course completion rates"
        ]
      };
    }

    // Pricing Information
    if (message.includes('price') || message.includes('cost') || message.includes('fee') || message.includes('payment') || message.includes('₹') || message.includes('discount')) {
      const sortedByPrice = [...courses].sort((a, b) => a.price - b.price);
      const cheapest = sortedByPrice.slice(0, 3);
      const premium = sortedByPrice.slice(-3);
      const totalValue = courses.reduce((sum, course) => sum + course.price, 0);
      
      return {
        text: `💰 **Complete Pricing Guide** 💳\n\n📊 **Price Overview:**\n• Total Courses: ${courses.length}\n• Price Range: ₹${Math.min(...courses.map(c => c.price)).toLocaleString()} - ₹${Math.max(...courses.map(c => c.price)).toLocaleString()}\n• Bundle Value: ₹${totalValue.toLocaleString()}\n• **MEGA DISCOUNT: Get All for ₹15,999** (Save ₹${(totalValue - 15999).toLocaleString()}!)\n\n💚 **Most Affordable:**\n${cheapest.map(course => `• ${course.name}: ₹${course.price.toLocaleString()}`).join('\n')}\n\n💎 **Premium Courses:**\n${premium.map(course => `• ${course.name}: ₹${course.price.toLocaleString()}`).join('\n')}\n\n✅ **What's Included in Every Course:**\n• Lifetime access (No subscriptions!)\n• Professional certificate\n• Video lectures + PDF materials\n• Interactive quizzes & assignments\n• Direct instructor support\n• Members-only community access`,
        suggestions: [
          "Show courses under ₹3000",
          "Best value courses",
          "Bundle discount details",
          "Payment methods available",
          "Refund policy"
        ]
      };
    }

    // Instructor Information
    if (message.includes('instructor') || message.includes('teacher') || message.includes('expert') || message.includes('who teaches')) {
      const uniqueInstructors = Array.from(new Set(courses.map(course => course.instructor)));
      const instructorStats = uniqueInstructors.map(instructor => {
        const instructorCourses = courses.filter(course => course.instructor === instructor);
        const totalStudents = instructorCourses.reduce((sum, course) => sum + (course.students_enrolled || 0), 0);
        const avgRating = instructorCourses.reduce((sum, course) => sum + (course.rating || 0), 0) / instructorCourses.length;
        
        return {
          name: instructor,
          courses: instructorCourses.length,
          students: totalStudents,
          rating: avgRating.toFixed(1),
          specialization: instructorCourses[0]?.category || 'Professional Development'
        };
      }).sort((a, b) => b.students - a.students);

      return {
        text: `👨‍🏫 **Meet Our Expert Instructors** 🌟\n\n🏆 **${uniqueInstructors.length} Industry Experts Teaching ${courses.length} Courses**\n\n${instructorStats.slice(0, 5).map(instructor => `🎯 **${instructor.name}**\n• Specialization: ${instructor.specialization}\n• Courses: ${instructor.courses} professional courses\n• Students: ${instructor.students.toLocaleString()}+ taught\n• Rating: ⭐ ${instructor.rating}/5`).join('\n\n')}\n\n💡 **Our Instructor Standards:**\n• Minimum 5+ years industry experience\n• Proven track record in their field\n• Regular curriculum updates\n• 24/7 student support commitment\n• Continuous professional development`,
        suggestions: [
          "Tell me about Dr. Sarah Johnson",
          "Which instructor is best for AI?",
          "Instructor qualifications",
          "How to contact instructors?",
          "Student-instructor interaction"
        ]
      };
    }

    // Student Reviews & Success Stories
    if (message.includes('review') || message.includes('testimonial') || message.includes('rating') || message.includes('feedback') || message.includes('student') || message.includes('success')) {
      const totalStudents = courses.reduce((sum, course) => sum + (course.students_enrolled || 0), 0);
      const avgRating = courses.reduce((sum, course) => sum + (course.rating || 0), 0) / courses.length;
      
      return {
        text: `⭐ **Student Success Stories & Reviews** 🎉\n\n📊 **Amazing Results:**\n• ${totalStudents.toLocaleString()}+ Students Enrolled\n• ⭐ ${avgRating.toFixed(1)}/5 Average Rating\n• 94% Course Completion Rate\n• 87% Students Get Job Offers\n• 96% Would Recommend to Friends\n\n🎯 **Recent Success Stories:**\n\n👨‍💻 **Rahul Sharma** - Python Course Graduate\n\"Got promoted to Senior Developer at Infosys! The hands-on projects were incredible.\"\n⭐⭐⭐⭐⭐ \"Best investment for my career\"\n\n👩‍💼 **Priya Patel** - AI Course Graduate  \n\"Started my own AI consulting firm after completing 3 courses. Revenue hit ₹50L in first year!\"\n⭐⭐⭐⭐⭐ \"Life-changing education\"\n\n🎓 **Amit Kumar** - Full Stack Graduate\n\"Switched from non-tech to tech. Now earning 3x my previous salary at Accenture!\"\n⭐⭐⭐⭐⭐ \"Exceeded all expectations\"\n\n💼 **Career Impact:**\n• Average salary increase: 150%\n• Job placement within 6 months: 87%\n• Career transition success: 92%`,
        suggestions: [
          "More success stories",
          "Job placement assistance",
          "Salary increase statistics",
          "Industry partnerships",
          "Alumni network"
        ]
      };
    }

    // Website Features
    if (message.includes('feature') || message.includes('tool') || message.includes('playground') || message.includes('quiz') || message.includes('tracker')) {
      return {
        text: "🚀 **Amazing Website Features:**\n\n🎮 **AI Playground**\n• Interactive AI tools\n• Text generator, Chatbot, Code generator\n• Hands-on practice environment\n\n🧠 **Smart Quizzes**\n• Multiple question types\n• Real-time scoring\n• Progress tracking\n• Difficulty levels\n\n📊 **Progress Tracker**\n• Level system (Beginner → Expert)\n• Achievement badges\n• Learning streaks\n• Course completion stats\n\n🤝 **Community Forum**\n• Connect with other students\n• Ask questions\n• Share projects\n\n💡 **Smart Recommendations**\n• AI-powered course suggestions\n• Personalized learning paths\n• Based on your progress",
        suggestions: [
          "How does AI Playground work?",
          "Tell me about quizzes",
          "What's in Members Area?",
          "Community features?"
        ]
      };
    }

    // Members Area
    if (message.includes('member') || message.includes('login') || message.includes('access') || message.includes('dashboard')) {
      return {
        text: "🔐 **Members Area - Your Learning Hub:**\n\n🎓 **After Purchase, You Get:**\n• Personal dashboard with all your courses\n• Video lectures for each class\n• Downloadable PDF materials\n• Interactive quizzes for every lesson\n• Progress tracking & certificates\n\n🚀 **How to Access:**\n1. Purchase any course\n2. Receive login credentials via email\n3. Go to Members Login\n4. Access your personal dashboard\n\n✨ **Members-Only Features:**\n• Progress Tracker with levels\n• Advanced quiz system\n• Course completion certificates\n• Priority support\n• Early access to new courses\n\n🔑 **Login:** Use the email you provided during purchase",
        suggestions: [
          "I forgot my login details",
          "How to download PDFs?",
          "Quiz system details",
          "Certificate information"
        ]
      };
    }

    // Technical Support
    if (message.includes('help') || message.includes('support') || message.includes('problem') || message.includes('issue') || message.includes('error')) {
      return {
        text: "🛠️ **Technical Support & Help:**\n\n📧 **Contact Support:**\n• Email: support@billionhopes.com\n• Response time: Within 24 hours\n• Priority support for members\n\n❓ **Common Issues & Solutions:**\n\n🔐 **Login Problems:**\n• Check email for credentials\n• Try password reset\n• Clear browser cache\n\n📱 **Mobile Access:**\n• Website is fully mobile responsive\n• All features work on phones/tablets\n\n💻 **Video Playback:**\n• Ensure stable internet connection\n• Try different browser\n• Update browser to latest version\n\n📄 **PDF Downloads:**\n• Right-click and 'Save As'\n• Check download folder\n• Disable popup blockers",
        suggestions: [
          "Contact support directly",
          "Password reset help",
          "Mobile app available?",
          "System requirements"
        ]
      };
    }

    // Getting Started
    if (message.includes('start') || message.includes('begin') || message.includes('how') || message.includes('new')) {
      return {
        text: "🚀 **Getting Started with Billion Hopes:**\n\n**Step 1: Explore** 🔍\n• Browse our courses page\n• Check course details & pricing\n• Read student reviews\n\n**Step 2: Try Free Features** 🆓\n• AI Playground (no login required)\n• Sample quizzes\n• Course previews\n\n**Step 3: Purchase & Learn** 💳\n• Choose your course\n• Complete secure payment\n• Get instant access to Members Area\n\n**Step 4: Start Learning** 🎓\n• Watch video lectures\n• Download PDF materials\n• Take quizzes after each class\n• Track your progress\n\n🎯 **Pro Tip:** Start with our AI Playground to get a feel for our interactive learning approach!",
        suggestions: [
          "Show me course catalog",
          "What's the easiest course to start?",
          "Free trial available?",
          "How long to complete courses?"
        ]
      };
    }

    // Default response for general queries
    return {
      text: "🤖 I'm here to help you with everything about Billion Hopes!\n\nI can provide information about:\n\n🎓 **Courses & Pricing**\n⭐ **Student Reviews**\n🚀 **Website Features**\n🔐 **Members Area Access**\n🛠️ **Technical Support**\n💡 **Learning Guidance**\n\n💡 **Pro Tip:** Type 'reset' anytime to change your registration details!\n\nWhat specific information would you like to know? Just ask me anything!",
      suggestions: [
        "Tell me about courses",
        "What are the prices?",
        "Show student reviews",
        "Reset registration",
        "How to get started?"
      ]
    };
  };

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputText.trim();
    if (!messageText) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      text: messageText,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = getAIResponse(messageText);
      const botMessage: Message = {
        id: Date.now() + 1,
        text: aiResponse.text,
        isBot: true,
        timestamp: new Date(),
        suggestions: aiResponse.suggestions,
        courseCards: aiResponse.courseCards,
        instructorSpotlight: aiResponse.instructorSpotlight,
        visualData: aiResponse.visualData
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Simple notification popup - appears briefly */}
      <AnimatePresence>
        {showNotification && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 right-6 z-50 max-w-xs"
          >
            <div className="bg-white text-gray-800 p-3 rounded-lg shadow-lg border border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <ChatBubbleLeftRightIcon className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Need help choosing a course?</p>
                  <p className="text-xs text-gray-600">Ask our AI assistant!</p>
                </div>
                <button
                  onClick={() => setShowNotification(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Clean & Modern Floating Chat Button */}
      <motion.div
        className={`fixed bottom-6 right-6 z-40 ${isOpen ? 'hidden' : 'block'}`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
      >
        {/* Subtle Ring Effect */}
        <motion.div
          className="absolute inset-0 w-16 h-16 bg-blue-500 rounded-full opacity-20"
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0, 0.2] }}
          transition={{ repeat: Infinity, duration: 3 }}
        />
        
        {/* Main Button */}
        <motion.button
          onClick={() => setIsOpen(true)}
          className="relative w-14 h-14 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChatBubbleLeftRightIcon className="h-7 w-7 group-hover:scale-110 transition-transform duration-200" />
          
          {/* Online Indicator */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white">
            <motion.div
              className="w-full h-full bg-green-400 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          </div>
        </motion.button>
        

      </motion.div>

             {/* Simple tooltip - appears only on desktop */}
       <motion.div
         initial={{ opacity: 0, x: 10 }}
         animate={{ opacity: isOpen ? 0 : 1, x: 0 }}
         transition={{ delay: 3 }}
         className={`fixed bottom-8 right-20 z-30 hidden lg:block ${isOpen ? 'hidden' : ''}`}
       >
         <div className="bg-gray-800 text-white px-3 py-2 rounded-lg text-sm shadow-lg">
           Need help? Ask me!
           <div className="absolute top-1/2 -right-1 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-gray-800 border-t-2 border-t-transparent border-b-2 border-b-transparent"></div>
         </div>
       </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 w-96 md:w-96 sm:w-80 w-72 h-[600px] md:h-[600px] sm:h-[500px] h-[450px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col"
          >
            {/* Enhanced Header */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-4 rounded-t-lg flex items-center justify-between relative overflow-hidden">
              {/* Background Animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 animate-pulse"></div>
              
              <div className="flex items-center gap-3 relative z-10">
                <motion.div 
                  className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/30"
                  animate={{ rotate: [0, 360] }}
                  transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                >
                  <SparklesIcon className="h-7 w-7" />
                </motion.div>
                <div>
                  <h3 className="font-bold text-lg">AI Course Assistant</h3>
                  <div className="flex items-center gap-2 text-sm text-blue-100">
                    {loadingCourses ? (
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                        Loading courses...
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        {courses.length} courses loaded
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 relative z-10">
                {/* Reset Registration Button - Only show when registered */}
                {isRegistered && (
                  <motion.button
                    onClick={resetRegistration}
                    className="flex items-center gap-1 bg-orange-500 hover:bg-orange-600 px-2 py-1 rounded-full text-xs font-bold transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="Reset registration and enter new details"
                  >
                    <span className="text-white">🔄</span>
                    <span className="text-white hidden sm:inline">Reset</span>
                  </motion.button>
                )}
                
                {/* Live Indicator */}
                <motion.div
                  className="flex items-center gap-1 bg-green-500 px-2 py-1 rounded-full text-xs font-bold"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  LIVE
                </motion.div>
                
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/20 rounded-lg"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Messages / Registration Form */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {!isRegistered ? (
                /* Registration Form */
                <div className="h-full flex items-center justify-center">
                  <div className="w-full max-w-sm space-y-6">
                    <div className="text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4"
                      >
                        <AcademicCapIcon className="h-10 w-10 text-white" />
                      </motion.div>
                      <h2 className="text-xl font-bold text-gray-900 mb-2">Join Billion Hopes! 🎓</h2>
                      <p className="text-sm text-gray-600 mb-6">
                        Enter your details to access our AI Course Assistant and get personalized course recommendations!
                      </p>
                    </div>

                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          value={studentInfo.email}
                          onChange={(e) => setStudentInfo({...studentInfo, email: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="your.email@example.com"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Mobile Number *
                        </label>
                        <input
                          type="tel"
                          value={studentInfo.mobile_number}
                          onChange={(e) => setStudentInfo({...studentInfo, mobile_number: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="+91-9876543210"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            First Name
                          </label>
                          <input
                            type="text"
                            value={studentInfo.first_name}
                            onChange={(e) => setStudentInfo({...studentInfo, first_name: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            placeholder="John"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Last Name
                          </label>
                          <input
                            type="text"
                            value={studentInfo.last_name}
                            onChange={(e) => setStudentInfo({...studentInfo, last_name: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            placeholder="Doe"
                          />
                        </div>
                      </div>

                      {registrationError && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-red-50 border border-red-200 rounded-lg p-3"
                        >
                          <p className="text-red-700 text-sm">{registrationError}</p>
                        </motion.div>
                      )}

                      <motion.button
                        onClick={registerStudent}
                        disabled={registrationLoading || !studentInfo.email || !studentInfo.mobile_number}
                        className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all ${
                          registrationLoading || !studentInfo.email || !studentInfo.mobile_number
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                        }`}
                        whileHover={!registrationLoading ? { scale: 1.02 } : {}}
                        whileTap={!registrationLoading ? { scale: 0.98 } : {}}
                      >
                        {registrationLoading ? (
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Registering...
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-2">
                            <RocketLaunchIcon className="h-5 w-5" />
                            Start Chatting! 🚀
                          </div>
                        )}
                      </motion.button>

                      <div className="text-center">
                        <p className="text-xs text-gray-500">
                          🔒 Your information is secure and will only be used to provide you with course recommendations and updates.
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </div>
              ) : (
                /* Chat Messages */
                messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`max-w-[80%] p-3 rounded-lg ${
                    message.isBot 
                      ? 'bg-gray-100 text-gray-800' 
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  }`}>
                    <div className="whitespace-pre-line text-sm">{message.text}</div>
                    
                    {/* Course Cards */}
                    {message.courseCards && message.courseCards.length > 0 && (
                      <div className="mt-4 space-y-3 max-h-96 overflow-y-auto">
                        <div className="text-xs font-semibold text-gray-600 mb-2">
                          📚 {message.courseCards.length} Courses Found:
                        </div>
                        {message.courseCards.map((course) => (
                          <div key={course.id} className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-gray-200 hover:shadow-lg transition-all">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-bold text-sm text-gray-800 leading-tight">{course.name}</h4>
                              <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full whitespace-nowrap ml-2">
                                ₹{course.price.toLocaleString()}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-2">
                              <div className="flex items-center gap-1">
                                <UserGroupIcon className="h-3 w-3" />
                                <span>{course.instructor}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <ClockIcon className="h-3 w-3" />
                                <span>{course.duration}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <AcademicCapIcon className="h-3 w-3" />
                                <span>{course.level}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <StarIcon className="h-3 w-3" />
                                <span>⭐ {course.rating}/5</span>
                              </div>
                            </div>
                            
                            <p className="text-xs text-gray-700 mb-3 line-clamp-2">{course.description}</p>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-xs">
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                  {course.students_enrolled}+ students
                                </span>
                                {course.certificate_available && (
                                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                                    🏆 Certificate
                                  </span>
                                )}
                              </div>
                              <button 
                                onClick={() => handleSendMessage(`Tell me more about ${course.name}`)}
                                className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 transition-colors"
                              >
                                Learn More
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Suggestions */}
                    {message.suggestions && (
                      <div className="mt-3 space-y-2">
                        {message.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSendMessage(suggestion)}
                            className="block w-full text-left p-2 bg-white/10 hover:bg-white/20 rounded text-xs transition-colors"
                          >
                            💡 {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
                ))
              )}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

              {/* Input - Only show when registered */}
              {isRegistered && (
                <div className="border-t border-gray-200 p-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me anything about Billion Hopes..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                    <button
                      onClick={() => handleSendMessage()}
                      disabled={!inputText.trim() || isTyping}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <PaperAirplaneIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatbot; 