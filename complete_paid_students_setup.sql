-- =============================================
-- COMPLETE PAID STUDENTS TRACKING SETUP
-- Creates tables, sample data, and indexes for comprehensive paid student analytics
-- =============================================

-- 1. Paid Students Session Tracking Table
CREATE TABLE IF NOT EXISTS analytics_paid_students_sessions (
    id SERIAL PRIMARY KEY,
    student_email VARCHAR(255) NOT NULL,
    student_name VARCHAR(255),
    login_time TIMESTAMP WITH TIME ZONE NOT NULL,
    logout_time TIMESTAMP WITH TIME ZONE,
    session_duration_minutes INTEGER,
    device_type VARCHAR(50), -- desktop, mobile, tablet
    browser VARCHAR(100),
    operating_system VARCHAR(100),
    ip_address INET,
    location_country VARCHAR(100),
    location_city VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Paid Students Page Visits Tracking
CREATE TABLE IF NOT EXISTS analytics_paid_students_page_visits (
    id SERIAL PRIMARY KEY,
    session_id INTEGER REFERENCES analytics_paid_students_sessions(id),
    student_email VARCHAR(255) NOT NULL,
    page_url VARCHAR(500) NOT NULL,
    page_title VARCHAR(255),
    visit_time TIMESTAMP WITH TIME ZONE NOT NULL,
    time_spent_seconds INTEGER,
    referrer_url VARCHAR(500),
    is_course_page BOOLEAN DEFAULT false,
    course_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Paid Students Course Activities
CREATE TABLE IF NOT EXISTS analytics_paid_students_course_activities (
    id SERIAL PRIMARY KEY,
    session_id INTEGER REFERENCES analytics_paid_students_sessions(id),
    student_email VARCHAR(255) NOT NULL,
    course_id INTEGER,
    course_name VARCHAR(255) NOT NULL,
    activity_type VARCHAR(100), -- 'viewed', 'started', 'completed', 'downloaded', 'quiz_taken'
    activity_details TEXT,
    progress_percentage DECIMAL(5,2),
    time_spent_minutes INTEGER,
    activity_time TIMESTAMP WITH TIME ZONE NOT NULL,
    device_used VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Paid Students Quiz Performance
CREATE TABLE IF NOT EXISTS analytics_paid_students_quiz_performance (
    id SERIAL PRIMARY KEY,
    session_id INTEGER REFERENCES analytics_paid_students_sessions(id),
    student_email VARCHAR(255) NOT NULL,
    course_name VARCHAR(255) NOT NULL,
    quiz_name VARCHAR(255) NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    time_taken_minutes INTEGER,
    questions_total INTEGER,
    questions_answered INTEGER,
    correct_answers INTEGER,
    score_percentage DECIMAL(5,2),
    attempts_count INTEGER DEFAULT 1,
    device_used VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Paid Students Download Activities
CREATE TABLE IF NOT EXISTS analytics_paid_students_downloads (
    id SERIAL PRIMARY KEY,
    session_id INTEGER REFERENCES analytics_paid_students_sessions(id),
    student_email VARCHAR(255) NOT NULL,
    course_name VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(50), -- 'pdf', 'video', 'audio', 'document'
    file_size_mb DECIMAL(10,2),
    download_time TIMESTAMP WITH TIME ZONE NOT NULL,
    device_used VARCHAR(50),
    download_status VARCHAR(50) DEFAULT 'completed', -- 'completed', 'failed', 'cancelled'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Paid Students Engagement Metrics
CREATE TABLE IF NOT EXISTS analytics_paid_students_engagement (
    id SERIAL PRIMARY KEY,
    student_email VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    total_login_time_minutes INTEGER DEFAULT 0,
    pages_visited INTEGER DEFAULT 0,
    courses_accessed INTEGER DEFAULT 0,
    quizzes_taken INTEGER DEFAULT 0,
    downloads_count INTEGER DEFAULT 0,
    video_watch_time_minutes INTEGER DEFAULT 0,
    last_activity_time TIMESTAMP WITH TIME ZONE,
    engagement_score DECIMAL(5,2), -- calculated score based on activities
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_email, date)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_paid_students_sessions_email ON analytics_paid_students_sessions(student_email);
CREATE INDEX IF NOT EXISTS idx_paid_students_sessions_login_time ON analytics_paid_students_sessions(login_time);
CREATE INDEX IF NOT EXISTS idx_paid_students_page_visits_email ON analytics_paid_students_page_visits(student_email);
CREATE INDEX IF NOT EXISTS idx_paid_students_page_visits_time ON analytics_paid_students_page_visits(visit_time);
CREATE INDEX IF NOT EXISTS idx_paid_students_course_activities_email ON analytics_paid_students_course_activities(student_email);
CREATE INDEX IF NOT EXISTS idx_paid_students_quiz_performance_email ON analytics_paid_students_quiz_performance(student_email);
CREATE INDEX IF NOT EXISTS idx_paid_students_downloads_email ON analytics_paid_students_downloads(student_email);
CREATE INDEX IF NOT EXISTS idx_paid_students_engagement_email ON analytics_paid_students_engagement(student_email);
CREATE INDEX IF NOT EXISTS idx_paid_students_engagement_date ON analytics_paid_students_engagement(date);

-- Disable RLS for these tables (for testing)
ALTER TABLE analytics_paid_students_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_paid_students_page_visits DISABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_paid_students_course_activities DISABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_paid_students_quiz_performance DISABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_paid_students_downloads DISABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_paid_students_engagement DISABLE ROW LEVEL SECURITY;

-- =============================================
-- SAMPLE DATA INSERTION
-- =============================================

-- Sample Paid Students Sessions Data
INSERT INTO analytics_paid_students_sessions (
    student_email, student_name, login_time, logout_time, session_duration_minutes,
    device_type, browser, operating_system, ip_address, location_country, location_city, is_active
) VALUES
('john.smith@gmail.com', 'John Smith', '2025-06-26 09:15:00+00', '2025-06-26 11:30:00+00', 135, 'desktop', 'Chrome 131', 'Windows 11', '192.168.1.100', 'India', 'Mumbai', false),
('priya.patel@yahoo.com', 'Priya Patel', '2025-06-26 10:30:00+00', '2025-06-26 12:45:00+00', 135, 'mobile', 'Safari 17', 'iOS 17', '192.168.1.101', 'India', 'Delhi', false),
('mike.johnson@outlook.com', 'Mike Johnson', '2025-06-26 14:20:00+00', '2025-06-26 16:10:00+00', 110, 'desktop', 'Firefox 132', 'macOS 14', '192.168.1.102', 'United States', 'New York', false),
('sarah.wilson@gmail.com', 'Sarah Wilson', '2025-06-26 08:45:00+00', '2025-06-26 10:20:00+00', 95, 'tablet', 'Chrome 131', 'Android 14', '192.168.1.103', 'United Kingdom', 'London', false),
('raj.kumar@gmail.com', 'Raj Kumar', '2025-06-26 16:00:00+00', '2025-06-26 18:30:00+00', 150, 'desktop', 'Edge 131', 'Windows 11', '192.168.1.104', 'India', 'Bangalore', false),
('emily.davis@gmail.com', 'Emily Davis', '2025-06-26 11:15:00+00', '2025-06-26 13:00:00+00', 105, 'mobile', 'Chrome 131', 'Android 14', '192.168.1.105', 'Canada', 'Toronto', false),
('david.brown@yahoo.com', 'David Brown', '2025-06-26 19:30:00+00', NULL, NULL, 'desktop', 'Chrome 131', 'Windows 10', '192.168.1.106', 'Australia', 'Sydney', true),
('lisa.garcia@gmail.com', 'Lisa Garcia', '2025-06-26 07:00:00+00', '2025-06-26 09:30:00+00', 150, 'desktop', 'Safari 17', 'macOS 14', '192.168.1.107', 'United States', 'California', false)
ON CONFLICT DO NOTHING;

-- Sample Page Visits Data
INSERT INTO analytics_paid_students_page_visits (
    session_id, student_email, page_url, page_title, visit_time, time_spent_seconds, 
    referrer_url, is_course_page, course_name
) VALUES
(1, 'john.smith@gmail.com', '/members-dashboard', 'Members Dashboard', '2025-06-26 09:15:00+00', 120, '/members-login', false, NULL),
(1, 'john.smith@gmail.com', '/courses', 'Available Courses', '2025-06-26 09:17:00+00', 180, '/members-dashboard', false, NULL),
(1, 'john.smith@gmail.com', '/course/python-masterclass', 'Complete Python Programming Masterclass', '2025-06-26 09:20:00+00', 1800, '/courses', true, 'Complete Python Programming Masterclass'),
(1, 'john.smith@gmail.com', '/course/python-masterclass/class/1', 'Python Basics - Variables', '2025-06-26 09:50:00+00', 2400, '/course/python-masterclass', true, 'Complete Python Programming Masterclass'),
(2, 'priya.patel@yahoo.com', '/members-dashboard', 'Members Dashboard', '2025-06-26 10:30:00+00', 90, '/members-login', false, NULL),
(2, 'priya.patel@yahoo.com', '/course/ai-fundamentals', 'Machine Learning & AI Fundamentals', '2025-06-26 10:32:00+00', 2100, '/members-dashboard', true, 'Machine Learning & AI Fundamentals'),
(2, 'priya.patel@yahoo.com', '/course/ai-fundamentals/quiz/1', 'AI Basics Quiz', '2025-06-26 11:07:00+00', 900, '/course/ai-fundamentals', true, 'Machine Learning & AI Fundamentals'),
(3, 'mike.johnson@outlook.com', '/members-dashboard', 'Members Dashboard', '2025-06-26 14:20:00+00', 60, '/members-login', false, NULL),
(3, 'mike.johnson@outlook.com', '/course/web-development', 'Full Stack Web Development Bootcamp', '2025-06-26 14:21:00+00', 3600, '/members-dashboard', true, 'Full Stack Web Development Bootcamp'),
(4, 'sarah.wilson@gmail.com', '/course/data-science', 'Data Science with Python', '2025-06-26 08:45:00+00', 2700, '/members-dashboard', true, 'Data Science with Python')
ON CONFLICT DO NOTHING;

-- Sample Course Activities Data
INSERT INTO analytics_paid_students_course_activities (
    session_id, student_email, course_id, course_name, activity_type, activity_details,
    progress_percentage, time_spent_minutes, activity_time, device_used
) VALUES
(1, 'john.smith@gmail.com', 1, 'Complete Python Programming Masterclass', 'viewed', 'Watched Introduction to Python video', 15.5, 40, '2025-06-26 09:50:00+00', 'desktop'),
(1, 'john.smith@gmail.com', 1, 'Complete Python Programming Masterclass', 'quiz_taken', 'Completed Python Basics Quiz', 15.5, 15, '2025-06-26 10:30:00+00', 'desktop'),
(2, 'priya.patel@yahoo.com', 2, 'Machine Learning & AI Fundamentals', 'viewed', 'Watched AI Introduction video', 8.3, 35, '2025-06-26 10:32:00+00', 'mobile'),
(2, 'priya.patel@yahoo.com', 2, 'Machine Learning & AI Fundamentals', 'quiz_taken', 'Completed AI Basics Quiz', 8.3, 15, '2025-06-26 11:07:00+00', 'mobile'),
(3, 'mike.johnson@outlook.com', 3, 'Full Stack Web Development Bootcamp', 'viewed', 'Watched HTML Fundamentals', 12.0, 60, '2025-06-26 14:21:00+00', 'desktop'),
(4, 'sarah.wilson@gmail.com', 4, 'Data Science with Python', 'viewed', 'Watched Data Analysis Basics', 25.0, 45, '2025-06-26 08:45:00+00', 'tablet'),
(5, 'raj.kumar@gmail.com', 1, 'Complete Python Programming Masterclass', 'viewed', 'Watched Advanced Python Concepts', 45.2, 90, '2025-06-26 16:00:00+00', 'desktop'),
(6, 'emily.davis@gmail.com', 2, 'Machine Learning & AI Fundamentals', 'completed', 'Completed entire course', 100.0, 105, '2025-06-26 11:15:00+00', 'mobile')
ON CONFLICT DO NOTHING;

-- Sample Quiz Performance Data
INSERT INTO analytics_paid_students_quiz_performance (
    session_id, student_email, course_name, quiz_name, start_time, end_time,
    time_taken_minutes, questions_total, questions_answered, correct_answers,
    score_percentage, attempts_count, device_used
) VALUES
(1, 'john.smith@gmail.com', 'Complete Python Programming Masterclass', 'Python Basics Quiz', '2025-06-26 10:30:00+00', '2025-06-26 10:45:00+00', 15, 10, 10, 8, 80.0, 1, 'desktop'),
(2, 'priya.patel@yahoo.com', 'Machine Learning & AI Fundamentals', 'AI Basics Quiz', '2025-06-26 11:07:00+00', '2025-06-26 11:22:00+00', 15, 12, 12, 10, 83.3, 1, 'mobile'),
(3, 'mike.johnson@outlook.com', 'Full Stack Web Development Bootcamp', 'HTML Quiz', '2025-06-26 15:20:00+00', '2025-06-26 15:35:00+00', 15, 8, 8, 7, 87.5, 1, 'desktop'),
(4, 'sarah.wilson@gmail.com', 'Data Science with Python', 'Data Analysis Quiz', '2025-06-26 09:30:00+00', '2025-06-26 09:50:00+00', 20, 15, 15, 12, 80.0, 1, 'tablet'),
(5, 'raj.kumar@gmail.com', 'Complete Python Programming Masterclass', 'Advanced Python Quiz', '2025-06-26 17:30:00+00', '2025-06-26 17:50:00+00', 20, 12, 12, 11, 91.7, 1, 'desktop'),
(6, 'emily.davis@gmail.com', 'Machine Learning & AI Fundamentals', 'Final Assessment', '2025-06-26 12:30:00+00', '2025-06-26 12:55:00+00', 25, 20, 20, 18, 90.0, 1, 'mobile')
ON CONFLICT DO NOTHING;

-- Sample Downloads Data
INSERT INTO analytics_paid_students_downloads (
    session_id, student_email, course_name, file_name, file_type,
    file_size_mb, download_time, device_used, download_status
) VALUES
(1, 'john.smith@gmail.com', 'Complete Python Programming Masterclass', 'Python_Cheat_Sheet.pdf', 'pdf', 2.5, '2025-06-26 10:15:00+00', 'desktop', 'completed'),
(1, 'john.smith@gmail.com', 'Complete Python Programming Masterclass', 'Python_Variables_Video.mp4', 'video', 150.2, '2025-06-26 10:50:00+00', 'desktop', 'completed'),
(2, 'priya.patel@yahoo.com', 'Machine Learning & AI Fundamentals', 'AI_Fundamentals_Notes.pdf', 'pdf', 3.8, '2025-06-26 10:45:00+00', 'mobile', 'completed'),
(3, 'mike.johnson@outlook.com', 'Full Stack Web Development Bootcamp', 'HTML_CSS_Guide.pdf', 'pdf', 4.2, '2025-06-26 14:45:00+00', 'desktop', 'completed'),
(4, 'sarah.wilson@gmail.com', 'Data Science with Python', 'Data_Analysis_Dataset.csv', 'document', 1.2, '2025-06-26 09:15:00+00', 'tablet', 'completed'),
(5, 'raj.kumar@gmail.com', 'Complete Python Programming Masterclass', 'Advanced_Python_Examples.zip', 'document', 8.5, '2025-06-26 16:45:00+00', 'desktop', 'completed'),
(6, 'emily.davis@gmail.com', 'Machine Learning & AI Fundamentals', 'Course_Completion_Certificate.pdf', 'pdf', 0.8, '2025-06-26 13:00:00+00', 'mobile', 'completed')
ON CONFLICT DO NOTHING;

-- Sample Daily Engagement Metrics
INSERT INTO analytics_paid_students_engagement (
    student_email, date, total_login_time_minutes, pages_visited, courses_accessed,
    quizzes_taken, downloads_count, video_watch_time_minutes, last_activity_time, engagement_score
) VALUES
('john.smith@gmail.com', '2025-06-26', 135, 4, 1, 1, 2, 40, '2025-06-26 11:30:00+00', 85.5),
('priya.patel@yahoo.com', '2025-06-26', 135, 3, 1, 1, 1, 35, '2025-06-26 12:45:00+00', 78.2),
('mike.johnson@outlook.com', '2025-06-26', 110, 2, 1, 1, 1, 60, '2025-06-26 16:10:00+00', 72.1),
('sarah.wilson@gmail.com', '2025-06-26', 95, 1, 1, 1, 1, 45, '2025-06-26 10:20:00+00', 68.8),
('raj.kumar@gmail.com', '2025-06-26', 150, 1, 1, 1, 1, 90, '2025-06-26 18:30:00+00', 92.3),
('emily.davis@gmail.com', '2025-06-26', 105, 1, 1, 1, 1, 105, '2025-06-26 13:00:00+00', 95.7),
('david.brown@yahoo.com', '2025-06-26', 0, 0, 0, 0, 0, 0, '2025-06-26 19:30:00+00', 15.2),
('lisa.garcia@gmail.com', '2025-06-26', 150, 2, 1, 0, 0, 80, '2025-06-26 09:30:00+00', 73.4)
ON CONFLICT DO NOTHING; 