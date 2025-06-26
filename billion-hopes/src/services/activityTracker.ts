// =============================================
// REAL-TIME ACTIVITY TRACKING SERVICE
// Captures every action paid students take on the website
// =============================================

const SUPABASE_URL = 'https://ahvxqultshujqtmbkjpy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ';

interface ActivityData {
  studentEmail: string;
  studentName: string;
  activityType: string;
  activityDetails: string;
  pageUrl: string;
  pageTitle: string;
  courseName?: string;
  sessionId: string;
  userAgent: string;
  ipAddress: string;
  timeSpent?: number;
  metadata?: any;
}

interface SessionData {
  studentEmail: string;
  studentName: string;
  sessionId: string;
  loginTime: string;
  logoutTime?: string;
  sessionDuration?: number;
  deviceType: string;
  browser: string;
  operatingSystem: string;
  ipAddress: string;
  locationCity?: string;
  locationCountry?: string;
  isActive: boolean;
}

class ActivityTracker {
  private sessionId: string;
  private studentEmail: string | null = null;
  private studentName: string | null = null;
  private sessionStartTime: Date | null = null;
  private lastActivityTime: Date = new Date();
  private pageStartTime: Date = new Date();
  private activityBuffer: ActivityData[] = [];
  private flushInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializeTracking();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getDeviceInfo() {
    const userAgent = navigator.userAgent;
    let deviceType = 'desktop';
    let browser = 'Unknown';
    let operatingSystem = 'Unknown';

    // Detect device type
    if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
      deviceType = /iPad/.test(userAgent) ? 'tablet' : 'mobile';
    }

    // Detect browser
    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Edge')) browser = 'Edge';

    // Detect OS
    if (userAgent.includes('Windows')) operatingSystem = 'Windows';
    else if (userAgent.includes('Mac')) operatingSystem = 'macOS';
    else if (userAgent.includes('Linux')) operatingSystem = 'Linux';
    else if (userAgent.includes('Android')) operatingSystem = 'Android';
    else if (userAgent.includes('iOS')) operatingSystem = 'iOS';

