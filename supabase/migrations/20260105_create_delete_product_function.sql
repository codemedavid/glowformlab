-- Create a secure function to delete products and their dependencies
-- This runs as SECURITY DEFINER to bypass RLS restrictions on related tables

CREATE OR REPLACE FUNCTION delete_product_cascade(target_product_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- 1. Delete from recommendation_rules (both directions)
    DELETE FROM recommendation_rules WHERE product_id = target_product_id;
    DELETE FROM recommendation_rules WHERE recommended_product_id = target_product_id;

    -- 2. Delete from product_variations
    DELETE FROM product_variations WHERE product_id = target_product_id;

    -- 3. Delete the product itself
    DELETE FROM products WHERE id = target_product_id;
END;
$$;

GRANT EXECUTE ON FUNCTION delete_product_cascade(UUID) TO authenticated, service_role;
