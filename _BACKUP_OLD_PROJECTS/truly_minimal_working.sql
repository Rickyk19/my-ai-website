-- Truly Minimal Working Insert
-- Only uses columns that definitely exist based on error messages

-- Step 1: Clean up
DELETE FROM student_course_activities WHERE student_email = 'student@example.com';
DELETE FROM student_quiz_performance WHERE student_email = 'student@example.com';  
DELETE FROM student_sessions WHERE student_email = 'student@example.com';

-- Step 2: Insert sessions (only basic fields)
INSERT INTO student_sessions (
    session_id,
    student_email, 
    student_name, 
    login_time
) VALUES 
('sess_current', 'student@example.com', 'John Doe', NOW() - INTERVAL '2 hours'),
('sess_yesterday', 'student@example.com', 'John Doe', NOW() - INTERVAL '1 day');

-- Step 3: Insert quiz performance (only confirmed fields)
INSERT INTO student_quiz_performance (
    student_email,
    course_name,
    quiz_name,
    start_time,
    score_percentage,
    questions_total,
    pass_status
) VALUES 
('student@example.com', 'Python Basics', 'Python Quiz', NOW() - INTERVAL '1 hour', 80.00, 10, true),
('student@example.com', 'AI Fundamentals', 'AI Quiz', NOW() - INTERVAL '30 minutes', 83.33, 12, true);

-- Step 4: Insert activities (basic fields only)
INSERT INTO student_course_activities (
    student_email,
    course_name,
    activity_type,
    timestamp
) VALUES 
('student@example.com', 'Python Basics', 'video_watch', NOW() - INTERVAL '2 hours'),
('student@example.com', 'AI Fundamentals', 'quiz_attempt', NOW() - INTERVAL '30 minutes');

-- Step 5: Show results
SELECT 'Data inserted successfully!' as status;

-- Verify sessions
SELECT COUNT(*) as total_sessions FROM student_sessions WHERE student_email = 'student@example.com';

-- Verify quizzes  
SELECT COUNT(*) as total_quizzes FROM student_quiz_performance WHERE student_email = 'student@example.com';

-- Verify activities
SELECT COUNT(*) as total_activities FROM student_course_activities WHERE student_email = 'student@example.com';

-- Show the data
SELECT 'Sessions:' as info;
SELECT session_id, login_time FROM student_sessions WHERE student_email = 'student@example.com';

SELECT 'Quiz Results:' as info;
SELECT course_name, quiz_name, score_percentage FROM student_quiz_performance WHERE student_email = 'student@example.com';

SELECT '✅ SUCCESS! Your Analytics Dashboard should now show real data instead of N/A values!' as final_message; 
