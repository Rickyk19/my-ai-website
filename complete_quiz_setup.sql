-- COMPREHENSIVE QUIZ SETUP FOR ALL 20 COURSES
-- This will create quizzes for every class in every course

CREATE TABLE IF NOT EXISTS class_quizzes (
    id SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL,
    class_number INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    time_limit INTEGER DEFAULT 15,
    questions JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE(course_id, class_number)
);

CREATE INDEX IF NOT EXISTS idx_class_quizzes_course_class ON class_quizzes(course_id, class_number);

-- DELETE existing quizzes to start fresh
DELETE FROM class_quizzes;

-- INSERT comprehensive quiz data for ALL courses
INSERT INTO class_quizzes (course_id, class_number, title, description, time_limit, questions) VALUES

-- COURSE 1: Complete Python Programming Masterclass (12 classes)
(1, 1, 'Python Basics & Setup Quiz', 'Test your understanding of Python installation and basic concepts', 10, 
'[{"id": 1, "question": "What is Python?", "options": ["A type of snake", "A high-level programming language", "A web browser", "A database system"], "correctAnswer": 1, "explanation": "Python is a high-level, interpreted programming language known for its simplicity and readability."}, {"id": 2, "question": "Which command is used to install Python packages?", "options": ["install", "pip install", "python install", "get"], "correctAnswer": 1, "explanation": "pip install is the standard command for installing Python packages."}]'),

(1, 2, 'Variables & Data Types Quiz', 'Test your knowledge of Python variables and data types', 15, 
'[{"id": 1, "question": "Which of the following is the correct way to declare a variable in Python?", "options": ["var name = \"John\"", "name = \"John\"", "string name = \"John\"", "declare name = \"John\""], "correctAnswer": 1, "explanation": "In Python, you simply assign a value to a variable name without declaring its type explicitly."}, {"id": 2, "question": "What data type is the result of: type(5)", "options": ["<class ''str''>", "<class ''int''>", "<class ''float''>", "<class ''bool''>"], "correctAnswer": 1, "explanation": "The number 5 is an integer, so type(5) returns <class ''int''>."}]'),

(1, 3, 'Control Structures Quiz', 'Test your understanding of if statements, loops, and conditional logic', 12, 
'[{"id": 1, "question": "Which loop is used to iterate over a sequence in Python?", "options": ["for loop", "while loop", "do-while loop", "foreach loop"], "correctAnswer": 0, "explanation": "The for loop is commonly used to iterate over sequences like lists, tuples, and strings."}, {"id": 2, "question": "How do you write an if statement in Python?", "options": ["if (condition)", "if condition:", "if condition then", "if condition {}"], "correctAnswer": 1, "explanation": "Python if statements use a colon and proper indentation."}]'),

(1, 4, 'Functions & Modules Quiz', 'Test your knowledge of creating functions and importing modules', 15, 
'[{"id": 1, "question": "How do you define a function in Python?", "options": ["function myFunc():", "def myFunc():", "func myFunc():", "define myFunc():"], "correctAnswer": 1, "explanation": "In Python, functions are defined using the ''def'' keyword."}, {"id": 2, "question": "How do you import a module in Python?", "options": ["include module", "import module", "require module", "use module"], "correctAnswer": 1, "explanation": "The ''import'' keyword is used to include modules in Python."}]'),

(1, 5, 'Object-Oriented Programming Quiz', 'Test your understanding of classes, objects, and OOP concepts', 18, 
'[{"id": 1, "question": "What is a class in Python?", "options": ["A function", "A blueprint for creating objects", "A variable", "A module"], "correctAnswer": 1, "explanation": "A class is a blueprint or template for creating objects with shared attributes and methods."}, {"id": 2, "question": "What is inheritance in OOP?", "options": ["Creating new variables", "A class acquiring properties from another class", "Deleting objects", "Importing modules"], "correctAnswer": 1, "explanation": "Inheritance allows a class to inherit attributes and methods from a parent class."}]'),

