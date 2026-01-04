-- ============================================
-- FIX RECOMMENDATION RULES FOREIGN KEY
-- Run this script in Supabase SQL Editor to fix
-- "violates foreign key constraint recommendation_rules_recommended_product_id_fkey"
-- Created: 2026-01-05
-- ============================================

DO $$
BEGIN
    -- 1. Fix the specific constraint reported in the error
    IF EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'recommendation_rules_recommended_product_id_fkey'
        AND table_name = 'recommendation_rules'
    ) THEN
        RAISE NOTICE 'Fixing recommendation_rules_recommended_product_id_fkey...';
        
        ALTER TABLE public.recommendation_rules 
        DROP CONSTRAINT recommendation_rules_recommended_product_id_fkey;
        
        ALTER TABLE public.recommendation_rules 
        ADD CONSTRAINT recommendation_rules_recommended_product_id_fkey 
        FOREIGN KEY (recommended_product_id) 
        REFERENCES public.products(id) 
        ON DELETE CASCADE;
        
        RAISE NOTICE '✅ constraint updated to ON DELETE CASCADE';
    ELSE
        RAISE NOTICE '⚠️ Constraint recommendation_rules_recommended_product_id_fkey not found. It might have a different name or the table is missing.';
    END IF;

    -- 2. Also check specifically for 'cart_items' as that is another common blocker
    IF EXISTS (
        SELECT 1 
        FROM information_schema.tables 
        WHERE table_name = 'cart_items'
    ) THEN
        -- Try to find any FK to products in cart_items
        -- This is a "best effort" cleanup for cart_items
        DECLARE
            r RECORD;
        BEGIN
            FOR r IN 
                SELECT constraint_name 
                FROM information_schema.key_column_usage 
                WHERE table_name = 'cart_items' 
                AND table_schema = 'public' 
                AND column_name = 'product_id' -- common column name
            LOOP
                EXECUTE 'ALTER TABLE public.cart_items DROP CONSTRAINT ' || r.constraint_name;
                EXECUTE 'ALTER TABLE public.cart_items ADD CONSTRAINT ' || r.constraint_name || ' FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE';
                RAISE NOTICE '✅ Updated cart_items constraint %', r.constraint_name;
            END LOOP;
        END;
    END IF;

END $$;
