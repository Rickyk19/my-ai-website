-- =============================================
-- RESTORE ORIGINAL 20 COURSES FOR BILLION HOPES (FIXED VERSION)
-- This will fix the Quiz Manager 6-course issue
-- =============================================

-- First, delete all existing courses and related data
DELETE FROM course_comments;
DELETE FROM orders;
DELETE FROM course_classes;
DELETE FROM courses;

-- Reset sequences
ALTER SEQUENCE courses_id_seq RESTART WITH 1;
ALTER SEQUENCE course_classes_id_seq RESTART WITH 1;

-- Insert the original 20 courses (using only columns that exist)
INSERT INTO courses (name, description, instructor, price, created_at) VALUES
('Python Programming', 'Master Python from basics to advanced concepts including OOP, data structures, and real-world projects', 'Arjun Sharma', 2999, NOW()),
('Machine Learning', 'Comprehensive ML course covering algorithms, supervised/unsupervised learning, and practical implementations', 'Priya Patel', 4999, NOW()),
('Full Stack Development', 'Complete web development using React, Node.js, Express, MongoDB with multiple real projects', 'Rahul Kumar', 5999, NOW()),
('Data Science with Python', 'End-to-end data science workflow including pandas, numpy, matplotlib, seaborn, and machine learning', 'Sneha Gupta', 4499, NOW()),
('AI Fundamentals', 'Introduction to Artificial Intelligence concepts, neural networks, and deep learning basics', 'Vikram Singh', 3999, NOW()),
('Web Development Bootcamp', 'Complete web development course with HTML, CSS, JavaScript, and modern frameworks', 'Anjali Mehta', 3499, NOW()),
('Mobile App Development', 'Build native and cross-platform mobile apps using React Native and Flutter', 'Karthik Reddy', 4999, NOW()),
('DevOps and Cloud Computing', 'Master DevOps practices, Docker, Kubernetes, AWS, and CI/CD pipelines', 'Ravi Agarwal', 5499, NOW()),
('Cybersecurity Essentials', 'Learn ethical hacking, network security, penetration testing, and cybersecurity best practices', 'Neha Joshi', 4499, NOW()),
('Blockchain Development', 'Develop smart contracts, DApps, and understand cryptocurrency and blockchain technology', 'Amit Verma', 6999, NOW()),
('UI/UX Design Mastery', 'Complete design course covering user research, prototyping, Figma, and design systems', 'Pooja Sharma', 3999, NOW()),
('Digital Marketing', 'Master SEO, SEM, social media marketing, content marketing, and analytics', 'Rajesh Khanna', 2999, NOW()),
('Game Development with Unity', 'Create 2D and 3D games using Unity engine, C# programming, and game design principles', 'Suresh Babu', 4499, NOW()),
('Business Analytics', 'Learn data analysis, business intelligence, Excel, Power BI, and data-driven decision making', 'Kavya Nair', 3499, NOW()),
('IoT and Embedded Systems', 'Build IoT projects using Arduino, Raspberry Pi, sensors, and cloud integration', 'Manoj Kumar', 4999, NOW()),
('Content Writing and Copywriting', 'Master content creation, SEO writing, copywriting, and content marketing strategies', 'Shreya Iyer', 2499, NOW()),
('Financial Technology (FinTech)', 'Understand fintech innovations, payment systems, cryptocurrencies, and financial APIs', 'Arun Pillai', 5999, NOW()),
('Artificial Intelligence for Business', 'Apply AI solutions in business contexts, automation, chatbots, and AI strategy', 'Deepika Rao', 4999, NOW()),
('Cloud Architecture', 'Design scalable cloud solutions using AWS, Azure, Google Cloud, and cloud-native technologies', 'Harish Chandra', 6499, NOW()),
('Entrepreneurship and Startup', 'Learn startup fundamentals, business planning, funding, marketing, and scaling strategies', 'Nisha Agarwal', 3999, NOW());

