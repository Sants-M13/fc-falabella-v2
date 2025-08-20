-- Seed data for UAT testing
-- This file creates test users for development and testing purposes

-- Note: Direct auth.users insertion requires special handling
-- This is typically done via Supabase Dashboard or Auth API
-- For local development, you can use supabase db seed

-- Create test store if not exists
INSERT INTO public.stores (id, name, max_skus, max_brands, max_inventory)
VALUES ('11111111-1111-1111-1111-111111111111', 'Test Store', 1000, 50, 10000)
ON CONFLICT (id) DO NOTHING;

-- The following is for documentation purposes
-- Actual user creation should be done via:
-- 1. Supabase Dashboard (Auth > Users > Invite)
-- 2. Or via the application's sign-up flow
-- 3. Or via Supabase CLI: supabase auth users create

-- Required test users:
-- admin@example.com / password123 (role: admin)
-- promotora@example.com / password123 (role: promotora, store_id: 11111111-1111-1111-1111-111111111111)