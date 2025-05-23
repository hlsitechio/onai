import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Save, ArrowRight, Plus, Clock, Search, FolderOpen, Star, Edit, Sparkles, Keyboard } from "lucide-react";
import { getAllNotes, deleteNote, shareNote, renameNote } from "@/utils/notesStorage";
import { useToast } from "@/hooks/use-toast";
import NotesList from './notes/NotesList';
import ShareNoteDrawer from './notes/ShareNoteDrawer';
import KeyboardShortcuts from './notes/KeyboardShortcuts';

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
  const {
    toast
  } = useToast();
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [activeNoteId, setActiveNoteId] = useState<string>('current');
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [customNoteNames, setCustomNoteNames] = useState<Record<string, string>>({});
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  useEffect(() => {
    // Use allNotes from props instead of loading from storage
    setNotes(allNotes);
    
    // Load custom note names from local storage
    const savedNames = localStorage.getItem('noteflow-custom-names');
    if (savedNames) {
      try {
        setCustomNoteNames(JSON.parse(savedNames));
      } catch (e) {
        console.error('Error loading custom note names:', e);
      }
    }
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
    e.stopPropagation(); // Prevent triggering the note loading
    const success = await onDeleteNote(noteId);
    
    if (success) {
      // Also remove any custom name for this note
      if (customNoteNames[noteId]) {
        const updatedNames = { ...customNoteNames };
        delete updatedNames[noteId];
        setCustomNoteNames(updatedNames);
        localStorage.setItem('noteflow-custom-names', JSON.stringify(updatedNames));
      }
      
      toast({
        title: "Note deleted",
        description: `Deleted note from ${formatNoteId(noteId)}`
      });
    }
  };
  
  const handleRenameNote = async (oldNoteId: string, newNoteId: string): Promise<boolean> => {
    try {
      // Get the user-entered name from NoteItem component
      const inputElement = document.querySelector(`[data-note-id="${oldNoteId}"] input`) as HTMLInputElement | null;
      const displayName = inputElement?.value || '';
      
      // Rename the note in storage
      const result = await renameNote(oldNoteId, newNoteId);
      
      if (result.success) {
        // Update the custom names storage
        const updatedNames = { ...customNoteNames };
        delete updatedNames[oldNoteId]; // Remove old name mapping
        updatedNames[newNoteId] = displayName; // Add new name mapping
        setCustomNoteNames(updatedNames);
        localStorage.setItem('noteflow-custom-names', JSON.stringify(updatedNames));
        
        // Update active note ID if needed
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
    // Format the note ID for display - remove prefixes and format date
    if (id === 'current') return 'Current Note';
    try {
      // Convert the ID to a number and create a Date object
      const timestamp = Number(id);

      // Check if the timestamp is valid
      if (isNaN(timestamp)) {
        return id; // If not a valid number, return the original ID
      }
      const date = new Date(timestamp);

      // Check if the date is valid before formatting
      if (date.toString() === 'Invalid Date') {
        return 'Note ' + id.slice(-4); // Use last 4 chars if invalid date
      }
      return date.toLocaleString();
    } catch (e) {
      // If there's any error, fall back to showing a generic name
      return 'Note ' + id.slice(-4);
    }
  };
  const handleOpenShare = (noteId: string | null) => {
    setSelectedNoteId(noteId);
    setIsShareOpen(true);
  };
  const handleShareNote = async (service: 'onedrive' | 'googledrive' | 'device' | 'link') => {
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
  // Handle creating a new note
  const handleNewNote = () => {
    setActiveNoteId('current');
    onCreateNew();
    toast({
      title: "New note created",
      description: "Started a fresh note"
    });
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
          <div className="flex items-center justify-between mb-2 animate-slideDown" style={{animationDelay: '0.1s'}}>
            <h3 className="text-sm sm:text-base font-semibold text-white flex items-center">
              <FolderOpen className="h-4 w-4 mr-2 text-noteflow-400" />
              My Notes
            </h3>
            <div className="flex space-x-1">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleNewNote}
                className="h-7 w-7 rounded-full hover:bg-noteflow-500/20 hover:text-noteflow-400 transition-all group"
                title="Create new note"
              >
                <Plus className="h-4 w-4 group-hover:scale-110 group-hover:rotate-90 transition-all duration-300" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsSearching(!isSearching)}
                className={`h-7 w-7 rounded-full transition-all group ${isSearching ? 'bg-noteflow-500/20 text-noteflow-400' : 'hover:bg-noteflow-500/20 hover:text-noteflow-400'}`}
                title="Search notes"
              >
                <Search className="h-4 w-4 group-hover:scale-110 transition-all duration-300" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsShortcutsOpen(true)}
                className="h-7 w-7 rounded-full hover:bg-noteflow-500/20 hover:text-noteflow-400 transition-all group"
                title="Keyboard shortcuts"
              >
                <Keyboard className="h-4 w-4 group-hover:scale-110 transition-all duration-300" />
              </Button>
            </div>
          </div>
        
          <div className={`animate-slideDown overflow-hidden transition-all duration-300 ${isSearching ? 'max-h-12' : 'max-h-0'}`} style={{animationDelay: '0.2s'}}>
            <div className="relative mb-2">
              <Search className="h-4 w-4 absolute left-2.5 top-2.5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search notes..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-8 sm:h-9 bg-black/30 border border-white/10 rounded-lg pl-9 pr-3 text-xs sm:text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-noteflow-400/50 focus:border-noteflow-400/50"
              />
            </div>
          </div>
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
            notes={searchQuery ? Object.fromEntries(
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
            ) : notes} 
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

      <div 
        className="p-4 border-t border-white/10 bg-black/20 animate-slideUp"
        style={{animationDelay: '0.1s'}}
      >
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full text-left justify-start text-white hover:bg-white/10 group relative overflow-hidden" 
          onClick={() => handleOpenShare(null)}
        >
          <div className="absolute inset-0 bg-noteflow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="p-1 mr-2 bg-noteflow-500/20 rounded-full group-hover:bg-noteflow-500/30 transition-colors duration-300">
            <ArrowRight className="h-3.5 w-3.5 text-noteflow-400 group-hover:translate-x-0.5 transition-transform duration-300" />
          </div>
          <span className="relative">Share Current Note</span>
          <Sparkles className="h-3.5 w-3.5 text-noteflow-400 absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Button>
      </div>

      {/* Share Drawer */}
      <ShareNoteDrawer 
        isOpen={isShareOpen} 
        onOpenChange={setIsShareOpen} 
        onShareNote={(service) => {
          handleShareNote(service);
          return Promise.resolve(""); // Return an empty string to satisfy the type requirement
        }} 
      />

      {/* Keyboard Shortcuts Dialog */}
      <KeyboardShortcuts 
        isOpen={isShortcutsOpen}
        onOpenChange={setIsShortcutsOpen}
      />
    </div>
  );
};

export default NotesSidebar;
