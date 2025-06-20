-- Create courses table in Supabase
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE courses (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    fees DECIMAL(10,2) NOT NULL,
    duration TEXT NOT NULL,
    level TEXT NOT NULL CHECK (level IN ('Beginner', 'Intermediate', 'Advanced', 'Expert', 'All Levels')),
    video_link TEXT,
    category TEXT,
    prerequisites TEXT, -- Store as pipe-separated values: "Python|Math|Statistics"
    learning_outcomes TEXT, -- Store as pipe-separated values
    instructor TEXT NOT NULL,
    language TEXT NOT NULL DEFAULT 'English',
    certificate_included BOOLEAN DEFAULT true,
    max_students INTEGER,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index for faster queries
CREATE INDEX idx_courses_status ON courses(status);
CREATE INDEX idx_courses_category ON courses(category);
CREATE INDEX idx_courses_created_at ON courses(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read published courses
CREATE POLICY "Anyone can view published courses" ON courses
    FOR SELECT USING (status = 'published');

-- Create policy to allow admins to manage all courses
CREATE POLICY "Admins can manage all courses" ON courses
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- If you don't have role-based auth, you can use a simpler policy:
-- CREATE POLICY "Authenticated users can manage courses" ON courses
--     FOR ALL USING (auth.role() = 'authenticated');

-- Create a function to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_courses_updated_at 
    BEFORE UPDATE ON courses 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data (optional)
INSERT INTO courses (name, description, fees, duration, level, instructor, category, status) VALUES
('Introduction to AI', 'Learn the fundamentals of Artificial Intelligence including machine learning basics, neural networks, and real-world applications.', 2999.00, '8 weeks', 'Beginner', 'Dr. Sarah Johnson', 'AI Fundamentals', 'published'),
('Machine Learning Mastery', 'Advanced machine learning course covering supervised and unsupervised learning, deep learning, and model deployment.', 4999.00, '12 weeks', 'Intermediate', 'Prof. Michael Chen', 'Machine Learning', 'published'),
('Deep Learning with PyTorch', 'Master deep learning using PyTorch framework. Build neural networks, CNNs, RNNs, and transformers.', 5999.00, '16 weeks', 'Advanced', 'Dr. Emily Rodriguez', 'Deep Learning', 'draft'); 