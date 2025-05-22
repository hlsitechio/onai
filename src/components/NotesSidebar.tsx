
import React, { useState, useEffect } from 'react';
import { 
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { 
  Save, 
  ArrowRight,
  Trash2
} from "lucide-react";
import { getAllNotes, deleteNote, shareNote } from "@/utils/notesStorage";
import { useToast } from "@/hooks/use-toast";
import AdBanner from "./AdBanner";

interface NotesSidebarProps {
  currentContent: string;
  onLoadNote: (content: string) => void;
  onSave: () => void;
  editorHeight: number;
}

const NotesSidebar: React.FC<NotesSidebarProps> = ({ currentContent, onLoadNote, onSave, editorHeight }) => {
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
      const date = new Date(Number(id));
      return date.toLocaleString();
    } catch (e) {
      return id;
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
      className="bg-black/40 backdrop-blur-lg rounded-lg border border-white/10 shadow-lg flex flex-col"
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
          <div className="space-y-1 overflow-y-auto">
            {Object.entries(notes).length === 0 ? (
              <p className="text-xs text-slate-500">No saved notes yet</p>
            ) : (
              Object.entries(notes).map(([noteId, content]) => (
                <div 
                  key={noteId}
                  className={`p-2 rounded-md flex justify-between items-center cursor-pointer ${
                    activeNoteId === noteId ? 'bg-white/10' : 'hover:bg-white/5'
                  }`}
                  onClick={() => handleLoadNote(noteId)}
                >
                  <span className="text-sm text-white truncate">{formatNoteId(noteId)}</span>
                  <div className="flex gap-1">
                    <button 
                      onClick={(e) => handleOpenShare(noteId)}
                      className="p-1 hover:bg-white/10 rounded"
                    >
                      <ArrowRight className="h-4 w-4 text-slate-400" />
                    </button>
                    <button 
                      onClick={(e) => handleDeleteNote(noteId, e)}
                      className="p-1 hover:bg-white/10 rounded"
                    >
                      <Trash2 className="h-4 w-4 text-slate-400" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Ad Banner in Sidebar */}
        <div className="p-3">
          <AdBanner size="small" position="sidebar" />
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
      <Drawer open={isShareOpen} onOpenChange={setIsShareOpen}>
        <DrawerContent className="bg-black/80 backdrop-blur-md border border-white/10 text-white">
          <DrawerHeader>
            <DrawerTitle>Share Note</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start bg-black/30 border-white/10 hover:bg-black/40"
              onClick={() => handleShareNote('onedrive')}
            >
              Save to OneDrive
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start bg-black/30 border-white/10 hover:bg-black/40"
              onClick={() => handleShareNote('googledrive')}
            >
              Save to Google Drive
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start bg-black/30 border-white/10 hover:bg-black/40"
              onClick={() => handleShareNote('device')}
            >
              Download to Device
            </Button>
          </div>
          <DrawerFooter className="border-t border-white/10 pt-2">
            <span className="text-xs text-gray-400">
              Note sharing requires browser permissions
            </span>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default NotesSidebar;
