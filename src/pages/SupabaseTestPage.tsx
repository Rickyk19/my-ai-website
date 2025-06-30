import React, { useState } from 'react';
import { supabase } from '../utils/supabase';

const SupabaseTestPage: React.FC = () => {
  const [results, setResults] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  const runAllTests = async () => {
    setIsLoading(true);
    const testResults: any = {};

    // Test 1: Basic Supabase client connection
    try {
      testResults.test1 = "Testing basic Supabase client...";
      const { data, error } = await supabase.from('courses').select('count').limit(1);
      testResults.test1 = { success: !error, data, error: error?.message };
    } catch (err: any) {
      testResults.test1 = { success: false, error: err.message };
    }

    // Test 2: Direct fetch to Supabase
    try {
      testResults.test2 = "Testing direct fetch...";
      const response = await fetch('https://ahvxqultshujqtmbkjpy.supabase.co/rest/v1/courses?select=id&limit=1', {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ'
        }
      });
      const data = await response.json();
      testResults.test2 = { success: response.ok, data, status: response.status };
    } catch (err: any) {
      testResults.test2 = { success: false, error: err.message };
    }

    // Test 3: Test with different table (feedback - we know this exists)
    try {
      testResults.test3 = "Testing feedback table...";
      const { data, error } = await supabase.from('feedback').select('count').limit(1);
      testResults.test3 = { success: !error, data, error: error?.message };
    } catch (err: any) {
      testResults.test3 = { success: false, error: err.message };
    }

    // Test 4: Try to create and test users table
    try {
      testResults.test4 = "Testing users table creation...";
      const { data, error } = await supabase.rpc('create_users_table_if_not_exists');
      if (error && !error.message.includes('already exists')) {
        // Try a simple select instead
        const { data: userData, error: userError } = await supabase.from('users').select('*').limit(1);
        testResults.test4 = { success: !userError, data: userData, error: userError?.message };
      } else {
        testResults.test4 = { success: true, message: 'Table creation attempted' };
      }
    } catch (err: any) {
      testResults.test4 = { success: false, error: err.message };
    }

    setResults(testResults);
    setIsLoading(false);
  };

  const createTables = async () => {
    setIsLoading(true);
    try {
      // Create tables using SQL functions
      const createUsersSQL = `
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          status VARCHAR(50) DEFAULT 'active',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;

      const createOrdersSQL = `
        CREATE TABLE IF NOT EXISTS orders (
          id SERIAL PRIMARY KEY,
          course_name VARCHAR(255) NOT NULL,
          amount DECIMAL(10,2) NOT NULL,
          customer_name VARCHAR(255) NOT NULL,
          customer_email VARCHAR(255) NOT NULL,
          status VARCHAR(50) DEFAULT 'pending',
          transaction_id VARCHAR(255) UNIQUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;

      // Try to execute these using RPC or direct SQL
      const result1 = await supabase.rpc('exec_sql', { sql: createUsersSQL });
      const result2 = await supabase.rpc('exec_sql', { sql: createOrdersSQL });

      setResults({
        tableCreation: {
          users: result1,
          orders: result2,
          message: 'Attempted to create tables'
        }
      });
    } catch (err: any) {
      setResults({
        tableCreation: {
          error: err.message,
          message: 'Table creation failed - you need to run SQL manually'
        }
      });
    }
    setIsLoading(false);
  };

  const insertTestData = async () => {
    setIsLoading(true);
    try {
      // Insert test user
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert([
          { name: 'Test User', email: 'student@example.com', status: 'active' }
        ])
        .select();

      // Insert test order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            course_name: 'Test Course',
            amount: 1999.00,
            customer_name: 'Test User',
            customer_email: 'student@example.com',
            status: 'completed',
            transaction_id: 'TEST_001'
          }
        ])
        .select();

      setResults({
        dataInsertion: {
          user: { success: !userError, data: userData, error: userError?.message },
          order: { success: !orderError, data: orderData, error: orderError?.message }
        }
      });
    } catch (err: any) {
      setResults({
        dataInsertion: { error: err.message }
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Supabase Connection Diagnostics</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={runAllTests}
            disabled={isLoading}
            className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isLoading ? 'Testing...' : 'Run Connection Tests'}
          </button>
          
          <button
            onClick={createTables}
            disabled={isLoading}
            className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
          >
            {isLoading ? 'Creating...' : 'Create Tables'}
          </button>
          
          <button
            onClick={insertTestData}
            disabled={isLoading}
            className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 disabled:bg-gray-400"
          >
            {isLoading ? 'Inserting...' : 'Insert Test Data'}
          </button>
        </div>

        {/* Results Display */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Test Results:</h2>
          <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-auto max-h-96 text-sm">
            {JSON.stringify(results, null, 2)}
          </pre>
        </div>

        {/* Manual SQL Instructions */}
        <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg mt-8">
          <h3 className="text-lg font-bold text-yellow-800 mb-4">If Connection Fails, Run This SQL Manually:</h3>
          <div className="bg-gray-900 text-white p-4 rounded text-sm overflow-auto">
            <pre>{`-- Run this in Supabase SQL Editor:

-- 1. Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create orders table  
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  course_name VARCHAR(255) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  transaction_id VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Disable RLS temporarily for testing
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;

-- 4. Insert test data
INSERT INTO users (name, email, status) VALUES 
('John Doe', 'student@example.com', 'active')
ON CONFLICT (email) DO NOTHING;

INSERT INTO orders (course_name, amount, customer_name, customer_email, status, transaction_id) VALUES
('Introduction to Machine Learning', 2999.00, 'John Doe', 'student@example.com', 'completed', 'TXN_ML_001')
ON CONFLICT (transaction_id) DO NOTHING;`}</pre>
          </div>
        </div>

        {/* Quick Fix Button */}
        <div className="text-center mt-8">
          <button
            onClick={() => window.location.href = '/members-login-debug'}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
          >
            Back to Debug Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupabaseTestPage; 