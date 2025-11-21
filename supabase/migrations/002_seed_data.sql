-- Seed data for Analytics Pro Dashboard
-- Note: This assumes auth users are already created in Supabase Auth
-- You need to create auth users first, then run this migration

-- Insert sample users (for admin panel)
-- Note: These are separate from auth.users, they're for the admin panel
INSERT INTO users (id, name, email, status, role, created_at) VALUES
  ('00000000-0000-0000-0000-000000000001', 'John Doe', 'john.doe@example.com', 'active', 'admin', NOW() - INTERVAL '30 days'),
  ('00000000-0000-0000-0000-000000000002', 'Jane Smith', 'jane.smith@example.com', 'active', 'user', NOW() - INTERVAL '25 days'),
  ('00000000-0000-0000-0000-000000000003', 'Bob Johnson', 'bob.johnson@example.com', 'active', 'user', NOW() - INTERVAL '20 days'),
  ('00000000-0000-0000-0000-000000000004', 'Alice Williams', 'alice.williams@example.com', 'inactive', 'user', NOW() - INTERVAL '15 days'),
  ('00000000-0000-0000-0000-000000000005', 'Charlie Brown', 'charlie.brown@example.com', 'active', 'viewer', NOW() - INTERVAL '10 days'),
  ('00000000-0000-0000-0000-000000000006', 'Diana Prince', 'diana.prince@example.com', 'active', 'user', NOW() - INTERVAL '8 days'),
  ('00000000-0000-0000-0000-000000000007', 'Eve Adams', 'eve.adams@example.com', 'suspended', 'user', NOW() - INTERVAL '5 days'),
  ('00000000-0000-0000-0000-000000000008', 'Frank Miller', 'frank.miller@example.com', 'active', 'user', NOW() - INTERVAL '3 days'))
ON CONFLICT (id) DO NOTHING;

-- Insert sample analytics events (for dashboard charts)
INSERT INTO analytics_events (event_type, value, metadata, created_at) VALUES
  ('revenue', 12500.50, '{"source": "sales"}', NOW() - INTERVAL '30 days'),
  ('revenue', 13200.75, '{"source": "sales"}', NOW() - INTERVAL '29 days'),
  ('revenue', 11800.25, '{"source": "sales"}', NOW() - INTERVAL '28 days'),
  ('revenue', 14500.00, '{"source": "sales"}', NOW() - INTERVAL '27 days'),
  ('revenue', 15200.50, '{"source": "sales"}', NOW() - INTERVAL '26 days'),
  ('revenue', 16800.75, '{"source": "sales"}', NOW() - INTERVAL '25 days'),
  ('revenue', 17500.25, '{"source": "sales"}', NOW() - INTERVAL '24 days'),
  ('revenue', 18200.50, '{"source": "sales"}', NOW() - INTERVAL '23 days'),
  ('traffic', 1200, '{"source": "web"}', NOW() - INTERVAL '30 days'),
  ('traffic', 1350, '{"source": "web"}', NOW() - INTERVAL '29 days'),
  ('traffic', 1500, '{"source": "web"}', NOW() - INTERVAL '28 days'),
  ('traffic', 1420, '{"source": "web"}', NOW() - INTERVAL '27 days'),
  ('traffic', 1680, '{"source": "web"}', NOW() - INTERVAL '26 days'),
  ('traffic', 1750, '{"source": "web"}', NOW() - INTERVAL '25 days'),
  ('traffic', 1920, '{"source": "web"}', NOW() - INTERVAL '24 days'),
  ('traffic', 2100, '{"source": "web"}', NOW() - INTERVAL '23 days'),
  ('users', 150, '{}', NOW() - INTERVAL '30 days'),
  ('users', 165, '{}', NOW() - INTERVAL '29 days'),
  ('users', 180, '{}', NOW() - INTERVAL '28 days'),
  ('users', 195, '{}', NOW() - INTERVAL '27 days'),
  ('users', 210, '{}', NOW() - INTERVAL '26 days'),
  ('users', 225, '{}', NOW() - INTERVAL '25 days'),
  ('users', 240, '{}', NOW() - INTERVAL '24 days'),
  ('users', 255, '{}', NOW() - INTERVAL '23 days')
ON CONFLICT DO NOTHING;

-- Insert sample integrations
INSERT INTO integrations (id, name, type, status, api_key, last_sync_at, created_at) VALUES
  ('00000000-0000-0000-0000-000000000011', 'Stripe', 'stripe', 'active', 'sk_test_*******', NOW() - INTERVAL '1 hour', NOW() - INTERVAL '10 days'),
  ('00000000-0000-0000-0000-000000000012', 'SendGrid', 'sendgrid', 'active', 'SG.*******', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '8 days'),
  ('00000000-0000-0000-0000-000000000013', 'AWS S3', 'aws', 'active', 'AKIA*******', NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '5 days'),
  ('00000000-0000-0000-0000-000000000014', 'Slack', 'slack', 'inactive', 'xoxb-*******', NULL, NOW() - INTERVAL '3 days'),
  ('00000000-0000-0000-0000-000000000015', 'GitHub', 'github', 'active', 'ghp_*******', NOW() - INTERVAL '15 minutes', NOW() - INTERVAL '2 days'),
  ('00000000-0000-0000-0000-000000000016', 'Custom API', 'custom', 'error', 'custom_*******', NULL, NOW() - INTERVAL '1 day'))
ON CONFLICT (id) DO NOTHING;

-- Note: Reports, notifications, subscriptions, and activity_logs will be populated
-- when users interact with the application. For demo purposes, you can add sample data here
-- but they typically depend on user actions.

-- Sample reports (assuming there's a profile with id)
-- INSERT INTO reports (title, description, type, status, created_by) VALUES
--   ('Monthly Sales Report', 'Comprehensive sales analysis for the month', 'sales', 'published', (SELECT id FROM profiles LIMIT 1)),
--   ('Traffic Analysis', 'Website traffic trends and insights', 'traffic', 'published', (SELECT id FROM profiles LIMIT 1))
-- ON CONFLICT DO NOTHING;

