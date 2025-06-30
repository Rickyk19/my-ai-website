import React, { useState } from 'react';
import { supabase } from '../utils/supabase';
import { 
  getVisitorStats, 
  getTrafficSources, 
  getGeographicData, 
  getDeviceData,
  getEngagementStats,
  getUserStats,
  getCourseAnalytics,
  getRevenueStats,
  getRealTimeVisitors,
  getRecentActivity,
  getActiveAlerts,
  getAnalyticsDashboardData
} from '../services/analyticsService';

const AnalyticsDebug: React.FC = () => {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<any>({});

  const testDirectQuery = async () => {
    setTesting(true);
    const testResults: any = {};

    try {
      // Test 1: Direct Supabase query
      console.log('🔍 Testing direct Supabase query...');
      const { data: directData, error: directError } = await supabase
        .from('analytics_visitor_stats')
        .select('*')
        .order('date', { ascending: false })
        .limit(5);

      testResults.directQuery = {
        success: !directError,
        error: directError?.message,
        data: directData,
        count: directData?.length || 0
      };

      console.log('📊 Direct query result:', testResults.directQuery);

      // Test 2: Service functions
      console.log('🔍 Testing service functions...');
      
      testResults.visitorStats = await getVisitorStats('7d');
      testResults.trafficSources = await getTrafficSources();
      testResults.geographicData = await getGeographicData();
      testResults.deviceData = await getDeviceData();
      testResults.engagementStats = await getEngagementStats('7d');
      testResults.userStats = await getUserStats();
      testResults.courseAnalytics = await getCourseAnalytics();
      testResults.revenueStats = await getRevenueStats('7d');
      testResults.realTimeVisitors = await getRealTimeVisitors();
      testResults.recentActivity = await getRecentActivity();
      testResults.activeAlerts = await getActiveAlerts();

      // Test 3: Main dashboard function
      console.log('🔍 Testing main dashboard function...');
      testResults.dashboardData = await getAnalyticsDashboardData('7d');

      console.log('✅ All tests completed:', testResults);

    } catch (error) {
      console.error('❌ Test failed:', error);
      testResults.error = error instanceof Error ? error.message : 'Unknown error';
    }

    setResults(testResults);
    setTesting(false);
  };

  const testTableExists = async () => {
    try {
      const { data, error } = await supabase
        .from('analytics_visitor_stats')
        .select('count', { count: 'exact', head: true });

      console.log('Table test result:', { data, error });
      return !error;
    } catch (err) {
      console.error('Table test error:', err);
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">🔧 Analytics Debug Tool</h1>
          
          <div className="mb-6">
            <button
              onClick={testDirectQuery}
              disabled={testing}
              className={`px-6 py-3 rounded-lg text-white font-medium ${
                testing 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {testing ? '🔄 Testing...' : '🧪 Run All Tests'}
            </button>
          </div>

          {Object.keys(results).length > 0 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">📋 Test Results</h2>
              
              {/* Direct Query Test */}
              {results.directQuery && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">
                    1️⃣ Direct Database Query Test
                  </h3>
                  <div className={`text-sm ${results.directQuery.success ? 'text-green-600' : 'text-red-600'}`}>
                    Status: {results.directQuery.success ? '✅ Success' : '❌ Failed'}
                  </div>
                  {results.directQuery.error && (
                    <div className="text-red-600 text-sm mt-1">
                      Error: {results.directQuery.error}
                    </div>
                  )}
                  <div className="text-sm text-gray-600 mt-1">
                    Rows found: {results.directQuery.count}
                  </div>
                  {results.directQuery.data && results.directQuery.data.length > 0 && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-blue-600 text-sm">Show sample data</summary>
                      <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-x-auto">
                        {JSON.stringify(results.directQuery.data.slice(0, 2), null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              {/* Service Function Tests */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(results).filter(([key]) => key !== 'directQuery' && key !== 'dashboardData' && key !== 'error').map(([key, value]: [string, any]) => (
                  <div key={key} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">{key}</h4>
                    <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                      {JSON.stringify(value, null, 2)}
                    </pre>
                  </div>
                ))}
              </div>

              {/* Dashboard Data Test */}
              {results.dashboardData && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">
                    🎯 Main Dashboard Function Test
                  </h3>
                  <div className="text-sm text-blue-600 mb-2">
                    This is what the Analytics Dashboard should receive:
                  </div>
                  <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                    {JSON.stringify(results.dashboardData, null, 2)}
                  </pre>
                </div>
              )}

              {/* Error Display */}
              {results.error && (
                <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                  <h3 className="font-medium text-red-900 mb-2">❌ Error</h3>
                  <div className="text-red-700 text-sm">{results.error}</div>
                </div>
              )}
            </div>
          )}

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">🎯 What This Test Does:</h3>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• Tests direct database connection to analytics_visitor_stats</li>
              <li>• Tests all individual service functions</li>
              <li>• Tests the main getAnalyticsDashboardData function</li>
              <li>• Shows exactly what data (if any) is being returned</li>
              <li>• Identifies where the problem is occurring</li>
            </ul>
          </div>

          <div className="mt-4 flex space-x-4">
            <button
              onClick={() => window.location.href = '/analytics-dashboard'}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              📊 Go to Analytics Dashboard
            </button>
            <button
              onClick={() => window.location.href = '/database-test'}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              🔧 Go to Database Test
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDebug; 