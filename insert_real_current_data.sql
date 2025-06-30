-- Insert Real Current Data for Real-Time Analytics Testing
-- This will create data with current timestamps that should appear in your dashboard

-- First, ensure tables exist (create if needed)
CREATE TABLE IF NOT EXISTS student_sessions (
    id BIGSERIAL PRIMARY KEY,
    student_email TEXT NOT NULL,
    student_name TEXT,
    login_time TIMESTAMPTZ DEFAULT NOW(),
    logout_time TIMESTAMPTZ,
    session_duration_minutes INTEGER,
    device_type TEXT DEFAULT 'Desktop',
    browser TEXT DEFAULT 'Chrome',
    location_city TEXT DEFAULT 'Unknown',
    location_country TEXT DEFAULT 'Unknown',
    ip_address INET,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS student_quiz_performance (
    id BIGSERIAL PRIMARY KEY,
    student_email TEXT NOT NULL,
    student_name TEXT,
    course_name TEXT NOT NULL,
    quiz_name TEXT NOT NULL,
    start_time TIMESTAMPTZ DEFAULT NOW(),
    end_time TIMESTAMPTZ,
    time_taken_minutes INTEGER,
    total_questions INTEGER,
    correct_answers INTEGER,
    score_percentage DECIMAL(5,2),
    pass_status BOOLEAN,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS student_course_activities (
    id BIGSERIAL PRIMARY KEY,
    student_email TEXT NOT NULL,
    student_name TEXT,
    course_name TEXT NOT NULL,
    activity_type TEXT NOT NULL,
    activity_description TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    duration_minutes INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS student_page_visits (
    id BIGSERIAL PRIMARY KEY,
    student_email TEXT NOT NULL,
    page_title TEXT NOT NULL,
    visit_timestamp TIMESTAMPTZ DEFAULT NOW(),
    time_spent_seconds INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clear existing test data
DELETE FROM student_sessions WHERE student_email = 'student@example.com';
DELETE FROM student_quiz_performance WHERE student_email = 'student@example.com';
DELETE FROM student_course_activities WHERE student_email = 'student@example.com';
DELETE FROM student_page_visits WHERE student_email = 'student@example.com';

-- Insert current session (login from today)
INSERT INTO student_sessions (
    student_email, 
    student_name, 
    login_time, 
    logout_time, 
    session_duration_minutes,
    device_type,
    browser,
    location_city,
    location_country
) VALUES 
-- Session from 2 hours ago (currently active)
('student@example.com', 'John Doe', NOW() - INTERVAL '2 hours', NULL, NULL, 'Desktop', 'Chrome', 'New York', 'USA'),
-- Session from yesterday 
('student@example.com', 'John Doe', NOW() - INTERVAL '1 day' + INTERVAL '2 hours', NOW() - INTERVAL '1 day' + INTERVAL '4 hours', 120, 'Mobile', 'Safari', 'New York', 'USA');

-- Insert recent quiz performance (from today)
INSERT INTO student_quiz_performance (
    student_email,
    student_name,
    course_name,
    quiz_name,
    start_time,
    end_time,
    time_taken_minutes,
    total_questions,
    correct_answers,
    score_percentage,
    pass_status
) VALUES 
-- Today's quizzes
('student@example.com', 'John Doe', 'Python Basics', 'Python Fundamentals Quiz', NOW() - INTERVAL '1 hour', NOW() - INTERVAL '50 minutes', 10, 10, 8, 80.00, true),
('student@example.com', 'John Doe', 'AI Fundamentals', 'Introduction to AI Quiz', NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '15 minutes', 15, 12, 10, 83.33, true),
-- Yesterday's quiz
('student@example.com', 'John Doe', 'Data Science', 'Statistics Basics Quiz', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day' + INTERVAL '20 minutes', 20, 15, 12, 80.00, true);

-- Insert course activities (from today)
INSERT INTO student_course_activities (
    student_email,
    student_name,
    course_name,
    activity_type,
    activity_description,
    timestamp,
    duration_minutes
) VALUES 
-- Today's activities
('student@example.com', 'John Doe', 'Python Basics', 'video_watch', 'Watched: Introduction to Python Variables', NOW() - INTERVAL '2 hours', 15),
('student@example.com', 'John Doe', 'Python Basics', 'quiz_attempt', 'Attempted: Python Fundamentals Quiz', NOW() - INTERVAL '1 hour', 10),
('student@example.com', 'John Doe', 'AI Fundamentals', 'course_access', 'Accessed course content', NOW() - INTERVAL '45 minutes', 5),
('student@example.com', 'John Doe', 'AI Fundamentals', 'quiz_attempt', 'Attempted: Introduction to AI Quiz', NOW() - INTERVAL '30 minutes', 15);

-- Insert page visits (from today)
INSERT INTO student_page_visits (
    student_email,
    page_title,
    visit_timestamp,
    time_spent_seconds
) VALUES 
-- Today's page visits
('student@example.com', 'Dashboard', NOW() - INTERVAL '2 hours', 120),
('student@example.com', 'Python Basics Course', NOW() - INTERVAL '1 hour 45 minutes', 900),
('student@example.com', 'Python Fundamentals Quiz', NOW() - INTERVAL '1 hour', 600),
('student@example.com', 'AI Fundamentals Course', NOW() - INTERVAL '45 minutes', 450),
('student@example.com', 'Introduction to AI Quiz', NOW() - INTERVAL '30 minutes', 900),
('student@example.com', 'Analytics Dashboard', NOW() - INTERVAL '5 minutes', 300);

-- Verify the inserted data
SELECT 'VERIFICATION: Current Data for student@example.com' as status;

SELECT 'Active Sessions:' as info;
SELECT student_email, login_time, logout_time, session_duration_minutes, device_type
FROM student_sessions 
WHERE student_email = 'student@example.com'
ORDER BY login_time DESC;

SELECT 'Recent Quiz Performance:' as info;
SELECT student_email, course_name, quiz_name, score_percentage, start_time
FROM student_quiz_performance 
WHERE student_email = 'student@example.com'
ORDER BY start_time DESC;

SELECT 'Recent Activities:' as info;
SELECT student_email, course_name, activity_type, activity_description, timestamp
FROM student_course_activities 
WHERE student_email = 'student@example.com'
ORDER BY timestamp DESC;

-- Show summary stats
SELECT 
    'SUMMARY STATS for student@example.com' as summary,
    (SELECT COUNT(*) FROM student_sessions WHERE student_email = 'student@example.com') as total_sessions,
    (SELECT COUNT(*) FROM student_quiz_performance WHERE student_email = 'student@example.com') as total_quizzes,
    (SELECT AVG(score_percentage) FROM student_quiz_performance WHERE student_email = 'student@example.com') as avg_quiz_score,
    (SELECT COUNT(*) FROM student_course_activities WHERE student_email = 'student@example.com') as total_activities; 
