-- =============================================
-- DISABLE ROW LEVEL SECURITY FOR ANALYTICS TABLES
-- This allows the analytics service to read data without authentication
-- =============================================

-- Disable RLS for all analytics tables
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

-- Grant read access to anonymous users for analytics tables
GRANT SELECT ON analytics_visitor_stats TO anon;
GRANT SELECT ON analytics_traffic_sources TO anon;
GRANT SELECT ON analytics_geographic_data TO anon;
GRANT SELECT ON analytics_device_browser_data TO anon;
GRANT SELECT ON analytics_session_tracking TO anon;
GRANT SELECT ON analytics_page_performance TO anon;
GRANT SELECT ON analytics_click_heatmap TO anon;
GRANT SELECT ON analytics_course_performance TO anon;
GRANT SELECT ON analytics_video_engagement TO anon;
GRANT SELECT ON analytics_enquiry_tracking TO anon;
GRANT SELECT ON analytics_user_sessions TO anon;
GRANT SELECT ON analytics_content_interaction TO anon;
GRANT SELECT ON analytics_upgrade_tracking TO anon;
GRANT SELECT ON analytics_churn_tracking TO anon;
GRANT SELECT ON analytics_download_tracking TO anon;
GRANT SELECT ON analytics_quiz_performance TO anon;
GRANT SELECT ON analytics_course_progress TO anon;
GRANT SELECT ON analytics_revenue_tracking TO anon;
GRANT SELECT ON analytics_conversion_funnel TO anon;
GRANT SELECT ON analytics_customer_ltv TO anon;
GRANT SELECT ON analytics_realtime_visitors TO anon;
GRANT SELECT ON analytics_action_alerts TO anon;
GRANT SELECT ON analytics_anomaly_detection TO anon;
GRANT SELECT ON analytics_ai_insights TO anon;
GRANT SELECT ON analytics_user_recommendations TO anon;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '🔓 ROW LEVEL SECURITY DISABLED FOR ALL ANALYTICS TABLES!';
    RAISE NOTICE '✅ Anonymous users can now read analytics data';
    RAISE NOTICE '🔄 Refresh your analytics debug page to test';
END $$; 
