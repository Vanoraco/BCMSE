/*
  # Sample Data for Ethiopian Chamber of Commerce Platform

  1. Sample Data
    - Authentication users
    - Profile records
    - Business records
    - Chamber members
    - Government initiatives

  2. Notes
    - All UUIDs are in valid format (8-4-4-4-12 characters)
    - All relationships between tables are maintained
    - Sample data represents realistic business scenarios
*/

-- Sample Users (passwords will be set via Supabase Auth UI)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES
  -- Admin
  ('d0d4671c-d07c-4ef2-a589-3d9733b1e3ba', 'admin@example.com', crypt('password123', gen_salt('bf')), now(), now(), now()),
  -- Chamber
  ('f5c3c8a2-3e5b-4b2d-9c1d-8e5f8c3a9b7c', 'chamber@example.com', crypt('password123', gen_salt('bf')), now(), now(), now()),
  -- Business
  ('a1b2c3d4-e5f6-4a5b-9c3d-2e1f4a5b6c7d', 'business@example.com', crypt('password123', gen_salt('bf')), now(), now(), now()),
  -- Government
  ('b7c8d9e0-f1a2-4b3c-8d4e-5f6a7b8c9d0e', 'government@example.com', crypt('password123', gen_salt('bf')), now(), now(), now());

-- Sample Profiles
INSERT INTO profiles (id, email, account_type, created_at)
VALUES
  ('d0d4671c-d07c-4ef2-a589-3d9733b1e3ba', 'admin@example.com', 'admin', now()),
  ('f5c3c8a2-3e5b-4b2d-9c1d-8e5f8c3a9b7c', 'chamber@example.com', 'chamber', now()),
  ('a1b2c3d4-e5f6-4a5b-9c3d-2e1f4a5b6c7d', 'business@example.com', 'business', now()),
  ('b7c8d9e0-f1a2-4b3c-8d4e-5f6a7b8c9d0e', 'government@example.com', 'government', now());

-- Sample Businesses
INSERT INTO businesses (id, name, sector, employee_count, annual_revenue, registration_date, owner_id, created_at)
VALUES
  ('e1f2a3b4-c5d6-4e5f-8a7b-9c0d1e2f3a4b', 'Ethiopian Coffee Exports Ltd', 'Agriculture', 150, 5000000, '2020-01-15', 'a1b2c3d4-e5f6-4a5b-9c3d-2e1f4a5b6c7d', now()),
  ('f4e3d2c1-b0a9-4c8b-7d6e-5f4e3d2c1b0a', 'Addis Tech Solutions', 'Technology', 75, 2000000, '2021-03-20', 'a1b2c3d4-e5f6-4a5b-9c3d-2e1f4a5b6c7d', now()),
  ('a9b8c7d6-e5f4-3a2b-1c0d-9e8f7a6b5c4d', 'Habesha Textiles', 'Manufacturing', 300, 8000000, '2019-11-30', 'a1b2c3d4-e5f6-4a5b-9c3d-2e1f4a5b6c7d', now());

-- Sample Chamber Members
INSERT INTO chamber_members (id, business_id, membership_level, join_date, expiry_date, created_at)
VALUES
  ('c1d2e3f4-a5b6-7c8d-9e0f-1a2b3c4d5e6f', 'e1f2a3b4-c5d6-4e5f-8a7b-9c0d1e2f3a4b', 'Gold', '2020-01-15', '2024-01-15', now()),
  ('d4c3b2a1-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'f4e3d2c1-b0a9-4c8b-7d6e-5f4e3d2c1b0a', 'Silver', '2021-03-20', '2024-03-20', now()),
  ('e7f8a9b0-c1d2-3e4f-5a6b-7c8d9e0f1a2b', 'a9b8c7d6-e5f4-3a2b-1c0d-9e8f7a6b5c4d', 'Platinum', '2019-11-30', '2024-11-30', now());

-- Sample Government Initiatives
INSERT INTO government_initiatives (id, title, description, start_date, end_date, status, organization_id, created_at)
VALUES
  ('b1a2c3d4-e5f6-4a5b-9c3d-2e1f4a5b6c7d', 
   'Digital Ethiopia 2025', 
   'National digital transformation initiative to modernize the economy', 
   '2023-01-01', 
   '2025-12-31', 
   'In Progress',
   'b7c8d9e0-f1a2-4b3c-8d4e-5f6a7b8c9d0e',
   now()),
  ('c2b3d4e5-f6a7-4a5b-9c3d-2e1f4a5b6c7d',
   'SME Growth Program',
   'Support program for small and medium enterprises',
   '2023-06-01',
   '2024-12-31',
   'Active',
   'b7c8d9e0-f1a2-4b3c-8d4e-5f6a7b8c9d0e',
   now()),
  ('d3c4e5f6-a7b8-4a5b-9c3d-2e1f4a5b6c7d',
   'Export Enhancement Initiative',
   'Program to boost Ethiopian exports globally',
   '2023-09-01',
   '2025-08-31',
   'Planning',
   'b7c8d9e0-f1a2-4b3c-8d4e-5f6a7b8c9d0e',
   now());