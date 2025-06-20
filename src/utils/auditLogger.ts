
import { supabase } from '@/integrations/supabase/client';

export interface AuditLogEntry {
  action: string;
  table_name?: string;
  record_id?: string;
  details?: Record<string, any>;
}

export const logSecurityEvent = async (entry: AuditLogEntry): Promise<void> => {
  try {
    const { error } = await supabase
      .from('security_audit_log')
      .insert({
        action: entry.action,
        table_name: entry.table_name,
        record_id: entry.record_id,
        new_values: entry.details,
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error('Failed to log security event:', error);
    }
  } catch (error) {
    console.error('Error logging security event:', error);
  }
};

export const logNoteAccess = async (noteId: string, action: 'create' | 'read' | 'update' | 'delete'): Promise<void> => {
  await logSecurityEvent({
    action: action,
    table_name: 'notes',
    record_id: noteId,
    details: { action_type: action, timestamp: new Date().toISOString() }
  });
};
