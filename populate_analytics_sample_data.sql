-- =============================================
-- POPULATE ANALYTICS TABLES WITH SAMPLE DATA
-- Run this after creating the analytics tables
-- This will populate all tables with realistic sample data for testing
-- =============================================

-- Clear existing data first (optional)
-- TRUNCATE TABLE analytics_visitor_stats CASCADE;
-- TRUNCATE TABLE analytics_traffic_sources CASCADE;
-- ... (repeat for all tables if you want to reset)

-- =============================================
-- 1. VISITOR & TRAFFIC SAMPLE DATA
-- =============================================

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

-- Insert traffic sources data for the last 7 days
INSERT INTO analytics_traffic_sources (date, source_type, source_name, visitors, page_views, conversion_rate) VALUES
-- Today's data
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

-- Yesterday's data
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

-- =============================================
-- 2. USER BEHAVIOR & ENGAGEMENT SAMPLE DATA
-- =============================================

-- Insert session tracking data
INSERT INTO analytics_session_tracking (session_id, user_ip, user_agent, start_time, end_time, duration_seconds, pages_visited, pages_visited_list, clicks_total, scroll_depth_max, is_bounce, exit_page, conversion_action) VALUES
('SESSION_001', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', CURRENT_TIMESTAMP - INTERVAL '2 hours', CURRENT_TIMESTAMP - INTERVAL '1 hour 45 minutes', 900, 5, ARRAY['/courses', '/course/1', '/course/2', '/about', '/contact'], 12, 85, false, '/contact', 'enquiry'),
('SESSION_002', '192.168.1.101', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', CURRENT_TIMESTAMP - INTERVAL '3 hours', CURRENT_TIMESTAMP - INTERVAL '2 hours 50 minutes', 600, 3, ARRAY['/courses', '/course/1', '/members-login'], 8, 70, false, '/members-login', 'login'),
('SESSION_003', '192.168.1.102', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15', CURRENT_TIMESTAMP - INTERVAL '1 hour', CURRENT_TIMESTAMP - INTERVAL '45 minutes', 900, 4, ARRAY['/courses', '/course/3', '/course/4', '/checkout'], 15, 95, false, '/checkout', 'purchase'),
('SESSION_004', '192.168.1.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', CURRENT_TIMESTAMP - INTERVAL '30 minutes', CURRENT_TIMESTAMP - INTERVAL '29 minutes', 60, 1, ARRAY['/courses'], 2, 25, true, '/courses', null);

-- Insert page performance data
INSERT INTO analytics_page_performance (date, page_url, page_title, page_views, unique_visitors, avg_time_on_page_seconds, bounce_rate, exit_rate, click_through_rate) VALUES
(CURRENT_DATE, '/courses', 'All Courses', 850, 650, 180, 35.2, 25.8, 12.5),
(CURRENT_DATE, '/course/1', 'Python Programming', 420, 320, 240, 28.1, 18.5, 15.8),
(CURRENT_DATE, '/course/2', 'Machine Learning', 380, 290, 260, 25.9, 16.2, 18.2),
(CURRENT_DATE, '/course/3', 'Web Development', 320, 250, 220, 30.5, 20.1, 14.7),
(CURRENT_DATE, '/about', 'About Us', 180, 140, 120, 45.2, 35.8, 8.5),
(CURRENT_DATE, '/contact', 'Contact', 150, 120, 90, 52.1, 42.3, 22.5);

-- Insert click heatmap data
INSERT INTO analytics_click_heatmap (date, page_url, element_selector, element_text, click_count, position_x, position_y) VALUES
(CURRENT_DATE, '/courses', '.course-card', 'View Course Details', 250, 600, 400),
(CURRENT_DATE, '/courses', '.enroll-btn', 'Enroll Now', 180, 650, 500),
(CURRENT_DATE, '/courses', '.demo-btn', 'Download Demo', 120, 550, 500),
(CURRENT_DATE, '/course/1', '.video-play-btn', 'Play Video', 320, 400, 300),
(CURRENT_DATE, '/course/1', '.enquiry-form-btn', 'Submit Enquiry', 85, 700, 600);

-- =============================================
-- 3. COURSE-SPECIFIC TRACKING SAMPLE DATA
-- =============================================

-- Insert course performance data
INSERT INTO analytics_course_performance (date, course_name, page_views, unique_visitors, enquiry_form_submissions, demo_downloads, video_plays, video_completion_rate, conversion_to_purchase) VALUES
(CURRENT_DATE, 'Complete Python Programming Masterclass', 450, 320, 25, 18, 180, 75.5, 12.8),
(CURRENT_DATE, 'Machine Learning & AI Fundamentals', 380, 280, 22, 15, 150, 68.2, 14.2),
(CURRENT_DATE, 'Full Stack Web Development Bootcamp', 320, 240, 18, 12, 120, 72.8, 11.5),
(CURRENT_DATE, 'Data Science with R & Python', 280, 200, 15, 10, 95, 65.4, 13.1),
(CURRENT_DATE, 'Digital Marketing Mastery', 250, 180, 12, 8, 80, 70.2, 9.8),
(CURRENT_DATE, 'Cybersecurity Ethical Hacking', 220, 160, 18, 14, 110, 78.3, 16.5),
(CURRENT_DATE, 'Cloud Computing with AWS', 200, 150, 14, 11, 85, 72.1, 15.2);

-- Insert video engagement data
INSERT INTO analytics_video_engagement (session_id, course_id, class_number, video_url, play_count, watch_time_seconds, completion_percentage, drop_off_points, replay_count, playback_speed) VALUES
('SESSION_001', 1, 1, 'https://www.youtube.com/watch?v=_zgZ0g8EbF4', 1, 1800, 85.5, ARRAY['00:05:30', '00:12:45'], 0, 1.0),
('SESSION_002', 1, 2, 'https://www.youtube.com/watch?v=_zgZ0g8EbF4', 1, 2100, 92.3, ARRAY['00:08:15'], 1, 1.25),
('SESSION_003', 2, 1, 'https://www.youtube.com/watch?v=_zgZ0g8EbF4', 1, 1650, 78.2, ARRAY['00:07:20', '00:15:30'], 0, 1.0),
('SESSION_004', 3, 1, 'https://www.youtube.com/watch?v=_zgZ0g8EbF4', 1, 1950, 88.7, ARRAY['00:04:45'], 2, 1.5);

-- Insert enquiry tracking data
INSERT INTO analytics_enquiry_tracking (enquiry_id, course_name, visitor_ip, source_page, traffic_source, form_completion_time_seconds, converted_to_purchase, conversion_date, revenue_generated) VALUES
('ENQ_001', 'Complete Python Programming Masterclass', '192.168.1.100', '/course/1', 'google', 120, true, CURRENT_TIMESTAMP - INTERVAL '2 days', 4999.00),
('ENQ_002', 'Machine Learning & AI Fundamentals', '192.168.1.101', '/course/2', 'facebook', 95, true, CURRENT_TIMESTAMP - INTERVAL '1 day', 6999.00),
('ENQ_003', 'Full Stack Web Development Bootcamp', '192.168.1.102', '/course/3', 'direct', 150, false, null, 0.00),
('ENQ_004', 'Data Science with R & Python', '192.168.1.103', '/course/4', 'google_ads', 85, true, CURRENT_TIMESTAMP, 7499.00);

-- =============================================
-- 4. USER SEGMENTATION SAMPLE DATA
-- =============================================

-- Insert user session data
INSERT INTO analytics_user_sessions (user_email, user_type, login_time, logout_time, session_duration_seconds, pages_visited, features_used, downloads_count, videos_watched, quizzes_attempted) VALUES
('student1@example.com', 'paid', CURRENT_TIMESTAMP - INTERVAL '2 hours', CURRENT_TIMESTAMP - INTERVAL '1 hour', 3600, 8, ARRAY['video_player', 'quiz_system', 'download_center'], 3, 5, 2),
('student2@example.com', 'free', CURRENT_TIMESTAMP - INTERVAL '3 hours', CURRENT_TIMESTAMP - INTERVAL '2 hours', 3600, 4, ARRAY['video_player'], 0, 2, 0),
('student3@example.com', 'paid', CURRENT_TIMESTAMP - INTERVAL '1 hour', CURRENT_TIMESTAMP - INTERVAL '30 minutes', 1800, 6, ARRAY['video_player', 'quiz_system'], 2, 3, 1),
('student4@example.com', 'trial', CURRENT_TIMESTAMP - INTERVAL '4 hours', CURRENT_TIMESTAMP - INTERVAL '3 hours', 3600, 5, ARRAY['video_player'], 1, 3, 1);

-- Insert content interaction data
INSERT INTO analytics_content_interaction (date, user_type, content_type, content_id, interactions_count, avg_engagement_time_seconds, completion_rate) VALUES
(CURRENT_DATE, 'paid', 'video', 'course_1_class_1', 150, 1800, 85.5),
(CURRENT_DATE, 'free', 'video', 'course_1_class_1', 80, 900, 45.2),
(CURRENT_DATE, 'paid', 'quiz', 'course_1_quiz_1', 120, 600, 92.3),
(CURRENT_DATE, 'free', 'quiz', 'course_1_quiz_1', 20, 300, 65.8),
(CURRENT_DATE, 'paid', 'pdf', 'course_1_material', 200, 1200, 78.5),
(CURRENT_DATE, 'trial', 'video', 'course_2_class_1', 45, 1200, 68.2);

-- Insert upgrade tracking data
INSERT INTO analytics_upgrade_tracking (user_email, trigger_action, trigger_page, trigger_time, converted_to_paid, conversion_time, time_to_conversion_hours, revenue_generated) VALUES
('prospect1@example.com', 'video_limit_reached', '/course/1', CURRENT_TIMESTAMP - INTERVAL '5 days', true, CURRENT_TIMESTAMP - INTERVAL '3 days', 48, 4999.00),
('prospect2@example.com', 'premium_content_access', '/course/2', CURRENT_TIMESTAMP - INTERVAL '7 days', true, CURRENT_TIMESTAMP - INTERVAL '2 days', 120, 6999.00),
('prospect3@example.com', 'quiz_feature_request', '/course/3', CURRENT_TIMESTAMP - INTERVAL '3 days', false, null, null, 0.00),
('prospect4@example.com', 'download_limit_reached', '/course/4', CURRENT_TIMESTAMP - INTERVAL '6 days', true, CURRENT_TIMESTAMP - INTERVAL '1 day', 144, 7499.00);

-- Insert churn tracking data
INSERT INTO analytics_churn_tracking (user_email, subscription_start_date, last_active_date, days_since_last_activity, churn_risk_score, churn_probability, predicted_churn_date, churn_reason) VALUES
('churn_risk1@example.com', CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE - INTERVAL '7 days', 7, 65, 25.5, CURRENT_DATE + INTERVAL '23 days', null),
('churn_risk2@example.com', CURRENT_DATE - INTERVAL '45 days', CURRENT_DATE - INTERVAL '14 days', 14, 85, 45.2, CURRENT_DATE + INTERVAL '16 days', null),
('churned_user@example.com', CURRENT_DATE - INTERVAL '60 days', CURRENT_DATE - INTERVAL '35 days', 35, 95, 85.5, CURRENT_DATE - INTERVAL '5 days', 'lack_of_engagement');

-- =============================================
-- 5. STUDENT ACTIVITY & PROGRESS SAMPLE DATA
-- =============================================

-- Insert download tracking data
INSERT INTO analytics_download_tracking (user_email, user_type, content_type, content_name, course_name, download_time, file_size_mb, download_source) VALUES
('student1@example.com', 'paid', 'pdf', 'Python Basics Guide', 'Complete Python Programming Masterclass', CURRENT_TIMESTAMP - INTERVAL '2 hours', 5.2, 'course_page'),
('student2@example.com', 'paid', 'video', 'ML Introduction Video', 'Machine Learning & AI Fundamentals', CURRENT_TIMESTAMP - INTERVAL '1 hour', 125.8, 'course_page'),
('student3@example.com', 'trial', 'pdf', 'Web Dev Roadmap', 'Full Stack Web Development Bootcamp', CURRENT_TIMESTAMP - INTERVAL '3 hours', 3.7, 'email_link'),
('student4@example.com', 'paid', 'worksheet', 'Data Science Exercises', 'Data Science with R & Python', CURRENT_TIMESTAMP - INTERVAL '4 hours', 2.1, 'course_page');

-- Insert quiz performance data
INSERT INTO analytics_quiz_performance (user_email, course_name, class_number, quiz_title, attempt_number, questions_total, questions_correct, score_percentage, time_taken_seconds, pass_status, weak_areas) VALUES
('student1@example.com', 'Complete Python Programming Masterclass', 1, 'Python Basics Quiz', 1, 10, 8, 80.0, 480, true, ARRAY['loops', 'functions']),
('student2@example.com', 'Machine Learning & AI Fundamentals', 1, 'ML Basics Quiz', 1, 15, 12, 80.0, 720, true, ARRAY['algorithms']),
('student3@example.com', 'Full Stack Web Development Bootcamp', 1, 'HTML/CSS Quiz', 2, 12, 10, 83.3, 540, true, ARRAY['css_grid']),
('student4@example.com', 'Data Science with R & Python', 1, 'Statistics Quiz', 1, 20, 15, 75.0, 900, true, ARRAY['probability', 'distributions']);

-- Insert course progress data
INSERT INTO analytics_course_progress (user_email, course_name, total_classes, classes_completed, completion_percentage, start_date, estimated_completion_date, time_spent_total_hours, last_activity_date) VALUES
('student1@example.com', 'Complete Python Programming Masterclass', 12, 8, 66.7, CURRENT_DATE - INTERVAL '15 days', CURRENT_DATE + INTERVAL '10 days', 24.5, CURRENT_DATE),
('student2@example.com', 'Machine Learning & AI Fundamentals', 10, 6, 60.0, CURRENT_DATE - INTERVAL '20 days', CURRENT_DATE + INTERVAL '15 days', 18.2, CURRENT_DATE - INTERVAL '1 day'),
('student3@example.com', 'Full Stack Web Development Bootcamp', 15, 12, 80.0, CURRENT_DATE - INTERVAL '25 days', CURRENT_DATE + INTERVAL '5 days', 32.8, CURRENT_DATE),
('student4@example.com', 'Data Science with R & Python', 8, 3, 37.5, CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE + INTERVAL '20 days', 12.5, CURRENT_DATE - INTERVAL '2 days');

-- =============================================
-- 6. REVENUE & CONVERSION SAMPLE DATA
-- =============================================

-- Insert revenue tracking data
INSERT INTO analytics_revenue_tracking (date, transaction_id, user_email, course_name, revenue_amount, currency, payment_method, traffic_source, conversion_time_hours, discount_applied) VALUES
(CURRENT_DATE, 'TXN_ANALYTICS_001', 'customer1@example.com', 'Complete Python Programming Masterclass', 4999.00, 'INR', 'credit_card', 'google', 48, 0.00),
(CURRENT_DATE, 'TXN_ANALYTICS_002', 'customer2@example.com', 'Machine Learning & AI Fundamentals', 6999.00, 'INR', 'upi', 'facebook', 72, 1000.00),
(CURRENT_DATE - INTERVAL '1 day', 'TXN_ANALYTICS_003', 'customer3@example.com', 'Full Stack Web Development Bootcamp', 8999.00, 'INR', 'net_banking', 'direct', 24, 0.00),
(CURRENT_DATE - INTERVAL '2 days', 'TXN_ANALYTICS_004', 'customer4@example.com', 'Data Science with R & Python', 7499.00, 'INR', 'debit_card', 'google_ads', 120, 500.00),
(CURRENT_DATE - INTERVAL '3 days', 'TXN_ANALYTICS_005', 'customer5@example.com', 'Digital Marketing Mastery', 3999.00, 'INR', 'upi', 'instagram', 96, 0.00);

-- Insert conversion funnel data
INSERT INTO analytics_conversion_funnel (date, funnel_stage, course_name, users_entered, users_converted, conversion_rate, avg_time_in_stage_hours) VALUES
(CURRENT_DATE, 'visitor', 'Complete Python Programming Masterclass', 1000, 450, 45.0, 0.5),
(CURRENT_DATE, 'page_view', 'Complete Python Programming Masterclass', 450, 125, 27.8, 2.0),
(CURRENT_DATE, 'enquiry', 'Complete Python Programming Masterclass', 125, 35, 28.0, 24.0),
(CURRENT_DATE, 'demo', 'Complete Python Programming Masterclass', 35, 20, 57.1, 48.0),
(CURRENT_DATE, 'purchase', 'Complete Python Programming Masterclass', 20, 5, 25.0, 72.0),

(CURRENT_DATE, 'visitor', 'Machine Learning & AI Fundamentals', 800, 380, 47.5, 0.5),
(CURRENT_DATE, 'page_view', 'Machine Learning & AI Fundamentals', 380, 95, 25.0, 2.5),
(CURRENT_DATE, 'enquiry', 'Machine Learning & AI Fundamentals', 95, 28, 29.5, 20.0),
(CURRENT_DATE, 'demo', 'Machine Learning & AI Fundamentals', 28, 18, 64.3, 36.0),
(CURRENT_DATE, 'purchase', 'Machine Learning & AI Fundamentals', 18, 4, 22.2, 96.0);

-- Insert customer LTV data
INSERT INTO analytics_customer_ltv (user_email, first_purchase_date, total_revenue, purchase_count, avg_order_value, customer_lifetime_days, predicted_ltv, customer_segment) VALUES
('customer1@example.com', CURRENT_DATE - INTERVAL '30 days', 4999.00, 1, 4999.00, 30, 15000.00, 'high_value'),
('customer2@example.com', CURRENT_DATE - INTERVAL '45 days', 13998.00, 2, 6999.00, 45, 25000.00, 'high_value'),
('customer3@example.com', CURRENT_DATE - INTERVAL '15 days', 8999.00, 1, 8999.00, 15, 18000.00, 'high_value'),
('customer4@example.com', CURRENT_DATE - INTERVAL '60 days', 10998.00, 2, 5499.00, 60, 20000.00, 'high_value'),
('customer5@example.com', CURRENT_DATE - INTERVAL '10 days', 3999.00, 1, 3999.00, 10, 8000.00, 'medium_value');

-- =============================================
-- 7. REAL-TIME MONITORING SAMPLE DATA
-- =============================================

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

-- Insert anomaly detection data
INSERT INTO analytics_anomaly_detection (date, metric_name, expected_value, actual_value, deviation_percentage, anomaly_score, is_investigated, investigation_notes) VALUES
(CURRENT_DATE, 'daily_visitors', 1500.00, 1720.00, 14.67, 75.5, true, 'Traffic spike due to social media campaign launch'),
(CURRENT_DATE - INTERVAL '1 day', 'conversion_rate', 8.5, 12.3, 44.71, 85.2, true, 'Improved landing page design increased conversions'),
(CURRENT_DATE - INTERVAL '2 days', 'bounce_rate', 38.0, 28.5, -25.00, 70.3, false, null);

-- =============================================
-- 8. AI INSIGHTS SAMPLE DATA
-- =============================================

-- Insert AI insights
INSERT INTO analytics_ai_insights (insight_type, insight_title, insight_description, confidence_score, recommended_actions, affected_metrics, business_impact, expires_at) VALUES
('churn_prediction', 'High Churn Risk Identified', 'Machine learning model predicts 15 users at high risk of churning in next 30 days', 87.5, ARRAY['Send personalized retention email', 'Offer limited-time discount', 'Schedule personal call'], ARRAY['user_retention', 'revenue'], 'high', CURRENT_TIMESTAMP + INTERVAL '30 days'),
('revenue_forecast', 'Q1 Revenue Projection', 'Based on current trends, projected Q1 revenue will exceed target by 12%', 92.3, ARRAY['Increase marketing spend', 'Expand course catalog', 'Optimize pricing'], ARRAY['revenue', 'growth_rate'], 'high', CURRENT_TIMESTAMP + INTERVAL '90 days'),
('trend_analysis', 'Mobile Traffic Growth', 'Mobile users increasing 23% month-over-month - optimize mobile experience', 78.9, ARRAY['Improve mobile site speed', 'Enhance mobile UI/UX', 'Create mobile-first content'], ARRAY['mobile_conversion', 'user_experience'], 'medium', CURRENT_TIMESTAMP + INTERVAL '60 days');

-- Insert user recommendations
INSERT INTO analytics_user_recommendations (user_email, recommendation_type, recommendation_content, target_action, confidence_score, is_shown, expires_at) VALUES
('prospect1@example.com', 'course_suggestion', 'Based on your viewing history, we recommend "Advanced Python for Data Science"', 'course_enrollment', 85.2, false, CURRENT_TIMESTAMP + INTERVAL '7 days'),
('customer2@example.com', 'discount_offer', 'Complete your learning journey! 20% off on "Deep Learning Specialization"', 'purchase', 72.8, false, CURRENT_TIMESTAMP + INTERVAL '5 days'),
('inactive_user@example.com', 'engagement_boost', 'Your progress is great! Continue with Module 4 to maintain momentum', 'course_resume', 68.5, false, CURRENT_TIMESTAMP + INTERVAL '3 days');

-- =============================================
-- SUCCESS MESSAGE
-- =============================================

-- Display success message
DO $$
BEGIN
    RAISE NOTICE '🎉 ANALYTICS SAMPLE DATA POPULATED SUCCESSFULLY!';
    RAISE NOTICE '📊 Data inserted for all 23 analytics tables';
    RAISE NOTICE '📈 Sample data covers last 30 days with realistic patterns';
    RAISE NOTICE '🚀 Analytics Dashboard ready for testing!';
    RAISE NOTICE '💡 Access: /analytics-dashboard (Admin only)';
END $$; 

