-- =====================================================
-- WORKING INSERT DATA - Current Date Format
-- =====================================================

-- Clean existing data first
DELETE FROM student_course_activities WHERE student_email = 'student@example.com';
DELETE FROM student_quiz_performance WHERE student_email = 'student@example.com';
DELETE FROM student_sessions WHERE student_email = 'student@example.com';

-- Insert session data with today's date (2025-06-27)
INSERT INTO student_sessions (
    session_id, student_email, student_name, login_time, logout_time, 
    session_duration_minutes, device_type, browser, operating_system,
    location_country, location_city, is_active
) VALUES (
    'session_20250627_1', 'student@example.com', 'Test Student', 
    '2025-06-27 11:28:00+00', '2025-06-27 11:30:00+00', 
    2, 'Desktop', 'Chrome', 'Windows', 'United States', 'New York', false
);

INSERT INTO student_sessions (
    session_id, student_email, student_name, login_time, 
    device_type, browser, operating_system, location_country, location_city, is_active
) VALUES (
    'session_20250627_2', 'student@example.com', 'Test Student', 
    '2025-06-27 15:00:00+00', 'Desktop', 'Chrome', 'Windows', 
    'United States', 'New York', true
);

-- Insert quiz data with today's timestamps
INSERT INTO student_quiz_performance (
    student_email, session_id, course_id, course_name, quiz_id, quiz_name,
    start_time, end_time, time_taken_minutes, questions_total, questions_attempted,
    correct_answers, wrong_answers, score_percentage, pass_status
) VALUES 
(
    'student@example.com', 'session_20250627_1', 1, 'Python Basics Course', 1, 'Python Variables Quiz',
    '2025-06-27 11:29:00+00', '2025-06-27 11:34:00+00', 5, 8, 8, 7, 1, 87.50, true
),
(
    'student@example.com', 'session_20250627_2', 2, 'AI Fundamentals Course', 2, 'AI Basics Quiz',
    '2025-06-27 15:05:00+00', '2025-06-27 15:08:00+00', 3, 10, 10, 9, 1, 90.00, true
);

-- Insert activity data with today's timestamps
INSERT INTO student_course_activities (
    student_email, session_id, course_id, course_name, class_id, class_name,
    activity_type, activity_details, activity_time, time_spent_minutes, 
    progress_percentage, completion_status
) VALUES 
(
    'student@example.com', 'session_20250627_1', 1, 'Python Basics Course', 1, 'Introduction to Python',
    'Video Watched', 'Completed Python introduction video', '2025-06-27 11:35:00+00', 
    15, 100, 'Completed'
),
(
    'student@example.com', 'session_20250627_2', 2, 'AI Fundamentals Course', 1, 'What is AI',
    'Video Started', 'Started AI fundamentals video', '2025-06-27 15:10:00+00', 
    8, 75, 'In Progress'
);

-- Verify data was inserted
SELECT 'Data inserted successfully for 2025-06-27' as status;
SELECT COUNT(*) as sessions_count FROM student_sessions WHERE student_email = 'student@example.com';
SELECT COUNT(*) as quiz_count FROM student_quiz_performance WHERE student_email = 'student@example.com';
SELECT COUNT(*) as activity_count FROM student_course_activities WHERE student_email = 'student@example.com';

-- Show the data we just inserted
SELECT 'SESSIONS:' as data_type, student_email, login_time, device_type, is_active 
FROM student_sessions WHERE student_email = 'student@example.com' 
ORDER BY login_time DESC;

SELECT 'QUIZZES:' as data_type, student_email, quiz_name, score_percentage, start_time 
FROM student_quiz_performance WHERE student_email = 'student@example.com' 
ORDER BY start_time DESC;

SELECT 'ACTIVITIES:' as data_type, student_email, activity_type, course_name, activity_time 
FROM student_course_activities WHERE student_email = 'student@example.com' 
ORDER BY activity_time DESC; 