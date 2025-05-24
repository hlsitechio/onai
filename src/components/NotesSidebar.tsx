
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
import NotesControls from './notes/NotesControls';

interface NotesSidebarProps {
  currentContent: string;
  onLoadNote: (content: string) => void;
  onSave: () => void;
  onDeleteNote: (noteId: string) => Promise<boolean>;
  editorHeight: number;
  allNotes: Record<string, string>;
  onCreateNew: () => void;
}

const NotesSidebar: React.FC<NotesSidebarProps> = ({
  currentContent,
  onLoadNote,
  onSave,
  onDeleteNote,
  editorHeight,
  allNotes,
  onCreateNew
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
    const { shareNote } = await import("@/utils/notesStorage");
    const content = selectedNoteId ? notes[selectedNoteId] : currentContent;
    const result = await shareNote(content, service);
    if (result.success) {
      // Handle successful share
    }
    setIsShareOpen(false);
    return result.shareUrl || "";
  };

  const handleImportNotesWithMerge = () => {
    handleImportNotes((importedNotes) => {
      // Here we would need to trigger a refresh of the notes
      // Since we don't have direct access to the notes state setter,
      // we'll need the parent component to handle this
      console.log('Imported notes:', importedNotes);
      // The parent component should implement the actual merging logic
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
      className="bg-gradient-to-b from-black/60 to-black/40 backdrop-blur-xl rounded-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.37)] flex flex-col text-white overflow-hidden animate-fadeIn" 
      style={{
        height: editorHeight && window.innerWidth >= 768 ? `${editorHeight}px` : 'auto',
        maxHeight: window.innerWidth < 768 ? '350px' : 'none'
      }}
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
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 animate-slideDown mb-3" style={{animationDelay: '0.2s'}}>
            <NotesControls 
              onSortNotes={handleSortNotes}
              onFilterNotes={handleFilterNotes}
            />
            <span className="text-xs text-gray-500 px-1.5 py-0.5 bg-white/5 rounded-md">
              Quick Actions
            </span>
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
