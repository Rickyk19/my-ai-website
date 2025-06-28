import { supabase } from '../utils/supabase';

// Utility functions for device detection
const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
};

const detectDeviceType = (): string => {
  const userAgent = navigator.userAgent.toLowerCase();
  if (/tablet|ipad|playbook|silk/.test(userAgent)) return 'Tablet';
  if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/.test(userAgent)) return 'Mobile';
  return 'Desktop';
};

const detectBrowser = (): string => {
  const userAgent = navigator.userAgent;
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  if (userAgent.includes('Opera')) return 'Opera';
  return 'Unknown';
};

const detectOS = (): string => {
  const userAgent = navigator.userAgent;
  if (userAgent.includes('Windows')) return 'Windows';
  if (userAgent.includes('Mac')) return 'macOS';
  if (userAgent.includes('Linux')) return 'Linux';
  if (userAgent.includes('Android')) return 'Android';
  if (userAgent.includes('iOS')) return 'iOS';
  return 'Unknown';
};

class ActivityTracker {
  private currentSessionId: string | null = null;
  private sessionStartTime: Date | null = null;
  private currentStudentEmail: string | null = null;
  private pageStartTime: Date | null = null;
  private currentPagePath: string | null = null;

  async initializeTracking(studentEmail: string, studentName?: string): Promise<void> {
    try {
      this.currentStudentEmail = studentEmail;
      this.currentSessionId = generateSessionId();
      this.sessionStartTime = new Date();

      const { error } = await supabase
        .from('student_sessions')
        .insert({
          session_id: this.currentSessionId,
          student_email: studentEmail,
          student_name: studentName || 'Unknown',
          login_time: this.sessionStartTime.toISOString(),
          device_type: detectDeviceType(),
          browser: detectBrowser(),
          operating_system: detectOS(),
          location_country: 'Unknown',
          location_city: 'Unknown',
          is_active: true
        });

      if (error) {
        console.error('❌ Failed to initialize tracking session:', error);
      } else {
        console.log('✅ Tracking session initialized for:', studentEmail);
      }
    } catch (error) {
      console.error('❌ Error initializing tracking:', error);
    }
  }

  async endSession(): Promise<void> {
    if (!this.currentSessionId || !this.sessionStartTime) return;

    try {
      const sessionDuration = Math.floor((Date.now() - this.sessionStartTime.getTime()) / (1000 * 60));

      const { error } = await supabase
        .from('student_sessions')
        .update({
          logout_time: new Date().toISOString(),
          session_duration_minutes: sessionDuration,
          is_active: false
        })
        .eq('session_id', this.currentSessionId);

      if (error) {
        console.error('❌ Failed to end tracking session:', error);
      } else {
        console.log('✅ Tracking session ended, duration:', sessionDuration, 'minutes');
      }

      this.currentSessionId = null;
      this.sessionStartTime = null;
      this.currentStudentEmail = null;
    } catch (error) {
      console.error('❌ Error ending session:', error);
    }
  }

  async trackPageVisit(pagePath: string, pageTitle?: string, pageType?: string): Promise<void> {
    if (!this.currentSessionId || !this.currentStudentEmail) return;

    try {
      if (this.currentPagePath && this.pageStartTime) {
        await this.endPageVisit();
      }

      this.currentPagePath = pagePath;
      this.pageStartTime = new Date();

      const { error } = await supabase
        .from('student_page_visits')
        .insert({
          student_email: this.currentStudentEmail,
          session_id: this.currentSessionId,
          page_path: pagePath,
          page_title: pageTitle || 'Unknown',
          visit_time: this.pageStartTime.toISOString(),
          page_type: pageType || 'general'
        });

      if (error) {
        console.error('❌ Failed to track page visit:', error);
      } else {
        console.log('✅ Page visit tracked:', pagePath);
      }
    } catch (error) {
      console.error('❌ Error tracking page visit:', error);
    }
  }

  private async endPageVisit(): Promise<void> {
    if (!this.currentPagePath || !this.pageStartTime || !this.currentSessionId) return;

    try {
      const timeSpentSeconds = Math.floor((Date.now() - this.pageStartTime.getTime()) / 1000);

      const { error } = await supabase
        .from('student_page_visits')
        .update({
          exit_time: new Date().toISOString(),
          time_spent_seconds: timeSpentSeconds
        })
        .eq('session_id', this.currentSessionId)
        .eq('page_path', this.currentPagePath)
        .is('exit_time', null);

      if (error) {
        console.error('❌ Failed to end page visit:', error);
      }
    } catch (error) {
      console.error('❌ Error ending page visit:', error);
    }
  }

