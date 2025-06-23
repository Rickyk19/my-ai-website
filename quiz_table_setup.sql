-- Class Quizzes Table Setup for Admin Quiz Management
-- This table stores quizzes created by admins for each class

CREATE TABLE IF NOT EXISTS class_quizzes (
    id SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL,
    class_number INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    time_limit INTEGER DEFAULT 15, -- in minutes
    questions JSONB NOT NULL, -- stores array of questions
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Ensure one quiz per course/class combination
    UNIQUE(course_id, class_number)
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_class_quizzes_course_class ON class_quizzes(course_id, class_number);

-- Comprehensive quiz data for all 20 courses and their classes
INSERT INTO class_quizzes (course_id, class_number, title, description, time_limit, questions) VALUES

-- Course 1: Complete Python Programming Masterclass (12 classes)
(1, 1, 'Python Basics & Setup Quiz', 'Test your understanding of Python installation and basic concepts', 10, 
'[{"id": 1, "question": "What is Python?", "options": ["A type of snake", "A high-level programming language", "A web browser", "A database system"], "correctAnswer": 1, "explanation": "Python is a high-level, interpreted programming language known for its simplicity and readability."}]'),

(1, 2, 'Variables & Data Types Quiz', 'Test your knowledge of Python variables, data types, and basic operations', 15, 
'[
  {"id": 1, "question": "Which of the following is the correct way to declare a variable in Python?", "options": ["var name = \"John\"", "name = \"John\"", "string name = \"John\"", "declare name = \"John\""], "correctAnswer": 1, "explanation": "In Python, you simply assign a value to a variable name without declaring its type explicitly."},
  {"id": 2, "question": "What data type is the result of: type(5)", "options": ["<class ''str''>", "<class ''int''>", "<class ''float''>", "<class ''bool''>"], "correctAnswer": 1, "explanation": "The number 5 is an integer, so type(5) returns <class ''int''>."},
  {"id": 3, "question": "Which of these is NOT a valid Python data type?", "options": ["list", "tuple", "array", "dictionary"], "correctAnswer": 2, "explanation": "''array'' is not a built-in Python data type. You need to import the array module or use lists instead."}
]'),

(1, 3, 'Control Structures Quiz', 'Test your understanding of if statements, loops, and conditional logic', 12, 
'[{"id": 1, "question": "Which loop is guaranteed to execute at least once?", "options": ["for loop", "while loop", "do-while loop", "None of the above"], "correctAnswer": 3, "explanation": "Python doesn''t have a do-while loop. All loops in Python may execute zero times if the condition is initially false."}]'),

(1, 4, 'Functions & Modules Quiz', 'Test your knowledge of creating functions and importing modules', 15, 
'[{"id": 1, "question": "How do you define a function in Python?", "options": ["function myFunc():", "def myFunc():", "func myFunc():", "define myFunc():"], "correctAnswer": 1, "explanation": "In Python, functions are defined using the ''def'' keyword."}]'),

(1, 5, 'Object-Oriented Programming Quiz', 'Test your understanding of classes, objects, and OOP concepts', 18, 
'[{"id": 1, "question": "What is a class in Python?", "options": ["A function", "A blueprint for creating objects", "A variable", "A module"], "correctAnswer": 1, "explanation": "A class is a blueprint or template for creating objects with shared attributes and methods."}]'),

(1, 6, 'File Handling Quiz', 'Test your knowledge of reading and writing files in Python', 12, 
'[{"id": 1, "question": "Which method is used to read an entire file in Python?", "options": ["read()", "readlines()", "readline()", "All of the above"], "correctAnswer": 0, "explanation": "The read() method reads the entire file content as a string."}]'),

(1, 7, 'Web Scraping Quiz', 'Test your understanding of web scraping with BeautifulSoup', 15, 
'[{"id": 1, "question": "What library is commonly used for web scraping in Python?", "options": ["requests", "BeautifulSoup", "Both A and B", "urllib"], "correctAnswer": 2, "explanation": "Both requests (for making HTTP requests) and BeautifulSoup (for parsing HTML) are commonly used together for web scraping."}]'),

(1, 8, 'Flask API Development Quiz', 'Test your knowledge of building REST APIs with Flask', 20, 
'[{"id": 1, "question": "What decorator is used to define a route in Flask?", "options": ["@route", "@app.route", "@flask.route", "@path"], "correctAnswer": 1, "explanation": "The @app.route decorator is used to bind a function to a URL route in Flask."}]'),

(1, 9, 'Database Integration Quiz', 'Test your understanding of working with databases in Python', 15, 
'[{"id": 1, "question": "Which Python library is commonly used for database operations?", "options": ["sqlite3", "sqlalchemy", "psycopg2", "All of the above"], "correctAnswer": 3, "explanation": "All these libraries are used for database operations: sqlite3 for SQLite, sqlalchemy as an ORM, and psycopg2 for PostgreSQL."}]'),

(1, 10, 'Data Analysis with Pandas Quiz', 'Test your knowledge of data manipulation and analysis', 18, 
'[{"id": 1, "question": "What is Pandas primarily used for?", "options": ["Web development", "Data manipulation and analysis", "Game development", "Mobile apps"], "correctAnswer": 1, "explanation": "Pandas is a powerful library for data manipulation, cleaning, and analysis in Python."}]'),

(1, 11, 'GUI Development Quiz', 'Test your understanding of creating desktop applications with Tkinter', 15, 
'[{"id": 1, "question": "What is Tkinter?", "options": ["A web framework", "A GUI toolkit for Python", "A database library", "A testing framework"], "correctAnswer": 1, "explanation": "Tkinter is Python''s standard GUI (Graphical User Interface) toolkit for creating desktop applications."}]'),

(1, 12, 'Final Project Quiz', 'Comprehensive test covering all Python concepts learned', 25, 
'[{"id": 1, "question": "Which of the following best describes Python?", "options": ["Compiled language", "Interpreted language", "Assembly language", "Machine language"], "correctAnswer": 1, "explanation": "Python is an interpreted language, meaning code is executed line by line by the Python interpreter."}]'),

-- Course 2: Machine Learning & AI Fundamentals (10 classes)
(2, 1, 'Introduction to Machine Learning Quiz', 'Test your understanding of basic ML concepts', 15, 
'[{"id": 1, "question": "What does ML stand for?", "options": ["Machine Learning", "Manual Labor", "Multiple Layers", "Memory Loss"], "correctAnswer": 0, "explanation": "ML stands for Machine Learning, a subset of artificial intelligence."}]'),

(2, 2, 'Data Preprocessing Quiz', 'Test your knowledge of data cleaning and preparation', 18, 
'[{"id": 1, "question": "What is the purpose of data preprocessing?", "options": ["To make data pretty", "To clean and prepare data for ML models", "To reduce file size", "To encrypt data"], "correctAnswer": 1, "explanation": "Data preprocessing involves cleaning, transforming, and preparing raw data for machine learning algorithms."}]'),

(2, 3, 'Linear & Logistic Regression Quiz', 'Test your understanding of regression algorithms', 20, 
'[{"id": 1, "question": "Linear regression is used for?", "options": ["Classification", "Prediction of continuous values", "Clustering", "Data visualization"], "correctAnswer": 1, "explanation": "Linear regression is used to predict continuous numerical values based on input features."}]'),

(2, 4, 'Decision Trees Quiz', 'Test your knowledge of tree-based algorithms', 15, 
'[{"id": 1, "question": "What is the main advantage of decision trees?", "options": ["High accuracy", "Easy to interpret", "Fast training", "Low memory usage"], "correctAnswer": 1, "explanation": "Decision trees are highly interpretable and easy to understand, making them valuable for explainable AI."}]'),

(2, 5, 'Support Vector Machines Quiz', 'Test your understanding of SVM algorithms', 18, 
'[{"id": 1, "question": "What does SVM try to find?", "options": ["The average of data points", "The optimal separating hyperplane", "The center of clusters", "The correlation between features"], "correctAnswer": 1, "explanation": "SVM finds the optimal hyperplane that best separates different classes with maximum margin."}]'),

(2, 6, 'Clustering Algorithms Quiz', 'Test your knowledge of unsupervised learning', 15, 
'[{"id": 1, "question": "K-means clustering is what type of learning?", "options": ["Supervised", "Unsupervised", "Reinforcement", "Semi-supervised"], "correctAnswer": 1, "explanation": "K-means is an unsupervised learning algorithm that groups data points into clusters without labeled examples."}]'),

(2, 7, 'Neural Networks Basics Quiz', 'Test your understanding of artificial neural networks', 20, 
'[{"id": 1, "question": "What is a neuron in a neural network?", "options": ["A brain cell", "A computational unit that processes inputs", "A data point", "A programming function"], "correctAnswer": 1, "explanation": "A neuron is a computational unit that receives inputs, applies weights and activation functions, and produces an output."}]'),

(2, 8, 'Deep Learning Quiz', 'Test your knowledge of deep neural networks', 22, 
'[{"id": 1, "question": "What makes a neural network ''deep''?", "options": ["Large dataset", "Multiple hidden layers", "Complex algorithms", "High accuracy"], "correctAnswer": 1, "explanation": "A deep neural network has multiple hidden layers between the input and output layers."}]'),

(2, 9, 'Model Evaluation Quiz', 'Test your understanding of ML model assessment', 15, 
'[{"id": 1, "question": "What is cross-validation used for?", "options": ["Data cleaning", "Model evaluation", "Feature selection", "Data visualization"], "correctAnswer": 1, "explanation": "Cross-validation is a technique to assess how well a model generalizes to unseen data."}]'),

(2, 10, 'ML Project Quiz', 'Comprehensive test covering end-to-end ML workflow', 25, 
'[{"id": 1, "question": "What is the typical first step in any ML project?", "options": ["Model training", "Data collection and exploration", "Model deployment", "Performance evaluation"], "correctAnswer": 1, "explanation": "Data collection and exploration is typically the first step to understand the problem and available data."}]'),

-- Course 3: Full Stack Web Development Bootcamp (15 classes)
(3, 1, 'HTML & CSS Fundamentals Quiz', 'Test your knowledge of web structure and styling', 12, 
'[{"id": 1, "question": "What does HTML stand for?", "options": ["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlink and Text Markup Language"], "correctAnswer": 0, "explanation": "HTML stands for Hyper Text Markup Language, the standard markup language for creating web pages."}]'),

(3, 2, 'Modern JavaScript Quiz', 'Test your understanding of ES6+ JavaScript features', 18, 
'[{"id": 1, "question": "What is the difference between let and var?", "options": ["No difference", "let has block scope, var has function scope", "let is faster", "var is newer"], "correctAnswer": 1, "explanation": "let has block scope while var has function scope, making let safer and more predictable."}]'),

(3, 3, 'React.js Fundamentals Quiz', 'Test your knowledge of React concepts and components', 20, 
'[{"id": 1, "question": "What is JSX?", "options": ["A new programming language", "JavaScript XML syntax extension", "A database query language", "A CSS framework"], "correctAnswer": 1, "explanation": "JSX is a syntax extension for JavaScript that allows you to write HTML-like code in React components."}]'),

(3, 4, 'React Hooks Quiz', 'Test your understanding of React hooks and state management', 18, 
'[{"id": 1, "question": "What is the purpose of useState hook?", "options": ["To fetch data", "To manage component state", "To handle events", "To style components"], "correctAnswer": 1, "explanation": "useState hook allows functional components to have and manage local state."}]'),

(3, 5, 'Node.js & Express Quiz', 'Test your knowledge of backend development with Node.js', 20, 
'[{"id": 1, "question": "What is Node.js?", "options": ["A web browser", "A JavaScript runtime for server-side development", "A database", "A CSS framework"], "correctAnswer": 1, "explanation": "Node.js is a JavaScript runtime built on Chrome''s V8 engine that allows JavaScript to run on servers."}]'),

(3, 6, 'RESTful API Quiz', 'Test your understanding of API design and development', 18, 
'[{"id": 1, "question": "What does REST stand for?", "options": ["Really Easy Simple Technology", "Representational State Transfer", "Remote Execution Service Tool", "Rapid Enterprise Service Technology"], "correctAnswer": 1, "explanation": "REST stands for Representational State Transfer, an architectural style for designing web services."}]'),

(3, 7, 'MongoDB Quiz', 'Test your knowledge of NoSQL database operations', 15, 
'[{"id": 1, "question": "What type of database is MongoDB?", "options": ["Relational", "NoSQL Document", "Graph", "Key-value"], "correctAnswer": 1, "explanation": "MongoDB is a NoSQL document database that stores data in flexible, JSON-like documents."}]'),

(3, 8, 'Authentication & Security Quiz', 'Test your understanding of web security concepts', 20, 
'[{"id": 1, "question": "What is JWT?", "options": ["JavaScript Web Token", "JSON Web Token", "Java Web Technology", "Just Web Things"], "correctAnswer": 1, "explanation": "JWT stands for JSON Web Token, a compact way to securely transmit information between parties."}]'),

(3, 9, 'Frontend-Backend Integration Quiz', 'Test your knowledge of connecting frontend and backend', 18, 
'[{"id": 1, "question": "What is CORS?", "options": ["Cross-Origin Resource Sharing", "Component Object Request System", "Client-Only Rendering Service", "Common Object Resource Standard"], "correctAnswer": 0, "explanation": "CORS is a mechanism that allows web pages to access resources from different domains."}]'),

(3, 10, 'Testing & Debugging Quiz', 'Test your understanding of testing methodologies', 15, 
'[{"id": 1, "question": "What is unit testing?", "options": ["Testing the entire application", "Testing individual components in isolation", "Testing user interface", "Testing database connections"], "correctAnswer": 1, "explanation": "Unit testing involves testing individual components or functions in isolation to ensure they work correctly."}]'),

(3, 11, 'Progressive Web Apps Quiz', 'Test your knowledge of PWA development', 18, 
'[{"id": 1, "question": "What makes an app a Progressive Web App?", "options": ["It uses React", "It works offline and feels like a native app", "It''s written in JavaScript", "It uses a database"], "correctAnswer": 1, "explanation": "PWAs provide native app-like experiences, including offline functionality and installability."}]'),

(3, 12, 'Performance Optimization Quiz', 'Test your understanding of web performance', 15, 
'[{"id": 1, "question": "What is lazy loading?", "options": ["Loading data slowly", "Loading content only when needed", "Loading everything at once", "Loading with delays"], "correctAnswer": 1, "explanation": "Lazy loading is a technique where content is loaded only when it''s needed, improving initial page load times."}]'),

(3, 13, 'Docker & Containerization Quiz', 'Test your knowledge of containerization concepts', 18, 
'[{"id": 1, "question": "What is Docker?", "options": ["A programming language", "A containerization platform", "A database", "A web framework"], "correctAnswer": 1, "explanation": "Docker is a platform that packages applications and their dependencies into lightweight, portable containers."}]'),

(3, 14, 'Cloud Deployment Quiz', 'Test your understanding of cloud platforms and deployment', 20, 
'[{"id": 1, "question": "What is the main benefit of cloud deployment?", "options": ["Cheaper development", "Scalability and accessibility", "Faster coding", "Better design"], "correctAnswer": 1, "explanation": "Cloud deployment provides scalability, global accessibility, and managed infrastructure benefits."}]'),

(3, 15, 'Full Stack Capstone Quiz', 'Comprehensive test covering the entire full-stack development', 30, 
'[{"id": 1, "question": "What technologies make up the MERN stack?", "options": ["MySQL, Express, React, Node", "MongoDB, Express, React, Node", "MongoDB, Electron, React, npm", "MySQL, Electron, Redux, Node"], "correctAnswer": 1, "explanation": "MERN stack consists of MongoDB (database), Express.js (backend), React (frontend), and Node.js (runtime)."}]'),

-- Course 4: Data Science with R & Python (8 classes)
(4, 1, 'Data Science Introduction Quiz', 'Test your understanding of data science fundamentals', 15, 
'[{"id": 1, "question": "What is the primary goal of data science?", "options": ["Create websites", "Extract insights from data", "Build mobile apps", "Design graphics"], "correctAnswer": 1, "explanation": "Data science aims to extract meaningful insights and knowledge from structured and unstructured data."}]'),

(4, 2, 'R Programming Quiz', 'Test your knowledge of R programming language', 18, 
'[{"id": 1, "question": "What is R primarily used for?", "options": ["Web development", "Statistical analysis and data visualization", "Mobile development", "Game development"], "correctAnswer": 1, "explanation": "R is specifically designed for statistical computing, data analysis, and visualization."}]'),

(4, 3, 'Data Visualization Quiz', 'Test your understanding of creating charts and graphs', 15, 
'[{"id": 1, "question": "Which R package is most commonly used for data visualization?", "options": ["dplyr", "ggplot2", "tidyr", "readr"], "correctAnswer": 1, "explanation": "ggplot2 is the most popular and powerful package for creating visualizations in R."}]'),

(4, 4, 'Statistical Analysis Quiz', 'Test your knowledge of descriptive and inferential statistics', 20, 
'[{"id": 1, "question": "What is the difference between descriptive and inferential statistics?", "options": ["No difference", "Descriptive summarizes data, inferential makes predictions", "Descriptive is harder", "Inferential is faster"], "correctAnswer": 1, "explanation": "Descriptive statistics summarize data, while inferential statistics make predictions about populations from samples."}]'),

(4, 5, 'Data Cleaning Quiz', 'Test your understanding of data preprocessing techniques', 18, 
'[{"id": 1, "question": "What is the most common issue in real-world datasets?", "options": ["Too much data", "Missing values", "Perfect data", "Small datasets"], "correctAnswer": 1, "explanation": "Missing values are one of the most common data quality issues that data scientists must address."}]'),

(4, 6, 'Predictive Modeling Quiz', 'Test your knowledge of building prediction models', 20, 
'[{"id": 1, "question": "What is overfitting in machine learning?", "options": ["Model is too simple", "Model memorizes training data but fails on new data", "Model is too fast", "Model uses too little data"], "correctAnswer": 1, "explanation": "Overfitting occurs when a model learns the training data too well, including noise, and fails to generalize to new data."}]'),

(4, 7, 'Big Data Analytics Quiz', 'Test your understanding of handling large datasets', 20, 
'[{"id": 1, "question": "What characterizes Big Data?", "options": ["Volume only", "Volume, Velocity, and Variety", "Only structured data", "Small datasets"], "correctAnswer": 1, "explanation": "Big Data is characterized by the 3 Vs: Volume (size), Velocity (speed), and Variety (types of data)."}]'),

(4, 8, 'Data Science Capstone Quiz', 'Comprehensive test covering the entire data science workflow', 25, 
'[{"id": 1, "question": "What is the typical sequence in a data science project?", "options": ["Model, Data, Deploy", "Question, Data, Analyze, Communicate", "Code, Test, Ship", "Plan, Build, Test"], "correctAnswer": 1, "explanation": "A typical data science workflow involves: Define question, Collect data, Analyze/Model, and Communicate results."}]'),

-- Course 5: Digital Marketing Mastery (6 classes)
(5, 1, 'Digital Marketing Fundamentals Quiz', 'Test your understanding of online marketing basics', 12, 
'[{"id": 1, "question": "What is digital marketing?", "options": ["Only social media marketing", "Marketing using digital technologies and platforms", "Email marketing only", "Website creation"], "correctAnswer": 1, "explanation": "Digital marketing encompasses all marketing efforts that use electronic devices and digital platforms to reach customers."}]'),

(5, 2, 'SEO & Content Marketing Quiz', 'Test your knowledge of search optimization and content strategy', 18, 
'[{"id": 1, "question": "What does SEO stand for?", "options": ["Social Engagement Optimization", "Search Engine Optimization", "Sales Enhancement Operations", "Site Enhancement Options"], "correctAnswer": 1, "explanation": "SEO stands for Search Engine Optimization, the practice of optimizing websites to rank higher in search results."}]'),

(5, 3, 'Social Media Marketing Quiz', 'Test your understanding of social platform marketing', 15, 
'[{"id": 1, "question": "What is the primary goal of social media marketing?", "options": ["Get followers", "Build brand awareness and engage customers", "Post content", "Use hashtags"], "correctAnswer": 1, "explanation": "Social media marketing aims to build brand awareness, engage with customers, and drive business objectives through social platforms."}]'),

(5, 4, 'Google Ads & PPC Quiz', 'Test your knowledge of paid advertising campaigns', 20, 
'[{"id": 1, "question": "What does PPC stand for?", "options": ["Pay Per Click", "People Per Campaign", "Profit Per Customer", "Page Per Campaign"], "correctAnswer": 0, "explanation": "PPC stands for Pay Per Click, an advertising model where advertisers pay each time their ad is clicked."}]'),

(5, 5, 'Email Marketing Quiz', 'Test your understanding of email campaigns and automation', 15, 
'[{"id": 1, "question": "What is the most important metric in email marketing?", "options": ["Number of emails sent", "Open rate and click-through rate", "Email length", "Font size"], "correctAnswer": 1, "explanation": "Open rates and click-through rates are key metrics that indicate email engagement and effectiveness."}]'),

(5, 6, 'Analytics & ROI Quiz', 'Test your knowledge of measuring marketing performance', 18, 
'[{"id": 1, "question": "What does ROI stand for?", "options": ["Return on Investment", "Rate of Interest", "Revenue over Income", "Reach of Influence"], "correctAnswer": 0, "explanation": "ROI stands for Return on Investment, a measure of the efficiency and profitability of marketing investments."}]'),

-- Continue with remaining courses (6-20) with 4-8 classes each...

-- Course 6: Cybersecurity Ethical Hacking (8 classes)
(6, 1, 'Cybersecurity Fundamentals Quiz', 'Test your understanding of basic security concepts', 15, 
'[{"id": 1, "question": "What is the CIA triad in cybersecurity?", "options": ["Central Intelligence Agency", "Confidentiality, Integrity, Availability", "Computer Information Access", "Cyber Intelligence Analysis"], "correctAnswer": 1, "explanation": "The CIA triad represents the three core principles of information security: Confidentiality, Integrity, and Availability."}]'),

(6, 2, 'Network Security Quiz', 'Test your knowledge of securing network infrastructure', 18, 
'[{"id": 1, "question": "What is a firewall?", "options": ["A physical wall", "A network security device that monitors traffic", "An antivirus software", "A password manager"], "correctAnswer": 1, "explanation": "A firewall is a network security device that monitors and controls incoming and outgoing network traffic based on security rules."}]'),

(6, 3, 'Penetration Testing Quiz', 'Test your understanding of ethical hacking methodologies', 20, 
'[{"id": 1, "question": "What is penetration testing?", "options": ["Breaking into systems illegally", "Authorized testing to find security vulnerabilities", "Installing malware", "Stealing data"], "correctAnswer": 1, "explanation": "Penetration testing is an authorized practice of testing a system to find security vulnerabilities that could be exploited."}]'),

(6, 4, 'Web Application Security Quiz', 'Test your knowledge of web security vulnerabilities', 18, 
'[{"id": 1, "question": "What is SQL injection?", "options": ["A medical procedure", "A type of attack that inserts malicious SQL code", "A database optimization technique", "A programming language"], "correctAnswer": 1, "explanation": "SQL injection is a code injection technique where malicious SQL statements are inserted into application entry points."}]'),

(6, 5, 'Malware Analysis Quiz', 'Test your understanding of malicious software', 20, 
'[{"id": 1, "question": "What is malware?", "options": ["Good software", "Malicious software designed to harm systems", "Hardware components", "Network protocols"], "correctAnswer": 1, "explanation": "Malware is malicious software specifically designed to disrupt, damage, or gain unauthorized access to computer systems."}]'),

(6, 6, 'Incident Response Quiz', 'Test your knowledge of handling security incidents', 15, 
'[{"id": 1, "question": "What is the first step in incident response?", "options": ["Delete everything", "Identification and containment", "Blame someone", "Ignore it"], "correctAnswer": 1, "explanation": "The first steps in incident response are to identify the incident and contain it to prevent further damage."}]'),

(6, 7, 'Digital Forensics Quiz', 'Test your understanding of investigating cyber crimes', 20, 
'[{"id": 1, "question": "What is digital forensics?", "options": ["Creating digital art", "Investigation and analysis of digital evidence", "Software development", "Network administration"], "correctAnswer": 1, "explanation": "Digital forensics involves the investigation, collection, and analysis of digital evidence from computer systems and networks."}]'),

(6, 8, 'Security Certification Quiz', 'Comprehensive test covering ethical hacking concepts', 25, 
'[{"id": 1, "question": "What does CEH certification stand for?", "options": ["Computer Ethical Hacker", "Certified Ethical Hacker", "Cyber Expert Hacker", "Certified Expert Hacker"], "correctAnswer": 1, "explanation": "CEH stands for Certified Ethical Hacker, a professional certification for ethical hacking and penetration testing."}]')

ON CONFLICT (course_id, class_number) DO NOTHING;

-- Continue adding more courses... (This is a sample of the first 6 courses)
-- You can extend this pattern for all 20 courses

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_class_quizzes_updated_at 
    BEFORE UPDATE ON class_quizzes 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions (adjust based on your setup)
-- GRANT ALL PRIVILEGES ON class_quizzes TO your_admin_user;
-- GRANT SELECT, INSERT, UPDATE ON class_quizzes TO your_app_user;
