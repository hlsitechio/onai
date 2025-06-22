
import React from 'react';
import { Button } from "@/components/ui/button";
import { Sparkles, PanelRight } from "lucide-react";
import { Note } from "@/hooks/useNotesManager";

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
  return (
    <div className="h-14 bg-black/20 border-b border-white/10 flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          className="text-white hover:bg-white/10"
        >
          <PanelRight className={`h-4 w-4 transition-transform ${sidebarOpen ? 'rotate-180' : ''}`} />
        </Button>
        <span className="text-white text-sm">
          {currentNote ? `Note: ${currentNote.title}` : 'No note selected'}
        </span>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={onToggleAIPanel}
        className={`border-noteflow-500/30 text-noteflow-300 hover:bg-noteflow-500/20 hover:text-white transition-colors ${
          aiPanelOpen ? 'bg-noteflow-500/20 text-white' : ''
        }`}
      >
        <Sparkles className="h-4 w-4 mr-2" />
        AI Assistant
      </Button>
    </div>
  );
};

export default NotesEditorTopBar;
