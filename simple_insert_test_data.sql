-- =====================================================
-- SIMPLE INSERT TEST DATA ONLY
-- Just insert data if tables already exist
-- =====================================================

-- 1. Clean any existing test data first
DELETE FROM student_course_activities WHERE student_email = 'student@example.com';
DELETE FROM student_quiz_performance WHERE student_email = 'student@example.com';  
DELETE FROM student_sessions WHERE student_email = 'student@example.com';

-- 2. Insert current session
INSERT INTO student_sessions (
    session_id, 
    student_email, 
    student_name, 
    login_time, 
    logout_time,
    session_duration_minutes,
    device_type, 
    browser, 
    operating_system,
    location_country,
    location_city,
    is_active
) VALUES (
    'session_test_' || EXTRACT(EPOCH FROM NOW()),
    'student@example.com',
    'Test Student',
    NOW() - INTERVAL '30 minutes',  -- Started 30 minutes ago
    NOW() - INTERVAL '28 minutes',  -- Ended 28 minutes ago
    2,  -- 2 minute session
    'Desktop',
    'Chrome',
    'Windows',
    'United States',
    'New York',
    false  -- Session ended
);

-- 3. Insert another active session
INSERT INTO student_sessions (
    session_id, 
    student_email, 
    student_name, 
    login_time, 
    device_type, 
    browser, 
    operating_system,
    location_country,
    location_city,
    is_active
) VALUES (
    'session_active_' || EXTRACT(EPOCH FROM NOW()),
    'student@example.com',
    'Test Student',
    NOW() - INTERVAL '5 minutes',  -- Started 5 minutes ago
    'Desktop',
    'Chrome',
    'Windows',
    'United States',
    'New York',
    true  -- Still active
);

-- 4. Insert quiz results
INSERT INTO student_quiz_performance (
    student_email,
    session_id,
    course_id,
    course_name,
    quiz_id,
    quiz_name,
    start_time,
    end_time,
    time_taken_minutes,
    questions_total,
    questions_attempted,
    correct_answers,
    wrong_answers,
    score_percentage,
    pass_status
) VALUES 
-- Python Quiz Result
(
    'student@example.com',
    'session_test_' || EXTRACT(EPOCH FROM NOW()),
    1,
    'Python Basics Course',
    1,
    'Python Variables Quiz',
    NOW() - INTERVAL '25 minutes',  -- Started 25 minutes ago
    NOW() - INTERVAL '20 minutes',  -- Ended 20 minutes ago
    5,
    8,
    8,
    7,
    1,
    87.50,
    true
),
-- AI Quiz Result  
(
    'student@example.com',
    'session_active_' || EXTRACT(EPOCH FROM NOW()),
    2,
    'AI Fundamentals Course',
    2,
    'AI Basics Quiz',
    NOW() - INTERVAL '10 minutes',  -- Started 10 minutes ago
    NOW() - INTERVAL '7 minutes',   -- Ended 7 minutes ago
    3,
    10,
    10,
    9,
    1,
    90.00,
    true
);

-- 5. Insert course activities
INSERT INTO student_course_activities (
    student_email,
    session_id,
    course_id,
    course_name,
    class_id,
    class_name,
    activity_type,
    activity_details,
    activity_time,
    time_spent_minutes,
    progress_percentage,
    completion_status
) VALUES 
-- Video Activity 1
(
    'student@example.com',
    'session_test_' || EXTRACT(EPOCH FROM NOW()),
    1,
    'Python Basics Course',
    1,
    'Introduction to Python',
    'Video Watched',
    'Completed Python introduction video',
    NOW() - INTERVAL '35 minutes',
    15,
    100,
    'Completed'
),
-- Video Activity 2
(
    'student@example.com',
    'session_active_' || EXTRACT(EPOCH FROM NOW()),
    2,
    'AI Fundamentals Course',
    1,
    'What is AI?',
    'Video Started',
    'Started watching AI fundamentals',
    NOW() - INTERVAL '12 minutes',
    8,
    75,
    'In Progress'
);

-- 6. Verify the data was inserted
SELECT '✅ VERIFICATION - Data inserted successfully!' as status;

SELECT 
    'Sessions:' as type,
    COUNT(*) as count,
    'for student@example.com' as note
FROM student_sessions 
WHERE student_email = 'student@example.com';

SELECT 
    'Quizzes:' as type,
    COUNT(*) as count,
    'for student@example.com' as note
FROM student_quiz_performance 
WHERE student_email = 'student@example.com';

SELECT 
    'Activities:' as type,
    COUNT(*) as count,
    'for student@example.com' as note
FROM student_course_activities 
WHERE student_email = 'student@example.com';

-- 7. Show the actual data that was inserted
SELECT 
    '=== INSERTED SESSIONS ===' as section;

SELECT 
    session_id,
    login_time,
    logout_time,
    is_active,
    session_duration_minutes
FROM student_sessions 
WHERE student_email = 'student@example.com'
ORDER BY login_time DESC;

SELECT 
    '=== INSERTED QUIZZES ===' as section;

SELECT 
    quiz_name,
    score_percentage || '%' as score,
    start_time,
    pass_status
FROM student_quiz_performance 
WHERE student_email = 'student@example.com'
ORDER BY start_time DESC;

SELECT 
    '=== INSERTED ACTIVITIES ===' as section;

SELECT 
    course_name,
    activity_type,
    activity_time,
    completion_status
FROM student_course_activities 
WHERE student_email = 'student@example.com'
ORDER BY activity_time DESC; 