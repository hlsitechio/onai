
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
  Save,
  Sparkles,
  FileText,
  FileCode,
  Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { TooltipProvider } from "@radix-ui/react-tooltip";

interface TextEditorToolbarProps {
  execCommand: (command: string, value: string | null) => void;
  handleSave: () => void;
  toggleSidebar: () => void;
  toggleAI: () => void;
  isSidebarOpen: boolean;
  lastSaved: Date | null;
}

const TextEditorToolbar: React.FC<TextEditorToolbarProps> = ({
  execCommand,
  handleSave,
  toggleSidebar,
  toggleAI,
  isSidebarOpen,
  lastSaved
}) => {
  return (
    <TooltipProvider>
      <div className="bg-black/60 border-b border-white/10 p-3 flex flex-wrap gap-2 items-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={toggleSidebar}
              className="hover:bg-white/10 text-white"
            >
              <Menu className="h-4 w-4 mr-1" />
              {isSidebarOpen ? "Hide Notes" : "Show Notes"}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Toggle notes sidebar</p>
          </TooltipContent>
        </Tooltip>
        
        <Separator orientation="vertical" className="h-8 bg-white/20" />
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => execCommand("bold", null)}
              className="hover:bg-white/10 text-white"
            >
              <Bold className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Bold (Ctrl+B)</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => execCommand("italic", null)}
              className="hover:bg-white/10 text-white"
            >
              <Italic className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Italic (Ctrl+I)</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => execCommand("underline", null)}
              className="hover:bg-white/10 text-white"
            >
              <Underline className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Underline (Ctrl+U)</p>
          </TooltipContent>
        </Tooltip>
        
        <Separator orientation="vertical" className="h-8 bg-white/20" />
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => execCommand("insertOrderedList", null)}
              className="hover:bg-white/10 text-white"
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Numbered list</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => execCommand("insertUnorderedList", null)}
              className="hover:bg-white/10 text-white"
            >
              <List className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Bullet list</p>
          </TooltipContent>
        </Tooltip>
        
        <Separator orientation="vertical" className="h-8 bg-white/20" />
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => execCommand("justifyLeft", null)}
              className="hover:bg-white/10 text-white"
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Align left</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => execCommand("justifyCenter", null)}
              className="hover:bg-white/10 text-white"
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Align center</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => execCommand("justifyRight", null)}
              className="hover:bg-white/10 text-white"
            >
              <AlignRight className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Align right</p>
          </TooltipContent>
        </Tooltip>
        
        <Separator orientation="vertical" className="h-8 bg-white/20" />
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => execCommand("undo", null)}
              className="hover:bg-white/10 text-white"
            >
              <Undo className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Undo (Ctrl+Z)</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => execCommand("redo", null)}
              className="hover:bg-white/10 text-white"
            >
              <Redo className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Redo (Ctrl+Y)</p>
          </TooltipContent>
        </Tooltip>
        
        <Separator orientation="vertical" className="h-8 bg-white/20" />
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleAI}
              className="hover:bg-white/10 text-white"
            >
              <Sparkles className="h-4 w-4 text-noteflow-400 mr-1" />
              AI
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Get AI assistance</p>
          </TooltipContent>
        </Tooltip>
        
        <div className="ml-auto flex items-center gap-2">
          {lastSaved && (
            <span className="text-xs text-slate-300">
              Last saved: {lastSaved.toLocaleTimeString()}
            </span>
          )}
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSave}
                className="border-noteflow-500 text-noteflow-400 hover:bg-noteflow-900/30"
              >
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Save note (Ctrl+S)</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default TextEditorToolbar;
