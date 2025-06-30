-- Final Working Insert - Handles All Constraints
-- This fixes the session_id NOT NULL constraint issue

-- Step 1: Clean up existing data properly (dependency order)
DELETE FROM student_page_visits WHERE student_email = 'student@example.com';
DELETE FROM student_course_activities WHERE student_email = 'student@example.com';  
DELETE FROM student_quiz_performance WHERE student_email = 'student@example.com';
DELETE FROM student_sessions WHERE student_email = 'student@example.com';

-- Step 2: Insert sessions with explicit session_id values
INSERT INTO student_sessions (
    session_id,
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
-- Active session (session_id = 1)
('current_session_1', 'student@example.com', 'John Doe', NOW() - INTERVAL '2 hours', NULL, NULL, 'Desktop', 'Chrome', 'New York', 'USA'),
-- Yesterday's session (session_id = 2)  
('yesterday_session_1', 'student@example.com', 'John Doe', NOW() - INTERVAL '1 day' + INTERVAL '2 hours', NOW() - INTERVAL '1 day' + INTERVAL '4 hours', 120, 'Mobile', 'Safari', 'New York', 'USA');

-- Step 3: Insert quiz performance with all required fields
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

-- Step 4: Insert course activities (reference the session_id if needed)
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

-- Step 5: Insert page visits  
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

-- Step 6: Verification queries
SELECT 'SUCCESS: Data inserted with proper constraints!' as status;

-- Show sessions
SELECT 'Current Sessions:' as info;
SELECT session_id, student_email, login_time, logout_time, device_type, location_city
FROM student_sessions 
WHERE student_email = 'student@example.com'
ORDER BY login_time DESC;

-- Show quiz results  
SELECT 'Quiz Results:' as info;
SELECT student_email, course_name, quiz_name, score_percentage, start_time
FROM student_quiz_performance 
WHERE student_email = 'student@example.com'
ORDER BY start_time DESC;

-- Show activities
SELECT 'Recent Activities:' as info;
SELECT student_email, course_name, activity_type, activity_description, timestamp
FROM student_course_activities 
WHERE student_email = 'student@example.com'
ORDER BY timestamp DESC;

-- Summary stats for analytics dashboard
SELECT 'Analytics Summary:' as info;
SELECT 
    (SELECT COUNT(*) FROM student_sessions WHERE student_email = 'student@example.com') as total_sessions,
    (SELECT COUNT(*) FROM student_quiz_performance WHERE student_email = 'student@example.com') as total_quizzes,
    (SELECT ROUND(AVG(score_percentage), 2) FROM student_quiz_performance WHERE student_email = 'student@example.com') as avg_quiz_score,
    (SELECT COUNT(*) FROM student_course_activities WHERE student_email = 'student@example.com') as total_activities,
    (SELECT COUNT(*) FROM student_page_visits WHERE student_email = 'student@example.com') as total_page_visits;

SELECT 'All data ready! Refresh your Analytics Dashboard now.' as final_message; 
