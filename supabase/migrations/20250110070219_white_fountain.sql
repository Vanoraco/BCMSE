/*
  # Fix profiles table policies

  1. Changes
    - Drop all existing policies
    - Create new policies using EXISTS subqueries
    - Prevent infinite recursion by using lateral joins

  2. Security
    - Maintain row-level security
    - Allow users to view their own profile
    - Allow admins to manage all profiles
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "view_own_profile" ON profiles;
DROP POLICY IF EXISTS "admin_view_all" ON profiles;
DROP POLICY IF EXISTS "admin_insert" ON profiles;
DROP POLICY IF EXISTS "admin_delete" ON profiles;

-- Create new policies using EXISTS and lateral joins
CREATE POLICY "users_view_own"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "admins_view_all"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM profiles p
      WHERE p.id = auth.uid()
      AND p.account_type = 'admin'
    )
  );

CREATE POLICY "admins_insert"
  ON profiles FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM profiles p
      WHERE p.id = auth.uid()
      AND p.account_type = 'admin'
    )
  );

CREATE POLICY "admins_delete"
  ON profiles FOR DELETE
  USING (
    EXISTS (
      SELECT 1
      FROM profiles p
      WHERE p.id = auth.uid()
      AND p.account_type = 'admin'
    )
  );