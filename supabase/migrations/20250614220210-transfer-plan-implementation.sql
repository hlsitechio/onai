
-- Ensure we have proper policies for both authenticated users and demo access
-- This migration consolidates the access policies for the notes table

-- First, let's make sure we have the right structure for notes table
ALTER TABLE public.notes 
ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT FALSE;

-- Create index for better performance on demo notes
CREATE INDEX IF NOT EXISTS notes_is_demo_idx ON public.notes (is_demo);
CREATE INDEX IF NOT EXISTS notes_owner_id_is_demo_idx ON public.notes (owner_id, is_demo);

-- Update the consolidated policy to handle both demo and user notes properly
DROP POLICY IF EXISTS "Consolidated read access for notes" ON public.notes;

CREATE POLICY "Enhanced read access for notes" 
ON public.notes 
FOR SELECT 
USING (
  -- Allow access to demo notes
  is_demo = true
  OR 
  -- Allow access to notes with no owner (legacy demo notes)
  owner_id IS NULL 
  OR 
  -- Allow authenticated users to access their own notes
  (auth.uid() IS NOT NULL AND owner_id = auth.uid())
);

-- Create policies for authenticated users to manage their own notes
CREATE POLICY IF NOT EXISTS "Users can create their own notes" 
ON public.notes 
FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  owner_id = auth.uid() AND 
  is_demo = false
);

CREATE POLICY IF NOT EXISTS "Users can update their own notes" 
ON public.notes 
FOR UPDATE 
USING (
  auth.uid() IS NOT NULL AND 
  owner_id = auth.uid()
);

CREATE POLICY IF NOT EXISTS "Users can delete their own notes" 
ON public.notes 
FOR DELETE 
USING (
  auth.uid() IS NOT NULL AND 
  owner_id = auth.uid()
);

-- Insert some demo notes for new users to see functionality
INSERT INTO public.notes (id, title, content, is_demo, created_at, updated_at, is_encrypted) 
VALUES 
  (
    gen_random_uuid(),
    'Welcome to OneAI Notes!', 
    'This is a demo note to showcase the application features. You can:\n\n• Create and edit notes\n• Use AI assistance for writing\n• Organize with tags and search\n• Export and share your work\n\nStart by creating your first note!',
    true,
    now(),
    now(),
    false
  ),
  (
    gen_random_uuid(),
    'AI Writing Assistant', 
    'Try the AI features:\n\n• Ask AI to improve your writing\n• Generate ideas and content\n• Translate text\n• Analyze and summarize\n\nClick the AI button in the toolbar to get started!',
    true,
    now(),
    now(),
    false
  )
ON CONFLICT (id) DO NOTHING;
