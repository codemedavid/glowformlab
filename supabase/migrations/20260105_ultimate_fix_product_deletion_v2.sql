-- ============================================
-- ULTIMATE FIX FOR PRODUCT DELETION V2
-- Addresses: Product Variations + Recommendation Rules + Permissions
-- ============================================

-- 1. Create a truly robust deletion function
CREATE OR REPLACE FUNCTION delete_product_cascade(target_product_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER -- Runs with superuser privileges
SET search_path = public
AS $$
BEGIN
    RAISE NOTICE 'Deleting product %', target_product_id;

    -- A. Explicitly delete from recommendation_rules (both directions)
    DELETE FROM recommendation_rules WHERE product_id = target_product_id;
    DELETE FROM recommendation_rules WHERE recommended_product_id = target_product_id;
    
    -- B. Explicitly delete from product_variations
    DELETE FROM product_variations WHERE product_id = target_product_id;

    -- C. Delete the product itself
    DELETE FROM products WHERE id = target_product_id;
    
    RAISE NOTICE 'Product % deleted successfully', target_product_id;
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION delete_product_cascade(UUID) TO authenticated, service_role;

-- 2. Enforce ON DELETE CASCADE for product_variations
DO $$
BEGIN
    -- Drop existing constraint if it exists (by name pattern)
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'product_variations_product_id_fkey' AND table_name = 'product_variations') THEN
        ALTER TABLE public.product_variations DROP CONSTRAINT product_variations_product_id_fkey;
    END IF;

    -- Re-add with CASCADE
    ALTER TABLE public.product_variations
    ADD CONSTRAINT product_variations_product_id_fkey
    FOREIGN KEY (product_id)
    REFERENCES public.products(id)
    ON DELETE CASCADE;
    
    RAISE NOTICE 'Enforced ON DELETE CASCADE on product_variations';
END $$;

-- 3. Enforce ON DELETE CASCADE for recommendation_rules (Double Check)
DO $$
BEGIN
    -- product_id
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'recommendation_rules_product_id_fkey' AND table_name = 'recommendation_rules') THEN
        ALTER TABLE public.recommendation_rules DROP CONSTRAINT recommendation_rules_product_id_fkey;
    END IF;

    ALTER TABLE public.recommendation_rules
    ADD CONSTRAINT recommendation_rules_product_id_fkey
    FOREIGN KEY (product_id)
    REFERENCES public.products(id)
    ON DELETE CASCADE;

    -- recommended_product_id
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'recommendation_rules_recommended_product_id_fkey' AND table_name = 'recommendation_rules') THEN
        ALTER TABLE public.recommendation_rules DROP CONSTRAINT recommendation_rules_recommended_product_id_fkey;
    END IF;

    ALTER TABLE public.recommendation_rules
    ADD CONSTRAINT recommendation_rules_recommended_product_id_fkey
    FOREIGN KEY (recommended_product_id)
    REFERENCES public.products(id)
    ON DELETE CASCADE;
    
    RAISE NOTICE 'Enforced ON DELETE CASCADE on recommendation_rules';
END $$;
