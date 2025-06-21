
import { supabase } from '@/integrations/supabase/client';
import { validateUserAuthentication, logSecurityValidation } from './securityValidation';

export interface AuditLogEntry {
  action: string;
  table_name?: string;
  record_id?: string;
  details?: Record<string, any>;
}

export const logSecurityEvent = async (entry: AuditLogEntry): Promise<void> => {
  try {
    // Enhanced authentication check
    const authResult = await validateUserAuthentication();
    
    const { error } = await supabase
      .from('security_audit_log')
      .insert({
        user_id: authResult.userId || null,
        action: entry.action,
        table_name: entry.table_name,
        record_id: entry.record_id,
        new_values: {
          ...entry.details,
          timestamp: new Date().toISOString(),
          user_agent: navigator.userAgent,
          authenticated: authResult.isAuthenticated,
          url: window.location.href,
          referrer: document.referrer || null
        },
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error('Failed to log security event:', error);
    }
  } catch (error) {
    console.error('Error logging security event:', error);
  }
};

export const logNoteAccess = async (
  noteId: string, 
  action: 'create' | 'read' | 'update' | 'delete'
): Promise<void> => {
  try {
    // Enhanced validation before logging
    const authResult = await validateUserAuthentication();
    
    if (!authResult.isAuthenticated) {
      // Log unauthorized access attempt
      await logSecurityValidation('auth_failure', {
        attempted_action: action,
        note_id: noteId,
        reason: 'Unauthenticated note access attempt'
      });
      return;
    }

    await logSecurityEvent({
      action: `note_${action}`,
      table_name: 'notes',
      record_id: noteId,
      details: { 
        action_type: action, 
        timestamp: new Date().toISOString(),
        user_id: authResult.userId,
        session_info: {
          user_agent: navigator.userAgent,
          url: window.location.href,
          referrer: document.referrer || null
        }
      }
    });
  } catch (error) {
    console.error('Error logging note access:', error);
  }
};

export const logUserActivity = async (
  activity: string,
  metadata?: Record<string, any>
): Promise<void> => {
  try {
    const authResult = await validateUserAuthentication();
    
    await logSecurityEvent({
      action: `user_${activity}`,
      details: {
        ...metadata,
        timestamp: new Date().toISOString(),
        user_id: authResult.userId,
        authenticated: authResult.isAuthenticated
      }
    });
  } catch (error) {
    console.error('Error logging user activity:', error);
  }
};
