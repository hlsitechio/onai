
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
  Heading,
  Code,
  TextQuote,
  Link,
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
  // Markdown-specific handlers
  const insertMarkdown = (prefix: string, suffix: string = "") => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const selectedText = range.toString();
      
      // Insert markdown formatting
      document.execCommand('insertText', false, `${prefix}${selectedText}${suffix}`);
    } else {
      // If no selection, just insert the markdown syntax
      document.execCommand('insertText', false, `${prefix}${suffix}`);
    }
  };

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
        
        {/* Text formatting */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => insertMarkdown('**', '**')}
              className="hover:bg-white/10 text-white"
            >
              <Bold className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Bold (Ctrl+B) or **text**</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => insertMarkdown('_', '_')}
              className="hover:bg-white/10 text-white"
            >
              <Italic className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Italic (Ctrl+I) or _text_</p>
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
        
        {/* Markdown specific formatting */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => insertMarkdown('# ')}
              className="hover:bg-white/10 text-white"
            >
              <Heading className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Heading (# Text)</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => insertMarkdown('> ')}
              className="hover:bg-white/10 text-white"
            >
              <TextQuote className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Quote (> Text)</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => insertMarkdown('`', '`')}
              className="hover:bg-white/10 text-white"
            >
              <Code className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Code (`code`)</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => insertMarkdown('[', '](url)')}
              className="hover:bg-white/10 text-white"
            >
              <Link className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Link [text](url)</p>
          </TooltipContent>
        </Tooltip>
        
        <Separator orientation="vertical" className="h-8 bg-white/20" />
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => insertMarkdown('1. ')}
              className="hover:bg-white/10 text-white"
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Numbered list (1. Item)</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => insertMarkdown('- ')}
              className="hover:bg-white/10 text-white"
            >
              <List className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Bullet list (- Item)</p>
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
