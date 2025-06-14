
-- First, drop the existing overlapping policies
DROP POLICY IF EXISTS "Allow all operations for now" ON public.notes;
DROP POLICY IF EXISTS "Public can read demo notes" ON public.notes;
DROP POLICY IF EXISTS "public can read notes" ON public.notes;

-- Create a single consolidated policy for SELECT operations
CREATE POLICY "Consolidated read access for notes" 
ON public.notes 
FOR SELECT 
USING (
  -- Allow access to demo notes (where owner_id is NULL)
  owner_id IS NULL 
  OR 
  -- Allow authenticated users to access their own notes
  (auth.uid() IS NOT NULL AND owner_id = auth.uid())
);

-- Keep the existing policies for other operations (INSERT, UPDATE, DELETE) if they exist
-- but make sure they're not overlapping for the same actions
