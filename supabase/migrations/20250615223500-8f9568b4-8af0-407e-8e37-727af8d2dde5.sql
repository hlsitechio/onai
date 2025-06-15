
-- Step 1: First, let's identify and update any notes without user_id
-- We'll need to assign them to existing users or delete them
-- For safety, let's just delete orphaned notes that can't be assigned to any user

-- Delete notes that have NULL user_id (orphaned notes) - only if they exist
DELETE FROM public.notes WHERE user_id IS NULL;

-- Delete notes_v2 that have NULL user_id (orphaned notes) - only if they exist
DELETE FROM public.notes_v2 WHERE user_id IS NULL;

-- Step 2: Add NOT NULL constraint to user_id column in notes table (if not already set)
DO $$
BEGIN
    -- Check if the column is already NOT NULL
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'notes' 
        AND column_name = 'user_id' 
        AND is_nullable = 'YES'
    ) THEN
        ALTER TABLE public.notes ALTER COLUMN user_id SET NOT NULL;
    END IF;
END $$;

-- Step 3: Add foreign key constraint for notes.user_id (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'notes_user_id_fkey' 
        AND table_name = 'notes'
    ) THEN
        ALTER TABLE public.notes 
        ADD CONSTRAINT notes_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Step 4: Add NOT NULL constraint to user_id column in notes_v2 table (if not already set)
DO $$
BEGIN
    -- Check if the column is already NOT NULL
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'notes_v2' 
        AND column_name = 'user_id' 
        AND is_nullable = 'YES'
    ) THEN
        ALTER TABLE public.notes_v2 ALTER COLUMN user_id SET NOT NULL;
    END IF;
END $$;

-- Step 5: Add foreign key constraint for notes_v2.user_id (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'notes_v2_user_id_fkey' 
        AND table_name = 'notes_v2'
    ) THEN
        ALTER TABLE public.notes_v2 
        ADD CONSTRAINT notes_v2_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Step 6: Add foreign key constraints for note_shares table (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'note_shares_note_id_fkey' 
        AND table_name = 'note_shares'
    ) THEN
        ALTER TABLE public.note_shares 
        ADD CONSTRAINT note_shares_note_id_fkey 
        FOREIGN KEY (note_id) REFERENCES public.notes(id) ON DELETE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'note_shares_shared_by_fkey' 
        AND table_name = 'note_shares'
    ) THEN
        ALTER TABLE public.note_shares 
        ADD CONSTRAINT note_shares_shared_by_fkey 
        FOREIGN KEY (shared_by) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'note_shares_shared_with_fkey' 
        AND table_name = 'note_shares'
    ) THEN
        ALTER TABLE public.note_shares 
        ADD CONSTRAINT note_shares_shared_with_fkey 
        FOREIGN KEY (shared_with) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Step 7: Add foreign key constraints for note_versions table (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'note_versions_note_id_fkey' 
        AND table_name = 'note_versions'
    ) THEN
        ALTER TABLE public.note_versions 
        ADD CONSTRAINT note_versions_note_id_fkey 
        FOREIGN KEY (note_id) REFERENCES public.notes(id) ON DELETE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'note_versions_created_by_fkey' 
        AND table_name = 'note_versions'
    ) THEN
        ALTER TABLE public.note_versions 
        ADD CONSTRAINT note_versions_created_by_fkey 
        FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Step 8: Add foreign key constraints for ai_interactions table (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'ai_interactions_user_id_fkey' 
        AND table_name = 'ai_interactions'
    ) THEN
        ALTER TABLE public.ai_interactions 
        ADD CONSTRAINT ai_interactions_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Step 9: Add foreign key constraints for ai_interactions_v2 table (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'ai_interactions_v2_user_id_fkey' 
        AND table_name = 'ai_interactions_v2'
    ) THEN
        ALTER TABLE public.ai_interactions_v2 
        ADD CONSTRAINT ai_interactions_v2_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'ai_interactions_v2_note_id_fkey' 
        AND table_name = 'ai_interactions_v2'
    ) THEN
        ALTER TABLE public.ai_interactions_v2 
        ADD CONSTRAINT ai_interactions_v2_note_id_fkey 
        FOREIGN KEY (note_id) REFERENCES public.notes(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Step 10: Add foreign key constraints for sync_queue table (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'sync_queue_user_id_fkey' 
        AND table_name = 'sync_queue'
    ) THEN
        ALTER TABLE public.sync_queue 
        ADD CONSTRAINT sync_queue_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Step 11: Add foreign key constraints for user_settings table (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'user_settings_user_id_fkey' 
        AND table_name = 'user_settings'
    ) THEN
        ALTER TABLE public.user_settings 
        ADD CONSTRAINT user_settings_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Step 12: Create storage bucket for note attachments (if not exists)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'note-attachments',
    'note-attachments',
    false,
    10485760,  -- 10MB limit
    ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'text/plain']
) ON CONFLICT (id) DO NOTHING;

