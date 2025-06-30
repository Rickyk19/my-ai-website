-- =============================================
-- REAL-TIME ACTIVITY TRACKING SETUP
-- Creates tables to capture every student action in real-time
-- =============================================

-- 1. Real-time student sessions (enhanced)
CREATE TABLE IF NOT EXISTS student_sessions (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(100) UNIQUE NOT NULL,
  student_email VARCHAR(255) NOT NULL,
  student_name VARCHAR(255) NOT NULL,
  login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  logout_time TIMESTAMP NULL,
  session_duration_minutes INTEGER NULL,
  device_type VARCHAR(50) NOT NULL, -- desktop, mobile, tablet
  browser VARCHAR(100) NOT NULL,
  operating_system VARCHAR(100) NOT NULL,
  ip_address VARCHAR(45) NOT NULL,
  location_city VARCHAR(100),
  location_country VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  total_activities INTEGER DEFAULT 0,
  pages_visited INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Real-time page visits and navigation
CREATE TABLE IF NOT EXISTS student_page_visits (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(100) NOT NULL,
  student_email VARCHAR(255) NOT NULL,
  page_url TEXT NOT NULL,
  page_title VARCHAR(255) NOT NULL,
  visit_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  time_spent_seconds INTEGER DEFAULT 0,
  referrer_url TEXT,
  is_course_page BOOLEAN DEFAULT false,
  course_name VARCHAR(255),
  scroll_percentage INTEGER DEFAULT 0,
  clicks_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Real-time course activities
CREATE TABLE IF NOT EXISTS student_course_activities (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(100) NOT NULL,
  student_email VARCHAR(255) NOT NULL,
  course_name VARCHAR(255) NOT NULL,
  activity_type VARCHAR(100) NOT NULL, -- video_start, video_pause, video_complete, course_opened, etc.
  activity_details TEXT NOT NULL,
  activity_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  time_spent_minutes INTEGER DEFAULT 0,
  progress_percentage INTEGER DEFAULT 0,
  metadata JSONB, -- additional activity-specific data
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Real-time quiz performance tracking
CREATE TABLE IF NOT EXISTS student_quiz_performance (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(100) NOT NULL,
  student_email VARCHAR(255) NOT NULL,
  course_name VARCHAR(255) NOT NULL,
  quiz_name VARCHAR(255) NOT NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  score_percentage INTEGER NOT NULL,
  questions_total INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  time_taken_minutes INTEGER NOT NULL,
  answers_data JSONB, -- stores all selected answers
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Real-time download tracking
CREATE TABLE IF NOT EXISTS student_downloads (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(100) NOT NULL,
  student_email VARCHAR(255) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(50) NOT NULL, -- pdf, video, certificate, etc.
  file_size_mb DECIMAL(10,2),
  course_name VARCHAR(255),
  download_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  download_status VARCHAR(50) DEFAULT 'completed', -- completed, failed, partial
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Real-time engagement metrics (daily aggregates)
CREATE TABLE IF NOT EXISTS student_daily_engagement (
  id SERIAL PRIMARY KEY,
  student_email VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  total_login_time_minutes INTEGER DEFAULT 0,
  pages_visited INTEGER DEFAULT 0,
  courses_accessed INTEGER DEFAULT 0,
  quizzes_taken INTEGER DEFAULT 0,
  downloads_count INTEGER DEFAULT 0,
  video_time_minutes INTEGER DEFAULT 0,
  engagement_score INTEGER DEFAULT 0, -- calculated score 0-100
  first_activity TIMESTAMP,
  last_activity TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(student_email, date)
);

-- 7. Real-time interaction events (clicks, scrolls, etc.)
CREATE TABLE IF NOT EXISTS student_interactions (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(100) NOT NULL,
  student_email VARCHAR(255) NOT NULL,
  interaction_type VARCHAR(50) NOT NULL, -- click, scroll, hover, focus, etc.
  element_type VARCHAR(100), -- button, link, video, quiz, etc.
  element_details TEXT,
  page_url TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  coordinates_x INTEGER,
  coordinates_y INTEGER,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_student_sessions_email ON student_sessions(student_email);
CREATE INDEX IF NOT EXISTS idx_student_sessions_active ON student_sessions(is_active);
CREATE INDEX IF NOT EXISTS idx_student_sessions_login_time ON student_sessions(login_time);

CREATE INDEX IF NOT EXISTS idx_page_visits_email ON student_page_visits(student_email);
CREATE INDEX IF NOT EXISTS idx_page_visits_course ON student_page_visits(course_name);
CREATE INDEX IF NOT EXISTS idx_page_visits_time ON student_page_visits(visit_time);

CREATE INDEX IF NOT EXISTS idx_course_activities_email ON student_course_activities(student_email);
CREATE INDEX IF NOT EXISTS idx_course_activities_course ON student_course_activities(course_name);
CREATE INDEX IF NOT EXISTS idx_course_activities_type ON student_course_activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_course_activities_time ON student_course_activities(activity_time);

CREATE INDEX IF NOT EXISTS idx_quiz_performance_email ON student_quiz_performance(student_email);
CREATE INDEX IF NOT EXISTS idx_quiz_performance_course ON student_quiz_performance(course_name);
CREATE INDEX IF NOT EXISTS idx_quiz_performance_start ON student_quiz_performance(start_time);

CREATE INDEX IF NOT EXISTS idx_downloads_email ON student_downloads(student_email);
CREATE INDEX IF NOT EXISTS idx_downloads_course ON student_downloads(course_name);
CREATE INDEX IF NOT EXISTS idx_downloads_time ON student_downloads(download_time);

CREATE INDEX IF NOT EXISTS idx_daily_engagement_email ON student_daily_engagement(student_email);
CREATE INDEX IF NOT EXISTS idx_daily_engagement_date ON student_daily_engagement(date);

CREATE INDEX IF NOT EXISTS idx_interactions_email ON student_interactions(student_email);
CREATE INDEX IF NOT EXISTS idx_interactions_type ON student_interactions(interaction_type);
CREATE INDEX IF NOT EXISTS idx_interactions_time ON student_interactions(timestamp);

-- Disable Row Level Security for testing
ALTER TABLE student_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE student_page_visits DISABLE ROW LEVEL SECURITY;
ALTER TABLE student_course_activities DISABLE ROW LEVEL SECURITY;
ALTER TABLE student_quiz_performance DISABLE ROW LEVEL SECURITY;
ALTER TABLE student_downloads DISABLE ROW LEVEL SECURITY;
ALTER TABLE student_daily_engagement DISABLE ROW LEVEL SECURITY;
ALTER TABLE student_interactions DISABLE ROW LEVEL SECURITY;

-- Insert sample real-time tracking data for student@example.com
INSERT INTO student_sessions (
  session_id, student_email, student_name, login_time, device_type, browser, 
  operating_system, ip_address, location_city, location_country, is_active, total_activities
) VALUES 
('session_1735217293_abc123', 'student@example.com', 'John Doe', NOW() - INTERVAL '2 hours', 
 'desktop', 'Chrome 131', 'Windows 10', '192.168.1.100', 'New York', 'United States', false, 45),
('session_1735217293_def456', 'student@example.com', 'John Doe', NOW() - INTERVAL '1 hour', 
 'mobile', 'Chrome Mobile 131', 'Android 12', '192.168.1.101', 'New York', 'United States', true, 23);

-- Insert sample page visits
INSERT INTO student_page_visits (
  session_id, student_email, page_url, page_title, visit_time, time_spent_seconds, 
  is_course_page, course_name, scroll_percentage, clicks_count
) VALUES 
('session_1735217293_abc123', 'student@example.com', '/members-dashboard', 'Members Dashboard', 
 NOW() - INTERVAL '2 hours', 120, false, NULL, 100, 5),
('session_1735217293_abc123', 'student@example.com', '/course/1/class/1', 'Python Basics & Setup', 
 NOW() - INTERVAL '90 minutes', 1800, true, 'Complete Python Programming Masterclass', 85, 12),
('session_1735217293_abc123', 'student@example.com', '/course/1/class/1/quiz', 'Python Basics Quiz', 
 NOW() - INTERVAL '30 minutes', 600, true, 'Complete Python Programming Masterclass', 100, 8);

-- Insert sample course activities
INSERT INTO student_course_activities (
  session_id, student_email, course_name, activity_type, activity_details, 
  activity_time, time_spent_minutes, progress_percentage
) VALUES 
('session_1735217293_abc123', 'student@example.com', 'Complete Python Programming Masterclass', 
 'Course Opened', 'Opened course details for Complete Python Programming Masterclass', 
 NOW() - INTERVAL '2 hours', 2, 0),
('session_1735217293_abc123', 'student@example.com', 'Complete Python Programming Masterclass', 
 'Video Started', 'Started watching: Python Basics & Setup', NOW() - INTERVAL '90 minutes', 30, 25),
('session_1735217293_abc123', 'student@example.com', 'Complete Python Programming Masterclass', 
 'Video Completed', 'Completed watching: Python Basics & Setup', NOW() - INTERVAL '60 minutes', 45, 50);

-- Insert sample quiz performance
INSERT INTO student_quiz_performance (
  session_id, student_email, course_name, quiz_name, start_time, end_time, 
  score_percentage, questions_total, correct_answers, time_taken_minutes
) VALUES 
('session_1735217293_abc123', 'student@example.com', 'Complete Python Programming Masterclass', 
 'Python Basics & Setup Quiz', NOW() - INTERVAL '40 minutes', NOW() - INTERVAL '30 minutes', 
 85, 8, 7, 10);

-- Insert sample downloads
INSERT INTO student_downloads (
  session_id, student_email, file_name, file_type, file_size_mb, course_name, 
  download_time, download_status
) VALUES 
('session_1735217293_abc123', 'student@example.com', 'Python Installation Guide.pdf', 'pdf', 2.5, 
 'Complete Python Programming Masterclass', NOW() - INTERVAL '2 hours', 'completed'),
('session_1735217293_abc123', 'student@example.com', 'Complete Python Programming Masterclass-certificate.pdf', 
 'certificate', 1.2, 'Complete Python Programming Masterclass', NOW() - INTERVAL '15 minutes', 'completed');

-- Insert sample daily engagement
INSERT INTO student_daily_engagement (
  student_email, date, total_login_time_minutes, pages_visited, courses_accessed, 
  quizzes_taken, downloads_count, video_time_minutes, engagement_score, 
  first_activity, last_activity
) VALUES 
('student@example.com', CURRENT_DATE, 125, 15, 3, 2, 5, 75, 85, 
 NOW() - INTERVAL '2 hours', NOW() - INTERVAL '10 minutes');

-- Insert sample interactions
INSERT INTO student_interactions (
  session_id, student_email, interaction_type, element_type, element_details, 
  page_url, timestamp
) VALUES 
('session_1735217293_abc123', 'student@example.com', 'click', 'button', 'Start Quiz', 
 '/course/1/class/1/quiz', NOW() - INTERVAL '40 minutes'),
('session_1735217293_abc123', 'student@example.com', 'click', 'video', 'Play Video', 
 '/course/1/class/1', NOW() - INTERVAL '90 minutes'),
('session_1735217293_abc123', 'student@example.com', 'scroll', 'page', 'Scrolled to 85%', 
 '/course/1/class/1', NOW() - INTERVAL '85 minutes');

-- Verification queries
SELECT 'Real-time Sessions' as table_name, count(*) as records FROM student_sessions
UNION ALL
SELECT 'Page Visits', count(*) FROM student_page_visits
UNION ALL
SELECT 'Course Activities', count(*) FROM student_course_activities
UNION ALL
SELECT 'Quiz Performance', count(*) FROM student_quiz_performance
UNION ALL
SELECT 'Downloads', count(*) FROM student_downloads
UNION ALL
SELECT 'Daily Engagement', count(*) FROM student_daily_engagement
UNION ALL
SELECT 'Interactions', count(*) FROM student_interactions;

-- Show sample data for student@example.com
SELECT 'Recent Activities for student@example.com:' as info;
SELECT activity_type, activity_details, activity_time 
FROM student_course_activities 
WHERE student_email = 'student@example.com' 
ORDER BY activity_time DESC LIMIT 5; 
