
-- Insert some sample data into the existing notes table
INSERT INTO public.notes (id, title, content, created_at, updated_at, is_encrypted, owner_id)
VALUES 
  (gen_random_uuid(), 'Today I created a Supabase project.', 'This is my first note about creating a Supabase project. It was quite straightforward and the documentation was helpful.', now(), now(), false, null),
  (gen_random_uuid(), 'I added some data and queried it from Next.js.', 'Learning how to query data from a Next.js application using Supabase client. The integration is seamless.', now(), now(), false, null),
  (gen_random_uuid(), 'It was awesome!', 'Really enjoying the developer experience with Supabase. The real-time features and authentication are particularly impressive.', now(), now(), false, null);

-- Make the data in the table publicly readable by adding an RLS policy
CREATE POLICY "public can read notes"
ON public.notes
FOR SELECT TO anon
USING (owner_id IS NULL);
