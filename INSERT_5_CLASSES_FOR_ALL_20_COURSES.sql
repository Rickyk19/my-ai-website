-- =============================================
-- INSERT 5 CLASSES FOR ALL 20 COURSES
-- Run this SQL script in your Supabase SQL Editor
-- =============================================

-- First, ensure the course_classes table exists
CREATE TABLE IF NOT EXISTS course_classes (
    id SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL,
    class_number INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    video_url VARCHAR(500),
    duration_minutes INTEGER DEFAULT 45,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(course_id, class_number)
);

-- Clear existing course_classes data to avoid duplicates
DELETE FROM course_classes;

-- Insert 5 classes for each of the 20 courses
-- Using consistent class structure for all courses

-- COURSE 1: Python Programming (5 classes)
INSERT INTO course_classes (course_id, class_number, title, description, video_url, duration_minutes) VALUES
(1, 1, 'Class 1: Fundamentals & Introduction', 'Basic concepts and introduction to Python programming', 'https://www.youtube.com/embed/H7wd6JmTd18', 45),
(1, 2, 'Class 2: Core Concepts & Theory', 'Core theoretical concepts of Python programming', 'https://www.youtube.com/embed/H7wd6JmTd18', 60),
(1, 3, 'Class 3: Practical Applications', 'Hands-on practical work with Python', 'https://www.youtube.com/embed/H7wd6JmTd18', 75),
(1, 4, 'Class 4: Advanced Techniques', 'Advanced Python methods and techniques', 'https://www.youtube.com/embed/H7wd6JmTd18', 90),
(1, 5, 'Class 5: Projects & Assessment', 'Final Python projects and evaluation', 'https://www.youtube.com/embed/H7wd6JmTd18', 60);

-- COURSE 2: Machine Learning (5 classes)
INSERT INTO course_classes (course_id, class_number, title, description, video_url, duration_minutes) VALUES
(2, 1, 'Class 1: Fundamentals & Introduction', 'Basic concepts and introduction to Machine Learning', 'https://www.youtube.com/embed/H7wd6JmTd18', 45),
(2, 2, 'Class 2: Core Concepts & Theory', 'Core theoretical concepts of Machine Learning', 'https://www.youtube.com/embed/H7wd6JmTd18', 60),
(2, 3, 'Class 3: Practical Applications', 'Hands-on practical work with ML algorithms', 'https://www.youtube.com/embed/H7wd6JmTd18', 75),
(2, 4, 'Class 4: Advanced Techniques', 'Advanced ML methods and techniques', 'https://www.youtube.com/embed/H7wd6JmTd18', 90),
(2, 5, 'Class 5: Projects & Assessment', 'Final ML projects and evaluation', 'https://www.youtube.com/embed/H7wd6JmTd18', 60);

-- COURSE 3: Full Stack Development (5 classes)
INSERT INTO course_classes (course_id, class_number, title, description, video_url, duration_minutes) VALUES
(3, 1, 'Class 1: Fundamentals & Introduction', 'Basic concepts and introduction to Full Stack Development', 'https://www.youtube.com/embed/H7wd6JmTd18', 45),
(3, 2, 'Class 2: Core Concepts & Theory', 'Core theoretical concepts of Full Stack Development', 'https://www.youtube.com/embed/H7wd6JmTd18', 60),
(3, 3, 'Class 3: Practical Applications', 'Hands-on practical work with full stack technologies', 'https://www.youtube.com/embed/H7wd6JmTd18', 75),
(3, 4, 'Class 4: Advanced Techniques', 'Advanced full stack methods and techniques', 'https://www.youtube.com/embed/H7wd6JmTd18', 90),
(3, 5, 'Class 5: Projects & Assessment', 'Final full stack projects and evaluation', 'https://www.youtube.com/embed/H7wd6JmTd18', 60);

-- COURSE 4: Data Science with Python (5 classes)
INSERT INTO course_classes (course_id, class_number, title, description, video_url, duration_minutes) VALUES
(4, 1, 'Class 1: Fundamentals & Introduction', 'Basic concepts and introduction to Data Science', 'https://www.youtube.com/embed/H7wd6JmTd18', 45),
(4, 2, 'Class 2: Core Concepts & Theory', 'Core theoretical concepts of Data Science', 'https://www.youtube.com/embed/H7wd6JmTd18', 60),
(4, 3, 'Class 3: Practical Applications', 'Hands-on practical work with data analysis', 'https://www.youtube.com/embed/H7wd6JmTd18', 75),
(4, 4, 'Class 4: Advanced Techniques', 'Advanced data science methods and techniques', 'https://www.youtube.com/embed/H7wd6JmTd18', 90),
(4, 5, 'Class 5: Projects & Assessment', 'Final data science projects and evaluation', 'https://www.youtube.com/embed/H7wd6JmTd18', 60);

