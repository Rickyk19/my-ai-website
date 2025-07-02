-- =============================================
-- COMPREHENSIVE STUDENT ACTIVITY TRACKING SYSTEM
-- This creates a complete tracking system for ALL student activities
-- Data is stored permanently and never deleted (6+ months retention)
-- =============================================

-- Drop existing tables if they exist to recreate with better structure
DROP TABLE IF EXISTS student_interactions CASCADE;
DROP TABLE IF EXISTS student_downloads CASCADE;
DROP TABLE IF EXISTS student_quiz_performance CASCADE;
DROP TABLE IF EXISTS student_course_activities CASCADE;
DROP TABLE IF EXISTS student_page_visits CASCADE;
DROP TABLE IF EXISTS student_sessions CASCADE;
DROP TABLE IF EXISTS student_daily_engagement CASCADE;

-- ===================
-- 1. STUDENT SESSIONS TABLE (Main tracking table)
-- ===================
CREATE TABLE student_sessions (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255) UNIQUE NOT NULL,
    student_email VARCHAR(255) NOT NULL,
    student_name VARCHAR(255),
    login_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    logout_time TIMESTAMP WITH TIME ZONE,
    session_duration_minutes INTEGER DEFAULT 0,
    device_type VARCHAR(50),
    browser VARCHAR(100),
    operating_system VARCHAR(100),
    ip_address INET,
    location_country VARCHAR(100),
    location_city VARCHAR(100),
    user_agent TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================