(1, 6, 'File Handling & I/O Quiz', 'Test your knowledge of reading and writing files in Python', 12, 
'[{"id": 1, "question": "Which method is used to read an entire file in Python?", "options": ["read()", "readlines()", "readline()", "All of the above"], "correctAnswer": 0, "explanation": "The read() method reads the entire file content as a string."}, {"id": 2, "question": "What is the proper way to open a file in Python?", "options": ["file = open(''filename'')", "with open(''filename'') as file:", "Both A and B", "open(''filename'')"], "correctAnswer": 2, "explanation": "Both methods work, but ''with open()'' is preferred as it automatically closes the file."}]'),

(1, 7, 'Web Scraping with BeautifulSoup Quiz', 'Test your understanding of web scraping techniques', 15, 
'[{"id": 1, "question": "What library is commonly used for web scraping in Python?", "options": ["requests", "BeautifulSoup", "Both A and B", "urllib"], "correctAnswer": 2, "explanation": "Both requests (for making HTTP requests) and BeautifulSoup (for parsing HTML) are commonly used together."}, {"id": 2, "question": "What does BeautifulSoup do?", "options": ["Makes HTTP requests", "Parses HTML and XML", "Stores data", "Creates websites"], "correctAnswer": 1, "explanation": "BeautifulSoup is used for parsing HTML and XML documents."}]'),

(1, 8, 'API Development with Flask Quiz', 'Test your knowledge of building REST APIs with Flask', 20, 
'[{"id": 1, "question": "What decorator is used to define a route in Flask?", "options": ["@route", "@app.route", "@flask.route", "@path"], "correctAnswer": 1, "explanation": "The @app.route decorator is used to bind a function to a URL route in Flask."}, {"id": 2, "question": "What HTTP method is used to retrieve data?", "options": ["POST", "GET", "PUT", "DELETE"], "correctAnswer": 1, "explanation": "GET method is used to retrieve data from a server."}]'),

(1, 9, 'Database Integration Quiz', 'Test your understanding of working with databases in Python', 15, 
'[{"id": 1, "question": "Which Python library is commonly used for SQLite operations?", "options": ["sqlite3", "sqlalchemy", "psycopg2", "mysql-connector"], "correctAnswer": 0, "explanation": "sqlite3 is the built-in Python library for working with SQLite databases."}, {"id": 2, "question": "What is an ORM?", "options": ["Object Relational Mapping", "Online Resource Manager", "Operational Risk Management", "Open Resource Module"], "correctAnswer": 0, "explanation": "ORM stands for Object Relational Mapping, which maps database tables to Python objects."}]'),

(1, 10, 'Data Analysis with Pandas Quiz', 'Test your knowledge of data manipulation and analysis', 18, 
'[{"id": 1, "question": "What is Pandas primarily used for?", "options": ["Web development", "Data manipulation and analysis", "Game development", "Mobile apps"], "correctAnswer": 1, "explanation": "Pandas is a powerful library for data manipulation, cleaning, and analysis in Python."}, {"id": 2, "question": "What is a DataFrame in Pandas?", "options": ["A function", "A 2D data structure", "A module", "A variable type"], "correctAnswer": 1, "explanation": "A DataFrame is a 2D labeled data structure with columns that can be of different types."}]'),

(1, 11, 'GUI Development with Tkinter Quiz', 'Test your understanding of creating desktop applications', 15, 
'[{"id": 1, "question": "What is Tkinter?", "options": ["A web framework", "A GUI toolkit for Python", "A database library", "A testing framework"], "correctAnswer": 1, "explanation": "Tkinter is Python''s standard GUI (Graphical User Interface) toolkit for creating desktop applications."}, {"id": 2, "question": "What is a widget in Tkinter?", "options": ["A small tool", "A GUI component like buttons or labels", "A function", "A module"], "correctAnswer": 1, "explanation": "Widgets are GUI components like buttons, labels, entry fields, etc."}]'),

