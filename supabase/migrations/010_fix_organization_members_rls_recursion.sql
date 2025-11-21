-- Fix infinite recursion in RLS policies for organization_members
-- Replace direct SELECT queries with SECURITY DEFINER functions that can bypass RLS

-- Helper function to check if organization has no members (for first owner insertion)
CREATE OR REPLACE FUNCTION is_organization_empty(org_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1 FROM organization_members
    WHERE organization_id = org_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop all existing policies for organization_members
DROP POLICY IF EXISTS "Users can view members of their organizations" ON organization_members;
DROP POLICY IF EXISTS "Admins can add members" ON organization_members;
DROP POLICY IF EXISTS "Owners can update member roles" ON organization_members;
DROP POLICY IF EXISTS "Owners can remove members" ON organization_members;
DROP POLICY IF EXISTS "Users can add themselves as organization owner" ON organization_members;

-- Recreate SELECT policy using is_organization_member function
CREATE POLICY "Users can view members of their organizations" ON organization_members
  FOR SELECT USING (
    is_organization_member(organization_id, auth.uid())
  );

-- Recreate INSERT policy for admins using is_organization_admin function
CREATE POLICY "Admins can add members" ON organization_members
  FOR INSERT WITH CHECK (
    is_organization_admin(organization_id, auth.uid())
  );

-- Recreate INSERT policy for first owner (when organization is empty)
-- This allows users to add themselves as owner when creating a new organization
CREATE POLICY "Users can add themselves as organization owner" ON organization_members
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND
    role = 'owner' AND
    is_organization_empty(organization_id)
  );

-- Recreate UPDATE policy using has_organization_role function
CREATE POLICY "Owners can update member roles" ON organization_members
  FOR UPDATE USING (
    has_organization_role(organization_id, auth.uid(), 'owner')
  );

-- Recreate DELETE policy using has_organization_role function
CREATE POLICY "Owners can remove members" ON organization_members
  FOR DELETE USING (
    has_organization_role(organization_id, auth.uid(), 'owner')
  );

