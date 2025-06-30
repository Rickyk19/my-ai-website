-- =============================================
-- ADD CLASSES FOR ALL 20 COURSES - BILLION HOPES
-- This will make ALL courses show in Quiz Manager
-- KEEPS existing course data (Dr. Sarah Johnson, etc.)
-- =============================================

-- First, let's see what courses we have
SELECT 'Current courses in database:' as status;
SELECT id, name, instructor FROM courses ORDER BY id;

-- Now add classes for courses that don't have any classes yet
-- We'll add at least 1 class for each course so they ALL appear in Quiz Manager

-- Course 1: Complete Python Programming Masterclass
INSERT INTO course_classes (course_id, class_number, title, description, video_url, created_at) 
SELECT 1, 1, 'Python Introduction & Setup', 'Getting started with Python programming', 'https://www.youtube.com/embed/_zgZ0g8EbF4', NOW()
WHERE NOT EXISTS (SELECT 1 FROM course_classes WHERE course_id = 1 AND class_number = 1);

INSERT INTO course_classes (course_id, class_number, title, description, video_url, created_at) 
SELECT 1, 2, 'Variables and Data Types', 'Understanding Python variables and data types', 'https://www.youtube.com/embed/_zgZ0g8EbF4', NOW()
WHERE NOT EXISTS (SELECT 1 FROM course_classes WHERE course_id = 1 AND class_number = 2);

INSERT INTO course_classes (course_id, class_number, title, description, video_url, created_at) 
SELECT 1, 3, 'Control Structures', 'If statements, loops, and conditional logic', 'https://www.youtube.com/embed/_zgZ0g8EbF4', NOW()
WHERE NOT EXISTS (SELECT 1 FROM course_classes WHERE course_id = 1 AND class_number = 3);

-- Course 2: Machine Learning & AI Fundamentals
INSERT INTO course_classes (course_id, class_number, title, description, video_url, created_at) 
SELECT 2, 1, 'Introduction to Machine Learning', 'ML concepts and getting started', 'https://www.youtube.com/embed/_zgZ0g8EbF4', NOW()
WHERE NOT EXISTS (SELECT 1 FROM course_classes WHERE course_id = 2 AND class_number = 1);

INSERT INTO course_classes (course_id, class_number, title, description, video_url, created_at) 
SELECT 2, 2, 'Data Preprocessing', 'Preparing data for machine learning', 'https://www.youtube.com/embed/_zgZ0g8EbF4', NOW()
WHERE NOT EXISTS (SELECT 1 FROM course_classes WHERE course_id = 2 AND class_number = 2);

-- Course 3: Full Stack Web Development Bootcamp
INSERT INTO course_classes (course_id, class_number, title, description, video_url, created_at) 
SELECT 3, 1, 'Web Development Overview', 'Introduction to full stack development', 'https://www.youtube.com/embed/_zgZ0g8EbF4', NOW()
WHERE NOT EXISTS (SELECT 1 FROM course_classes WHERE course_id = 3 AND class_number = 1);

INSERT INTO course_classes (course_id, class_number, title, description, video_url, created_at) 
SELECT 3, 2, 'HTML & CSS Fundamentals', 'Building blocks of web development', 'https://www.youtube.com/embed/_zgZ0g8EbF4', NOW()
WHERE NOT EXISTS (SELECT 1 FROM course_classes WHERE course_id = 3 AND class_number = 2);

-- Course 4: Data Science with R & Python
INSERT INTO course_classes (course_id, class_number, title, description, video_url, created_at) 
SELECT 4, 1, 'Data Science Introduction', 'Overview of data science and tools', 'https://www.youtube.com/embed/_zgZ0g8EbF4', NOW()
WHERE NOT EXISTS (SELECT 1 FROM course_classes WHERE course_id = 4 AND class_number = 1);

