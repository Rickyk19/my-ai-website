-- CLEANUP DUPLICATE ORDERS IN SUPABASE DATABASE
-- This script removes duplicate course orders, keeping only the latest one for each course per user

-- First, let's see what duplicates we have
SELECT 
    customer_email,
    course_name,
    COUNT(*) as order_count,
    string_agg(id::text, ', ') as order_ids
FROM orders 
WHERE status = 'completed'
GROUP BY customer_email, course_name
HAVING COUNT(*) > 1
ORDER BY customer_email, course_name;

-- Create a backup of the current orders table (optional)
CREATE TABLE IF NOT EXISTS orders_backup AS SELECT * FROM orders;

-- Remove duplicates, keeping only the latest order for each course per user
WITH duplicate_orders AS (
    SELECT 
        id,
        ROW_NUMBER() OVER (
            PARTITION BY customer_email, course_name 
            ORDER BY created_at DESC, id DESC
        ) as row_num
    FROM orders 
    WHERE status = 'completed'
)
DELETE FROM orders 
WHERE id IN (
    SELECT id 
    FROM duplicate_orders 
    WHERE row_num > 1
);

-- Verify the cleanup - this should show only unique course enrollments per user
SELECT 
    customer_email,
    course_name,
    COUNT(*) as order_count,
    MAX(created_at) as latest_order_date
FROM orders 
WHERE status = 'completed'
GROUP BY customer_email, course_name
ORDER BY customer_email, course_name;

-- Show final count per user
SELECT 
    customer_email,
    COUNT(DISTINCT course_name) as unique_courses_enrolled,
    COUNT(*) as total_orders
FROM orders 
WHERE status = 'completed'
GROUP BY customer_email
ORDER BY customer_email;

-- If you want to see the specific courses for student@example.com
SELECT 
    id,
    course_name,
    amount,
    created_at,
    transaction_id
FROM orders 
WHERE customer_email = 'student@example.com' 
  AND status = 'completed'
ORDER BY course_name;

-- Success message
SELECT 'Duplicate orders cleanup completed! Each user now has only one order per course.' as result; 