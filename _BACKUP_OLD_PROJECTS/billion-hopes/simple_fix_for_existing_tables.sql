-- Simple fix for existing courses table
-- This adds the missing column and inserts the required data

-- Step 1: Add the missing column to existing courses table
ALTER TABLE courses ADD COLUMN IF NOT EXISTS includes_certificate BOOLEAN DEFAULT true;

-- Step 2: Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Step 3: Create orders table if it doesn't exist
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  course_name VARCHAR(255) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  payment_method VARCHAR(100),
  transaction_id VARCHAR(255),
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Step 4: Insert sample users
INSERT INTO users (name, email, status) VALUES 
('John Doe', 'student@example.com', 'active'),
('Jane Smith', 'learner@test.com', 'active'),
('Mike Johnson', 'mike@demo.com', 'active')
ON CONFLICT (email) DO NOTHING;

-- Step 5: Insert sample courses (only the essential columns)
INSERT INTO courses (name, instructor, fees, duration, level, description, video_link, status) VALUES 
(
  'Introduction to Machine Learning',
  'Dr. Sarah Johnson',
  2999.00,
  '8 weeks',
  'Beginner',
  'Learn the fundamentals of machine learning including supervised and unsupervised learning algorithms.',
  'https://www.youtube.com/watch?v=example1',
  'published'
),
(
  'Deep Learning Fundamentals', 
  'Prof. Michael Chen',
  4999.00,
  '12 weeks',
  'Intermediate',
  'Deep dive into neural networks, CNNs, and RNNs. Learn to build deep learning models.',
  'https://www.youtube.com/watch?v=example2',
  'published'
),
(
  'AI for Beginners',
  'Dr. Emily Rodriguez',
  1999.00,
  '6 weeks', 
  'Beginner',
  'A gentle introduction to AI concepts, perfect for non-technical audiences.',
  'https://www.youtube.com/watch?v=example3',
  'published'
),
(
  'Advanced Neural Networks',
  'Dr. Alex Thompson',
  6999.00,
  '16 weeks',
  'Advanced',
  'Advanced neural network topics including transformers and GANs.',
  'https://www.youtube.com/watch?v=example4',
  'published'
)
ON CONFLICT (name) DO NOTHING;

-- Step 6: Insert sample orders
INSERT INTO orders (course_name, amount, customer_name, customer_email, status, payment_method, transaction_id) VALUES
('Introduction to Machine Learning', 2999.00, 'John Doe', 'student@example.com', 'completed', 'credit_card', 'TXN_ML_001'),
('Deep Learning Fundamentals', 4999.00, 'John Doe', 'student@example.com', 'completed', 'debit_card', 'TXN_DL_002'),
('AI for Beginners', 1999.00, 'Jane Smith', 'learner@test.com', 'completed', 'upi', 'TXN_AI_003'),
('Advanced Neural Networks', 6999.00, 'Mike Johnson', 'mike@demo.com', 'completed', 'net_banking', 'TXN_NN_004')
ON CONFLICT DO NOTHING;

-- Step 7: Enable RLS and create basic policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies
DROP POLICY IF EXISTS "Users can view data" ON users;
DROP POLICY IF EXISTS "Users can insert data" ON users;
DROP POLICY IF EXISTS "Orders can be viewed" ON orders;
DROP POLICY IF EXISTS "Orders can be inserted" ON orders;

CREATE POLICY "Users can view data" ON users FOR SELECT USING (true);
CREATE POLICY "Users can insert data" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Orders can be viewed" ON orders FOR SELECT USING (true);
CREATE POLICY "Orders can be inserted" ON orders FOR INSERT WITH CHECK (true);

-- Success message
SELECT 'Database setup complete! You can now test login with: student@example.com' AS status; 
