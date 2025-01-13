/*
  # Safe Sample Data Insertion with Existence Checks

  1. Purpose
    - Add sample data only if it doesn't already exist
    - Prevent duplicate key violations
    - Maintain data consistency

  2. Changes
    - Add sample businesses if not present
    - Add chamber memberships if not present
    - Add government initiatives if not present

  3. Safety
    - Uses DO blocks with existence checks
    - Prevents duplicate insertions
    - Maintains referential integrity
*/

DO $$
BEGIN
  -- Sample Businesses
  IF NOT EXISTS (SELECT 1 FROM businesses WHERE id = 'e1f2a3b4-c5d6-4e5f-8a7b-9c0d1e2f3a4b') THEN
    INSERT INTO businesses (id, name, sector, employee_count, annual_revenue, registration_date, owner_id, created_at)
    VALUES ('e1f2a3b4-c5d6-4e5f-8a7b-9c0d1e2f3a4b', 'Ethiopian Coffee Exports Ltd', 'Agriculture', 150, 5000000, '2020-01-15', 'a1b2c3d4-e5f6-4a5b-9c3d-2e1f4a5b6c7d', now());
  END IF;

  IF NOT EXISTS (SELECT 1 FROM businesses WHERE id = 'f4e3d2c1-b0a9-4c8b-7d6e-5f4e3d2c1b0a') THEN
    INSERT INTO businesses (id, name, sector, employee_count, annual_revenue, registration_date, owner_id, created_at)
    VALUES ('f4e3d2c1-b0a9-4c8b-7d6e-5f4e3d2c1b0a', 'Addis Tech Solutions', 'Technology', 75, 2000000, '2021-03-20', 'a1b2c3d4-e5f6-4a5b-9c3d-2e1f4a5b6c7d', now());
  END IF;

  IF NOT EXISTS (SELECT 1 FROM businesses WHERE id = 'a9b8c7d6-e5f4-3a2b-1c0d-9e8f7a6b5c4d') THEN
    INSERT INTO businesses (id, name, sector, employee_count, annual_revenue, registration_date, owner_id, created_at)
    VALUES ('a9b8c7d6-e5f4-3a2b-1c0d-9e8f7a6b5c4d', 'Habesha Textiles', 'Manufacturing', 300, 8000000, '2019-11-30', 'a1b2c3d4-e5f6-4a5b-9c3d-2e1f4a5b6c7d', now());
  END IF;

  -- Sample Chamber Members
  IF NOT EXISTS (SELECT 1 FROM chamber_members WHERE id = 'c1d2e3f4-a5b6-7c8d-9e0f-1a2b3c4d5e6f') THEN
    INSERT INTO chamber_members (id, business_id, membership_level, join_date, expiry_date, created_at)
    VALUES ('c1d2e3f4-a5b6-7c8d-9e0f-1a2b3c4d5e6f', 'e1f2a3b4-c5d6-4e5f-8a7b-9c0d1e2f3a4b', 'Gold', '2020-01-15', '2024-01-15', now());
  END IF;

  IF NOT EXISTS (SELECT 1 FROM chamber_members WHERE id = 'd4c3b2a1-e5f6-7a8b-9c0d-1e2f3a4b5c6d') THEN
    INSERT INTO chamber_members (id, business_id, membership_level, join_date, expiry_date, created_at)
    VALUES ('d4c3b2a1-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'f4e3d2c1-b0a9-4c8b-7d6e-5f4e3d2c1b0a', 'Silver', '2021-03-20', '2024-03-20', now());
  END IF;

  IF NOT EXISTS (SELECT 1 FROM chamber_members WHERE id = 'e7f8a9b0-c1d2-3e4f-5a6b-7c8d9e0f1a2b') THEN
    INSERT INTO chamber_members (id, business_id, membership_level, join_date, expiry_date, created_at)
    VALUES ('e7f8a9b0-c1d2-3e4f-5a6b-7c8d9e0f1a2b', 'a9b8c7d6-e5f4-3a2b-1c0d-9e8f7a6b5c4d', 'Platinum', '2019-11-30', '2024-11-30', now());
  END IF;

  -- Sample Government Initiatives
  IF NOT EXISTS (SELECT 1 FROM government_initiatives WHERE id = 'b1a2c3d4-e5f6-4a5b-9c3d-2e1f4a5b6c7d') THEN
    INSERT INTO government_initiatives (id, title, description, start_date, end_date, status, organization_id, created_at)
    VALUES ('b1a2c3d4-e5f6-4a5b-9c3d-2e1f4a5b6c7d', 'Digital Ethiopia 2025', 'National digital transformation initiative to modernize the economy', '2023-01-01', '2025-12-31', 'In Progress', 'b7c8d9e0-f1a2-4b3c-8d4e-5f6a7b8c9d0e', now());
  END IF;

  IF NOT EXISTS (SELECT 1 FROM government_initiatives WHERE id = 'c2b3d4e5-f6a7-4a5b-9c3d-2e1f4a5b6c7d') THEN
    INSERT INTO government_initiatives (id, title, description, start_date, end_date, status, organization_id, created_at)
    VALUES ('c2b3d4e5-f6a7-4a5b-9c3d-2e1f4a5b6c7d', 'SME Growth Program', 'Support program for small and medium enterprises', '2023-06-01', '2024-12-31', 'Active', 'b7c8d9e0-f1a2-4b3c-8d4e-5f6a7b8c9d0e', now());
  END IF;

  IF NOT EXISTS (SELECT 1 FROM government_initiatives WHERE id = 'd3c4e5f6-a7b8-4a5b-9c3d-2e1f4a5b6c7d') THEN
    INSERT INTO government_initiatives (id, title, description, start_date, end_date, status, organization_id, created_at)
    VALUES ('d3c4e5f6-a7b8-4a5b-9c3d-2e1f4a5b6c7d', 'Export Enhancement Initiative', 'Program to boost Ethiopian exports globally', '2023-09-01', '2025-08-31', 'Planning', 'b7c8d9e0-f1a2-4b3c-8d4e-5f6a7b8c9d0e', now());
  END IF;
END $$;