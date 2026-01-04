-- Disable RLS on recommendation_rules to prevent deletion errors
-- This ensures the application can manually clean up rules before deleting products

-- 1. Disable RLS
ALTER TABLE public.recommendation_rules DISABLE ROW LEVEL SECURITY;

-- 2. Grant permissions just in case
GRANT ALL ON TABLE public.recommendation_rules TO anon, authenticated, service_role;
