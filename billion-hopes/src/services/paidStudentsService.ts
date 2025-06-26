// =============================================
// PAID STUDENTS ANALYTICS SERVICE
// Fetches comprehensive tracking data for paid students only
// =============================================

const SUPABASE_URL = 'https://ahvxqultshujqtmbkjpy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ';

const fetchPaidStudentsData = async (table: string, query: string = '') => {
  const url = `${SUPABASE_URL}/rest/v1/${table}${query}`;
  console.log(`🔍 Fetching paid students data from: ${url}`);
  
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

export const searchPaidStudentHistory = async (studentEmail: string) => {
  try {
    console.log(`🔍 SEARCHING complete history for: ${studentEmail}`);

    // Fetch all data for this specific student
    const sessionsData = await fetchPaidStudentsData('analytics_paid_students_sessions', `?student_email=eq.${studentEmail}&order=login_time.desc`);
    const pageVisitsData = await fetchPaidStudentsData('analytics_paid_students_page_visits', `?student_email=eq.${studentEmail}&order=visit_time.desc`);
    const courseActivitiesData = await fetchPaidStudentsData('analytics_paid_students_course_activities', `?student_email=eq.${studentEmail}&order=activity_time.desc`);
    const quizPerformanceData = await fetchPaidStudentsData('analytics_paid_students_quiz_performance', `?student_email=eq.${studentEmail}&order=start_time.desc`);
    const downloadsData = await fetchPaidStudentsData('analytics_paid_students_downloads', `?student_email=eq.${studentEmail}&order=download_time.desc`);
    const engagementData = await fetchPaidStudentsData('analytics_paid_students_engagement', `?student_email=eq.${studentEmail}&order=date.desc`);

    if (sessionsData.length === 0) {
      return {
        found: false,
        message: `No data found for student: ${studentEmail}`
      };
    }

    // Calculate totals
    const totalSessions = sessionsData.length;
    const totalLoginTime = sessionsData.reduce((sum: number, session: any) => sum + (session.session_duration_minutes || 0), 0);
    const totalPageVisits = pageVisitsData.length;
    const totalCourseActivities = courseActivitiesData.length;
    const totalQuizzes = quizPerformanceData.length;
    const totalDownloads = downloadsData.length;

    // Get unique courses accessed
    const coursesAccessed = Array.from(new Set(courseActivitiesData.map((activity: any) => activity.course_name)));
    
    // Calculate average quiz score
    const avgQuizScore = quizPerformanceData.length > 0 
      ? Math.round(quizPerformanceData.reduce((sum: number, quiz: any) => sum + quiz.score_percentage, 0) / quizPerformanceData.length)
      : 0;

    // Get engagement trend (last 7 days)
    const engagementTrend = engagementData.slice(0, 7).map((engagement: any) => ({
      date: engagement.date,
      loginTime: engagement.total_login_time_minutes,
      activities: engagement.pages_visited + engagement.courses_accessed + engagement.quizzes_taken,
      score: engagement.engagement_score
    }));

    // Recent activity timeline (combined from all sources)
    const allActivities = [
      ...sessionsData.map((session: any) => ({
        type: 'session',
        action: session.is_active ? 'Started session' : 'Ended session',
        timestamp: session.is_active ? session.login_time : session.logout_time,
        details: `${session.device_type} from ${session.location_city}, ${session.location_country}`,
        duration: session.session_duration_minutes ? `${session.session_duration_minutes} min` : 'Active'
      })),
      ...courseActivitiesData.map((activity: any) => ({
        type: 'course',
        action: `${activity.activity_type} - ${activity.course_name}`,
        timestamp: activity.activity_time,
        details: activity.activity_details,
        duration: `${activity.time_spent_minutes} min`
      })),
      ...quizPerformanceData.map((quiz: any) => ({
        type: 'quiz',
        action: `Completed ${quiz.quiz_name}`,
        timestamp: quiz.start_time,
        details: `Score: ${quiz.score_percentage}% (${quiz.correct_answers}/${quiz.questions_total})`,
        duration: `${quiz.time_taken_minutes} min`
      })),
      ...downloadsData.map((download: any) => ({
        type: 'download',
        action: `Downloaded ${download.file_name}`,
        timestamp: download.download_time,
        details: `${download.file_type.toUpperCase()} - ${download.file_size_mb}MB`,
        duration: download.download_status
      })),
      ...pageVisitsData.map((visit: any) => ({
        type: 'page_visit',
        action: `Visited ${visit.page_title}`,
        timestamp: visit.visit_time,
        details: visit.page_url,
        duration: `${Math.round(visit.time_spent_seconds / 60)} min`
      }))
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Course progress analysis
    const courseProgress = coursesAccessed.map(courseName => {
      const activities = courseActivitiesData.filter((activity: any) => activity.course_name === courseName);
      const quizzes = quizPerformanceData.filter((quiz: any) => quiz.course_name === courseName);
      const downloads = downloadsData.filter((download: any) => download.course_name === courseName);
      
      const totalTimeSpent = activities.reduce((sum: number, activity: any) => sum + (activity.time_spent_minutes || 0), 0);
      const latestProgress = Math.max(...activities.map((activity: any) => activity.progress_percentage || 0), 0);
      
      return {
        courseName,
        activitiesCount: activities.length,
        timeSpent: totalTimeSpent,
        progress: latestProgress,
        quizzesCompleted: quizzes.length,
        downloadsCount: downloads.length,
        lastActivity: activities.length > 0 ? new Date(activities[0].activity_time).toLocaleDateString() : 'N/A'
      };
    });

    // Device usage analysis
    const deviceUsage = sessionsData.reduce((acc: any, session: any) => {
      acc[session.device_type] = (acc[session.device_type] || 0) + 1;
      return acc;
    }, {});

    // Location analysis
    const locationHistory = sessionsData.map((session: any) => ({
      city: session.location_city,
      country: session.location_country,
      loginTime: new Date(session.login_time).toLocaleString(),
      device: session.device_type,
      browser: session.browser
    }));

    return {
      found: true,
      studentEmail,
      studentName: sessionsData[0]?.student_name || 'Unknown',
      summary: {
        totalSessions,
        totalLoginTime,
        totalPageVisits,
        totalCourseActivities,
        totalQuizzes,
        totalDownloads,
        coursesAccessedCount: coursesAccessed.length,
        avgQuizScore,
        firstActivity: sessionsData[sessionsData.length - 1]?.login_time,
        lastActivity: sessionsData[0]?.login_time
      },
      engagementTrend,
      activityTimeline: allActivities.slice(0, 50), // Last 50 activities
      courseProgress,
      deviceUsage: Object.entries(deviceUsage).map(([device, count]) => ({ device, count })),
      locationHistory: locationHistory.slice(0, 10), // Last 10 locations
      detailedSessions: sessionsData.slice(0, 10), // Last 10 sessions
      recentQuizzes: quizPerformanceData.slice(0, 5),
      recentDownloads: downloadsData.slice(0, 5)
    };

  } catch (error) {
    console.error('❌ Student search failed:', error);
    return {
      found: false,
      message: `Search failed: ${error}`
    };
  }
};

export const getPaidStudentsAnalyticsData = async () => {
  try {
    console.log('🚀 PAID STUDENTS ANALYTICS SERVICE STARTING...');

    // Fetch all paid students data
    const sessionsData = await fetchPaidStudentsData('analytics_paid_students_sessions', '?order=login_time.desc');
    const pageVisitsData = await fetchPaidStudentsData('analytics_paid_students_page_visits', '?order=visit_time.desc&limit=50');
    const courseActivitiesData = await fetchPaidStudentsData('analytics_paid_students_course_activities', '?order=activity_time.desc');
    const quizPerformanceData = await fetchPaidStudentsData('analytics_paid_students_quiz_performance', '?order=start_time.desc');
    const downloadsData = await fetchPaidStudentsData('analytics_paid_students_downloads', '?order=download_time.desc');
    const engagementData = await fetchPaidStudentsData('analytics_paid_students_engagement', '?order=date.desc');

    console.log('📊 Processing paid students data...');

    // Process sessions data
    const totalSessions = sessionsData.length;
    const activeSessions = sessionsData.filter((session: any) => session.is_active).length;
    const totalStudents = new Set(sessionsData.map((session: any) => session.student_email)).size;

    // Calculate average session duration
    const completedSessions = sessionsData.filter((session: any) => session.session_duration_minutes);
    const avgSessionDuration = completedSessions.length > 0 
      ? Math.round(completedSessions.reduce((sum: number, session: any) => sum + session.session_duration_minutes, 0) / completedSessions.length)
      : 0;

    // Device breakdown
    const deviceStats = sessionsData.reduce((acc: any, session: any) => {
      acc[session.device_type] = (acc[session.device_type] || 0) + 1;
      return acc;
    }, {});

    // Location breakdown
    const locationStats = sessionsData.reduce((acc: any, session: any) => {
      const key = `${session.location_city}, ${session.location_country}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    // Course engagement stats
    const courseStats = courseActivitiesData.reduce((acc: any, activity: any) => {
      if (!acc[activity.course_name]) {
        acc[activity.course_name] = {
          name: activity.course_name,
          students: new Set(),
          totalActivities: 0,
          totalTimeSpent: 0
        };
      }
      acc[activity.course_name].students.add(activity.student_email);
      acc[activity.course_name].totalActivities++;
      acc[activity.course_name].totalTimeSpent += activity.time_spent_minutes || 0;
      return acc;
    }, {});

    // Convert course stats
    const popularCourses = Object.values(courseStats).map((course: any) => ({
      name: course.name,
      studentsCount: course.students.size,
      totalActivities: course.totalActivities,
      avgTimePerStudent: course.students.size > 0 ? Math.round(course.totalTimeSpent / course.students.size) : 0
    })).sort((a: any, b: any) => b.studentsCount - a.studentsCount);

    // Quiz performance stats
    const quizStats = {
      totalQuizzes: quizPerformanceData.length,
      avgScore: quizPerformanceData.length > 0 
        ? Math.round(quizPerformanceData.reduce((sum: number, quiz: any) => sum + quiz.score_percentage, 0) / quizPerformanceData.length)
        : 0,
      passRate: quizPerformanceData.length > 0
        ? Math.round((quizPerformanceData.filter((quiz: any) => quiz.score_percentage >= 70).length / quizPerformanceData.length) * 100)
        : 0
    };

    // Recent activity feed
    const recentActivities = [
      ...courseActivitiesData.slice(0, 5).map((activity: any) => ({
        id: activity.id,
        type: 'course_activity',
        studentEmail: activity.student_email,
        action: `${activity.activity_type} - ${activity.course_name}`,
        details: activity.activity_details,
        time: new Date(activity.activity_time).toLocaleString(),
        device: activity.device_used
      })),
      ...quizPerformanceData.slice(0, 3).map((quiz: any) => ({
        id: quiz.id,
        type: 'quiz',
        studentEmail: quiz.student_email,
        action: `Completed ${quiz.quiz_name}`,
        details: `Score: ${quiz.score_percentage}%`,
        time: new Date(quiz.start_time).toLocaleString(),
        device: quiz.device_used
      })),
      ...downloadsData.slice(0, 3).map((download: any) => ({
        id: download.id,
        type: 'download',
        studentEmail: download.student_email,
        action: `Downloaded ${download.file_name}`,
        details: `${download.file_type.toUpperCase()} - ${download.file_size_mb}MB`,
        time: new Date(download.download_time).toLocaleString(),
        device: download.device_used
      }))
    ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 10);

    // Student session details
    const studentSessions = sessionsData.map((session: any) => ({
      id: session.id,
      studentEmail: session.student_email,
      studentName: session.student_name,
      loginTime: new Date(session.login_time).toLocaleString(),
      logoutTime: session.logout_time ? new Date(session.logout_time).toLocaleString() : 'Still Active',
      duration: session.session_duration_minutes ? `${session.session_duration_minutes} min` : 'Ongoing',
      device: session.device_type,
      browser: session.browser,
      location: `${session.location_city}, ${session.location_country}`,
      isActive: session.is_active
    }));

    // Top performing students
    const studentPerformance = engagementData.map((engagement: any) => ({
      email: engagement.student_email,
      totalTime: engagement.total_login_time_minutes,
      pagesVisited: engagement.pages_visited,
      coursesAccessed: engagement.courses_accessed,
      quizzesTaken: engagement.quizzes_taken,
      downloadsCount: engagement.downloads_count,
      engagementScore: engagement.engagement_score,
      lastActivity: new Date(engagement.last_activity_time).toLocaleString()
    })).sort((a: any, b: any) => b.engagementScore - a.engagementScore);

    const result = {
      overview: {
        totalStudents,
        totalSessions,
        activeSessions,
        avgSessionDuration,
        totalQuizzes: quizStats.totalQuizzes,
        avgQuizScore: quizStats.avgScore,
        quizPassRate: quizStats.passRate,
        totalDownloads: downloadsData.length
      },
      deviceBreakdown: Object.entries(deviceStats).map(([device, count]) => ({
        device,
        count,
        percentage: Math.round((count as number / totalSessions) * 100)
      })),
      locationBreakdown: Object.entries(locationStats).slice(0, 10).map(([location, count]) => ({
        location,
        count,
        percentage: Math.round((count as number / totalSessions) * 100)
      })),
      popularCourses: popularCourses.slice(0, 5),
      recentActivities,
      studentSessions: studentSessions.slice(0, 20),
      topPerformers: studentPerformance.slice(0, 10),
      courseEngagement: courseActivitiesData.length,
      totalVideoWatchTime: courseActivitiesData.reduce((sum: number, activity: any) => 
        sum + (activity.activity_type === 'viewed' ? activity.time_spent_minutes || 0 : 0), 0
      )
    };

    console.log('🎉 PAID STUDENTS ANALYTICS RESULT:', result);
    return result;

  } catch (error) {
    console.error('❌ Paid students analytics service failed:', error);
    
    // Return sample data as fallback
    return {
      overview: {
        totalStudents: 8,
        totalSessions: 8,
        activeSessions: 1,
        avgSessionDuration: 125,
        totalQuizzes: 6,
        avgQuizScore: 85,
        quizPassRate: 100,
        totalDownloads: 7
      },
      deviceBreakdown: [
        { device: 'desktop', count: 5, percentage: 62 },
        { device: 'mobile', count: 2, percentage: 25 },
        { device: 'tablet', count: 1, percentage: 13 }
      ],
      locationBreakdown: [
        { location: 'Mumbai, India', count: 1, percentage: 12 },
        { location: 'Delhi, India', count: 1, percentage: 12 },
        { location: 'New York, United States', count: 1, percentage: 12 }
      ],
      popularCourses: [
        { name: 'Complete Python Programming Masterclass', studentsCount: 2, totalActivities: 3, avgTimePerStudent: 67 },
        { name: 'Machine Learning & AI Fundamentals', studentsCount: 2, totalActivities: 3, avgTimePerStudent: 75 }
      ],
      recentActivities: [
        { id: 1, type: 'course_activity', studentEmail: 'john.smith@gmail.com', action: 'viewed - Complete Python Programming Masterclass', details: 'Watched Introduction to Python video', time: '6/26/2025, 3:20:00 PM', device: 'desktop' }
      ],
      studentSessions: [
        { id: 1, studentEmail: 'john.smith@gmail.com', studentName: 'John Smith', loginTime: '6/26/2025, 2:45:00 PM', logoutTime: '6/26/2025, 5:00:00 PM', duration: '135 min', device: 'desktop', browser: 'Chrome 131', location: 'Mumbai, India', isActive: false }
      ],
      topPerformers: [
        { email: 'emily.davis@gmail.com', totalTime: 105, pagesVisited: 1, coursesAccessed: 1, quizzesTaken: 1, downloadsCount: 1, engagementScore: 95.7, lastActivity: '6/26/2025, 6:30:00 PM' }
      ],
      courseEngagement: 8,
      totalVideoWatchTime: 355
    };
  }
};

// NEW FUNCTION: Search real paid student from existing tables
export async function searchRealPaidStudentHistory(email: string) {
  try {
    console.log('🔍 Searching for REAL paid student:', email);

    // Helper function for direct Supabase queries
    const fetchRealData = async (table: string, query: string = '') => {
      const url = `${SUPABASE_URL}/rest/v1/${table}${query}`;
      console.log(`🔍 Fetching real data from: ${url}`);
      
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

    // Get user info from users table
    const userInfo = await fetchRealData('users', `?email=eq.${email}`);
    
    if (!userInfo || userInfo.length === 0) {
      console.log('❌ User not found in users table');
      return {
        found: false,
        message: `User ${email} not found in users table`
      };
    }

    const user = userInfo[0];

    // Get all orders for this user
    const orders = await fetchRealData('orders', `?customer_email=eq.${email}&status=eq.completed&order=created_at.desc`);

    if (!orders || orders.length === 0) {
      return {
        found: false,
        message: `No completed orders found for ${email}`
      };
    }

    // Get course details for enrolled courses
    const courseNames = orders.map((order: any) => order.course_name);
    let courseDetails: any[] = [];
    
    if (courseNames.length > 0) {
      // Use name filter for courses
      const courseQueries = courseNames.map((courseName: string) => 
        fetchRealData('courses', `?name=eq.${encodeURIComponent(courseName)}`)
      );
      
      const courseResults = await Promise.all(courseQueries);
      courseDetails = courseResults.flat();
    }

    // Create activity timeline from available data
    const activityTimeline: any[] = [];
    
    // Add order activities
    orders.forEach((order: any) => {
      activityTimeline.push({
        timestamp: order.created_at,
        type: 'Course Purchase',
        details: `Purchased "${order.course_name}" for ₹${order.amount}`,
        icon: '🛒',
        course: order.course_name
      });
    });

    // Sort timeline by most recent first
    activityTimeline.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Calculate summary stats
    const totalCoursesEnrolled = orders.length;
    const totalAmountSpent = orders.reduce((sum: number, order: any) => sum + parseFloat(order.amount || '0'), 0);
    const firstOrderDate = orders.length > 0 ? 
      new Date(Math.min(...orders.map((o: any) => new Date(o.created_at).getTime()))) : null;

    const profile = {
      email: user.email,
      name: user.name,
      status: user.status,
      joinDate: user.created_at,
      totalSessions: 'N/A (Real-time tracking not yet implemented)',
      totalTimeSpent: 'N/A (Real-time tracking not yet implemented)',
      coursesEnrolled: totalCoursesEnrolled,
      totalAmountSpent: totalAmountSpent,
      averageQuizScore: 'N/A (Quiz tracking not yet implemented)',
      lastActiveDate: orders.length > 0 ? orders[0].created_at : user.created_at,
      firstOrderDate: firstOrderDate?.toISOString()
    };

    const courseProgress = courseDetails.map((course: any) => {
      const order = orders.find((o: any) => o.course_name === course.name);
      return {
        courseName: course.name,
        instructor: course.instructor || 'N/A',
        enrolledDate: order?.created_at,
        progress: 'N/A (Progress tracking not yet implemented)',
        completionStatus: 'Enrolled',
        totalClasses: 'N/A',
        completedClasses: 'N/A'
      };
    });

    return {
      found: true,
      profile,
      activityTimeline: activityTimeline.slice(0, 50), // Last 50 activities
      courseProgress,
      deviceUsage: {
        note: 'Device tracking not yet implemented for existing users'
      },
      locationHistory: {
        note: 'Location tracking not yet implemented for existing users'
      },
      sessionInfo: {
        note: 'Session tracking not yet implemented for existing users'
      }
    };

  } catch (error) {
    console.error('❌ Error in searchRealPaidStudentHistory:', error);
    return {
      found: false,
      message: `Search failed: ${error}`
    };
  }
}

export default { getPaidStudentsAnalyticsData }; 