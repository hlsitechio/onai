
import React from 'react';
import { Note } from "@/hooks/useNotesManager";
import FormatButtonGroup from "./toolbar/FormatButtonGroup";
import HeadingButtonGroup from "./toolbar/HeadingButtonGroup";
import ListButtonGroup from "./toolbar/ListButtonGroup";
import AlignmentButtonGroup from "./toolbar/AlignmentButtonGroup";
import ColorButtonGroup from "./toolbar/ColorButtonGroup";
import ToolbarSeparator from "./toolbar/ToolbarSeparator";
import SidebarToggle from "./toolbar/SidebarToggle";
import AIAssistantToggle from "./toolbar/AIAssistantToggle";

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

  return (
    <div className="h-16 bg-gradient-to-r from-[#1a1a1a] to-[#1e1e1e] border-b border-gray-700/50 flex items-center px-6 gap-4 shadow-lg">
      {/* Left section - Notes toggle */}
      <div className="flex items-center">
        <SidebarToggle 
          sidebarOpen={sidebarOpen}
          onToggleSidebar={onToggleSidebar}
        />
      </div>

      <ToolbarSeparator />

      {/* Format controls section */}
      <FormatButtonGroup execCommand={execCommand} />

      <ToolbarSeparator />

      {/* Heading controls section */}
      <HeadingButtonGroup execCommand={execCommand} />

      <ToolbarSeparator />

      {/* List controls section */}
      <ListButtonGroup execCommand={execCommand} />

      <ToolbarSeparator />

      {/* Align controls section */}
      <AlignmentButtonGroup execCommand={execCommand} />

      <ToolbarSeparator />

      {/* Color control section */}
      <ColorButtonGroup />

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right section - AI Assistant */}
      <div className="flex items-center">
        <AIAssistantToggle 
          aiPanelOpen={aiPanelOpen}
          onToggleAIPanel={onToggleAIPanel}
        />
      </div>
    </div>
  );
};

export default NotesEditorTopBar;
