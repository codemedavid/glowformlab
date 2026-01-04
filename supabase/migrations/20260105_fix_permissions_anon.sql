-- ============================================
-- FIX PERMISSIONS FOR ANONYMOUS ADMIN
-- ============================================

DO $$
BEGIN
    -- Grant execute permission to all roles including anon (guest)
    GRANT EXECUTE ON FUNCTION delete_product_cascade(UUID) TO anon, authenticated, service_role;
    
    RAISE NOTICE 'Success: Granted EXECUTE on delete_product_cascade to anon role';
END $$;
