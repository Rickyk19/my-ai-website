-- Add missing courses that are not in the database
-- This will complete your course list to show all 20 courses in the quiz manager

INSERT INTO courses (name, description, price, instructor, duration, level, certificate_available, demo_pdf_url) VALUES
('Cloud Computing with AWS', 'Master Amazon Web Services including EC2, S3, Lambda, and DevOps practices. AWS certification preparation.', 8499.00, 'Lisa Kumar', '48 hours', 'Intermediate', true, 'https://example.com/demo/aws-essentials.pdf'),

('Mobile App Development with Flutter', 'Build beautiful cross-platform mobile apps for iOS and Android using Flutter and Dart programming language.', 5999.00, 'David Park', '42 hours', 'Intermediate', true, 'https://example.com/demo/flutter-guide.pdf'),

('Blockchain & Cryptocurrency Development', 'Create smart contracts, DApps, and understand blockchain technology. Build your own cryptocurrency.', 7999.00, 'Robert Martinez', '38 hours', 'Advanced', true, 'https://example.com/demo/blockchain-basics.pdf'),

('UI/UX Design Complete Course', 'Master user interface and user experience design using Figma, Adobe XD, and design thinking methodologies.', 4499.00, 'Anna Lee', '32 hours', 'Beginner', true, 'https://example.com/demo/ux-design-kit.pdf'),

('DevOps Engineering Masterclass', 'Docker, Kubernetes, Jenkins, CI/CD pipelines, and infrastructure automation. Become a DevOps expert.', 8999.00, 'Chris Anderson', '52 hours', 'Advanced', true, 'https://example.com/demo/devops-handbook.pdf'),

('Game Development with Unity', 'Create 2D and 3D games using Unity engine and C# programming. Publish games to multiple platforms.', 6499.00, 'Tom Bradley', '44 hours', 'Intermediate', true, 'https://example.com/demo/unity-tutorial.pdf'),

('Business Analytics & Intelligence', 'Excel, Power BI, Tableau, and SQL for business decision making. Transform data into actionable insights.', 5499.00, 'Maria Garcia', '36 hours', 'Beginner', true, 'https://example.com/demo/business-analytics.pdf'),

('Artificial Intelligence with Deep Learning', 'Advanced neural networks, computer vision, NLP, and AI model deployment using TensorFlow and PyTorch.', 9499.00, 'Dr. Kevin Zhang', '58 hours', 'Advanced', true, 'https://example.com/demo/deep-learning-guide.pdf'),

('E-commerce Business Masterclass', 'Start and scale online businesses using Shopify, Amazon FBA, dropshipping, and digital marketing strategies.', 4999.00, 'Jennifer Smith', '40 hours', 'Beginner', true, 'https://example.com/demo/ecommerce-blueprint.pdf'),

('Photography & Video Editing Pro', 'Professional photography techniques and video editing using Adobe Premiere Pro, After Effects, and Lightroom.', 3999.00, 'Ryan Mitchell', '30 hours', 'Beginner', true, 'https://example.com/demo/photography-guide.pdf'),

('Financial Trading & Investment', 'Stock market analysis, forex trading, cryptocurrency investing, and portfolio management strategies.', 6999.00, 'Steven Taylor', '45 hours', 'Intermediate', true, 'https://example.com/demo/trading-manual.pdf'),

('Content Creation & Social Media', 'YouTube, Instagram, TikTok content creation, monetization strategies, and personal branding.', 3499.00, 'Emma Johnson', '28 hours', 'Beginner', true, 'https://example.com/demo/content-creator-kit.pdf');

-- Add course classes for missing courses
-- Course 7: Cloud Computing with AWS (8 classes)
INSERT INTO course_classes (course_id, class_number, title, description, video_url, duration_minutes) VALUES
(7, 1, 'AWS Cloud Fundamentals', 'Introduction to Amazon Web Services and cloud computing concepts', 'https://www.youtube.com/embed/H7wd6JmTd18', 45),
(7, 2, 'EC2 Instance Management', 'Creating and managing virtual servers in the cloud', 'https://www.youtube.com/embed/H7wd6JmTd18', 50),
(7, 3, 'S3 Storage Solutions', 'Object storage, buckets, and data management', 'https://www.youtube.com/embed/H7wd6JmTd18', 40),
(7, 4, 'Lambda Serverless Computing', 'Building applications without managing servers', 'https://www.youtube.com/embed/H7wd6JmTd18', 55),
(7, 5, 'RDS Database Services', 'Managed database solutions in AWS', 'https://www.youtube.com/embed/H7wd6JmTd18', 45),
(7, 6, 'VPC Networking', 'Virtual private clouds and network security', 'https://www.youtube.com/embed/H7wd6JmTd18', 50),
(7, 7, 'CloudFormation & Infrastructure as Code', 'Automating AWS resource deployment', 'https://www.youtube.com/embed/H7wd6JmTd18', 60),
(7, 8, 'AWS Certification Preparation', 'Preparing for AWS Solutions Architect exam', 'https://www.youtube.com/embed/H7wd6JmTd18', 70);

