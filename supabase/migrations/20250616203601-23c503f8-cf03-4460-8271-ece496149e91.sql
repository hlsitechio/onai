
-- First, ensure all tables have proper RLS policies and constraints (with proper conflict handling)

-- 1. Fix notes table - ensure user_id is NOT NULL and add proper RLS policies
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

-- Enable RLS on notes table
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own notes" ON public.notes;
DROP POLICY IF EXISTS "Users can create their own notes" ON public.notes;
DROP POLICY IF EXISTS "Users can update their own notes" ON public.notes;
DROP POLICY IF EXISTS "Users can delete their own notes" ON public.notes;

-- Create comprehensive RLS policies for notes
CREATE POLICY "Users can view their own notes" 
  ON public.notes 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own notes" 
  ON public.notes 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes" 
  ON public.notes 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes" 
  ON public.notes 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- 2. Fix user_profiles table RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;

CREATE POLICY "Users can view their own profile" 
  ON public.user_profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.user_profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.user_profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- 3. Fix user_settings table RLS and constraints
DO $$
BEGIN
    -- Check if the column is already NOT NULL
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_settings' 
        AND column_name = 'user_id' 
        AND is_nullable = 'YES'
    ) THEN
        ALTER TABLE public.user_settings ALTER COLUMN user_id SET NOT NULL;
    END IF;
END $$;

ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own settings" ON public.user_settings;

CREATE POLICY "Users can manage their own settings" 
  ON public.user_settings 
  FOR ALL 
  USING (auth.uid() = user_id);

-- 4. Fix shared_notes table RLS (public read access)
ALTER TABLE public.shared_notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view shared notes" ON public.shared_notes;

CREATE POLICY "Anyone can view shared notes" 
  ON public.shared_notes 
  FOR SELECT 
  USING (true);

-- 5. Add missing foreign key constraints (only if they don't exist)
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

-- 6. Create/update the handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Insert user profile only if it doesn't exist
  INSERT INTO public.user_profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email)
  )
  ON CONFLICT (id) DO NOTHING;
  
  -- Insert user settings only if it doesn't exist
  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- 7. Create the updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$;

-- 8. Create triggers for new user registration and updated_at
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add updated_at triggers for relevant tables
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
DROP TRIGGER IF EXISTS update_user_settings_updated_at ON public.user_settings;
DROP TRIGGER IF EXISTS update_notes_updated_at ON public.notes;

CREATE TRIGGER update_user_profiles_updated_at 
  BEFORE UPDATE ON public.user_profiles 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at 
  BEFORE UPDATE ON public.user_settings 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_notes_updated_at 
  BEFORE UPDATE ON public.notes 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 9. Add useful indexes for performance
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON public.notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_updated_at ON public.notes(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_shared_notes_expires_at ON public.shared_notes(expires_at);
