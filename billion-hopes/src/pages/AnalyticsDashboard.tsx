import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getWorkingAnalyticsDashboardData } from '../services/workingAnalyticsService';
import { getPaidStudentsAnalyticsData, searchPaidStudentHistory, searchRealPaidStudentHistory } from '../services/paidStudentsService';
import { getComprehensiveStudentAnalytics, searchSpecificStudentHistory } from '../services/realTimeStudentAnalytics';
import { 
  ChartBarIcon, 
  UserGroupIcon, 
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  EyeIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  MapPinIcon,
  DocumentTextIcon,
  PlayIcon,
  AcademicCapIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  BellIcon,
  ChartPieIcon,
  FireIcon,
  CalendarIcon,
  StarIcon,
  ShieldCheckIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

interface AnalyticsStats {
  visitors: {
    total: number;
    daily: number;
    weekly: number;
    monthly: number;
    change: number;
  };
  traffic: {
    organic: number;
    direct: number;
    social: number;
    paid: number;
    referrals: number;
  };
  users: {
    new: number;
    returning: number;
    paidUsers: number;
    freeUsers: number;
  };
  engagement: {
    avgSessionTime: string;
    bounceRate: number;
    pagesPerSession: number;
  };
  revenue: {
    total: number;
    arpu: number;
    ltv: number;
    conversionRate: number;
  };
}

const AnalyticsDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7d');
  const [realTimeVisitors, setRealTimeVisitors] = useState(0);
  
  const [stats, setStats] = useState<AnalyticsStats>({
    visitors: { total: 0, daily: 0, weekly: 0, monthly: 0, change: 0 },
    traffic: { organic: 0, direct: 0, social: 0, paid: 0, referrals: 0 },
    users: { new: 0, returning: 0, paidUsers: 0, freeUsers: 0 },
    engagement: { avgSessionTime: '0m 0s', bounceRate: 0, pagesPerSession: 0 },
    revenue: { total: 0, arpu: 0, ltv: 0, conversionRate: 0 }
  });

  const [courseAnalytics, setCourseAnalytics] = useState<any[]>([]);

  const [geographicData, setGeographicData] = useState<any[]>([]);

  const [deviceData, setDeviceData] = useState<any[]>([]);

  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  const [alerts, setAlerts] = useState<any[]>([]);

  const [paidStudentsData, setPaidStudentsData] = useState<any>({});
  const [searchEmail, setSearchEmail] = useState<string>('student@example.com');
  const [studentSearchResult, setStudentSearchResult] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [realTimeAnalytics, setRealTimeAnalytics] = useState<any>(null);

  useEffect(() => {
    loadAnalyticsData();
    // Real-time visitor count updates
    const interval = setInterval(() => {
      loadAnalyticsData(); // Refresh data every 30 seconds
    }, 30000);
    return () => clearInterval(interval);
  }, [dateRange]);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    try {
      console.log('🔄 Loading DIRECT REAL-TIME data (no samples)...');
      
      // Import and use the direct real-time service (NO FALLBACK TO SAMPLES)
      const { directRealTimeService } = await import('../services/directRealTimeService');
      const realData = await directRealTimeService.getAllRealTimeData();
      
      console.log('✅ DIRECT real-time data loaded:', realData);
      console.log('📊 TODAY\'S ACTUAL DATA:', {
        sessions: realData.sessions.length,
        quizzes: realData.quizzes.length,
        activities: realData.activities.length,
        students: realData.summary.totalStudents
      });

      // If we have ANY real data, use it entirely
      if (realData.sessions.length > 0 || realData.quizzes.length > 0 || realData.activities.length > 0) {
        console.log('🎯 Using REAL data instead of samples');
        
        // Create real activity timeline
        const realTimeline = [
          ...realData.sessions.map((session: any) => ({
            id: `session_${session.id}`,
            type: 'session',
            studentEmail: session.student_email,
            studentName: session.student_name,
            action: session.is_active ? 'Started session' : 'Ended session',
            timestamp: session.login_time,
            details: `${session.device_type} • ${session.browser} • ${session.location_city}, ${session.location_country}`,
            duration: session.session_duration_minutes ? `${session.session_duration_minutes} min` : 'Active',
            icon: '🔗'
          })),
          ...realData.quizzes.map((quiz: any) => ({
            id: `quiz_${quiz.id}`,
            type: 'quiz',
            studentEmail: quiz.student_email,
            action: `Completed ${quiz.quiz_name}`,
            timestamp: quiz.start_time,
            details: `${quiz.course_name} • Score: ${quiz.score_percentage}% (${quiz.correct_answers}/${quiz.questions_total})`,
            duration: `${quiz.time_taken_minutes} min`,
            status: quiz.pass_status ? 'Passed' : 'Failed',
            icon: quiz.pass_status ? '✅' : '❌'
          })),
          ...realData.activities.map((activity: any) => ({
            id: `activity_${activity.id}`,
            type: 'course',
            studentEmail: activity.student_email,
            action: `${activity.activity_type} - ${activity.course_name}`,
            timestamp: activity.activity_time,
            details: `${activity.class_name} • ${activity.activity_details}`,
            duration: `${activity.time_spent_minutes} min`,
            icon: '📚'
          }))
        ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        // Update state with REAL data
        setRecentActivity(realTimeline);
        setRealTimeVisitors(realData.summary.activeSessions);
        
        // Set real analytics without sample fallback
        setStats({
          visitors: { total: realData.summary.totalStudents, daily: realData.summary.activeSessions, weekly: 0, monthly: 0, change: 0 },
          traffic: { organic: 0, direct: 0, social: 0, paid: 0, referrals: 0 },
          users: { new: realData.summary.activeSessions, returning: 0, paidUsers: realData.summary.totalStudents, freeUsers: 0 },
          engagement: { avgSessionTime: '0m 0s', bounceRate: 0, pagesPerSession: 0 },
          revenue: { total: 0, arpu: 0, ltv: 0, conversionRate: 0 }
        });

        setAlerts([
          {
            id: 'realtime-success',
            type: 'success',
            message: `🎯 REAL-TIME DATA ACTIVE: ${realData.sessions.length} sessions, ${realData.quizzes.length} quiz completions TODAY`,
            timestamp: new Date().toISOString()
          }
        ]);

        // Set real quiz data for course progress
        setCourseAnalytics(realData.quizzes.map((quiz: any) => ({
          courseName: quiz.course_name,
          quizName: quiz.quiz_name,
          score: `${quiz.score_percentage}%`,
          studentEmail: quiz.student_email,
          completionDate: new Date(quiz.start_time).toLocaleDateString(),
          timeTaken: `${quiz.time_taken_minutes} min`,
          status: quiz.pass_status ? 'Passed' : 'Failed'
        })));

      } else {
        console.log('⚠️ No real data found for today - user hasn\'t taken any activities yet');
        
        // Show empty state (not sample data)
        setRecentActivity([]);
        setRealTimeVisitors(0);
        setStats({
          visitors: { total: 0, daily: 0, weekly: 0, monthly: 0, change: 0 },
          traffic: { organic: 0, direct: 0, social: 0, paid: 0, referrals: 0 },
          users: { new: 0, returning: 0, paidUsers: 0, freeUsers: 0 },
          engagement: { avgSessionTime: '0m 0s', bounceRate: 0, pagesPerSession: 0 },
          revenue: { total: 0, arpu: 0, ltv: 0, conversionRate: 0 }
        });
        setCourseAnalytics([]);

        setAlerts([
          {
            id: 'no-data',
            type: 'info',
            message: '📊 No activity data for today. Login as a student and take a quiz to see real-time tracking!',
            timestamp: new Date().toISOString()
          }
        ]);
      }

      // Load minimal additional data for display
      const additionalData = await getWorkingAnalyticsDashboardData();
      setGeographicData(additionalData.geographicData);
      setDeviceData(additionalData.deviceData);
      
      console.log('🎉 DIRECT real-time analytics loaded successfully!');
      
    } catch (error) {
      console.error('❌ Direct real-time service failed:', error);
      setAlerts([
        {
          id: 'error',
          type: 'error',
          message: '❌ Real-time service failed. Check console for details.',
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const StatCard: React.FC<{ 
    title: string; 
    value: string | number; 
    change?: number; 
    icon: React.ReactNode; 
    color: string 
  }> = ({ title, value, change, icon, color }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-6 border-l-4"
      style={{ borderLeftColor: color }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change !== undefined && (
            <div className={`flex items-center mt-2 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? (
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
              ) : (
                <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
              )}
              <span className="text-sm font-medium">{Math.abs(change)}%</span>
            </div>
          )}
        </div>
        <div className="p-3 rounded-full" style={{ backgroundColor: `${color}20` }}>
          {icon}
        </div>
      </div>
    </motion.div>
  );

  const handleStudentSearch = async () => {
    if (!searchEmail.trim()) return;
    
    setIsSearching(true);
    
    try {
      console.log('🔍 Searching for REAL student data:', searchEmail.trim());
      
      // Use direct real-time service for student search
      const { directRealTimeService } = await import('../services/directRealTimeService');
      const studentData = await directRealTimeService.getStudentRealTimeData(searchEmail.trim());
      
      // Check if studentData exists and has any data
      if (studentData && (
        (studentData.sessions && studentData.sessions.length > 0) || 
        (studentData.quizzes && studentData.quizzes.length > 0) || 
        (studentData.activities && studentData.activities.length > 0)
      )) {
        console.log('✅ Found REAL student data:', studentData);
        
        setStudentSearchResult({
          found: true,
          student: {
            email: searchEmail.trim(),
            name: studentData.sessions?.[0]?.student_name || 'Unknown',
            totalSessions: studentData.summary?.totalSessions || 0,
            quizzesCompleted: studentData.summary?.totalQuizzes || 0,
            averageScore: studentData.summary?.avgQuizScore || 0,
            totalTimeSpent: studentData.summary?.totalTimeSpent || 0,
            coursesAccessed: studentData.summary?.totalActivities || 0,
            isActive: (studentData.summary?.activeSessions || 0) > 0
          },
          sessions: (studentData.sessions || []).map((session: any) => ({
            loginTime: new Date(session.login_time).toLocaleString(),
            logoutTime: session.logout_time ? new Date(session.logout_time).toLocaleString() : 'Still Active',
            duration: session.session_duration_minutes ? `${session.session_duration_minutes} min` : 'Active',
            device: session.device_type,
            location: `${session.location_city}, ${session.location_country}`
          })),
          quizzes: (studentData.quizzes || []).map((quiz: any) => ({
            courseName: quiz.course_name,
            quizName: quiz.quiz_name,
            score: `${quiz.score_percentage}%`,
            status: quiz.pass_status ? 'Passed' : 'Failed',
            timeTaken: `${quiz.time_taken_minutes} min`,
            completionTime: new Date(quiz.start_time).toLocaleString()
          })),
          courseProgress: studentData.courseProgress || [],
          activityTimeline: studentData.timeline || []
        });
        
      } else {
        console.log('⚠️ No real data found for student:', searchEmail);
        setStudentSearchResult({
          found: false,
          message: `No activity data found for ${searchEmail} today. Student hasn't logged in or taken any quizzes yet.`
        });
      }
      
    } catch (error) {
      console.error('❌ Student search failed:', error);
      setStudentSearchResult({
        found: false,
        message: 'Search failed. Please check the email and try again.'
      });
    } finally {
      setIsSearching(false);
    }
  };

  const TabButton: React.FC<{ id: string; label: string; icon: React.ReactNode }> = ({ id, label, icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
        activeTab === id
          ? 'bg-blue-100 text-blue-700 border border-blue-300'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
      }`}
    >
      {icon}
      <span className="ml-2">{label}</span>
    </button>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600 mt-2">Comprehensive website and user analytics</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">Live: {realTimeVisitors} visitors</span>
              </div>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="1d">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex space-x-2 overflow-x-auto">
            <TabButton id="overview" label="Overview" icon={<ChartBarIcon className="h-5 w-5" />} />
            <TabButton id="traffic" label="Traffic & Visitors" icon={<GlobeAltIcon className="h-5 w-5" />} />
            <TabButton id="behavior" label="User Behavior" icon={<UserGroupIcon className="h-5 w-5" />} />
            <TabButton id="courses" label="Course Analytics" icon={<AcademicCapIcon className="h-5 w-5" />} />
            <TabButton id="revenue" label="Revenue & Conversion" icon={<CurrencyDollarIcon className="h-5 w-5" />} />
            <TabButton id="realtime" label="Real-Time" icon={<BellIcon className="h-5 w-5" />} />
            <TabButton id="paid-students" label="Paid Students" icon={<StarIcon className="h-5 w-5" />} />
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Visitors"
                value={stats.visitors.total.toLocaleString()}
                change={stats.visitors.change}
                icon={<EyeIcon className="h-6 w-6 text-blue-600" />}
                color="#3B82F6"
              />
              <StatCard
                title="New Users"
                value={stats.users.new.toLocaleString()}
                change={12.5}
                icon={<UserGroupIcon className="h-6 w-6 text-green-600" />}
                color="#10B981"
              />
              <StatCard
                title="Avg Session Time"
                value={stats.engagement.avgSessionTime}
                change={8.2}
                icon={<ClockIcon className="h-6 w-6 text-purple-600" />}
                color="#8B5CF6"
              />
              <StatCard
                title="Revenue"
                value={`$${stats.revenue.total.toLocaleString()}`}
                change={23.1}
                icon={<CurrencyDollarIcon className="h-6 w-6 text-yellow-600" />}
                color="#F59E0B"
              />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Traffic Sources */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic Sources</h3>
                <div className="space-y-3">
                  {Object.entries(stats.traffic).map(([source, percentage]) => (
                    <div key={source} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 capitalize">{source}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Device Breakdown */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Usage</h3>
                <div className="space-y-4">
                  {deviceData.map((device) => (
                    <div key={device.device} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {device.device === 'Desktop' && <ComputerDesktopIcon className="h-5 w-5 text-gray-600" />}
                        {device.device === 'Mobile' && <DevicePhoneMobileIcon className="h-5 w-5 text-gray-600" />}
                        {device.device === 'Tablet' && <DocumentTextIcon className="h-5 w-5 text-gray-600" />}
                        <span className="text-sm font-medium text-gray-700">{device.device}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">{device.visitors.toLocaleString()}</span>
                        <span className="text-xs text-gray-500">({device.percentage}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Geographic Data */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Countries</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {geographicData.map((country) => (
                  <div key={country.country} className="text-center p-4 bg-gray-50 rounded-lg">
                    <MapPinIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-medium text-gray-900">{country.country}</h4>
                    <p className="text-sm text-gray-600">{country.visitors.toLocaleString()} visitors</p>
                    <p className="text-xs text-gray-500">{country.percentage}%</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="space-y-6">
            {/* Course Performance */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Performance</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrollments</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completion Rate</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {courseAnalytics.map((course) => (
                      <tr key={course.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <AcademicCapIcon className="h-5 w-5 text-blue-600 mr-3" />
                            <span className="text-sm font-medium text-gray-900">{course.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{course.views.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{course.enrollments}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full" 
                                style={{ width: `${course.completion}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600">{course.completion}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {course.completion >= 70 ? (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              Excellent
                            </span>
                          ) : course.completion >= 50 ? (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              Good
                            </span>
                          ) : (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                              Needs Attention
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Student Progress Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quiz Performance</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Average Score</span>
                    <span className="text-lg font-semibold text-gray-900">78.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Pass Rate</span>
                    <span className="text-lg font-semibold text-green-600">85.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Completion Rate</span>
                    <span className="text-lg font-semibold text-blue-600">92.1%</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Video Engagement</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Avg Watch Time</span>
                    <span className="text-lg font-semibold text-gray-900">6m 42s</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Completion Rate</span>
                    <span className="text-lg font-semibold text-green-600">74.8%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Drop-off Point</span>
                    <span className="text-lg font-semibold text-yellow-600">45% mark</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'revenue' && (
          <div className="space-y-6">
            {/* Revenue Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Revenue"
                value={`$${stats.revenue.total.toLocaleString()}`}
                change={23.1}
                icon={<CurrencyDollarIcon className="h-6 w-6 text-green-600" />}
                color="#10B981"
              />
              <StatCard
                title="ARPU"
                value={`$${stats.revenue.arpu}`}
                change={5.8}
                icon={<ChartBarIcon className="h-6 w-6 text-blue-600" />}
                color="#3B82F6"
              />
              <StatCard
                title="LTV"
                value={`$${stats.revenue.ltv}`}
                change={12.3}
                icon={<ArrowTrendingUpIcon className="h-6 w-6 text-purple-600" />}
                color="#8B5CF6"
              />
              <StatCard
                title="Conversion Rate"
                value={`${stats.revenue.conversionRate}%`}
                change={-2.1}
                icon={<ChartPieIcon className="h-6 w-6 text-yellow-600" />}
                color="#F59E0B"
              />
            </div>

            {/* Paid vs Free Users */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">User Segmentation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                  <UserGroupIcon className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                  <h4 className="text-2xl font-bold text-blue-900">{stats.users.paidUsers}</h4>
                  <p className="text-blue-700">Paid Users</p>
                  <p className="text-sm text-blue-600 mt-2">8.9% of total users</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
                  <UserGroupIcon className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                  <h4 className="text-2xl font-bold text-gray-900">{stats.users.freeUsers}</h4>
                  <p className="text-gray-700">Free Users</p>
                  <p className="text-sm text-gray-600 mt-2">91.1% of total users</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'realtime' && (
          <div className="space-y-6">
            {/* Real-time Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="flex items-center justify-center mb-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2"></div>
                  <span className="text-sm text-gray-600">Live Visitors</span>
                </div>
                <p className="text-3xl font-bold text-gray-900">{realTimeVisitors}</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <FireIcon className="h-8 w-8 text-orange-600 mx-auto mb-3" />
                <p className="text-3xl font-bold text-gray-900">15</p>
                <p className="text-sm text-gray-600">Active Sessions</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <BellIcon className="h-8 w-8 text-red-600 mx-auto mb-3" />
                <p className="text-3xl font-bold text-gray-900">{alerts.length}</p>
                <p className="text-sm text-gray-600">Active Alerts</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Activity Feed</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {activity.type === 'completion' && <AcademicCapIcon className="h-5 w-5 text-green-600" />}
                      {activity.type === 'registration' && <UserGroupIcon className="h-5 w-5 text-blue-600" />}
                      {activity.type === 'payment' && <CurrencyDollarIcon className="h-5 w-5 text-yellow-600" />}
                      {activity.type === 'alert' && <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />}
                      {activity.type === 'quiz' && <DocumentTextIcon className="h-5 w-5 text-purple-600" />}
                      <span className="text-sm text-gray-900">{activity.action}</span>
                    </div>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Alerts */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Alerts</h3>
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${
                    alert.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                    alert.type === 'success' ? 'bg-green-50 border-green-400' :
                    'bg-blue-50 border-blue-400'
                  }`}>
                    <div className="flex justify-between items-start">
                      <p className="text-sm text-gray-900">{alert.message}</p>
                      <span className="text-xs text-gray-500">{alert.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Traffic & Visitors Tab */}
        {activeTab === 'traffic' && (
          <div className="space-y-6">
            {/* Traffic Sources */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic Sources</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-500 rounded mr-3"></div>
                    <span className="font-medium">Organic Search</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold">{stats.traffic.organic.toFixed(1)}%</span>
                    <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: `${stats.traffic.organic}%` }}></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-blue-500 rounded mr-3"></div>
                    <span className="font-medium">Direct Traffic</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold">{stats.traffic.direct.toFixed(1)}%</span>
                    <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${stats.traffic.direct}%` }}></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-purple-500 rounded mr-3"></div>
                    <span className="font-medium">Social Media</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold">{stats.traffic.social.toFixed(1)}%</span>
                    <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${stats.traffic.social}%` }}></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-yellow-500 rounded mr-3"></div>
                    <span className="font-medium">Paid Advertising</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold">{stats.traffic.paid.toFixed(1)}%</span>
                    <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${stats.traffic.paid}%` }}></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-500 rounded mr-3"></div>
                    <span className="font-medium">Referrals</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold">{stats.traffic.referrals.toFixed(1)}%</span>
                    <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: `${stats.traffic.referrals}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Geographic Data */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Countries</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {geographicData.map((country) => (
                  <div key={country.country} className="text-center p-4 bg-gray-50 rounded-lg">
                    <MapPinIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-medium text-gray-900">{country.country}</h4>
                    <p className="text-sm text-gray-600">{country.visitors.toLocaleString()} visitors</p>
                    <p className="text-xs text-gray-500">{country.percentage}%</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Device Breakdown */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Usage</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {deviceData.map((device) => (
                  <div key={device.device} className="text-center p-6 bg-gray-50 rounded-lg">
                    {device.device === 'Desktop' && <ComputerDesktopIcon className="h-12 w-12 text-blue-600 mx-auto mb-3" />}
                    {device.device === 'Mobile' && <DevicePhoneMobileIcon className="h-12 w-12 text-green-600 mx-auto mb-3" />}
                    {device.device === 'Tablet' && <DevicePhoneMobileIcon className="h-12 w-12 text-purple-600 mx-auto mb-3" />}
                    <h4 className="text-xl font-bold text-gray-900">{device.visitors.toLocaleString()}</h4>
                    <p className="text-gray-600">{device.device}</p>
                    <p className="text-sm text-gray-500">{device.percentage}%</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* User Behavior Tab */}
        {activeTab === 'behavior' && (
          <div className="space-y-6">
            {/* Engagement Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                title="Avg Session Time"
                value={stats.engagement.avgSessionTime}
                change={8.2}
                icon={<ClockIcon className="h-6 w-6 text-blue-600" />}
                color="#3B82F6"
              />
              <StatCard
                title="Bounce Rate"
                value={`${stats.engagement.bounceRate}%`}
                change={-2.4}
                icon={<ArrowTrendingDownIcon className="h-6 w-6 text-green-600" />}
                color="#10B981"
              />
              <StatCard
                title="Pages Per Session"
                value={stats.engagement.pagesPerSession.toFixed(1)}
                change={12.1}
                icon={<DocumentTextIcon className="h-6 w-6 text-purple-600" />}
                color="#8B5CF6"
              />
            </div>

            {/* User Types */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">User Segmentation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                  <UserGroupIcon className="h-12 w-12 text-green-600 mx-auto mb-3" />
                  <h4 className="text-2xl font-bold text-green-900">{stats.users.new.toLocaleString()}</h4>
                  <p className="text-green-700">New Users</p>
                  <p className="text-sm text-green-600 mt-2">First-time visitors</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                  <UserGroupIcon className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                  <h4 className="text-2xl font-bold text-blue-900">{stats.users.returning.toLocaleString()}</h4>
                  <p className="text-blue-700">Returning Users</p>
                  <p className="text-sm text-blue-600 mt-2">Previous visitors</p>
                </div>
              </div>
            </div>

            {/* Session Analysis */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-lg font-bold text-gray-900">2.3k</h4>
                  <p className="text-sm text-gray-600">Sessions Today</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-lg font-bold text-gray-900">15.2k</h4>
                  <p className="text-sm text-gray-600">Sessions This Week</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-lg font-bold text-gray-900">68.5k</h4>
                  <p className="text-sm text-gray-600">Sessions This Month</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-lg font-bold text-gray-900">3.4</h4>
                  <p className="text-sm text-gray-600">Avg Pages/Session</p>
                </div>
              </div>
            </div>

            {/* Popular Pages */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Visited Pages</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">/courses</span>
                  <span className="text-gray-600">2,450 views</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">/</span>
                  <span className="text-gray-600">1,890 views</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">/members-login</span>
                  <span className="text-gray-600">1,230 views</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">/dashboard</span>
                  <span className="text-gray-600">980 views</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Paid Students Tab */}
        {activeTab === 'paid-students' && (
          <div className="space-y-6">
            {/* Student Search */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🔍 Search Student History</h3>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <input
                    type="email"
                    placeholder="Enter student email address (e.g., john.smith@gmail.com)"
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleStudentSearch()}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={handleStudentSearch}
                  disabled={isSearching}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSearching ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                  )}
                  {isSearching ? 'Searching...' : 'Search'}
                </button>
                {studentSearchResult && (
                  <button
                    onClick={() => {setStudentSearchResult(null); setSearchEmail('');}}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Search Results */}
            {studentSearchResult && (
              <div className="space-y-6">
                                  {studentSearchResult.found ? (
                    <>
                     {/* Student Profile Summary */}
                     <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-lg shadow-md p-6 text-white">
                       <h3 className="text-xl font-bold mb-2">👤 {studentSearchResult.studentName || studentSearchResult.profile?.name}</h3>
                       <p className="text-lg mb-2">📧 {studentSearchResult.studentEmail || studentSearchResult.profile?.email}</p>
                       <p className="text-xs text-blue-200 mb-4">
                         📊 Real-time tracking data {studentSearchResult.summary?.totalSessions > 0 ? '(Active)' : '(Available)'}
                       </p>
                       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                         <div className="text-center">
                           <div className="text-2xl font-bold">
                             {studentSearchResult.summary?.totalSessions || studentSearchResult.profile?.totalSessions || 'N/A'}
                           </div>
                           <div className="text-sm opacity-90">Total Sessions</div>
                         </div>
                         <div className="text-center">
                           <div className="text-2xl font-bold">
                             {studentSearchResult.summary?.totalLoginTime ? 
                               `${Math.round(studentSearchResult.summary.totalLoginTime / 60)}h` : 
                               studentSearchResult.profile?.totalTimeSpent || 'N/A'
                             }
                           </div>
                           <div className="text-sm opacity-90">Total Time</div>
                         </div>
                         <div className="text-center">
                           <div className="text-2xl font-bold">
                             {studentSearchResult.profile?.coursesEnrolled || 0}
                           </div>
                           <div className="text-sm opacity-90">
                             Courses Enrolled
                             {studentSearchResult.profile?.coursesAccessed !== undefined && (
                               <div className="text-xs mt-1">({studentSearchResult.profile.coursesAccessed} accessed)</div>
                             )}
                           </div>
                         </div>
                         <div className="text-center">
                           <div className="text-2xl font-bold">
                             {studentSearchResult.summary?.avgQuizScore ? 
                               `${studentSearchResult.summary.avgQuizScore}%` : 
                               studentSearchResult.profile?.averageQuizScore || 'N/A'
                             }
                           </div>
                           <div className="text-sm opacity-90">Avg Quiz Score</div>
                         </div>
                       </div>
                     </div>

                    {/* Activity Timeline */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">📅 Complete Activity Timeline</h3>
                      <div className="max-h-96 overflow-y-auto space-y-2">
                        {studentSearchResult.activityTimeline.map((activity: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              {activity.type === 'session' && <ShieldCheckIcon className="h-5 w-5 text-blue-600" />}
                              {activity.type === 'course' && <PlayIcon className="h-5 w-5 text-green-600" />}
                              {activity.type === 'quiz' && <DocumentTextIcon className="h-5 w-5 text-purple-600" />}
                              {activity.type === 'download' && <ArrowTrendingDownIcon className="h-5 w-5 text-orange-600" />}
                              {activity.type === 'page_visit' && <EyeIcon className="h-5 w-5 text-gray-600" />}
                              {activity.type === 'Course Purchase' && <span className="text-xl">🛒</span>}
                              <div>
                                <div className="text-sm font-medium text-gray-900">{activity.action || activity.type}</div>
                                <div className="text-xs text-gray-500">{activity.details}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs text-gray-500">{new Date(activity.timestamp).toLocaleString()}</div>
                              <div className="text-xs text-blue-500">{activity.duration}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Course Progress */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">📚 Course Progress Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {studentSearchResult.courseProgress.map((course: any) => (
                          <div key={course.courseName} className="p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-2">{course.courseName}</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Progress:</span>
                                <span className="font-medium">{course.progress || course.completionStatus || 'Enrolled'}</span>
                              </div>
                              {course.progress && (
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div className="bg-green-500 h-2 rounded-full" style={{ width: `${course.progress}%` }}></div>
                                </div>
                              )}
                              <div className="flex justify-between">
                                <span>Instructor:</span>
                                <span>{course.instructor || 'N/A'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Enrolled Date:</span>
                                <span>{course.enrolledDate ? new Date(course.enrolledDate).toLocaleDateString() : 'N/A'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Time Spent:</span>
                                <span>{course.timeSpent ? `${course.timeSpent} minutes` : 'N/A'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Activities:</span>
                                <span>{course.activitiesCount || 'N/A'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Quizzes:</span>
                                <span>{course.quizzesCompleted || 'N/A'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Downloads:</span>
                                <span>{course.downloadsCount || 'N/A'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Last Activity:</span>
                                <span>{course.lastActivity || 'N/A'}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Device & Location Analysis */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">💻 Device Usage</h3>
                        <div className="space-y-3">
                          {studentSearchResult.deviceUsage && Array.isArray(studentSearchResult.deviceUsage) ? (
                            studentSearchResult.deviceUsage.map((device: any) => (
                              <div key={device.device} className="flex items-center justify-between">
                                <span className="font-medium capitalize">{device.device}</span>
                                <span className="text-lg font-bold">{device.count} sessions</span>
                              </div>
                            ))
                          ) : (
                            <div className="text-sm text-gray-500 p-4 bg-gray-50 rounded-lg">
                              {studentSearchResult.deviceUsage?.note || 'Device tracking not yet implemented for existing users'}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">🌍 Location History</h3>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {studentSearchResult.locationHistory && Array.isArray(studentSearchResult.locationHistory) ? (
                            studentSearchResult.locationHistory.map((location: any, index: number) => (
                              <div key={index} className="text-sm">
                                <div className="font-medium">{location.city}, {location.country}</div>
                                <div className="text-gray-500">{location.loginTime} • {location.device}</div>
                              </div>
                            ))
                          ) : (
                            <div className="text-sm text-gray-500 p-4 bg-gray-50 rounded-lg">
                              {studentSearchResult.locationHistory?.note || 'Location tracking not yet implemented for existing users'}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <h3 className="text-lg font-medium text-red-800 mb-2">❌ Student Not Found</h3>
                    <p className="text-red-600">{studentSearchResult.message}</p>
                    <p className="text-sm text-red-500 mt-2">Please check the email address and try again.</p>
                  </div>
                )}
              </div>
            )}

            {/* Paid Students Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Paid Students"
                value={paidStudentsData.overview?.totalStudents || 0}
                change={15.3}
                icon={<StarIcon className="h-6 w-6 text-yellow-600" />}
                color="#F59E0B"
              />
              <StatCard
                title="Active Sessions"
                value={paidStudentsData.overview?.activeSessions || 0}
                change={8.7}
                icon={<ShieldCheckIcon className="h-6 w-6 text-green-600" />}
                color="#10B981"
              />
              <StatCard
                title="Avg Session Time"
                value={`${paidStudentsData.overview?.avgSessionDuration || 0} min`}
                change={12.1}
                icon={<ClockIcon className="h-6 w-6 text-blue-600" />}
                color="#3B82F6"
              />
              <StatCard
                title="Quiz Pass Rate"
                value={`${paidStudentsData.overview?.quizPassRate || 0}%`}
                change={5.2}
                icon={<AcademicCapIcon className="h-6 w-6 text-purple-600" />}
                color="#8B5CF6"
              />
            </div>

            {/* Student Sessions Table */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Student Sessions & Login Details</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Login Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Logout Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {(paidStudentsData.studentSessions || []).map((session: any) => (
                      <tr key={session.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{session.studentName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">{session.studentEmail}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{session.loginTime}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{session.logoutTime}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{session.duration}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {session.device === 'desktop' && <ComputerDesktopIcon className="h-4 w-4 text-blue-600 mr-2" />}
                            {session.device === 'mobile' && <DevicePhoneMobileIcon className="h-4 w-4 text-green-600 mr-2" />}
                            {session.device === 'tablet' && <DevicePhoneMobileIcon className="h-4 w-4 text-purple-600 mr-2" />}
                            <span className="text-sm text-gray-900 capitalize">{session.device}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{session.location}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {session.isActive ? (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              🟢 Active
                            </span>
                          ) : (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                              ⚫ Offline
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🔥 Recent Student Activities</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {(paidStudentsData.recentActivities || []).map((activity: any) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {activity.type === 'course_activity' && <PlayIcon className="h-5 w-5 text-blue-600" />}
                      {activity.type === 'quiz' && <DocumentTextIcon className="h-5 w-5 text-green-600" />}
                      {activity.type === 'download' && <ArrowTrendingDownIcon className="h-5 w-5 text-purple-600" />}
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {activity.studentEmail}
                        </div>
                        <div className="text-sm text-gray-600">{activity.action}</div>
                        <div className="text-xs text-gray-500">{activity.details}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">{activity.time}</div>
                      <div className="text-xs text-gray-400">{activity.device}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Device Breakdown */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📱 Device Usage</h3>
                <div className="space-y-3">
                  {(paidStudentsData.deviceBreakdown || []).map((device: any) => (
                    <div key={device.device} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        {device.device === 'desktop' && <ComputerDesktopIcon className="h-6 w-6 text-blue-600 mr-3" />}
                        {device.device === 'mobile' && <DevicePhoneMobileIcon className="h-6 w-6 text-green-600 mr-3" />}
                        {device.device === 'tablet' && <DevicePhoneMobileIcon className="h-6 w-6 text-purple-600 mr-3" />}
                        <span className="font-medium capitalize">{device.device}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold">{device.count}</span>
                        <div className="text-sm text-gray-500">{device.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Performers */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🏆 Top Performing Students</h3>
                <div className="space-y-3">
                  {(paidStudentsData.topPerformers || []).slice(0, 5).map((student: any, index: number) => (
                    <div key={student.email} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-sm font-bold text-yellow-800">#{index + 1}</span>
                        </div>
                        <div>
                          <div className="font-medium">{student.email}</div>
                          <div className="text-sm text-gray-500">
                            {student.totalTime} min • {student.coursesAccessed} courses
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">{student.engagementScore}</div>
                        <div className="text-xs text-gray-500">Engagement Score</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Course Engagement */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📚 Popular Courses Among Paid Students</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(paidStudentsData.popularCourses || []).map((course: any) => (
                  <div key={course.name} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <AcademicCapIcon className="h-5 w-5 text-blue-600 mr-2" />
                      <h4 className="font-medium text-gray-900 truncate">{course.name}</h4>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div>👥 {course.studentsCount} students enrolled</div>
                      <div>📊 {course.totalActivities} total activities</div>
                      <div>⏱️ {course.avgTimePerStudent} min average time</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary Stats */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-md p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">📈 Paid Students Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{paidStudentsData.overview?.totalQuizzes || 0}</div>
                  <div className="text-sm opacity-90">Total Quizzes Taken</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{paidStudentsData.overview?.totalDownloads || 0}</div>
                  <div className="text-sm opacity-90">Files Downloaded</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{paidStudentsData.totalVideoWatchTime || 0}</div>
                  <div className="text-sm opacity-90">Minutes Video Watched</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{paidStudentsData.overview?.avgQuizScore || 0}%</div>
                  <div className="text-sm opacity-90">Average Quiz Score</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard; 