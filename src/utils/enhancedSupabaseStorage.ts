
import { StorageOperationResult } from './notesStorage';
import { supabase } from '@/integrations/supabase/client';
import { encryptContent, decryptContent } from './encryptionUtils';
import { sanitizeInput, checkContentSecurity } from './securityValidation';
import { logNoteAccess } from './auditLogger';
import { v4 as uuidv4 } from 'uuid';

export interface SecureNote {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  is_encrypted: boolean;
  user_id?: string;
}

// Enhanced note saving with security validation
export const saveNoteSecurely = async (
  noteId: string, 
  content: string,
  isEncrypted: boolean = true
): Promise<StorageOperationResult> => {
  try {
    // Check user authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { 
        success: false, 
        error: "User not authenticated. Please sign in to save notes." 
      };
    }

    // Validate and sanitize content
    const sanitizedContent = sanitizeInput(content);
    const securityCheck = checkContentSecurity(sanitizedContent);
    
    if (!securityCheck.isValid) {
      return {
        success: false,
        error: securityCheck.error || 'Content validation failed'
      };
    }

    // Generate a title from the content (first line or first few words)
    const title = sanitizedContent
      .split('\n')[0]
      .substring(0, 50)
      .trim() || 'Untitled Note';
    
    // Prepare the content (encrypt if needed)
    const finalContent = isEncrypted ? await encryptContent(sanitizedContent) : sanitizedContent;
    
    // Check if the note already exists
    const { data: existingNote, error: checkError } = await supabase
      .from('notes')
      .select('id')
      .eq('id', noteId)
      .eq('user_id', user.id)
      .maybeSingle();
    
    if (checkError) {
      throw checkError;
    }
    
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
          is_encrypted: isEncrypted
        })
        .eq('id', noteId)
        .eq('user_id', user.id);
      
      // Log the update
      await logNoteAccess(noteId, 'update');
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
          is_encrypted: isEncrypted,
          user_id: user.id
        });
      
      // Log the creation
      await logNoteAccess(noteId, 'create');
    }
    
    if (result.error) {
      throw result.error;
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error saving note securely:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error saving note'
    };
  }
};

// Enhanced note retrieval with security checks
export const getAllNotesSecurely = async (): Promise<Record<string, string>> => {
  try {
    // Check user authentication
    const { data: { user } } = await supabase.auth.getUser();
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
        
        // Log note access
        await logNoteAccess(note.id, 'read');
      } catch (decryptError) {
        console.error(`Error decrypting note ${note.id}:`, decryptError);
        // Skip this note if decryption fails
      }
    }
    
    return notesMap;
  } catch (error) {
    console.error("Error getting notes securely:", error);
    return {};
  }
};

// Enhanced note deletion with security checks
export const deleteNoteSecurely = async (noteId: string): Promise<StorageOperationResult> => {
  try {
    // Check user authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { 
        success: false, 
        error: "User not authenticated. Please sign in to delete notes." 
      };
    }

    // Verify note ownership before deletion
    const { data: noteCheck, error: checkError } = await supabase
      .from('notes')
      .select('id')
      .eq('id', noteId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (checkError) {
      throw checkError;
    }

    if (!noteCheck) {
      return {
        success: false,
        error: "Note not found or you don't have permission to delete it"
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
    
    // Log the deletion
    await logNoteAccess(noteId, 'delete');
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting note securely:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error deleting note'
    };
  }
};
