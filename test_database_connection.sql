-- =====================================================
-- TEST DATABASE CONNECTION - Simple Test
-- =====================================================

-- Step 1: Insert ONE simple record to test
DELETE FROM student_sessions WHERE student_email = 'test@example.com';

INSERT INTO student_sessions (
    session_id, student_email, student_name, login_time, 
    device_type, browser, operating_system, location_country, location_city, is_active
) VALUES (
    'test_connection_1', 'test@example.com', 'Test User', 
    NOW(), 'Desktop', 'Chrome', 'Windows', 'United States', 'New York', true
);

-- Step 2: Verify it was inserted
SELECT 'Test record inserted successfully' as status;
SELECT * FROM student_sessions WHERE student_email = 'test@example.com';

-- Step 3: Check current date/time
SELECT NOW() as current_timestamp, CURRENT_DATE as current_date;

-- Step 4: Now try student@example.com with explicit current timestamp
DELETE FROM student_course_activities WHERE student_email = 'student@example.com';
DELETE FROM student_quiz_performance WHERE student_email = 'student@example.com';
DELETE FROM student_sessions WHERE student_email = 'student@example.com';

INSERT INTO student_sessions (
    session_id, student_email, student_name, login_time, 
    device_type, browser, operating_system, location_country, location_city, is_active
) VALUES (
    'live_session_1', 'student@example.com', 'Real Student', 
    NOW(), 'Desktop', 'Chrome', 'Windows', 'United States', 'New York', true
);

INSERT INTO student_quiz_performance (
    student_email, session_id, course_id, course_name, quiz_id, quiz_name,
    start_time, end_time, time_taken_minutes, questions_total, questions_attempted,
    correct_answers, wrong_answers, score_percentage, pass_status
) VALUES (
    'student@example.com', 'live_session_1', 1, 'Python Basics Course', 1, 'Python Variables Quiz',
    NOW() - INTERVAL '5 minutes', NOW(), 5, 8, 8, 7, 1, 87.50, true
);

-- Step 5: Verify student@example.com data
SELECT 'student@example.com data verification:' as status;
SELECT session_id, login_time, is_active FROM student_sessions WHERE student_email = 'student@example.com';
SELECT quiz_name, score_percentage, start_time FROM student_quiz_performance WHERE student_email = 'student@example.com';

-- Step 6: Show date format that was actually inserted
SELECT DATE(login_time) as session_date, login_time as full_timestamp 
FROM student_sessions 
WHERE student_email = 'student@example.com';

-- Step 7: Clean up test data
DELETE FROM student_sessions WHERE student_email = 'test@example.com'; 