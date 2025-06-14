
import React, { useState } from 'react';
import { useNotesManager } from "@/hooks/useNotesManager";
import { useNotesImportExport } from "@/utils/notesImportExport";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from './ui/resizable';
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

  const {
    handleExportNotes,
    handleImportNotes
  } = useNotesImportExport();

  const handleOpenShare = (noteId: string | null) => {
    setSelectedNoteId(noteId);
    setIsShareOpen(true);
  };

  const handleShareNote = async (service: 'onedrive' | 'googledrive' | 'device' | 'link') => {
    const content = selectedNoteId ? notes[selectedNoteId] : currentContent;
    const title = selectedNoteId ? customNoteNames[selectedNoteId] || formatNoteId(selectedNoteId) : 'Current Note';

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
      } catch (error) {
        console.error('Error during import merge:', error);
      }
    });
  };

  return (
    <NotesSidebarContainer>
      <SidebarHeader
        onCreateNew={handleNewNote}
        isSearching={isSearching}
        onSearchToggle={() => setIsSearching(!isSearching)}
        onShowShortcuts={() => setIsShortcutsOpen(true)}
        onSortNotes={handleSortNotes}
        onFilterNotes={handleFilterNotes}
        onExportNotes={() => handleExportNotes(notes)}
        onImportNotes={handleImportNotesWithMerge}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="flex-1 overflow-hidden bg-[#03010a]">
        <ResizablePanelGroup 
          direction="vertical" 
          className="h-full w-full"
          autoSaveId="notes-sidebar-vertical-layout"
        >
          {/* Save Notes Section - Fixed at top */}
          <ResizablePanel 
            id="save-notes-section"
            defaultSize={15}
            minSize={10}
            maxSize={25}
            className="min-h-0"
          >
            <div className="h-full overflow-hidden">
              <SaveNotesSection onSave={onSave} />
            </div>
          </ResizablePanel>
          
          {/* Vertical Resize Handle */}
          <ResizableHandle 
            withHandle={true}
            className="h-2 hover:h-3 transition-all duration-200 z-30 cursor-row-resize bg-white/5 hover:bg-purple-500/30"
          />
          
          {/* Notes Content - Resizable main area */}
          <ResizablePanel 
            id="notes-content-area"
            defaultSize={85}
            minSize={50}
            maxSize={90}
            className="min-h-0"
          >
            <div className="h-full overflow-auto custom-scrollbar px-4 pb-4">
              <NotesContent
                notes={notes}
                searchQuery={searchQuery}
                sortOrder={sortOrder}
                filterType={filterType}
                customNoteNames={customNoteNames}
                formatNoteId={formatNoteId}
                activeNoteId={activeNoteId}
                onLoadNote={handleLoadNote}
                onDeleteNote={handleDeleteNote}
                onOpenShare={handleOpenShare}
                onRenameNote={handleRenameNote}
              />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
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
        title={selectedNoteId ? customNoteNames[selectedNoteId] || formatNoteId(selectedNoteId) : 'Current Note'} 
      />

      <KeyboardShortcuts 
        isOpen={isShortcutsOpen} 
        onOpenChange={setIsShortcutsOpen} 
      />
    </NotesSidebarContainer>
  );
};

export default NotesSidebar;
