
import React from "react";
import { 
  Bold, 
  Italic, 
  Save,
  Sparkles,
  Menu,
  Focus,
  PanelLeft,
  MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MobileToolbarProps {
  execCommand: (command: string, value?: string | null) => void;
  handleSave: () => void;
  toggleSidebar: () => void;
  toggleAI: () => void;
  isSidebarOpen: boolean;
  isAISidebarOpen?: boolean;
  isFocusMode?: boolean;
  toggleFocusMode?: () => void;
  onShowMore?: () => void;
}

const MobileToolbar: React.FC<MobileToolbarProps> = ({
  execCommand,
  handleSave,
  toggleSidebar,
  toggleAI,
  isSidebarOpen,
  isAISidebarOpen,
  isFocusMode = false,
  toggleFocusMode = () => {},
  onShowMore
}) => {
  return (
    <div className={cn(
      "flex items-center justify-between p-3 transition-all duration-300",
      isFocusMode 
        ? "bg-black/80 backdrop-blur-xl border-b border-purple-800/30" 
        : "bg-black/50 backdrop-blur-lg border-b border-white/20"
    )}>
      {/* Left side - main actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="text-slate-300 hover:text-white hover:bg-white/20 p-2 h-10 w-10"
          title="Notes"
        >
          <PanelLeft className="h-5 w-5" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand('bold', null)}
          className="text-slate-300 hover:text-white hover:bg-white/20 p-2 h-10 w-10"
          title="Bold"
        >
          <Bold className="h-5 w-5" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand('italic', null)}
          className="text-slate-300 hover:text-white hover:bg-white/20 p-2 h-10 w-10"
          title="Italic"
        >
          <Italic className="h-5 w-5" />
        </Button>
      </div>

      {/* Right side - secondary actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleFocusMode}
          className={cn(
            "p-2 h-10 w-10",
            isFocusMode 
              ? "text-purple-300 bg-purple-500/30 hover:bg-purple-500/40" 
              : "text-slate-300 hover:text-white hover:bg-white/20"
          )}
          title="Focus Mode"
        >
          <Focus className="h-5 w-5" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={toggleAI}
          className={cn(
            "p-2 h-10 w-10",
            isAISidebarOpen 
              ? "text-noteflow-300 bg-noteflow-500/30 hover:bg-noteflow-500/40" 
              : "text-slate-300 hover:text-white hover:bg-white/20"
          )}
          title="AI Assistant"
        >
          <Sparkles className="h-5 w-5" />
        </Button>

        <Button
          onClick={handleSave}
          size="sm"
          className="bg-noteflow-500 hover:bg-noteflow-600 text-white px-4 h-10"
          title="Save"
        >
          <Save className="h-4 w-4 mr-1" />
          <span>Save</span>
        </Button>
      </div>
    </div>
  );
};

export default MobileToolbar;
