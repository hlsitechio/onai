import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Save, Clock } from "lucide-react";
import { renameNote } from "@/utils/notesStorage";
import { useToast } from "@/hooks/use-toast";
import { useCustomNamesManager } from "@/hooks/useCustomNamesManager";
import NotesList from './notes/NotesList';
import ShareNoteDrawer from './notes/ShareNoteDrawer';
import KeyboardShortcuts from './notes/KeyboardShortcuts';
import NotesHeader from './notes/NotesHeader';
import SearchBar from './notes/SearchBar';
import NotesActions from './notes/NotesActions';

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
  const { toast } = useToast();
  const { customNoteNames, updateCustomName, removeCustomName } = useCustomNamesManager();
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [activeNoteId, setActiveNoteId] = useState<string>('current');
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  useEffect(() => {
    setNotes(allNotes);
  }, [allNotes]);

  const handleLoadNote = (noteId: string) => {
    setActiveNoteId(noteId);
    onLoadNote(notes[noteId]);
    toast({
      title: "Note loaded",
      description: `Loaded note from ${formatNoteId(noteId)}`
    });
  };

  const handleDeleteNote = async (noteId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const success = await onDeleteNote(noteId);
    
    if (success) {
      removeCustomName(noteId);
      toast({
        title: "Note deleted",
        description: `Deleted note from ${formatNoteId(noteId)}`
      });
    }
  };
  
  const handleRenameNote = async (oldNoteId: string, newNoteId: string): Promise<boolean> => {
    try {
      const inputElement = document.querySelector(`[data-note-id="${oldNoteId}"] input`) as HTMLInputElement | null;
      const displayName = inputElement?.value || '';
      
      const result = await renameNote(oldNoteId, newNoteId);
      
      if (result.success) {
        removeCustomName(oldNoteId);
        updateCustomName(newNoteId, displayName);
        
        if (activeNoteId === oldNoteId) {
          setActiveNoteId(newNoteId);
        }
        
        toast({
          title: "Note renamed",
          description: `Note renamed to "${displayName}"`
        });
        
        return true;
      } else {
        toast({
          title: "Error renaming note",
          description: result.error || "An unknown error occurred",
          variant: "destructive"
        });
        return false;
      }
    } catch (e) {
      console.error('Error renaming note:', e);
      toast({
        title: "Error renaming note",
        description: e instanceof Error ? e.message : "An unknown error occurred",
        variant: "destructive"
      });
      return false;
    }
  };

  const formatNoteId = (id: string): string => {
    if (id === 'current') return 'Current Note';
    try {
      const timestamp = Number(id);
      if (isNaN(timestamp)) {
        return id;
      }
      const date = new Date(timestamp);
      if (date.toString() === 'Invalid Date') {
        return 'Note ' + id.slice(-4);
      }
      return date.toLocaleString();
    } catch (e) {
      return 'Note ' + id.slice(-4);
    }
  };

  const handleOpenShare = (noteId: string | null) => {
    setSelectedNoteId(noteId);
    setIsShareOpen(true);
  };

  const handleShareNote = async (service: 'onedrive' | 'googledrive' | 'device' | 'link') => {
    const { shareNote } = await import("@/utils/notesStorage");
    const content = selectedNoteId ? notes[selectedNoteId] : currentContent;
    const result = await shareNote(content, service);
    if (result.success) {
      toast({
        title: "Note shared",
        description: `Note has been shared to ${service === 'onedrive' ? 'OneDrive' : service === 'googledrive' ? 'Google Drive' : service === 'link' ? 'link' : 'your device'}`
      });
    } else {
      toast({
        title: "Error sharing",
        description: "There was a problem sharing your note",
        variant: "destructive"
      });
    }
    setIsShareOpen(false);
    return result.shareUrl || "";
  };

  const handleNewNote = () => {
    setActiveNoteId('current');
    onCreateNew();
    toast({
      title: "New note created",
      description: "Started a fresh note"
    });
  };

  const getFilteredNotes = () => {
    if (!searchQuery) return notes;
    return Object.fromEntries(
      Object.entries(notes).filter(([noteId, content]) => {
        const customName = customNoteNames[noteId] || '';
        const formattedId = formatNoteId(noteId);
        const query = searchQuery.toLowerCase();
        return (
          customName.toLowerCase().includes(query) ||
          formattedId.toLowerCase().includes(query) ||
          content.toLowerCase().includes(query)
        );
      })
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
            <span className="text-xs text-gray-500 px-1.5 py-0.5 bg-white/5 rounded-md">
              {Object.keys(notes).length}
            </span>
          </div>
          
          <NotesList 
            notes={getFilteredNotes()} 
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

      <NotesActions onShare={() => handleOpenShare(null)} />

      <ShareNoteDrawer 
        isOpen={isShareOpen} 
        onOpenChange={setIsShareOpen} 
        onShareNote={(service) => {
          handleShareNote(service);
          return Promise.resolve("");
        }} 
      />

      <KeyboardShortcuts 
        isOpen={isShortcutsOpen}
        onOpenChange={setIsShortcutsOpen}
      />
    </div>
  );
};

export default NotesSidebar;
