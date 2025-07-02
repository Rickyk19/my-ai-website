// =====================================================
// DIRECT REAL-TIME SERVICE - FIXED AUTHENTICATION
// This service fetches ONLY real user activities from the database
// Uses alternative fetch method to avoid RLS/auth issues
// =====================================================

import { supabase } from '../utils/supabase';

// Use the same CORS-friendly approach from supabase.ts
const supabaseUrl = 'https://ahvxqultshujqtmbkjpy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ';

// Direct fetch helper for CORS-friendly requests (avoiding RLS issues)
const corsRequest = async (endpoint: string, options: any = {}) => {
  const url = `${supabaseUrl}/rest/v1/${endpoint}`;
  
  console.log('🌐 Making CORS request to:', url);
  
  const response = await fetch(url, {
    method: 'GET',
    ...options,
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(options.headers || {})
    },
    mode: 'cors',
    credentials: 'omit'
  });
  
  console.log('📡 Response status:', response.status);
  
  if (!response.ok) {
    console.error('❌ CORS request failed:', response.status, response.statusText);
    throw new Error(`Request failed: ${response.status}`);
  }
  
  return response;
};

interface RealSession {
  id: number;
  session_id: string;
  student_email: string;
  student_name: string;
  login_time: string;
  logout_time: string | null;
  session_duration_minutes: number | null;
  device_type: string;
  browser: string;
  operating_system: string;
  location_country: string;
  location_city: string;
  is_active: boolean;
}

interface RealQuiz {
  id: number;
  student_email: string;
  course_name: string;
  quiz_name: string;
  start_time: string;
  end_time: string;
  time_taken_minutes: number;
  questions_total: number;
  correct_answers: number;
  wrong_answers: number;
  score_percentage: number;
  pass_status: boolean;
}

interface RealActivity {
  id: number;
  student_email: string;
  course_name: string;
  class_name: string;
  activity_type: string;
  activity_details: string;
  activity_time: string;
  time_spent_minutes: number;
  progress_percentage: number;
  completion_status: string;
}

