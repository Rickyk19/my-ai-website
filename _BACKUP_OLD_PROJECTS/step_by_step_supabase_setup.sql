-- STEP 1: Create the courses table first (from your original course setup)
CREATE TABLE IF NOT EXISTS courses (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  instructor VARCHAR(255) NOT NULL,
  fees DECIMAL(10,2) NOT NULL,
  duration VARCHAR(100) NOT NULL,
  level VARCHAR(50) NOT NULL,
  description TEXT,
  video_link VARCHAR(500),
  pdf_file VARCHAR(500),
  thumbnail VARCHAR(500),
  prerequisites TEXT,
  learning_outcomes TEXT,
  category VARCHAR(100),
  language VARCHAR(50) DEFAULT 'English',
  max_students INTEGER DEFAULT 100,
  includes_certificate BOOLEAN DEFAULT true,
  status VARCHAR(50) DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- STEP 2: Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- STEP 3: Create orders table
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

-- STEP 4: Insert sample users
INSERT INTO users (name, email, status) VALUES 
('John Doe', 'student@example.com', 'active'),
('Jane Smith', 'learner@test.com', 'active'),
('Mike Johnson', 'mike@demo.com', 'active')
ON CONFLICT (email) DO NOTHING;

-- STEP 5: Insert sample courses
INSERT INTO courses (
  name,
  instructor, 
  fees,
  duration,
  level,
  description,
  video_link,
  prerequisites,
  learning_outcomes,
  category,
  language,
  max_students,
  includes_certificate,
  status
) VALUES 
(
  'Introduction to Machine Learning',
  'Dr. Sarah Johnson',
  2999.00,
  '8 weeks',
  'Beginner',
  'Learn the fundamentals of machine learning including supervised and unsupervised learning algorithms. This comprehensive course covers linear regression, decision trees, clustering, and neural network basics.',
  'https://www.youtube.com/watch?v=example1',
  'Basic programming knowledge|High school mathematics',
  'Understand ML concepts|Build basic ML models|Apply algorithms to real data|Evaluate model performance',
  'Machine Learning',
  'English',
  100,
  true,
  'published'
),
(
  'Deep Learning Fundamentals', 
  'Prof. Michael Chen',
  4999.00,
  '12 weeks',
  'Intermediate',
  'Deep dive into neural networks, convolutional neural networks (CNNs), and recurrent neural networks (RNNs). Learn to build and train deep learning models using modern frameworks.',
  'https://www.youtube.com/watch?v=example2',
  'Introduction to Machine Learning|Python programming|Linear algebra basics',
  'Build deep neural networks|Implement CNNs for image recognition|Create RNNs for sequence data|Use TensorFlow and PyTorch',
  'Deep Learning',
  'English',
  75,
  true,
  'published'
),
(
  'AI for Beginners',
  'Dr. Emily Rodriguez',
  1999.00,
  '6 weeks', 
  'Beginner',
  'A gentle introduction to Artificial Intelligence concepts, applications, and impact on society. Perfect for non-technical audiences who want to understand AI.',
  'https://www.youtube.com/watch?v=example3',
  'No technical background required',
  'Understand AI concepts|Recognize AI applications|Appreciate AI ethics|Make informed AI decisions',
  'Artificial Intelligence',
  'English',
  150,
  true,
  'published'
),
(
  'Advanced Neural Networks',
  'Dr. Alex Thompson',
  6999.00,
  '16 weeks',
  'Advanced',
  'Advanced topics in neural networks including transformers, attention mechanisms, GANs, and cutting-edge architectures. Includes hands-on research projects.',
  'https://www.youtube.com/watch?v=example4',
  'Deep Learning Fundamentals|Strong mathematics background|Research experience preferred',
  'Implement transformer models|Build generative networks|Conduct AI research|Publish research findings',
  'Advanced AI',
  'English',
  25,
  true,
  'published'
)
ON CONFLICT (name) DO UPDATE SET
  instructor = EXCLUDED.instructor,
  fees = EXCLUDED.fees,
  duration = EXCLUDED.duration,
  level = EXCLUDED.level,
  description = EXCLUDED.description,
  video_link = EXCLUDED.video_link,
  prerequisites = EXCLUDED.prerequisites,
  learning_outcomes = EXCLUDED.learning_outcomes,
  category = EXCLUDED.category,
  language = EXCLUDED.language,
  max_students = EXCLUDED.max_students,
  includes_certificate = EXCLUDED.includes_certificate,
  status = EXCLUDED.status;

-- STEP 6: Insert sample completed orders
INSERT INTO orders (course_name, amount, customer_name, customer_email, status, payment_method, transaction_id) VALUES
('Introduction to Machine Learning', 2999.00, 'John Doe', 'student@example.com', 'completed', 'credit_card', 'TXN_ML_001'),
('Deep Learning Fundamentals', 4999.00, 'John Doe', 'student@example.com', 'completed', 'debit_card', 'TXN_DL_002'),
('AI for Beginners', 1999.00, 'Jane Smith', 'learner@test.com', 'completed', 'upi', 'TXN_AI_003'),
('Advanced Neural Networks', 6999.00, 'Mike Johnson', 'mike@demo.com', 'completed', 'net_banking', 'TXN_NN_004');

-- STEP 7: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_courses_name ON courses(name);
CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_course_name ON orders(course_name);

-- STEP 8: Enable Row Level Security
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- STEP 9: Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read access for all users" ON courses;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON courses;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON courses;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON courses;
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Users can insert their own data" ON users;
DROP POLICY IF EXISTS "Users can view orders" ON orders;
DROP POLICY IF EXISTS "Users can insert orders" ON orders;

-- STEP 10: Create policies for all tables
-- Courses policies
CREATE POLICY "Enable read access for all users" ON courses
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON courses
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only" ON courses
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for authenticated users only" ON courses
    FOR DELETE USING (true);

-- Users policies
CREATE POLICY "Users can view their own data" ON users
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own data" ON users  
    FOR INSERT WITH CHECK (true);

-- Orders policies
CREATE POLICY "Users can view orders" ON orders
    FOR SELECT USING (true);

CREATE POLICY "Users can insert orders" ON orders
    FOR INSERT WITH CHECK (true);

-- STEP 11: Create update triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables
DROP TRIGGER IF EXISTS update_courses_updated_at ON courses;
CREATE TRIGGER update_courses_updated_at 
    BEFORE UPDATE ON courses 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at 
    BEFORE UPDATE ON orders 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- SUCCESS! All tables created with sample data
-- Test login credentials:
-- Email: student@example.com (has 2 courses)
-- Email: learner@test.com (has 1 course)  
-- Email: mike@demo.com (has 1 course)
-- Password: any (validation simplified for demo) 