-- Course 8: Mobile App Development with Flutter (10 classes)
INSERT INTO course_classes (course_id, class_number, title, description, video_url, duration_minutes) VALUES
(8, 1, 'Flutter Development Setup', 'Installing Flutter, Dart, and development environment', 'https://www.youtube.com/embed/H7wd6JmTd18', 40),
(8, 2, 'Dart Programming Basics', 'Learning Dart language fundamentals', 'https://www.youtube.com/embed/H7wd6JmTd18', 45),
(8, 3, 'Flutter Widgets & Layouts', 'Building user interfaces with Flutter widgets', 'https://www.youtube.com/embed/H7wd6JmTd18', 55),
(8, 4, 'State Management', 'Managing app state with setState and providers', 'https://www.youtube.com/embed/H7wd6JmTd18', 50),
(8, 5, 'Navigation & Routing', 'Multi-screen apps and navigation patterns', 'https://www.youtube.com/embed/H7wd6JmTd18', 45),
(8, 6, 'HTTP Requests & APIs', 'Connecting to web services and RESTful APIs', 'https://www.youtube.com/embed/H7wd6JmTd18', 60),
(8, 7, 'Local Data Storage', 'SQLite databases and shared preferences', 'https://www.youtube.com/embed/H7wd6JmTd18', 50),
(8, 8, 'Push Notifications', 'Firebase Cloud Messaging integration', 'https://www.youtube.com/embed/H7wd6JmTd18', 45),
(8, 9, 'Platform-Specific Features', 'Access device camera, GPS, and native features', 'https://www.youtube.com/embed/H7wd6JmTd18', 55),
(8, 10, 'App Store Deployment', 'Publishing apps to Google Play and App Store', 'https://www.youtube.com/embed/H7wd6JmTd18', 65);

-- Course 9: Blockchain & Cryptocurrency Development (8 classes)
INSERT INTO course_classes (course_id, class_number, title, description, video_url, duration_minutes) VALUES
(9, 1, 'Blockchain Fundamentals', 'Understanding distributed ledger technology', 'https://www.youtube.com/embed/H7wd6JmTd18', 50),
(9, 2, 'Ethereum & Smart Contracts', 'Introduction to Ethereum blockchain and smart contracts', 'https://www.youtube.com/embed/H7wd6JmTd18', 60),
(9, 3, 'Solidity Programming', 'Writing smart contracts with Solidity language', 'https://www.youtube.com/embed/H7wd6JmTd18', 65),
(9, 4, 'DApp Development', 'Building decentralized applications', 'https://www.youtube.com/embed/H7wd6JmTd18', 70),
(9, 5, 'Web3.js Integration', 'Connecting web applications to blockchain', 'https://www.youtube.com/embed/H7wd6JmTd18', 55),
(9, 6, 'Token Creation & ICO', 'Creating your own cryptocurrency tokens', 'https://www.youtube.com/embed/H7wd6JmTd18', 60),
(9, 7, 'NFT Marketplace Development', 'Building non-fungible token platforms', 'https://www.youtube.com/embed/H7wd6JmTd18', 75),
(9, 8, 'Blockchain Security & Testing', 'Security best practices and smart contract testing', 'https://www.youtube.com/embed/H7wd6JmTd18', 65);

