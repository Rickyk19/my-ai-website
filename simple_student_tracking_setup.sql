-- =============================================
-- SIMPLE STUDENT TRACKING SETUP
-- Basic tables and sample data for student@example.com
-- =============================================

-- Drop existing tables if they exist
DROP TABLE IF EXISTS student_quiz_performance CASCADE;
DROP TABLE IF EXISTS student_course_activities CASCADE;
DROP TABLE IF EXISTS student_page_visits CASCADE;
DROP TABLE IF EXISTS student_sessions CASCADE;

-- ===================
-- 1. STUDENT SESSIONS TABLE
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
    location_country VARCHAR(100),
    location_city VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================
-- 2. PAGE VISITS TABLE
-- ===================
CREATE TABLE student_page_visits (
    id SERIAL PRIMARY KEY,
    student_email VARCHAR(255) NOT NULL,
    session_id VARCHAR(255) REFERENCES student_sessions(session_id),
    page_path VARCHAR(500) NOT NULL,
    page_title VARCHAR(255),
    page_type VARCHAR(100),
    visit_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    exit_time TIMESTAMP WITH TIME ZONE,
    time_spent_seconds INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================
-- 3. COURSE ACTIVITIES TABLE
-- ===================
CREATE TABLE student_course_activities (
    id SERIAL PRIMARY KEY,
    student_email VARCHAR(255) NOT NULL,
    session_id VARCHAR(255) REFERENCES student_sessions(session_id),
    course_id INTEGER,
    course_name VARCHAR(255) NOT NULL,
    class_id INTEGER,
    class_name VARCHAR(255),
    activity_type VARCHAR(100) NOT NULL,
    activity_details TEXT,
    activity_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    time_spent_minutes INTEGER DEFAULT 0,
    progress_percentage DECIMAL(5,2) DEFAULT 0,
    completion_status VARCHAR(50) DEFAULT 'In Progress',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================
-- 4. QUIZ PERFORMANCE TABLE
-- ===================
CREATE TABLE student_quiz_performance (
    id SERIAL PRIMARY KEY,
    student_email VARCHAR(255) NOT NULL,
    session_id VARCHAR(255) REFERENCES student_sessions(session_id),
    course_id INTEGER,
    course_name VARCHAR(255) NOT NULL,
    quiz_id INTEGER,
    quiz_name VARCHAR(255) NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    end_time TIMESTAMP WITH TIME ZONE,
    time_taken_minutes INTEGER DEFAULT 0,
    questions_total INTEGER NOT NULL,
    questions_attempted INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    wrong_answers INTEGER DEFAULT 0,
    score_percentage DECIMAL(5,2) DEFAULT 0,
    pass_status BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================
-- DISABLE ROW LEVEL SECURITY
-- ===================
ALTER TABLE student_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE student_page_visits DISABLE ROW LEVEL SECURITY;
ALTER TABLE student_course_activities DISABLE ROW LEVEL SECURITY;
ALTER TABLE student_quiz_performance DISABLE ROW LEVEL SECURITY;

-- ===================
-- SAMPLE DATA FOR student@example.com - YESTERDAY'S ACTIVITIES
-- ===================

-- Yesterday's session
INSERT INTO student_sessions VALUES (
    1,
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
    false,
    NOW() - INTERVAL '1 day'
);

-- Quiz performances from yesterday (THE IMPORTANT DATA YOU WANT TO SEE!)
INSERT INTO student_quiz_performance VALUES 
(1, 'student@example.com', 'session_yesterday_20241226', 1, 'Complete Python Programming Masterclass', 1, 'Python Basics Quiz', NOW() - INTERVAL '1 day' + INTERVAL '11 hours', NOW() - INTERVAL '1 day' + INTERVAL '11 hours 15 minutes', 15, 10, 10, 8, 2, 80.00, true, NOW() - INTERVAL '1 day'),
(2, 'student@example.com', 'session_yesterday_20241226', 2, 'Machine Learning & AI Fundamentals', 2, 'AI Basics Quiz', NOW() - INTERVAL '1 day' + INTERVAL '11 hours 45 minutes', NOW() - INTERVAL '1 day' + INTERVAL '12 hours', 15, 12, 12, 10, 2, 83.33, true, NOW() - INTERVAL '1 day');

-- Course activities from yesterday
INSERT INTO student_course_activities VALUES 
(1, 'student@example.com', 'session_yesterday_20241226', 1, 'Complete Python Programming Masterclass', 1, 'Python Basics & Setup', 'class_complete', 'Completed Python Basics class', NOW() - INTERVAL '1 day' + INTERVAL '11 hours', 30, 100, 'Completed', NOW() - INTERVAL '1 day'),
(2, 'student@example.com', 'session_yesterday_20241226', 2, 'Machine Learning & AI Fundamentals', 1, 'Introduction to AI', 'video_complete', 'Completed AI intro video', NOW() - INTERVAL '1 day' + INTERVAL '11 hours 35 minutes', 20, 100, 'Completed', NOW() - INTERVAL '1 day');

-- Page visits from yesterday
INSERT INTO student_page_visits VALUES 
(1, 'student@example.com', 'session_yesterday_20241226', '/course/1/class/1/quiz', 'Python Basics Quiz', 'quiz', NOW() - INTERVAL '1 day' + INTERVAL '11 hours', NOW() - INTERVAL '1 day' + INTERVAL '11 hours 15 minutes', 900, NOW() - INTERVAL '1 day'),
(2, 'student@example.com', 'session_yesterday_20241226', '/course/2/class/1/quiz', 'AI Basics Quiz', 'quiz', NOW() - INTERVAL '1 day' + INTERVAL '11 hours 45 minutes', NOW() - INTERVAL '1 day' + INTERVAL '12 hours', 900, NOW() - INTERVAL '1 day');

-- ===================
-- VERIFICATION - Check if data was inserted correctly
-- ===================
SELECT 'VERIFICATION RESULTS:' as info;

SELECT 'STUDENT SESSIONS' as table_name, COUNT(*) as count FROM student_sessions WHERE student_email = 'student@example.com'
UNION ALL
SELECT 'QUIZ PERFORMANCE', COUNT(*) FROM student_quiz_performance WHERE student_email = 'student@example.com'
UNION ALL  
SELECT 'COURSE ACTIVITIES', COUNT(*) FROM student_course_activities WHERE student_email = 'student@example.com'
UNION ALL
SELECT 'PAGE VISITS', COUNT(*) FROM student_page_visits WHERE student_email = 'student@example.com';

-- Show the quiz data specifically
SELECT 
    'QUIZ RESULTS FOR student@example.com:' as info,
    quiz_name,
    score_percentage || '%' as score,
    CASE WHEN pass_status THEN 'PASSED' ELSE 'FAILED' END as status,
    start_time::DATE as date
FROM student_quiz_performance 
WHERE student_email = 'student@example.com'
ORDER BY start_time;

SELECT 'SUCCESS: Sample data created for student@example.com' as final_message; 