# Supabase Integration for OneAI Notes

This directory contains the necessary files for integrating your OneAI Notes application with Supabase.

## Setup Instructions

### 1. Create Database Tables

1. Log in to your Supabase dashboard at [https://app.supabase.com](https://app.supabase.com)
2. Navigate to your project: `qrdulwzjgbfgaplazgsh`
3. Go to the SQL Editor
4. Create a new query
5. Paste the contents of `migrations/create_notes_tables.sql`
6. Run the query to create the necessary tables

### 2. Database Schema

The integration creates two main tables:

#### Notes Table
Stores all user notes with the following structure:
- `id` - Unique identifier for each note
- `title` - The title of the note (extracted from content)
- `content` - The full content of the note (encrypted if is_encrypted is true)
- `created_at` - When the note was first created
- `updated_at` - When the note was last updated
- `is_encrypted` - Whether the content is encrypted
- `owner_id` - User ID for when authentication is implemented

#### Shared Notes Table
Stores publicly shared notes with the following structure:
- `id` - Unique identifier for the shared note
- `content` - The content of the shared note (not encrypted)
- `created_at` - When the note was shared
- `expires_at` - When the share link expires
- `views` - Counter for how many times the note has been viewed

### 3. Row Level Security

Basic Row Level Security (RLS) policies are set up for both tables:
- Notes table has a temporary policy allowing all operations until authentication is implemented
- Shared notes table has a policy allowing public read access

## Usage in the Application

The Supabase integration is implemented through:

1. `src/utils/supabaseStorage.ts` - Core storage functions
2. `src/hooks/useSupabaseNotes.ts` - React hook for using Supabase notes

To use Supabase for note storage, update your components to use the `useSupabaseNotes` hook instead of the original `useNoteContent` hook.

## Future Enhancements

1. User authentication
2. More granular RLS policies based on user IDs
3. Real-time synchronization between devices
4. Improved sharing features with access controls
