-- Fix organization creation on user signup
-- Ensure that the trigger function can create organizations and add members

-- Drop existing INSERT policy for organizations if it exists
DROP POLICY IF EXISTS "System can create organizations" ON organizations;
DROP POLICY IF EXISTS "Users can create organizations" ON organizations;

-- Create policy that allows SECURITY DEFINER functions to create organizations
-- This is needed for the auto_create_organization_for_new_user() function
CREATE POLICY "System can create organizations" ON organizations
  FOR INSERT WITH CHECK (true);

-- Ensure the function exists and is correct
-- This function runs with SECURITY DEFINER, so it bypasses RLS
-- But we need to ensure it can insert into both tables
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
  -- SECURITY DEFINER bypasses RLS, so this should work
  -- But we have a policy "System can create organizations" as backup
  INSERT INTO organizations (name, slug, created_by)
  VALUES (org_name, org_slug, NEW.id)
  RETURNING id INTO org_id;
  
  -- Add user as owner
  -- SECURITY DEFINER bypasses RLS, but the policy "Users can add themselves as organization owner"
  -- should also allow this since is_organization_empty() will return true
  -- However, with SECURITY DEFINER, auth.uid() might be NULL, so we rely on bypass
  INSERT INTO organization_members (organization_id, user_id, role)
  VALUES (org_id, NEW.id, 'owner')
  ON CONFLICT (organization_id, user_id) DO NOTHING;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the profile creation
    -- This prevents registration from failing if organization creation has issues
    -- The error will be visible in Supabase logs
    RAISE WARNING 'Failed to create organization for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add a policy that allows system functions to insert first owner
-- This is needed because SECURITY DEFINER functions might have auth.uid() = NULL
-- But we still want to allow the first owner insertion
DROP POLICY IF EXISTS "System can add first owner" ON organization_members;
CREATE POLICY "System can add first owner" ON organization_members
  FOR INSERT WITH CHECK (
    role = 'owner' AND
    is_organization_empty(organization_id)
  );

-- Ensure trigger exists
DROP TRIGGER IF EXISTS trigger_auto_create_organization ON profiles;
CREATE TRIGGER trigger_auto_create_organization
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION auto_create_organization_for_new_user();

