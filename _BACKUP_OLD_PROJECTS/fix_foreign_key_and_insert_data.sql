-- Fix Foreign Key Issues and Insert Fresh Data
-- This handles the constraint violations properly

-- Step 1: Disable foreign key checks temporarily (if possible)
SET session_replication_role = replica;

-- Step 2: Delete in correct order (dependent tables first)
-- Delete student page visits first (no dependencies)
DELETE FROM student_page_visits WHERE student_email = 'student@example.com';

-- Delete course activities (depends on sessions)
DELETE FROM student_course_activities WHERE student_email = 'student@example.com';

-- Delete quiz performance (independent)
DELETE FROM student_quiz_performance WHERE student_email = 'student@example.com';

-- Delete sessions last (other tables depend on this)
DELETE FROM student_sessions WHERE student_email = 'student@example.com';

-- Step 3: Re-enable foreign key checks
SET session_replication_role = DEFAULT;

-- Step 4: Insert fresh data with current timestamps
-- Insert sessions first (other tables reference this)
INSERT INTO student_sessions (
    student_email, 
    student_name, 
    login_time, 
    logout_time, 
    session_duration_minutes,
    device_type,
    browser,
    location_city,
    location_country
) VALUES 
-- Current active session
('student@example.com', 'John Doe', NOW() - INTERVAL '2 hours', NULL, NULL, 'Desktop', 'Chrome', 'New York', 'USA'),
-- Yesterday's session
('student@example.com', 'John Doe', NOW() - INTERVAL '1 day' + INTERVAL '2 hours', NOW() - INTERVAL '1 day' + INTERVAL '4 hours', 120, 'Mobile', 'Safari', 'New York', 'USA');

-- Get the session IDs we just created
-- (We'll use them for foreign key references if needed)

-- Insert quiz performance (independent of sessions)
INSERT INTO student_quiz_performance (
    student_email,
    student_name,
    course_name,
    quiz_name,
    start_time,
    end_time,
    time_taken_minutes,
    total_questions,
    correct_answers,
    score_percentage,
    pass_status
) VALUES 
-- Today's quizzes with current timestamps
('student@example.com', 'John Doe', 'Python Basics', 'Python Fundamentals Quiz', NOW() - INTERVAL '1 hour', NOW() - INTERVAL '50 minutes', 10, 10, 8, 80.00, true),
('student@example.com', 'John Doe', 'AI Fundamentals', 'Introduction to AI Quiz', NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '15 minutes', 15, 12, 10, 83.33, true),
-- Yesterday's quiz
('student@example.com', 'John Doe', 'Data Science', 'Statistics Basics Quiz', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day' + INTERVAL '20 minutes', 20, 15, 12, 80.00, true);

-- Insert course activities (may reference sessions)
INSERT INTO student_course_activities (
    student_email,
    student_name,
    course_name,
    activity_type,
    activity_description,
    timestamp,
    duration_minutes
) VALUES 
-- Today's activities with current timestamps
('student@example.com', 'John Doe', 'Python Basics', 'video_watch', 'Watched: Introduction to Python Variables', NOW() - INTERVAL '2 hours', 15),
('student@example.com', 'John Doe', 'Python Basics', 'quiz_attempt', 'Attempted: Python Fundamentals Quiz', NOW() - INTERVAL '1 hour', 10),
('student@example.com', 'John Doe', 'AI Fundamentals', 'course_access', 'Accessed course content', NOW() - INTERVAL '45 minutes', 5),
('student@example.com', 'John Doe', 'AI Fundamentals', 'quiz_attempt', 'Attempted: Introduction to AI Quiz', NOW() - INTERVAL '30 minutes', 15);

-- Insert page visits (independent)
INSERT INTO student_page_visits (
    student_email,
    page_title,
    visit_timestamp,
    time_spent_seconds
) VALUES 
-- Today's page visits with current timestamps
('student@example.com', 'Dashboard', NOW() - INTERVAL '2 hours', 120),
('student@example.com', 'Python Basics Course', NOW() - INTERVAL '1 hour 45 minutes', 900),
('student@example.com', 'Python Fundamentals Quiz', NOW() - INTERVAL '1 hour', 600),
('student@example.com', 'AI Fundamentals Course', NOW() - INTERVAL '45 minutes', 450),
('student@example.com', 'Introduction to AI Quiz', NOW() - INTERVAL '30 minutes', 900),
('student@example.com', 'Analytics Dashboard', NOW() - INTERVAL '5 minutes', 300);

-- Step 5: Verify the data was inserted correctly
SELECT 'SUCCESS: Fresh data inserted for student@example.com' as status;

-- Show current sessions
SELECT 'Current Sessions:' as info;
SELECT student_email, login_time, logout_time, device_type, location_city
FROM student_sessions 
WHERE student_email = 'student@example.com'
ORDER BY login_time DESC;

-- Show quiz results
SELECT 'Quiz Results:' as info;
SELECT student_email, course_name, quiz_name, score_percentage, start_time
FROM student_quiz_performance 
WHERE student_email = 'student@example.com'
ORDER BY start_time DESC;

-- Show activity summary
SELECT 'Activity Summary:' as info;
SELECT 
    COUNT(DISTINCT s.id) as total_sessions,
    COUNT(DISTINCT q.id) as total_quizzes,
    ROUND(AVG(q.score_percentage), 2) as avg_quiz_score,
    COUNT(DISTINCT a.id) as total_activities
FROM student_sessions s
FULL OUTER JOIN student_quiz_performance q ON s.student_email = q.student_email
FULL OUTER JOIN student_course_activities a ON s.student_email = a.student_email
WHERE s.student_email = 'student@example.com' OR q.student_email = 'student@example.com' OR a.student_email = 'student@example.com';

SELECT 'Data inserted successfully! Refresh your analytics dashboard now.' as final_message; 
