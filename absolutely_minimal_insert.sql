-- Absolutely Minimal Insert - Generates session_id automatically
-- This handles the NOT NULL constraint on session_id

-- Step 1: Clean up existing data
DELETE FROM student_course_activities WHERE student_email = 'student@example.com';
DELETE FROM student_quiz_performance WHERE student_email = 'student@example.com';  
DELETE FROM student_sessions WHERE student_email = 'student@example.com';

-- Step 2: Insert sessions with generated session_id
INSERT INTO student_sessions (
    session_id,
    student_email, 
    student_name, 
    login_time
) VALUES 
-- Generate unique session IDs
('sess_' || extract(epoch from now())::text, 'student@example.com', 'John Doe', NOW() - INTERVAL '2 hours'),
('sess_' || (extract(epoch from now()) + 1)::text, 'student@example.com', 'John Doe', NOW() - INTERVAL '1 day');

-- Step 3: Insert quiz results (with all required fields)
INSERT INTO student_quiz_performance (
    student_email,
    course_name,
    quiz_name,
    start_time,
    score_percentage,
    questions_total,
    questions_correct,
    pass_status
) VALUES 
('student@example.com', 'Python Basics', 'Python Quiz', NOW() - INTERVAL '1 hour', 80.00, 10, 8, true),
('student@example.com', 'AI Fundamentals', 'AI Quiz', NOW() - INTERVAL '30 minutes', 83.33, 12, 10, true);

-- Step 4: Insert activities (minimal columns)
INSERT INTO student_course_activities (
    student_email,
    course_name,
    activity_type,
    timestamp
) VALUES 
('student@example.com', 'Python Basics', 'video_watch', NOW() - INTERVAL '2 hours'),
('student@example.com', 'AI Fundamentals', 'quiz_attempt', NOW() - INTERVAL '30 minutes');

-- Step 5: Verify data
SELECT 'SUCCESS: Minimal data inserted!' as status;

-- Show what we have
SELECT COUNT(*) as sessions FROM student_sessions WHERE student_email = 'student@example.com';
SELECT COUNT(*) as quizzes FROM student_quiz_performance WHERE student_email = 'student@example.com';
SELECT COUNT(*) as activities FROM student_course_activities WHERE student_email = 'student@example.com';

-- Show the actual data
SELECT session_id, student_email, login_time FROM student_sessions WHERE student_email = 'student@example.com';
SELECT course_name, quiz_name, score_percentage FROM student_quiz_performance WHERE student_email = 'student@example.com';

SELECT 'Now refresh your Analytics Dashboard!' as final_message; 