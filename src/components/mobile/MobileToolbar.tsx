
import React from "react";
import { Bold, Italic, Save, Sparkles, Menu, Focus, PanelLeft, MoreHorizontal } from "lucide-react";
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
    <div className="flex items-center justify-between p-2 bg-background border-b border-border">
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className={cn("p-2", isSidebarOpen && "bg-accent")}
        >
          <Menu className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand('bold')}
          className="p-2"
        >
          <Bold className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand('italic')}
          className="p-2"
        >
          <Italic className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-1">
        {toggleFocusMode && (
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFocusMode}
            className={cn("p-2", isFocusMode && "bg-accent")}
          >
            <Focus className="h-4 w-4" />
          </Button>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleAI}
          className={cn("p-2", isAISidebarOpen && "bg-accent")}
        >
          <Sparkles className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSave}
          className="p-2"
        >
          <Save className="h-4 w-4" />
        </Button>

        {onShowMore && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onShowMore}
            className="p-2"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default MobileToolbar;
