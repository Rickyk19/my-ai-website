-- =====================================================
-- DISABLE RLS FOR ANALYTICS TABLES
-- This allows the React app to access the student data
-- =====================================================

-- Disable RLS on all student tracking tables
ALTER TABLE student_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE student_quiz_performance DISABLE ROW LEVEL SECURITY;
ALTER TABLE student_course_activities DISABLE ROW LEVEL SECURITY;
ALTER TABLE student_page_visits DISABLE ROW LEVEL SECURITY;

-- Grant SELECT permissions to anonymous users (for the React app)
GRANT SELECT ON student_sessions TO anon;
GRANT SELECT ON student_quiz_performance TO anon;
GRANT SELECT ON student_course_activities TO anon;
GRANT SELECT ON student_page_visits TO anon;

-- Also grant to authenticated users
GRANT SELECT ON student_sessions TO authenticated;
GRANT SELECT ON student_quiz_performance TO authenticated;
GRANT SELECT ON student_course_activities TO authenticated;
GRANT SELECT ON student_page_visits TO authenticated;

-- Verify the changes
SELECT 'RLS disabled and permissions granted' as status;

-- Show current table permissions
SELECT schemaname, tablename, grantee, privilege_type
FROM information_schema.role_table_grants 
WHERE table_name IN ('student_sessions', 'student_quiz_performance', 'student_course_activities', 'student_page_visits')
ORDER BY tablename, grantee; 
