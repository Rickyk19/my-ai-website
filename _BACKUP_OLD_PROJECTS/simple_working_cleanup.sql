-- =====================================================
-- SIMPLE WORKING CLEANUP - Only Essential Columns
-- =====================================================

-- Step 1: Clean delete in proper order (handle foreign keys)
DELETE FROM student_page_visits WHERE session_id IN (
    SELECT session_id FROM student_sessions WHERE student_email = 'student@example.com'
);

DELETE FROM student_course_activities WHERE student_email = 'student@example.com';
DELETE FROM student_quiz_performance WHERE student_email = 'student@example.com';
DELETE FROM student_sessions WHERE student_email = 'student@example.com';

-- Step 2: Insert basic session data (minimal columns)
INSERT INTO student_sessions (
    session_id, student_email, student_name, login_time, logout_time, 
    session_duration_minutes, device_type, browser, operating_system,
    location_country, location_city, is_active
) VALUES (
    'clean_session_1', 'student@example.com', 'Test Student', 
    '2025-06-27 11:28:00+00', '2025-06-27 11:30:00+00', 
    2, 'Desktop', 'Chrome', 'Windows', 'United States', 'New York', false
);

INSERT INTO student_sessions (
    session_id, student_email, student_name, login_time, 
    device_type, browser, operating_system, location_country, location_city, is_active
) VALUES (
    'clean_session_2', 'student@example.com', 'Test Student', 
    '2025-06-27 15:00:00+00', 'Desktop', 'Chrome', 'Windows', 
    'United States', 'New York', true
);

-- Step 3: Insert quiz data (essential columns only)
INSERT INTO student_quiz_performance (
    student_email, session_id, course_id, course_name, quiz_id, quiz_name,
    start_time, end_time, time_taken_minutes, questions_total, questions_attempted,
    correct_answers, wrong_answers, score_percentage, pass_status
) VALUES 
(
    'student@example.com', 'clean_session_1', 1, 'Python Basics Course', 1, 'Python Variables Quiz',
    '2025-06-27 11:29:00+00', '2025-06-27 11:34:00+00', 5, 8, 8, 7, 1, 87.50, true
),
(
    'student@example.com', 'clean_session_2', 2, 'AI Fundamentals Course', 2, 'AI Basics Quiz',
    '2025-06-27 15:05:00+00', '2025-06-27 15:08:00+00', 3, 10, 10, 9, 1, 90.00, true
);

-- Step 4: Insert activity data (essential columns only)
INSERT INTO student_course_activities (
    student_email, session_id, course_id, course_name, class_id, class_name,
    activity_type, activity_details, activity_time, time_spent_minutes, 
    progress_percentage, completion_status
) VALUES 
(
    'student@example.com', 'clean_session_1', 1, 'Python Basics Course', 1, 'Introduction to Python',
    'Video Watched', 'Completed Python introduction video', '2025-06-27 11:35:00+00', 
    15, 100, 'Completed'
),
(
    'student@example.com', 'clean_session_2', 2, 'AI Fundamentals Course', 1, 'What is AI',
    'Video Started', 'Started AI fundamentals video', '2025-06-27 15:10:00+00', 
    8, 75, 'In Progress'
);

-- Step 5: Skip page visits for now (column issues)
-- We'll add them later once we know the correct column structure

-- Step 6: Verify data insertion
SELECT 'SIMPLE CLEANUP COMPLETED SUCCESSFULLY' as status;

SELECT 'SESSIONS' as table_name, COUNT(*) as count 
FROM student_sessions WHERE student_email = 'student@example.com';

SELECT 'QUIZZES' as table_name, COUNT(*) as count 
FROM student_quiz_performance WHERE student_email = 'student@example.com';

SELECT 'ACTIVITIES' as table_name, COUNT(*) as count 
FROM student_course_activities WHERE student_email = 'student@example.com';

-- Step 7: Show the actual data
SELECT 'Latest Sessions:' as info;
SELECT session_id, login_time, device_type, is_active 
FROM student_sessions WHERE student_email = 'student@example.com' 
ORDER BY login_time DESC;

SELECT 'Quiz Results:' as info;
SELECT quiz_name, score_percentage, start_time 
FROM student_quiz_performance WHERE student_email = 'student@example.com' 
ORDER BY start_time DESC;

SELECT 'Activities:' as info;
SELECT activity_type, course_name, activity_time 
FROM student_course_activities WHERE student_email = 'student@example.com' 
ORDER BY activity_time DESC;

-- Step 8: Date summary
SELECT 'Session Summary by Date:' as info;
SELECT DATE(login_time) as session_date, COUNT(*) as sessions_count 
FROM student_sessions 
WHERE student_email = 'student@example.com'
GROUP BY DATE(login_time) 
ORDER BY session_date DESC; 