-- COURSE 5: AI Fundamentals (5 classes)
INSERT INTO course_classes (course_id, class_number, title, description, video_url, duration_minutes) VALUES
(5, 1, 'Class 1: Fundamentals & Introduction', 'Basic concepts and introduction to AI', 'https://www.youtube.com/embed/H7wd6JmTd18', 45),
(5, 2, 'Class 2: Core Concepts & Theory', 'Core theoretical concepts of AI', 'https://www.youtube.com/embed/H7wd6JmTd18', 60),
(5, 3, 'Class 3: Practical Applications', 'Hands-on practical work with AI systems', 'https://www.youtube.com/embed/H7wd6JmTd18', 75),
(5, 4, 'Class 4: Advanced Techniques', 'Advanced AI methods and techniques', 'https://www.youtube.com/embed/H7wd6JmTd18', 90),
(5, 5, 'Class 5: Projects & Assessment', 'Final AI projects and evaluation', 'https://www.youtube.com/embed/H7wd6JmTd18', 60);

-- COURSE 6: Web Development Bootcamp (5 classes)
INSERT INTO course_classes (course_id, class_number, title, description, video_url, duration_minutes) VALUES
(6, 1, 'Class 1: Fundamentals & Introduction', 'Basic concepts and introduction to Web Development', 'https://www.youtube.com/embed/H7wd6JmTd18', 45),
(6, 2, 'Class 2: Core Concepts & Theory', 'Core theoretical concepts of Web Development', 'https://www.youtube.com/embed/H7wd6JmTd18', 60),
(6, 3, 'Class 3: Practical Applications', 'Hands-on practical work with web technologies', 'https://www.youtube.com/embed/H7wd6JmTd18', 75),
(6, 4, 'Class 4: Advanced Techniques', 'Advanced web development methods and techniques', 'https://www.youtube.com/embed/H7wd6JmTd18', 90),
(6, 5, 'Class 5: Projects & Assessment', 'Final web development projects and evaluation', 'https://www.youtube.com/embed/H7wd6JmTd18', 60);

-- COURSE 7: Mobile App Development (5 classes)
INSERT INTO course_classes (course_id, class_number, title, description, video_url, duration_minutes) VALUES
(7, 1, 'Class 1: Fundamentals & Introduction', 'Basic concepts and introduction to Mobile App Development', 'https://www.youtube.com/embed/H7wd6JmTd18', 45),
(7, 2, 'Class 2: Core Concepts & Theory', 'Core theoretical concepts of Mobile App Development', 'https://www.youtube.com/embed/H7wd6JmTd18', 60),
(7, 3, 'Class 3: Practical Applications', 'Hands-on practical work with mobile technologies', 'https://www.youtube.com/embed/H7wd6JmTd18', 75),
(7, 4, 'Class 4: Advanced Techniques', 'Advanced mobile development methods and techniques', 'https://www.youtube.com/embed/H7wd6JmTd18', 90),
(7, 5, 'Class 5: Projects & Assessment', 'Final mobile app projects and evaluation', 'https://www.youtube.com/embed/H7wd6JmTd18', 60);

-- COURSE 8: DevOps and Cloud Computing (5 classes)
INSERT INTO course_classes (course_id, class_number, title, description, video_url, duration_minutes) VALUES
(8, 1, 'Class 1: Fundamentals & Introduction', 'Basic concepts and introduction to DevOps and Cloud', 'https://www.youtube.com/embed/H7wd6JmTd18', 45),
(8, 2, 'Class 2: Core Concepts & Theory', 'Core theoretical concepts of DevOps and Cloud', 'https://www.youtube.com/embed/H7wd6JmTd18', 60),
(8, 3, 'Class 3: Practical Applications', 'Hands-on practical work with DevOps tools', 'https://www.youtube.com/embed/H7wd6JmTd18', 75),
(8, 4, 'Class 4: Advanced Techniques', 'Advanced DevOps and cloud methods', 'https://www.youtube.com/embed/H7wd6JmTd18', 90),
(8, 5, 'Class 5: Projects & Assessment', 'Final DevOps projects and evaluation', 'https://www.youtube.com/embed/H7wd6JmTd18', 60);

