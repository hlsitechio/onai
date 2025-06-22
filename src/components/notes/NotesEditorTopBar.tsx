
import React from 'react';
import { Button } from "@/components/ui/button";
import { Sparkles, PanelRight, FileText, Bold, Italic, Underline, Strikethrough, Code, Heading1, Heading2, Heading3, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Type, ChevronDown, Palette } from "lucide-react";
import { Note } from "@/hooks/useNotesManager";
import { cn } from "@/lib/utils";

interface NotesEditorTopBarProps {
  currentNote: Note | null;
  sidebarOpen: boolean;
  aiPanelOpen: boolean;
  onToggleSidebar: () => void;
  onToggleAIPanel: () => void;
}

const NotesEditorTopBar: React.FC<NotesEditorTopBarProps> = ({
  currentNote,
  sidebarOpen,
  aiPanelOpen,
  onToggleSidebar,
  onToggleAIPanel,
}) => {
  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
  };

  const formatButtons = [
    { icon: Bold, command: 'bold', title: 'Bold (Ctrl+B)' },
    { icon: Italic, command: 'italic', title: 'Italic (Ctrl+I)' },
    { icon: Underline, command: 'underline', title: 'Underline (Ctrl+U)' },
    { icon: Strikethrough, command: 'strikeThrough', title: 'Strikethrough' },
  ];

  const headingButtons = [
    { icon: Heading1, command: 'formatBlock', value: 'h1', title: 'Heading 1' },
    { icon: Heading2, command: 'formatBlock', value: 'h2', title: 'Heading 2' },
    { icon: Heading3, command: 'formatBlock', value: 'h3', title: 'Heading 3' },
  ];

  const listButtons = [
    { icon: List, command: 'insertUnorderedList', title: 'Bullet List' },
    { icon: ListOrdered, command: 'insertOrderedList', title: 'Numbered List' },
  ];

  const alignButtons = [
    { icon: AlignLeft, command: 'justifyLeft', title: 'Align Left' },
    { icon: AlignCenter, command: 'justifyCenter', title: 'Align Center' },
    { icon: AlignRight, command: 'justifyRight', title: 'Align Right' },
  ];

  return (
    <div className="h-16 bg-gradient-to-r from-[#1a1a1a] to-[#1e1e1e] border-b border-gray-700/50 flex items-center px-6 gap-4 shadow-lg">
      {/* Left section - Notes toggle with enhanced styling */}
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          className={cn(
            "h-10 px-4 text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-200 rounded-lg border border-transparent",
            sidebarOpen && "bg-gray-700/30 text-white border-gray-600/50"
          )}
        >
          <PanelRight className={`h-4 w-4 mr-2 transition-transform duration-200 ${sidebarOpen ? 'rotate-180' : ''}`} />
          <span className="text-sm font-medium">Notes</span>
        </Button>
      </div>

      {/* Enhanced separator */}
      <div className="w-px h-8 bg-gradient-to-b from-transparent via-gray-600 to-transparent" />

      {/* Format controls section */}
      <div className="flex items-center bg-gray-800/30 rounded-lg p-1 border border-gray-700/30">
        {formatButtons.map((button, index) => {
          const Icon = button.icon;
          return (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={() => execCommand(button.command, button.value)}
              className="h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-gray-600/50 transition-all duration-150 rounded-md mx-0.5"
              title={button.title}
            >
              <Icon className="h-4 w-4" />
            </Button>
          );
        })}
        
        <div className="w-px h-6 bg-gray-600/50 mx-1" />
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand('formatBlock', 'code')}
          className="h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-gray-600/50 transition-all duration-150 rounded-md"
          title="Code"
        >
          <Code className="h-4 w-4" />
        </Button>
      </div>

      {/* Enhanced separator */}
      <div className="w-px h-8 bg-gradient-to-b from-transparent via-gray-600 to-transparent" />

      {/* Heading controls section */}
      <div className="flex items-center bg-gray-800/30 rounded-lg p-1 border border-gray-700/30">
        {headingButtons.map((button, index) => {
          const Icon = button.icon;
          return (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={() => execCommand(button.command, button.value)}
              className="h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-gray-600/50 transition-all duration-150 rounded-md mx-0.5"
              title={button.title}
            >
              <Icon className="h-4 w-4" />
            </Button>
          );
        })}
        
        <div className="w-px h-6 bg-gray-600/50 mx-1" />
        
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-3 text-gray-300 hover:text-white hover:bg-gray-600/50 transition-all duration-150 rounded-md flex items-center gap-1.5"
          title="More Headings"
        >
          <Type className="h-3.5 w-3.5" />
          <ChevronDown className="h-3 w-3" />
        </Button>
      </div>

      {/* Enhanced separator */}
      <div className="w-px h-8 bg-gradient-to-b from-transparent via-gray-600 to-transparent" />

      {/* List controls section */}
      <div className="flex items-center bg-gray-800/30 rounded-lg p-1 border border-gray-700/30">
        {listButtons.map((button, index) => {
          const Icon = button.icon;
          return (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={() => execCommand(button.command)}
              className="h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-gray-600/50 transition-all duration-150 rounded-md mx-0.5"
              title={button.title}
            >
              <Icon className="h-4 w-4" />
            </Button>
          );
        })}
      </div>

      {/* Enhanced separator */}
      <div className="w-px h-8 bg-gradient-to-b from-transparent via-gray-600 to-transparent" />

      {/* Align controls section */}
      <div className="flex items-center bg-gray-800/30 rounded-lg p-1 border border-gray-700/30">
        {alignButtons.map((button, index) => {
          const Icon = button.icon;
          return (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={() => execCommand(button.command)}
              className="h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-gray-600/50 transition-all duration-150 rounded-md mx-0.5"
              title={button.title}
            >
              <Icon className="h-4 w-4" />
            </Button>
          );
        })}
      </div>

      {/* Enhanced separator */}
      <div className="w-px h-8 bg-gradient-to-b from-transparent via-gray-600 to-transparent" />

      {/* Color control section */}
      <div className="flex items-center bg-gray-800/30 rounded-lg p-1 border border-gray-700/30">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-3 text-gray-300 hover:text-white hover:bg-gray-600/50 transition-all duration-150 rounded-md flex items-center gap-1.5"
          title="Text Color"
        >
          <Palette className="h-3.5 w-3.5" />
          <div className="w-3 h-3 bg-blue-500 rounded-sm border border-gray-500/50" />
          <ChevronDown className="h-3 w-3" />
        </Button>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right section - AI with enhanced styling */}
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleAIPanel}
          className={cn(
            "h-10 px-4 text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-200 rounded-lg border border-transparent flex items-center gap-2",
            aiPanelOpen && "bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-300 border-blue-500/30 shadow-lg shadow-blue-500/10"
          )}
        >
          <Sparkles className={cn("h-4 w-4", aiPanelOpen && "animate-pulse")} />
          <span className="text-sm font-medium">AI Assistant</span>
        </Button>
      </div>
    </div>
  );
};

export default NotesEditorTopBar;
