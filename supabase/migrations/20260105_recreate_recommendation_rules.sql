-- ============================================
-- RECREATE RECOMMENDATION RULES TABLE
-- Run this script in Supabase SQL Editor
-- This deletes the problematic table and creates a fresh verified version
-- ============================================

-- 1. Drop the table and all its dependencies
DROP TABLE IF EXISTS public.recommendation_rules CASCADE;

-- 2. Recreate the table with correct constraints
CREATE TABLE public.recommendation_rules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID NOT NULL,
    recommended_product_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure both Foreign Keys delete automatically when a product is deleted
    CONSTRAINT recommendation_rules_product_id_fkey 
        FOREIGN KEY (product_id) 
        REFERENCES public.products(id) 
        ON DELETE CASCADE,
        
    CONSTRAINT recommendation_rules_recommended_product_id_fkey 
        FOREIGN KEY (recommended_product_id) 
        REFERENCES public.products(id) 
        ON DELETE CASCADE
);

-- 3. Add Permissions (adjust if needed)
ALTER TABLE public.recommendation_rules DISABLE ROW LEVEL SECURITY;
GRANT ALL ON TABLE public.recommendation_rules TO anon, authenticated, service_role;

-- 4. Create Indexes for performance
CREATE INDEX idx_recommendation_rules_product_id ON public.recommendation_rules(product_id);
CREATE INDEX idx_recommendation_rules_recommended_product_id ON public.recommendation_rules(recommended_product_id);

RAISE NOTICE '✅ Table recommendation_rules recreated successfully';
