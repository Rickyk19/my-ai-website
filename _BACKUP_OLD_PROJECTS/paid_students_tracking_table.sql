-- =============================================
-- PAID STUDENTS COMPREHENSIVE TRACKING SYSTEM
-- Tracks all activities, sessions, and behaviors of paid students only
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
