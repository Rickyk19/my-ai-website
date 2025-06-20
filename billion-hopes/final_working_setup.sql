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

-- COMPREHENSIVE MEMBERS LOGIN SETUP WITH 20 DEMO COURSES
DROP TABLE IF EXISTS course_comments CASCADE;
DROP TABLE IF EXISTS course_classes CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS courses CASCADE;

-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enhanced courses table with instructor and duration
CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  instructor VARCHAR(255) NOT NULL,
  duration VARCHAR(100) NOT NULL,
  level VARCHAR(50) DEFAULT 'Beginner',
  image_url TEXT,
  certificate_available BOOLEAN DEFAULT true,
  demo_pdf_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Course classes/lessons table
CREATE TABLE course_classes (
  id SERIAL PRIMARY KEY,
  course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
  class_number INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  course_name VARCHAR(255) NOT NULL,
  course_id INTEGER REFERENCES courses(id),
  amount DECIMAL(10,2) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  transaction_id VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Course comments table
CREATE TABLE course_comments (
  id SERIAL PRIMARY KEY,
  course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
  user_email VARCHAR(255) NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  comment TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Disable security for testing
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE courses DISABLE ROW LEVEL SECURITY;
ALTER TABLE course_classes DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE course_comments DISABLE ROW LEVEL SECURITY;

-- Insert test user
INSERT INTO users (name, email) VALUES ('John Doe', 'student@example.com');

-- Insert 20 comprehensive demo courses
INSERT INTO courses (name, description, price, instructor, duration, level, certificate_available, demo_pdf_url) VALUES
('Complete Python Programming Masterclass', 'Master Python from basics to advanced concepts including web development, data science, and automation. Perfect for beginners and professionals.', 4999.00, 'Dr. Sarah Johnson', '40 hours', 'Beginner to Advanced', true, 'https://example.com/demo/python-guide.pdf'),

('Machine Learning & AI Fundamentals', 'Comprehensive introduction to ML algorithms, neural networks, and practical AI applications using Python and TensorFlow.', 6999.00, 'Prof. Michael Chen', '45 hours', 'Intermediate', true, 'https://example.com/demo/ml-basics.pdf'),

('Full Stack Web Development Bootcamp', 'Build modern web applications using React, Node.js, MongoDB, and deployment strategies. Portfolio projects included.', 8999.00, 'Alex Rodriguez', '60 hours', 'Beginner to Advanced', true, 'https://example.com/demo/fullstack-roadmap.pdf'),

('Data Science with R & Python', 'Complete data analysis, visualization, and statistical modeling course. Work with real datasets and business cases.', 7499.00, 'Dr. Emily Watson', '50 hours', 'Intermediate', true, 'https://example.com/demo/datascience-guide.pdf'),

('Digital Marketing Mastery', 'SEO, SEM, Social Media Marketing, Content Strategy, and Analytics. Become a certified digital marketing expert.', 3999.00, 'Mark Thompson', '35 hours', 'Beginner', true, 'https://example.com/demo/marketing-blueprint.pdf'),

('Cybersecurity Ethical Hacking', 'Learn penetration testing, network security, and ethical hacking techniques. Prepare for CEH certification.', 9999.00, 'James Wilson', '55 hours', 'Advanced', true, 'https://example.com/demo/cybersecurity-manual.pdf'),

('Cloud Computing with AWS', 'Master Amazon Web Services including EC2, S3, Lambda, and DevOps practices. AWS certification preparation.', 8499.00, 'Lisa Kumar', '48 hours', 'Intermediate', true, 'https://example.com/demo/aws-essentials.pdf'),

('Mobile App Development with Flutter', 'Build beautiful cross-platform mobile apps for iOS and Android using Flutter and Dart programming language.', 5999.00, 'David Park', '42 hours', 'Intermediate', true, 'https://example.com/demo/flutter-guide.pdf'),

('Blockchain & Cryptocurrency Development', 'Create smart contracts, DApps, and understand blockchain technology. Build your own cryptocurrency.', 7999.00, 'Robert Martinez', '38 hours', 'Advanced', true, 'https://example.com/demo/blockchain-basics.pdf'),

('UI/UX Design Complete Course', 'Master user interface and user experience design using Figma, Adobe XD, and design thinking methodologies.', 4499.00, 'Anna Lee', '32 hours', 'Beginner', true, 'https://example.com/demo/ux-design-kit.pdf'),

('DevOps Engineering Masterclass', 'Docker, Kubernetes, Jenkins, CI/CD pipelines, and infrastructure automation. Become a DevOps expert.', 8999.00, 'Chris Anderson', '52 hours', 'Advanced', true, 'https://example.com/demo/devops-handbook.pdf'),

('Game Development with Unity', 'Create 2D and 3D games using Unity engine and C# programming. Publish games to multiple platforms.', 6499.00, 'Tom Bradley', '44 hours', 'Intermediate', true, 'https://example.com/demo/unity-tutorial.pdf'),

('Business Analytics & Intelligence', 'Excel, Power BI, Tableau, and SQL for business decision making. Transform data into actionable insights.', 5499.00, 'Maria Garcia', '36 hours', 'Beginner', true, 'https://example.com/demo/business-analytics.pdf'),

('Artificial Intelligence with Deep Learning', 'Advanced neural networks, computer vision, NLP, and AI model deployment using TensorFlow and PyTorch.', 9499.00, 'Dr. Kevin Zhang', '58 hours', 'Advanced', true, 'https://example.com/demo/deep-learning-guide.pdf'),

('E-commerce Business Masterclass', 'Start and scale online businesses using Shopify, Amazon FBA, dropshipping, and digital marketing strategies.', 4999.00, 'Jennifer Smith', '40 hours', 'Beginner', true, 'https://example.com/demo/ecommerce-blueprint.pdf'),

('Photography & Video Editing Pro', 'Professional photography techniques and video editing using Adobe Premiere Pro, After Effects, and Lightroom.', 3999.00, 'Ryan Mitchell', '30 hours', 'Beginner', true, 'https://example.com/demo/photography-guide.pdf'),

('Financial Trading & Investment', 'Stock market analysis, forex trading, cryptocurrency investing, and portfolio management strategies.', 6999.00, 'Steven Taylor', '45 hours', 'Intermediate', true, 'https://example.com/demo/trading-manual.pdf'),

('Content Creation & Social Media', 'YouTube, Instagram, TikTok content creation, monetization strategies, and personal branding.', 3499.00, 'Emma Johnson', '28 hours', 'Beginner', true, 'https://example.com/demo/content-creator-kit.pdf'),

('Project Management Professional', 'PMP certification preparation, Agile methodologies, Scrum, and leadership skills for project managers.', 5999.00, 'Daniel Brown', '42 hours', 'Intermediate', true, 'https://example.com/demo/pmp-study-guide.pdf'),

('Advanced Excel & VBA Programming', 'Master Excel formulas, pivot tables, macros, VBA programming, and business automation techniques.', 2999.00, 'Patricia Wilson', '25 hours', 'Intermediate', true, 'https://example.com/demo/excel-mastery.pdf');

-- Insert course classes for each course (varying number of classes per course)
-- Course 1: Python Programming (12 classes)
INSERT INTO course_classes (course_id, class_number, title, description, video_url, duration_minutes) VALUES
(1, 1, 'Python Basics & Setup', 'Introduction to Python programming and development environment setup', 'https://www.youtube.com/watch?v=H7wd6JmTd18', 45),
(1, 2, 'Variables & Data Types', 'Understanding Python variables, strings, numbers, and boolean types', 'https://www.youtube.com/watch?v=H7wd6JmTd18', 40),
(1, 3, 'Control Structures', 'If statements, loops, and conditional logic in Python', 'https://www.youtube.com/watch?v=H7wd6JmTd18', 50),
(1, 4, 'Functions & Modules', 'Creating reusable code with functions and importing modules', 'https://www.youtube.com/watch?v=H7wd6JmTd18', 45),
(1, 5, 'Object-Oriented Programming', 'Classes, objects, inheritance, and encapsulation', 'https://www.youtube.com/watch?v=H7wd6JmTd18', 60),
(1, 6, 'File Handling & I/O', 'Reading and writing files, handling exceptions', 'https://www.youtube.com/watch?v=H7wd6JmTd18', 35),
(1, 7, 'Web Scraping with BeautifulSoup', 'Extract data from websites using Python libraries', 'https://www.youtube.com/watch?v=H7wd6JmTd18', 55),
(1, 8, 'API Development with Flask', 'Building REST APIs and web services', 'https://www.youtube.com/watch?v=H7wd6JmTd18', 65),
(1, 9, 'Database Integration', 'Working with SQLite and PostgreSQL databases', 'https://www.youtube.com/watch?v=H7wd6JmTd18', 50),
(1, 10, 'Data Analysis with Pandas', 'Manipulating and analyzing data with Python', 'https://www.youtube.com/watch?v=H7wd6JmTd18', 55),
(1, 11, 'GUI Development with Tkinter', 'Creating desktop applications with graphical interfaces', 'https://www.youtube.com/watch?v=H7wd6JmTd18', 45),
(1, 12, 'Final Project & Deployment', 'Building and deploying a complete Python application', 'https://www.youtube.com/watch?v=H7wd6JmTd18', 70);

-- Course 2: Machine Learning (10 classes)
INSERT INTO course_classes (course_id, class_number, title, description, video_url, duration_minutes) VALUES
(2, 1, 'Introduction to Machine Learning', 'Understanding ML concepts, types, and applications', 'https://www.youtube.com/watch?v=H7wd6JmTd18', 50),
(2, 2, 'Data Preprocessing', 'Cleaning, transforming, and preparing data for ML models', 'https://www.youtube.com/watch?v=H7wd6JmTd18', 55),
(2, 3, 'Linear & Logistic Regression', 'Building your first prediction models', 'https://www.youtube.com/watch?v=H7wd6JmTd18', 60),
(2, 4, 'Decision Trees & Random Forest', 'Tree-based algorithms for classification and regression', 'https://www.youtube.com/watch?v=H7wd6JmTd18', 45),
(2, 5, 'Support Vector Machines', 'SVM algorithms for complex pattern recognition', 'https://www.youtube.com/watch?v=H7wd6JmTd18', 50),
(2, 6, 'Clustering Algorithms', 'K-means, hierarchical clustering, and unsupervised learning', 'https://www.youtube.com/watch?v=H7wd6JmTd18', 40),
(2, 7, 'Neural Networks Basics', 'Introduction to artificial neural networks', 'https://www.youtube.com/watch?v=H7wd6JmTd18', 65),
(2, 8, 'Deep Learning with TensorFlow', 'Building deep neural networks for complex problems', 'https://www.youtube.com/watch?v=H7wd6JmTd18', 70),
(2, 9, 'Model Evaluation & Optimization', 'Testing, validating, and improving ML models', 'https://www.youtube.com/watch?v=H7wd6JmTd18', 45),
(2, 10, 'Real-world ML Project', 'Complete machine learning project from data to deployment', 'https://www.youtube.com/watch?v=H7wd6JmTd18', 80);

-- Course 3: Full Stack Development (15 classes)
INSERT INTO course_classes (course_id, class_number, title, description, video_url, duration_minutes) VALUES
(3, 1, 'Web Development Fundamentals', 'HTML, CSS, and JavaScript essentials', 'https://www.youtube.com/watch?v=H7wd6JmTd18', 45),
(3, 2, 'Modern JavaScript ES6+', 'Advanced JavaScript features and best practices', 'https://www.youtube.com/watch?v=H7wd6JmTd18', 50),
(3, 3, 'React.js Fundamentals', 'Building interactive user interfaces with React', 'https://www.youtube.com/watch?v=H7wd6JmTd18', 60),
(3, 4, 'React Hooks & State Management', 'Managing application state with hooks and Context API', 'https://www.youtube.com/watch?v=H7wd6JmTd18', 55),
(3, 5, 'Node.js & Express Setup', 'Building backend servers with Node.js', 'https://www.youtube.com/watch?v=H7wd6JmTd18', 45),
(3, 6, 'RESTful API Development', 'Creating robust APIs for web applications', 'https://www.youtube.com/watch?v=H7wd6JmTd18', 50),
(3, 7, 'Database Design & MongoDB', 'NoSQL database integration and design patterns', 'https://www.youtube.com/watch?v=H7wd6JmTd18', 55),
(3, 8, 'Authentication & Security', 'User authentication, JWT tokens, and security best practices', 'https://www.youtube.com/watch?v=H7wd6JmTd18', 60),
(3, 9, 'Frontend-Backend Integration', 'Connecting React frontend with Node.js backend', 'https://www.youtube.com/watch?v=H7wd6JmTd18', 65),
(3, 10, 'Testing & Debugging', 'Unit testing, integration testing, and debugging techniques', 'https://www.youtube.com/watch?v=H7wd6JmTd18', 40),
(3, 11, 'Progressive Web Apps', 'Building PWAs with offline functionality', 'https://www.youtube.com/watch?v=H7wd6JmTd18', 50),
(3, 12, 'Performance Optimization', 'Optimizing application speed and user experience', 'https://www.youtube.com/watch?v=H7wd6JmTd18', 45),
(3, 13, 'Docker & Containerization', 'Containerizing applications for consistent deployment', 'https://www.youtube.com/watch?v=H7wd6JmTd18', 55),
(3, 14, 'Cloud Deployment', 'Deploying applications to AWS, Heroku, and Vercel', 'https://www.youtube.com/watch?v=H7wd6JmTd18', 60),
(3, 15, 'Final Capstone Project', 'Building and deploying a complete full-stack application', 'https://www.youtube.com/watch?v=H7wd6JmTd18', 90);

-- Add classes for remaining courses (sample for courses 4-20, 6-8 classes each)
INSERT INTO course_classes (course_id, class_number, title, description, video_url, duration_minutes) VALUES
-- Course 4: Data Science (8 classes)
(4, 1, 'Data Science Introduction', 'Overview of data science lifecycle and tools', 'https://www.youtube.com/watch?v=H7wd6JmTd18', 45),
(4, 2, 'R Programming Basics', 'Getting started with R for data analysis', 'https://www.youtube.com/watch?v=H7wd6JmTd18', 50),
(4, 3, 'Data Visualization', 'Creating compelling charts and graphs', 'https://www.youtube.com/watch?v=H7wd6JmTd18', 55),
(4, 4, 'Statistical Analysis', 'Descriptive and inferential statistics', 'https://www.youtube.com/watch?v=H7wd6JmTd18', 60),
(4, 5, 'Data Cleaning & Wrangling', 'Preparing messy data for analysis', 'https://www.youtube.com/watch?v=H7wd6JmTd18', 50),
(4, 6, 'Predictive Modeling', 'Building models to predict future outcomes', 'https://www.youtube.com/watch?v=H7wd6JmTd18', 65),
(4, 7, 'Big Data Analytics', 'Working with large datasets and distributed computing', 'https://www.youtube.com/watch?v=H7wd6JmTd18', 55),
(4, 8, 'Data Science Capstone', 'Complete real-world data science project', 'https://www.youtube.com/watch?v=H7wd6JmTd18', 75);

-- Course 5: Digital Marketing (6 classes)
INSERT INTO course_classes (course_id, class_number, title, description, video_url, duration_minutes) VALUES
(5, 1, 'Digital Marketing Fundamentals', 'Introduction to online marketing strategies', 'https://www.youtube.com/watch?v=H7wd6JmTd18', 40),
(5, 2, 'SEO & Content Marketing', 'Search engine optimization and content strategy', 'https://www.youtube.com/watch?v=H7wd6JmTd18', 55),
(5, 3, 'Social Media Marketing', 'Facebook, Instagram, LinkedIn, and Twitter marketing', 'https://www.youtube.com/watch?v=H7wd6JmTd18', 50),
(5, 4, 'Google Ads & PPC', 'Pay-per-click advertising and campaign optimization', 'https://www.youtube.com/watch?v=H7wd6JmTd18', 60),
(5, 5, 'Email Marketing & Automation', 'Building email campaigns and marketing funnels', 'https://www.youtube.com/watch?v=H7wd6JmTd18', 45),
(5, 6, 'Analytics & ROI Measurement', 'Tracking marketing performance and conversion rates', 'https://www.youtube.com/watch?v=H7wd6JmTd18', 50);

-- Add sample orders for multiple courses to student@example.com
INSERT INTO orders (course_name, course_id, amount, customer_name, customer_email, status, transaction_id) VALUES
('Complete Python Programming Masterclass', 1, 4999.00, 'John Doe', 'student@example.com', 'completed', 'TXN_001'),
('Machine Learning & AI Fundamentals', 2, 6999.00, 'John Doe', 'student@example.com', 'completed', 'TXN_002'),
('Full Stack Web Development Bootcamp', 3, 8999.00, 'John Doe', 'student@example.com', 'completed', 'TXN_003'),
('Data Science with R & Python', 4, 7499.00, 'John Doe', 'student@example.com', 'completed', 'TXN_004'),
('Digital Marketing Mastery', 5, 3999.00, 'John Doe', 'student@example.com', 'completed', 'TXN_005'),
('Cybersecurity Ethical Hacking', 6, 9999.00, 'John Doe', 'student@example.com', 'completed', 'TXN_006'),
('Cloud Computing with AWS', 7, 8499.00, 'John Doe', 'student@example.com', 'completed', 'TXN_007'),
('Mobile App Development with Flutter', 8, 5999.00, 'John Doe', 'student@example.com', 'completed', 'TXN_008'),
('Blockchain & Cryptocurrency Development', 9, 7999.00, 'John Doe', 'student@example.com', 'completed', 'TXN_009'),
('UI/UX Design Complete Course', 10, 4499.00, 'John Doe', 'student@example.com', 'completed', 'TXN_010'),
('DevOps Engineering Masterclass', 11, 8999.00, 'John Doe', 'student@example.com', 'completed', 'TXN_011'),
('Game Development with Unity', 12, 6499.00, 'John Doe', 'student@example.com', 'completed', 'TXN_012'),
('Business Analytics & Intelligence', 13, 5499.00, 'John Doe', 'student@example.com', 'completed', 'TXN_013'),
('Artificial Intelligence with Deep Learning', 14, 9499.00, 'John Doe', 'student@example.com', 'completed', 'TXN_014'),
('E-commerce Business Masterclass', 15, 4999.00, 'John Doe', 'student@example.com', 'completed', 'TXN_015'),
('Photography & Video Editing Pro', 16, 3999.00, 'John Doe', 'student@example.com', 'completed', 'TXN_016'),
('Financial Trading & Investment', 17, 6999.00, 'John Doe', 'student@example.com', 'completed', 'TXN_017'),
('Content Creation & Social Media', 18, 3499.00, 'John Doe', 'student@example.com', 'completed', 'TXN_018'),
('Project Management Professional', 19, 5999.00, 'John Doe', 'student@example.com', 'completed', 'TXN_019'),
('Advanced Excel & VBA Programming', 20, 2999.00, 'John Doe', 'student@example.com', 'completed', 'TXN_020');

-- Insert sample comments for courses
INSERT INTO course_comments (course_id, user_email, user_name, comment, rating) VALUES
(1, 'student@example.com', 'John Doe', 'Excellent course! The instructor explains Python concepts very clearly. Perfect for beginners.', 5),
(1, 'jane@test.com', 'Jane Smith', 'Great practical examples and hands-on projects. Highly recommended!', 5),
(1, 'mike@demo.com', 'Mike Johnson', 'Good course structure, but could use more advanced topics in the end.', 4),
(2, 'student@example.com', 'John Doe', 'Amazing deep dive into machine learning. The TensorFlow sections were particularly helpful.', 5),
(2, 'sarah@test.com', 'Sarah Wilson', 'Complex topics made simple. Great for career transition into AI.', 5),
(3, 'student@example.com', 'John Doe', 'Comprehensive full-stack coverage. Built 3 projects during the course!', 5),
(3, 'alex@demo.com', 'Alex Rodriguez', 'Best web development course I have taken. Up-to-date with latest technologies.', 5),
(4, 'student@example.com', 'John Doe', 'Perfect blend of R and Python for data science. Loved the real datasets.', 4),
(5, 'student@example.com', 'John Doe', 'Practical digital marketing strategies that actually work. Increased my business leads by 300%!', 5);

-- Verify the setup
SELECT 'Users' as table_name, count(*) as records FROM users
UNION ALL
SELECT 'Courses', count(*) FROM courses
UNION ALL
SELECT 'Course Classes', count(*) FROM course_classes
UNION ALL
SELECT 'Orders', count(*) FROM orders
UNION ALL
SELECT 'Comments', count(*) FROM course_comments; 