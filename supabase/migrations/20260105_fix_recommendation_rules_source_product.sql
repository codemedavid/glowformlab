-- ============================================
-- FIX RECOMMENDATION RULES SOURCE PRODUCT FK
-- Run this script in Supabase SQL Editor
-- Fixes "violates foreign key constraint recommendation_rules_product_id_fkey"
-- Created: 2026-01-05
-- ============================================

DO $$
BEGIN
    -- 1. Fix the specific constraint reported in the NEW error
    -- Constraint name: recommendation_rules_product_id_fkey
    IF EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'recommendation_rules_product_id_fkey'
        AND table_name = 'recommendation_rules'
    ) THEN
        RAISE NOTICE 'Fixing recommendation_rules_product_id_fkey...';
        
        ALTER TABLE public.recommendation_rules 
        DROP CONSTRAINT recommendation_rules_product_id_fkey;
        
        ALTER TABLE public.recommendation_rules 
        ADD CONSTRAINT recommendation_rules_product_id_fkey 
        FOREIGN KEY (product_id) 
        REFERENCES public.products(id) 
        ON DELETE CASCADE;
        
        RAISE NOTICE '✅ constraint recommendation_rules_product_id_fkey updated to ON DELETE CASCADE';
    ELSE
        RAISE NOTICE '⚠️ Constraint recommendation_rules_product_id_fkey not found. It might use a different name.';
        
        -- Fallback: try to find ANY constraint on product_id column
        DECLARE
            r RECORD;
        BEGIN
            FOR r IN 
                SELECT tc.constraint_name
                FROM information_schema.table_constraints AS tc
                JOIN information_schema.key_column_usage AS kcu
                  ON tc.constraint_name = kcu.constraint_name
                WHERE tc.table_name = 'recommendation_rules'
                AND kcu.column_name = 'product_id'
                AND tc.constraint_type = 'FOREIGN KEY'
            LOOP
                RAISE NOTICE 'Found alternative constraint on product_id: %', r.constraint_name;
                EXECUTE 'ALTER TABLE public.recommendation_rules DROP CONSTRAINT ' || r.constraint_name;
                EXECUTE 'ALTER TABLE public.recommendation_rules ADD CONSTRAINT ' || r.constraint_name || ' FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE';
                RAISE NOTICE '✅ Fixed alternative constraint %', r.constraint_name;
            END LOOP;
        END;
    END IF;

END $$;