-- Course 10: UI/UX Design Complete Course (6 classes)
INSERT INTO course_classes (course_id, class_number, title, description, video_url, duration_minutes) VALUES
(10, 1, 'Design Thinking Principles', 'User-centered design methodology and research', 'https://www.youtube.com/embed/H7wd6JmTd18', 45),
(10, 2, 'Figma Design Tools', 'Mastering Figma for UI/UX design', 'https://www.youtube.com/embed/H7wd6JmTd18', 50),
(10, 3, 'Wireframing & Prototyping', 'Creating low and high-fidelity prototypes', 'https://www.youtube.com/embed/H7wd6JmTd18', 55),
(10, 4, 'Visual Design & Typography', 'Color theory, typography, and visual hierarchy', 'https://www.youtube.com/embed/H7wd6JmTd18', 45),
(10, 5, 'User Testing & Validation', 'Testing designs with real users', 'https://www.youtube.com/embed/H7wd6JmTd18', 50),
(10, 6, 'Design System Creation', 'Building scalable design systems and components', 'https://www.youtube.com/embed/H7wd6JmTd18', 60);

-- Add classes for remaining courses (11-18) with 6-8 classes each
-- Course 11: DevOps Engineering Masterclass (8 classes)
INSERT INTO course_classes (course_id, class_number, title, description, video_url, duration_minutes) VALUES
(11, 1, 'DevOps Culture & Practices', 'Introduction to DevOps methodology and tools', 'https://www.youtube.com/embed/H7wd6JmTd18', 45),
(11, 2, 'Docker Containerization', 'Creating and managing Docker containers', 'https://www.youtube.com/embed/H7wd6JmTd18', 60),
(11, 3, 'Kubernetes Orchestration', 'Container orchestration and cluster management', 'https://www.youtube.com/embed/H7wd6JmTd18', 70),
(11, 4, 'Jenkins CI/CD Pipelines', 'Continuous integration and deployment automation', 'https://www.youtube.com/embed/H7wd6JmTd18', 65),
(11, 5, 'Infrastructure as Code', 'Terraform and Ansible for infrastructure automation', 'https://www.youtube.com/embed/H7wd6JmTd18', 55),
(11, 6, 'Monitoring & Logging', 'Application monitoring with Prometheus and ELK stack', 'https://www.youtube.com/embed/H7wd6JmTd18', 50),
(11, 7, 'Security in DevOps', 'DevSecOps practices and security automation', 'https://www.youtube.com/embed/H7wd6JmTd18', 55),
(11, 8, 'Cloud DevOps with AWS', 'DevOps practices in cloud environments', 'https://www.youtube.com/embed/H7wd6JmTd18', 60);

-- Course 12: Game Development with Unity (7 classes)
INSERT INTO course_classes (course_id, class_number, title, description, video_url, duration_minutes) VALUES
(12, 1, 'Unity Engine Basics', 'Getting started with Unity game development', 'https://www.youtube.com/embed/H7wd6JmTd18', 50),
(12, 2, 'C# Programming for Games', 'Game programming with C# scripting', 'https://www.youtube.com/embed/H7wd6JmTd18', 55),
(12, 3, '2D Game Development', 'Creating 2D platformer and puzzle games', 'https://www.youtube.com/embed/H7wd6JmTd18', 65),
(12, 4, '3D Game Development', 'Building 3D games with physics and animations', 'https://www.youtube.com/embed/H7wd6JmTd18', 70),
(12, 5, 'Game UI & Audio', 'User interfaces, sound effects, and music integration', 'https://www.youtube.com/embed/H7wd6JmTd18', 45),
(12, 6, 'Mobile Game Optimization', 'Optimizing games for mobile platforms', 'https://www.youtube.com/embed/H7wd6JmTd18', 50),
(12, 7, 'Game Publishing', 'Publishing games to Steam, mobile stores, and web', 'https://www.youtube.com/embed/H7wd6JmTd18', 55);

-- Course 13: Business Analytics & Intelligence (6 classes)
INSERT INTO course_classes (course_id, class_number, title, description, video_url, duration_minutes) VALUES
(13, 1, 'Business Analytics Fundamentals', 'Introduction to data-driven decision making', 'https://www.youtube.com/embed/H7wd6JmTd18', 40),
(13, 2, 'Excel for Business Analysis', 'Advanced Excel functions and pivot tables', 'https://www.youtube.com/embed/H7wd6JmTd18', 50),
(13, 3, 'Power BI Dashboard Creation', 'Creating interactive business dashboards', 'https://www.youtube.com/embed/H7wd6JmTd18', 60),
(13, 4, 'SQL for Data Analysis', 'Database querying and data extraction', 'https://www.youtube.com/embed/H7wd6JmTd18', 55),
(13, 5, 'Tableau Data Visualization', 'Advanced data visualization techniques', 'https://www.youtube.com/embed/H7wd6JmTd18', 50),
(13, 6, 'Business Intelligence Strategy', 'Implementing BI solutions in organizations', 'https://www.youtube.com/embed/H7wd6JmTd18', 45);

