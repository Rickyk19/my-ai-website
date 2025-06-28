-- COMPREHENSIVE REAL-TIME TRACKING ACTIVATION
-- This sets up tracking for ALL courses, quizzes, pages, videos
-- Tables start EMPTY and populate automatically as real students use the system

-- Drop existing tracking tables to start fresh
DROP TABLE IF EXISTS student_interactions CASCADE;
DROP TABLE IF EXISTS student_daily_engagement CASCADE;
DROP TABLE IF EXISTS student_downloads CASCADE;
DROP TABLE IF EXISTS student_quiz_performance CASCADE;
DROP TABLE IF EXISTS student_course_activities CASCADE;
DROP TABLE IF EXISTS student_page_visits CASCADE;
DROP TABLE IF EXISTS student_sessions CASCADE;

-- 1. STUDENT SESSIONS - Login/Logout tracking for all students
CREATE TABLE student_sessions (
    session_id VARCHAR(50) PRIMARY KEY,
    student_email VARCHAR(255) NOT NULL,
    student_name VARCHAR(255) NULL,
    login_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    logout_time TIMESTAMP WITH TIME ZONE NULL,
    session_duration_minutes INTEGER NULL,
    device_type VARCHAR(50) DEFAULT 'Desktop',
    browser VARCHAR(100) DEFAULT 'Unknown',
    operating_system VARCHAR(100) DEFAULT 'Unknown',
    ip_address INET NULL,
    location_country VARCHAR(100) DEFAULT 'Unknown',
    location_city VARCHAR(100) DEFAULT 'Unknown',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. STUDENT PAGE VISITS - Track every page visit across the entire platform
CREATE TABLE student_page_visits (
    visit_id BIGSERIAL PRIMARY KEY,
    student_email VARCHAR(255) NOT NULL,
    session_id VARCHAR(50) REFERENCES student_sessions(session_id) ON DELETE CASCADE,
    page_path VARCHAR(500) NOT NULL,
    page_title VARCHAR(255) NULL,
    visit_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    exit_time TIMESTAMP WITH TIME ZONE NULL,
    time_spent_seconds INTEGER NULL,
    page_type VARCHAR(100) NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. STUDENT COURSE ACTIVITIES - Track ALL course interactions
CREATE TABLE student_course_activities (
    activity_id BIGSERIAL PRIMARY KEY,
    student_email VARCHAR(255) NOT NULL,
    session_id VARCHAR(50) REFERENCES student_sessions(session_id) ON DELETE CASCADE,
    course_id INTEGER NULL,
    course_name VARCHAR(255) NOT NULL,
    class_id INTEGER NULL,
    class_name VARCHAR(255) NULL,
    activity_type VARCHAR(100) NOT NULL,
    activity_details TEXT NULL,
    activity_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    time_spent_minutes INTEGER DEFAULT 0,
    progress_percentage INTEGER DEFAULT 0,
    video_position_seconds INTEGER NULL,
    completion_status VARCHAR(50) DEFAULT 'In Progress',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. STUDENT QUIZ PERFORMANCE - Track ALL quiz attempts and results
CREATE TABLE student_quiz_performance (
    performance_id BIGSERIAL PRIMARY KEY,
    student_email VARCHAR(255) NOT NULL,
    session_id VARCHAR(50) REFERENCES student_sessions(session_id) ON DELETE CASCADE,
    course_id INTEGER NULL,
    course_name VARCHAR(255) NOT NULL,
    quiz_id INTEGER NULL,
    quiz_name VARCHAR(255) NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_time TIMESTAMP WITH TIME ZONE NULL,
    time_taken_minutes INTEGER NULL,
    questions_total INTEGER NOT NULL,
    questions_attempted INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    wrong_answers INTEGER DEFAULT 0,
    score_percentage DECIMAL(5,2) DEFAULT 0.00,
    pass_status BOOLEAN DEFAULT FALSE,
    answers_json JSONB NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. STUDENT DOWNLOADS - Track ALL file downloads
CREATE TABLE student_downloads (
    download_id BIGSERIAL PRIMARY KEY,
    student_email VARCHAR(255) NOT NULL,
    session_id VARCHAR(50) REFERENCES student_sessions(session_id) ON DELETE CASCADE,
    course_id INTEGER NULL,
    course_name VARCHAR(255) NULL,
    class_id INTEGER NULL,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    download_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    download_status VARCHAR(50) DEFAULT 'Completed',
    download_source VARCHAR(100) NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. STUDENT DAILY ENGAGEMENT - Daily summary metrics (auto-calculated)
CREATE TABLE student_daily_engagement (
    engagement_id BIGSERIAL PRIMARY KEY,
    student_email VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    total_sessions INTEGER DEFAULT 0,
    total_time_minutes INTEGER DEFAULT 0,
    pages_visited INTEGER DEFAULT 0,
    courses_accessed INTEGER DEFAULT 0,
    videos_watched INTEGER DEFAULT 0,
    quizzes_completed INTEGER DEFAULT 0,
    files_downloaded INTEGER DEFAULT 0,
    engagement_score DECIMAL(5,2) DEFAULT 0.00,
    first_activity_time TIMESTAMP WITH TIME ZONE NULL,
    last_activity_time TIMESTAMP WITH TIME ZONE NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_email, date)
);

-- 7. STUDENT INTERACTIONS - Detailed click/scroll/interaction tracking
CREATE TABLE student_interactions (
    interaction_id BIGSERIAL PRIMARY KEY,
    student_email VARCHAR(255) NOT NULL,
    session_id VARCHAR(50) REFERENCES student_sessions(session_id) ON DELETE CASCADE,
    page_path VARCHAR(500) NOT NULL,
    interaction_type VARCHAR(100) NOT NULL,
    element_type VARCHAR(100) NULL,
    element_text VARCHAR(255) NULL,
    element_id VARCHAR(255) NULL,
    interaction_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    additional_data JSONB NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_student_sessions_email ON student_sessions(student_email);
CREATE INDEX idx_student_page_visits_email ON student_page_visits(student_email);
CREATE INDEX idx_student_course_activities_email ON student_course_activities(student_email);
CREATE INDEX idx_student_quiz_performance_email ON student_quiz_performance(student_email);
CREATE INDEX idx_student_downloads_email ON student_downloads(student_email);
CREATE INDEX idx_student_daily_engagement_email_date ON student_daily_engagement(student_email, date);
CREATE INDEX idx_student_interactions_email ON student_interactions(student_email);

-- Disable Row Level Security
ALTER TABLE student_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE student_page_visits DISABLE ROW LEVEL SECURITY;
ALTER TABLE student_course_activities DISABLE ROW LEVEL SECURITY;
ALTER TABLE student_quiz_performance DISABLE ROW LEVEL SECURITY;
ALTER TABLE student_downloads DISABLE ROW LEVEL SECURITY;
ALTER TABLE student_daily_engagement DISABLE ROW LEVEL SECURITY;
ALTER TABLE student_interactions DISABLE ROW LEVEL SECURITY;

-- Success message
SELECT 
    'COMPREHENSIVE REAL-TIME TRACKING ACTIVATED!' as status,
    'All tables created and ready for REAL student data' as message,
    'Tracking enabled for ALL courses, quizzes, pages, videos' as scope,
    'Tables are EMPTY - will populate automatically as students use the system' as note;
