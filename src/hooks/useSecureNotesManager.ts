
import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  sanitizeInput, 
  checkContentSecurity, 
  checkRateLimit,
  validateUserAuthentication,
  logSecurityValidation,
  validateContentWithDatabase
} from '@/utils/securityValidation';
import { logNoteAccess } from '@/utils/auditLogger';
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

export function useSecureNotesManager() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const saveNoteSecurely = useCallback(async (
    noteId: string, 
    content: string,
    isEncrypted: boolean = false
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    try {
      // Enhanced authentication validation
      const authResult = await validateUserAuthentication();
      if (!authResult.isAuthenticated) {
        await logSecurityValidation('auth_failure', { 
          action: 'save_note',
          note_id: noteId 
        });
        return { 
          success: false, 
          error: authResult.error || "User not authenticated. Please sign in to save notes." 
        };
      }

      // Enhanced rate limiting
      const rateLimitOk = await checkRateLimit('save_note', 30);
      if (!rateLimitOk) {
        await logSecurityValidation('rate_limit_exceeded', { 
          action: 'save_note',
          note_id: noteId 
        });
        return {
          success: false,
          error: 'Rate limit exceeded. Please wait before saving again.'
        };
      }

      // Enhanced content validation and sanitization
      const sanitizedContent = sanitizeInput(content, { 
        maxLength: 1048576, // 1MB
        allowHtml: false,
        strictMode: true 
      });
      
      const securityCheck = checkContentSecurity(sanitizedContent, { maxLength: 1048576 });
      
      if (!securityCheck.isValid) {
        await logSecurityValidation('content_blocked', {
          action: 'save_note',
          note_id: noteId,
          reason: securityCheck.error,
          flags: securityCheck.flags
        });
        return {
          success: false,
          error: securityCheck.error || 'Content validation failed'
        };
      }

      // Additional database-level validation
      const isValidContent = await validateContentWithDatabase(sanitizedContent);
      if (!isValidContent) {
        return {
          success: false,
          error: 'Content failed security validation'
        };
      }

      // Generate a secure title from the content
      const title = sanitizedContent
        .split('\n')[0]
        .replace(/[<>]/g, '') // Remove any remaining angle brackets
        .substring(0, 50)
        .trim() || 'Untitled Note';
      
      const noteData = {
        id: noteId,
        title: sanitizeInput(title, { maxLength: 100, strictMode: true }),
        content: sanitizedContent,
        updated_at: new Date().toISOString(),
        is_encrypted: isEncrypted,
        user_id: authResult.userId!
      };

      // Check if the note already exists
      const { data: existingNote, error: checkError } = await supabase
        .from('notes')
        .select('id')
        .eq('id', noteId)
        .eq('user_id', authResult.userId!)
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
            title: noteData.title,
            content: noteData.content,
            updated_at: noteData.updated_at,
            is_encrypted: noteData.is_encrypted
          })
          .eq('id', noteId)
          .eq('user_id', authResult.userId!);
        
        // Log the update
        await logNoteAccess(noteId, 'update');
      } else {
        // Create new note
        result = await supabase
          .from('notes')
          .insert({
            ...noteData,
            created_at: new Date().toISOString()
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
      
      // Log the error for security monitoring
      await logSecurityValidation('auth_failure', {
        action: 'save_note_error',
        note_id: noteId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error saving note'
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getAllNotesSecurely = useCallback(async (): Promise<Record<string, string>> => {
    try {
      // Enhanced authentication validation
      const authResult = await validateUserAuthentication();
      if (!authResult.isAuthenticated) {
        console.warn("User not authenticated. Cannot retrieve notes.");
        return {};
      }

      // Rate limiting for note retrieval
      const rateLimitOk = await checkRateLimit('get_notes', 100);
      if (!rateLimitOk) {
        console.warn("Rate limit exceeded for note retrieval.");
        return {};
      }

      const { data, error } = await supabase
        .from('notes')
        .select('id, content, is_encrypted')
        .eq('user_id', authResult.userId!)
        .order('updated_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      if (!data || data.length === 0) {
        return {};
      }
      
      // Process notes
      const notesMap: Record<string, string> = {};
      
      for (const note of data) {
        try {
          let content = note.content;
          
          // Additional security check on content
          const securityCheck = checkContentSecurity(content);
          if (!securityCheck.isValid) {
            console.warn(`Security check failed for note ${note.id}:`, securityCheck.error);
            content = 'Note content blocked due to security concerns.';
          }
          
          notesMap[note.id] = content;
          
          // Log note access
          await logNoteAccess(note.id, 'read');
        } catch (processError) {
          console.error(`Error processing note ${note.id}:`, processError);
          // Skip this note if processing fails
        }
      }
      
      return notesMap;
    } catch (error) {
      console.error("Error getting notes securely:", error);
      return {};
    }
  }, []);

  const deleteNoteSecurely = useCallback(async (noteId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Enhanced authentication validation
      const authResult = await validateUserAuthentication();
      if (!authResult.isAuthenticated) {
        return { 
          success: false, 
          error: authResult.error || "User not authenticated. Please sign in to delete notes." 
        };
      }

      // Rate limiting for deletions
      const rateLimitOk = await checkRateLimit('delete_note', 20); // 20 deletions per hour
      if (!rateLimitOk) {
        await logSecurityValidation('rate_limit_exceeded', { 
          action: 'delete_note',
          note_id: noteId 
        });
        return {
          success: false,
          error: 'Rate limit exceeded. Please wait before deleting again.'
        };
      }

      // Verify note ownership before deletion
      const { data: noteCheck, error: checkError } = await supabase
        .from('notes')
        .select('id')
        .eq('id', noteId)
        .eq('user_id', authResult.userId!)
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
        .eq('user_id', authResult.userId!);
      
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
  }, []);

  return {
    saveNoteSecurely,
    getAllNotesSecurely,
    deleteNoteSecurely,
    isLoading
  };
}
