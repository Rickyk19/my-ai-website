import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

const DatabaseTest: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<string>('Testing...');
  const [analyticsData, setAnalyticsData] = useState<Record<string, any> | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    testAnalyticsDatabase();
  }, []);

  const testAnalyticsDatabase = async () => {
    try {
      setConnectionStatus('Testing Supabase connection...');
      
      // Test 1: Basic connection
      const { data: connectionTest, error: connectionError } = await supabase
        .from('analytics_visitor_stats')
        .select('count', { count: 'exact', head: true });

      if (connectionError) {
        throw new Error(`Connection failed: ${connectionError.message}`);
      }

      setConnectionStatus('✅ Supabase connected successfully!');

      // Test 2: Check if analytics tables exist and have data
      const tables = [
        'analytics_visitor_stats',
        'analytics_traffic_sources', 
        'analytics_geographic_data',
        'analytics_device_browser_data',
        'analytics_course_performance',
        'analytics_revenue_tracking',
        'analytics_realtime_visitors'
      ];

      const tableResults: Record<string, any> = {};

      for (const table of tables) {
        try {
          const { data, error, count } = await supabase
            .from(table)
            .select('*', { count: 'exact' })
            .limit(3);

          if (error) {
            tableResults[table] = `❌ Error: ${error.message}`;
          } else {
            tableResults[table] = {
              status: '✅ Table exists',
              rowCount: count,
              sampleData: data
            };
          }
        } catch (err) {
          tableResults[table] = `❌ Table doesn't exist or access denied`;
        }
      }

      setAnalyticsData(tableResults);

      // Test 3: Specifically test visitor stats data
      const { data: visitorData, error: visitorError } = await supabase
        .from('analytics_visitor_stats')
        .select('*')
        .order('date', { ascending: false })
        .limit(5);

      if (visitorError) {
        setError(`Visitor stats error: ${visitorError.message}`);
      } else {
        console.log('📊 Sample visitor data:', visitorData);
      }

    } catch (err) {
      setConnectionStatus('❌ Connection failed');
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const runSampleDataScript = async () => {
    alert('❗ To run sample data script:\n\n1. Go to your Supabase dashboard\n2. Open SQL Editor\n3. Run the fix_analytics_sample_data.sql script\n4. Refresh this page');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Analytics Database Test</h1>
          
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Connection Status</h2>
            <p className={`text-sm ${connectionStatus.includes('✅') ? 'text-green-600' : 'text-blue-600'}`}>
              {connectionStatus}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-md">
              <h3 className="text-red-800 font-semibold">Error Details:</h3>
              <pre className="text-red-700 text-sm mt-2 whitespace-pre-wrap">{error}</pre>
            </div>
          )}

          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Analytics Tables Status</h2>
              <button
                onClick={runSampleDataScript}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Run Sample Data Script
              </button>
            </div>
            
            {analyticsData ? (
              <div className="space-y-4">
                {Object.entries(analyticsData).map(([tableName, tableInfo]: [string, any]) => (
                  <div key={tableName} className="border border-gray-200 rounded-md p-4">
                    <h3 className="font-medium text-gray-900 mb-2">{tableName}</h3>
                    
                    {typeof tableInfo === 'string' ? (
                      <p className="text-red-600 text-sm">{tableInfo}</p>
                    ) : (
                      <div>
                        <p className="text-green-600 text-sm mb-2">
                          {tableInfo.status} - {tableInfo.rowCount} rows
                        </p>
                        
                        {tableInfo.sampleData && tableInfo.sampleData.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-600 mb-1">Sample data:</p>
                            <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                              {JSON.stringify(tableInfo.sampleData, null, 2)}
                            </pre>
                          </div>
                        )}
                        
                        {tableInfo.rowCount === 0 && (
                          <p className="text-yellow-600 text-sm">⚠️ Table exists but has no data</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Loading table information...</p>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h3 className="text-blue-800 font-semibold mb-2">📋 Next Steps:</h3>
            <ol className="text-blue-700 text-sm space-y-1 list-decimal list-inside">
              <li>If tables don't exist: Run <code>analytics_dashboard_tables.sql</code> first</li>
              <li>If tables exist but have no data: Run <code>fix_analytics_sample_data.sql</code></li>
              <li>If data exists but dashboard shows zeros: Check browser console for errors</li>
              <li>Refresh this page after running scripts to retest</li>
            </ol>
          </div>

          <div className="mt-6 flex space-x-4">
            <button
              onClick={testAnalyticsDatabase}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              🔄 Retest Database
            </button>
            <button
              onClick={() => window.location.href = '/analytics-dashboard'}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              📊 Go to Analytics Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseTest; 