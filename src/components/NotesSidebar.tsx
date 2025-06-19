
import React, { useState, useEffect } from 'react';
import { useNotesManager } from '@/hooks/useNotesManager.tsx';
import { useNotesImportExport } from "@/utils/notesImportExport";
import ShareNoteDrawer from './notes/ShareNoteDrawer';
import KeyboardShortcuts from './notes/KeyboardShortcuts';
import NotesActions from './notes/NotesActions';
import NotesSidebarContainer from './notes/NotesSidebarContainer';
import SidebarHeader from './notes/SidebarHeader';
import SaveNotesSection from './notes/SaveNotesSection';
import NotesContent from './notes/NotesContent';

interface NotesSidebarProps {
  currentContent: string;
  onLoadNote: (content: string) => void;
  onSave: () => void;
  onDeleteNote: (noteId: string) => Promise<boolean>;
  editorHeight: number;
  allNotes: Record<string, string>;
  onCreateNew: () => void;
  onImportNotes?: (importedNotes: Record<string, string>) => Promise<boolean>;
}

const NotesSidebar: React.FC<NotesSidebarProps> = ({
  currentContent,
  onLoadNote,
  onSave,
  onDeleteNote,
  editorHeight,
  allNotes,
  onCreateNew,
  onImportNotes
}) => {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  const {
    notes,
    currentNote,
    setCurrentNote,
    loading,
    createNote,
    saveNote,
    deleteNote,
    loadNotes,
  } = useNotesManager();

  // Reload notes when component mounts or when save is triggered
  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  // Refresh notes list when a save operation happens
  const handleSaveWithRefresh = async () => {
    await onSave();
    // Refresh the notes list after save
    setTimeout(() => {
      loadNotes();
    }, 500); // Small delay to ensure the save is complete
  };

  // Convert modern notes to legacy format for compatibility
  const modernNotesAsLegacy: Record<string, string> = {};
  notes.forEach(note => {
    modernNotesAsLegacy[note.id] = note.content;
  });

  const formatNoteId = (noteId: string): string => {
    const note = notes.find(n => n.id === noteId);
    return note?.title || 'Untitled Note';
  };

  const handleLoadNoteModern = (noteId: string) => {
    const note = notes.find(n => n.id === noteId);
    if (note) {
      setCurrentNote(note);
      onLoadNote(note.content);
    }
  };

  const handleDeleteNoteModern = async (noteId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const success = await deleteNote(noteId);
    if (success) {
      // Refresh the notes list after deletion
      loadNotes();
    }
    return success;
  };

  const handleCreateNewModern = async () => {
    const newNote = await createNote();
    if (newNote) {
      setCurrentNote(newNote);
      onLoadNote(newNote.content);
      // Refresh the notes list after creation
      loadNotes();
    }
  };

  const handleOpenShare = (noteId: string | null) => {
    setSelectedNoteId(noteId);
    setIsShareOpen(true);
  };

  const handleShareNote = async (service: 'onedrive' | 'googledrive' | 'device' | 'link') => {
    const content = selectedNoteId ? 
      notes.find(n => n.id === selectedNoteId)?.content || '' : 
      currentContent;
    const title = selectedNoteId ? formatNoteId(selectedNoteId) : 'Current Note';

    const {
      shareToOneDrive,
      shareToGoogleDrive,
      shareToDevice,
      createShareLink
    } = await import("@/utils/shareUtils");

    let result;
    switch (service) {
      case 'onedrive':
        result = await shareToOneDrive(content, title);
        break;
      case 'googledrive':
        result = await shareToGoogleDrive(content, title);
        break;
      case 'device':
        result = await shareToDevice(content, title);
        break;
      case 'link':
        result = await createShareLink(content);
        break;
      default:
        result = {
          success: false,
          error: 'Unknown share service'
        };
    }

    setIsShareOpen(false);
    return result.shareUrl || "";
  };

  const {
    handleExportNotes,
    handleImportNotes
  } = useNotesImportExport();

  const handleImportNotesWithMerge = () => {
    handleImportNotes(async importedNotes => {
      try {
        if (onImportNotes) {
          const success = await onImportNotes(importedNotes);
          if (!success) {
            console.error('Failed to import notes via parent component');
          }
        } else {
          console.log('Imported notes (no parent handler):', importedNotes);
        }
        // Refresh notes list after import
        loadNotes();
      } catch (error) {
        console.error('Error during import merge:', error);
      }
    });
  };

  const handleSortNotes = () => {
    // Implementation for sorting
  };

  const handleFilterNotes = () => {
    // Implementation for filtering
  };

  return (
    <NotesSidebarContainer>
      <SidebarHeader
        onCreateNew={handleCreateNewModern}
        isSearching={isSearching}
        onSearchToggle={() => setIsSearching(!isSearching)}
        onShowShortcuts={() => setIsShortcutsOpen(true)}
        onSortNotes={handleSortNotes}
        onFilterNotes={handleFilterNotes}
        onExportNotes={() => handleExportNotes(modernNotesAsLegacy)}
        onImportNotes={handleImportNotesWithMerge}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="flex-1 overflow-auto custom-scrollbar bg-[#03010a]">
        <SaveNotesSection onSave={handleSaveWithRefresh} />
        
        <div className="px-4 pb-4">
          <NotesContent
            notes={modernNotesAsLegacy}
            searchQuery={searchQuery}
            sortOrder="newest"
            filterType="all"
            customNoteNames={{}}
            formatNoteId={formatNoteId}
            activeNoteId={currentNote?.id || ''}
            onLoadNote={handleLoadNoteModern}
            onDeleteNote={handleDeleteNoteModern}
            onOpenShare={handleOpenShare}
            onRenameNote={async () => true}
          />
        </div>
      </div>

      <NotesActions 
        onShare={() => handleOpenShare(null)} 
        content={currentContent} 
      />

      <ShareNoteDrawer 
        isOpen={isShareOpen} 
        onOpenChange={setIsShareOpen} 
        onShareNote={(service) => {
          handleShareNote(service);
          return Promise.resolve("");
        }} 
        content={selectedNoteId ? 
          notes.find(n => n.id === selectedNoteId)?.content || '' : 
          currentContent
        } 
        title={selectedNoteId ? formatNoteId(selectedNoteId) : 'Current Note'} 
      />

      <KeyboardShortcuts 
        isOpen={isShortcutsOpen} 
        onOpenChange={setIsShortcutsOpen} 
      />
    </NotesSidebarContainer>
  );
};

export default NotesSidebar;