-- Course 5: Digital Marketing Mastery
INSERT INTO course_classes (course_id, class_number, title, description, video_url, created_at) 
SELECT 5, 1, 'Digital Marketing Fundamentals', 'Introduction to digital marketing', 'https://www.youtube.com/embed/_zgZ0g8EbF4', NOW()
WHERE NOT EXISTS (SELECT 1 FROM course_classes WHERE course_id = 5 AND class_number = 1);

-- Course 6: Cybersecurity Ethical Hacking
INSERT INTO course_classes (course_id, class_number, title, description, video_url, created_at) 
SELECT 6, 1, 'Cybersecurity Basics', 'Introduction to cybersecurity and ethical hacking', 'https://www.youtube.com/embed/_zgZ0g8EbF4', NOW()
WHERE NOT EXISTS (SELECT 1 FROM course_classes WHERE course_id = 6 AND class_number = 1);

-- Course 7: Cloud Computing with AWS
INSERT INTO course_classes (course_id, class_number, title, description, video_url, created_at) 
SELECT 7, 1, 'Cloud Computing Introduction', 'Getting started with AWS and cloud computing', 'https://www.youtube.com/embed/_zgZ0g8EbF4', NOW()
WHERE NOT EXISTS (SELECT 1 FROM course_classes WHERE course_id = 7 AND class_number = 1);

-- Course 8: Mobile App Development with Flutter
INSERT INTO course_classes (course_id, class_number, title, description, video_url, created_at) 
SELECT 8, 1, 'Flutter Development Basics', 'Introduction to mobile app development with Flutter', 'https://www.youtube.com/embed/_zgZ0g8EbF4', NOW()
WHERE NOT EXISTS (SELECT 1 FROM course_classes WHERE course_id = 8 AND class_number = 1);

-- Course 9: Blockchain & Cryptocurrency Development
INSERT INTO course_classes (course_id, class_number, title, description, video_url, created_at) 
SELECT 9, 1, 'Blockchain Fundamentals', 'Introduction to blockchain technology', 'https://www.youtube.com/embed/_zgZ0g8EbF4', NOW()
WHERE NOT EXISTS (SELECT 1 FROM course_classes WHERE course_id = 9 AND class_number = 1);

-- Course 10: UI/UX Design Complete Course
INSERT INTO course_classes (course_id, class_number, title, description, video_url, created_at) 
SELECT 10, 1, 'UI/UX Design Principles', 'Introduction to user interface and user experience design', 'https://www.youtube.com/embed/_zgZ0g8EbF4', NOW()
WHERE NOT EXISTS (SELECT 1 FROM course_classes WHERE course_id = 10 AND class_number = 1);

-- Course 11: DevOps Engineering Masterclass
INSERT INTO course_classes (course_id, class_number, title, description, video_url, created_at) 
SELECT 11, 1, 'DevOps Introduction', 'Getting started with DevOps practices', 'https://www.youtube.com/embed/_zgZ0g8EbF4', NOW()
WHERE NOT EXISTS (SELECT 1 FROM course_classes WHERE course_id = 11 AND class_number = 1);

-- Course 12: Game Development with Unity
INSERT INTO course_classes (course_id, class_number, title, description, video_url, created_at) 
SELECT 12, 1, 'Unity Game Development Basics', 'Introduction to game development with Unity', 'https://www.youtube.com/embed/_zgZ0g8EbF4', NOW()
WHERE NOT EXISTS (SELECT 1 FROM course_classes WHERE course_id = 12 AND class_number = 1);

-- Course 13: Business Analytics & Intelligence
INSERT INTO course_classes (course_id, class_number, title, description, video_url, created_at) 
SELECT 13, 1, 'Business Analytics Introduction', 'Getting started with business analytics', 'https://www.youtube.com/embed/_zgZ0g8EbF4', NOW()
WHERE NOT EXISTS (SELECT 1 FROM course_classes WHERE course_id = 13 AND class_number = 1);

