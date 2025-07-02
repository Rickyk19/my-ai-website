import React, { useState } from 'react';

const SupabaseConnectionVerify: React.FC = () => {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<any>({});

  const SUPABASE_URL = 'https://ahvxqultshujqtmbkjpy.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ';

  const testConnection = async () => {
    setTesting(true);
    const testResults: any = {};

    // Test 1: Basic Supabase connection
    try {
      console.log('🔍 Testing basic Supabase connection...');
      const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
        method: 'GET',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        }
      });

      testResults.basicConnection = {
        status: response.status,
        statusText: response.statusText,
        success: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      };
    } catch (error) {
      testResults.basicConnection = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }

    // Test 2: Check if any tables exist
    try {
      console.log('🔍 Testing table access...');
      const tablesResponse = await fetch(`${SUPABASE_URL}/rest/v1/`, {
        method: 'OPTIONS',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        }
      });

      testResults.tableAccess = {
        status: tablesResponse.status,
        success: tablesResponse.ok
      };
    } catch (error) {
      testResults.tableAccess = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }

    // Test 3: Try accessing a known working table (users or courses)
    try {
      console.log('🔍 Testing known table access...');
      const usersResponse = await fetch(`${SUPABASE_URL}/rest/v1/users?limit=1`, {
        method: 'GET',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      if (usersResponse.ok) {
        const userData = await usersResponse.json();
        testResults.knownTable = {
          success: true,
          table: 'users',
          rowCount: userData.length,
          status: usersResponse.status
        };
      } else {
        testResults.knownTable = {
          success: false,
          table: 'users',
          status: usersResponse.status,
          error: `HTTP ${usersResponse.status}: ${usersResponse.statusText}`
        };
      }
    } catch (error) {
      testResults.knownTable = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }

    // Test 4: Try analytics table specifically
    try {
      console.log('🔍 Testing analytics table...');
      const analyticsResponse = await fetch(`${SUPABASE_URL}/rest/v1/analytics_visitor_stats?limit=1`, {
        method: 'GET',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      if (analyticsResponse.ok) {
        const analyticsData = await analyticsResponse.json();
        testResults.analyticsTable = {
          success: true,
          table: 'analytics_visitor_stats',
          rowCount: analyticsData.length,
          status: analyticsResponse.status,
          sampleData: analyticsData[0] || null
        };
      } else {
        const errorText = await analyticsResponse.text();
        testResults.analyticsTable = {
          success: false,
          table: 'analytics_visitor_stats',
          status: analyticsResponse.status,
          error: `HTTP ${analyticsResponse.status}: ${analyticsResponse.statusText}`,
          errorDetails: errorText
        };
      }
    } catch (error) {
      testResults.analyticsTable = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }

    // Test 5: Check API key validity
    testResults.apiKeyInfo = {
      url: SUPABASE_URL,
      keyLength: SUPABASE_ANON_KEY.length,
      keyStart: SUPABASE_ANON_KEY.substring(0, 20) + '...',
      keyEnd: '...' + SUPABASE_ANON_KEY.substring(SUPABASE_ANON_KEY.length - 10)
    };

    console.log('🔍 All tests completed:', testResults);
    setResults(testResults);
    setTesting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">🔧 Supabase Connection Verification</h1>
          
          <div className="mb-6">
            <button
              onClick={testConnection}
              disabled={testing}
              className={`px-6 py-3 rounded-lg text-white font-medium ${
                testing 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {testing ? '🔄 Testing Connection...' : '🧪 Test Supabase Connection'}
            </button>
          </div>

          {Object.keys(results).length > 0 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">📋 Connection Test Results</h2>
              
              {Object.entries(results).map(([testName, testResult]: [string, any]) => (
                <div key={testName} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2 capitalize">
                    {testName.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </h3>
                  
                  <div className={`text-sm mb-2 ${testResult.success ? 'text-green-600' : 'text-red-600'}`}>
                    Status: {testResult.success ? '✅ Success' : '❌ Failed'}
                    {testResult.status && ` (HTTP ${testResult.status})`}
                  </div>
                  
                  <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                    {JSON.stringify(testResult, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-medium text-yellow-900 mb-2">🔍 What This Test Checks:</h3>
            <ul className="text-yellow-800 text-sm space-y-1 list-disc list-inside">
              <li>Basic Supabase API connection</li>
              <li>API key authentication validity</li>
              <li>Access to existing tables (users/courses)</li>
              <li>Access to analytics tables specifically</li>
              <li>Detailed error messages and status codes</li>
            </ul>
          </div>

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">🎯 Common Issues & Solutions:</h3>
            <ul className="text-blue-800 text-sm space-y-1 list-disc list-inside">
              <li><strong>401 Unauthorized:</strong> API key invalid or RLS blocking access</li>
              <li><strong>404 Not Found:</strong> Table doesn't exist</li>
              <li><strong>403 Forbidden:</strong> Insufficient permissions</li>
              <li><strong>Free Tier Limit:</strong> Check if you've exceeded free tier limits</li>
              <li><strong>CORS Issues:</strong> Check if request is being blocked by browser</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupabaseConnectionVerify; 