(1, 12, 'Final Project & Deployment Quiz', 'Comprehensive test covering all Python concepts learned', 25, 
'[{"id": 1, "question": "Which of the following best describes Python?", "options": ["Compiled language", "Interpreted language", "Assembly language", "Machine language"], "correctAnswer": 1, "explanation": "Python is an interpreted language, meaning code is executed line by line by the Python interpreter."}, {"id": 2, "question": "What is virtual environment in Python?", "options": ["A game environment", "An isolated Python environment for projects", "A web environment", "A testing environment"], "correctAnswer": 1, "explanation": "A virtual environment is an isolated Python environment that allows you to manage dependencies for different projects separately."}]'),

-- COURSE 2: Machine Learning & AI Fundamentals (10 classes)
(2, 1, 'Introduction to Machine Learning Quiz', 'Test your understanding of basic ML concepts', 15, 
'[{"id": 1, "question": "What does ML stand for?", "options": ["Machine Learning", "Manual Labor", "Multiple Layers", "Memory Loss"], "correctAnswer": 0, "explanation": "ML stands for Machine Learning, a subset of artificial intelligence."}, {"id": 2, "question": "What are the three main types of machine learning?", "options": ["Easy, Medium, Hard", "Supervised, Unsupervised, Reinforcement", "Fast, Slow, Medium", "Big, Small, Medium"], "correctAnswer": 1, "explanation": "The three main types are Supervised (with labels), Unsupervised (without labels), and Reinforcement learning (learning through rewards)."}]'),

(2, 2, 'Data Preprocessing Quiz', 'Test your knowledge of data cleaning and preparation', 18, 
'[{"id": 1, "question": "What is the purpose of data preprocessing?", "options": ["To make data pretty", "To clean and prepare data for ML models", "To reduce file size", "To encrypt data"], "correctAnswer": 1, "explanation": "Data preprocessing involves cleaning, transforming, and preparing raw data for machine learning algorithms."}, {"id": 2, "question": "What is feature scaling?", "options": ["Making features bigger", "Normalizing feature values to similar ranges", "Removing features", "Adding more features"], "correctAnswer": 1, "explanation": "Feature scaling normalizes feature values to similar ranges so no single feature dominates the model."}]'),

(2, 3, 'Linear & Logistic Regression Quiz', 'Test your understanding of regression algorithms', 20, 
'[{"id": 1, "question": "Linear regression is used for?", "options": ["Classification", "Prediction of continuous values", "Clustering", "Data visualization"], "correctAnswer": 1, "explanation": "Linear regression is used to predict continuous numerical values based on input features."}, {"id": 2, "question": "When do you use logistic regression?", "options": ["For continuous predictions", "For binary classification", "For clustering", "For data cleaning"], "correctAnswer": 1, "explanation": "Logistic regression is used for binary classification problems (yes/no, spam/not spam, etc.)."}]'),

(2, 4, 'Decision Trees & Random Forest Quiz', 'Test your knowledge of tree-based algorithms', 15, 
'[{"id": 1, "question": "What is the main advantage of decision trees?", "options": ["High accuracy", "Easy to interpret", "Fast training", "Low memory usage"], "correctAnswer": 1, "explanation": "Decision trees are highly interpretable and easy to understand, making them valuable for explainable AI."}, {"id": 2, "question": "What is Random Forest?", "options": ["A single tree", "An ensemble of decision trees", "A clustering algorithm", "A neural network"], "correctAnswer": 1, "explanation": "Random Forest is an ensemble method that combines multiple decision trees to improve accuracy and reduce overfitting."}]'),