-- COURSE 9: Cybersecurity Essentials (5 classes)
INSERT INTO course_classes (course_id, class_number, title, description, video_url, duration_minutes) VALUES
(9, 1, 'Class 1: Fundamentals & Introduction', 'Basic concepts and introduction to Cybersecurity', 'https://www.youtube.com/embed/H7wd6JmTd18', 45),
(9, 2, 'Class 2: Core Concepts & Theory', 'Core theoretical concepts of Cybersecurity', 'https://www.youtube.com/embed/H7wd6JmTd18', 60),
(9, 3, 'Class 3: Practical Applications', 'Hands-on practical work with security tools', 'https://www.youtube.com/embed/H7wd6JmTd18', 75),
(9, 4, 'Class 4: Advanced Techniques', 'Advanced cybersecurity methods and techniques', 'https://www.youtube.com/embed/H7wd6JmTd18', 90),
(9, 5, 'Class 5: Projects & Assessment', 'Final cybersecurity projects and evaluation', 'https://www.youtube.com/embed/H7wd6JmTd18', 60);

-- COURSE 10: Blockchain Development (5 classes)
INSERT INTO course_classes (course_id, class_number, title, description, video_url, duration_minutes) VALUES
(10, 1, 'Class 1: Fundamentals & Introduction', 'Basic concepts and introduction to Blockchain', 'https://www.youtube.com/embed/H7wd6JmTd18', 45),
(10, 2, 'Class 2: Core Concepts & Theory', 'Core theoretical concepts of Blockchain', 'https://www.youtube.com/embed/H7wd6JmTd18', 60),
(10, 3, 'Class 3: Practical Applications', 'Hands-on practical work with blockchain technologies', 'https://www.youtube.com/embed/H7wd6JmTd18', 75),
(10, 4, 'Class 4: Advanced Techniques', 'Advanced blockchain development methods', 'https://www.youtube.com/embed/H7wd6JmTd18', 90),
(10, 5, 'Class 5: Projects & Assessment', 'Final blockchain projects and evaluation', 'https://www.youtube.com/embed/H7wd6JmTd18', 60);

-- COURSE 11: UI/UX Design Mastery (5 classes)
INSERT INTO course_classes (course_id, class_number, title, description, video_url, duration_minutes) VALUES
(11, 1, 'Class 1: Fundamentals & Introduction', 'Basic concepts and introduction to UI/UX Design', 'https://www.youtube.com/embed/H7wd6JmTd18', 45),
(11, 2, 'Class 2: Core Concepts & Theory', 'Core theoretical concepts of UI/UX Design', 'https://www.youtube.com/embed/H7wd6JmTd18', 60),
(11, 3, 'Class 3: Practical Applications', 'Hands-on practical work with design tools', 'https://www.youtube.com/embed/H7wd6JmTd18', 75),
(11, 4, 'Class 4: Advanced Techniques', 'Advanced design methods and techniques', 'https://www.youtube.com/embed/H7wd6JmTd18', 90),
(11, 5, 'Class 5: Projects & Assessment', 'Final design projects and evaluation', 'https://www.youtube.com/embed/H7wd6JmTd18', 60);

-- COURSE 12: Digital Marketing (5 classes)
INSERT INTO course_classes (course_id, class_number, title, description, video_url, duration_minutes) VALUES
(12, 1, 'Class 1: Fundamentals & Introduction', 'Basic concepts and introduction to Digital Marketing', 'https://www.youtube.com/embed/H7wd6JmTd18', 45),
(12, 2, 'Class 2: Core Concepts & Theory', 'Core theoretical concepts of Digital Marketing', 'https://www.youtube.com/embed/H7wd6JmTd18', 60),
(12, 3, 'Class 3: Practical Applications', 'Hands-on practical work with marketing tools', 'https://www.youtube.com/embed/H7wd6JmTd18', 75),
(12, 4, 'Class 4: Advanced Techniques', 'Advanced marketing methods and techniques', 'https://www.youtube.com/embed/H7wd6JmTd18', 90),
(12, 5, 'Class 5: Projects & Assessment', 'Final marketing projects and evaluation', 'https://www.youtube.com/embed/H7wd6JmTd18', 60);