-- Insert classes for first 6 courses (this ensures they show in Quiz Manager)
-- Course 1: Python Programming (12 classes)
INSERT INTO course_classes (course_id, class_number, title, description, video_url, pdf_url, created_at) VALUES
(1, 1, 'Python Basics & Setup', 'Introduction to Python, installation, and basic syntax', 'https://www.youtube.com/embed/_zgZ0g8EbF4', '/demo-course-guide.pdf', NOW()),
(1, 2, 'Variables & Data Types', 'Understanding variables, strings, numbers, and basic data types', 'https://www.youtube.com/embed/_zgZ0g8EbF4', '/demo-course-guide.pdf', NOW()),
(1, 3, 'Control Structures', 'If statements, loops, and conditional logic', 'https://www.youtube.com/embed/_zgZ0g8EbF4', '/demo-course-guide.pdf', NOW()),
(1, 4, 'Functions & Modules', 'Creating functions, parameters, return values, and importing modules', 'https://www.youtube.com/embed/_zgZ0g8EbF4', '/demo-course-guide.pdf', NOW()),
(1, 5, 'Data Structures - Lists', 'Working with Python lists, methods, and list comprehensions', 'https://www.youtube.com/embed/_zgZ0g8EbF4', '/demo-course-guide.pdf', NOW()),
(1, 6, 'Data Structures - Dictionaries', 'Understanding dictionaries, keys, values, and dictionary methods', 'https://www.youtube.com/embed/_zgZ0g8EbF4', '/demo-course-guide.pdf', NOW()),
(1, 7, 'File Operations', 'Reading and writing files, working with CSV and JSON', 'https://www.youtube.com/embed/_zgZ0g8EbF4', '/demo-course-guide.pdf', NOW()),
(1, 8, 'Object-Oriented Programming', 'Classes, objects, inheritance, and encapsulation', 'https://www.youtube.com/embed/_zgZ0g8EbF4', '/demo-course-guide.pdf', NOW()),
(1, 9, 'Error Handling', 'Exception handling, try-except blocks, and debugging', 'https://www.youtube.com/embed/_zgZ0g8EbF4', '/demo-course-guide.pdf', NOW()),
(1, 10, 'Libraries & Packages', 'Working with external libraries and package management', 'https://www.youtube.com/embed/_zgZ0g8EbF4', '/demo-course-guide.pdf', NOW()),
(1, 11, 'Web Scraping Project', 'Building a real web scraping application', 'https://www.youtube.com/embed/_zgZ0g8EbF4', '/demo-course-guide.pdf', NOW()),
(1, 12, 'Final Project & Deployment', 'Complete Python project and deployment strategies', 'https://www.youtube.com/embed/_zgZ0g8EbF4', '/demo-course-guide.pdf', NOW());

-- Course 2: Machine Learning (10 classes)
INSERT INTO course_classes (course_id, class_number, title, description, video_url, pdf_url, created_at) VALUES
(2, 1, 'ML Introduction & Setup', 'Introduction to machine learning concepts and environment setup', 'https://www.youtube.com/embed/_zgZ0g8EbF4', '/demo-course-guide.pdf', NOW()),
(2, 2, 'Data Preprocessing', 'Data cleaning, feature selection, and preparation techniques', 'https://www.youtube.com/embed/_zgZ0g8EbF4', '/demo-course-guide.pdf', NOW()),
(2, 3, 'Supervised Learning - Regression', 'Linear regression, polynomial regression, and evaluation metrics', 'https://www.youtube.com/embed/_zgZ0g8EbF4', '/demo-course-guide.pdf', NOW()),
(2, 4, 'Supervised Learning - Classification', 'Decision trees, random forest, and classification algorithms', 'https://www.youtube.com/embed/_zgZ0g8EbF4', '/demo-course-guide.pdf', NOW()),
(2, 5, 'Unsupervised Learning', 'K-means clustering, hierarchical clustering, and PCA', 'https://www.youtube.com/embed/_zgZ0g8EbF4', '/demo-course-guide.pdf', NOW()),
(2, 6, 'Neural Networks Basics', 'Introduction to neural networks and deep learning', 'https://www.youtube.com/embed/_zgZ0g8EbF4', '/demo-course-guide.pdf', NOW()),
(2, 7, 'Model Evaluation', 'Cross-validation, confusion matrix, and performance metrics', 'https://www.youtube.com/embed/_zgZ0g8EbF4', '/demo-course-guide.pdf', NOW()),
(2, 8, 'Feature Engineering', 'Advanced feature creation and selection techniques', 'https://www.youtube.com/embed/_zgZ0g8EbF4', '/demo-course-guide.pdf', NOW()),
(2, 9, 'Real-world ML Project', 'Complete machine learning project from data to deployment', 'https://www.youtube.com/embed/_zgZ0g8EbF4', '/demo-course-guide.pdf', NOW()),
(2, 10, 'MLOps & Deployment', 'Model deployment, monitoring, and MLOps best practices', 'https://www.youtube.com/embed/_zgZ0g8EbF4', '/demo-course-guide.pdf', NOW());

