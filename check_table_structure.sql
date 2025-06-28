-- =====================================================
-- CHECK TABLE STRUCTURE - Find Actual Columns
-- =====================================================

-- Check what columns exist in each table
SELECT 'student_sessions columns:' as info;
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'student_sessions' 
ORDER BY ordinal_position;

SELECT 'student_quiz_performance columns:' as info;
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'student_quiz_performance' 
ORDER BY ordinal_position;

SELECT 'student_course_activities columns:' as info;
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'student_course_activities' 
ORDER BY ordinal_position;

SELECT 'student_page_visits columns:' as info;
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'student_page_visits' 
ORDER BY ordinal_position;

-- Check if the tables exist at all
SELECT table_name 
FROM information_schema.tables 
WHERE table_name IN ('student_sessions', 'student_quiz_performance', 'student_course_activities', 'student_page_visits')
ORDER BY table_name; 