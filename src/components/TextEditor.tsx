
import React, { useState, useEffect } from "react";
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

const TextEditor = () => {
  const { toast } = useToast();
  const [content, setContent] = useState<string>(localStorage.getItem("noteflow-content") || "");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
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
  
  // Execute commands on the editor
  const execCommand = (command: string, value: string | null = null) => {
    document.execCommand(command, false, value);
  };
  
  // Handle manual save
  const handleSave = () => {
    localStorage.setItem("noteflow-content", content);
    setLastSaved(new Date());
    toast({
      title: "Saved successfully",
      description: "Your note has been saved to your browser",
    });
  };
  
  return (
    <section id="editor-section" className="py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden">
          {/* Toolbar */}
          <div className="bg-slate-50 border-b border-slate-200 p-3 flex flex-wrap gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => execCommand("bold")}
              className="hover:bg-slate-200"
            >
              <Bold className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => execCommand("italic")}
              className="hover:bg-slate-200"
            >
              <Italic className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => execCommand("underline")}
              className="hover:bg-slate-200"
            >
              <Underline className="h-4 w-4" />
            </Button>
            
            <Separator orientation="vertical" className="h-8" />
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => execCommand("insertOrderedList")}
              className="hover:bg-slate-200"
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => execCommand("insertUnorderedList")}
              className="hover:bg-slate-200"
            >
              <List className="h-4 w-4" />
            </Button>
            
            <Separator orientation="vertical" className="h-8" />
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => execCommand("justifyLeft")}
              className="hover:bg-slate-200"
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => execCommand("justifyCenter")}
              className="hover:bg-slate-200"
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => execCommand("justifyRight")}
              className="hover:bg-slate-200"
            >
              <AlignRight className="h-4 w-4" />
            </Button>
            
            <Separator orientation="vertical" className="h-8" />
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => execCommand("undo")}
              className="hover:bg-slate-200"
            >
              <Undo className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => execCommand("redo")}
              className="hover:bg-slate-200"
            >
              <Redo className="h-4 w-4" />
            </Button>
            
            <div className="ml-auto flex items-center gap-2">
              {lastSaved && (
                <span className="text-xs text-slate-500">
                  Last saved: {lastSaved.toLocaleTimeString()}
                </span>
              )}
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSave}
                className="border-noteflow-500 text-noteflow-500 hover:bg-noteflow-50"
              >
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
            </div>
          </div>
          
          {/* Editor area */}
          <div 
            contentEditable
            className="min-h-[400px] p-6 outline-none font-sans text-slate-800"
            dangerouslySetInnerHTML={{ __html: content }}
            onInput={(e) => setContent((e.target as HTMLDivElement).innerHTML)}
            style={{ 
              minHeight: '400px', 
              maxHeight: '600px', 
              overflowY: 'auto',
              lineHeight: '1.6',
              fontSize: '16px'
            }}
          />
        </div>
        
        <div className="mt-4 text-center text-sm text-slate-500">
          Your notes are saved locally in your browser.
        </div>
      </div>
    </section>
  );
};

export default TextEditor;
