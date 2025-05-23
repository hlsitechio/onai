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
  Minimize,
  PanelLeft,
  Focus,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { cn, formatDistanceToNow } from "@/lib/utils";

interface TextEditorToolbarProps {
  execCommand: (command: string, value: string | null) => void;
  handleSave: () => void;
  toggleSidebar: () => void;
  toggleAI: () => void;
  isSidebarOpen: boolean;
  isAISidebarOpen?: boolean;
  lastSaved: Date | null;
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
    <div className={cn(
      "flex flex-wrap items-center justify-between p-2 md:p-3 transition-all duration-300",
      isFocusMode 
        ? "bg-black/70 backdrop-blur-xl border-b border-purple-800/20" 
        : "bg-black/40 backdrop-blur-lg border-b border-white/10"
    )}>
      {/* Left side - formatting tools */}
      <div className="flex flex-wrap items-center gap-1 md:gap-2">
        {/* Sidebar toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2"
          title="Toggle Notes Sidebar"
        >
          <PanelLeft className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-white/10"></div>

        {/* Formatting buttons */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand('bold')}
          className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2"
          title="Bold (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand('italic')}
          className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2"
          title="Italic (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand('underline')}
          className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2"
          title="Underline (Ctrl+U)"
        >
          <Underline className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-white/10 hidden md:block"></div>

        {/* Alignment buttons - hidden on mobile */}
        <div className="hidden md:flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => execCommand('justifyLeft')}
            className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2"
            title="Align Left"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => execCommand('justifyCenter')}
            className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2"
            title="Align Center"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => execCommand('justifyRight')}
            className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2"
            title="Align Right"
          >
            <AlignRight className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-white/10"></div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => execCommand('undo')}
            className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2"
            title="Undo (Ctrl+Z)"
          >
            <Undo className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => execCommand('redo')}
            className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2"
            title="Redo (Ctrl+Y)"
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Right side - actions */}
      <div className="flex items-center gap-1 md:gap-2 ml-auto">
        {/* Last saved indicator */}
        {lastSaved && (
          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 mr-2">
            <Clock className="h-3 w-3" />
            <span>Saved {formatDistanceToNow(lastSaved, { addSuffix: true })}</span>
          </div>
        )}

        {/* Focus mode toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleFocusMode}
          className={cn(
            "p-1.5 md:p-2",
            isFocusMode 
              ? "text-purple-300 bg-purple-500/20 hover:bg-purple-500/30" 
              : "text-slate-300 hover:text-white hover:bg-white/10"
          )}
          title={isFocusMode ? "Exit Focus Mode" : "Enter Focus Mode"}
        >
          <Focus className="h-4 w-4" />
        </Button>

        {/* AI Sidebar toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleAI}
          className={cn(
            "p-1.5 md:p-2",
            isAISidebarOpen 
              ? "text-noteflow-300 bg-noteflow-500/20 hover:bg-noteflow-500/30" 
              : "text-slate-300 hover:text-white hover:bg-white/10"
          )}
          title="Toggle AI Sidebar"
        >
          <Sparkles className="h-4 w-4" />
        </Button>

        {/* Save button */}
        <Button
          onClick={handleSave}
          size="sm"
          className="bg-noteflow-500 hover:bg-noteflow-600 text-white p-1.5 md:p-2 px-3 md:px-4"
          title="Save Note (Ctrl+S)"
        >
          <Save className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">Save</span>
        </Button>
      </div>
    </div>
  );
};

export default TextEditorToolbar;
