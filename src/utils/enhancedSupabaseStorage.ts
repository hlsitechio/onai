
import { supabase } from '@/integrations/supabase/client';
import { encryptContent, decryptContent } from './encryptionUtils';

export interface StorageOperationResult {
  success: boolean;
  error?: string;
}

/**
 * Save a note securely to Supabase with enhanced error handling
 */
export const saveNoteSecurely = async (
  noteId: string, 
  content: string,
  isEncrypted: boolean = true
): Promise<StorageOperationResult> => {
  try {
    console.log('enhancedSupabaseStorage: Starting save operation for note:', noteId);
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    console.log('enhancedSupabaseStorage: Auth check result:', { user: user?.id, authError });
    
    if (authError || !user) {
      console.error('enhancedSupabaseStorage: Authentication failed:', authError);
      return { 
        success: false, 
        error: "User not authenticated. Please sign in to save notes." 
      };
    }

    // Generate a title from the content
    const title = content
      .split('\n')[0]
      .substring(0, 50)
      .trim() || 'Untitled Note';
    
    // Prepare the content (encrypt if needed)
    const finalContent = isEncrypted ? await encryptContent(content) : content;
    console.log('enhancedSupabaseStorage: Content prepared, encrypted:', isEncrypted);
    
    // Check if the note already exists
    const { data: existingNote, error: checkError } = await supabase
      .from('notes')
      .select('id')
      .eq('id', noteId)
      .eq('user_id', user.id)
      .maybeSingle();
    
    console.log('enhancedSupabaseStorage: Existing note check:', { existingNote, checkError });
    
    let result;
    if (existingNote) {
      console.log('enhancedSupabaseStorage: Updating existing note');
      // Update existing note
      result = await supabase
        .from('notes')
        .update({
          title,
          content: finalContent,
          updated_at: new Date().toISOString(),
          is_encrypted: isEncrypted,
          user_id: user.id
        })
        .eq('id', noteId)
        .eq('user_id', user.id);
    } else {
      console.log('enhancedSupabaseStorage: Creating new note');
      // Create new note
      result = await supabase
        .from('notes')
        .insert({
          id: noteId,
          title,
          content: finalContent,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_encrypted: isEncrypted,
          user_id: user.id
        });
    }
    
    console.log('enhancedSupabaseStorage: Database operation result:', result);
    
    if (result.error) {
      console.error('enhancedSupabaseStorage: Database error:', result.error);
      throw result.error;
    }
    
    console.log('enhancedSupabaseStorage: Save operation completed successfully');
    return { success: true };
  } catch (error) {
    console.error('enhancedSupabaseStorage: Error saving note:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error saving to Supabase'
    };
  }
};

/**
 * Get all notes from Supabase for the current user
 */
export const getAllNotesSecurely = async (): Promise<Record<string, string>> => {
  try {
    console.log('enhancedSupabaseStorage: Getting all notes');
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    console.log('enhancedSupabaseStorage: Auth check for get all notes:', { user: user?.id, authError });
    
    if (authError || !user) {
      console.warn('enhancedSupabaseStorage: User not authenticated for getAllNotes');
      return {};
    }

    const { data, error } = await supabase
      .from('notes')
      .select('id, content, is_encrypted')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });
    
    console.log('enhancedSupabaseStorage: Database query result:', { data: data?.length, error });
    
    if (error) {
      console.error('enhancedSupabaseStorage: Error fetching notes:', error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.log('enhancedSupabaseStorage: No notes found');
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
        console.error(`enhancedSupabaseStorage: Error decrypting note ${note.id}:`, decryptError);
        // Skip this note if decryption fails
      }
    }
    
    console.log('enhancedSupabaseStorage: Successfully processed notes:', Object.keys(notesMap).length);
    return notesMap;
  } catch (error) {
    console.error('enhancedSupabaseStorage: Error getting notes:', error);
    return {};
  }
};

/**
 * Delete a note from Supabase
 */
export const deleteNoteSecurely = async (noteId: string): Promise<StorageOperationResult> => {
  try {
    console.log('enhancedSupabaseStorage: Deleting note:', noteId);
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    console.log('enhancedSupabaseStorage: Auth check for delete:', { user: user?.id, authError });
    
    if (authError || !user) {
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
    
    console.log('enhancedSupabaseStorage: Delete operation result:', { error });
    
    if (error) {
      throw error;
    }
    
    return { success: true };
  } catch (error) {
    console.error('enhancedSupabaseStorage: Error deleting note:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error deleting from Supabase'
    };
  }
};
