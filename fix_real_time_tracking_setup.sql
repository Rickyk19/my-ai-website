-- Fix Real-Time Activity Tracking Setup
-- This fixes the duplicate key error by dropping existing tables first

-- Drop existing tables if they exist (in reverse dependency order)
DROP TABLE IF EXISTS student_interactions CASCADE;
DROP TABLE IF EXISTS student_daily_engagement CASCADE;
DROP TABLE IF EXISTS student_downloads CASCADE;
DROP TABLE IF EXISTS student_quiz_performance CASCADE;
DROP TABLE IF EXISTS student_course_activities CASCADE;
DROP TABLE IF EXISTS student_page_visits CASCADE;
DROP TABLE IF EXISTS student_sessions CASCADE;

-- 1. Student Sessions Table (Login/Logout tracking)
CREATE TABLE student_sessions (
    session_id VARCHAR(50) PRIMARY KEY,
    student_email VARCHAR(255) NOT NULL,
    login_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    logout_time TIMESTAMP WITH TIME ZONE NULL,
    session_duration_minutes INTEGER NULL,
    device_type VARCHAR(50) DEFAULT 'Desktop',
    browser VARCHAR(100) DEFAULT 'Unknown',
    operating_system VARCHAR(100) DEFAULT 'Unknown',
    ip_address INET NULL,
    location_country VARCHAR(100) DEFAULT 'Unknown',
    location_city VARCHAR(100) DEFAULT 'Unknown',
    location_coordinates POINT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Student Page Visits Table (Navigation tracking)
CREATE TABLE student_page_visits (
    visit_id BIGSERIAL PRIMARY KEY,
    student_email VARCHAR(255) NOT NULL,
    session_id VARCHAR(50) REFERENCES student_sessions(session_id) ON DELETE CASCADE,
    page_path VARCHAR(500) NOT NULL,
    page_title VARCHAR(255) NULL,
    visit_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    exit_time TIMESTAMP WITH TIME ZONE NULL,
    time_spent_seconds INTEGER NULL,
    referrer_page VARCHAR(500) NULL,
    scroll_depth_percentage INTEGER DEFAULT 0,
    interactions_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Student Course Activities Table (Course interaction tracking)
CREATE TABLE student_course_activities (
    activity_id BIGSERIAL PRIMARY KEY,
    student_email VARCHAR(255) NOT NULL,
    session_id VARCHAR(50) REFERENCES student_sessions(session_id) ON DELETE CASCADE,
    course_id INTEGER NULL,
    course_name VARCHAR(255) NOT NULL,
    class_id INTEGER NULL,
    class_name VARCHAR(255) NULL,
    activity_type VARCHAR(100) NOT NULL, -- 'Video Started', 'Video Paused', 'Video Completed', 'Material Downloaded', 'Quiz Started', etc.
    activity_details TEXT NULL,
    activity_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    time_spent_minutes INTEGER DEFAULT 0,
    progress_percentage INTEGER DEFAULT 0,
    video_position_seconds INTEGER NULL,
    completion_status VARCHAR(50) DEFAULT 'In Progress',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Student Quiz Performance Table (Quiz results tracking)
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
    answers_json JSONB NULL, -- Store detailed answers
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Student Downloads Table (File download tracking)
CREATE TABLE student_downloads (
    download_id BIGSERIAL PRIMARY KEY,
    student_email VARCHAR(255) NOT NULL,
    session_id VARCHAR(50) REFERENCES student_sessions(session_id) ON DELETE CASCADE,
    course_id INTEGER NULL,
    course_name VARCHAR(255) NULL,
    class_id INTEGER NULL,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL, -- 'PDF', 'Video', 'Audio', 'Document', etc.
    file_size_mb DECIMAL(10,2) NULL,
    download_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    download_status VARCHAR(50) DEFAULT 'Completed', -- 'Completed', 'Failed', 'Interrupted'
    download_source VARCHAR(100) NULL, -- 'Class Material', 'Certificate', 'Resource'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Student Daily Engagement Table (Daily summary metrics)
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
    interactions_count INTEGER DEFAULT 0,
    engagement_score DECIMAL(5,2) DEFAULT 0.00, -- Calculated engagement score
    first_activity_time TIMESTAMP WITH TIME ZONE NULL,
    last_activity_time TIMESTAMP WITH TIME ZONE NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_email, date)
);

-- 7. Student Interactions Table (Click/Scroll/Focus tracking)
CREATE TABLE student_interactions (
    interaction_id BIGSERIAL PRIMARY KEY,
    student_email VARCHAR(255) NOT NULL,
    session_id VARCHAR(50) REFERENCES student_sessions(session_id) ON DELETE CASCADE,
    page_path VARCHAR(500) NOT NULL,
    interaction_type VARCHAR(100) NOT NULL, -- 'Click', 'Scroll', 'Focus', 'Blur', 'Hover'
    element_type VARCHAR(100) NULL, -- 'Button', 'Link', 'Video', 'Form', etc.
    element_text VARCHAR(255) NULL,
    element_id VARCHAR(255) NULL,
    interaction_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    scroll_position INTEGER NULL,
    click_coordinates POINT NULL,
    additional_data JSONB NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_student_sessions_email ON student_sessions(student_email);
CREATE INDEX idx_student_sessions_login_time ON student_sessions(login_time);
CREATE INDEX idx_student_page_visits_email ON student_page_visits(student_email);
CREATE INDEX idx_student_page_visits_session ON student_page_visits(session_id);
CREATE INDEX idx_student_course_activities_email ON student_course_activities(student_email);
CREATE INDEX idx_student_course_activities_course ON student_course_activities(course_name);
CREATE INDEX idx_student_quiz_performance_email ON student_quiz_performance(student_email);
CREATE INDEX idx_student_downloads_email ON student_downloads(student_email);
CREATE INDEX idx_student_daily_engagement_email_date ON student_daily_engagement(student_email, date);
CREATE INDEX idx_student_interactions_email ON student_interactions(student_email);

-- Disable Row Level Security for testing
ALTER TABLE student_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE student_page_visits DISABLE ROW LEVEL SECURITY;
ALTER TABLE student_course_activities DISABLE ROW LEVEL SECURITY;
ALTER TABLE student_quiz_performance DISABLE ROW LEVEL SECURITY;
ALTER TABLE student_downloads DISABLE ROW LEVEL SECURITY;
ALTER TABLE student_daily_engagement DISABLE ROW LEVEL SECURITY;
ALTER TABLE student_interactions DISABLE ROW LEVEL SECURITY;

-- Insert sample data for testing with unique session ID
DO $$
DECLARE
    demo_session_id VARCHAR(50);
BEGIN
    -- Create unique session ID
    demo_session_id := 'session_' || extract(epoch from now())::bigint || '_' || floor(random() * 1000)::text;
    
    -- Sample Session for student@example.com
    INSERT INTO student_sessions (session_id, student_email, login_time, logout_time, session_duration_minutes, device_type, browser, operating_system, location_country, location_city, is_active) VALUES
    (demo_session_id, 'student@example.com', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '30 minutes', 90, 'Desktop', 'Chrome', 'Windows 10', 'India', 'Mumbai', false);
    
    -- Sample Page Visits
    INSERT INTO student_page_visits (student_email, session_id, page_path, page_title, visit_time, exit_time, time_spent_seconds) VALUES
    ('student@example.com', demo_session_id, '/members-dashboard', 'Members Dashboard', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '115 minutes', 300),
    ('student@example.com', demo_session_id, '/course/ai-fundamentals', 'AI Fundamentals Course', NOW() - INTERVAL '115 minutes', NOW() - INTERVAL '95 minutes', 1200),
    ('student@example.com', demo_session_id, '/class/introduction-to-ai', 'Introduction to AI', NOW() - INTERVAL '95 minutes', NOW() - INTERVAL '75 minutes', 1200),
    ('student@example.com', demo_session_id, '/quiz/ai-basics', 'AI Basics Quiz', NOW() - INTERVAL '75 minutes', NOW() - INTERVAL '60 minutes', 900);
    
    -- Sample Course Activities
    INSERT INTO student_course_activities (student_email, session_id, course_name, class_name, activity_type, activity_details, activity_time, time_spent_minutes, progress_percentage) VALUES
    ('student@example.com', demo_session_id, 'AI Fundamentals', 'Introduction to AI', 'Video Started', 'Started watching introduction video', NOW() - INTERVAL '95 minutes', 0, 0),
    ('student@example.com', demo_session_id, 'AI Fundamentals', 'Introduction to AI', 'Video Progress', 'Watched 50% of video', NOW() - INTERVAL '85 minutes', 10, 50),
    ('student@example.com', demo_session_id, 'AI Fundamentals', 'Introduction to AI', 'Video Completed', 'Completed introduction video', NOW() - INTERVAL '75 minutes', 20, 100),
    ('student@example.com', demo_session_id, 'AI Fundamentals', 'AI History', 'Material Downloaded', 'Downloaded AI timeline PDF', NOW() - INTERVAL '70 minutes', 0, 0);
    
    -- Sample Quiz Performance
    INSERT INTO student_quiz_performance (student_email, session_id, course_name, quiz_name, start_time, end_time, time_taken_minutes, questions_total, questions_attempted, correct_answers, wrong_answers, score_percentage, pass_status) VALUES
    ('student@example.com', demo_session_id, 'AI Fundamentals', 'AI Basics Quiz', NOW() - INTERVAL '75 minutes', NOW() - INTERVAL '60 minutes', 15, 10, 10, 8, 2, 80.00, true);
    
    -- Sample Downloads
    INSERT INTO student_downloads (student_email, session_id, course_name, file_name, file_type, download_time, download_status, download_source) VALUES
    ('student@example.com', demo_session_id, 'AI Fundamentals', 'AI_Timeline.pdf', 'PDF', NOW() - INTERVAL '70 minutes', 'Completed', 'Class Material'),
    ('student@example.com', demo_session_id, 'AI Fundamentals', 'Quiz_Certificate.pdf', 'PDF', NOW() - INTERVAL '55 minutes', 'Completed', 'Certificate');
    
    -- Sample Daily Engagement
    INSERT INTO student_daily_engagement (student_email, date, total_sessions, total_time_minutes, pages_visited, courses_accessed, videos_watched, quizzes_completed, files_downloaded, engagement_score, first_activity_time, last_activity_time) VALUES
    ('student@example.com', CURRENT_DATE, 1, 90, 4, 1, 1, 1, 2, 85.50, NOW() - INTERVAL '2 hours', NOW() - INTERVAL '30 minutes')
    ON CONFLICT (student_email, date) DO UPDATE SET
        total_sessions = EXCLUDED.total_sessions,
        total_time_minutes = EXCLUDED.total_time_minutes,
        pages_visited = EXCLUDED.pages_visited,
        courses_accessed = EXCLUDED.courses_accessed,
        videos_watched = EXCLUDED.videos_watched,
        quizzes_completed = EXCLUDED.quizzes_completed,
        files_downloaded = EXCLUDED.files_downloaded,
        engagement_score = EXCLUDED.engagement_score,
        last_activity_time = EXCLUDED.last_activity_time,
        updated_at = NOW();
END $$;

-- Success message
SELECT 'Real-time activity tracking tables created successfully!' as status,
       'Sample data inserted for student@example.com' as note,
       (SELECT COUNT(*) FROM student_sessions) as sessions_count,
       (SELECT COUNT(*) FROM student_course_activities) as activities_count,
       (SELECT COUNT(*) FROM student_quiz_performance) as quiz_count; 