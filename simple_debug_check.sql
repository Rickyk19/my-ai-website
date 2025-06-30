-- Simple Debug Check - No Complex Joins
-- Run this to see what's in your database

-- 1. Check if tables exist
SELECT tablename FROM pg_tables WHERE tablename LIKE 'student_%' ORDER BY tablename;

-- 2. Count rows in each table
SELECT 'student_sessions' as table_name, COUNT(*) as row_count FROM student_sessions;
SELECT 'student_quiz_performance' as table_name, COUNT(*) as row_count FROM student_quiz_performance;
SELECT 'student_course_activities' as table_name, COUNT(*) as row_count FROM student_course_activities;
SELECT 'student_page_visits' as table_name, COUNT(*) as row_count FROM student_page_visits;

-- 3. Check specific student data
SELECT 'Data for student@example.com:' as info;
SELECT COUNT(*) as sessions FROM student_sessions WHERE student_email = 'student@example.com';
SELECT COUNT(*) as quizzes FROM student_quiz_performance WHERE student_email = 'student@example.com';
SELECT COUNT(*) as activities FROM student_course_activities WHERE student_email = 'student@example.com';

-- 4. Show any recent data (simple)
SELECT 'Recent sessions:' as info;
SELECT student_email, login_time, device_type FROM student_sessions ORDER BY login_time DESC LIMIT 5;

SELECT 'Recent quiz results:' as info;
SELECT student_email, course_name, quiz_name, score_percentage FROM student_quiz_performance ORDER BY start_time DESC LIMIT 5; 
