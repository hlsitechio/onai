
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Save, Clock } from "lucide-react";
import { useNotesManager } from "@/hooks/useNotesManager";
import { useNotesImportExport } from "@/utils/notesImportExport";
import { getSortedAndFilteredNotes } from "@/utils/notesFiltering";
import NotesList from './notes/NotesList';
import ShareNoteDrawer from './notes/ShareNoteDrawer';
import KeyboardShortcuts from './notes/KeyboardShortcuts';
import NotesHeader from './notes/NotesHeader';
import SearchBar from './notes/SearchBar';
import NotesActions from './notes/NotesActions';
import NotesStats from './notes/NotesStats';

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
    activeNoteId,
    sortOrder,
    filterType,
    customNoteNames,
    formatNoteId,
    handleLoadNote,
    handleDeleteNote,
    handleRenameNote,
    handleNewNote,
    handleSortNotes,
    handleFilterNotes
  } = useNotesManager({
    allNotes,
    onLoadNote,
    onDeleteNote,
    onCreateNew
  });

  const { handleExportNotes, handleImportNotes } = useNotesImportExport();

  const handleOpenShare = (noteId: string | null) => {
    setSelectedNoteId(noteId);
    setIsShareOpen(true);
  };

  const handleShareNote = async (service: 'onedrive' | 'googledrive' | 'device' | 'link') => {
    const content = selectedNoteId ? notes[selectedNoteId] : currentContent;
    const title = selectedNoteId ? (customNoteNames[selectedNoteId] || formatNoteId(selectedNoteId)) : 'Current Note';
    
    const { shareToOneDrive, shareToGoogleDrive, shareToDevice, createShareLink } = await import("@/utils/shareUtils");
    
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
        result = { success: false, error: 'Unknown share service' };
    }
    
    setIsShareOpen(false);
    return result.shareUrl || "";
  };

  const handleImportNotesWithMerge = () => {
    handleImportNotes(async (importedNotes) => {
      try {
        if (onImportNotes) {
          const success = await onImportNotes(importedNotes);
          if (!success) {
            console.error('Failed to import notes via parent component');
          }
        } else {
          console.log('Imported notes (no parent handler):', importedNotes);
        }
      } catch (error) {
        console.error('Error during import merge:', error);
      }
    });
  };

  const getSortedAndFilteredNotesData = () => {
    return getSortedAndFilteredNotes(
      notes,
      searchQuery,
      sortOrder,
      filterType,
      customNoteNames,
      formatNoteId
    );
  };

  return (
    <div 
      className="bg-gradient-to-b from-black/60 to-black/40 backdrop-blur-xl rounded-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.37)] flex flex-col text-white overflow-hidden animate-fadeIn h-[calc(100vh-200px)]"
    >
      <div className="p-3 sm:p-4 border-b border-white/10 bg-black/20">
        <NotesHeader 
          onCreateNew={handleNewNote}
          isSearching={isSearching}
          onSearchToggle={() => setIsSearching(!isSearching)}
          onShowShortcuts={() => setIsShortcutsOpen(true)}
          onSortNotes={handleSortNotes}
          onFilterNotes={handleFilterNotes}
          onExportNotes={() => handleExportNotes(notes)}
          onImportNotes={handleImportNotesWithMerge}
        />
        
        <SearchBar 
          isSearching={isSearching}
          searchQuery={searchQuery}
          onSearchToggle={() => setIsSearching(!isSearching)}
          onSearchChange={setSearchQuery}
        />
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar">
        <div className="p-4 animate-slideDown" style={{animationDelay: '0.3s'}}>
          <Button 
            variant="default" 
            size="sm" 
            onClick={onSave} 
            className="w-full mb-3 sm:mb-5 bg-gradient-to-r from-noteflow-600 to-noteflow-400 hover:from-noteflow-500 hover:to-noteflow-300 text-white border-none shadow-md hover:shadow-lg transition-all duration-300 group text-xs sm:text-sm relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 group-hover:animate-pulse-light"></div>
            <Save className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" /> 
            Save Current Note
          </Button>

          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs uppercase text-noteflow-200 font-medium tracking-wider flex items-center">
              <Clock className="h-3 w-3 mr-1.5 text-noteflow-400/70" />
              Saved Notes
            </h4>
            <NotesStats 
              notesCount={Object.keys(notes).length}
              sortOrder={sortOrder}
              notes={notes}
              customNoteNames={customNoteNames}
            />
          </div>
          
          <NotesList 
            notes={getSortedAndFilteredNotesData()} 
            activeNoteId={activeNoteId} 
            onLoadNote={handleLoadNote} 
            onDeleteNote={handleDeleteNote} 
            onOpenShare={handleOpenShare} 
            onRenameNote={handleRenameNote}
            formatNoteId={formatNoteId} 
            customNoteNames={customNoteNames}
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
        content={selectedNoteId ? notes[selectedNoteId] : currentContent}
        title={selectedNoteId ? (customNoteNames[selectedNoteId] || formatNoteId(selectedNoteId)) : 'Current Note'}
      />

      <KeyboardShortcuts 
        isOpen={isShortcutsOpen}
        onOpenChange={setIsShortcutsOpen}
      />
    </div>
  );
};

export default NotesSidebar;
