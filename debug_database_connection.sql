-- =====================================================
-- DEBUG DATABASE CONNECTION AND DATA
-- Check if data was inserted and tables exist
-- =====================================================

-- 1. Check if tables exist
SELECT 
    'Tables Check:' as section,
    table_name,
    'EXISTS' as status
FROM information_schema.tables 
WHERE table_name IN ('student_sessions', 'student_quiz_performance', 'student_course_activities')
ORDER BY table_name;

-- 2. Check student_sessions table data
SELECT 
    '=== STUDENT SESSIONS TABLE ===' as section;
    
SELECT 
    id,
    student_email,
    student_name,
    login_time,
    logout_time,
    is_active,
    'Session found' as status
FROM student_sessions 
WHERE student_email = 'student@example.com'
ORDER BY login_time DESC
LIMIT 5;

-- 3. Check student_quiz_performance table data  
SELECT 
    '=== QUIZ PERFORMANCE TABLE ===' as section;

SELECT 
    id,
    student_email,
    course_name,
    quiz_name,
    score_percentage,
    start_time,
    'Quiz found' as status
FROM student_quiz_performance 
WHERE student_email = 'student@example.com'
ORDER BY start_time DESC
LIMIT 5;

-- 4. Check student_course_activities table data
SELECT 
    '=== COURSE ACTIVITIES TABLE ===' as section;

SELECT 
    id,
    student_email,
    course_name,
    activity_type,
    activity_time,
    'Activity found' as status
FROM student_course_activities 
WHERE student_email = 'student@example.com'
ORDER BY activity_time DESC
LIMIT 5;

-- 5. Check TODAY's data specifically
SELECT 
    '=== TODAY\'S DATA CHECK ===' as section;

SELECT 
    'Sessions today:' as type,
    COUNT(*) as count
FROM student_sessions 
WHERE DATE(login_time) = CURRENT_DATE;

SELECT 
    'Quizzes today:' as type,
    COUNT(*) as count
FROM student_quiz_performance 
WHERE DATE(start_time) = CURRENT_DATE;

SELECT 
    'Activities today:' as type,
    COUNT(*) as count
FROM student_course_activities 
WHERE DATE(activity_time) = CURRENT_DATE;

-- 6. Show exact timestamps for debugging
SELECT 
    '=== TIMESTAMP DEBUG ===' as section;

SELECT 
    'Current database time:' as info,
    NOW() as current_time,
    DATE(NOW()) as current_date;

SELECT 
    'Latest session time:' as info,
    MAX(login_time) as latest_login
FROM student_sessions;

SELECT 
    'Latest quiz time:' as info,
    MAX(start_time) as latest_quiz
FROM student_quiz_performance;

-- 7. If no data found, show table structure
SELECT 
    '=== TABLE STRUCTURE CHECK ===' as section;

SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'student_sessions'
ORDER BY ordinal_position;

-- 8. Final verification query
SELECT 
    '=== VERIFICATION RESULT ===' as section;

SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM student_sessions WHERE student_email = 'student@example.com') 
        THEN '✅ DATA FOUND - Real-time tracking should work'
        ELSE '❌ NO DATA - Need to re-run insert statements'
    END as verification_result; 
