-- Helper function to check if user is member of organization
CREATE OR REPLACE FUNCTION is_organization_member(org_id UUID, user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM organization_members
    WHERE organization_id = org_id
    AND user_id = user_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user has role in organization
CREATE OR REPLACE FUNCTION has_organization_role(org_id UUID, user_uuid UUID, required_role TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM organization_members
    WHERE organization_id = org_id
    AND user_id = user_uuid
    AND role = required_role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user has admin or owner role in organization
CREATE OR REPLACE FUNCTION is_organization_admin(org_id UUID, user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM organization_members
    WHERE organization_id = org_id
    AND user_id = user_uuid
    AND role IN ('owner', 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop old RLS policies for reports
DROP POLICY IF EXISTS "Users can view their own reports" ON reports;
DROP POLICY IF EXISTS "Users can create reports" ON reports;
DROP POLICY IF EXISTS "Users can update their own reports" ON reports;
DROP POLICY IF EXISTS "Users can delete their own reports" ON reports;
DROP POLICY IF EXISTS "Admins can view all reports" ON reports;

-- New RLS policies for reports with organization isolation
CREATE POLICY "Members can view reports in their organization" ON reports
  FOR SELECT USING (
    organization_id IS NOT NULL AND
    is_organization_member(organization_id, auth.uid())
  );

CREATE POLICY "Members can create reports in their organization" ON reports
  FOR INSERT WITH CHECK (
    organization_id IS NOT NULL AND
    is_organization_member(organization_id, auth.uid()) AND
    created_by = auth.uid()
  );

CREATE POLICY "Members can update reports in their organization" ON reports
  FOR UPDATE USING (
    organization_id IS NOT NULL AND
    is_organization_member(organization_id, auth.uid()) AND
    (created_by = auth.uid() OR is_organization_admin(organization_id, auth.uid()))
  );

CREATE POLICY "Members can delete reports in their organization" ON reports
  FOR DELETE USING (
    organization_id IS NOT NULL AND
    is_organization_member(organization_id, auth.uid()) AND
    (created_by = auth.uid() OR is_organization_admin(organization_id, auth.uid()))
  );

-- Drop old RLS policies for users (admin panel)
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Admins can insert users" ON users;
DROP POLICY IF EXISTS "Admins can update users" ON users;
DROP POLICY IF EXISTS "Admins can delete users" ON users;

-- New RLS policies for users with organization isolation
CREATE POLICY "Admins can view users in their organization" ON users
  FOR SELECT USING (
    organization_id IS NOT NULL AND
    is_organization_admin(organization_id, auth.uid())
  );

CREATE POLICY "Admins can insert users in their organization" ON users
  FOR INSERT WITH CHECK (
    organization_id IS NOT NULL AND
    is_organization_admin(organization_id, auth.uid())
  );

CREATE POLICY "Admins can update users in their organization" ON users
  FOR UPDATE USING (
    organization_id IS NOT NULL AND
    is_organization_admin(organization_id, auth.uid())
  );

CREATE POLICY "Admins can delete users in their organization" ON users
  FOR DELETE USING (
    organization_id IS NOT NULL AND
    is_organization_admin(organization_id, auth.uid())
  );

-- Drop old RLS policies for integrations
DROP POLICY IF EXISTS "Admins can manage integrations" ON integrations;

-- New RLS policies for integrations with organization isolation
CREATE POLICY "Admins can view integrations in their organization" ON integrations
  FOR SELECT USING (
    organization_id IS NOT NULL AND
    is_organization_admin(organization_id, auth.uid())
  );

CREATE POLICY "Admins can insert integrations in their organization" ON integrations
  FOR INSERT WITH CHECK (
    organization_id IS NOT NULL AND
    is_organization_admin(organization_id, auth.uid())
  );

CREATE POLICY "Admins can update integrations in their organization" ON integrations
  FOR UPDATE USING (
    organization_id IS NOT NULL AND
    is_organization_admin(organization_id, auth.uid())
  );

CREATE POLICY "Admins can delete integrations in their organization" ON integrations
  FOR DELETE USING (
    organization_id IS NOT NULL AND
    is_organization_admin(organization_id, auth.uid())
  );

-- Drop old RLS policies for subscriptions
DROP POLICY IF EXISTS "Users can view their own subscription" ON subscriptions;
DROP POLICY IF EXISTS "Admins can view all subscriptions" ON subscriptions;

-- New RLS policies for subscriptions with organization isolation
CREATE POLICY "Members can view subscriptions in their organization" ON subscriptions
  FOR SELECT USING (
    organization_id IS NOT NULL AND
    is_organization_member(organization_id, auth.uid()) AND
    (user_id = auth.uid() OR is_organization_admin(organization_id, auth.uid()))
  );

CREATE POLICY "Admins can manage subscriptions in their organization" ON subscriptions
  FOR ALL USING (
    organization_id IS NOT NULL AND
    is_organization_admin(organization_id, auth.uid())
  );

-- Drop old RLS policies for notifications
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;

-- New RLS policies for notifications with organization isolation
CREATE POLICY "Members can view notifications in their organization" ON notifications
  FOR SELECT USING (
    organization_id IS NOT NULL AND
    is_organization_member(organization_id, auth.uid()) AND
    user_id = auth.uid()
  );

CREATE POLICY "Members can update notifications in their organization" ON notifications
  FOR UPDATE USING (
    organization_id IS NOT NULL AND
    is_organization_member(organization_id, auth.uid()) AND
    user_id = auth.uid()
  );

CREATE POLICY "Admins can create notifications in their organization" ON notifications
  FOR INSERT WITH CHECK (
    organization_id IS NOT NULL AND
    is_organization_admin(organization_id, auth.uid())
  );

-- Drop old RLS policies for activity_logs
DROP POLICY IF EXISTS "Users can view their own activity logs" ON activity_logs;
DROP POLICY IF EXISTS "Admins can view all activity logs" ON activity_logs;

-- New RLS policies for activity_logs with organization isolation
CREATE POLICY "Members can view activity logs in their organization" ON activity_logs
  FOR SELECT USING (
    organization_id IS NOT NULL AND
    is_organization_member(organization_id, auth.uid()) AND
    (user_id = auth.uid() OR is_organization_admin(organization_id, auth.uid()))
  );

CREATE POLICY "System can create activity logs" ON activity_logs
  FOR INSERT WITH CHECK (
    organization_id IS NOT NULL AND
    is_organization_member(organization_id, auth.uid())
  );

-- Drop old RLS policies for analytics_events
DROP POLICY IF EXISTS "Admins can view all analytics events" ON analytics_events;

-- New RLS policies for analytics_events with organization isolation
CREATE POLICY "Members can view analytics events in their organization" ON analytics_events
  FOR SELECT USING (
    organization_id IS NOT NULL AND
    is_organization_member(organization_id, auth.uid())
  );

CREATE POLICY "System can create analytics events" ON analytics_events
  FOR INSERT WITH CHECK (
    organization_id IS NOT NULL AND
    is_organization_member(organization_id, auth.uid())
  );

