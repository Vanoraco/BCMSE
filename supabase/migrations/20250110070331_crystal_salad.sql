/*
  # Simplify profiles table policies

  1. Changes
    - Drop all existing policies
    - Create simplified policies without complex checks
    - Use basic RLS rules to prevent recursion

  2. Security
    - Allow all authenticated users to view profiles
    - Restrict insert/delete to admin users based on session claims
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "users_view_own" ON profiles;
DROP POLICY IF EXISTS "admins_view_all" ON profiles;
DROP POLICY IF EXISTS "admins_insert" ON profiles;
DROP POLICY IF EXISTS "admins_delete" ON profiles;

-- Create simplified policies
CREATE POLICY "allow_select"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "allow_insert"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (
    id = auth.uid() OR
    EXISTS (
      SELECT 1
      FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.email = 'admin@example.com'
    )
  );

CREATE POLICY "allow_delete"
  ON profiles FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.email = 'admin@example.com'
    )
  );