-- DISABLE RLS FOR TESTING
ALTER TABLE courses DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY; 
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
SELECT COUNT(*) as total_courses FROM courses;