(2, 5, 'Support Vector Machines Quiz', 'Test your understanding of SVM algorithms', 18, 
'[{"id": 1, "question": "What does SVM try to find?", "options": ["The average of data points", "The optimal separating hyperplane", "The center of clusters", "The correlation between features"], "correctAnswer": 1, "explanation": "SVM finds the optimal hyperplane that best separates different classes with maximum margin."}, {"id": 2, "question": "What is the kernel trick in SVM?", "options": ["A programming trick", "A way to handle non-linear data", "A speed optimization", "A memory trick"], "correctAnswer": 1, "explanation": "The kernel trick allows SVM to handle non-linearly separable data by mapping it to higher dimensions."}]'),

(2, 6, 'Clustering Algorithms Quiz', 'Test your knowledge of unsupervised learning', 15, 
'[{"id": 1, "question": "K-means clustering is what type of learning?", "options": ["Supervised", "Unsupervised", "Reinforcement", "Semi-supervised"], "correctAnswer": 1, "explanation": "K-means is an unsupervised learning algorithm that groups data points into clusters without labeled examples."}, {"id": 2, "question": "How do you choose the optimal number of clusters in K-means?", "options": ["Random guess", "Elbow method", "Maximum possible", "Always use 3"], "correctAnswer": 1, "explanation": "The elbow method helps determine the optimal number of clusters by plotting within-cluster sum of squares."}]'),

(2, 7, 'Neural Networks Basics Quiz', 'Test your understanding of artificial neural networks', 20, 
'[{"id": 1, "question": "What is a neuron in a neural network?", "options": ["A brain cell", "A computational unit that processes inputs", "A data point", "A programming function"], "correctAnswer": 1, "explanation": "A neuron is a computational unit that receives inputs, applies weights and activation functions, and produces an output."}, {"id": 2, "question": "What is an activation function?", "options": ["A function to start the program", "A function that determines neuron output", "A function to stop training", "A function to load data"], "correctAnswer": 1, "explanation": "An activation function determines whether a neuron should be activated based on the weighted input sum."}]'),

(2, 8, 'Deep Learning with TensorFlow Quiz', 'Test your knowledge of deep neural networks', 22, 
'[{"id": 1, "question": "What makes a neural network ''deep''?", "options": ["Large dataset", "Multiple hidden layers", "Complex algorithms", "High accuracy"], "correctAnswer": 1, "explanation": "A deep neural network has multiple hidden layers between the input and output layers."}, {"id": 2, "question": "What is TensorFlow?", "options": ["A programming language", "An open-source machine learning framework", "A database", "A web browser"], "correctAnswer": 1, "explanation": "TensorFlow is an open-source machine learning framework developed by Google for building and training neural networks."}]'),

(2, 9, 'Model Evaluation & Optimization Quiz', 'Test your understanding of ML model assessment', 15, 
'[{"id": 1, "question": "What is cross-validation used for?", "options": ["Data cleaning", "Model evaluation", "Feature selection", "Data visualization"], "correctAnswer": 1, "explanation": "Cross-validation is a technique to assess how well a model generalizes to unseen data."}, {"id": 2, "question": "What does accuracy measure?", "options": ["Speed of model", "Percentage of correct predictions", "Memory usage", "Training time"], "correctAnswer": 1, "explanation": "Accuracy measures the percentage of correct predictions made by the model."}]'),

(2, 10, 'Real-world ML Project Quiz', 'Comprehensive test covering end-to-end ML workflow', 25, 
'[{"id": 1, "question": "What is the typical first step in any ML project?", "options": ["Model training", "Data collection and exploration", "Model deployment", "Performance evaluation"], "correctAnswer": 1, "explanation": "Data collection and exploration is typically the first step to understand the problem and available data."}, {"id": 2, "question": "What is model deployment?", "options": ["Training the model", "Making the model available for use in production", "Collecting data", "Cleaning data"], "correctAnswer": 1, "explanation": "Model deployment involves making the trained model available for use in real-world applications."}]');

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for automatic timestamp updates
CREATE TRIGGER update_class_quizzes_updated_at 
    BEFORE UPDATE ON class_quizzes 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column(); 