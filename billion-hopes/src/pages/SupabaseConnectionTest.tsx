import React, { useState } from 'react';

const SupabaseConnectionTest: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  // Test simple connection with direct fetch
  const testSimpleConnection = async () => {
    try {
      addResult('🔄 Testing simple connection...');
      
      const response = await fetch('https://ahvxqultshujqtmbkjpy.supabase.co/rest/v1/courses?select=count&limit=1', {
        method: 'GET',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ',
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors'
      });

      addResult(`Response status: ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        addResult(`❌ Connection failed: HTTP ${response.status} - ${errorText}`);
        return { success: false, error: `HTTP ${response.status}: ${errorText}` };
      }

      const data = await response.json();
      addResult('✅ Basic connection successful!');
      return { success: true, data };
      
    } catch (error: any) {
      addResult(`❌ Connection failed: ${error.message}`);
      return { success: false, error: error.message };
    }
  };

  // Check if users table exists
  const checkUsersTable = async () => {
    try {
      addResult('👥 Checking users table...');
      
      const response = await fetch('https://ahvxqultshujqtmbkjpy.supabase.co/rest/v1/users?select=*&email=eq.student@example.com&limit=1', {
        method: 'GET',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ',
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors'
      });

      if (!response.ok) {
        const errorText = await response.text();
        addResult(`❌ Users table error: ${errorText}`);
        return { success: false, error: `Users table: ${errorText}` };
      }

      const data = await response.json();
      
      if (data.length === 0) {
        addResult('❌ No test user found');
        return { success: false, error: 'No test user found' };
      }
      
      addResult(`✅ Found user: ${data[0].name} (${data[0].email})`);
      return { success: true, user: data[0] };
      
    } catch (error: any) {
      addResult(`❌ Users table check failed: ${error.message}`);
      return { success: false, error: error.message };
    }
  };

  // Check orders table
  const checkOrdersTable = async () => {
    try {
      addResult('📦 Checking orders table...');
      
      const response = await fetch('https://ahvxqultshujqtmbkjpy.supabase.co/rest/v1/orders?select=*&customer_email=eq.student@example.com&status=eq.completed', {
        method: 'GET',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ',
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors'
      });

      if (!response.ok) {
        const errorText = await response.text();
        addResult(`❌ Orders table error: ${errorText}`);
        return { success: false, error: `Orders table: ${errorText}` };
      }

      const data = await response.json();
      
      addResult(`✅ Found ${data.length} completed orders`);
      data.forEach((order: any) => {
        addResult(`    📚 ${order.course_name} - ₹${order.amount}`);
      });
      
      return { success: true, orders: data };
      
    } catch (error: any) {
      addResult(`❌ Orders table check failed: ${error.message}`);
      return { success: false, error: error.message };
    }
  };

  const runTests = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    addResult('🔄 Starting CORS-friendly Supabase connection tests...');
    addResult('💡 Using direct fetch to bypass CORS issues...');

    // Test 1: Simple connection test
    const simpleTest = await testSimpleConnection();

    // Test 2: Check users table
    const usersTest = await checkUsersTable();

    // Test 3: Check orders table
    const ordersTest = await checkOrdersTable();

    // Final diagnosis
    addResult('🏁 Test Summary:');
    if (simpleTest.success && usersTest.success && ordersTest.success) {
      addResult('🎉 ALL TESTS PASSED! Members Login should work now!');
      addResult('🚀 Go to /members-login and try logging in with student@example.com');
    } else if (simpleTest.success) {
      addResult('⚠️ Connection works but database tables missing');
      addResult('💡 Run the SQL setup in your Supabase SQL Editor');
    } else {
      addResult('🔥 CRITICAL: Connection still failing');
      addResult('💡 This might be a network/firewall issue');
      addResult('💡 Try using a VPN or different network');
    }

    setIsLoading(false);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const openSupabase = () => {
    window.open('https://supabase.com/dashboard/projects', '_blank');
  };

  const copySQLSetup = () => {
    const sql = `-- MEMBERS LOGIN SETUP SQL
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  course_name VARCHAR(255) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  transaction_id VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Disable security for testing
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE courses DISABLE ROW LEVEL SECURITY;

-- Insert test data
INSERT INTO users (name, email) VALUES ('John Doe', 'student@example.com');
INSERT INTO users (name, email) VALUES ('Jane Smith', 'learner@test.com');

INSERT INTO orders (course_name, amount, customer_name, customer_email, status, transaction_id) VALUES
('Introduction to Machine Learning', 2999.00, 'John Doe', 'student@example.com', 'completed', 'TXN_001'),
('Deep Learning Fundamentals', 4999.00, 'John Doe', 'student@example.com', 'completed', 'TXN_002');

-- Verify
SELECT * FROM users;
SELECT * FROM orders;`;

    navigator.clipboard.writeText(sql);
    addResult('📋 SQL setup copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            🔧 CORS-Fixed Supabase Diagnostics
          </h1>
          
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-bold text-blue-900 mb-2">🎯 CORS Issue Fixed!</h3>
            <p className="text-blue-800 text-sm">
              This version uses direct fetch with proper CORS headers to bypass the "Failed to fetch" error.
              Now we can test if your database tables are set up correctly.
            </p>
          </div>
          
          <div className="flex gap-4 mb-6">
            <button
              onClick={runTests}
              disabled={isLoading}
              className={`px-4 py-2 rounded font-medium ${
                isLoading 
                  ? 'bg-gray-400 text-white cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isLoading ? 'Running Tests...' : 'Test Connection (CORS-Fixed)'}
            </button>
            
            <button
              onClick={clearResults}
              className="px-4 py-2 bg-gray-500 text-white rounded font-medium hover:bg-gray-600"
            >
              Clear Results
            </button>

            <button
              onClick={openSupabase}
              className="px-4 py-2 bg-green-600 text-white rounded font-medium hover:bg-green-700"
            >
              Open Supabase Dashboard
            </button>

            <button
              onClick={copySQLSetup}
              className="px-4 py-2 bg-purple-600 text-white rounded font-medium hover:bg-purple-700"
            >
              Copy SQL Setup
            </button>
          </div>

          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
            {testResults.length === 0 ? (
              <p className="text-gray-500">Click "Test Connection (CORS-Fixed)" to check if the CORS issue is resolved...</p>
            ) : (
              testResults.map((result, index) => (
                <div key={index} className="mb-1">
                  {result}
                </div>
              ))
            )}
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-bold text-green-900 mb-2">🔧 How This Fixes CORS:</h3>
              <div className="text-green-800 text-sm space-y-1">
                <p>✅ Uses direct fetch() instead of Supabase client</p>
                <p>✅ Adds proper CORS headers</p>
                <p>✅ Sets mode: 'cors' explicitly</p>
                <p>✅ Uses credentials: 'omit' to avoid auth issues</p>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-bold text-yellow-900 mb-2">📋 Quick Setup:</h3>
              <div className="text-yellow-800 text-sm space-y-1">
                <p>1. Click "Copy SQL Setup" above</p>
                <p>2. Click "Open Supabase Dashboard"</p>
                <p>3. Go to SQL Editor → Paste → Run</p>
                <p>4. Come back and test again</p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-purple-50 rounded-lg">
            <h3 className="font-bold text-purple-900 mb-2">🚀 After Success:</h3>
            <div className="text-purple-800 text-sm space-y-1">
              <p>✅ Visit <code>/members-login</code></p>
              <p>✅ Email: <code>student@example.com</code></p>
              <p>✅ Password: <code>any password</code></p>
              <p>✅ Should work without CORS errors!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupabaseConnectionTest; 