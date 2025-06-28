-- =====================================================
-- REAL-TIME TRACKING TEST - Insert Current Activities
-- This will create immediate data that should show in the dashboard
-- =====================================================

-- 1. Create the essential tracking tables (if they don't exist)
CREATE TABLE IF NOT EXISTS student_sessions (
    id BIGSERIAL PRIMARY KEY,
    session_id TEXT UNIQUE NOT NULL,
    student_email TEXT NOT NULL,
    student_name TEXT,
    login_time TIMESTAMPTZ DEFAULT NOW(),
    logout_time TIMESTAMPTZ,
    session_duration_minutes INTEGER,
    device_type TEXT DEFAULT 'Desktop',
    browser TEXT DEFAULT 'Chrome',
    operating_system TEXT DEFAULT 'Windows',
    location_country TEXT DEFAULT 'United States',
    location_city TEXT DEFAULT 'New York',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS student_quiz_performance (
    id BIGSERIAL PRIMARY KEY,
    student_email TEXT NOT NULL,
    session_id TEXT,
    course_id INTEGER,
    course_name TEXT NOT NULL,
    quiz_id INTEGER,
    quiz_name TEXT NOT NULL,
    start_time TIMESTAMPTZ DEFAULT NOW(),
    end_time TIMESTAMPTZ DEFAULT NOW(),
    time_taken_minutes INTEGER DEFAULT 5,
    questions_total INTEGER NOT NULL,
    questions_attempted INTEGER,
    correct_answers INTEGER NOT NULL,
    wrong_answers INTEGER,
    score_percentage NUMERIC(5,2),
    pass_status BOOLEAN,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS student_course_activities (
    id BIGSERIAL PRIMARY KEY,
    student_email TEXT NOT NULL,
    session_id TEXT,
    course_id INTEGER,
    course_name TEXT NOT NULL,
    class_id INTEGER,
    class_name TEXT,
    activity_type TEXT NOT NULL,
    activity_details TEXT,
    activity_time TIMESTAMPTZ DEFAULT NOW(),
    time_spent_minutes INTEGER DEFAULT 0,
    progress_percentage INTEGER DEFAULT 0,
    completion_status TEXT DEFAULT 'In Progress',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Insert CURRENT session for the user who's testing this right now
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
    'session_current_' || EXTRACT(EPOCH FROM NOW()),
    'student@example.com',
    'Test Student',
    NOW(),
    'Desktop',
    'Chrome',
    'Windows',
    'United States',
    'New York',
    true
) ON CONFLICT (session_id) DO NOTHING;

-- 3. Insert CURRENT quiz performance (student just completed these quizzes RIGHT NOW)
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
-- Quiz 1: Just completed Python Variables Quiz with 85% score
(
    'student@example.com',
    'session_current_' || EXTRACT(EPOCH FROM NOW()),
    1,
    'Course 1 - Python Variables Quiz',
    2,
    'Python Variables Quiz',
    NOW() - INTERVAL '8 minutes',
    NOW() - INTERVAL '3 minutes',
    5,
    8,
    8,
    7,
    1,
    87.50,
    true
),
-- Quiz 2: Just completed AI Basics Quiz with 90% score  
(
    'student@example.com',
    'session_current_' || EXTRACT(EPOCH FROM NOW()),
    2,
    'Course 2 - AI Basics Quiz',
    3,
    'AI Basics Quiz',
    NOW() - INTERVAL '3 minutes',
    NOW(),
    3,
    10,
    10,
    9,
    1,
    90.00,
    true
);

-- 4. Insert CURRENT course activities (student just watched videos)
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
-- Activity 1: Watched Python introduction video
(
    'student@example.com',
    'session_current_' || EXTRACT(EPOCH FROM NOW()),
    1,
    'Python Basics Course',
    1,
    'Introduction to Python Variables',
    'Video Watched',
    'Completed watching Introduction to Python Variables lesson',
    NOW() - INTERVAL '15 minutes',
    12,
    100,
    'Completed'
),
-- Activity 2: Started AI fundamentals video
(
    'student@example.com',
    'session_current_' || EXTRACT(EPOCH FROM NOW()),
    2,
    'AI Fundamentals Course',
    1,
    'What is Artificial Intelligence?',
    'Video Started',
    'Started watching AI fundamentals lesson',
    NOW() - INTERVAL '5 minutes',
    3,
    45,
    'In Progress'
);

-- 5. Show confirmation that data was inserted
SELECT 
    '✅ REAL-TIME TRACKING DATA INSERTED!' as status,
    COUNT(*) as sessions_created
FROM student_sessions 
WHERE student_email = 'student@example.com' 
AND login_time > NOW() - INTERVAL '1 hour';

SELECT 
    '📝 Quiz Performance Recorded:' as status,
    COUNT(*) as quizzes_completed,
    AVG(score_percentage) as avg_score
FROM student_quiz_performance 
WHERE student_email = 'student@example.com' 
AND start_time > NOW() - INTERVAL '1 hour';

SELECT 
    '📚 Course Activities Recorded:' as status,
    COUNT(*) as activities_logged
FROM student_course_activities 
WHERE student_email = 'student@example.com' 
AND activity_time > NOW() - INTERVAL '1 hour';

-- 6. Show what should appear in the Analytics Dashboard
SELECT 
    '🔔 THIS SHOULD NOW APPEAR IN ANALYTICS DASHBOARD:' as message,
    'Go to Analytics Dashboard and refresh - you should see TODAY''s real activities!' as instruction;

SELECT 
    'Recent Quiz Results:' as section,
    quiz_name,
    score_percentage || '%' as score,
    'Completed ' || EXTRACT(MINUTES FROM (NOW() - end_time)) || ' minutes ago' as when_completed
FROM student_quiz_performance 
WHERE student_email = 'student@example.com'
AND start_time > NOW() - INTERVAL '1 hour'
ORDER BY end_time DESC;

SELECT 
    'Recent Course Activities:' as section,
    course_name,
    activity_type,
    'Done ' || EXTRACT(MINUTES FROM (NOW() - activity_time)) || ' minutes ago' as when_done
FROM student_course_activities 
WHERE student_email = 'student@example.com'
AND activity_time > NOW() - INTERVAL '1 hour'
ORDER BY activity_time DESC; 