-- COURSE 13: Game Development with Unity (5 classes)
INSERT INTO course_classes (course_id, class_number, title, description, video_url, duration_minutes) VALUES
(13, 1, 'Class 1: Fundamentals & Introduction', 'Basic concepts and introduction to Game Development', 'https://www.youtube.com/embed/H7wd6JmTd18', 45),
(13, 2, 'Class 2: Core Concepts & Theory', 'Core theoretical concepts of Game Development', 'https://www.youtube.com/embed/H7wd6JmTd18', 60),
(13, 3, 'Class 3: Practical Applications', 'Hands-on practical work with Unity engine', 'https://www.youtube.com/embed/H7wd6JmTd18', 75),
(13, 4, 'Class 4: Advanced Techniques', 'Advanced game development methods', 'https://www.youtube.com/embed/H7wd6JmTd18', 90),
(13, 5, 'Class 5: Projects & Assessment', 'Final game projects and evaluation', 'https://www.youtube.com/embed/H7wd6JmTd18', 60);

-- COURSE 14: Business Analytics (5 classes)
INSERT INTO course_classes (course_id, class_number, title, description, video_url, duration_minutes) VALUES
(14, 1, 'Class 1: Fundamentals & Introduction', 'Basic concepts and introduction to Business Analytics', 'https://www.youtube.com/embed/H7wd6JmTd18', 45),
(14, 2, 'Class 2: Core Concepts & Theory', 'Core theoretical concepts of Business Analytics', 'https://www.youtube.com/embed/H7wd6JmTd18', 60),
(14, 3, 'Class 3: Practical Applications', 'Hands-on practical work with analytics tools', 'https://www.youtube.com/embed/H7wd6JmTd18', 75),
(14, 4, 'Class 4: Advanced Techniques', 'Advanced analytics methods and techniques', 'https://www.youtube.com/embed/H7wd6JmTd18', 90),
(14, 5, 'Class 5: Projects & Assessment', 'Final analytics projects and evaluation', 'https://www.youtube.com/embed/H7wd6JmTd18', 60);

-- COURSE 15: IoT and Embedded Systems (5 classes)
INSERT INTO course_classes (course_id, class_number, title, description, video_url, duration_minutes) VALUES
(15, 1, 'Class 1: Fundamentals & Introduction', 'Basic concepts and introduction to IoT', 'https://www.youtube.com/embed/H7wd6JmTd18', 45),
(15, 2, 'Class 2: Core Concepts & Theory', 'Core theoretical concepts of IoT', 'https://www.youtube.com/embed/H7wd6JmTd18', 60),
(15, 3, 'Class 3: Practical Applications', 'Hands-on practical work with IoT devices', 'https://www.youtube.com/embed/H7wd6JmTd18', 75),
(15, 4, 'Class 4: Advanced Techniques', 'Advanced IoT methods and techniques', 'https://www.youtube.com/embed/H7wd6JmTd18', 90),
(15, 5, 'Class 5: Projects & Assessment', 'Final IoT projects and evaluation', 'https://www.youtube.com/embed/H7wd6JmTd18', 60);

-- COURSE 16: Content Writing and Copywriting (5 classes)
INSERT INTO course_classes (course_id, class_number, title, description, video_url, duration_minutes) VALUES
(16, 1, 'Class 1: Fundamentals & Introduction', 'Basic concepts and introduction to Content Writing', 'https://www.youtube.com/embed/H7wd6JmTd18', 45),
(16, 2, 'Class 2: Core Concepts & Theory', 'Core theoretical concepts of Content Writing', 'https://www.youtube.com/embed/H7wd6JmTd18', 60),
(16, 3, 'Class 3: Practical Applications', 'Hands-on practical work with writing techniques', 'https://www.youtube.com/embed/H7wd6JmTd18', 75),
(16, 4, 'Class 4: Advanced Techniques', 'Advanced writing methods and techniques', 'https://www.youtube.com/embed/H7wd6JmTd18', 90),
(16, 5, 'Class 5: Projects & Assessment', 'Final writing projects and evaluation', 'https://www.youtube.com/embed/H7wd6JmTd18', 60);