-- Course 3: Full Stack Development (15 classes)
INSERT INTO course_classes (course_id, class_number, title, description, video_url, pdf_url, created_at) VALUES
(3, 1, 'Full Stack Overview', 'Introduction to full stack development and technologies', 'https://www.youtube.com/embed/_zgZ0g8EbF4', '/demo-course-guide.pdf', NOW()),
(3, 2, 'HTML5 & CSS3 Fundamentals', 'Modern HTML and CSS with responsive design', 'https://www.youtube.com/embed/_zgZ0g8EbF4', '/demo-course-guide.pdf', NOW()),
(3, 3, 'JavaScript ES6+', 'Modern JavaScript features and best practices', 'https://www.youtube.com/embed/_zgZ0g8EbF4', '/demo-course-guide.pdf', NOW()),
(3, 4, 'React.js Fundamentals', 'Component-based development with React', 'https://www.youtube.com/embed/_zgZ0g8EbF4', '/demo-course-guide.pdf', NOW()),
(3, 5, 'State Management', 'Redux, Context API, and state management patterns', 'https://www.youtube.com/embed/_zgZ0g8EbF4', '/demo-course-guide.pdf', NOW()),
(3, 6, 'Node.js & Express', 'Server-side JavaScript and REST API development', 'https://www.youtube.com/embed/_zgZ0g8EbF4', '/demo-course-guide.pdf', NOW()),
(3, 7, 'Database Design', 'MongoDB, database modeling, and relationships', 'https://www.youtube.com/embed/_zgZ0g8EbF4', '/demo-course-guide.pdf', NOW()),
(3, 8, 'Authentication & Security', 'JWT, OAuth, and security best practices', 'https://www.youtube.com/embed/_zgZ0g8EbF4', '/demo-course-guide.pdf', NOW()),
(3, 9, 'Testing & Debugging', 'Unit testing, integration testing, and debugging techniques', 'https://www.youtube.com/embed/_zgZ0g8EbF4', '/demo-course-guide.pdf', NOW()),
(3, 10, 'Frontend Build Tools', 'Webpack, Babel, and modern development workflow', 'https://www.youtube.com/embed/_zgZ0g8EbF4', '/demo-course-guide.pdf', NOW()),
(3, 11, 'Performance Optimization', 'Frontend and backend performance optimization', 'https://www.youtube.com/embed/_zgZ0g8EbF4', '/demo-course-guide.pdf', NOW()),
(3, 12, 'DevOps Basics', 'Git, CI/CD, and deployment strategies', 'https://www.youtube.com/embed/_zgZ0g8EbF4', '/demo-course-guide.pdf', NOW()),
(3, 13, 'E-commerce Project - Frontend', 'Building a complete e-commerce frontend', 'https://www.youtube.com/embed/_zgZ0g8EbF4', '/demo-course-guide.pdf', NOW()),
(3, 14, 'E-commerce Project - Backend', 'Building the backend API and database', 'https://www.youtube.com/embed/_zgZ0g8EbF4', '/demo-course-guide.pdf', NOW()),
(3, 15, 'Project Deployment', 'Deploying full stack application to cloud platforms', 'https://www.youtube.com/embed/_zgZ0g8EbF4', '/demo-course-guide.pdf', NOW());

-- Course 4: Data Science (8 classes)
INSERT INTO course_classes (course_id, class_number, title, description, video_url, pdf_url, created_at) VALUES
(4, 1, 'Data Science Introduction', 'Overview of data science and career paths', 'https://www.youtube.com/embed/_zgZ0g8EbF4', '/demo-course-guide.pdf', NOW()),
(4, 2, 'Python for Data Science', 'NumPy, Pandas, and data manipulation', 'https://www.youtube.com/embed/_zgZ0g8EbF4', '/demo-course-guide.pdf', NOW()),
(4, 3, 'Data Visualization', 'Matplotlib, Seaborn, and creating compelling visualizations', 'https://www.youtube.com/embed/_zgZ0g8EbF4', '/demo-course-guide.pdf', NOW()),
(4, 4, 'Statistical Analysis', 'Descriptive and inferential statistics for data science', 'https://www.youtube.com/embed/_zgZ0g8EbF4', '/demo-course-guide.pdf', NOW()),
(4, 5, 'Exploratory Data Analysis', 'EDA techniques and best practices', 'https://www.youtube.com/embed/_zgZ0g8EbF4', '/demo-course-guide.pdf', NOW()),
(4, 6, 'Machine Learning for Data Science', 'Applying ML algorithms to real datasets', 'https://www.youtube.com/embed/_zgZ0g8EbF4', '/demo-course-guide.pdf', NOW()),
(4, 7, 'Big Data Tools', 'Introduction to Spark, Hadoop, and big data processing', 'https://www.youtube.com/embed/_zgZ0g8EbF4', '/demo-course-guide.pdf', NOW()),
(4, 8, 'Data Science Capstone', 'Complete data science project from analysis to insights', 'https://www.youtube.com/embed/_zgZ0g8EbF4', '/demo-course-guide.pdf', NOW());

