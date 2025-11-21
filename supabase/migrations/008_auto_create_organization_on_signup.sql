-- Function to generate organization slug from name
CREATE OR REPLACE FUNCTION generate_organization_slug(name TEXT)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  -- Convert to lowercase, replace spaces with hyphens, remove special chars
  base_slug := lower(regexp_replace(name, '[^a-z0-9]+', '-', 'g'));
  base_slug := trim(both '-' from base_slug);
  
  -- Check if slug exists, if so append number
  final_slug := base_slug;
  WHILE EXISTS (SELECT 1 FROM organizations WHERE slug = final_slug) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- Function to automatically create organization and add user as owner when profile is created
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
  INSERT INTO organization_members (organization_id, user_id, role)
  VALUES (org_id, NEW.id, 'owner');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-create organization when profile is created
DROP TRIGGER IF EXISTS trigger_auto_create_organization ON profiles;
CREATE TRIGGER trigger_auto_create_organization
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION auto_create_organization_for_new_user();

