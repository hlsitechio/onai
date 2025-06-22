
import React from 'react';
import { Button } from "@/components/ui/button";
import { Sparkles, PanelRight, FileText, Bold, Italic, Underline, Strikethrough, Code, Heading1, Heading2, Heading3, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Type } from "lucide-react";
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
    { icon: Bold, command: 'bold', title: 'Bold' },
    { icon: Italic, command: 'italic', title: 'Italic' },
    { icon: Underline, command: 'underline', title: 'Underline' },
    { icon: Strikethrough, command: 'strikeThrough', title: 'Strikethrough' },
    { icon: Code, command: 'formatBlock', value: 'code', title: 'Code' },
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
    <div className="h-14 bg-[#1a1a1a] border-b border-gray-700 flex items-center px-4 gap-1">
      {/* Left section - Notes toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggleSidebar}
        className={cn(
          "h-8 px-3 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors rounded-md",
          sidebarOpen && "bg-gray-700 text-white"
        )}
      >
        <PanelRight className={`h-4 w-4 mr-2 transition-transform ${sidebarOpen ? 'rotate-180' : ''}`} />
        <span className="text-sm font-medium">Notes</span>
      </Button>

      {/* Separator */}
      <div className="w-px h-6 bg-gray-600 mx-2" />

      {/* Format controls */}
      <div className="flex items-center gap-1">
        {formatButtons.map((button, index) => {
          const Icon = button.icon;
          return (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={() => execCommand(button.command, button.value)}
              className="h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors rounded-sm"
              title={button.title}
            >
              <Icon className="h-4 w-4" />
            </Button>
          );
        })}
      </div>

      {/* Separator */}
      <div className="w-px h-6 bg-gray-600 mx-2" />

      {/* Heading controls */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-3 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors rounded-sm flex items-center gap-1"
          title="Headings"
        >
          <Type className="h-4 w-4" />
          <span className="text-xs">Headings</span>
        </Button>
      </div>

      {/* Separator */}
      <div className="w-px h-6 bg-gray-600 mx-2" />

      {/* List controls */}
      <div className="flex items-center gap-1">
        {listButtons.map((button, index) => {
          const Icon = button.icon;
          return (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={() => execCommand(button.command)}
              className="h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors rounded-sm"
              title={button.title}
            >
              <Icon className="h-4 w-4" />
            </Button>
          );
        })}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-3 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors rounded-sm flex items-center gap-1"
          title="Lists"
        >
          <span className="text-xs">Lists</span>
        </Button>
      </div>

      {/* Separator */}
      <div className="w-px h-6 bg-gray-600 mx-2" />

      {/* Align controls */}
      <div className="flex items-center gap-1">
        {alignButtons.map((button, index) => {
          const Icon = button.icon;
          return (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={() => execCommand(button.command)}
              className="h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors rounded-sm"
              title={button.title}
            >
              <Icon className="h-4 w-4" />
            </Button>
          );
        })}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-3 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors rounded-sm flex items-center gap-1"
          title="Align"
        >
          <span className="text-xs">Align</span>
        </Button>
      </div>

      {/* Separator */}
      <div className="w-px h-6 bg-gray-600 mx-2" />

      {/* Color control */}
      <Button
        variant="ghost"
        size="sm"
        className="h-8 px-3 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors rounded-sm flex items-center gap-1"
        title="Color"
      >
        <div className="w-4 h-4 bg-blue-500 rounded-sm border border-gray-500" />
        <span className="text-xs">Color</span>
      </Button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right section - AI */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggleAIPanel}
        className={cn(
          "h-8 px-3 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors rounded-md flex items-center gap-2",
          aiPanelOpen && "bg-blue-600/20 text-blue-300 border border-blue-500/30"
        )}
      >
        <Sparkles className="h-4 w-4" />
        <span className="text-sm font-medium">AI</span>
      </Button>
    </div>
  );
};

export default NotesEditorTopBar;