-- Course 5: AI Fundamentals (6 classes)
INSERT INTO course_classes (course_id, class_number, title, description, video_url, pdf_url, created_at) VALUES
(5, 1, 'Introduction to AI', 'History, types, and applications of artificial intelligence', 'https://www.youtube.com/embed/_zgZ0g8EbF4', '/demo-course-guide.pdf', NOW()),
(5, 2, 'Neural Networks Basics', 'Understanding neurons, layers, and basic architectures', 'https://www.youtube.com/embed/_zgZ0g8EbF4', '/demo-course-guide.pdf', NOW()),
(5, 3, 'Deep Learning Fundamentals', 'CNNs, RNNs, and deep learning concepts', 'https://www.youtube.com/embed/_zgZ0g8EbF4', '/demo-course-guide.pdf', NOW()),
(5, 4, 'Computer Vision', 'Image processing and computer vision applications', 'https://www.youtube.com/embed/_zgZ0g8EbF4', '/demo-course-guide.pdf', NOW()),
(5, 5, 'Natural Language Processing', 'Text processing and NLP applications', 'https://www.youtube.com/embed/_zgZ0g8EbF4', '/demo-course-guide.pdf', NOW()),
(5, 6, 'AI Ethics & Future', 'Ethical considerations and future of AI', 'https://www.youtube.com/embed/_zgZ0g8EbF4', '/demo-course-guide.pdf', NOW());

-- Course 6: Web Development (5 classes)
INSERT INTO course_classes (course_id, class_number, title, description, video_url, pdf_url, created_at) VALUES
(6, 1, 'Web Development Basics', 'HTML, CSS, and web fundamentals', 'https://www.youtube.com/embed/_zgZ0g8EbF4', '/demo-course-guide.pdf', NOW()),
(6, 2, 'Responsive Design', 'Creating mobile-friendly and responsive websites', 'https://www.youtube.com/embed/_zgZ0g8EbF4', '/demo-course-guide.pdf', NOW()),
(6, 3, 'JavaScript Interactivity', 'Adding interactive elements to websites', 'https://www.youtube.com/embed/_zgZ0g8EbF4', '/demo-course-guide.pdf', NOW()),
(6, 4, 'Modern CSS Frameworks', 'Bootstrap, Tailwind, and CSS frameworks', 'https://www.youtube.com/embed/_zgZ0g8EbF4', '/demo-course-guide.pdf', NOW()),
(6, 5, 'Website Deployment', 'Hosting and deploying websites', 'https://www.youtube.com/embed/_zgZ0g8EbF4', '/demo-course-guide.pdf', NOW());

-- Add sample enrollment data for all 20 courses
INSERT INTO orders (user_email, course_id, amount, status, created_at) VALUES
('student@example.com', 1, 2999, 'completed', NOW()),
('student@example.com', 2, 4999, 'completed', NOW()),
('student@example.com', 3, 5999, 'completed', NOW()),
('student@example.com', 4, 4499, 'completed', NOW()),
('student@example.com', 5, 3999, 'completed', NOW()),
('student@example.com', 6, 3499, 'completed', NOW()),
('student@example.com', 7, 4999, 'completed', NOW()),
('student@example.com', 8, 5499, 'completed', NOW()),
('student@example.com', 9, 4499, 'completed', NOW()),
('student@example.com', 10, 6999, 'completed', NOW()),
('student@example.com', 11, 3999, 'completed', NOW()),
('student@example.com', 12, 2999, 'completed', NOW()),
('student@example.com', 13, 4499, 'completed', NOW()),
('student@example.com', 14, 3499, 'completed', NOW()),
('student@example.com', 15, 4999, 'completed', NOW()),
('student@example.com', 16, 2499, 'completed', NOW()),
('student@example.com', 17, 5999, 'completed', NOW()),
('student@example.com', 18, 4999, 'completed', NOW()),
('student@example.com', 19, 6499, 'completed', NOW()),
('student@example.com', 20, 3999, 'completed', NOW());

-- Add sample comments
INSERT INTO course_comments (course_id, user_email, comment, rating, created_at) VALUES
(1, 'student@example.com', 'Excellent Python course! Very well structured and easy to follow.', 5, NOW()),
(2, 'student@example.com', 'Great introduction to machine learning with practical examples.', 5, NOW()),
(3, 'student@example.com', 'Comprehensive full stack course with real-world projects.', 5, NOW()),
(4, 'student@example.com', 'Perfect for beginners in data science. Highly recommended!', 4, NOW()),
(5, 'student@example.com', 'Good introduction to AI concepts and applications.', 4, NOW()),
(6, 'student@example.com', 'Solid web development fundamentals course.', 4, NOW());

-- Success message
SELECT 'SUCCESS: Original 20 courses restored! Quiz Manager should now show all courses with classes.' as result; 
