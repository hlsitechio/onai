
-- Drop the existing policy to recreate it with better performance
DROP POLICY IF EXISTS "Consolidated read access for notes" ON public.notes;

-- Create the optimized policy that caches auth.uid() result for better performance
CREATE POLICY "Consolidated read access for notes" 
ON public.notes 
FOR SELECT 
USING (
  -- Allow access to demo notes (where owner_id is NULL)
  owner_id IS NULL 
  OR 
  -- Allow authenticated users to access their own notes (optimized with SELECT to cache auth.uid())
  ((SELECT auth.uid()) IS NOT NULL AND owner_id = (SELECT auth.uid()))
);