-- Course 14: Artificial Intelligence with Deep Learning
INSERT INTO course_classes (course_id, class_number, title, description, video_url, created_at) 
SELECT 14, 1, 'AI and Deep Learning Basics', 'Introduction to artificial intelligence and deep learning', 'https://www.youtube.com/embed/_zgZ0g8EbF4', NOW()
WHERE NOT EXISTS (SELECT 1 FROM course_classes WHERE course_id = 14 AND class_number = 1);

-- Course 15: E-commerce Business Masterclass
INSERT INTO course_classes (course_id, class_number, title, description, video_url, created_at) 
SELECT 15, 1, 'E-commerce Fundamentals', 'Building and scaling an e-commerce business', 'https://www.youtube.com/embed/_zgZ0g8EbF4', NOW()
WHERE NOT EXISTS (SELECT 1 FROM course_classes WHERE course_id = 15 AND class_number = 1);

-- Course 16: Photography & Video Editing Pro
INSERT INTO course_classes (course_id, class_number, title, description, video_url, created_at) 
SELECT 16, 1, 'Photography Basics', 'Introduction to photography and composition', 'https://www.youtube.com/embed/_zgZ0g8EbF4', NOW()
WHERE NOT EXISTS (SELECT 1 FROM course_classes WHERE course_id = 16 AND class_number = 1);

-- Course 17: Financial Trading & Investment
INSERT INTO course_classes (course_id, class_number, title, description, video_url, created_at) 
SELECT 17, 1, 'Trading Fundamentals', 'Introduction to financial trading and investment', 'https://www.youtube.com/embed/_zgZ0g8EbF4', NOW()
WHERE NOT EXISTS (SELECT 1 FROM course_classes WHERE course_id = 17 AND class_number = 1);

-- Course 18: Content Creation & Social Media
INSERT INTO course_classes (course_id, class_number, title, description, video_url, created_at) 
SELECT 18, 1, 'Content Creation Basics', 'Creating engaging content for social media', 'https://www.youtube.com/embed/_zgZ0g8EbF4', NOW()
WHERE NOT EXISTS (SELECT 1 FROM course_classes WHERE course_id = 18 AND class_number = 1);

-- Course 19: Project Management Professional
INSERT INTO course_classes (course_id, class_number, title, description, video_url, created_at) 
SELECT 19, 1, 'Project Management Fundamentals', 'Introduction to project management principles', 'https://www.youtube.com/embed/_zgZ0g8EbF4', NOW()
WHERE NOT EXISTS (SELECT 1 FROM course_classes WHERE course_id = 19 AND class_number = 1);

-- Course 20: Advanced Excel & VBA Programming
INSERT INTO course_classes (course_id, class_number, title, description, video_url, created_at) 
SELECT 20, 1, 'Advanced Excel Techniques', 'Mastering advanced Excel functions and VBA', 'https://www.youtube.com/embed/_zgZ0g8EbF4', NOW()
WHERE NOT EXISTS (SELECT 1 FROM course_classes WHERE course_id = 20 AND class_number = 1);

-- Ensure student is enrolled in all courses
INSERT INTO orders (course_name, course_id, amount, customer_name, customer_email, status, created_at) 
SELECT c.name, c.id, c.price, 'John Doe', 'student@example.com', 'completed', NOW()
FROM courses c
WHERE c.id NOT IN (SELECT course_id FROM orders WHERE customer_email = 'student@example.com');

-- Check final result
SELECT 'FINAL RESULT:' as status;
SELECT 
    c.id,
    c.name,
    c.instructor,
    COUNT(cc.id) as class_count,
    CASE WHEN COUNT(cc.id) > 0 THEN '✅ Will show in Quiz Manager' ELSE '❌ Hidden from Quiz Manager' END as quiz_manager_status
FROM courses c
LEFT JOIN course_classes cc ON c.id = cc.course_id
GROUP BY c.id, c.name, c.instructor
ORDER BY c.id;

SELECT 'SUCCESS: All 20 courses now have classes and will show in Quiz Manager!' as result; 
