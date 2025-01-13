/*
  # Fix profiles table policies

  1. Changes
    - Drop all existing policies
    - Create new policies using auth.jwt() claims
    - Ensure proper access control for different user types

  2. Security
    - Maintain row-level security
    - Use JWT claims for role-based access
    - Prevent infinite recursion
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Admin can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admin can manage all profiles" ON profiles;
DROP POLICY IF EXISTS "Admin can insert profiles" ON profiles;
DROP POLICY IF EXISTS "Admin can delete profiles" ON profiles;

-- Create new policies using JWT claims
CREATE POLICY "view_own_profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "admin_view_all"
  ON profiles FOR SELECT
  USING (auth.jwt()->>'account_type' = 'admin');

CREATE POLICY "admin_insert"
  ON profiles FOR INSERT
  WITH CHECK (auth.jwt()->>'account_type' = 'admin');

CREATE POLICY "admin_delete"
  ON profiles FOR DELETE
  USING (auth.jwt()->>'account_type' = 'admin');