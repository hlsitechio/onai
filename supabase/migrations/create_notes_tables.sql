-- Create the notes table
CREATE TABLE IF NOT EXISTS public.notes (
    id UUID PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_encrypted BOOLEAN NOT NULL DEFAULT TRUE,
    owner_id UUID DEFAULT NULL -- Will be used with auth
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS notes_owner_id_idx ON public.notes (owner_id);
CREATE INDEX IF NOT EXISTS notes_updated_at_idx ON public.notes (updated_at DESC);

-- Create shared notes table for public sharing
CREATE TABLE IF NOT EXISTS public.shared_notes (
    id UUID PRIMARY KEY,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    views INTEGER DEFAULT 0
);

-- Set up RLS (Row Level Security)
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- Create policies (these will be used when auth is implemented)
-- For now we'll use a simple policy that allows all operations
CREATE POLICY "Allow all operations for now" 
    ON public.notes FOR ALL
    USING (true)
    WITH CHECK (true);

-- Shared notes should be publicly accessible 
ALTER TABLE public.shared_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Shared notes are readable by anyone"
    ON public.shared_notes FOR SELECT
    USING (true);