-- COURSE 17: Financial Technology (FinTech) (5 classes)
INSERT INTO course_classes (course_id, class_number, title, description, video_url, duration_minutes) VALUES
(17, 1, 'Class 1: Fundamentals & Introduction', 'Basic concepts and introduction to FinTech', 'https://www.youtube.com/embed/H7wd6JmTd18', 45),
(17, 2, 'Class 2: Core Concepts & Theory', 'Core theoretical concepts of FinTech', 'https://www.youtube.com/embed/H7wd6JmTd18', 60),
(17, 3, 'Class 3: Practical Applications', 'Hands-on practical work with financial technologies', 'https://www.youtube.com/embed/H7wd6JmTd18', 75),
(17, 4, 'Class 4: Advanced Techniques', 'Advanced FinTech methods and techniques', 'https://www.youtube.com/embed/H7wd6JmTd18', 90),
(17, 5, 'Class 5: Projects & Assessment', 'Final FinTech projects and evaluation', 'https://www.youtube.com/embed/H7wd6JmTd18', 60);

-- COURSE 18: Artificial Intelligence for Business (5 classes)
INSERT INTO course_classes (course_id, class_number, title, description, video_url, duration_minutes) VALUES
(18, 1, 'Class 1: Fundamentals & Introduction', 'Basic concepts and introduction to AI for Business', 'https://www.youtube.com/embed/H7wd6JmTd18', 45),
(18, 2, 'Class 2: Core Concepts & Theory', 'Core theoretical concepts of AI for Business', 'https://www.youtube.com/embed/H7wd6JmTd18', 60),
(18, 3, 'Class 3: Practical Applications', 'Hands-on practical work with business AI', 'https://www.youtube.com/embed/H7wd6JmTd18', 75),
(18, 4, 'Class 4: Advanced Techniques', 'Advanced AI business methods and techniques', 'https://www.youtube.com/embed/H7wd6JmTd18', 90),
(18, 5, 'Class 5: Projects & Assessment', 'Final AI business projects and evaluation', 'https://www.youtube.com/embed/H7wd6JmTd18', 60);

-- COURSE 19: Cloud Architecture (5 classes)
INSERT INTO course_classes (course_id, class_number, title, description, video_url, duration_minutes) VALUES
(19, 1, 'Class 1: Fundamentals & Introduction', 'Basic concepts and introduction to Cloud Architecture', 'https://www.youtube.com/embed/H7wd6JmTd18', 45),
(19, 2, 'Class 2: Core Concepts & Theory', 'Core theoretical concepts of Cloud Architecture', 'https://www.youtube.com/embed/H7wd6JmTd18', 60),
(19, 3, 'Class 3: Practical Applications', 'Hands-on practical work with cloud platforms', 'https://www.youtube.com/embed/H7wd6JmTd18', 75),
(19, 4, 'Class 4: Advanced Techniques', 'Advanced cloud architecture methods', 'https://www.youtube.com/embed/H7wd6JmTd18', 90),
(19, 5, 'Class 5: Projects & Assessment', 'Final cloud architecture projects and evaluation', 'https://www.youtube.com/embed/H7wd6JmTd18', 60);

-- COURSE 20: Entrepreneurship and Startup (5 classes)
INSERT INTO course_classes (course_id, class_number, title, description, video_url, duration_minutes) VALUES
(20, 1, 'Class 1: Fundamentals & Introduction', 'Basic concepts and introduction to Entrepreneurship', 'https://www.youtube.com/embed/H7wd6JmTd18', 45),
(20, 2, 'Class 2: Core Concepts & Theory', 'Core theoretical concepts of Entrepreneurship', 'https://www.youtube.com/embed/H7wd6JmTd18', 60),
(20, 3, 'Class 3: Practical Applications', 'Hands-on practical work with startup methodologies', 'https://www.youtube.com/embed/H7wd6JmTd18', 75),
(20, 4, 'Class 4: Advanced Techniques', 'Advanced entrepreneurship methods and techniques', 'https://www.youtube.com/embed/H7wd6JmTd18', 90),
(20, 5, 'Class 5: Projects & Assessment', 'Final entrepreneurship projects and evaluation', 'https://www.youtube.com/embed/H7wd6JmTd18', 60);

-- Verify the data insertion
SELECT 
    'Total Courses with Classes' as info, 
    COUNT(DISTINCT course_id) as count 
FROM course_classes
UNION ALL
SELECT 
    'Total Classes Created', 
    COUNT(*) 
FROM course_classes
UNION ALL
SELECT 
    'Classes per Course (should be 5)', 
    COUNT(*) / COUNT(DISTINCT course_id) 
FROM course_classes;

-- Show sample data for verification
SELECT 
    c.course_id,
    c.class_number,
    c.title,
    c.duration_minutes
FROM course_classes c
ORDER BY c.course_id, c.class_number
LIMIT 20; 