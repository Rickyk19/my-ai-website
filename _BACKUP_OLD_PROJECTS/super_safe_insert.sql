-- Super Safe Insert - Only Basic Columns
-- This avoids all potential column existence issues

-- Step 1: Clean up existing data (if any)
DELETE FROM student_course_activities WHERE student_email = 'student@example.com';
DELETE FROM student_quiz_performance WHERE student_email = 'student@example.com';  
DELETE FROM student_sessions WHERE student_email = 'student@example.com';

-- Step 2: Insert minimal session data
INSERT INTO student_sessions (
    student_email, 
    student_name, 
    login_time, 
    logout_time, 
    session_duration_minutes
) VALUES 
-- Active session 
('student@example.com', 'John Doe', NOW() - INTERVAL '2 hours', NULL, NULL),
-- Yesterday's session
('student@example.com', 'John Doe', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day' + INTERVAL '2 hours', 120);

-- Step 3: Insert quiz results
INSERT INTO student_quiz_performance (
    student_email,
    student_name,
    course_name,
    quiz_name,
    start_time,
    score_percentage,
    pass_status
) VALUES 
-- Today's quizzes
('student@example.com', 'John Doe', 'Python Basics', 'Python Fundamentals Quiz', NOW() - INTERVAL '1 hour', 80.00, true),
('student@example.com', 'John Doe', 'AI Fundamentals', 'Introduction to AI Quiz', NOW() - INTERVAL '30 minutes', 83.33, true),
-- Yesterday's quiz
('student@example.com', 'John Doe', 'Data Science', 'Statistics Basics Quiz', NOW() - INTERVAL '1 day', 80.00, true);

-- Step 4: Insert basic course activities
INSERT INTO student_course_activities (
    student_email,
    student_name,
    course_name,
    activity_type,
    timestamp
) VALUES 
-- Today's activities
('student@example.com', 'John Doe', 'Python Basics', 'video_watch', NOW() - INTERVAL '2 hours'),
('student@example.com', 'John Doe', 'Python Basics', 'quiz_attempt', NOW() - INTERVAL '1 hour'),
('student@example.com', 'John Doe', 'AI Fundamentals', 'course_access', NOW() - INTERVAL '45 minutes'),
('student@example.com', 'John Doe', 'AI Fundamentals', 'quiz_attempt', NOW() - INTERVAL '30 minutes');

-- Step 5: Verify what was inserted
SELECT 'Data insertion complete!' as status;

-- Show sessions
SELECT COUNT(*) as total_sessions FROM student_sessions WHERE student_email = 'student@example.com';
SELECT student_email, login_time, logout_time FROM student_sessions WHERE student_email = 'student@example.com' ORDER BY login_time DESC;

-- Show quiz results
SELECT COUNT(*) as total_quizzes FROM student_quiz_performance WHERE student_email = 'student@example.com';
SELECT student_email, course_name, quiz_name, score_percentage FROM student_quiz_performance WHERE student_email = 'student@example.com' ORDER BY start_time DESC;

-- Show activities  
SELECT COUNT(*) as total_activities FROM student_course_activities WHERE student_email = 'student@example.com';
SELECT student_email, course_name, activity_type FROM student_course_activities WHERE student_email = 'student@example.com' ORDER BY timestamp DESC;

SELECT 'SUCCESS! Refresh your Analytics Dashboard to see the data.' as final_message; 
