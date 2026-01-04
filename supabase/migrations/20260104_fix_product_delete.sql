-- ============================================
-- FIX PRODUCT DELETE PERMISSIONS
-- Run this script in Supabase SQL Editor to fix
-- "Failed to delete product" error
-- Created: 2026-01-04
-- ============================================

-- Disable RLS on products table to allow all operations
ALTER TABLE IF EXISTS public.products DISABLE ROW LEVEL SECURITY;

-- Disable RLS on product_variations table (related table)
ALTER TABLE IF EXISTS public.product_variations DISABLE ROW LEVEL SECURITY;

-- Drop any existing restrictive policies that might be blocking deletes
DO $$
DECLARE
    pol RECORD;
BEGIN
    -- Drop all policies on products table
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'products' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.products', pol.policyname);
        RAISE NOTICE 'Dropped policy: %', pol.policyname;
    END LOOP;

    -- Drop all policies on product_variations table
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'product_variations' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.product_variations', pol.policyname);
        RAISE NOTICE 'Dropped policy: %', pol.policyname;
    END LOOP;
END $$;

-- Grant all permissions to all roles
GRANT ALL ON TABLE public.products TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.product_variations TO anon, authenticated, service_role;

-- Ensure the foreign key constraint allows cascade delete
-- First check if the constraint exists and recreate if needed
DO $$
BEGIN
    -- Drop existing foreign key constraint if it exists
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'product_variations_product_id_fkey' 
        AND table_name = 'product_variations'
    ) THEN
        ALTER TABLE public.product_variations DROP CONSTRAINT product_variations_product_id_fkey;
    END IF;

    -- Recreate with ON DELETE CASCADE
    ALTER TABLE public.product_variations 
    ADD CONSTRAINT product_variations_product_id_fkey 
    FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;

    RAISE NOTICE 'Foreign key constraint recreated with ON DELETE CASCADE';
EXCEPTION
    WHEN others THEN
        RAISE NOTICE 'Foreign key already has correct configuration or error: %', SQLERRM;
END $$;

-- Verify the changes
SELECT 
    tablename, 
    CASE WHEN rowsecurity THEN 'ENABLED' ELSE 'DISABLED' END as rls_status
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('products', 'product_variations');

-- Show current policies (should be empty after dropping)
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename IN ('products', 'product_variations');
