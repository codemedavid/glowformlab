-- Fix product deletion by ensuring recommendation rules are deleted when a product is deleted
-- This migration updates the foreign key constraints to use ON DELETE CASCADE

DO $$
BEGIN
    -- 1. Drop existing constraints if they exist
    -- We try to drop both potential namings to be safe, though usually they follow specific patterns
    
    -- Drop product_id fk
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'recommendation_rules_product_id_fkey' 
        AND table_name = 'recommendation_rules'
    ) THEN
        ALTER TABLE public.recommendation_rules DROP CONSTRAINT recommendation_rules_product_id_fkey;
    END IF;

    -- Drop recommended_product_id fk
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'recommendation_rules_recommended_product_id_fkey' 
        AND table_name = 'recommendation_rules'
    ) THEN
        ALTER TABLE public.recommendation_rules DROP CONSTRAINT recommendation_rules_recommended_product_id_fkey;
    END IF;

    -- 2. Add constraints back with ON DELETE CASCADE
    
    -- product_id
    ALTER TABLE public.recommendation_rules
    ADD CONSTRAINT recommendation_rules_product_id_fkey
    FOREIGN KEY (product_id)
    REFERENCES public.products(id)
    ON DELETE CASCADE;

    -- recommended_product_id
    ALTER TABLE public.recommendation_rules
    ADD CONSTRAINT recommendation_rules_recommended_product_id_fkey
    FOREIGN KEY (recommended_product_id)
    REFERENCES public.products(id)
    ON DELETE CASCADE;

    RAISE NOTICE 'Constraints updated successfully to ON DELETE CASCADE';

END $$;
