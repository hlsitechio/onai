
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
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { getAllNotes, deleteNote, shareNote } from "@/utils/notesStorage";
import { useToast } from "@/hooks/use-toast";
import { 
  Save, 
  ArrowRight,
} from "lucide-react";

interface NotesSidebarProps {
  currentContent: string;
  onLoadNote: (content: string) => void;
  onSave: () => void;
}

const NotesSidebar: React.FC<NotesSidebarProps> = ({ currentContent, onLoadNote, onSave }) => {
  const { toast } = useToast();
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [activeNoteId, setActiveNoteId] = useState<string>('current');
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [isShareOpen, setIsShareOpen] = useState(false);

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

  const handleDeleteNote = async (noteId: string) => {
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
    <div className="h-full">
      <SidebarProvider defaultOpen={false}>
        <div className="flex h-full min-h-[400px]">
          <Sidebar variant="floating" className="border-r border-white/10 bg-black/80">
            <SidebarHeader>
              <div className="flex items-center justify-between px-4 py-2">
                <h3 className="text-sm font-semibold text-white">My Notes</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-noteflow-400 hover:bg-black/30 hover:text-noteflow-300"
                  onClick={onSave}
                >
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
              </div>
            </SidebarHeader>
            
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Saved Notes</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton 
                        isActive={activeNoteId === 'current'} 
                        onClick={() => handleLoadNote('current')}
                      >
                        <span>Current Note</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    
                    {Object.keys(notes).map((noteId) => (
                      <SidebarMenuItem key={noteId}>
                        <SidebarMenuButton 
                          isActive={activeNoteId === noteId}
                          onClick={() => handleLoadNote(noteId)}
                        >
                          <span>{formatNoteId(noteId)}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              <SidebarGroup>
                <SidebarGroupLabel>Share Options</SidebarGroupLabel>
                <SidebarGroupContent>
                  <Drawer open={isShareOpen} onOpenChange={setIsShareOpen}>
                    <DrawerTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full text-left justify-start bg-black/30 border-white/10 hover:bg-black/40"
                      >
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Share Note
                      </Button>
                    </DrawerTrigger>
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
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            
            <SidebarFooter>
              <div className="px-4 py-2 text-xs text-gray-400">
                Notes are saved in Chrome Storage
              </div>
            </SidebarFooter>
          </Sidebar>
          
          {/* This will be the content next to the sidebar */}
          <div className="flex-1"></div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default NotesSidebar;