    return { deviceType, browser, operatingSystem };
  }

  private async sendToSupabase(table: string, data: any) {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        console.error(`Failed to send data to ${table}:`, response.statusText);
      }
    } catch (error) {
      console.error(`Error sending data to ${table}:`, error);
    }
  }

  private initializeTracking() {
    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.trackActivity('Page Hidden', 'User switched tab or minimized window');
        this.flushActivities();
      } else {
        this.trackActivity('Page Visible', 'User returned to tab');
      }
    });

    // Track page unload
    window.addEventListener('beforeunload', () => {
      this.endSession();
    });

    // Track mouse movements and clicks
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      this.trackActivity('Click', `Clicked on ${target.tagName}: ${target.textContent?.slice(0, 50) || 'Unknown'}`);
    });

    // Track scroll behavior
    let scrollTimeout: NodeJS.Timeout;
    document.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        this.trackActivity('Scroll', `Scrolled to ${scrollPercent}% of page`);
      }, 1000);
    });

    // Flush activities every 30 seconds
    this.flushInterval = setInterval(() => {
      this.flushActivities();
    }, 30000);
  }

  // Initialize session for a paid student
  async startSession(studentEmail: string, studentName: string) {
    this.studentEmail = studentEmail;
    this.studentName = studentName;
    this.sessionStartTime = new Date();

    const deviceInfo = this.getDeviceInfo();
    
    // Get IP and location (simplified - in production use a proper geolocation service)
    const ipAddress = await this.getClientIP();
    const location = await this.getLocation();

    const sessionData: SessionData = {
      studentEmail,
      studentName,
      sessionId: this.sessionId,
      loginTime: this.sessionStartTime.toISOString(),
      deviceType: deviceInfo.deviceType,
      browser: deviceInfo.browser,
      operatingSystem: deviceInfo.operatingSystem,
      ipAddress,
      locationCity: location.city,
      locationCountry: location.country,
      isActive: true
    };

    await this.sendToSupabase('analytics_paid_students_sessions', sessionData);
    
    this.trackActivity('Session Start', `Student logged in from ${deviceInfo.deviceType}`);
    
    console.log('📊 Activity tracking started for:', studentEmail);
  }

  // Track specific activities
  trackActivity(activityType: string, activityDetails: string, courseName?: string, metadata?: any) {
    if (!this.studentEmail) return;

    const activity: ActivityData = {
      studentEmail: this.studentEmail,
      studentName: this.studentName || 'Unknown',
      activityType,
      activityDetails,
      pageUrl: window.location.href,
      pageTitle: document.title,
      courseName,
      sessionId: this.sessionId,
      userAgent: navigator.userAgent,
      ipAddress: 'auto-detect', // Will be populated by server
      timeSpent: Date.now() - this.lastActivityTime.getTime(),
      metadata
    };

    this.activityBuffer.push(activity);
    this.lastActivityTime = new Date();

    // Auto-flush if buffer gets too large
    if (this.activityBuffer.length >= 10) {
      this.flushActivities();
    }
  }

  // Track page visits
  trackPageVisit(pageTitle: string, pageUrl: string = window.location.href) {
    if (!this.studentEmail) return;

    const timeSpent = Date.now() - this.pageStartTime.getTime();
    
    // Send previous page data if exists
    if (timeSpent > 1000) { // Only if spent more than 1 second
      this.sendToSupabase('analytics_paid_students_page_visits', {
        session_id: this.getSessionDBId(),
        student_email: this.studentEmail,
        page_url: pageUrl,
        page_title: pageTitle,
        visit_time: new Date().toISOString(),
        time_spent_seconds: Math.round(timeSpent / 1000),
        referrer_url: document.referrer,
        is_course_page: pageUrl.includes('/course/'),
        course_name: this.extractCourseNameFromUrl(pageUrl)
      });
    }

    this.pageStartTime = new Date();
    this.trackActivity('Page Visit', `Visited: ${pageTitle}`);
  }

  // Track course-specific activities
  trackCourseActivity(courseName: string, activityType: string, activityDetails: string, progressPercentage?: number) {
    this.trackActivity(`Course: ${activityType}`, activityDetails, courseName, {
      progress: progressPercentage
    });

    // Send to course activities table
    this.sendToSupabase('analytics_paid_students_course_activities', {
      student_email: this.studentEmail,
      course_name: courseName,
      activity_type: activityType,
      activity_details: activityDetails,
      activity_time: new Date().toISOString(),
      time_spent_minutes: Math.round((Date.now() - this.lastActivityTime.getTime()) / 60000),
      progress_percentage: progressPercentage || 0,
      session_id: this.sessionId
    });
  }

  // Track quiz activities
  trackQuizActivity(courseName: string, quizName: string, score: number, totalQuestions: number, correctAnswers: number, timeTaken: number) {
    this.trackActivity('Quiz Completed', `${quizName} - Score: ${score}%`, courseName);

    this.sendToSupabase('analytics_paid_students_quiz_performance', {
      student_email: this.studentEmail,
      course_name: courseName,
      quiz_name: quizName,
      start_time: new Date(Date.now() - (timeTaken * 1000)).toISOString(),
      end_time: new Date().toISOString(),
      score_percentage: score,
      questions_total: totalQuestions,
      correct_answers: correctAnswers,
      time_taken_minutes: Math.round(timeTaken / 60),
      session_id: this.sessionId
    });
  }

  // Track downloads
  trackDownload(fileName: string, fileType: string, fileSize: number, courseName?: string) {
    this.trackActivity('File Download', `Downloaded: ${fileName}`, courseName);

    this.sendToSupabase('analytics_paid_students_downloads', {
      student_email: this.studentEmail,
      file_name: fileName,
      file_type: fileType,
      file_size_mb: Math.round(fileSize / (1024 * 1024) * 100) / 100,
      course_name: courseName,
      download_time: new Date().toISOString(),
      download_status: 'completed',
      session_id: this.sessionId
    });
  }

  // Helper functions
  private async getClientIP(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return 'unknown';
    }
  }

  private async getLocation(): Promise<{city: string, country: string}> {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      return {
        city: data.city || 'Unknown',
        country: data.country_name || 'Unknown'
      };
    } catch {
      return { city: 'Unknown', country: 'Unknown' };
    }
  }

  private extractCourseNameFromUrl(url: string): string | null {
    const match = url.match(/\/course\/([^\/]+)/);
    return match ? decodeURIComponent(match[1]) : null;
  }

  private getSessionDBId(): number {
    // In a real implementation, you'd store the database ID when creating the session
    return parseInt(this.sessionId.split('_')[1]) % 1000000;
  }

  private async flushActivities() {
    if (this.activityBuffer.length === 0) return;

    // Send all buffered activities
    for (const activity of this.activityBuffer) {
      await this.sendToSupabase('analytics_paid_students_page_visits', {
        session_id: this.getSessionDBId(),
        student_email: activity.studentEmail,
        page_url: activity.pageUrl,
        page_title: activity.pageTitle,
        visit_time: new Date().toISOString(),
        time_spent_seconds: Math.round((activity.timeSpent || 0) / 1000),
        referrer_url: document.referrer,
        is_course_page: activity.pageUrl.includes('/course/'),
        course_name: activity.courseName
      });
    }

    this.activityBuffer = [];
    console.log('📊 Activities flushed to database');
  }

  // End session
  async endSession() {
    if (!this.sessionStartTime || !this.studentEmail) return;

    const sessionDuration = Math.round((Date.now() - this.sessionStartTime.getTime()) / 60000); // in minutes

    // Update session with logout time
    await this.sendToSupabase('analytics_paid_students_sessions', {
      student_email: this.studentEmail,
      session_id: this.sessionId,
      logout_time: new Date().toISOString(),
      session_duration_minutes: sessionDuration,
      is_active: false
    });

    // Calculate daily engagement
    await this.updateDailyEngagement(sessionDuration);

    this.flushActivities();
    
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }

    console.log('📊 Session ended. Duration:', sessionDuration, 'minutes');
  }

  private async updateDailyEngagement(sessionDuration: number) {
    const today = new Date().toISOString().split('T')[0];
    
    // This would update or insert daily engagement metrics
    await this.sendToSupabase('analytics_paid_students_engagement', {
      student_email: this.studentEmail,
      date: today,
      total_login_time_minutes: sessionDuration,
      pages_visited: this.activityBuffer.filter(a => a.activityType === 'Page Visit').length,
      courses_accessed: new Set(this.activityBuffer.map(a => a.courseName).filter(Boolean)).size,
      quizzes_taken: this.activityBuffer.filter(a => a.activityType === 'Quiz Completed').length,
      downloads_count: this.activityBuffer.filter(a => a.activityType === 'File Download').length,
      engagement_score: Math.min(100, Math.round(sessionDuration / 10 + this.activityBuffer.length))
    });
  }
}

// Global tracker instance
export const activityTracker = new ActivityTracker();

// Export functions for easy use
export const startSession = activityTracker.startSession.bind(activityTracker);
export const trackActivity = activityTracker.trackActivity.bind(activityTracker);
export const trackPageVisit = activityTracker.trackPageVisit.bind(activityTracker);
export const trackCourseActivity = activityTracker.trackCourseActivity.bind(activityTracker);
export const trackQuizActivity = activityTracker.trackQuizActivity.bind(activityTracker);
export const trackDownload = activityTracker.trackDownload.bind(activityTracker);
export const endSession = activityTracker.endSession.bind(activityTracker); 