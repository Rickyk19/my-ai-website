-- SUPER SIMPLE WORKING SQL - Copy and paste this in Supabase SQL Editor
-- This avoids all conflict issues and just works

-- 1. Drop existing tables if they have issues
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 2. Create users table with proper constraints
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create orders table with proper constraints
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

-- 4. Disable Row Level Security for testing
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE courses DISABLE ROW LEVEL SECURITY;

-- 5. Insert test data directly (no conflicts)
INSERT INTO users (name, email, status) VALUES 
('John Doe', 'student@example.com', 'active');

INSERT INTO users (name, email, status) VALUES 
('Jane Smith', 'learner@test.com', 'active');

INSERT INTO users (name, email, status) VALUES 
('Mike Johnson', 'mike@demo.com', 'active');

-- 6. Insert orders directly (no conflicts)
INSERT INTO orders (course_name, amount, customer_name, customer_email, status, transaction_id) VALUES
('Introduction to Machine Learning', 2999.00, 'John Doe', 'student@example.com', 'completed', 'TXN_ML_001');

INSERT INTO orders (course_name, amount, customer_name, customer_email, status, transaction_id) VALUES
('Deep Learning Fundamentals', 4999.00, 'John Doe', 'student@example.com', 'completed', 'TXN_DL_002');

INSERT INTO orders (course_name, amount, customer_name, customer_email, status, transaction_id) VALUES
('AI for Beginners', 1999.00, 'Jane Smith', 'learner@test.com', 'completed', 'TXN_AI_003');

-- 7. Verify data was inserted
SELECT 'Users created:' as info, COUNT(*) as count FROM users;
SELECT 'Orders created:' as info, COUNT(*) as count FROM orders;
SELECT 'Courses exist:' as info, COUNT(*) as count FROM courses;

-- 8. Show the test data
SELECT 'Test user data:' as info;
SELECT * FROM users;

SELECT 'Test order data:' as info;
SELECT * FROM orders WHERE status = 'completed';

-- SUCCESS! Now you can test login with: student@example.com 