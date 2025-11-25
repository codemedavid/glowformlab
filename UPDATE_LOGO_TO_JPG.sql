-- Update site_logo in site_settings to use /logo.jpg
-- Run this in Supabase SQL Editor

UPDATE site_settings 
SET value = '/logo.jpg'
WHERE id = 'site_logo';

-- Verify the update
SELECT id, value 
FROM site_settings 
WHERE id = 'site_logo';
