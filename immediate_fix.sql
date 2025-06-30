-- =====================================================
-- IMMEDIATE FIX - Current Timestamp Data
-- =====================================================

-- Clean everything for student@example.com
DELETE FROM student_course_activities WHERE student_email = 'student@example.com';
DELETE FROM student_quiz_performance WHERE student_email = 'student@example.com';
DELETE FROM student_sessions WHERE student_email = 'student@example.com';

-- Insert with CURRENT timestamps (not fixed dates)
INSERT INTO student_sessions (
    session_id, student_email, student_name, login_time, 
    device_type, browser, operating_system, location_country, location_city, is_active
) VALUES 
(
    'current_session_1', 'student@example.com', 'Real Student', 
    NOW() - INTERVAL '2 hours', 'Desktop', 'Chrome', 'Windows', 'United States', 'New York', false
),
(
    'current_session_2', 'student@example.com', 'Real Student', 
    NOW() - INTERVAL '10 minutes', 'Desktop', 'Chrome', 'Windows', 'United States', 'New York', true
);

INSERT INTO student_quiz_performance (
    student_email, session_id, course_id, course_name, quiz_id, quiz_name,
    start_time, end_time, time_taken_minutes, questions_total, questions_attempted,
    correct_answers, wrong_answers, score_percentage, pass_status
) VALUES 
(
    'student@example.com', 'current_session_1', 1, 'Python Basics Course', 1, 'Python Variables Quiz',
    NOW() - INTERVAL '1 hour 45 minutes', NOW() - INTERVAL '1 hour 40 minutes', 5, 8, 8, 7, 1, 87.50, true
),
(
    'student@example.com', 'current_session_2', 2, 'AI Fundamentals Course', 2, 'AI Basics Quiz',
    NOW() - INTERVAL '5 minutes', NOW() - INTERVAL '2 minutes', 3, 10, 10, 9, 1, 90.00, true
);

INSERT INTO student_course_activities (
    student_email, session_id, course_id, course_name, class_id, class_name,
    activity_type, activity_details, activity_time, time_spent_minutes, 
    progress_percentage, completion_status
) VALUES 
(
    'student@example.com', 'current_session_1', 1, 'Python Basics Course', 1, 'Introduction to Python',
    'Video Watched', 'Completed Python introduction video', NOW() - INTERVAL '1 hour 30 minutes', 
    15, 100, 'Completed'
),
(
    'student@example.com', 'current_session_2', 2, 'AI Fundamentals Course', 1, 'What is AI',
    'Video Started', 'Started AI fundamentals video', NOW() - INTERVAL '8 minutes', 
    8, 75, 'In Progress'
);

-- Verify immediately
SELECT 'DATA INSERTED WITH CURRENT TIMESTAMPS' as status;
SELECT NOW() as current_time;
SELECT session_id, login_time, is_active FROM student_sessions WHERE student_email = 'student@example.com';
SELECT quiz_name, score_percentage, start_time FROM student_quiz_performance WHERE student_email = 'student@example.com';
SELECT activity_type, course_name, activity_time FROM student_course_activities WHERE student_email = 'student@example.com'; 
