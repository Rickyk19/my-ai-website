-- =====================================================
-- QUICK DEBUG CHECK - Simple syntax
-- =====================================================

-- 1. Check if tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_name IN ('student_sessions', 'student_quiz_performance', 'student_course_activities');

-- 2. Count data in each table
SELECT 'student_sessions' as table_name, COUNT(*) as total_rows FROM student_sessions;
SELECT 'student_quiz_performance' as table_name, COUNT(*) as total_rows FROM student_quiz_performance;
SELECT 'student_course_activities' as table_name, COUNT(*) as total_rows FROM student_course_activities;

-- 3. Check for student@example.com specifically
SELECT 'Sessions for student@example.com' as check_type, COUNT(*) as count 
FROM student_sessions WHERE student_email = 'student@example.com';

SELECT 'Quizzes for student@example.com' as check_type, COUNT(*) as count 
FROM student_quiz_performance WHERE student_email = 'student@example.com';

SELECT 'Activities for student@example.com' as check_type, COUNT(*) as count 
FROM student_course_activities WHERE student_email = 'student@example.com';

-- 4. Show actual data if it exists
SELECT student_email, login_time, is_active FROM student_sessions 
WHERE student_email = 'student@example.com' 
ORDER BY login_time DESC LIMIT 3;

SELECT student_email, quiz_name, score_percentage, start_time FROM student_quiz_performance 
WHERE student_email = 'student@example.com' 
ORDER BY start_time DESC LIMIT 3;

-- 5. Check today's date vs data dates
SELECT NOW() as current_time, CURRENT_DATE as current_date;

SELECT DATE(login_time) as session_date, COUNT(*) as sessions_count 
FROM student_sessions 
GROUP BY DATE(login_time) 
ORDER BY session_date DESC LIMIT 5; 