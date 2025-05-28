
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
  owner_id?: string; // Will be used when auth is implemented
}

// Check if Supabase tables exist, create them if they don't
export const initializeSupabaseSchema = async (): Promise<StorageOperationResult> => {
  try {
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
 * Save a note to Supabase with proper encryption handling
 */
export const saveNoteToSupabase = async (
  noteId: string, 
  content: string,
  isEncrypted: boolean = true
): Promise<StorageOperationResult> => {
  try {
    // Generate a title from the content (first line or first few words)
    const title = content
      .split('\n')[0]
      .substring(0, 50)
      .trim() || 'Untitled Note';
    
    // Prepare the content (encrypt if needed and content is substantial)
    let finalContent = content;
    let actuallyEncrypted = false;
    
    // Encryption permanently disabled - always save as plain text
    finalContent = content;
    actuallyEncrypted = false;
    
    // Check if the note already exists
    const { data: existingNote, error: checkError } = await supabase
      .from('notes')
      .select('id')
      .eq('id', noteId)
      .single();
    
    // Insert or update based on existence
    let result;
    if (existingNote) {
      // Update existing note
      result = await supabase
        .from('notes')
        .update({
          title,
          content: finalContent,
          updated_at: new Date().toISOString(),
          is_encrypted: actuallyEncrypted
        })
        .eq('id', noteId);
    } else {
      // Create new note
      result = await supabase
        .from('notes')
        .insert({
          id: noteId,
          title,
          content: finalContent,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_encrypted: actuallyEncrypted
        });
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
 * Get all notes from Supabase with proper decryption
 */
export const getAllNotesFromSupabase = async (): Promise<Record<string, string>> => {
  try {
    const { data, error } = await supabase
      .from('notes')
      .select('id, content, is_encrypted')
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
        let content = note.content;
        
        // Handle decryption based on the is_encrypted flag and content format
        if (note.is_encrypted || content.startsWith('ENC:')) {
          content = await decryptContent(content);
        }
        
        // Only include notes with valid content
        if (content && typeof content === 'string') {
          notesMap[note.id] = content;
        }
      } catch (decryptError) {
        console.error(`Error decrypting note ${note.id}:`, decryptError);
        // Include the note with a warning instead of skipping
        notesMap[note.id] = `[Error: Could not decrypt note - ${decryptError.message}]`;
      }
    }
    
    return notesMap;
  } catch (error) {
    console.error("Error getting notes from Supabase:", error);
    return {};
  }
};

/**
 * Delete a note from Supabase
 */
export const deleteNoteFromSupabase = async (noteId: string): Promise<StorageOperationResult> => {
  try {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', noteId);
    
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
        shareUrl: ''
      };
    }
    
    // For cloud services, we'd implement OAuth flows
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
