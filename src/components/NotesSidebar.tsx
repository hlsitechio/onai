
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Save, ArrowRight } from "lucide-react";
import { getAllNotes, deleteNote, shareNote } from "@/utils/notesStorage";
import { useToast } from "@/hooks/use-toast";
import AdBanner from "./AdBanner";
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
  const { toast } = useToast();
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
      description: `Loaded note from ${formatNoteId(noteId)}`,
    });
  };

  const handleDeleteNote = async (noteId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the note loading
    await deleteNote(noteId);
    loadNotes();
    toast({
      title: "Note deleted",
      description: `Deleted note from ${formatNoteId(noteId)}`,
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

  const handleShareNote = async (service: 'onedrive' | 'googledrive' | 'device') => {
    const content = selectedNoteId ? notes[selectedNoteId] : currentContent;
    const success = await shareNote(content, service);
    
    if (success) {
      toast({
        title: "Note shared",
        description: `Note has been shared to ${service === 'onedrive' ? 'OneDrive' : 
          service === 'googledrive' ? 'Google Drive' : 'your device'}`,
      });
    } else {
      toast({
        title: "Error sharing",
        description: "There was a problem sharing your note",
        variant: "destructive",
      });
    }
    setIsShareOpen(false);
  };

  return (
    <div 
      className="bg-black/40 backdrop-blur-lg rounded-lg border border-white/10 shadow-lg flex flex-col text-white"
      style={{ height: editorHeight ? `${editorHeight}px` : 'auto' }}
    >
      <div className="p-3 border-b border-white/10">
        <h3 className="text-sm font-semibold text-white">My Notes</h3>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-3">
          <Button
            variant="outline"
            size="sm"
            className="w-full mb-4 border-white/10 text-white hover:bg-black/30"
            onClick={onSave}
          >
            <Save className="h-4 w-4 mr-2" /> Save Current Note
          </Button>

          <h4 className="text-xs uppercase text-slate-400 font-medium mb-2">Saved Notes</h4>
          
          <NotesList
            notes={notes}
            activeNoteId={activeNoteId}
            onLoadNote={handleLoadNote}
            onDeleteNote={handleDeleteNote}
            onOpenShare={handleOpenShare}
            formatNoteId={formatNoteId}
          />
        </div>
        
        {/* Ad Banner in Sidebar with specific ad slot */}
        <div className="p-3">
          <AdBanner size="small" position="sidebar" adSlotId="4567890123" />
        </div>
      </div>

      <div className="p-3 border-t border-white/10">
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full text-left justify-start text-white hover:bg-white/10"
          onClick={() => handleOpenShare(null)}
        >
          <ArrowRight className="h-4 w-4 mr-2" />
          Share Current Note
        </Button>
      </div>

      {/* Share Drawer */}
      <ShareNoteDrawer
        isOpen={isShareOpen}
        onOpenChange={setIsShareOpen}
        onShareNote={handleShareNote}
      />
    </div>
  );
};

export default NotesSidebar;
