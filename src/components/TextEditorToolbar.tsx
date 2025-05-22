
import React from "react";
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

interface TextEditorToolbarProps {
  execCommand: (command: string, value: string | null) => void;
  handleSave: () => void;
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
  lastSaved: Date | null;
}

const TextEditorToolbar: React.FC<TextEditorToolbarProps> = ({
  execCommand,
  handleSave,
  toggleSidebar,
  isSidebarOpen,
  lastSaved
}) => {
  return (
    <div className="bg-black/60 border-b border-white/10 p-3 flex flex-wrap gap-2">
      <Button 
        variant="ghost" 
        size="sm"
        onClick={toggleSidebar}
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
  );
};

export default TextEditorToolbar;
