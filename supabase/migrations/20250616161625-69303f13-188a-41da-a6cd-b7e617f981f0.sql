
-- Remove Vercel-related tables and their data
DROP TABLE IF EXISTS public.deploy_hook_logs CASCADE;
DROP TABLE IF EXISTS public.deploy_hooks CASCADE;
DROP TABLE IF EXISTS public.deployment_analytics CASCADE;
DROP TABLE IF EXISTS public.deployment_logs CASCADE;
DROP TABLE IF EXISTS public.vercel_projects CASCADE;

-- Remove any functions related to Vercel (if they exist)
DROP FUNCTION IF EXISTS public.handle_vercel_webhook() CASCADE;
DROP FUNCTION IF EXISTS public.update_deployment_status() CASCADE;
