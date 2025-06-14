
import { getAllNotesFromSupabase, saveNoteToSupabase } from './supabaseStorage';
import { getAllNotes as getAllLocalNotes } from './notesStorage';

export interface MigrationResult {
  success: boolean;
  migratedCount: number;
  errors: string[];
}

/**
 * Migrate notes from localStorage to Supabase
 */
export const migrateLocalNotesToSupabase = async (): Promise<MigrationResult> => {
  const result: MigrationResult = {
    success: true,
    migratedCount: 0,
    errors: []
  };

  try {
    // Get all local notes
    const localNotes = await getAllLocalNotes();
    const localNoteIds = Object.keys(localNotes);

    if (localNoteIds.length === 0) {
      return result; // No notes to migrate
    }

    // Get existing Supabase notes to avoid duplicates
    const supabaseNotes = await getAllNotesFromSupabase();
    const existingIds = Object.keys(supabaseNotes);

    // Migrate each local note that doesn't exist in Supabase
    for (const noteId of localNoteIds) {
      if (!existingIds.includes(noteId)) {
        try {
          const saveResult = await saveNoteToSupabase(noteId, localNotes[noteId], true);
          if (saveResult.success) {
            result.migratedCount++;
          } else {
            result.errors.push(`Failed to migrate note ${noteId}: ${saveResult.error}`);
          }
        } catch (error) {
          result.errors.push(`Error migrating note ${noteId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    }

    if (result.errors.length > 0) {
      result.success = false;
    }

    console.log(`Migration completed: ${result.migratedCount} notes migrated, ${result.errors.length} errors`);
    return result;
  } catch (error) {
    result.success = false;
    result.errors.push(`Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return result;
  }
};

/**
 * Check if migration is needed
 */
export const isMigrationNeeded = async (): Promise<boolean> => {
  try {
    const localNotes = await getAllLocalNotes();
    const localNoteIds = Object.keys(localNotes);
    
    if (localNoteIds.length === 0) {
      return false; // No local notes to migrate
    }

    const supabaseNotes = await getAllNotesFromSupabase();
    const existingIds = Object.keys(supabaseNotes);

    // Check if any local notes don't exist in Supabase
    return localNoteIds.some(id => !existingIds.includes(id));
  } catch (error) {
    console.error('Error checking migration status:', error);
    return false;
  }
};

/**
 * Backup current notes before migration
 */
export const backupNotesBeforeMigration = async (): Promise<string> => {
  try {
    const localNotes = await getAllLocalNotes();
    const backup = {
      timestamp: new Date().toISOString(),
      notes: localNotes,
      version: '1.0'
    };
    
    const backupString = JSON.stringify(backup, null, 2);
    const backupKey = `backup-${Date.now()}`;
    localStorage.setItem(backupKey, backupString);
    
    return backupKey;
  } catch (error) {
    throw new Error(`Failed to create backup: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