-- 2. PAGE VISITS TABLE (Track every page visited)
-- ===================
CREATE TABLE student_page_visits (
    id SERIAL PRIMARY KEY,
    student_email VARCHAR(255) NOT NULL,
    session_id VARCHAR(255) REFERENCES student_sessions(session_id),
    page_path VARCHAR(500) NOT NULL,
    page_title VARCHAR(255),
    page_type VARCHAR(100), -- 'course', 'quiz', 'dashboard', 'general'
    visit_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    exit_time TIMESTAMP WITH TIME ZONE,
    time_spent_seconds INTEGER DEFAULT 0,
    referrer_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================
-- 3. COURSE ACTIVITIES TABLE (All course-related actions)
-- ===================
CREATE TABLE student_course_activities (
    id SERIAL PRIMARY KEY,
    student_email VARCHAR(255) NOT NULL,
    session_id VARCHAR(255) REFERENCES student_sessions(session_id),
    course_id INTEGER,
    course_name VARCHAR(255) NOT NULL,
    class_id INTEGER,
    class_name VARCHAR(255),
    activity_type VARCHAR(100) NOT NULL, -- 'video_start', 'video_pause', 'video_complete', 'class_start', 'class_complete', 'download', 'quiz_start'
    activity_details TEXT,
    activity_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    time_spent_minutes INTEGER DEFAULT 0,
    progress_percentage DECIMAL(5,2) DEFAULT 0,
    video_position_seconds INTEGER,
    completion_status VARCHAR(50) DEFAULT 'In Progress',
    metadata JSONB, -- Store additional data like video quality, playback speed, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================
-- 4. QUIZ PERFORMANCE TABLE (Detailed quiz tracking)
-- ===================
CREATE TABLE student_quiz_performance (
    id SERIAL PRIMARY KEY,
    student_email VARCHAR(255) NOT NULL,
    session_id VARCHAR(255) REFERENCES student_sessions(session_id),
    course_id INTEGER,
    course_name VARCHAR(255) NOT NULL,
    quiz_id INTEGER,
    quiz_name VARCHAR(255) NOT NULL,
    attempt_number INTEGER DEFAULT 1,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    end_time TIMESTAMP WITH TIME ZONE,
    time_taken_minutes INTEGER DEFAULT 0,
    questions_total INTEGER NOT NULL,
    questions_attempted INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    wrong_answers INTEGER DEFAULT 0,
    score_percentage DECIMAL(5,2) DEFAULT 0,
    pass_status BOOLEAN DEFAULT false,
    answers_json JSONB, -- Store complete answers data
    weak_areas TEXT[], -- Array of topics where student struggled
    time_per_question JSONB, -- Track time spent on each question
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================
-- 5. DOWNLOADS TABLE (Track all file downloads)
-- ===================
CREATE TABLE student_downloads (
    id SERIAL PRIMARY KEY,
    student_email VARCHAR(255) NOT NULL,
    session_id VARCHAR(255) REFERENCES student_sessions(session_id),
    course_id INTEGER,
    course_name VARCHAR(255),
    class_id INTEGER,
    class_name VARCHAR(255),
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(50), -- 'pdf', 'video', 'image', 'document'
    file_size_mb DECIMAL(10,2),
    download_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    download_status VARCHAR(50) DEFAULT 'Completed', -- 'Started', 'Completed', 'Failed'
    download_source VARCHAR(100), -- 'Class Material', 'Certificate', 'Resources'
    download_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================
-- 6. STUDENT INTERACTIONS TABLE (Clicks, scrolls, etc.)
-- ===================
CREATE TABLE student_interactions (
    id SERIAL PRIMARY KEY,
    student_email VARCHAR(255) NOT NULL,
    session_id VARCHAR(255) REFERENCES student_sessions(session_id),
    interaction_type VARCHAR(100) NOT NULL, -- 'click', 'scroll', 'hover', 'focus', 'submit'
    element_type VARCHAR(100), -- 'button', 'link', 'video', 'form', 'menu'
    element_text VARCHAR(255),
    element_id VARCHAR(255),
    page_path VARCHAR(500),
    interaction_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    position_x INTEGER,
    position_y INTEGER,
    scroll_percentage DECIMAL(5,2),
    additional_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================
-- 7. DAILY ENGAGEMENT SUMMARY TABLE (Aggregated daily stats)
-- ===================
CREATE TABLE student_daily_engagement (
    id SERIAL PRIMARY KEY,
    student_email VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    total_sessions INTEGER DEFAULT 0,
    total_login_time_minutes INTEGER DEFAULT 0,
    pages_visited INTEGER DEFAULT 0,
    courses_accessed INTEGER DEFAULT 0,
    classes_completed INTEGER DEFAULT 0,
    quizzes_taken INTEGER DEFAULT 0,
    quizzes_passed INTEGER DEFAULT 0,
    average_quiz_score DECIMAL(5,2) DEFAULT 0,
    downloads_count INTEGER DEFAULT 0,
    interactions_count INTEGER DEFAULT 0,
    engagement_score DECIMAL(5,2) DEFAULT 0, -- Calculated engagement score
    first_activity_time TIMESTAMP WITH TIME ZONE,
    last_activity_time TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_email, date)
);

-- ===================
-- INDEXES FOR PERFORMANCE
-- ===================
CREATE INDEX idx_sessions_email ON student_sessions(student_email);
CREATE INDEX idx_sessions_login_time ON student_sessions(login_time);
CREATE INDEX idx_sessions_active ON student_sessions(is_active);

CREATE INDEX idx_page_visits_email ON student_page_visits(student_email);
CREATE INDEX idx_page_visits_time ON student_page_visits(visit_time);
CREATE INDEX idx_page_visits_session ON student_page_visits(session_id);

CREATE INDEX idx_course_activities_email ON student_course_activities(student_email);
CREATE INDEX idx_course_activities_course ON student_course_activities(course_name);
CREATE INDEX idx_course_activities_time ON student_course_activities(activity_time);

CREATE INDEX idx_quiz_performance_email ON student_quiz_performance(student_email);
CREATE INDEX idx_quiz_performance_course ON student_quiz_performance(course_name);
CREATE INDEX idx_quiz_performance_time ON student_quiz_performance(start_time);

CREATE INDEX idx_downloads_email ON student_downloads(student_email);
CREATE INDEX idx_downloads_time ON student_downloads(download_time);

CREATE INDEX idx_interactions_email ON student_interactions(student_email);
CREATE INDEX idx_interactions_time ON student_interactions(interaction_time);

CREATE INDEX idx_daily_engagement_email ON student_daily_engagement(student_email);
CREATE INDEX idx_daily_engagement_date ON student_daily_engagement(date);

-- ===================
-- DISABLE ROW LEVEL SECURITY (For analytics access)
-- ===================
ALTER TABLE student_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE student_page_visits DISABLE ROW LEVEL SECURITY;
ALTER TABLE student_course_activities DISABLE ROW LEVEL SECURITY;
ALTER TABLE student_quiz_performance DISABLE ROW LEVEL SECURITY;
ALTER TABLE student_downloads DISABLE ROW LEVEL SECURITY;
ALTER TABLE student_interactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE student_daily_engagement DISABLE ROW LEVEL SECURITY;

-- ===================
-- SAMPLE DATA FOR student@example.com (Yesterday's Activity)
-- ===================

-- Insert yesterday's session data
INSERT INTO student_sessions (
    session_id, student_email, student_name, login_time, logout_time, 
    session_duration_minutes, device_type, browser, operating_system, 
    location_country, location_city, is_active
) VALUES (
    'session_yesterday_20241226',
    'student@example.com',
    'John Doe',
    NOW() - INTERVAL '1 day' + INTERVAL '10 hours',
    NOW() - INTERVAL '1 day' + INTERVAL '12 hours',
    120,
    'Desktop',
    'Chrome',
    'Windows 10',
    'India',
    'Mumbai',
    false
);

-- Get the session ID for reference
DO $$
DECLARE
    yesterday_session_id VARCHAR(255);
BEGIN
    SELECT session_id INTO yesterday_session_id 
    FROM student_sessions 
    WHERE student_email = 'student@example.com' 
    ORDER BY login_time DESC LIMIT 1;

    -- Page visits from yesterday
    INSERT INTO student_page_visits (student_email, session_id, page_path, page_title, page_type, visit_time, exit_time, time_spent_seconds) VALUES
    ('student@example.com', yesterday_session_id, '/members-dashboard', 'Members Dashboard', 'dashboard', NOW() - INTERVAL '1 day' + INTERVAL '10 hours', NOW() - INTERVAL '1 day' + INTERVAL '10 hours 5 minutes', 300),
    ('student@example.com', yesterday_session_id, '/course/1', 'Complete Python Programming Masterclass', 'course', NOW() - INTERVAL '1 day' + INTERVAL '10 hours 5 minutes', NOW() - INTERVAL '1 day' + INTERVAL '10 hours 30 minutes', 1500),
    ('student@example.com', yesterday_session_id, '/course/1/class/1', 'Python Basics & Setup', 'class', NOW() - INTERVAL '1 day' + INTERVAL '10 hours 30 minutes', NOW() - INTERVAL '1 day' + INTERVAL '11 hours', 1800),
    ('student@example.com', yesterday_session_id, '/course/1/class/1/quiz', 'Python Basics Quiz', 'quiz', NOW() - INTERVAL '1 day' + INTERVAL '11 hours', NOW() - INTERVAL '1 day' + INTERVAL '11 hours 15 minutes', 900),
    ('student@example.com', yesterday_session_id, '/course/2', 'Machine Learning & AI Fundamentals', 'course', NOW() - INTERVAL '1 day' + INTERVAL '11 hours 15 minutes', NOW() - INTERVAL '1 day' + INTERVAL '11 hours 45 minutes', 1800),
    ('student@example.com', yesterday_session_id, '/course/2/class/1/quiz', 'AI Basics Quiz', 'quiz', NOW() - INTERVAL '1 day' + INTERVAL '11 hours 45 minutes', NOW() - INTERVAL '1 day' + INTERVAL '12 hours', 900);

    -- Course activities from yesterday
    INSERT INTO student_course_activities (student_email, session_id, course_id, course_name, class_id, class_name, activity_type, activity_details, activity_time, time_spent_minutes, progress_percentage) VALUES
    ('student@example.com', yesterday_session_id, 1, 'Complete Python Programming Masterclass', 1, 'Python Basics & Setup', 'class_start', 'Started Python Basics class', NOW() - INTERVAL '1 day' + INTERVAL '10 hours 30 minutes', 0, 0),
    ('student@example.com', yesterday_session_id, 1, 'Complete Python Programming Masterclass', 1, 'Python Basics & Setup', 'video_start', 'Started introduction video', NOW() - INTERVAL '1 day' + INTERVAL '10 hours 35 minutes', 0, 0),
    ('student@example.com', yesterday_session_id, 1, 'Complete Python Programming Masterclass', 1, 'Python Basics & Setup', 'video_complete', 'Completed introduction video', NOW() - INTERVAL '1 day' + INTERVAL '10 hours 55 minutes', 20, 100),
    ('student@example.com', yesterday_session_id, 1, 'Complete Python Programming Masterclass', 1, 'Python Basics & Setup', 'class_complete', 'Completed Python Basics class', NOW() - INTERVAL '1 day' + INTERVAL '11 hours', 30, 100),
    ('student@example.com', yesterday_session_id, 2, 'Machine Learning & AI Fundamentals', 1, 'Introduction to AI', 'class_start', 'Started AI Introduction class', NOW() - INTERVAL '1 day' + INTERVAL '11 hours 15 minutes', 0, 0),
    ('student@example.com', yesterday_session_id, 2, 'Machine Learning & AI Fundamentals', 1, 'Introduction to AI', 'video_complete', 'Completed AI intro video', NOW() - INTERVAL '1 day' + INTERVAL '11 hours 35 minutes', 20, 100);

    -- Quiz performances from yesterday
    INSERT INTO student_quiz_performance (student_email, session_id, course_id, course_name, quiz_id, quiz_name, start_time, end_time, time_taken_minutes, questions_total, questions_attempted, correct_answers, wrong_answers, score_percentage, pass_status) VALUES
    ('student@example.com', yesterday_session_id, 1, 'Complete Python Programming Masterclass', 1, 'Python Basics Quiz', NOW() - INTERVAL '1 day' + INTERVAL '11 hours', NOW() - INTERVAL '1 day' + INTERVAL '11 hours 15 minutes', 15, 10, 10, 8, 2, 80.00, true),
    ('student@example.com', yesterday_session_id, 2, 'Machine Learning & AI Fundamentals', 2, 'AI Basics Quiz', NOW() - INTERVAL '1 day' + INTERVAL '11 hours 45 minutes', NOW() - INTERVAL '1 day' + INTERVAL '12 hours', 15, 12, 12, 10, 2, 83.33, true);

    -- Downloads from yesterday
    INSERT INTO student_downloads (student_email, session_id, course_id, course_name, class_name, file_name, file_type, file_size_mb, download_time, download_source) VALUES
    ('student@example.com', yesterday_session_id, 1, 'Complete Python Programming Masterclass', 'Python Basics & Setup', 'Python_Installation_Guide.pdf', 'pdf', 2.5, NOW() - INTERVAL '1 day' + INTERVAL '10 hours 45 minutes', 'Class Material'),
    ('student@example.com', yesterday_session_id, 1, 'Complete Python Programming Masterclass', 'Python Basics & Setup', 'Python_Quiz_Certificate.pdf', 'pdf', 1.2, NOW() - INTERVAL '1 day' + INTERVAL '11 hours 20 minutes', 'Certificate'),
    ('student@example.com', yesterday_session_id, 2, 'Machine Learning & AI Fundamentals', 'Introduction to AI', 'AI_Timeline.pdf', 'pdf', 3.1, NOW() - INTERVAL '1 day' + INTERVAL '11 hours 30 minutes', 'Class Material');

    -- Daily engagement summary for yesterday
    INSERT INTO student_daily_engagement (
        student_email, date, total_sessions, total_login_time_minutes, 
        pages_visited, courses_accessed, classes_completed, quizzes_taken, 
        quizzes_passed, average_quiz_score, downloads_count, engagement_score,
        first_activity_time, last_activity_time
    ) VALUES (
        'student@example.com', 
        (NOW() - INTERVAL '1 day')::DATE, 
        1, 120, 6, 2, 2, 2, 2, 81.67, 3, 95.5,
        NOW() - INTERVAL '1 day' + INTERVAL '10 hours',
        NOW() - INTERVAL '1 day' + INTERVAL '12 hours'
    );

END $$;

-- ===================
-- HELPER FUNCTIONS FOR ANALYTICS
-- ===================

-- Function to calculate engagement score
CREATE OR REPLACE FUNCTION calculate_engagement_score(
    login_minutes BIGINT,
    courses_accessed BIGINT,
    quizzes_taken BIGINT,
    avg_quiz_score NUMERIC
) RETURNS NUMERIC AS $$
BEGIN
    RETURN LEAST(100, (
        (login_minutes * 0.3) + 
        (courses_accessed * 10) + 
        (quizzes_taken * 15) + 
        (avg_quiz_score * 0.5)
    ));
END;
$$ LANGUAGE plpgsql;

-- Function to update daily engagement (call this daily)
CREATE OR REPLACE FUNCTION update_daily_engagement(target_date DATE DEFAULT CURRENT_DATE) 
RETURNS void AS $$
BEGIN
    INSERT INTO student_daily_engagement (
        student_email, date, total_sessions, total_login_time_minutes,
        pages_visited, courses_accessed, classes_completed, quizzes_taken,
        quizzes_passed, average_quiz_score, downloads_count, engagement_score,
        first_activity_time, last_activity_time
    )
    SELECT 
        s.student_email,
        target_date,
        COUNT(DISTINCT s.session_id) as total_sessions,
        COALESCE(SUM(s.session_duration_minutes), 0) as total_login_time_minutes,
        COUNT(DISTINCT pv.id) as pages_visited,
        COUNT(DISTINCT ca.course_name) as courses_accessed,
        COUNT(CASE WHEN ca.completion_status = 'Completed' THEN 1 END) as classes_completed,
        COUNT(DISTINCT qp.id) as quizzes_taken,
        COUNT(CASE WHEN qp.pass_status THEN 1 END) as quizzes_passed,
        COALESCE(AVG(qp.score_percentage), 0) as average_quiz_score,
        COUNT(DISTINCT d.id) as downloads_count,
        calculate_engagement_score(
            COALESCE(SUM(s.session_duration_minutes), 0),
            COUNT(DISTINCT ca.course_name),
            COUNT(DISTINCT qp.id),
            COALESCE(AVG(qp.score_percentage), 0)
        ) as engagement_score,
        MIN(s.login_time) as first_activity_time,
        MAX(COALESCE(s.logout_time, s.login_time)) as last_activity_time
    FROM student_sessions s
    LEFT JOIN student_page_visits pv ON s.session_id = pv.session_id 
        AND pv.visit_time::DATE = target_date
    LEFT JOIN student_course_activities ca ON s.session_id = ca.session_id 
        AND ca.activity_time::DATE = target_date
    LEFT JOIN student_quiz_performance qp ON s.session_id = qp.session_id 
        AND qp.start_time::DATE = target_date
    LEFT JOIN student_downloads d ON s.session_id = d.session_id 
        AND d.download_time::DATE = target_date
    WHERE s.login_time::DATE = target_date
    GROUP BY s.student_email
    ON CONFLICT (student_email, date) 
    DO UPDATE SET
        total_sessions = EXCLUDED.total_sessions,
        total_login_time_minutes = EXCLUDED.total_login_time_minutes,
        pages_visited = EXCLUDED.pages_visited,
        courses_accessed = EXCLUDED.courses_accessed,
        classes_completed = EXCLUDED.classes_completed,
        quizzes_taken = EXCLUDED.quizzes_taken,
        quizzes_passed = EXCLUDED.quizzes_passed,
        average_quiz_score = EXCLUDED.average_quiz_score,
        downloads_count = EXCLUDED.downloads_count,
        engagement_score = EXCLUDED.engagement_score,
        first_activity_time = EXCLUDED.first_activity_time,
        last_activity_time = EXCLUDED.last_activity_time,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Create data for yesterday
SELECT update_daily_engagement((NOW() - INTERVAL '1 day')::DATE);

-- ===================
-- VERIFICATION QUERIES
-- ===================
SELECT 'STUDENT SESSIONS' as table_name, COUNT(*) as count FROM student_sessions WHERE student_email = 'student@example.com'
UNION ALL
SELECT 'PAGE VISITS', COUNT(*) FROM student_page_visits WHERE student_email = 'student@example.com'
UNION ALL
SELECT 'COURSE ACTIVITIES', COUNT(*) FROM student_course_activities WHERE student_email = 'student@example.com'
UNION ALL
SELECT 'QUIZ PERFORMANCE', COUNT(*) FROM student_quiz_performance WHERE student_email = 'student@example.com'
UNION ALL
SELECT 'DOWNLOADS', COUNT(*) FROM student_downloads WHERE student_email = 'student@example.com'
UNION ALL
SELECT 'DAILY ENGAGEMENT', COUNT(*) FROM student_daily_engagement WHERE student_email = 'student@example.com';

SELECT 
    'Sample data created for student@example.com on ' || (NOW() - INTERVAL '1 day')::DATE as message,
    COUNT(*) as total_activities
FROM student_course_activities 
WHERE student_email = 'student@example.com'; 
