-- Setup for Members Login Area Testing
-- Run this after the main course table setup

-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create orders table if it doesn't exist  
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  course_name VARCHAR(255) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  payment_method VARCHAR(100),
  transaction_id VARCHAR(255),
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample user for testing
INSERT INTO users (name, email, status) VALUES 
('John Doe', 'student@example.com', 'active'),
('Jane Smith', 'learner@test.com', 'active'),
('Mike Johnson', 'mike@demo.com', 'active')
ON CONFLICT (email) DO NOTHING;

-- Insert sample completed orders for testing
INSERT INTO orders (course_name, amount, customer_name, customer_email, status, payment_method, transaction_id) VALUES
('Introduction to Machine Learning', 2999.00, 'John Doe', 'student@example.com', 'completed', 'credit_card', 'TXN_ML_001'),
('Deep Learning Fundamentals', 4999.00, 'John Doe', 'student@example.com', 'completed', 'debit_card', 'TXN_DL_002'),
('AI for Beginners', 1999.00, 'Jane Smith', 'learner@test.com', 'completed', 'upi', 'TXN_AI_003'),
('Advanced Neural Networks', 6999.00, 'Mike Johnson', 'mike@demo.com', 'completed', 'net_banking', 'TXN_NN_004');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Enable Row Level Security (RLS) if not already enabled
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY IF NOT EXISTS "Users can view their own data" ON users
    FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Users can insert their own data" ON users  
    FOR INSERT WITH CHECK (true);

-- Create policies for orders table
CREATE POLICY IF NOT EXISTS "Users can view orders" ON orders
    FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Users can insert orders" ON orders
    FOR INSERT WITH CHECK (true);

-- Update trigger for updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update trigger to tables
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at 
    BEFORE UPDATE ON orders 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Sample member login credentials for testing:
-- Email: student@example.com (Password: any - verification is simplified for demo)
-- Email: learner@test.com (Password: any - verification is simplified for demo)  
-- Email: mike@demo.com (Password: any - verification is simplified for demo)

-- Note: In production, you would implement proper password hashing and authentication 
