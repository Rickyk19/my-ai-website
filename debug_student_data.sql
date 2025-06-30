-- =====================================================
-- DEBUG STUDENT DATA - Check if data exists
-- =====================================================

-- 1. Check if student@example.com exists in any table
SELECT 'Checking student_sessions...' as step;
SELECT COUNT(*) as session_count, 
       MIN(login_time) as earliest_session,
       MAX(login_time) as latest_session
FROM student_sessions 
WHERE student_email = 'student@example.com';

SELECT 'Recent sessions for student@example.com:' as step;
SELECT session_id, login_time, is_active 
FROM student_sessions 
WHERE student_email = 'student@example.com' 
ORDER BY login_time DESC 
LIMIT 5;

-- 2. Check quiz data
SELECT 'Checking student_quiz_performance...' as step;
SELECT COUNT(*) as quiz_count,
       MIN(start_time) as earliest_quiz,
       MAX(start_time) as latest_quiz
FROM student_quiz_performance 
WHERE student_email = 'student@example.com';

SELECT 'Recent quiz results:' as step;
SELECT quiz_name, score_percentage, start_time 
FROM student_quiz_performance 
WHERE student_email = 'student@example.com' 
ORDER BY start_time DESC 
LIMIT 5;

-- 3. Check activity data
SELECT 'Checking student_course_activities...' as step;
SELECT COUNT(*) as activity_count,
       MIN(activity_time) as earliest_activity,
       MAX(activity_time) as latest_activity
FROM student_course_activities 
WHERE student_email = 'student@example.com';

-- 4. Check ALL students in database (to see what emails exist)
SELECT 'All unique student emails in database:' as step;
SELECT DISTINCT student_email, COUNT(*) as session_count 
FROM student_sessions 
GROUP BY student_email 
ORDER BY session_count DESC;

-- 5. Check today's date vs data dates
SELECT 'Current database time and date:' as step;
SELECT NOW() as current_timestamp, 
       CURRENT_DATE as current_date,
       EXTRACT(timezone from NOW()) as timezone_info;

-- 6. Check if any data exists for today (2025-06-27)
SELECT 'Data for 2025-06-27:' as step;
SELECT table_name, count
FROM (
  SELECT 'sessions' as table_name, COUNT(*) as count 
  FROM student_sessions 
  WHERE DATE(login_time) = '2025-06-27'
  
  UNION ALL
  
  SELECT 'quizzes' as table_name, COUNT(*) as count 
  FROM student_quiz_performance 
  WHERE DATE(start_time) = '2025-06-27'
  
  UNION ALL
  
  SELECT 'activities' as table_name, COUNT(*) as count 
  FROM student_course_activities 
  WHERE DATE(activity_time) = '2025-06-27'
) subquery; 
