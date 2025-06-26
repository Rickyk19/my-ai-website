import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getWorkingAnalyticsDashboardData } from '../services/workingAnalyticsService';
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
  CalendarIcon
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
      console.log('🔄 Loading analytics data with WORKING service...');
      
      const data = await getWorkingAnalyticsDashboardData();
      console.log('✅ WORKING analytics service loaded:', data);
      
      // Update all state with real data
      console.log('📊 Setting stats:', data.stats);
      console.log('📊 Setting real-time visitors:', data.realTimeVisitors);
      
      setStats(data.stats);
      setCourseAnalytics(data.courseAnalytics);
      setGeographicData(data.geographicData);
      setDeviceData(data.deviceData);
      setRealTimeVisitors(data.realTimeVisitors);
      setRecentActivity(data.recentActivity);
      setAlerts(data.activeAlerts);
      
      console.log('🎉 Analytics data loaded and state updated - NO MORE ZEROS!');
    } catch (error) {
      console.error('❌ Working analytics service failed:', error);
      // Keep existing sample data if API fails
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

        {/* Additional tabs can be implemented similarly */}
        {activeTab === 'traffic' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic Analysis</h3>
            <p className="text-gray-600">Detailed traffic analysis coming soon...</p>
          </div>
        )}

        {activeTab === 'behavior' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Behavior Analysis</h3>
            <p className="text-gray-600">User behavior insights coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard; 