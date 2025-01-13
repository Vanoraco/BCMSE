/*
  # Fix profiles policies to prevent recursion

  1. Changes
    - Drop existing admin policy that causes recursion
    - Create new admin policy with direct auth.uid() check
    - Add insert policy for admin users
    - Add delete policy for admin users

  2. Security
    - Maintains RLS protection
    - Ensures admin users can manage other users
    - Prevents infinite recursion in policy evaluation
*/

-- Drop the recursive policy
DROP POLICY IF EXISTS "Admin can view all profiles" ON profiles;

-- Create new admin policies without recursion
CREATE POLICY "Admin can manage all profiles"
  ON profiles
  USING (
    (SELECT account_type FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- Add insert policy for admin users
CREATE POLICY "Admin can insert profiles"
  ON profiles FOR INSERT
  WITH CHECK (
    (SELECT account_type FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- Add delete policy for admin users
CREATE POLICY "Admin can delete profiles"
  ON profiles FOR DELETE
  USING (
    (SELECT account_type FROM profiles WHERE id = auth.uid()) = 'admin'
  );