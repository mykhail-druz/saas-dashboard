-- Seed demo organizations with data for portfolio preview
-- Note: This assumes auth users are already created in Supabase Auth
-- You need to create auth users first, then run this migration

-- Demo Organization 1: Acme Corp
-- Assuming there's a profile with email 'demo1@example.com' or create one
DO $$
DECLARE
  org1_id UUID;
  org2_id UUID;
  org3_id UUID;
  user1_id UUID;
  user2_id UUID;
  user3_id UUID;
BEGIN
  -- Create demo organizations (these will be linked to actual users when they register)
  -- For demo purposes, we'll create organizations that can be assigned to test users
  
  -- Note: In production, organizations are created automatically when users register
  -- This seed file is for demo/preview purposes only
  
  -- If you want to seed with specific user IDs, uncomment and modify:
  /*
  -- Get or create demo user IDs
  SELECT id INTO user1_id FROM auth.users WHERE email = 'demo1@example.com' LIMIT 1;
  SELECT id INTO user2_id FROM auth.users WHERE email = 'demo2@example.com' LIMIT 1;
  SELECT id INTO user3_id FROM auth.users WHERE email = 'demo3@example.com' LIMIT 1;
  
  -- Create organizations if users exist
  IF user1_id IS NOT NULL THEN
    INSERT INTO organizations (id, name, slug, created_by)
    VALUES 
      (gen_random_uuid(), 'Acme Corp', 'acme-corp', user1_id)
    ON CONFLICT (slug) DO NOTHING
    RETURNING id INTO org1_id;
    
    -- Add user as owner
    INSERT INTO organization_members (organization_id, user_id, role)
    VALUES (org1_id, user1_id, 'owner')
    ON CONFLICT (organization_id, user_id) DO NOTHING;
  END IF;
  
  IF user2_id IS NOT NULL THEN
    INSERT INTO organizations (id, name, slug, created_by)
    VALUES 
      (gen_random_uuid(), 'TechStart Inc', 'techstart-inc', user2_id)
    ON CONFLICT (slug) DO NOTHING
    RETURNING id INTO org2_id;
    
    INSERT INTO organization_members (organization_id, user_id, role)
    VALUES (org2_id, user2_id, 'owner')
    ON CONFLICT (organization_id, user_id) DO NOTHING;
  END IF;
  
  IF user3_id IS NOT NULL THEN
    INSERT INTO organizations (id, name, slug, created_by)
    VALUES 
      (gen_random_uuid(), 'Global Solutions', 'global-solutions', user3_id)
    ON CONFLICT (slug) DO NOTHING
    RETURNING id INTO org3_id;
    
    INSERT INTO organization_members (organization_id, user_id, role)
    VALUES (org3_id, user3_id, 'owner')
    ON CONFLICT (organization_id, user_id) DO NOTHING;
  END IF;
  */
  
  -- For now, this migration is a placeholder
  -- Organizations will be created automatically when users register
  -- You can manually assign seed data to organizations after they're created
  RAISE NOTICE 'Demo organizations seed completed. Organizations are created automatically on user registration.';
END $$;

-- Helper function to seed data for an existing organization
-- Usage: SELECT seed_organization_data('organization-id-here');
CREATE OR REPLACE FUNCTION seed_organization_data(org_id UUID)
RETURNS void AS $$
DECLARE
  owner_id UUID;
BEGIN
  -- Get organization owner
  SELECT user_id INTO owner_id
  FROM organization_members
  WHERE organization_id = org_id AND role = 'owner'
  LIMIT 1;
  
  IF owner_id IS NULL THEN
    RAISE EXCEPTION 'Organization owner not found';
  END IF;
  
  -- Seed reports
  INSERT INTO reports (title, description, type, status, content, created_by, organization_id)
  VALUES
    ('Monthly Sales Report', 'Comprehensive sales analysis for the month', 'sales', 'published', '{"revenue": 125000, "growth": 15}'::jsonb, owner_id, org_id),
    ('Q4 Traffic Analysis', 'Website traffic trends and insights', 'traffic', 'published', '{"visitors": 50000, "sessions": 75000}'::jsonb, owner_id, org_id),
    ('Revenue Forecast', 'Projected revenue for next quarter', 'revenue', 'draft', '{"forecast": 150000}'::jsonb, owner_id, org_id)
  ON CONFLICT DO NOTHING;
  
  -- Seed integrations
  INSERT INTO integrations (name, type, status, api_key, last_sync_at, organization_id)
  VALUES
    ('Stripe Payment', 'stripe', 'active', 'sk_test_*******', NOW() - INTERVAL '1 hour', org_id),
    ('SendGrid Email', 'sendgrid', 'active', 'SG.*******', NOW() - INTERVAL '2 hours', org_id),
    ('AWS S3 Storage', 'aws', 'active', 'AKIA*******', NOW() - INTERVAL '30 minutes', org_id)
  ON CONFLICT DO NOTHING;
  
  -- Seed subscriptions
  INSERT INTO subscriptions (user_id, plan, status, current_period_start, current_period_end, organization_id)
  VALUES
    (owner_id, 'pro', 'active', NOW() - INTERVAL '15 days', NOW() + INTERVAL '15 days', org_id)
  ON CONFLICT DO NOTHING;
  
  -- Seed notifications
  INSERT INTO notifications (user_id, title, message, type, read, organization_id)
  VALUES
    (owner_id, 'Welcome!', 'Welcome to Analytics Pro Dashboard', 'success', false, org_id),
    (owner_id, 'New Report', 'Your monthly sales report is ready', 'info', false, org_id),
    (owner_id, 'Integration Updated', 'Stripe integration synced successfully', 'success', true, org_id)
  ON CONFLICT DO NOTHING;
  
  -- Seed analytics events
  INSERT INTO analytics_events (event_type, value, metadata, organization_id)
  VALUES
    ('revenue', 12500.50, '{"source": "sales"}'::jsonb, org_id),
    ('revenue', 13200.75, '{"source": "sales"}'::jsonb, org_id),
    ('revenue', 11800.25, '{"source": "sales"}'::jsonb, org_id),
    ('traffic', 1200, '{"source": "web"}'::jsonb, org_id),
    ('traffic', 1350, '{"source": "web"}'::jsonb, org_id),
    ('users', 150, '{}'::jsonb, org_id),
    ('users', 165, '{}'::jsonb, org_id)
  ON CONFLICT DO NOTHING;
  
  -- Seed activity logs
  INSERT INTO activity_logs (user_id, action, resource_type, resource_id, details, organization_id)
  VALUES
    (owner_id, 'create', 'report', (SELECT id FROM reports WHERE organization_id = org_id LIMIT 1), '{"title": "Monthly Sales Report"}'::jsonb, org_id),
    (owner_id, 'login', 'auth', NULL, '{}'::jsonb, org_id),
    (owner_id, 'view', 'dashboard', NULL, '{}'::jsonb, org_id)
  ON CONFLICT DO NOTHING;
  
  RAISE NOTICE 'Seed data created for organization %', org_id;
END;
$$ LANGUAGE plpgsql;

