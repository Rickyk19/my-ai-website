// =============================================
// REAL-TIME STUDENT ANALYTICS SERVICE
// Fetches actual student activity data from comprehensive tracking tables
// Shows historical data and real-time activities
// =============================================

const SUPABASE_URL = 'https://ahvxqultshujqtmbkjpy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ';

const fetchStudentData = async (table: string, query: string = '') => {
  const url = `${SUPABASE_URL}/rest/v1/${table}${query}`;
  console.log(`🔍 Fetching student data from: ${url}`);
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error(`❌ HTTP ${response.status}: ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    console.log(`✅ Got ${data.length} rows from ${table}`);
    return data;
  } catch (error) {
    console.error(`❌ Error fetching ${table}:`, error);
    return [];
  }
};

export const getComprehensiveStudentAnalytics = async () => {
  try {
    console.log('🚀 REAL-TIME STUDENT ANALYTICS STARTING...');

    // Fetch all student activity data
    const sessions = await fetchStudentData('student_sessions', '?order=login_time.desc&limit=100');
    const pageVisits = await fetchStudentData('student_page_visits', '?order=visit_time.desc&limit=200');
    const courseActivities = await fetchStudentData('student_course_activities', '?order=activity_time.desc&limit=200');
    const quizPerformance = await fetchStudentData('student_quiz_performance', '?order=start_time.desc&limit=100');

    console.log('📊 Raw data fetched:');
    console.log('  Sessions:', sessions.length);
    console.log('  Page visits:', pageVisits.length);
    console.log('  Course activities:', courseActivities.length);
    console.log('  Quiz performance:', quizPerformance.length);

    // Process activity timeline (last 50 activities)
    const allActivities = [
      ...sessions.map((session: any) => ({
        id: `session_${session.id}`,
        type: 'session',
        studentEmail: session.student_email,
        studentName: session.student_name,
        action: session.is_active ? 'Started session' : 'Ended session',
        timestamp: session.is_active ? session.login_time : session.logout_time,
        details: `${session.device_type} • ${session.browser} • ${session.location_city}, ${session.location_country}`,
        duration: session.session_duration_minutes ? `${session.session_duration_minutes} min` : 'Active',
        icon: '🔗'
      })),
      ...courseActivities.map((activity: any) => ({
        id: `course_${activity.id}`,
        type: 'course',
        studentEmail: activity.student_email,
        action: `${activity.activity_type} - ${activity.course_name}`,
        timestamp: activity.activity_time,
        details: activity.activity_details || `${activity.class_name}`,
        duration: `${activity.time_spent_minutes} min`,
        progress: `${activity.progress_percentage}%`,
        icon: '📚'
      })),
      ...quizPerformance.map((quiz: any) => ({
        id: `quiz_${quiz.id}`,
        type: 'quiz',
        studentEmail: quiz.student_email,
        action: `Completed ${quiz.quiz_name}`,
        timestamp: quiz.start_time,
        details: `${quiz.course_name} • Score: ${quiz.score_percentage}% (${quiz.correct_answers}/${quiz.questions_total})`,
        duration: `${quiz.time_taken_minutes} min`,
        status: quiz.pass_status ? 'Passed' : 'Failed',
        icon: quiz.pass_status ? '✅' : '❌'
      }))
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Calculate summary statistics
    const totalStudents = new Set(sessions.map(s => s.student_email)).size;
    const activeSessions = sessions.filter(s => s.is_active).length;
    const totalQuizzes = quizPerformance.length;
    const passedQuizzes = quizPerformance.filter(q => q.pass_status).length;
    const avgQuizScore = quizPerformance.length > 0 
      ? Math.round(quizPerformance.reduce((sum, q) => sum + q.score_percentage, 0) / quizPerformance.length)
      : 0;

    const result = {
      summary: {
        totalStudents,
        activeSessions,
        totalQuizzes,
        passedQuizzes,
        avgQuizScore
      },
      activityTimeline: allActivities.slice(0, 50),
      realTimeData: {
        activeUsers: activeSessions,
        lastUpdated: new Date().toISOString()
      }
    };

    console.log('🎉 REAL-TIME STUDENT ANALYTICS RESULT:', result);
    return result;

  } catch (error) {
    console.error('❌ Real-time student analytics failed:', error);
    return {
      summary: {
        totalStudents: 0,
        activeSessions: 0,
        totalQuizzes: 0,
        passedQuizzes: 0,
        avgQuizScore: 0
      },
      activityTimeline: [],
      realTimeData: {
        activeUsers: 0,
        lastUpdated: new Date().toISOString()
      }
    };
  }
};

export default { getComprehensiveStudentAnalytics }; 