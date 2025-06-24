-- TEMPORARY DISABLE RLS FOR TESTING
-- Run this in your Supabase SQL Editor to fix the course loading issue

-- Disable RLS for courses table (temporarily for testing)
ALTER TABLE courses DISABLE ROW LEVEL SECURITY;

-- Disable RLS for other related tables
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;

-- Check if data exists
SELECT COUNT(*) as total_courses FROM courses;
SELECT id, name, instructor FROM courses ORDER BY id LIMIT 5;

-- This should show your 20 courses
-- After testing, you can re-enable RLS if needed:
-- ALTER TABLE courses ENABLE ROW LEVEL SECURITY; 