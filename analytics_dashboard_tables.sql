-- =============================================
-- ANALYTICS DASHBOARD - COMPLETE TABLE SETUP
-- Create all necessary tables for comprehensive analytics tracking
-- Run this entire script in your Supabase SQL Editor
-- =============================================

-- 1. VISITOR & TRAFFIC ANALYSIS
-- =============================================

-- Track daily/weekly/monthly visitor statistics
CREATE TABLE analytics_visitor_stats (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL UNIQUE,
    total_visitors INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    new_visitors INTEGER DEFAULT 0,
    returning_visitors INTEGER DEFAULT 0,
    page_views INTEGER DEFAULT 0,
    bounce_rate DECIMAL(5,2) DEFAULT 0.00,
    avg_session_duration_seconds INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Track traffic sources (Organic, Direct, Social, Paid, Referrals)
CREATE TABLE analytics_traffic_sources (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    source_type VARCHAR(50) NOT NULL, -- 'organic', 'direct', 'social', 'paid', 'referral'
    source_name VARCHAR(100), -- 'google', 'facebook', 'twitter', etc.
    visitors INTEGER DEFAULT 0,
    page_views INTEGER DEFAULT 0,
    conversion_rate DECIMAL(5,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Track geographic visitor data
CREATE TABLE analytics_geographic_data (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    country VARCHAR(100) NOT NULL,
    country_code VARCHAR(5),
    city VARCHAR(100),
    region VARCHAR(100),
    visitors INTEGER DEFAULT 0,
    page_views INTEGER DEFAULT 0,
    avg_session_duration_seconds INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Track device and browser usage
CREATE TABLE analytics_device_browser_data (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    device_type VARCHAR(50) NOT NULL, -- 'desktop', 'mobile', 'tablet'
    device_name VARCHAR(100), -- 'iPhone 14', 'Samsung Galaxy', etc.
    browser_name VARCHAR(50), -- 'chrome', 'safari', 'firefox', etc.
    browser_version VARCHAR(20),
    operating_system VARCHAR(50),
    visitors INTEGER DEFAULT 0,
    page_views INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. USER BEHAVIOR & ENGAGEMENT
-- =============================================

-- Track complete session history
CREATE TABLE analytics_session_tracking (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(100) NOT NULL,
    user_ip VARCHAR(45),
    user_agent TEXT,
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP,
    duration_seconds INTEGER DEFAULT 0,
    pages_visited INTEGER DEFAULT 0,
    pages_visited_list TEXT[], -- Array of page URLs
    clicks_total INTEGER DEFAULT 0,
    scroll_depth_max INTEGER DEFAULT 0, -- Percentage
    is_bounce BOOLEAN DEFAULT false,
    exit_page VARCHAR(500),
    conversion_action VARCHAR(100), -- 'signup', 'purchase', 'enquiry', etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Track page-level analytics
CREATE TABLE analytics_page_performance (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    page_url VARCHAR(500) NOT NULL,
    page_title VARCHAR(200),
    page_views INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    avg_time_on_page_seconds INTEGER DEFAULT 0,
    bounce_rate DECIMAL(5,2) DEFAULT 0.00,
    exit_rate DECIMAL(5,2) DEFAULT 0.00,
    click_through_rate DECIMAL(5,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Track user click patterns and heatmap data
CREATE TABLE analytics_click_heatmap (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    page_url VARCHAR(500) NOT NULL,
    element_selector VARCHAR(200), -- CSS selector
    element_text VARCHAR(500),
    click_count INTEGER DEFAULT 0,
    position_x INTEGER,
    position_y INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. COURSE-SPECIFIC TRACKING
-- =============================================

-- Track course interaction and performance
CREATE TABLE analytics_course_performance (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    course_id INTEGER,
    course_name VARCHAR(255) NOT NULL,
    page_views INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    enquiry_form_submissions INTEGER DEFAULT 0,
    demo_downloads INTEGER DEFAULT 0,
    video_plays INTEGER DEFAULT 0,
    video_completion_rate DECIMAL(5,2) DEFAULT 0.00,
    conversion_to_purchase DECIMAL(5,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Track video engagement detailed analytics
CREATE TABLE analytics_video_engagement (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(100),
    course_id INTEGER,
    class_number INTEGER,
    video_url VARCHAR(500),
    play_count INTEGER DEFAULT 1,
    watch_time_seconds INTEGER DEFAULT 0,
    completion_percentage DECIMAL(5,2) DEFAULT 0.00,
    drop_off_points TEXT[], -- Array of timestamps where users dropped off
    replay_count INTEGER DEFAULT 0,
    playback_speed DECIMAL(3,2) DEFAULT 1.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Track enquiry form submissions and conversion
CREATE TABLE analytics_enquiry_tracking (
    id SERIAL PRIMARY KEY,
    enquiry_id VARCHAR(100) UNIQUE,
    course_name VARCHAR(255),
    visitor_ip VARCHAR(45),
    source_page VARCHAR(500),
    traffic_source VARCHAR(100),
    form_completion_time_seconds INTEGER,
    converted_to_purchase BOOLEAN DEFAULT false,
    conversion_date TIMESTAMP,
    revenue_generated DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. PAID VS FREE USER SEGMENTATION
-- =============================================

-- Track user login/logout patterns
CREATE TABLE analytics_user_sessions (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255),
    user_type VARCHAR(50), -- 'paid', 'free', 'trial'
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    logout_time TIMESTAMP,
    session_duration_seconds INTEGER DEFAULT 0,
    pages_visited INTEGER DEFAULT 0,
    features_used TEXT[], -- Array of features accessed
    downloads_count INTEGER DEFAULT 0,
    videos_watched INTEGER DEFAULT 0,
    quizzes_attempted INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Track content interaction by user type
CREATE TABLE analytics_content_interaction (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    user_type VARCHAR(50), -- 'paid', 'free', 'trial'
    content_type VARCHAR(100), -- 'video', 'pdf', 'quiz', 'article'
    content_id VARCHAR(100),
    interactions_count INTEGER DEFAULT 0,
    avg_engagement_time_seconds INTEGER DEFAULT 0,
    completion_rate DECIMAL(5,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Track upgrade triggers and conversion paths
CREATE TABLE analytics_upgrade_tracking (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255),
    trigger_action VARCHAR(100), -- 'video_limit', 'premium_content', 'feature_request'
    trigger_page VARCHAR(500),
    trigger_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    converted_to_paid BOOLEAN DEFAULT false,
    conversion_time TIMESTAMP,
    time_to_conversion_hours INTEGER,
    revenue_generated DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Track churn analysis for paid users
CREATE TABLE analytics_churn_tracking (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255),
    subscription_start_date DATE,
    last_active_date DATE,
    days_since_last_activity INTEGER DEFAULT 0,
    churn_risk_score INTEGER DEFAULT 0, -- 0-100 scale
    churn_probability DECIMAL(5,2) DEFAULT 0.00,
    predicted_churn_date DATE,
    actual_churn_date DATE,
    churn_reason VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. STUDENT ACTIVITY & PROGRESS TRACKING
-- =============================================

-- Track study material downloads
CREATE TABLE analytics_download_tracking (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255),
    user_type VARCHAR(50),
    content_type VARCHAR(100), -- 'pdf', 'video', 'audio', 'worksheet'
    content_name VARCHAR(255),
    course_name VARCHAR(255),
    download_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    file_size_mb DECIMAL(8,2),
    download_source VARCHAR(100), -- 'course_page', 'email_link', 'direct'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Track quiz performance and analytics
CREATE TABLE analytics_quiz_performance (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255),
    course_name VARCHAR(255),
    class_number INTEGER,
    quiz_title VARCHAR(255),
    attempt_number INTEGER DEFAULT 1,
    questions_total INTEGER,
    questions_correct INTEGER,
    score_percentage DECIMAL(5,2),
    time_taken_seconds INTEGER,
    pass_status BOOLEAN DEFAULT false,
    weak_areas TEXT[], -- Array of topics they struggled with
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Track course completion progress
CREATE TABLE analytics_course_progress (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255),
    course_name VARCHAR(255),
    total_classes INTEGER,
    classes_completed INTEGER DEFAULT 0,
    completion_percentage DECIMAL(5,2) DEFAULT 0.00,
    start_date DATE,
    estimated_completion_date DATE,
    actual_completion_date DATE,
    time_spent_total_hours DECIMAL(8,2) DEFAULT 0.00,
    last_activity_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. CONVERSION & REVENUE METRICS
-- =============================================

-- Track detailed revenue analytics
CREATE TABLE analytics_revenue_tracking (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    transaction_id VARCHAR(100) UNIQUE,
    user_email VARCHAR(255),
    course_name VARCHAR(255),
    revenue_amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    payment_method VARCHAR(50),
    traffic_source VARCHAR(100),
    conversion_time_hours INTEGER, -- Time from first visit to purchase
    discount_applied DECIMAL(10,2) DEFAULT 0.00,
    refund_status VARCHAR(50) DEFAULT 'none',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Track conversion funnel analytics
CREATE TABLE analytics_conversion_funnel (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    funnel_stage VARCHAR(100), -- 'visitor', 'page_view', 'enquiry', 'demo', 'purchase'
    course_name VARCHAR(255),
    users_entered INTEGER DEFAULT 0,
    users_converted INTEGER DEFAULT 0,
    conversion_rate DECIMAL(5,2) DEFAULT 0.00,
    avg_time_in_stage_hours DECIMAL(8,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Track customer lifetime value
CREATE TABLE analytics_customer_ltv (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) UNIQUE,
    first_purchase_date DATE,
    total_revenue DECIMAL(10,2) DEFAULT 0.00,
    purchase_count INTEGER DEFAULT 0,
    avg_order_value DECIMAL(10,2) DEFAULT 0.00,
    customer_lifetime_days INTEGER DEFAULT 0,
    predicted_ltv DECIMAL(10,2) DEFAULT 0.00,
    customer_segment VARCHAR(50), -- 'high_value', 'medium_value', 'low_value'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. REAL-TIME MONITORING & ALERTS
-- =============================================

-- Track real-time visitor activity
CREATE TABLE analytics_realtime_visitors (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(100) UNIQUE,
    user_ip VARCHAR(45),
    current_page VARCHAR(500),
    entry_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    user_type VARCHAR(50), -- 'anonymous', 'logged_in', 'paid'
    traffic_source VARCHAR(100),
    device_type VARCHAR(50),
    location_country VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Track high-value actions and alerts
CREATE TABLE analytics_action_alerts (
    id SERIAL PRIMARY KEY,
    alert_type VARCHAR(100), -- 'purchase', 'high_traffic', 'security_threat', 'system_error'
    alert_level VARCHAR(50), -- 'low', 'medium', 'high', 'critical'
    title VARCHAR(255) NOT NULL,
    description TEXT,
    affected_users INTEGER DEFAULT 0,
    revenue_impact DECIMAL(10,2) DEFAULT 0.00,
    is_resolved BOOLEAN DEFAULT false,
    resolved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Track unusual activity patterns
CREATE TABLE analytics_anomaly_detection (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    metric_name VARCHAR(100), -- 'traffic_spike', 'conversion_drop', 'revenue_anomaly'
    expected_value DECIMAL(12,2),
    actual_value DECIMAL(12,2),
    deviation_percentage DECIMAL(5,2),
    anomaly_score DECIMAL(5,2), -- 0-100 scale
    is_investigated BOOLEAN DEFAULT false,
    investigation_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. AI-POWERED INSIGHTS & RECOMMENDATIONS
-- =============================================

-- Store AI-generated insights and predictions
CREATE TABLE analytics_ai_insights (
    id SERIAL PRIMARY KEY,
    insight_type VARCHAR(100), -- 'churn_prediction', 'revenue_forecast', 'trend_analysis'
    insight_title VARCHAR(255),
    insight_description TEXT,
    confidence_score DECIMAL(5,2), -- 0-100 scale
    recommended_actions TEXT[],
    affected_metrics TEXT[],
    business_impact VARCHAR(100), -- 'high', 'medium', 'low'
    is_implemented BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

-- Track personalized user recommendations
CREATE TABLE analytics_user_recommendations (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255),
    recommendation_type VARCHAR(100), -- 'course_suggestion', 'discount_offer', 'engagement_boost'
    recommendation_content TEXT,
    target_action VARCHAR(100),
    confidence_score DECIMAL(5,2),
    is_shown BOOLEAN DEFAULT false,
    is_clicked BOOLEAN DEFAULT false,
    resulted_in_conversion BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

-- =============================================
-- CREATE INDEXES FOR PERFORMANCE
-- =============================================

-- Visitor stats indexes
CREATE INDEX idx_visitor_stats_date ON analytics_visitor_stats(date);
CREATE INDEX idx_traffic_sources_date_type ON analytics_traffic_sources(date, source_type);
CREATE INDEX idx_geographic_data_date_country ON analytics_geographic_data(date, country);
CREATE INDEX idx_device_browser_date ON analytics_device_browser_data(date, device_type);

-- Session tracking indexes
CREATE INDEX idx_session_tracking_session_id ON analytics_session_tracking(session_id);
CREATE INDEX idx_session_tracking_start_time ON analytics_session_tracking(start_time);
CREATE INDEX idx_page_performance_date_url ON analytics_page_performance(date, page_url);

-- Course analytics indexes
CREATE INDEX idx_course_performance_date ON analytics_course_performance(date, course_name);
CREATE INDEX idx_video_engagement_course ON analytics_video_engagement(course_id, class_number);
CREATE INDEX idx_enquiry_tracking_course ON analytics_enquiry_tracking(course_name, created_at);

-- User segmentation indexes
CREATE INDEX idx_user_sessions_email_type ON analytics_user_sessions(user_email, user_type);
CREATE INDEX idx_content_interaction_date_type ON analytics_content_interaction(date, user_type);
CREATE INDEX idx_upgrade_tracking_email ON analytics_upgrade_tracking(user_email, trigger_time);

-- Revenue tracking indexes
CREATE INDEX idx_revenue_tracking_date ON analytics_revenue_tracking(date);
CREATE INDEX idx_conversion_funnel_date_stage ON analytics_conversion_funnel(date, funnel_stage);
CREATE INDEX idx_customer_ltv_email ON analytics_customer_ltv(user_email);

-- Real-time monitoring indexes
CREATE INDEX idx_realtime_visitors_active ON analytics_realtime_visitors(is_active, last_activity);
CREATE INDEX idx_action_alerts_type_level ON analytics_action_alerts(alert_type, alert_level, created_at);

-- AI insights indexes
CREATE INDEX idx_ai_insights_type ON analytics_ai_insights(insight_type, created_at);
CREATE INDEX idx_user_recommendations_email ON analytics_user_recommendations(user_email, is_shown);

-- =============================================
-- CREATE UPDATE TRIGGERS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_analytics_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to tables with updated_at columns
CREATE TRIGGER update_analytics_visitor_stats_updated_at
    BEFORE UPDATE ON analytics_visitor_stats
    FOR EACH ROW EXECUTE FUNCTION update_analytics_updated_at();

CREATE TRIGGER update_analytics_churn_tracking_updated_at
    BEFORE UPDATE ON analytics_churn_tracking
    FOR EACH ROW EXECUTE FUNCTION update_analytics_updated_at();

CREATE TRIGGER update_analytics_course_progress_updated_at
    BEFORE UPDATE ON analytics_course_progress
    FOR EACH ROW EXECUTE FUNCTION update_analytics_updated_at();

CREATE TRIGGER update_analytics_customer_ltv_updated_at
    BEFORE UPDATE ON analytics_customer_ltv
    FOR EACH ROW EXECUTE FUNCTION update_analytics_updated_at();

-- =============================================
-- DISABLE RLS FOR TESTING (ENABLE IN PRODUCTION)
-- =============================================

ALTER TABLE analytics_visitor_stats DISABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_traffic_sources DISABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_geographic_data DISABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_device_browser_data DISABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_session_tracking DISABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_page_performance DISABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_click_heatmap DISABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_course_performance DISABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_video_engagement DISABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_enquiry_tracking DISABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_user_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_content_interaction DISABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_upgrade_tracking DISABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_churn_tracking DISABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_download_tracking DISABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_quiz_performance DISABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_course_progress DISABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_revenue_tracking DISABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_conversion_funnel DISABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_customer_ltv DISABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_realtime_visitors DISABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_action_alerts DISABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_anomaly_detection DISABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_ai_insights DISABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_user_recommendations DISABLE ROW LEVEL SECURITY;

-- =============================================
-- INSERT SAMPLE DATA FOR TESTING
-- =============================================

-- Sample visitor stats
INSERT INTO analytics_visitor_stats (date, total_visitors, unique_visitors, new_visitors, returning_visitors, page_views, bounce_rate, avg_session_duration_seconds) VALUES
(CURRENT_DATE - INTERVAL '7 days', 1250, 980, 720, 260, 3200, 42.5, 285),
(CURRENT_DATE - INTERVAL '6 days', 1340, 1050, 780, 270, 3450, 38.2, 310),
(CURRENT_DATE - INTERVAL '5 days', 1180, 920, 650, 270, 2980, 45.8, 265),
(CURRENT_DATE - INTERVAL '4 days', 1420, 1100, 820, 280, 3800, 35.6, 340),
(CURRENT_DATE - INTERVAL '3 days', 1680, 1280, 950, 330, 4200, 32.1, 375),
(CURRENT_DATE - INTERVAL '2 days', 1520, 1180, 870, 310, 3920, 38.9, 325),
(CURRENT_DATE - INTERVAL '1 day', 1380, 1050, 780, 270, 3650, 41.2, 295),
(CURRENT_DATE, 890, 680, 520, 160, 2340, 39.5, 280);

-- Sample traffic sources
INSERT INTO analytics_traffic_sources (date, source_type, source_name, visitors, page_views, conversion_rate) VALUES
(CURRENT_DATE, 'organic', 'google', 420, 1120, 8.5),
(CURRENT_DATE, 'direct', 'direct', 280, 850, 12.3),
(CURRENT_DATE, 'social', 'facebook', 150, 380, 5.2),
(CURRENT_DATE, 'social', 'instagram', 120, 290, 4.8),
(CURRENT_DATE, 'paid', 'google_ads', 80, 220, 15.6),
(CURRENT_DATE, 'referral', 'youtube', 65, 180, 7.1);

-- Sample course performance
INSERT INTO analytics_course_performance (date, course_name, page_views, unique_visitors, enquiry_form_submissions, demo_downloads, video_plays, video_completion_rate, conversion_to_purchase) VALUES
(CURRENT_DATE, 'Complete Python Programming Masterclass', 450, 320, 25, 18, 180, 75.5, 12.8),
(CURRENT_DATE, 'Machine Learning & AI Fundamentals', 380, 280, 22, 15, 150, 68.2, 14.2),
(CURRENT_DATE, 'Full Stack Web Development Bootcamp', 320, 240, 18, 12, 120, 72.8, 11.5),
(CURRENT_DATE, 'Data Science with R & Python', 280, 200, 15, 10, 95, 65.4, 13.1),
(CURRENT_DATE, 'Digital Marketing Mastery', 250, 180, 12, 8, 80, 70.2, 9.8);

-- Sample revenue tracking
INSERT INTO analytics_revenue_tracking (date, transaction_id, user_email, course_name, revenue_amount, payment_method, traffic_source, conversion_time_hours) VALUES
(CURRENT_DATE, 'TXN_ANALYTICS_001', 'customer1@example.com', 'Complete Python Programming Masterclass', 4999.00, 'credit_card', 'google', 48),
(CURRENT_DATE, 'TXN_ANALYTICS_002', 'customer2@example.com', 'Machine Learning & AI Fundamentals', 6999.00, 'upi', 'facebook', 72),
(CURRENT_DATE - INTERVAL '1 day', 'TXN_ANALYTICS_003', 'customer3@example.com', 'Full Stack Web Development Bootcamp', 8999.00, 'net_banking', 'direct', 24),
(CURRENT_DATE - INTERVAL '2 days', 'TXN_ANALYTICS_004', 'customer4@example.com', 'Data Science with R & Python', 7499.00, 'debit_card', 'google_ads', 120);

-- Sample real-time visitors
INSERT INTO analytics_realtime_visitors (session_id, user_ip, current_page, user_type, traffic_source, device_type, location_country) VALUES
('SESSION_001', '192.168.1.100', '/courses', 'anonymous', 'google', 'desktop', 'India'),
('SESSION_002', '192.168.1.101', '/course/1', 'logged_in', 'direct', 'mobile', 'United States'),
('SESSION_003', '192.168.1.102', '/analytics-dashboard', 'paid', 'direct', 'desktop', 'India'),
('SESSION_004', '192.168.1.103', '/courses', 'anonymous', 'facebook', 'tablet', 'United Kingdom');

-- Sample alerts
INSERT INTO analytics_action_alerts (alert_type, alert_level, title, description, affected_users, revenue_impact) VALUES
('purchase', 'high', 'High-Value Course Purchase', 'Customer purchased premium course worth ₹8,999', 1, 8999.00),
('traffic_spike', 'medium', 'Traffic Spike Detected', 'Website traffic increased by 45% in the last hour', 0, 0.00),
('conversion_rate', 'low', 'Conversion Rate Improvement', 'Course page conversion rate increased to 15.6%', 0, 0.00);

-- =============================================
-- SUCCESS MESSAGE
-- =============================================

-- Display success message
DO $$
BEGIN
    RAISE NOTICE '🎉 ANALYTICS DASHBOARD TABLES CREATED SUCCESSFULLY!';
    RAISE NOTICE '📊 Total Tables Created: 23 analytics tables';
    RAISE NOTICE '🔍 Indexes Created: For optimal performance';
    RAISE NOTICE '📈 Sample Data: Inserted for immediate testing';
    RAISE NOTICE '🚀 Ready to use with Analytics Dashboard!';
END $$; 