  async trackCourseActivity(
    courseName: string,
    activityType: string,
    activityDetails?: string,
    courseId?: number,
    classId?: number,
    className?: string,
    timeSpentMinutes?: number,
    progressPercentage?: number,
    videoPositionSeconds?: number
  ): Promise<void> {
    if (!this.currentSessionId || !this.currentStudentEmail) return;

    try {
      const { error } = await supabase
        .from('student_course_activities')
        .insert({
          student_email: this.currentStudentEmail,
          session_id: this.currentSessionId,
          course_id: courseId,
          course_name: courseName,
          class_id: classId,
          class_name: className,
          activity_type: activityType,
          activity_details: activityDetails || `${activityType} in ${courseName}`,
          activity_time: new Date().toISOString(),
          time_spent_minutes: timeSpentMinutes || 0,
          progress_percentage: progressPercentage || 0,
          video_position_seconds: videoPositionSeconds,
          completion_status: progressPercentage === 100 ? 'Completed' : 'In Progress'
        });

      if (error) {
        console.error('❌ Failed to track course activity:', error);
      } else {
        console.log('✅ Course activity tracked:', activityType, 'in', courseName);
      }
    } catch (error) {
      console.error('❌ Error tracking course activity:', error);
    }
  }

  async trackQuizPerformance(
    courseName: string,
    quizName: string,
    questionsTotal: number,
    correctAnswers: number,
    timeSpentMinutes: number,
    answers?: any,
    courseId?: number,
    quizId?: number
  ): Promise<void> {
    if (!this.currentSessionId || !this.currentStudentEmail) return;

    try {
      const questionsAttempted = correctAnswers + (questionsTotal - correctAnswers);
      const wrongAnswers = questionsTotal - correctAnswers;
      const scorePercentage = (correctAnswers / questionsTotal) * 100;
      const passStatus = scorePercentage >= 60;

      const { error } = await supabase
        .from('student_quiz_performance')
        .insert({
          student_email: this.currentStudentEmail,
          session_id: this.currentSessionId,
          course_id: courseId,
          course_name: courseName,
          quiz_id: quizId,
          quiz_name: quizName,
          start_time: new Date(Date.now() - timeSpentMinutes * 60 * 1000).toISOString(),
          end_time: new Date().toISOString(),
          time_taken_minutes: timeSpentMinutes,
          questions_total: questionsTotal,
          questions_attempted: questionsAttempted,
          correct_answers: correctAnswers,
          wrong_answers: wrongAnswers,
          score_percentage: scorePercentage,
          pass_status: passStatus,
          answers_json: answers ? JSON.stringify(answers) : null
        });

      if (error) {
        console.error('❌ Failed to track quiz performance:', error);
      } else {
        console.log('✅ Quiz performance tracked:', quizName, `${scorePercentage}%`);
      }
    } catch (error) {
      console.error('❌ Error tracking quiz performance:', error);
    }
  }

  async trackDownload(
    fileName: string,
    fileType: string,
    courseName?: string,
    className?: string,
    downloadSource?: string,
    courseId?: number,
    classId?: number
  ): Promise<void> {
    if (!this.currentSessionId || !this.currentStudentEmail) return;

    try {
      const { error } = await supabase
        .from('student_downloads')
        .insert({
          student_email: this.currentStudentEmail,
          session_id: this.currentSessionId,
          course_id: courseId,
          course_name: courseName,
          class_id: classId,
          file_name: fileName,
          file_type: fileType.toUpperCase(),
          download_time: new Date().toISOString(),
          download_status: 'Completed',
          download_source: downloadSource || 'Class Material'
        });

      if (error) {
        console.error('❌ Failed to track download:', error);
      } else {
        console.log('✅ Download tracked:', fileName);
      }
    } catch (error) {
      console.error('❌ Error tracking download:', error);
    }
  }

  async trackInteraction(
    interactionType: string,
    elementType?: string,
    elementText?: string,
    elementId?: string,
    additionalData?: any
  ): Promise<void> {
    if (!this.currentSessionId || !this.currentStudentEmail || !this.currentPagePath) return;

    try {
      const { error } = await supabase
        .from('student_interactions')
        .insert({
          student_email: this.currentStudentEmail,
          session_id: this.currentSessionId,
          page_path: this.currentPagePath,
          interaction_type: interactionType,
          element_type: elementType,
          element_text: elementText?.substring(0, 255),
          element_id: elementId,
          interaction_time: new Date().toISOString(),
          additional_data: additionalData ? JSON.stringify(additionalData) : null
        });

      if (error && !error.message.includes('rate limit')) {
        console.error('❌ Failed to track interaction:', error);
      }
    } catch (error) {
      console.error('❌ Error tracking interaction:', error);
    }
  }

  getCurrentSession(): { sessionId: string | null; studentEmail: string | null } {
    return {
      sessionId: this.currentSessionId,
      studentEmail: this.currentStudentEmail
    };
  }

  isTrackingActive(): boolean {
    return this.currentSessionId !== null && this.currentStudentEmail !== null;
  }
}

export const activityTracker = new ActivityTracker();

export const initializeTracking = activityTracker.initializeTracking.bind(activityTracker);
export const endSession = activityTracker.endSession.bind(activityTracker);
export const trackPageVisit = activityTracker.trackPageVisit.bind(activityTracker);
export const trackCourseActivity = activityTracker.trackCourseActivity.bind(activityTracker);
export const trackQuizPerformance = activityTracker.trackQuizPerformance.bind(activityTracker);
export const trackDownload = activityTracker.trackDownload.bind(activityTracker);
export const trackInteraction = activityTracker.trackInteraction.bind(activityTracker);
export const getCurrentSession = activityTracker.getCurrentSession.bind(activityTracker);
export const isTrackingActive = activityTracker.isTrackingActive.bind(activityTracker);
