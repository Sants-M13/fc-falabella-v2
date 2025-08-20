-- Enable RLS on tables
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Helper function to get user profile
CREATE OR REPLACE FUNCTION get_user_profile()
RETURNS TABLE(role TEXT, store_id UUID) AS $$
BEGIN
  RETURN QUERY
  SELECT p.role, p.store_id
  FROM profiles p
  WHERE p.id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Stores policies
-- Admins can do everything
CREATE POLICY "Admins can do everything on stores" ON stores
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM get_user_profile() p 
    WHERE p.role = 'admin'
  )
);

-- Promotoras can only read their store
CREATE POLICY "Promotoras can read their store" ON stores
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM get_user_profile() p 
    WHERE p.role = 'promotora' AND p.store_id = stores.id
  )
);

-- Profiles policies
-- Admins can do everything
CREATE POLICY "Admins can do everything on profiles" ON profiles
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM get_user_profile() p 
    WHERE p.role = 'admin'
  )
);

-- Promotoras can only read their own profile
CREATE POLICY "Promotoras can read their own profile" ON profiles
FOR SELECT USING (
  profiles.id = auth.uid()
);

-- Users can update their own profile (excluding role and store_id)
CREATE POLICY "Users can update their own profile" ON profiles
FOR UPDATE USING (
  profiles.id = auth.uid()
) WITH CHECK (
  profiles.id = auth.uid() AND
  profiles.role = (SELECT role FROM profiles WHERE id = auth.uid()) AND
  profiles.store_id = (SELECT store_id FROM profiles WHERE id = auth.uid())
);