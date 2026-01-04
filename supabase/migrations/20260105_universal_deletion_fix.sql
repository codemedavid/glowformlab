-- ==============================================================================
-- UNIVERSAL DELETION FIX (FINAL)
-- This script fixes the "Foreground Key Violation" by ensuring ALL users 
-- (including logged-in admins) can delete products and their related data.
-- ==============================================================================

BEGIN;

-- 1. DROP EVERYTHING (Clean start)
DROP FUNCTION IF EXISTS public.delete_product_cascade(UUID);

-- 2. RECREATE THE FUNCTION (Security Definer = Bypasses RLS)
-- This function deletes everything safely from the server side.
CREATE OR REPLACE FUNCTION public.delete_product_cascade(target_product_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    DELETE FROM public.recommendation_rules WHERE product_id = target_product_id;
    DELETE FROM public.recommendation_rules WHERE recommended_product_id = target_product_id;
    DELETE FROM public.product_variations WHERE product_id = target_product_id;
    DELETE FROM public.products WHERE id = target_product_id;
END;
$$;

-- 3. GRANT PERMISSIONS TO EVERYONE
GRANT EXECUTE ON FUNCTION public.delete_product_cascade(UUID) TO anon, authenticated, service_role;

-- 4. FIX CONSTRAINTS (Ensure ON DELETE CASCADE exists)
-- This ensures the database automatically cleans up children if the parent is forced deleted.
ALTER TABLE public.product_variations DROP CONSTRAINT IF EXISTS product_variations_product_id_fkey;
ALTER TABLE public.product_variations 
    ADD CONSTRAINT product_variations_product_id_fkey 
    FOREIGN KEY (product_id) 
    REFERENCES public.products(id) 
    ON DELETE CASCADE;

ALTER TABLE public.recommendation_rules DROP CONSTRAINT IF EXISTS recommendation_rules_product_id_fkey;
ALTER TABLE public.recommendation_rules DROP CONSTRAINT IF EXISTS recommendation_rules_recommended_product_id_fkey;

ALTER TABLE public.recommendation_rules 
    ADD CONSTRAINT recommendation_rules_product_id_fkey 
    FOREIGN KEY (product_id) 
    REFERENCES public.products(id) 
    ON DELETE CASCADE;

ALTER TABLE public.recommendation_rules 
    ADD CONSTRAINT recommendation_rules_recommended_product_id_fkey 
    FOREIGN KEY (recommended_product_id) 
    REFERENCES public.products(id) 
    ON DELETE CASCADE;

-- 5. UPDATE RLS POLICIES (THE MISSING PIECE)
-- This allows the frontend "Fallback" deletion to work if the RPC fails.
-- We must allow "authenticated" users (Admins) to delete.

-- Product Variations
ALTER TABLE public.product_variations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable delete for anon" ON public.product_variations;
DROP POLICY IF EXISTS "Enable delete for all" ON public.product_variations;
CREATE POLICY "Enable delete for all" ON public.product_variations FOR DELETE TO public USING (true); 

-- Recommendation Rules
ALTER TABLE public.recommendation_rules ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable delete for anon" ON public.recommendation_rules;
DROP POLICY IF EXISTS "Enable delete for all" ON public.recommendation_rules;
CREATE POLICY "Enable delete for all" ON public.recommendation_rules FOR DELETE TO public USING (true);

-- Products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable delete for anon" ON public.products;
DROP POLICY IF EXISTS "Enable delete for all" ON public.products;
CREATE POLICY "Enable delete for all" ON public.products FOR DELETE TO public USING (true);

COMMIT;
