-- Working Minimal Insert - COMPREHENSIVE DATA FIX
-- Adding all the data needed for Analytics Dashboard to work properly

-- Clean up first
DELETE FROM student_course_activities WHERE student_email = 'student@example.com';
DELETE FROM student_quiz_performance WHERE student_email = 'student@example.com';  
DELETE FROM student_sessions WHERE student_email = 'student@example.com';

-- Insert comprehensive session data
INSERT INTO student_sessions (
    session_id,
    student_email, 
    login_time,
    logout_time,
    session_duration_minutes,
    device_type,
    browser,
    operating_system,
    location_country,
    location_city,
    is_active
) VALUES 
('sess_current_' || EXTRACT(EPOCH FROM NOW()), 'student@example.com', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '30 minutes', 90, 'Desktop', 'Chrome', 'Windows', 'United States', 'New York', false),
('sess_yesterday_' || EXTRACT(EPOCH FROM NOW()), 'student@example.com', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day' + INTERVAL '120 minutes', 120, 'Desktop', 'Chrome', 'Windows', 'United States', 'New York', false);

-- Insert comprehensive quiz performance data
INSERT INTO student_quiz_performance (
    student_email,
    course_name,
    quiz_name,
    start_time,
    end_time,
    score_percentage,
    questions_total,
    correct_answers,
    wrong_answers,
    time_taken_minutes,
    pass_status
) VALUES 
('student@example.com', 'Python Basics', 'Python Variables Quiz', NOW() - INTERVAL '1 hour', NOW() - INTERVAL '55 minutes', 80.00, 10, 8, 2, 5, true),
('student@example.com', 'AI Fundamentals', 'Introduction to AI Quiz', NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '27 minutes', 83.33, 12, 10, 2, 3, true),
('student@example.com', 'Web Development', 'HTML Basics Quiz', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '1 hour 55 minutes', 90.00, 20, 18, 2, 5, true);

-- Insert comprehensive course activities
INSERT INTO student_course_activities (
    student_email,
    course_name,
    activity_type,
    activity_time,
    time_spent_minutes,
    progress_percentage,
    completion_status,
    activity_details
) VALUES 
('student@example.com', 'Python Basics', 'video_watch', NOW() - INTERVAL '2 hours', 25, 100, 'Completed', 'Watched Introduction to Python Variables'),
('student@example.com', 'AI Fundamentals', 'quiz_attempt', NOW() - INTERVAL '30 minutes', 3, 100, 'Completed', 'Completed Introduction to AI Quiz'),
('student@example.com', 'Web Development', 'video_watch', NOW() - INTERVAL '1 hour 30 minutes', 20, 100, 'Completed', 'Watched HTML Fundamentals'),
('student@example.com', 'Python Basics', 'quiz_attempt', NOW() - INTERVAL '1 hour', 5, 100, 'Completed', 'Completed Python Variables Quiz'),
('student@example.com', 'AI Fundamentals', 'video_watch', NOW() - INTERVAL '45 minutes', 15, 100, 'Completed', 'Watched AI Introduction Video');

-- Verify comprehensive results
SELECT 'SUCCESS! COMPREHENSIVE DATA INSERTED!' as status;
SELECT COUNT(*) as sessions, 
       AVG(session_duration_minutes) as avg_session_duration,
       SUM(CASE WHEN is_active THEN 1 ELSE 0 END) as active_sessions
FROM student_sessions WHERE student_email = 'student@example.com';

SELECT COUNT(*) as total_quizzes, 
       AVG(score_percentage) as avg_quiz_score,
       SUM(questions_total) as total_questions,
       SUM(correct_answers) as total_correct
FROM student_quiz_performance WHERE student_email = 'student@example.com';

SELECT COUNT(*) as total_activities,
       SUM(time_spent_minutes) as total_study_time,
       COUNT(DISTINCT course_name) as courses_engaged
FROM student_course_activities WHERE student_email = 'student@example.com';

SELECT '✅ Analytics Dashboard should now show REAL aggregated data!' as message;
SELECT '🎯 Expected: 2 sessions, 3 quizzes (84.4% avg), 5 activities, 3 courses' as expected_data; 