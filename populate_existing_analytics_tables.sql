-- =============================================
-- POPULATE EXISTING ANALYTICS TABLES
-- This script only inserts data (doesn't create tables)
-- =============================================

-- Clear existing data first
TRUNCATE TABLE analytics_visitor_stats CASCADE;
TRUNCATE TABLE analytics_traffic_sources CASCADE;
TRUNCATE TABLE analytics_geographic_data CASCADE;
TRUNCATE TABLE analytics_device_browser_data CASCADE;
TRUNCATE TABLE analytics_session_tracking CASCADE;
TRUNCATE TABLE analytics_page_performance CASCADE;
TRUNCATE TABLE analytics_click_heatmap CASCADE;
TRUNCATE TABLE analytics_course_performance CASCADE;
TRUNCATE TABLE analytics_video_engagement CASCADE;
TRUNCATE TABLE analytics_enquiry_tracking CASCADE;
TRUNCATE TABLE analytics_user_sessions CASCADE;
TRUNCATE TABLE analytics_content_interaction CASCADE;
TRUNCATE TABLE analytics_upgrade_tracking CASCADE;
TRUNCATE TABLE analytics_churn_tracking CASCADE;
TRUNCATE TABLE analytics_download_tracking CASCADE;
TRUNCATE TABLE analytics_quiz_performance CASCADE;
TRUNCATE TABLE analytics_course_progress CASCADE;
TRUNCATE TABLE analytics_revenue_tracking CASCADE;
TRUNCATE TABLE analytics_conversion_funnel CASCADE;
TRUNCATE TABLE analytics_customer_ltv CASCADE;
TRUNCATE TABLE analytics_realtime_visitors CASCADE;
TRUNCATE TABLE analytics_action_alerts CASCADE;
TRUNCATE TABLE analytics_anomaly_detection CASCADE;
TRUNCATE TABLE analytics_ai_insights CASCADE;
TRUNCATE TABLE analytics_user_recommendations CASCADE;

-- Insert visitor stats for the last 30 days
INSERT INTO analytics_visitor_stats (date, total_visitors, unique_visitors, new_visitors, returning_visitors, page_views, bounce_rate, avg_session_duration_seconds) VALUES
(CURRENT_DATE - INTERVAL '29 days', 1250, 980, 720, 260, 3200, 42.5, 285),
(CURRENT_DATE - INTERVAL '28 days', 1340, 1050, 780, 270, 3450, 38.2, 310),
(CURRENT_DATE - INTERVAL '27 days', 1180, 920, 650, 270, 2980, 45.8, 265),
(CURRENT_DATE - INTERVAL '26 days', 1420, 1100, 820, 280, 3800, 35.6, 340),
(CURRENT_DATE - INTERVAL '25 days', 1680, 1280, 950, 330, 4200, 32.1, 375),
(CURRENT_DATE - INTERVAL '24 days', 1520, 1180, 870, 310, 3920, 38.9, 325),
(CURRENT_DATE - INTERVAL '23 days', 1380, 1050, 780, 270, 3650, 41.2, 295),
(CURRENT_DATE - INTERVAL '22 days', 1460, 1120, 830, 290, 3850, 37.4, 315),
(CURRENT_DATE - INTERVAL '21 days', 1590, 1220, 900, 320, 4150, 34.7, 355),
(CURRENT_DATE - INTERVAL '20 days', 1330, 1030, 750, 280, 3450, 40.1, 290),
(CURRENT_DATE - INTERVAL '19 days', 1720, 1350, 1000, 350, 4400, 31.8, 380),
(CURRENT_DATE - INTERVAL '18 days', 1480, 1150, 850, 300, 3780, 36.9, 320),
(CURRENT_DATE - INTERVAL '17 days', 1650, 1290, 950, 340, 4250, 33.2, 365),
(CURRENT_DATE - INTERVAL '16 days', 1390, 1080, 790, 290, 3620, 39.5, 305),
(CURRENT_DATE - INTERVAL '15 days', 1560, 1200, 880, 320, 4050, 35.1, 345),
(CURRENT_DATE - INTERVAL '14 days', 1450, 1130, 820, 310, 3780, 37.8, 325),
(CURRENT_DATE - INTERVAL '13 days', 1680, 1320, 970, 350, 4350, 32.4, 375),
(CURRENT_DATE - INTERVAL '12 days', 1530, 1180, 860, 320, 3950, 36.7, 335),
(CURRENT_DATE - INTERVAL '11 days', 1720, 1340, 990, 350, 4450, 31.9, 385),
(CURRENT_DATE - INTERVAL '10 days', 1470, 1140, 830, 310, 3820, 38.1, 315),
(CURRENT_DATE - INTERVAL '9 days', 1580, 1220, 900, 320, 4100, 34.6, 350),
(CURRENT_DATE - INTERVAL '8 days', 1420, 1100, 800, 300, 3700, 37.2, 310),
(CURRENT_DATE - INTERVAL '7 days', 1650, 1280, 940, 340, 4250, 33.5, 370),
(CURRENT_DATE - INTERVAL '6 days', 1540, 1190, 870, 320, 4000, 36.0, 340),
(CURRENT_DATE - INTERVAL '5 days', 1690, 1320, 970, 350, 4380, 32.8, 380),
(CURRENT_DATE - INTERVAL '4 days', 1480, 1150, 840, 310, 3850, 37.5, 325),
(CURRENT_DATE - INTERVAL '3 days', 1620, 1250, 920, 330, 4200, 34.2, 360),
(CURRENT_DATE - INTERVAL '2 days', 1570, 1210, 890, 320, 4080, 35.7, 350),
(CURRENT_DATE - INTERVAL '1 day', 1640, 1270, 930, 340, 4250, 33.9, 365),
(CURRENT_DATE, 1450, 1120, 820, 300, 3750, 37.8, 330);

-- Insert traffic sources data
INSERT INTO analytics_traffic_sources (date, source_type, source_name, visitors, page_views, conversion_rate) VALUES
(CURRENT_DATE, 'organic', 'google', 420, 1120, 8.5),
(CURRENT_DATE, 'direct', 'direct', 280, 850, 12.3),
(CURRENT_DATE, 'social', 'facebook', 150, 380, 5.2),
(CURRENT_DATE, 'social', 'instagram', 120, 290, 4.8),
(CURRENT_DATE, 'social', 'twitter', 85, 210, 3.9),
(CURRENT_DATE, 'paid', 'google_ads', 80, 220, 15.6),
(CURRENT_DATE, 'paid', 'facebook_ads', 65, 180, 12.8),
(CURRENT_DATE, 'referral', 'youtube', 65, 180, 7.1),
(CURRENT_DATE, 'referral', 'linkedin', 45, 120, 6.2),
(CURRENT_DATE, 'referral', 'other', 35, 95, 4.5),
(CURRENT_DATE - INTERVAL '1 day', 'organic', 'google', 450, 1200, 9.1),
(CURRENT_DATE - INTERVAL '1 day', 'direct', 'direct', 320, 950, 13.1),
(CURRENT_DATE - INTERVAL '1 day', 'social', 'facebook', 165, 420, 5.8),
(CURRENT_DATE - INTERVAL '1 day', 'social', 'instagram', 135, 320, 5.2),
(CURRENT_DATE - INTERVAL '1 day', 'paid', 'google_ads', 90, 250, 16.2),
(CURRENT_DATE - INTERVAL '1 day', 'referral', 'youtube', 75, 200, 7.8);

-- Insert geographic data
INSERT INTO analytics_geographic_data (date, country, country_code, city, visitors, page_views, avg_session_duration_seconds) VALUES
(CURRENT_DATE, 'India', 'IN', 'Mumbai', 450, 1200, 320),
(CURRENT_DATE, 'India', 'IN', 'Delhi', 380, 980, 295),
(CURRENT_DATE, 'India', 'IN', 'Bangalore', 320, 850, 340),
(CURRENT_DATE, 'United States', 'US', 'New York', 280, 720, 385),
(CURRENT_DATE, 'United States', 'US', 'San Francisco', 220, 580, 405),
(CURRENT_DATE, 'United Kingdom', 'GB', 'London', 180, 460, 365),
(CURRENT_DATE, 'Canada', 'CA', 'Toronto', 150, 390, 350),
(CURRENT_DATE, 'Australia', 'AU', 'Sydney', 120, 310, 375),
(CURRENT_DATE, 'Germany', 'DE', 'Berlin', 95, 245, 340),
(CURRENT_DATE, 'France', 'FR', 'Paris', 85, 220, 355);

-- Insert device and browser data
INSERT INTO analytics_device_browser_data (date, device_type, device_name, browser_name, browser_version, operating_system, visitors, page_views) VALUES
(CURRENT_DATE, 'desktop', 'Windows PC', 'chrome', '118.0', 'Windows 11', 580, 1450),
(CURRENT_DATE, 'desktop', 'Mac', 'safari', '17.0', 'macOS', 320, 820),
(CURRENT_DATE, 'desktop', 'Windows PC', 'firefox', '119.0', 'Windows 10', 180, 460),
(CURRENT_DATE, 'mobile', 'iPhone 14', 'safari', '17.0', 'iOS 17', 280, 680),
(CURRENT_DATE, 'mobile', 'Samsung Galaxy', 'chrome', '118.0', 'Android 13', 250, 620),
(CURRENT_DATE, 'mobile', 'OnePlus', 'chrome', '118.0', 'Android 12', 120, 290),
(CURRENT_DATE, 'tablet', 'iPad Pro', 'safari', '17.0', 'iPadOS 17', 85, 215),
(CURRENT_DATE, 'tablet', 'Samsung Tab', 'chrome', '118.0', 'Android 12', 65, 165);

-- Insert course performance data
INSERT INTO analytics_course_performance (date, course_name, page_views, unique_visitors, enquiry_form_submissions, demo_downloads, video_plays, video_completion_rate, conversion_to_purchase) VALUES
(CURRENT_DATE, 'Complete Python Programming Masterclass', 450, 320, 25, 18, 180, 75.5, 12.8),
(CURRENT_DATE, 'Machine Learning & AI Fundamentals', 380, 280, 22, 15, 150, 68.2, 14.2),
(CURRENT_DATE, 'Full Stack Web Development Bootcamp', 320, 240, 18, 12, 120, 72.8, 11.5),
(CURRENT_DATE, 'Data Science with R & Python', 280, 200, 15, 10, 95, 65.4, 13.1),
(CURRENT_DATE, 'Digital Marketing Mastery', 250, 180, 12, 8, 80, 70.2, 9.8);

-- Insert revenue tracking data
INSERT INTO analytics_revenue_tracking (date, transaction_id, user_email, course_name, revenue_amount, currency, payment_method, traffic_source, conversion_time_hours, discount_applied) VALUES
(CURRENT_DATE, 'TXN_SAMPLE_001', 'customer1@example.com', 'Complete Python Programming Masterclass', 4999.00, 'INR', 'credit_card', 'google', 48, 0.00),
(CURRENT_DATE, 'TXN_SAMPLE_002', 'customer2@example.com', 'Machine Learning & AI Fundamentals', 6999.00, 'INR', 'upi', 'facebook', 72, 1000.00),
(CURRENT_DATE - INTERVAL '1 day', 'TXN_SAMPLE_003', 'customer3@example.com', 'Full Stack Web Development Bootcamp', 8999.00, 'INR', 'net_banking', 'direct', 24, 0.00),
(CURRENT_DATE - INTERVAL '2 days', 'TXN_SAMPLE_004', 'customer4@example.com', 'Data Science with R & Python', 7499.00, 'INR', 'debit_card', 'google_ads', 120, 500.00);

-- Insert real-time visitors
INSERT INTO analytics_realtime_visitors (session_id, user_ip, current_page, entry_time, last_activity, is_active, user_type, traffic_source, device_type, location_country) VALUES
('LIVE_SESSION_001', '192.168.1.100', '/courses', CURRENT_TIMESTAMP - INTERVAL '5 minutes', CURRENT_TIMESTAMP - INTERVAL '1 minute', true, 'anonymous', 'google', 'desktop', 'India'),
('LIVE_SESSION_002', '192.168.1.101', '/course/1', CURRENT_TIMESTAMP - INTERVAL '10 minutes', CURRENT_TIMESTAMP - INTERVAL '2 minutes', true, 'logged_in', 'direct', 'mobile', 'United States'),
('LIVE_SESSION_003', '192.168.1.102', '/analytics-dashboard', CURRENT_TIMESTAMP - INTERVAL '15 minutes', CURRENT_TIMESTAMP - INTERVAL '30 seconds', true, 'paid', 'direct', 'desktop', 'India'),
('LIVE_SESSION_004', '192.168.1.103', '/course/2', CURRENT_TIMESTAMP - INTERVAL '8 minutes', CURRENT_TIMESTAMP - INTERVAL '3 minutes', true, 'anonymous', 'facebook', 'tablet', 'United Kingdom'),
('LIVE_SESSION_005', '192.168.1.104', '/members-login', CURRENT_TIMESTAMP - INTERVAL '3 minutes', CURRENT_TIMESTAMP - INTERVAL '1 minute', true, 'anonymous', 'instagram', 'mobile', 'Canada');

-- Insert action alerts
INSERT INTO analytics_action_alerts (alert_type, alert_level, title, description, affected_users, revenue_impact, is_resolved) VALUES
('purchase', 'high', 'High-Value Course Purchase', 'Customer purchased Full Stack Web Development Bootcamp worth ₹8,999', 1, 8999.00, false),
('traffic_spike', 'medium', 'Traffic Spike Detected', 'Website traffic increased by 45% in the last hour', 0, 0.00, false),
('conversion_rate', 'low', 'Conversion Rate Improvement', 'Python course page conversion rate increased to 15.6%', 0, 0.00, false),
('churn_risk', 'medium', 'High Churn Risk User', 'Premium user inactive for 14+ days - intervention recommended', 1, 0.00, false),
('system_performance', 'low', 'Page Load Time Optimized', 'Course pages now loading 23% faster after optimization', 0, 0.00, true);

-- Insert user sessions data
INSERT INTO analytics_user_sessions (user_email, user_type, login_time, logout_time, session_duration_seconds, pages_visited, features_used, downloads_count, videos_watched, quizzes_attempted) VALUES
('student1@example.com', 'paid', CURRENT_TIMESTAMP - INTERVAL '2 hours', CURRENT_TIMESTAMP - INTERVAL '1 hour', 3600, 8, ARRAY['video_player', 'quiz_system', 'download_center'], 3, 5, 2),
('student2@example.com', 'free', CURRENT_TIMESTAMP - INTERVAL '3 hours', CURRENT_TIMESTAMP - INTERVAL '2 hours', 3600, 4, ARRAY['video_player'], 0, 2, 0),
('student3@example.com', 'paid', CURRENT_TIMESTAMP - INTERVAL '1 hour', CURRENT_TIMESTAMP - INTERVAL '30 minutes', 1800, 6, ARRAY['video_player', 'quiz_system'], 2, 3, 1);

-- Insert quiz performance data
INSERT INTO analytics_quiz_performance (user_email, course_name, class_number, quiz_title, attempt_number, questions_total, questions_correct, score_percentage, time_taken_seconds, pass_status, weak_areas) VALUES
('student1@example.com', 'Complete Python Programming Masterclass', 1, 'Python Basics Quiz', 1, 10, 8, 80.0, 480, true, ARRAY['loops', 'functions']),
('student2@example.com', 'Machine Learning & AI Fundamentals', 1, 'ML Basics Quiz', 1, 15, 12, 80.0, 720, true, ARRAY['algorithms']),
('student3@example.com', 'Full Stack Web Development Bootcamp', 1, 'HTML/CSS Quiz', 1, 12, 10, 83.3, 540, true, ARRAY['css_grid']);

-- Insert conversion funnel data
INSERT INTO analytics_conversion_funnel (date, funnel_stage, course_name, users_entered, users_converted, conversion_rate, avg_time_in_stage_hours) VALUES
(CURRENT_DATE, 'visitor', 'Complete Python Programming Masterclass', 1000, 450, 45.0, 0.5),
(CURRENT_DATE, 'page_view', 'Complete Python Programming Masterclass', 450, 125, 27.8, 2.0),
(CURRENT_DATE, 'enquiry', 'Complete Python Programming Masterclass', 125, 35, 28.0, 24.0),
(CURRENT_DATE, 'purchase', 'Complete Python Programming Masterclass', 35, 5, 14.3, 72.0);

-- Insert customer LTV data
INSERT INTO analytics_customer_ltv (user_email, first_purchase_date, total_revenue, purchase_count, avg_order_value, customer_lifetime_days, predicted_ltv, customer_segment) VALUES
('customer1@example.com', CURRENT_DATE - INTERVAL '30 days', 4999.00, 1, 4999.00, 30, 15000.00, 'high_value'),
('customer2@example.com', CURRENT_DATE - INTERVAL '45 days', 13998.00, 2, 6999.00, 45, 25000.00, 'high_value'),
('customer3@example.com', CURRENT_DATE - INTERVAL '15 days', 8999.00, 1, 8999.00, 15, 18000.00, 'high_value');

-- Success message
DO $$
BEGIN
    RAISE NOTICE '🎉 ANALYTICS SAMPLE DATA POPULATED SUCCESSFULLY!';
    RAISE NOTICE '✅ All existing analytics tables now have sample data';
    RAISE NOTICE '📊 Navigate to /analytics-dashboard to see the data';
    RAISE NOTICE '🔧 You can also test at /database-test first';
END $$; 
