-- ============================================
-- ENSURE IMAGE URL COLUMN EXISTS
-- Run this script in Supabase SQL Editor to fix
-- "Database column error. Make sure image_url column exists"
-- Created: 2026-01-05
-- ============================================

DO $$
BEGIN
    -- Check if column exists in products table
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'products' 
        AND column_name = 'image_url'
    ) THEN
        -- Add the column if it doesn't exist
        ALTER TABLE public.products ADD COLUMN image_url TEXT;
        RAISE NOTICE 'Added image_url column to products table';
    ELSE
        RAISE NOTICE 'image_url column already exists in products table';
    END IF;
END $$;
