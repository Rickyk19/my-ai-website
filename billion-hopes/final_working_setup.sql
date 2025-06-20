-- FINAL WORKING SETUP - This will definitely work!
-- Copy and paste this entire script into Supabase SQL Editor

-- Step 1: Add missing column to courses table if needed
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='courses' AND column_name='includes_certificate') THEN
        ALTER TABLE courses ADD COLUMN includes_certificate BOOLEAN DEFAULT true;
    END IF;
END $$;

-- Step 2: Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Step 3: Create orders table with proper unique constraint
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  course_name VARCHAR(255) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  payment_method VARCHAR(100),
  transaction_id VARCHAR(255) UNIQUE,
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Step 4: Insert users one by one to avoid conflicts
INSERT INTO users (name, email, status) 
SELECT 'John Doe', 'student@example.com', 'active'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'student@example.com');

INSERT INTO users (name, email, status) 
SELECT 'Jane Smith', 'learner@test.com', 'active'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'learner@test.com');

INSERT INTO users (name, email, status) 
SELECT 'Mike Johnson', 'mike@demo.com', 'active'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'mike@demo.com');

-- Step 5: Insert courses one by one to avoid conflicts
INSERT INTO courses (name, instructor, fees, duration, level, description, video_link, status) 
SELECT 'Introduction to Machine Learning', 'Dr. Sarah Johnson', 2999.00, '8 weeks', 'Beginner', 'Learn the fundamentals of machine learning including supervised and unsupervised learning algorithms.', 'https://www.youtube.com/watch?v=example1', 'published'
WHERE NOT EXISTS (SELECT 1 FROM courses WHERE name = 'Introduction to Machine Learning');

INSERT INTO courses (name, instructor, fees, duration, level, description, video_link, status) 
SELECT 'Deep Learning Fundamentals', 'Prof. Michael Chen', 4999.00, '12 weeks', 'Intermediate', 'Deep dive into neural networks, CNNs, and RNNs. Learn to build deep learning models.', 'https://www.youtube.com/watch?v=example2', 'published'
WHERE NOT EXISTS (SELECT 1 FROM courses WHERE name = 'Deep Learning Fundamentals');

INSERT INTO courses (name, instructor, fees, duration, level, description, video_link, status) 
SELECT 'AI for Beginners', 'Dr. Emily Rodriguez', 1999.00, '6 weeks', 'Beginner', 'A gentle introduction to AI concepts, perfect for non-technical audiences.', 'https://www.youtube.com/watch?v=example3', 'published'
WHERE NOT EXISTS (SELECT 1 FROM courses WHERE name = 'AI for Beginners');

INSERT INTO courses (name, instructor, fees, duration, level, description, video_link, status) 
SELECT 'Advanced Neural Networks', 'Dr. Alex Thompson', 6999.00, '16 weeks', 'Advanced', 'Advanced neural network topics including transformers and GANs.', 'https://www.youtube.com/watch?v=example4', 'published'
WHERE NOT EXISTS (SELECT 1 FROM courses WHERE name = 'Advanced Neural Networks');

-- Step 6: Insert orders one by one to avoid conflicts
INSERT INTO orders (course_name, amount, customer_name, customer_email, status, payment_method, transaction_id) 
SELECT 'Introduction to Machine Learning', 2999.00, 'John Doe', 'student@example.com', 'completed', 'credit_card', 'TXN_ML_001'
WHERE NOT EXISTS (SELECT 1 FROM orders WHERE transaction_id = 'TXN_ML_001');

INSERT INTO orders (course_name, amount, customer_name, customer_email, status, payment_method, transaction_id) 
SELECT 'Deep Learning Fundamentals', 4999.00, 'John Doe', 'student@example.com', 'completed', 'debit_card', 'TXN_DL_002'
WHERE NOT EXISTS (SELECT 1 FROM orders WHERE transaction_id = 'TXN_DL_002');

INSERT INTO orders (course_name, amount, customer_name, customer_email, status, payment_method, transaction_id) 
SELECT 'AI for Beginners', 1999.00, 'Jane Smith', 'learner@test.com', 'completed', 'upi', 'TXN_AI_003'
WHERE NOT EXISTS (SELECT 1 FROM orders WHERE transaction_id = 'TXN_AI_003');

INSERT INTO orders (course_name, amount, customer_name, customer_email, status, payment_method, transaction_id) 
SELECT 'Advanced Neural Networks', 6999.00, 'Mike Johnson', 'mike@demo.com', 'completed', 'net_banking', 'TXN_NN_004'
WHERE NOT EXISTS (SELECT 1 FROM orders WHERE transaction_id = 'TXN_NN_004');

-- Step 7: Enable RLS (only if not already enabled)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'users' AND rowsecurity = true) THEN
        ALTER TABLE users ENABLE ROW LEVEL SECURITY;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'orders' AND rowsecurity = true) THEN
        ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Step 8: Create policies (drop first to avoid conflicts)
DROP POLICY IF EXISTS "users_select_policy" ON users;
DROP POLICY IF EXISTS "users_insert_policy" ON users;
DROP POLICY IF EXISTS "orders_select_policy" ON orders;
DROP POLICY IF EXISTS "orders_insert_policy" ON orders;

CREATE POLICY "users_select_policy" ON users FOR SELECT USING (true);
CREATE POLICY "users_insert_policy" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "orders_select_policy" ON orders FOR SELECT USING (true);
CREATE POLICY "orders_insert_policy" ON orders FOR INSERT WITH CHECK (true);

-- Step 9: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email_final ON users(email);
CREATE INDEX IF NOT EXISTS idx_orders_email_final ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status_final ON orders(status);

-- Final verification query
SELECT 
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM courses) as total_courses,
    (SELECT COUNT(*) FROM orders WHERE status = 'completed') as completed_orders,
    'Setup complete! Test with: student@example.com' as message; 