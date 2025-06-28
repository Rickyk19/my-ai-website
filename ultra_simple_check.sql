-- Ultra Simple Database Check
-- Copy and paste each section separately if needed

-- Check 1: Do tables exist?
SELECT 'Checking tables...' as status;

-- Check 2: Try to count student_sessions
SELECT COUNT(*) as total_sessions FROM student_sessions;

-- Check 3: Try to count quiz performance  
SELECT COUNT(*) as total_quizzes FROM student_quiz_performance;

-- Check 4: Look for student@example.com specifically
SELECT COUNT(*) as student_sessions 
FROM student_sessions 
WHERE student_email = 'student@example.com';

-- Check 5: Show any existing data
SELECT student_email, login_time 
FROM student_sessions 
ORDER BY login_time DESC 
LIMIT 3; 