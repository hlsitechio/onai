
import { StorageOperationResult } from './notesStorage';
import { supabase } from '@/integrations/supabase/client';
import { encryptContent, decryptContent } from './encryptionUtils';
import { v4 as uuidv4 } from 'uuid';

// Types
export interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  is_encrypted: boolean;
  user_id?: string;
}

// Check if user is authenticated
const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Check if Supabase tables exist and user is authenticated
export const initializeSupabaseSchema = async (): Promise<StorageOperationResult> => {
  try {
    // Check if user is authenticated
    const user = await getCurrentUser();
    if (!user) {
      return { 
        success: false, 
        error: "User not authenticated. Please sign in to access your notes." 
      };
    }

    // Check if the notes table exists by trying to select from it
    const { data, error } = await supabase
      .from('notes')
      .select('id')
      .limit(1);
    
    // If there's no error, the table exists and we're good to go
    if (!error) {
      return { success: true };
    }
    
    // If there was an error, it might be because the table doesn't exist
    console.error("Notes table might not exist:", error);
    
    return { 
      success: false, 
      error: "Notes table not found in Supabase. Please create it in the Supabase dashboard." 
    };
  } catch (err) {
    console.error("Error initializing Supabase schema:", err);
    return { 
      success: false, 
      error: err instanceof Error ? err.message : 'Unknown error initializing Supabase schema'
    };
  }
};

/**
 * Save a note to Supabase
 */
export const saveNoteToSupabase = async (
  noteId: string, 
  content: string,
  isEncrypted: boolean = true
): Promise<StorageOperationResult> => {
  try {
    // Check if user is authenticated
    const user = await getCurrentUser();
    if (!user) {
      return { 
        success: false, 
        error: "User not authenticated. Please sign in to save notes." 
      };
    }

    // Generate a title from the content (first line or first few words)
    const title = content
      .split('\n')[0]
      .substring(0, 50)
      .trim() || 'Untitled Note';
    
    // Prepare the content (encrypt if needed)
    const finalContent = isEncrypted ? await encryptContent(content) : content;
    
    // Check if the note already exists
    const { data: existingNote, error: checkError } = await supabase
      .from('notes')
      .select('id')
      .eq('id', noteId)
      .eq('user_id', user.id)
      .single();
    
    // Insert or update based on existence
    let result;
    if (existingNote) {
      // Update existing note - ensure user_id is always set
      const updateNote: {
        id: string;
        title: string;
        content: string;
        updated_at: string;
        is_encrypted: boolean;
        user_id: string;
      } = {
        id: noteId,
        title,
        content: finalContent,
        updated_at: new Date().toISOString(),
        is_encrypted: isEncrypted,
        user_id: user.id // Always ensure user_id is set
      };
      
      result = await supabase
        .from('notes')
        .update(updateNote)
        .eq('id', noteId)
        .eq('user_id', user.id);
    } else {
      // Create new note - ensure all required fields including user_id
      const newNote: {
        id: string;
        title: string;
        content: string;
        created_at: string;
        updated_at: string;
        is_encrypted: boolean;
        user_id: string;
      } = {
        id: noteId,
        title,
        content: finalContent,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_encrypted: isEncrypted,
        user_id: user.id // Always ensure user_id is set
      };
      
      result = await supabase
        .from('notes')
        .insert(newNote);
    }
    
    if (result.error) {
      throw result.error;
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error saving note to Supabase:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error saving to Supabase'
    };
  }
};

/**
 * Get all notes from Supabase for the current user
 */
export const getAllNotesFromSupabase = async (): Promise<Record<string, string>> => {
  try {
    // Check if user is authenticated
    const user = await getCurrentUser();
    if (!user) {
      console.warn("User not authenticated. Cannot retrieve notes.");
      return {};
    }

    const { data, error } = await supabase
      .from('notes')
      .select('id, content, is_encrypted')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    if (!data || data.length === 0) {
      return {};
    }
    
    // Process notes and decrypt if needed
    const notesMap: Record<string, string> = {};
    
    for (const note of data) {
      try {
        const content = note.is_encrypted 
          ? await decryptContent(note.content)
          : note.content;
        
        notesMap[note.id] = content;
      } catch (decryptError) {
        console.error(`Error decrypting note ${note.id}:`, decryptError);
        // Skip this note if decryption fails
      }
    }
    
    return notesMap;
  } catch (error) {
    console.error("Error getting notes from Supabase:", error);
    // Return empty object on error
    return {};
  }
};

/**
 * Delete a note from Supabase
 */
export const deleteNoteFromSupabase = async (noteId: string): Promise<StorageOperationResult> => {
  try {
    // Check if user is authenticated
    const user = await getCurrentUser();
    if (!user) {
      return { 
        success: false, 
        error: "User not authenticated. Please sign in to delete notes." 
      };
    }

    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', noteId)
      .eq('user_id', user.id);
    
    if (error) {
      throw error;
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting note from Supabase:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error deleting from Supabase'
    };
  }
};

/**
 * Share a note via Supabase
 */
export const shareNoteViaSupabase = async (
  content: string,
  service: 'onedrive' | 'googledrive' | 'device' | 'link' = 'link'
): Promise<StorageOperationResult & { shareUrl?: string }> => {
  try {
    // For link sharing, we create a public shareable note
    if (service === 'link') {
      // Generate a unique share ID
      const shareId = uuidv4();
      
      // Save as a public shared note (unencrypted for easier access)
      const { error } = await supabase
        .from('shared_notes')
        .insert({
          id: shareId,
          content,
          created_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days expiry
        });
      
      if (error) {
        throw error;
      }
      
      // Create a shareable URL
      const shareUrl = `${window.location.origin}/shared/${shareId}`;
      
      return {
        success: true,
        shareUrl
      };
    }
    
    // For device download, this is handled by the existing implementation
    if (service === 'device') {
      return {
        success: true,
        shareUrl: '' // This will be ignored as the download happens directly
      };
    }
    
    // For cloud services, we'd implement OAuth flows
    // This is a placeholder for future implementation
    return {
      success: false,
      error: `Sharing to ${service} is not yet implemented`
    };
  } catch (error) {
    console.error("Error sharing note via Supabase:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error sharing via Supabase'
    };
  }
};

/**
 * Get a shared note by ID
 */
export const getSharedNoteById = async (shareId: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('shared_notes')
      .select('content, expires_at')
      .eq('id', shareId)
      .single();
    
    if (error) {
      throw error;
    }
    
    // Check if the note has expired
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      throw new Error('Shared note has expired');
    }
    
    return data.content;
  } catch (error) {
    console.error("Error getting shared note:", error);
    return null;
  }
};

/**
 * Clean up notes with missing user_id (migration helper)
 */
export const cleanupOrphanedNotes = async (): Promise<StorageOperationResult> => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { 
        success: false, 
        error: "User not authenticated." 
      };
    }

    // Update any notes without user_id to belong to current user
    // This is a migration helper function
    const { error } = await supabase
      .from('notes')
      .update({ user_id: user.id })
      .is('user_id', null);
    
    if (error) {
      console.error("Error cleaning up orphaned notes:", error);
      return { 
        success: false, 
        error: error.message 
      };
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error in cleanup function:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error during cleanup'
    };
  }
};