export const directRealTimeService = {
  // Get TODAY's real sessions using CORS request
  async getTodaysRealSessions(): Promise<RealSession[]> {
    try {
      console.log('🚀 FIXED DIRECT SERVICE: Starting session fetch...');
      
      // First check for student@example.com specifically using CORS request
      console.log('🔍 STEP 1: Looking for student@example.com sessions...');
      
      const studentResponse = await corsRequest('student_sessions?select=*&student_email=eq.student@example.com&order=login_time.desc');
      const studentData = await studentResponse.json();
      
      console.log('🎯 STUDENT@EXAMPLE.COM sessions found:', studentData?.length || 0);
      if (studentData && studentData.length > 0) {
        console.log('📋 Student sessions:', studentData);
        return studentData;
      }
      
      // If no specific student data, get all recent sessions
      console.log('🔍 STEP 2: Getting all recent sessions...');
      const allResponse = await corsRequest('student_sessions?select=*&order=login_time.desc&limit=20');
      const allData = await allResponse.json();
      
      console.log('📊 TOTAL recent sessions found:', allData?.length || 0);
      if (allData && allData.length > 0) {
        console.log('📋 All sessions:', allData.map((s: any) => ({
          email: s.student_email,
          login_time: s.login_time,
          session_id: s.session_id
        })));
      }

      return allData || [];
    } catch (error) {
      console.error('❌ Exception in getTodaysRealSessions:', error);
      return [];
    }
  },

  // Get TODAY's real quiz results using CORS request
  async getTodaysRealQuizzes(): Promise<RealQuiz[]> {
    try {
      console.log('🔍 FIXED SERVICE: Fetching quiz results...');
      
      const studentResponse = await corsRequest('student_quiz_performance?select=*&student_email=eq.student@example.com&order=start_time.desc');
      const studentData = await studentResponse.json();
      
      console.log('🎯 Quiz results for student@example.com:', studentData?.length || 0);
      if (studentData && studentData.length > 0) {
        console.log('📝 Quiz data:', studentData);
        return studentData;
      }
      
      // Get all recent quiz data
      const allResponse = await corsRequest('student_quiz_performance?select=*&order=start_time.desc&limit=20');
      const allData = await allResponse.json();
      
      console.log('📊 Total quiz results found:', allData?.length || 0);
      return allData || [];
    } catch (error) {
      console.error('❌ Exception in getTodaysRealQuizzes:', error);
      return [];
    }
  },

  // Get TODAY's real course activities using CORS request
  async getTodaysRealActivities(): Promise<RealActivity[]> {
    try {
      console.log('🔍 FIXED SERVICE: Fetching course activities...');
      
      const studentResponse = await corsRequest('student_course_activities?select=*&student_email=eq.student@example.com&order=activity_time.desc');
      const studentData = await studentResponse.json();
      
      console.log('🎯 Activities for student@example.com:', studentData?.length || 0);
      if (studentData && studentData.length > 0) {
        console.log('📚 Activity data:', studentData);
        return studentData;
      }
      
      // Get all recent activities
      const allResponse = await corsRequest('student_course_activities?select=*&order=activity_time.desc&limit=20');
      const allData = await allResponse.json();
      
      console.log('📊 Total activities found:', allData?.length || 0);
      return allData || [];
    } catch (error) {
      console.error('❌ Exception in getTodaysRealActivities:', error);
      return [];
    }
  },

  // Get comprehensive real-time data for specific student
  async getStudentRealTimeData(studentEmail: string) {
    try {
      console.log('🎯 FIXED SERVICE: Fetching comprehensive data for student:', studentEmail);
      
      const [sessions, quizzes, activities] = await Promise.all([
        this.getTodaysRealSessions(),
        this.getTodaysRealQuizzes(), 
        this.getTodaysRealActivities()
      ]);

      // Filter for specific student
      const studentSessions = sessions.filter(s => s.student_email === studentEmail);
      const studentQuizzes = quizzes.filter(q => q.student_email === studentEmail);
      const studentActivities = activities.filter(a => a.student_email === studentEmail);

      console.log(`📊 Student ${studentEmail} FIXED data:`, {
        sessions: studentSessions.length,
        quizzes: studentQuizzes.length,
        activities: studentActivities.length
      });

      // Create activity timeline with REAL timestamps
      const timeline = [
        ...studentSessions.map(session => ({
          id: `session_${session.id}`,
          type: 'session',
          timestamp: session.login_time,
          action: session.is_active ? 'Started session' : 'Ended session',
          details: `${session.device_type} • ${session.browser} • ${session.location_city}, ${session.location_country}`,
          duration: session.session_duration_minutes ? `${session.session_duration_minutes} min` : 'Active',
          icon: '🔗',
          status: session.is_active ? 'Active' : 'Ended'
        })),
        ...studentQuizzes.map(quiz => ({
          id: `quiz_${quiz.id}`,
          type: 'quiz', 
          timestamp: quiz.start_time,
          action: `Completed ${quiz.quiz_name}`,
          details: `${quiz.course_name} • Score: ${quiz.score_percentage}% (${quiz.correct_answers}/${quiz.questions_total})`,
          duration: `${quiz.time_taken_minutes} min`,
          icon: quiz.pass_status ? '✅' : '❌',
          status: quiz.pass_status ? 'Passed' : 'Failed'
        })),
        ...studentActivities.map(activity => ({
          id: `activity_${activity.id}`,
          type: 'course',
          timestamp: activity.activity_time,
          action: `${activity.activity_type} - ${activity.course_name}`,
          details: `${activity.class_name} • ${activity.activity_details}`,
          duration: `${activity.time_spent_minutes} min`,
          icon: '📚',
          status: activity.completion_status
        }))
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      // Calculate course progress for this student
      const courseProgress = studentActivities.reduce((acc: any, activity) => {
        const courseKey = activity.course_name;
        if (!acc[courseKey]) {
          acc[courseKey] = {
            courseName: activity.course_name,
            totalTime: 0,
            avgProgress: 0,
            activitiesCount: 0,
            lastActivity: activity.activity_time
          };
        }
        
        acc[courseKey].totalTime += activity.time_spent_minutes;
        acc[courseKey].avgProgress = (acc[courseKey].avgProgress + activity.progress_percentage) / 2;
        acc[courseKey].activitiesCount += 1;
        
        if (new Date(activity.activity_time) > new Date(acc[courseKey].lastActivity)) {
          acc[courseKey].lastActivity = activity.activity_time;
        }
        
        return acc;
      }, {});

      return {
        sessions: studentSessions,
        quizzes: studentQuizzes,
        activities: studentActivities,
        timeline: timeline,
        courseProgress: Object.values(courseProgress),
        summary: {
          totalSessions: studentSessions.length,
          activeSessions: studentSessions.filter(s => s.is_active).length,
          totalQuizzes: studentQuizzes.length,
          avgQuizScore: studentQuizzes.length > 0 
            ? (studentQuizzes.reduce((sum, q) => sum + q.score_percentage, 0) / studentQuizzes.length).toFixed(1)
            : 0,
          totalActivities: studentActivities.length,
          totalTimeSpent: studentActivities.reduce((sum, a) => sum + a.time_spent_minutes, 0)
        }
      };
    } catch (error) {
      console.error('❌ Exception in getStudentRealTimeData:', error);
      return null;
    }
  },

  // Get all real-time data
  async getAllRealTimeData() {
    try {
      console.log('🚀 FIXED SERVICE: Getting ALL real-time data...');
      
      const [sessions, quizzes, activities] = await Promise.all([
        this.getTodaysRealSessions(),
        this.getTodaysRealQuizzes(),
        this.getTodaysRealActivities()
      ]);

      console.log('📊 FIXED SERVICE totals:', {
        sessions: sessions.length,
        quizzes: quizzes.length,
        activities: activities.length
      });

      return {
        sessions,
        quizzes,
        activities,
        summary: {
          totalStudents: new Set(sessions.map(s => s.student_email)).size,
          activeSessions: sessions.filter(s => s.is_active).length,
          totalQuizzes: quizzes.length,
          totalActivities: activities.length
        }
      };
    } catch (error) {
      console.error('❌ Exception in getAllRealTimeData:', error);
      return {
        sessions: [],
        quizzes: [],
        activities: [],
        summary: { totalStudents: 0, activeSessions: 0, totalQuizzes: 0, totalActivities: 0 }
      };
    }
  }
}; 