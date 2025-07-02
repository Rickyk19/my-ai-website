-- Debug: Check Current Database State for Analytics
-- Run this in your Supabase SQL Editor to see what data exists

-- 1. Check if tables exist
SELECT schemaname, tablename 
FROM pg_tables 
WHERE tablename IN ('student_sessions', 'student_quiz_performance', 'student_course_activities', 'student_page_visits')
ORDER BY tablename;

-- 2. Check student_sessions table
SELECT 'student_sessions' as table_name, COUNT(*) as row_count FROM student_sessions;
SELECT * FROM student_sessions LIMIT 5;

-- 3. Check student_quiz_performance table  
SELECT 'student_quiz_performance' as table_name, COUNT(*) as row_count FROM student_quiz_performance;
SELECT * FROM student_quiz_performance LIMIT 5;

-- 4. Check student_course_activities table
SELECT 'student_course_activities' as table_name, COUNT(*) as row_count FROM student_course_activities;
SELECT * FROM student_course_activities LIMIT 5;

-- 5. Check student_page_visits table
SELECT 'student_page_visits' as table_name, COUNT(*) as row_count FROM student_page_visits;
SELECT * FROM student_page_visits LIMIT 5;

-- 6. Check for any data for student@example.com specifically
SELECT 'Sessions for student@example.com' as info;
SELECT * FROM student_sessions WHERE student_email = 'student@example.com';

SELECT 'Quiz performance for student@example.com' as info;
SELECT * FROM student_quiz_performance WHERE student_email = 'student@example.com';

SELECT 'Course activities for student@example.com' as info;
SELECT * FROM student_course_activities WHERE student_email = 'student@example.com';

-- 7. Check Row Level Security (RLS) status
SELECT schemaname, tablename, t.hasrules as rowsecurity
FROM pg_tables t 
WHERE tablename IN ('student_sessions', 'student_quiz_performance', 'student_course_activities', 'student_page_visits');

-- 8. Show any recent data (last 7 days)
SELECT 'Recent sessions (last 7 days)' as info;
SELECT student_email, login_time, logout_time, session_duration_minutes 
FROM student_sessions 
WHERE login_time >= NOW() - INTERVAL '7 days' 
ORDER BY login_time DESC; 
