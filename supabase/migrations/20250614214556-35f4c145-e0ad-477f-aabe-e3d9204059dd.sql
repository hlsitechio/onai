
-- First, check what RLS policies currently exist on ai_interactions table
-- and drop the problematic one to recreate it with better performance

-- Drop the existing policy that's causing performance issues
DROP POLICY IF EXISTS "Users can view their own AI interactions" ON public.ai_interactions;

-- Create an optimized policy that evaluates auth.uid() once per query instead of per row
CREATE POLICY "Users can view their own AI interactions" 
ON public.ai_interactions 
FOR SELECT 
USING (user_id = (SELECT auth.uid()));

-- If there are other policies for INSERT, UPDATE, DELETE operations, let's optimize those too
-- Drop and recreate INSERT policy if it exists
DROP POLICY IF EXISTS "Users can create their own AI interactions" ON public.ai_interactions;
CREATE POLICY "Users can create their own AI interactions" 
ON public.ai_interactions 
FOR INSERT 
WITH CHECK (user_id = (SELECT auth.uid()));

-- Drop and recreate UPDATE policy if it exists  
DROP POLICY IF EXISTS "Users can update their own AI interactions" ON public.ai_interactions;
CREATE POLICY "Users can update their own AI interactions" 
ON public.ai_interactions 
FOR UPDATE 
USING (user_id = (SELECT auth.uid()));

-- Drop and recreate DELETE policy if it exists
DROP POLICY IF EXISTS "Users can delete their own AI interactions" ON public.ai_interactions;
CREATE POLICY "Users can delete their own AI interactions" 
ON public.ai_interactions 
FOR DELETE 
USING (user_id = (SELECT auth.uid()));
