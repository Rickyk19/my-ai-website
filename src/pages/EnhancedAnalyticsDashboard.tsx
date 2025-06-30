import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getComprehensiveStudentAnalytics } from '../services/realTimeStudentAnalytics';
import { 
  ChartBarIcon, 
  UserGroupIcon, 
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  AcademicCapIcon,
  PlayIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  CalendarIcon,
  FireIcon,
  TrophyIcon,
  BookOpenIcon,
  QuestionMarkCircleIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

interface ActivityItem {
  id: string;
  type: string;
  studentEmail: string;
  studentName?: string;
  action: string;
  timestamp: string;
  details: string;
  duration: string;
  status?: string;
  progress?: string;
  icon: string;
}

interface AnalyticsSummary {
  totalStudents: number;
  activeSessions: number;
  totalQuizzes: number;
  passedQuizzes: number;
  avgQuizScore: number;
}

const EnhancedAnalyticsDashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState<AnalyticsSummary>({
    totalStudents: 0,
    activeSessions: 0,
    totalQuizzes: 0,
    passedQuizzes: 0,
    avgQuizScore: 0
  });
  const [activityTimeline, setActivityTimeline] = useState<ActivityItem[]>([]);
  const [searchEmail, setSearchEmail] = useState('student@example.com');
  const [filteredActivities, setFilteredActivities] = useState<ActivityItem[]>([]);
  const [selectedActivityType, setSelectedActivityType] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    loadAnalyticsData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadAnalyticsData, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    filterActivities();
  }, [activityTimeline, searchEmail, selectedActivityType, dateFilter]);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    try {
      console.log('🔄 Loading comprehensive analytics data...');
      const data = await getComprehensiveStudentAnalytics();
      
      setSummary(data.summary);
      setActivityTimeline(data.activityTimeline || []);
      setLastUpdated(data.realTimeData?.lastUpdated || new Date().toISOString());
      
      console.log('✅ Analytics data loaded:', data);
    } catch (error) {
      console.error('❌ Failed to load analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterActivities = () => {
    let filtered = activityTimeline;

    // Filter by email
    if (searchEmail.trim()) {
      filtered = filtered.filter(activity => 
        activity.studentEmail.toLowerCase().includes(searchEmail.toLowerCase()) ||
        (activity.studentName && activity.studentName.toLowerCase().includes(searchEmail.toLowerCase()))
      );
    }

    // Filter by activity type
    if (selectedActivityType !== 'all') {
      filtered = filtered.filter(activity => activity.type === selectedActivityType);
    }

    // Filter by date
    if (dateFilter !== 'all') {
      const now = new Date();
      let cutoffDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          cutoffDate.setHours(0, 0, 0, 0);
          break;
        case 'yesterday':
          cutoffDate.setDate(cutoffDate.getDate() - 1);
          cutoffDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter(activity => {
            const activityDate = new Date(activity.timestamp);
            return activityDate >= cutoffDate && activityDate < new Date(cutoffDate.getTime() + 24 * 60 * 60 * 1000);
          });
          setFilteredActivities(filtered);
          return;
        case 'week':
          cutoffDate.setDate(cutoffDate.getDate() - 7);
          break;
        case 'month':
          cutoffDate.setMonth(cutoffDate.getMonth() - 1);
          break;
      }
      
      if (dateFilter !== 'yesterday') {
        filtered = filtered.filter(activity => new Date(activity.timestamp) >= cutoffDate);
      }
    }

    setFilteredActivities(filtered);
  };

  const getActivityIcon = (activity: ActivityItem) => {
    switch (activity.type) {
      case 'session':
        return <UserGroupIcon className="h-5 w-5 text-blue-500" />;
      case 'course':
        return <BookOpenIcon className="h-5 w-5 text-green-500" />;
      case 'quiz':
        return activity.status === 'Passed' 
          ? <CheckCircleIcon className="h-5 w-5 text-green-500" />
          : <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'page_visit':
        return <EyeIcon className="h-5 w-5 text-purple-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getActivityColor = (activity: ActivityItem) => {
    switch (activity.type) {
      case 'session':
        return 'bg-blue-50 border-blue-200';
      case 'course':
        return 'bg-green-50 border-green-200';
      case 'quiz':
        return activity.status === 'Passed' 
          ? 'bg-green-50 border-green-200'
          : 'bg-red-50 border-red-200';
      case 'page_visit':
        return 'bg-purple-50 border-purple-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `${diffMins} minutes ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else {
      return `${diffDays} days ago`;
    }
  };

  const StatCard: React.FC<{ 
    title: string; 
    value: string | number; 
    change?: number; 
    icon: React.ReactNode; 
    color: string;
    subtitle?: string;
  }> = ({ title, value, change, icon, color, subtitle }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-6 border-l-4"
      style={{ borderLeftColor: color }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ArrowPathIcon className="h-12 w-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-700">Loading Student Analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Student Activity Analytics</h1>
              <p className="text-gray-600 mt-2">
                Real-time tracking of all student activities • Last updated: {formatTimestamp(lastUpdated)}
              </p>
            </div>
            <button
              onClick={loadAnalyticsData}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowPathIcon className="h-5 w-5 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatCard
            title="Total Students"
            value={summary.totalStudents}
            icon={<UserGroupIcon className="h-6 w-6 text-blue-600" />}
            color="#3B82F6"
            subtitle="Tracked users"
          />
          <StatCard
            title="Active Sessions"
            value={summary.activeSessions}
            icon={<FireIcon className="h-6 w-6 text-orange-600" />}
            color="#EA580C"
            subtitle="Currently online"
          />
          <StatCard
            title="Total Quizzes"
            value={summary.totalQuizzes}
            icon={<QuestionMarkCircleIcon className="h-6 w-6 text-purple-600" />}
            color="#9333EA"
            subtitle="Completed tests"
          />
          <StatCard
            title="Passed Quizzes"
            value={summary.passedQuizzes}
            icon={<TrophyIcon className="h-6 w-6 text-green-600" />}
            color="#059669"
            subtitle={`${summary.totalQuizzes > 0 ? Math.round((summary.passedQuizzes / summary.totalQuizzes) * 100) : 0}% success rate`}
          />
          <StatCard
            title="Avg Quiz Score"
            value={`${summary.avgQuizScore}%`}
            icon={<AcademicCapIcon className="h-6 w-6 text-indigo-600" />}
            color="#4F46E5"
            subtitle="Performance metric"
          />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Activity Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Student</label>
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  placeholder="Enter email or name"
                  className="pl-10 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Activity Type</label>
              <select
                value={selectedActivityType}
                onChange={(e) => setSelectedActivityType(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Activities</option>
                <option value="session">Sessions</option>
                <option value="course">Course Activities</option>
                <option value="quiz">Quiz Performance</option>
                <option value="page_visit">Page Visits</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
            </div>
            <div className="flex items-end">
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-sm font-medium text-blue-900">
                  {filteredActivities.length} activities found
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Student Activity Timeline</h2>
            <p className="text-gray-600 mt-1">Real-time feed of all student activities</p>
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredActivities.length === 0 ? (
              <div className="p-8 text-center">
                <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-500">No activities found</p>
                <p className="text-gray-400">Try adjusting your filters or check back later</p>
              </div>
            ) : (
              filteredActivities.map((activity) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-6 ${getActivityColor(activity)} border-l-4`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-1">
                      {getActivityIcon(activity)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {activity.action}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            <span className="font-medium">{activity.studentEmail}</span>
                            {activity.studentName && ` (${activity.studentName})`}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">{activity.details}</p>
                          
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              <ClockIcon className="h-3 w-3 mr-1" />
                              {activity.duration}
                            </span>
                            {activity.progress && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Progress: {activity.progress}
                              </span>
                            )}
                            {activity.status && (
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                activity.status === 'Passed' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {activity.status}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">{formatTimestamp(activity.timestamp)}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(activity.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircleIcon className="h-5 w-5 text-blue-600 mr-2" />
            <p className="text-sm text-blue-800">
              <strong>Complete Historical Data:</strong> This dashboard shows ALL student activities stored permanently in the database. 
              Data includes yesterday's activities from student@example.com and will continue to accumulate over months for comprehensive analysis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedAnalyticsDashboard; 