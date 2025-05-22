
import React, { useState, useEffect, useRef } from "react";
import { 
  Bold, 
  Italic, 
  Underline, 
  ListOrdered, 
  List, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Undo,
  Redo,
  Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import NotesSidebar from "./NotesSidebar";
import AdBanner from "./AdBanner";
import { saveNote } from "@/utils/notesStorage";

const TextEditor = () => {
  const { toast } = useToast();
  const [content, setContent] = useState<string>(localStorage.getItem("noteflow-content") || "");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const editorRef = useRef<HTMLDivElement>(null);
  const [editorHeight, setEditorHeight] = useState<number>(0);
  
  // Control auto-saving
  useEffect(() => {
    const saveInterval = setInterval(() => {
      if (content) {
        localStorage.setItem("noteflow-content", content);
        setLastSaved(new Date());
      }
    }, 5000); // Auto-save every 5 seconds

    return () => clearInterval(saveInterval);
  }, [content]);
  
  // Update editor height for sidebar matching
  useEffect(() => {
    if (editorRef.current) {
      const updateEditorHeight = () => {
        const height = editorRef.current?.getBoundingClientRect().height || 0;
        setEditorHeight(height);
      };
      
      updateEditorHeight();
      window.addEventListener('resize', updateEditorHeight);
      
      return () => {
        window.removeEventListener('resize', updateEditorHeight);
      };
    }
  }, [editorRef]);
  
  // Execute commands on the editor
  const execCommand = (command: string, value: string | null = null) => {
    document.execCommand(command, false, value);
  };
  
  // Handle manual save
  const handleSave = async () => {
    localStorage.setItem("noteflow-content", content);
    
    // Save to Chrome Storage with timestamp as ID
    const noteId = Date.now().toString();
    await saveNote(noteId, content);
    
    setLastSaved(new Date());
    toast({
      title: "Saved successfully",
      description: "Your note has been saved to Chrome Storage",
    });
  };

  // Handle loading a note
  const handleLoadNote = (noteContent: string) => {
    setContent(noteContent);
    localStorage.setItem("noteflow-content", noteContent);
  };
  
  // Setup proper content editing with key handling
  useEffect(() => {
    if (!editorRef.current) return;
    
    const handleInput = () => {
      if (editorRef.current) {
        setContent(editorRef.current.innerHTML);
      }
    };
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle backspace and delete keys properly
      if (e.key === 'Delete' || e.key === 'Backspace') {
        // Let the browser handle the default action
        // Then sync the content state after a small delay
        requestAnimationFrame(() => {
          if (editorRef.current) {
            setContent(editorRef.current.innerHTML);
          }
        });
      }
    };
    
    const editorElement = editorRef.current;
    
    // Use both input event (for general typing) and specific key handlers
    editorElement.addEventListener('input', handleInput);
    editorElement.addEventListener('keydown', handleKeyDown);
    
    return () => {
      editorElement.removeEventListener('input', handleInput);
      editorElement.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  return (
    <section id="editor-section" className="py-12 px-4 relative">
      <div className="container mx-auto max-w-5xl">
        <div className="flex gap-4">
          {/* The sidebar */}
          {isSidebarOpen && (
            <div className="w-64 shrink-0">
              <NotesSidebar 
                currentContent={content} 
                onLoadNote={handleLoadNote} 
                onSave={handleSave}
                editorHeight={editorHeight}
              />
            </div>
          )}
          
          {/* The editor */}
          <div className="flex-1 flex flex-col">
            <div 
              ref={editorRef}
              className="bg-black/40 backdrop-blur-lg rounded-lg shadow-lg border border-white/10 overflow-hidden"
            >
              {/* Toolbar */}
              <div className="bg-black/60 border-b border-white/10 p-3 flex flex-wrap gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="hover:bg-white/10 text-white"
                >
                  {isSidebarOpen ? "Hide Notes" : "Show Notes"}
                </Button>
                
                <Separator orientation="vertical" className="h-8 bg-white/20" />
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => execCommand("bold")}
                  className="hover:bg-white/10 text-white"
                >
                  <Bold className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => execCommand("italic")}
                  className="hover:bg-white/10 text-white"
                >
                  <Italic className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => execCommand("underline")}
                  className="hover:bg-white/10 text-white"
                >
                  <Underline className="h-4 w-4" />
                </Button>
                
                <Separator orientation="vertical" className="h-8 bg-white/20" />
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => execCommand("insertOrderedList")}
                  className="hover:bg-white/10 text-white"
                >
                  <ListOrdered className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => execCommand("insertUnorderedList")}
                  className="hover:bg-white/10 text-white"
                >
                  <List className="h-4 w-4" />
                </Button>
                
                <Separator orientation="vertical" className="h-8 bg-white/20" />
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => execCommand("justifyLeft")}
                  className="hover:bg-white/10 text-white"
                >
                  <AlignLeft className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => execCommand("justifyCenter")}
                  className="hover:bg-white/10 text-white"
                >
                  <AlignCenter className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => execCommand("justifyRight")}
                  className="hover:bg-white/10 text-white"
                >
                  <AlignRight className="h-4 w-4" />
                </Button>
                
                <Separator orientation="vertical" className="h-8 bg-white/20" />
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => execCommand("undo")}
                  className="hover:bg-white/10 text-white"
                >
                  <Undo className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => execCommand("redo")}
                  className="hover:bg-white/10 text-white"
                >
                  <Redo className="h-4 w-4" />
                </Button>
                
                <div className="ml-auto flex items-center gap-2">
                  {lastSaved && (
                    <span className="text-xs text-slate-300">
                      Last saved: {lastSaved.toLocaleTimeString()}
                    </span>
                  )}
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleSave}
                    className="border-noteflow-500 text-noteflow-400 hover:bg-noteflow-900/30"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                </div>
              </div>
              
              {/* Editor area */}
              <div 
                contentEditable
                className="min-h-[400px] p-6 outline-none font-sans text-white bg-black/20 backdrop-blur-md"
                dangerouslySetInnerHTML={{ __html: content }}
                onInput={(e) => setContent((e.target as HTMLDivElement).innerHTML)}
                onBlur={(e) => setContent((e.target as HTMLDivElement).innerHTML)}
                suppressContentEditableWarning={true}
                style={{ 
                  minHeight: '400px', 
                  height: '450px',
                  maxHeight: '600px', 
                  overflowY: 'auto',
                  lineHeight: '1.6',
                  fontSize: '16px'
                }}
              />
            </div>
            
            {/* Ad Banner below editor with specific ad slot */}
            <AdBanner size="medium" position="content" className="mt-4" adSlotId="3456789012" />
            
            <div className="mt-4 text-center text-sm text-slate-400">
              Your notes are saved in Chrome Storage and locally in your browser.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TextEditor;
