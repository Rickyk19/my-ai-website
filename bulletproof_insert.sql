-- Bulletproof Insert - Handles ALL Known Constraints
-- This addresses every NOT NULL constraint we've encountered

-- Step 1: Clean up existing data
DELETE FROM student_course_activities WHERE student_email = 'student@example.com';
DELETE FROM student_quiz_performance WHERE student_email = 'student@example.com';  
DELETE FROM student_sessions WHERE student_email = 'student@example.com';

-- Step 2: Insert sessions with all required fields
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
-- Active session
('sess_' || extract(epoch from now())::text, 'student@example.com', 'John Doe', NOW() - INTERVAL '2 hours', NULL, NULL, 'Desktop', 'Chrome', 'New York', 'USA'),
-- Completed session
('sess_' || (extract(epoch from now()) + 1)::text, 'student@example.com', 'John Doe', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day' + INTERVAL '2 hours', 120, 'Mobile', 'Safari', 'New York', 'USA');

-- Step 3: Insert quiz performance with existing fields only
INSERT INTO student_quiz_performance (
    student_email,
    student_name,
    course_name,
    quiz_name,
    start_time,
    end_time,
    time_taken_minutes,
    questions_total,
    score_percentage,
    pass_status
) VALUES 
-- Today's quizzes with complete data
('student@example.com', 'John Doe', 'Python Basics', 'Python Fundamentals Quiz', NOW() - INTERVAL '1 hour', NOW() - INTERVAL '50 minutes', 10, 10, 80.00, true),
('student@example.com', 'John Doe', 'AI Fundamentals', 'Introduction to AI Quiz', NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '15 minutes', 15, 12, 83.33, true);

-- Step 4: Insert course activities with all required fields
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
('student@example.com', 'John Doe', 'Python Basics', 'video_watch', 'Watched: Python Variables Tutorial', NOW() - INTERVAL '2 hours', 15),
('student@example.com', 'John Doe', 'Python Basics', 'quiz_attempt', 'Attempted: Python Fundamentals Quiz', NOW() - INTERVAL '1 hour', 10),
('student@example.com', 'John Doe', 'AI Fundamentals', 'course_access', 'Accessed: AI Course Content', NOW() - INTERVAL '45 minutes', 5),
('student@example.com', 'John Doe', 'AI Fundamentals', 'quiz_attempt', 'Attempted: Introduction to AI Quiz', NOW() - INTERVAL '30 minutes', 15);

-- Step 5: Insert page visits (if table exists)
INSERT INTO student_page_visits (
    student_email,
    page_title,
    visit_timestamp,
    time_spent_seconds
) VALUES 
('student@example.com', 'Dashboard', NOW() - INTERVAL '2 hours', 120),
('student@example.com', 'Python Basics Course', NOW() - INTERVAL '1 hour 30 minutes', 900),
('student@example.com', 'AI Fundamentals Course', NOW() - INTERVAL '45 minutes', 450),
('student@example.com', 'Analytics Dashboard', NOW() - INTERVAL '5 minutes', 300);

-- Step 6: Comprehensive verification
SELECT 'SUCCESS: Complete data inserted for real-time analytics!' as status;

-- Show sessions with details
SELECT 'SESSIONS:' as section;
SELECT session_id, student_email, login_time, logout_time, session_duration_minutes, device_type, location_city
FROM student_sessions 
WHERE student_email = 'student@example.com'
ORDER BY login_time DESC;

-- Show quiz results with full details
SELECT 'QUIZ PERFORMANCE:' as section;
SELECT student_email, course_name, quiz_name, score_percentage, questions_total, pass_status, start_time
FROM student_quiz_performance 
WHERE student_email = 'student@example.com'
ORDER BY start_time DESC;

-- Show activities
SELECT 'COURSE ACTIVITIES:' as section;
SELECT student_email, course_name, activity_type, activity_description, timestamp, duration_minutes
FROM student_course_activities 
WHERE student_email = 'student@example.com'
ORDER BY timestamp DESC;

-- Summary for analytics dashboard
SELECT 'ANALYTICS SUMMARY:' as section;
SELECT 
    (SELECT COUNT(*) FROM student_sessions WHERE student_email = 'student@example.com') as total_sessions,
    (SELECT COUNT(*) FROM student_sessions WHERE student_email = 'student@example.com' AND logout_time IS NULL) as active_sessions,
    (SELECT COUNT(*) FROM student_quiz_performance WHERE student_email = 'student@example.com') as total_quizzes,
    (SELECT ROUND(AVG(score_percentage), 2) FROM student_quiz_performance WHERE student_email = 'student@example.com') as avg_quiz_score,
    (SELECT COUNT(*) FROM student_course_activities WHERE student_email = 'student@example.com') as total_activities,
    (SELECT SUM(duration_minutes) FROM student_course_activities WHERE student_email = 'student@example.com') as total_minutes_spent;

SELECT '🎉 ALL DATA READY! Refresh your Analytics Dashboard to see real-time tracking in action!' as final_message; 