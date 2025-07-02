-- =============================================
-- AI CHATBOT ENTRIES TABLE
-- Store student information who access the AI chatbot
-- =============================================

-- Create the ai_chatbot_entries table
CREATE TABLE IF NOT EXISTS ai_chatbot_entries (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    mobile_number VARCHAR(20) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    interested_courses TEXT[], -- Array of course names they're interested in
    session_count INTEGER DEFAULT 1, -- How many times they've used chatbot
    last_active_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_messages_sent INTEGER DEFAULT 0,
    lead_status VARCHAR(50) DEFAULT 'new', -- new, interested, converted, etc.
    notes TEXT, -- Any additional notes about the lead
    source VARCHAR(100) DEFAULT 'ai_chatbot', -- Where they came from
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ai_chatbot_email ON ai_chatbot_entries(email);
CREATE INDEX IF NOT EXISTS idx_ai_chatbot_mobile ON ai_chatbot_entries(mobile_number);
CREATE INDEX IF NOT EXISTS idx_ai_chatbot_created_at ON ai_chatbot_entries(created_at);
CREATE INDEX IF NOT EXISTS idx_ai_chatbot_lead_status ON ai_chatbot_entries(lead_status);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_ai_chatbot_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_ai_chatbot_entries_updated_at
    BEFORE UPDATE ON ai_chatbot_entries
    FOR EACH ROW
    EXECUTE FUNCTION update_ai_chatbot_updated_at();

-- Insert some sample data for testing
INSERT INTO ai_chatbot_entries (email, mobile_number, first_name, last_name, interested_courses, session_count, total_messages_sent, lead_status) VALUES
('john.doe@example.com', '+91-9876543210', 'John', 'Doe', ARRAY['Python Programming', 'AI Fundamentals'], 3, 25, 'interested'),
('priya.sharma@example.com', '+91-8765432109', 'Priya', 'Sharma', ARRAY['Machine Learning', 'Data Science'], 1, 8, 'new'),
('rahul.kumar@example.com', '+91-7654321098', 'Rahul', 'Kumar', ARRAY['Full Stack Development'], 5, 42, 'converted');

-- Grant necessary permissions (adjust as needed for your RLS policies)
-- ALTER TABLE ai_chatbot_entries ENABLE ROW LEVEL SECURITY;

-- Create policy to allow read/write for authenticated users
-- CREATE POLICY "Allow authenticated users to manage chatbot entries" ON ai_chatbot_entries
--     FOR ALL USING (auth.role() = 'authenticated');

-- Display table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default 
FROM information_schema.columns 
WHERE table_name = 'ai_chatbot_entries' 
ORDER BY ordinal_position; 