-- Step 13: Create RLS policies for the storage bucket (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Users can upload their own files'
    ) THEN
        CREATE POLICY "Users can upload their own files" ON storage.objects
        FOR INSERT TO authenticated
        WITH CHECK (
            bucket_id = 'note-attachments' AND 
            auth.uid()::text = (storage.foldername(name))[1]
        );
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Users can view their own files'
    ) THEN
        CREATE POLICY "Users can view their own files" ON storage.objects
        FOR SELECT TO authenticated
        USING (
            bucket_id = 'note-attachments' AND 
            auth.uid()::text = (storage.foldername(name))[1]
        );
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Users can update their own files'
    ) THEN
        CREATE POLICY "Users can update their own files" ON storage.objects
        FOR UPDATE TO authenticated
        USING (
            bucket_id = 'note-attachments' AND 
            auth.uid()::text = (storage.foldername(name))[1]
        );
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Users can delete their own files'
    ) THEN
        CREATE POLICY "Users can delete their own files" ON storage.objects
        FOR DELETE TO authenticated
        USING (
            bucket_id = 'note-attachments' AND 
            auth.uid()::text = (storage.foldername(name))[1]
        );
    END IF;
END $$;

-- Step 14: Enable RLS on notes table and add policies (if not already present)
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'notes' AND policyname = 'Users can view their own notes'
    ) THEN
        CREATE POLICY "Users can view their own notes" ON public.notes
        FOR SELECT TO authenticated
        USING (auth.uid() = user_id);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'notes' AND policyname = 'Users can insert their own notes'
    ) THEN
        CREATE POLICY "Users can insert their own notes" ON public.notes
        FOR INSERT TO authenticated
        WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'notes' AND policyname = 'Users can update their own notes'
    ) THEN
        CREATE POLICY "Users can update their own notes" ON public.notes
        FOR UPDATE TO authenticated
        USING (auth.uid() = user_id);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'notes' AND policyname = 'Users can delete their own notes'
    ) THEN
        CREATE POLICY "Users can delete their own notes" ON public.notes
        FOR DELETE TO authenticated
        USING (auth.uid() = user_id);
    END IF;
END $$;

-- Step 15: Enable RLS on notes_v2 table and add policies (if not already present)
ALTER TABLE public.notes_v2 ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'notes_v2' AND policyname = 'Users can view their own notes v2'
    ) THEN
        CREATE POLICY "Users can view their own notes v2" ON public.notes_v2
        FOR SELECT TO authenticated
        USING (auth.uid() = user_id OR is_public = true);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'notes_v2' AND policyname = 'Users can insert their own notes v2'
    ) THEN
        CREATE POLICY "Users can insert their own notes v2" ON public.notes_v2
        FOR INSERT TO authenticated
        WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'notes_v2' AND policyname = 'Users can update their own notes v2'
    ) THEN
        CREATE POLICY "Users can update their own notes v2" ON public.notes_v2
        FOR UPDATE TO authenticated
        USING (auth.uid() = user_id);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'notes_v2' AND policyname = 'Users can delete their own notes v2'
    ) THEN
        CREATE POLICY "Users can delete their own notes v2" ON public.notes_v2
        FOR DELETE TO authenticated
        USING (auth.uid() = user_id);
    END IF;
END $$;

-- Step 16: Add indexes for better performance (if not exists)
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON public.notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_v2_user_id ON public.notes_v2(user_id);
CREATE INDEX IF NOT EXISTS idx_note_shares_note_id ON public.note_shares(note_id);
CREATE INDEX IF NOT EXISTS idx_note_versions_note_id ON public.note_versions(note_id);
CREATE INDEX IF NOT EXISTS idx_ai_interactions_user_id ON public.ai_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_interactions_v2_user_id ON public.ai_interactions_v2(user_id);
CREATE INDEX IF NOT EXISTS idx_sync_queue_user_id ON public.sync_queue(user_id);