-- Course 14: Artificial Intelligence with Deep Learning (9 classes)
INSERT INTO course_classes (course_id, class_number, title, description, video_url, duration_minutes) VALUES
(14, 1, 'AI & Deep Learning Overview', 'Understanding artificial intelligence and neural networks', 'https://www.youtube.com/embed/H7wd6JmTd18', 50),
(14, 2, 'TensorFlow & Keras Setup', 'Setting up deep learning development environment', 'https://www.youtube.com/embed/H7wd6JmTd18', 45),
(14, 3, 'Convolutional Neural Networks', 'CNN architecture for image recognition', 'https://www.youtube.com/embed/H7wd6JmTd18', 70),
(14, 4, 'Recurrent Neural Networks', 'RNN and LSTM for sequence data processing', 'https://www.youtube.com/embed/H7wd6JmTd18', 65),
(14, 5, 'Computer Vision Projects', 'Object detection and image classification', 'https://www.youtube.com/embed/H7wd6JmTd18', 75),
(14, 6, 'Natural Language Processing', 'Text analysis and language model development', 'https://www.youtube.com/embed/H7wd6JmTd18', 70),
(14, 7, 'Generative AI & GANs', 'Creating AI that generates new content', 'https://www.youtube.com/embed/H7wd6JmTd18', 80),
(14, 8, 'Model Deployment & MLOps', 'Deploying AI models to production', 'https://www.youtube.com/embed/H7wd6JmTd18', 60),
(14, 9, 'AI Ethics & Future Trends', 'Responsible AI development and emerging technologies', 'https://www.youtube.com/embed/H7wd6JmTd18', 45);

-- Course 15: E-commerce Business Masterclass (7 classes)
INSERT INTO course_classes (course_id, class_number, title, description, video_url, duration_minutes) VALUES
(15, 1, 'E-commerce Business Models', 'Understanding different online business models', 'https://www.youtube.com/embed/H7wd6JmTd18', 45),
(15, 2, 'Shopify Store Setup', 'Creating professional online stores', 'https://www.youtube.com/embed/H7wd6JmTd18', 55),
(15, 3, 'Product Research & Sourcing', 'Finding profitable products to sell online', 'https://www.youtube.com/embed/H7wd6JmTd18', 50),
(15, 4, 'Amazon FBA Strategy', 'Selling on Amazon with fulfillment services', 'https://www.youtube.com/embed/H7wd6JmTd18', 60),
(15, 5, 'Digital Marketing for E-commerce', 'Driving traffic and sales to online stores', 'https://www.youtube.com/embed/H7wd6JmTd18', 55),
(15, 6, 'Customer Service & Retention', 'Building customer loyalty and support systems', 'https://www.youtube.com/embed/H7wd6JmTd18', 40),
(15, 7, 'Scaling & Business Automation', 'Growing e-commerce business and automating processes', 'https://www.youtube.com/embed/H7wd6JmTd18', 65);

-- Course 16: Photography & Video Editing Pro (6 classes)
INSERT INTO course_classes (course_id, class_number, title, description, video_url, duration_minutes) VALUES
(16, 1, 'Photography Fundamentals', 'Camera settings, composition, and lighting basics', 'https://www.youtube.com/embed/H7wd6JmTd18', 50),
(16, 2, 'Advanced Photography Techniques', 'Portrait, landscape, and creative photography', 'https://www.youtube.com/embed/H7wd6JmTd18', 60),
(16, 3, 'Adobe Lightroom Mastery', 'Photo editing and color correction', 'https://www.youtube.com/embed/H7wd6JmTd18', 55),
(16, 4, 'Adobe Premiere Pro Editing', 'Professional video editing and post-production', 'https://www.youtube.com/embed/H7wd6JmTd18', 70),
(16, 5, 'After Effects Motion Graphics', 'Creating animations and visual effects', 'https://www.youtube.com/embed/H7wd6JmTd18', 65),
(16, 6, 'Content Creation Business', 'Monetizing photography and video skills', 'https://www.youtube.com/embed/H7wd6JmTd18', 45);

