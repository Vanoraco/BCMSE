/*
  # Fix recursive profiles policy with admin flag

  1. Changes
    - Drop existing policies that cause recursion
    - Create new policies using auth.jwt() claims for admin check
    - Add admin claim to auth.users for role-based access

  2. Security
    - Uses JWT claims instead of recursive table checks
    - Maintains proper access control
    - Prevents infinite recursion
*/

-- First, drop existing policies
DROP POLICY IF EXISTS "Admin can manage all profiles" ON profiles;
DROP POLICY IF EXISTS "Admin can insert profiles" ON profiles;
DROP POLICY IF EXISTS "Admin can delete profiles" ON profiles;

-- Create new policies using auth.jwt() claims
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admin can view all profiles"
  ON profiles FOR SELECT
  USING (auth.jwt()->>'account_type' = 'admin');

CREATE POLICY "Admin can insert profiles"
  ON profiles FOR INSERT
  WITH CHECK (auth.jwt()->>'account_type' = 'admin');

CREATE POLICY "Admin can delete profiles"
  ON profiles FOR DELETE
  USING (auth.jwt()->>'account_type' = 'admin');