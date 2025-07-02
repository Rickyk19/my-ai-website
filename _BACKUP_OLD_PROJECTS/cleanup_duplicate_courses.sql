-- Cleanup script to remove duplicate courses and ensure exactly 20 courses
-- This will delete the duplicate courses (IDs 21-32) and keep the original ones (IDs 1-20)

-- Delete duplicate courses (IDs 21-32)
DELETE FROM courses WHERE id BETWEEN 21 AND 32;

-- Delete any related course_classes for these duplicate courses
DELETE FROM course_classes WHERE course_id BETWEEN 21 AND 32;

-- Delete any related orders for these duplicate courses  
DELETE FROM orders WHERE course_id BETWEEN 21 AND 32;

-- Delete any related course_comments for these duplicate courses
DELETE FROM course_comments WHERE course_id BETWEEN 21 AND 32;

-- Verify the cleanup - should show exactly 20 courses
SELECT 'Total Courses' as info, count(*) as count FROM courses
UNION ALL
SELECT 'Total Course Classes', count(*) FROM course_classes
UNION ALL  
SELECT 'Total Orders', count(*) FROM orders
UNION ALL
SELECT 'Total Comments', count(*) FROM course_comments;

-- Show the 20 unique courses that remain
SELECT id, name, instructor FROM courses ORDER BY id; 
