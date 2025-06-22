
import React from 'react';
import { Button } from "@/components/ui/button";
import { Sparkles, PanelRight, FileText, Save } from "lucide-react";
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
  return (
    <div className="h-16 bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 flex items-center justify-between px-6">
      {/* Left section */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          className={cn(
            "h-9 px-3 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-200",
            sidebarOpen && "bg-slate-700/50 text-white"
          )}
        >
          <PanelRight className={`h-4 w-4 transition-transform duration-200 ${sidebarOpen ? 'rotate-180' : ''}`} />
        </Button>
        
        <div className="flex items-center gap-2 text-slate-300">
          <FileText className="h-4 w-4" />
          <span className="text-sm font-medium">
            {currentNote ? currentNote.title : 'No note selected'}
          </span>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleAIPanel}
          className={cn(
            "border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:text-white hover:border-slate-500 transition-all duration-200",
            aiPanelOpen && "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-400/50 text-white shadow-lg shadow-blue-500/10"
          )}
        >
          <Sparkles className="h-4 w-4 mr-2" />
          AI Assistant
        </Button>
      </div>
    </div>
  );
};

export default NotesEditorTopBar;
