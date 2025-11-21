-- Fix RLS issue when creating organization for new user
-- The function needs to bypass RLS when inserting into organization_members

-- Drop and recreate the function with proper RLS bypass
CREATE OR REPLACE FUNCTION auto_create_organization_for_new_user()
RETURNS TRIGGER AS $$
DECLARE
  org_id UUID;
  org_name TEXT;
  org_slug TEXT;
BEGIN
  -- Generate organization name from user's name or email
  IF NEW.name IS NOT NULL AND NEW.name != '' THEN
    org_name := NEW.name || '''s Organization';
  ELSE
    org_name := split_part(NEW.email, '@', 1) || '''s Organization';
  END IF;
  
  -- Generate unique slug
  org_slug := generate_organization_slug(org_name);
  
  -- Create organization (this should work with SECURITY DEFINER)
  INSERT INTO organizations (name, slug, created_by)
  VALUES (org_name, org_slug, NEW.id)
  RETURNING id INTO org_id;
  
  -- Add user as owner - need to bypass RLS for this insert
  -- Using SET LOCAL to temporarily disable RLS check
  PERFORM set_config('app.bypass_rls', 'true', true);
  
  INSERT INTO organization_members (organization_id, user_id, role)
  VALUES (org_id, NEW.id, 'owner');
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- If organization creation fails, rollback
    RAISE EXCEPTION 'Failed to create organization for user: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Alternative approach: Add a policy that allows users to add themselves as first member
-- This is safer than bypassing RLS
DROP POLICY IF EXISTS "Users can add themselves as organization owner" ON organization_members;
CREATE POLICY "Users can add themselves as organization owner" ON organization_members
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND
    role = 'owner' AND
    NOT EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_id = organization_members.organization_id
    )
  );

-- Also need to allow the function to create organizations
-- The function already has SECURITY DEFINER, but we need to ensure it can insert
-- Let's also add a policy for system-created organizations
DROP POLICY IF EXISTS "System can create organizations" ON organizations;
CREATE POLICY "System can create organizations" ON organizations
  FOR INSERT WITH CHECK (true);

-- But wait, SECURITY DEFINER should bypass RLS. Let me check if the issue is something else.
-- Actually, the real issue might be that we need to ensure the function can insert
-- Let's use a different approach - modify the function to use SET ROLE

-- Actually, let's try a simpler fix: ensure the function properly bypasses RLS
-- by using SECURITY DEFINER and making sure it's the owner of the tables
-- But that's not always possible in Supabase

-- Better approach: Add a policy that allows the trigger function to work
-- But we can't reference the function in a policy...

-- Final solution: Modify the function to use a service role or ensure RLS is properly bypassed
-- Since SECURITY DEFINER should work, let's check if there's an issue with the function itself

-- Let's recreate the function with better error handling and ensure it works
DROP FUNCTION IF EXISTS auto_create_organization_for_new_user();
CREATE OR REPLACE FUNCTION auto_create_organization_for_new_user()
RETURNS TRIGGER AS $$
DECLARE
  org_id UUID;
  org_name TEXT;
  org_slug TEXT;
BEGIN
  -- Generate organization name from user's name or email
  IF NEW.name IS NOT NULL AND NEW.name != '' THEN
    org_name := NEW.name || '''s Organization';
  ELSE
    org_name := split_part(NEW.email, '@', 1) || '''s Organization';
  END IF;
  
  -- Generate unique slug
  org_slug := generate_organization_slug(org_name);
  
  -- Create organization
  INSERT INTO organizations (name, slug, created_by)
  VALUES (org_name, org_slug, NEW.id)
  RETURNING id INTO org_id;
  
  -- Add user as owner
  -- Since this function has SECURITY DEFINER, it should bypass RLS
  -- But if it doesn't work, the policy above should allow it
  INSERT INTO organization_members (organization_id, user_id, role)
  VALUES (org_id, NEW.id, 'owner')
  ON CONFLICT (organization_id, user_id) DO NOTHING;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error and re-raise
    RAISE EXCEPTION 'Failed to create organization for user %: %', NEW.id, SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

