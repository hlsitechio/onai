
-- Insert some sample data into the existing notes table
INSERT INTO public.notes (id, title, content, created_at, updated_at, is_encrypted, owner_id)
VALUES 
  (gen_random_uuid(), 'Welcome to OneAI Notes', 'This is your first note! You can start writing here and your content will be automatically saved.', now(), now(), false, null),
  (gen_random_uuid(), 'Getting Started Guide', 'Here are some tips to get you started:

1. **Auto-save**: Your notes are automatically saved as you type
2. **Formatting**: Use the toolbar to format your text
3. **AI Features**: Select text to see AI enhancement options
4. **Sharing**: Use the share button to create shareable links
5. **Focus Mode**: Toggle focus mode for distraction-free writing

Enjoy using OneAI Notes!', now(), now(), false, null),
  (gen_random_uuid(), 'Sample Note with Rich Content', '# This is a heading

You can create **bold text**, *italic text*, and even add links.

## Features to explore:
- Rich text editing
- Real-time saving
- Cloud synchronization
- AI-powered enhancements

Try selecting this text to see the AI options!', now(), now(), false, null);

-- Ensure RLS is enabled (it should already be enabled)
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- Add a policy for public reading of notes without owner_id (sample/demo notes)
-- First drop the policy if it exists, then create it
DROP POLICY IF EXISTS "Public can read demo notes" ON public.notes;
CREATE POLICY "Public can read demo notes" 
ON public.notes 
FOR SELECT 
USING (owner_id IS NULL);
