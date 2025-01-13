/*
  # Initial Schema Setup for Ethiopian Chamber of Commerce Platform

  1. Tables
    - profiles
      - Stores user profile information including account type
    - businesses
      - Stores business information
    - chamber_members
      - Stores Ethiopian Chamber of Commerce members
    - government_initiatives
      - Stores government organization initiatives

  2. Security
    - Enable RLS on all tables
    - Add policies for data access based on user roles
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL UNIQUE,
  account_type TEXT NOT NULL CHECK (account_type IN ('admin', 'chamber', 'business', 'government')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create businesses table
CREATE TABLE IF NOT EXISTS businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  sector TEXT NOT NULL,
  employee_count INTEGER,
  annual_revenue DECIMAL,
  registration_date DATE,
  owner_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create chamber_members table
CREATE TABLE IF NOT EXISTS chamber_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id),
  membership_level TEXT NOT NULL,
  join_date DATE,
  expiry_date DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create government_initiatives table
CREATE TABLE IF NOT EXISTS government_initiatives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  status TEXT,
  organization_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE chamber_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE government_initiatives ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admin can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND account_type = 'admin'
    )
  );

CREATE POLICY "Business owners can view own business"
  ON businesses FOR SELECT
  TO authenticated
  USING (owner_id = auth.uid());

CREATE POLICY "Chamber can view all businesses"
  ON businesses FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND account_type = 'chamber'
    )
  );

CREATE POLICY "Chamber can view all members"
  ON chamber_members FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND account_type = 'chamber'
    )
  );

CREATE POLICY "Government can view initiatives"
  ON government_initiatives FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND account_type = 'government'
    )
  );