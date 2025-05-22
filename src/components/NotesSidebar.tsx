import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Save, ArrowRight, Plus, Clock, Search, FolderOpen, Star } from "lucide-react";
import { getAllNotes, deleteNote, shareNote } from "@/utils/notesStorage";
import { useToast } from "@/hooks/use-toast";
import NotesList from './notes/NotesList';
import ShareNoteDrawer from './notes/ShareNoteDrawer';
interface NotesSidebarProps {
  currentContent: string;
  onLoadNote: (content: string) => void;
  onSave: () => void;
  editorHeight: number;
}
const NotesSidebar: React.FC<NotesSidebarProps> = ({
  currentContent,
  onLoadNote,
  onSave,
  editorHeight
}) => {
  const {
    toast
  } = useToast();
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [activeNoteId, setActiveNoteId] = useState<string>('current');
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  useEffect(() => {
    // Load notes on component mount
    loadNotes();
  }, []);
  const loadNotes = async () => {
    const savedNotes = await getAllNotes();
    setNotes(savedNotes);
  };
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
    await deleteNote(noteId);
    loadNotes();
    toast({
      title: "Note deleted",
      description: `Deleted note from ${formatNoteId(noteId)}`
    });
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
    onLoadNote('');
    toast({
      title: "New note created",
      description: "Started a fresh note"
    });
  };



  return (
    <div 
      className="bg-gradient-to-b from-black/60 to-black/40 backdrop-blur-xl rounded-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.37)] flex flex-col text-white overflow-hidden animate-fadeIn" 
      style={{
        height: editorHeight ? `${editorHeight}px` : 'auto'
      }}
    >
      <div className="p-4 border-b border-white/10 bg-black/20">
        <div className="flex items-center justify-between mb-2 animate-slideDown" style={{animationDelay: '0.1s'}}>
          <h3 className="text-base font-semibold text-white flex items-center">
            <FolderOpen className="h-4 w-4 mr-2 text-noteflow-400" />
            My Notes
          </h3>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleNewNote}
            className="h-7 w-7 rounded-full hover:bg-noteflow-500/20 hover:text-noteflow-400 transition-all"
            title="Create new note"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="animate-slideDown" style={{animationDelay: '0.2s'}}>
          <div className="relative">
            <Search className="h-4 w-4 absolute left-2.5 top-2.5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search notes..." 
              className="w-full h-9 bg-black/30 border border-white/10 rounded-lg pl-9 pr-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-noteflow-400/50 focus:border-noteflow-400/50"
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
            className="w-full mb-5 bg-gradient-to-r from-noteflow-600 to-noteflow-400 hover:from-noteflow-500 hover:to-noteflow-300 text-white border-none shadow-md hover:shadow-lg transition-all duration-300 group"
          >
            <Save className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" /> 
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
            notes={notes} 
            activeNoteId={activeNoteId} 
            onLoadNote={handleLoadNote} 
            onDeleteNote={handleDeleteNote} 
            onOpenShare={handleOpenShare} 
            formatNoteId={formatNoteId} 
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
          className="w-full text-left justify-start text-white hover:bg-white/10 group" 
          onClick={() => handleOpenShare(null)}
        >
          <div className="p-1 mr-2 bg-noteflow-500/20 rounded-full group-hover:bg-noteflow-500/30 transition-colors">
            <ArrowRight className="h-3.5 w-3.5 text-noteflow-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
          Share Current Note
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
    </div>
  );
};
export default NotesSidebar;