
import React from "react";
import { Save, Focus, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, formatDistanceToNow } from "@/lib/utils";
import AIActionsDropdown from "../notes/AIActionsDropdown";

interface ToolbarStatusProps {
  handleSave: () => void;
  lastSaved: Date | null;
  isFocusMode: boolean;
  toggleFocusMode: () => void;
  content: string;
  onApplyAIChanges: (newContent: string) => void;
  onToggleAIAgent: () => void;
  isAIAgentVisible: boolean;
}

const ToolbarStatus: React.FC<ToolbarStatusProps> = ({
  handleSave,
  lastSaved,
  isFocusMode,
  toggleFocusMode,
  content,
  onApplyAIChanges,
  onToggleAIAgent,
  isAIAgentVisible
}) => {
  return (
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

      {/* AI Agent Actions Dropdown */}
      <AIActionsDropdown
        content={content}
        onApplyChanges={onApplyAIChanges}
        onToggleAIAgent={onToggleAIAgent}
        isAIAgentVisible={isAIAgentVisible}
      />
    </div>
  );
};

export default ToolbarStatus;
