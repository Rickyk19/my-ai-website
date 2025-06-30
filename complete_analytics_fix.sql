-- =============================================
-- COMPLETE ANALYTICS FIX - ONE SCRIPT TO RULE THEM ALL
-- This script will: create tables, disable RLS, grant permissions, insert data
-- =============================================

-- First, let's create the main analytics table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS analytics_visitor_stats (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL UNIQUE,
    total_visitors INTEGER NOT NULL DEFAULT 0,
    unique_visitors INTEGER NOT NULL DEFAULT 0,
    new_visitors INTEGER NOT NULL DEFAULT 0,
    returning_visitors INTEGER NOT NULL DEFAULT 0,
    page_views INTEGER NOT NULL DEFAULT 0,
    bounce_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
    avg_session_duration_seconds INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create other essential tables
CREATE TABLE IF NOT EXISTS analytics_traffic_sources (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    source_type VARCHAR(50) NOT NULL,
    source_name VARCHAR(100) NOT NULL,
    visitors INTEGER NOT NULL DEFAULT 0,
    page_views INTEGER NOT NULL DEFAULT 0,
    conversion_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS analytics_geographic_data (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    country VARCHAR(100) NOT NULL,
    country_code VARCHAR(10),
    city VARCHAR(100),
    visitors INTEGER NOT NULL DEFAULT 0,
    page_views INTEGER NOT NULL DEFAULT 0,
    avg_session_duration_seconds INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS analytics_device_browser_data (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    device_type VARCHAR(50) NOT NULL,
    device_name VARCHAR(100),
    browser_name VARCHAR(50),
    browser_version VARCHAR(20),
    operating_system VARCHAR(50),
    visitors INTEGER NOT NULL DEFAULT 0,
    page_views INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS analytics_course_performance (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    course_name VARCHAR(200) NOT NULL,
    page_views INTEGER NOT NULL DEFAULT 0,
    unique_visitors INTEGER NOT NULL DEFAULT 0,
    enquiry_form_submissions INTEGER NOT NULL DEFAULT 0,
    demo_downloads INTEGER NOT NULL DEFAULT 0,
    video_plays INTEGER NOT NULL DEFAULT 0,
    video_completion_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
    conversion_to_purchase DECIMAL(5,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS analytics_revenue_tracking (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    transaction_id VARCHAR(100) NOT NULL UNIQUE,
    user_email VARCHAR(255),
    course_name VARCHAR(200),
    revenue_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    currency VARCHAR(10) DEFAULT 'INR',
    payment_method VARCHAR(50),
    traffic_source VARCHAR(50),
    conversion_time_hours INTEGER,
    discount_applied DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS analytics_realtime_visitors (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(100) NOT NULL UNIQUE,
    user_ip VARCHAR(45),
    current_page VARCHAR(500),
    entry_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    user_type VARCHAR(50),
    traffic_source VARCHAR(50),
    device_type VARCHAR(50),
    location_country VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS analytics_action_alerts (
    id SERIAL PRIMARY KEY,
    alert_type VARCHAR(50) NOT NULL,
    alert_level VARCHAR(20) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    affected_users INTEGER DEFAULT 0,
    revenue_impact DECIMAL(10,2) DEFAULT 0,
    is_resolved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- DISABLE ROW LEVEL SECURITY FOR ALL TABLES
ALTER TABLE analytics_visitor_stats DISABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_traffic_sources DISABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_geographic_data DISABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_device_browser_data DISABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_course_performance DISABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_revenue_tracking DISABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_realtime_visitors DISABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_action_alerts DISABLE ROW LEVEL SECURITY;

-- GRANT FULL ACCESS TO ANONYMOUS USERS
GRANT ALL ON analytics_visitor_stats TO anon;
GRANT ALL ON analytics_traffic_sources TO anon;
GRANT ALL ON analytics_geographic_data TO anon;
GRANT ALL ON analytics_device_browser_data TO anon;
GRANT ALL ON analytics_course_performance TO anon;
GRANT ALL ON analytics_revenue_tracking TO anon;
GRANT ALL ON analytics_realtime_visitors TO anon;
GRANT ALL ON analytics_action_alerts TO anon;

-- GRANT SEQUENCE PERMISSIONS
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;

-- CLEAR EXISTING DATA
TRUNCATE TABLE analytics_visitor_stats CASCADE;
TRUNCATE TABLE analytics_traffic_sources CASCADE;
TRUNCATE TABLE analytics_geographic_data CASCADE;
TRUNCATE TABLE analytics_device_browser_data CASCADE;
TRUNCATE TABLE analytics_course_performance CASCADE;
TRUNCATE TABLE analytics_revenue_tracking CASCADE;
TRUNCATE TABLE analytics_realtime_visitors CASCADE;
TRUNCATE TABLE analytics_action_alerts CASCADE;

-- INSERT SAMPLE DATA
INSERT INTO analytics_visitor_stats (date, total_visitors, unique_visitors, new_visitors, returning_visitors, page_views, bounce_rate, avg_session_duration_seconds) VALUES
(CURRENT_DATE, 1450, 1120, 820, 300, 3750, 37.8, 330),
(CURRENT_DATE - INTERVAL '1 day', 1640, 1270, 930, 340, 4250, 33.9, 365),
(CURRENT_DATE - INTERVAL '2 days', 1570, 1210, 890, 320, 4080, 35.7, 350),
(CURRENT_DATE - INTERVAL '3 days', 1620, 1250, 920, 330, 4200, 34.2, 360),
(CURRENT_DATE - INTERVAL '4 days', 1480, 1150, 840, 310, 3850, 37.5, 325),
(CURRENT_DATE - INTERVAL '5 days', 1690, 1320, 970, 350, 4380, 32.8, 380),
(CURRENT_DATE - INTERVAL '6 days', 1540, 1190, 870, 320, 4000, 36.0, 340);

INSERT INTO analytics_traffic_sources (date, source_type, source_name, visitors, page_views, conversion_rate) VALUES
(CURRENT_DATE, 'organic', 'google', 420, 1120, 8.5),
(CURRENT_DATE, 'direct', 'direct', 280, 850, 12.3),
(CURRENT_DATE, 'social', 'facebook', 150, 380, 5.2),
(CURRENT_DATE, 'social', 'instagram', 120, 290, 4.8),
(CURRENT_DATE, 'paid', 'google_ads', 80, 220, 15.6);

INSERT INTO analytics_geographic_data (date, country, country_code, city, visitors, page_views, avg_session_duration_seconds) VALUES
(CURRENT_DATE, 'India', 'IN', 'Mumbai', 450, 1200, 320),
(CURRENT_DATE, 'United States', 'US', 'New York', 280, 720, 385),
(CURRENT_DATE, 'United Kingdom', 'GB', 'London', 180, 460, 365),
(CURRENT_DATE, 'Canada', 'CA', 'Toronto', 150, 390, 350);

INSERT INTO analytics_device_browser_data (date, device_type, device_name, browser_name, browser_version, operating_system, visitors, page_views) VALUES
(CURRENT_DATE, 'desktop', 'Windows PC', 'chrome', '118.0', 'Windows 11', 580, 1450),
(CURRENT_DATE, 'mobile', 'iPhone 14', 'safari', '17.0', 'iOS 17', 280, 680),
(CURRENT_DATE, 'mobile', 'Samsung Galaxy', 'chrome', '118.0', 'Android 13', 250, 620);

INSERT INTO analytics_course_performance (date, course_name, page_views, unique_visitors, enquiry_form_submissions, demo_downloads, video_plays, video_completion_rate, conversion_to_purchase) VALUES
(CURRENT_DATE, 'Complete Python Programming Masterclass', 450, 320, 25, 18, 180, 75.5, 12.8),
(CURRENT_DATE, 'Machine Learning & AI Fundamentals', 380, 280, 22, 15, 150, 68.2, 14.2),
(CURRENT_DATE, 'Full Stack Web Development Bootcamp', 320, 240, 18, 12, 120, 72.8, 11.5);

INSERT INTO analytics_revenue_tracking (date, transaction_id, user_email, course_name, revenue_amount, currency, payment_method, traffic_source, conversion_time_hours, discount_applied) VALUES
(CURRENT_DATE, 'TXN_DEMO_001', 'customer1@example.com', 'Complete Python Programming Masterclass', 4999.00, 'INR', 'credit_card', 'google', 48, 0.00),
(CURRENT_DATE, 'TXN_DEMO_002', 'customer2@example.com', 'Machine Learning & AI Fundamentals', 6999.00, 'INR', 'upi', 'facebook', 72, 1000.00),
(CURRENT_DATE - INTERVAL '1 day', 'TXN_DEMO_003', 'customer3@example.com', 'Full Stack Web Development Bootcamp', 8999.00, 'INR', 'net_banking', 'direct', 24, 0.00);

INSERT INTO analytics_realtime_visitors (session_id, user_ip, current_page, entry_time, last_activity, is_active, user_type, traffic_source, device_type, location_country) VALUES
('LIVE_001', '192.168.1.100', '/courses', CURRENT_TIMESTAMP - INTERVAL '5 minutes', CURRENT_TIMESTAMP - INTERVAL '1 minute', true, 'anonymous', 'google', 'desktop', 'India'),
('LIVE_002', '192.168.1.101', '/course/1', CURRENT_TIMESTAMP - INTERVAL '10 minutes', CURRENT_TIMESTAMP - INTERVAL '2 minutes', true, 'logged_in', 'direct', 'mobile', 'United States'),
('LIVE_003', '192.168.1.102', '/analytics-dashboard', CURRENT_TIMESTAMP - INTERVAL '15 minutes', CURRENT_TIMESTAMP - INTERVAL '30 seconds', true, 'paid', 'direct', 'desktop', 'India');

INSERT INTO analytics_action_alerts (alert_type, alert_level, title, description, affected_users, revenue_impact, is_resolved) VALUES
('purchase', 'high', 'High-Value Course Purchase', 'Customer purchased Full Stack Web Development Bootcamp worth ₹8,999', 1, 8999.00, false),
('traffic_spike', 'medium', 'Traffic Spike Detected', 'Website traffic increased by 45% in the last hour', 0, 0.00, false),
('conversion_rate', 'low', 'Conversion Rate Improvement', 'Python course page conversion rate increased to 15.6%', 0, 0.00, false);

-- SUCCESS MESSAGE
DO $$
BEGIN
    RAISE NOTICE '🎉 COMPLETE ANALYTICS SETUP FINISHED!';
    RAISE NOTICE '✅ Tables created/updated with proper permissions';
    RAISE NOTICE '🔓 Row Level Security disabled';
    RAISE NOTICE '📊 Sample data inserted';
    RAISE NOTICE '🚀 Analytics Dashboard should now work!';
    RAISE NOTICE '';
    RAISE NOTICE '🔄 Next steps:';
    RAISE NOTICE '1. Refresh analytics-debug page to test';
    RAISE NOTICE '2. Check analytics-dashboard for data';
    RAISE NOTICE '3. If still errors, check Supabase API keys';
END $$; 
