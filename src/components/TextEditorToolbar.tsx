
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
  Menu,
  Maximize,
  Minimize
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

interface TextEditorToolbarProps {
  execCommand: (command: string, value: string | null) => void;
  handleSave: () => void;
  toggleSidebar: () => void;
  toggleAI: () => void;
  isSidebarOpen: boolean;
  lastSaved: Date | null;
  isAISidebarOpen?: boolean;
  isFocusMode?: boolean;
  toggleFocusMode?: () => void;
}

const TextEditorToolbar: React.FC<TextEditorToolbarProps> = ({
  execCommand,
  handleSave,
  toggleSidebar,
  toggleAI,
  isSidebarOpen,
  isAISidebarOpen,
  lastSaved,
  isFocusMode = false,
  toggleFocusMode = () => {}
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
      <div className="border-b border-white/5 bg-gradient-to-r from-gray-900/90 to-gray-800/90 backdrop-blur-md py-2.5 px-4 flex items-center justify-between flex-wrap gap-y-2 shadow-inner">
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size={"icon"}
                onClick={toggleAI}
                className={`text-gray-300 hover:text-white rounded-md border ${isAISidebarOpen === true ? 'bg-noteflow-600/30 text-white' : 'bg-transparent hover:bg-noteflow-600/30 border-white/5'}`}
                disabled={isFocusMode}
              >
                <Sparkles className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isAISidebarOpen === true ? 'Hide AI Panel' : 'Show AI Panel'}</p>
            </TooltipContent>
          </Tooltip>
          
          {/* Focus mode toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size={"icon"}
                onClick={toggleFocusMode}
                className={`text-gray-300 hover:text-white rounded-md border ${isFocusMode ? 'bg-purple-600/30 text-white' : 'bg-transparent hover:bg-purple-600/30 border-white/5'}`}
              >
                {isFocusMode ? (
                  <Minimize className="h-4 w-4" />
                ) : (
                  <Maximize className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isFocusMode ? 'Exit Focus Mode' : 'Enter Focus Mode'}</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleSidebar}
                className="text-gray-300 hover:text-white hover:bg-gray-800/80 rounded-md border border-white/5"
                disabled={isFocusMode}
              >
                <Menu className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle notes sidebar</p>
            </TooltipContent>
          </Tooltip>
          <span className="text-gray-400">{isSidebarOpen ? "Hide Notes" : "Show Notes"}</span>
        </div>
        
        <Separator orientation="vertical" className="h-8 bg-white/20" />
        
        {/* Text formatting */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => insertMarkdown('**', '**')}
              className="text-gray-300 hover:text-white hover:bg-indigo-600/30 transition-all duration-200 rounded-md border border-white/5"
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
              size="icon"
              onClick={() => insertMarkdown('_', '_')}
              className="text-gray-300 hover:text-white hover:bg-indigo-600/30 transition-all duration-200 rounded-md border border-white/5"
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
              size="icon"
              onClick={() => execCommand("underline", null)}
              className="text-gray-300 hover:text-white hover:bg-indigo-600/30 transition-all duration-200 rounded-md border border-white/5"
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
              size="icon"
              onClick={() => insertMarkdown('# ')}
              className="text-gray-300 hover:text-white hover:bg-indigo-600/30 transition-all duration-200 rounded-md border border-white/5"
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
              size="icon"
              onClick={() => insertMarkdown('> ')}
              className="text-gray-300 hover:text-white hover:bg-indigo-600/30 transition-all duration-200 rounded-md border border-white/5"
            >
              <TextQuote className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Quote ({'>'} Text)</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => insertMarkdown('`', '`')}
              className="text-gray-300 hover:text-white hover:bg-indigo-600/30 transition-all duration-200 rounded-md border border-white/5"
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
              size="icon"
              onClick={() => insertMarkdown('[', '](url)')}
              className="text-gray-300 hover:text-white hover:bg-indigo-600/30 transition-all duration-200 rounded-md border border-white/5"
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
              size="icon"
              onClick={() => insertMarkdown('1. ')}
              className="text-gray-300 hover:text-white hover:bg-indigo-600/30 transition-all duration-200 rounded-md border border-white/5"
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Numbered List (1. item)</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => insertMarkdown('- ')}
              className="text-gray-300 hover:text-white hover:bg-indigo-600/30 transition-all duration-200 rounded-md border border-white/5"
            >
              <List className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Bullet List (- item)</p>
          </TooltipContent>
        </Tooltip>
        
        <Separator orientation="vertical" className="h-8 bg-white/20" />
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => execCommand("justifyLeft", null)}
              className="text-gray-300 hover:text-white hover:bg-indigo-600/30 transition-all duration-200 rounded-md border border-white/5"
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Align Left</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => execCommand("justifyCenter", null)}
              className="text-gray-300 hover:text-white hover:bg-indigo-600/30 transition-all duration-200 rounded-md border border-white/5"
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Align Center</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => execCommand("justifyRight", null)}
              className="text-gray-300 hover:text-white hover:bg-indigo-600/30 transition-all duration-200 rounded-md border border-white/5"
            >
              <AlignRight className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Align Right</p>
          </TooltipContent>
        </Tooltip>
        
        <Separator orientation="vertical" className="h-8 bg-white/20" />
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => execCommand("undo", null)}
              className="text-gray-300 hover:text-white hover:bg-indigo-600/30 transition-all duration-200 rounded-md border border-white/5"
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
              size="icon"
              onClick={() => execCommand("redo", null)}
              className="text-gray-300 hover:text-white hover:bg-indigo-600/30 transition-all duration-200 rounded-md border border-white/5"
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
              size="icon"
              onClick={toggleAI}
              className="text-purple-300 hover:text-white hover:bg-purple-700/40 transition-all duration-200 rounded-md border border-purple-500/20"
            >
              <Sparkles className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>AI Assistance</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSave}
              className="text-blue-300 hover:text-white hover:bg-blue-700/40 transition-all duration-200 rounded-md border border-blue-500/20"
            >
              <Save className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Save Note (Ctrl+S)</p>
          </TooltipContent>
        </Tooltip>
        
        <div className="text-xs ml-auto flex items-center">
          {lastSaved && (
            <span className="text-gray-400 bg-black/30 py-1 px-2.5 rounded-full border border-white/5 shadow-inner">
              <span className="text-blue-400 mr-1">●</span> Saved at {lastSaved.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default TextEditorToolbar;