-- Course 17: Financial Trading & Investment (8 classes)
INSERT INTO course_classes (course_id, class_number, title, description, video_url, duration_minutes) VALUES
(17, 1, 'Financial Markets Overview', 'Understanding stocks, bonds, and financial instruments', 'https://www.youtube.com/embed/H7wd6JmTd18', 50),
(17, 2, 'Technical Analysis', 'Chart patterns, indicators, and trading signals', 'https://www.youtube.com/embed/H7wd6JmTd18', 60),
(17, 3, 'Fundamental Analysis', 'Company valuation and financial statement analysis', 'https://www.youtube.com/embed/H7wd6JmTd18', 55),
(17, 4, 'Stock Trading Strategies', 'Day trading, swing trading, and long-term investing', 'https://www.youtube.com/embed/H7wd6JmTd18', 65),
(17, 5, 'Forex Trading', 'Currency trading and foreign exchange markets', 'https://www.youtube.com/embed/H7wd6JmTd18', 60),
(17, 6, 'Cryptocurrency Investing', 'Digital asset trading and portfolio management', 'https://www.youtube.com/embed/H7wd6JmTd18', 55),
(17, 7, 'Risk Management', 'Portfolio diversification and risk assessment', 'https://www.youtube.com/embed/H7wd6JmTd18', 45),
(17, 8, 'Investment Psychology', 'Behavioral finance and emotional discipline', 'https://www.youtube.com/embed/H7wd6JmTd18', 50);

-- Course 18: Content Creation & Social Media (6 classes)
INSERT INTO course_classes (course_id, class_number, title, description, video_url, duration_minutes) VALUES
(18, 1, 'Content Strategy & Planning', 'Developing content calendars and brand voice', 'https://www.youtube.com/embed/H7wd6JmTd18', 45),
(18, 2, 'YouTube Channel Growth', 'Creating engaging videos and growing subscribers', 'https://www.youtube.com/embed/H7wd6JmTd18', 60),
(18, 3, 'Instagram Marketing', 'Posts, stories, reels, and influencer strategies', 'https://www.youtube.com/embed/H7wd6JmTd18', 50),
(18, 4, 'TikTok Viral Content', 'Creating trending content and viral marketing', 'https://www.youtube.com/embed/H7wd6JmTd18', 45),
(18, 5, 'Personal Branding', 'Building authentic online presence and authority', 'https://www.youtube.com/embed/H7wd6JmTd18', 55),
(18, 6, 'Monetization Strategies', 'Turning social media presence into income', 'https://www.youtube.com/embed/H7wd6JmTd18', 50);

-- Add orders for all missing courses
INSERT INTO orders (course_name, course_id, amount, customer_name, customer_email, status, transaction_id) VALUES
('Cloud Computing with AWS', 7, 8499.00, 'John Doe', 'student@example.com', 'completed', 'TXN_007_NEW'),
('Mobile App Development with Flutter', 8, 5999.00, 'John Doe', 'student@example.com', 'completed', 'TXN_008_NEW'),
('Blockchain & Cryptocurrency Development', 9, 7999.00, 'John Doe', 'student@example.com', 'completed', 'TXN_009_NEW'),
('UI/UX Design Complete Course', 10, 4499.00, 'John Doe', 'student@example.com', 'completed', 'TXN_010_NEW'),
('DevOps Engineering Masterclass', 11, 8999.00, 'John Doe', 'student@example.com', 'completed', 'TXN_011_NEW'),
('Game Development with Unity', 12, 6499.00, 'John Doe', 'student@example.com', 'completed', 'TXN_012_NEW'),
('Business Analytics & Intelligence', 13, 5499.00, 'John Doe', 'student@example.com', 'completed', 'TXN_013_NEW'),
('Artificial Intelligence with Deep Learning', 14, 9499.00, 'John Doe', 'student@example.com', 'completed', 'TXN_014_NEW'),
('E-commerce Business Masterclass', 15, 4999.00, 'John Doe', 'student@example.com', 'completed', 'TXN_015_NEW'),
('Photography & Video Editing Pro', 16, 3999.00, 'John Doe', 'student@example.com', 'completed', 'TXN_016_NEW'),
('Financial Trading & Investment', 17, 6999.00, 'John Doe', 'student@example.com', 'completed', 'TXN_017_NEW'),
('Content Creation & Social Media', 18, 3499.00, 'John Doe', 'student@example.com', 'completed', 'TXN_018_NEW');

-- Verify the complete setup
SELECT 'Total Courses' as info, count(*) as count FROM courses
UNION ALL
SELECT 'Total Course Classes', count(*) FROM course_classes
UNION ALL  
SELECT 'Total Orders', count(*) FROM orders; 