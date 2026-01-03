-- ============================================
-- Add Tirzepatide 15mg Product with Variations
-- Run this in Supabase SQL Editor
-- Created: 2026-01-03
-- ============================================

-- First, get the Weight Management category ID (handles different possible IDs)
DO $$
DECLARE
    weight_mgmt_category_id TEXT;
    new_product_id UUID;
BEGIN
    -- Find the Weight Management category (case-insensitive search)
    SELECT id::TEXT INTO weight_mgmt_category_id 
    FROM public.categories 
    WHERE LOWER(name) LIKE '%weight%' 
    LIMIT 1;
    
    -- If no weight management category found, use first available category
    IF weight_mgmt_category_id IS NULL THEN
        SELECT id::TEXT INTO weight_mgmt_category_id 
        FROM public.categories 
        WHERE active = true 
        ORDER BY sort_order 
        LIMIT 1;
    END IF;
    
    -- Generate a new UUID for the product
    new_product_id := gen_random_uuid();
    
    -- Insert the Tirzepatide 15mg product
    INSERT INTO public.products (
        id,
        name,
        description,
        category,
        base_price,
        purity_percentage,
        molecular_weight,
        cas_number,
        storage_conditions,
        stock_quantity,
        available,
        featured,
        inclusions
    ) VALUES (
        new_product_id,
        'GFL TRZ (Tirzepatide) - 15MG',
        'What it does: Tirzepatide helps your body feel full longer, reduces appetite, and improves how your body uses insulin. This dual-action GIP and GLP-1 receptor agonist has shown remarkable efficacy in clinical trials for weight management and metabolic health. Laboratory tested for 99%+ purity.',
        weight_mgmt_category_id,
        4500.00,    -- Base price (Vials Only price)
        99.66,
        '4813.45 g/mol',
        '2023788-19-2',
        'Store at -20°C. Protect from light.',
        5,
        true,       -- IMPORTANT: Set to true so it shows on the website
        true,       -- Featured product
        ARRAY['1x 15mg Tirzepatide Vial', 'Certificate of Analysis', 'Storage Guidelines']
    );
    
    -- Insert the "Vials Only" variation
    INSERT INTO public.product_variations (
        product_id,
        name,
        quantity_mg,
        price,
        stock_quantity
    ) VALUES (
        new_product_id,
        'Vials Only',
        15.00,
        4500.00,
        5
    );
    
    -- Insert the "Complete Set" variation
    INSERT INTO public.product_variations (
        product_id,
        name,
        quantity_mg,
        price,
        stock_quantity
    ) VALUES (
        new_product_id,
        'Complete Set',
        15.00,
        5500.00,  -- Higher price includes accessories
        5
    );
    
    RAISE NOTICE 'Successfully created Tirzepatide 15mg product with ID: %', new_product_id;
    RAISE NOTICE 'Category used: %', weight_mgmt_category_id;
    
END $$;

-- Verify the product was created
SELECT 
    p.id,
    p.name,
    p.available,
    p.featured,
    p.base_price,
    c.name as category_name,
    (SELECT COUNT(*) FROM product_variations pv WHERE pv.product_id = p.id) as variation_count
FROM products p
LEFT JOIN categories c ON c.id::TEXT = p.category
WHERE p.name LIKE '%Tirzepatide%' OR p.name LIKE '%TRZ%'
ORDER BY p.created_at DESC
LIMIT 5;

-- Show the variations
SELECT 
    pv.name as variation_name,
    pv.price,
    pv.stock_quantity,
    p.name as product_name
FROM product_variations pv
JOIN products p ON p.id = pv.product_id
WHERE p.name LIKE '%Tirzepatide%' OR p.name LIKE '%TRZ%'
ORDER BY pv.price ASC;
