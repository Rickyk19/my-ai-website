-- DEBUG COMPREHENSIVE DATA
-- Check if all the data was inserted correctly and see what the Analytics Dashboard should be showing

-- Check sessions data
SELECT 'SESSIONS DATA:' as section;
SELECT 
    student_email,
    session_id,
    login_time,
    logout_time,
    session_duration_minutes,
    device_type,
    browser,
    location_city || ', ' || location_country as location,
    is_active
FROM student_sessions 
WHERE student_email = 'student@example.com'
ORDER BY login_time DESC;

-- Check quiz performance data  
SELECT 'QUIZ PERFORMANCE DATA:' as section;
SELECT 
    student_email,
    course_name,
    quiz_name,
    start_time,
    end_time,
    score_percentage || '%' as score,
    correct_answers || '/' || questions_total as answers,
    time_taken_minutes || ' min' as duration,
    CASE WHEN pass_status THEN 'PASSED' ELSE 'FAILED' END as status
FROM student_quiz_performance 
WHERE student_email = 'student@example.com'
ORDER BY start_time DESC;

-- Check course activities data
SELECT 'COURSE ACTIVITIES DATA:' as section;
SELECT 
    student_email,
    course_name,
    activity_type,
    activity_time,
    time_spent_minutes || ' min' as time_spent,
    progress_percentage || '%' as progress,
    completion_status,
    activity_details
FROM student_course_activities 
WHERE student_email = 'student@example.com'
ORDER BY activity_time DESC;

-- ANALYTICS SUMMARY (what the dashboard should show)
SELECT 'EXPECTED ANALYTICS SUMMARY:' as section;

-- Total Sessions
SELECT 
    COUNT(*) as total_sessions,
    SUM(session_duration_minutes) as total_time_minutes,
    AVG(session_duration_minutes) as avg_session_duration,
    COUNT(CASE WHEN is_active THEN 1 END) as active_sessions
FROM student_sessions 
WHERE student_email = 'student@example.com';

-- Quiz Analytics
SELECT 
    COUNT(*) as total_quizzes_completed,
    ROUND(AVG(score_percentage), 2) as average_quiz_score,
    SUM(questions_total) as total_questions_answered,
    SUM(correct_answers) as total_correct_answers,
    COUNT(CASE WHEN pass_status THEN 1 END) as quizzes_passed
FROM student_quiz_performance 
WHERE student_email = 'student@example.com';

-- Course Activity Analytics
SELECT 
    COUNT(*) as total_activities,
    COUNT(DISTINCT course_name) as unique_courses_accessed,
    SUM(time_spent_minutes) as total_study_time_minutes,
    COUNT(CASE WHEN completion_status = 'Completed' THEN 1 END) as completed_activities
FROM student_course_activities 
WHERE student_email = 'student@example.com';

-- Course Progress by Course
SELECT 
    'COURSE PROGRESS BREAKDOWN:' as section,
    course_name,
    COUNT(*) as activities_count,
    SUM(time_spent_minutes) as time_spent_minutes,
    MAX(activity_time) as last_activity
FROM student_course_activities 
WHERE student_email = 'student@example.com'
GROUP BY course_name
ORDER BY last_activity DESC;

SELECT '✅ If you see data above, the Analytics Dashboard should show REAL numbers instead of N/A!' as result; 