
-- Drop the redundant policy that's causing the multiple permissive policies issue
DROP POLICY IF EXISTS "Allow authenticated users to read notes" ON public.notes;

-- The "Consolidated read access for notes" policy should already exist and is the one we want to keep
-- If for some reason it doesn't exist, we'll recreate it
DROP POLICY IF EXISTS "Consolidated read access for notes" ON public.notes;

-- Create the single consolidated policy for SELECT operations
CREATE POLICY "Consolidated read access for notes" 
ON public.notes 
FOR SELECT 
TO authenticated
USING (
  -- Allow access to demo notes (where owner_id is NULL)
  owner_id IS NULL 
  OR 
  -- Allow authenticated users to access their own notes
  owner_id = auth.uid()
);
