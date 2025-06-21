
import React from 'react';
import { Button } from '@/components/ui/button';
import { PanelLeft, Focus, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToolbarNavigationProps {
  toggleLeftSidebar: () => void;
  toggleAISidebar: () => void;
  toggleFocusMode: () => void;
  isLeftSidebarOpen: boolean;
  isAISidebarOpen: boolean;
  isFocusMode: boolean;
  isMobile: boolean;
}

const ToolbarNavigation: React.FC<ToolbarNavigationProps> = ({
  toggleLeftSidebar,
  toggleAISidebar,
  toggleFocusMode,
  isLeftSidebarOpen,
  isAISidebarOpen,
  isFocusMode,
  isMobile
}) => {
  if (isMobile) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleLeftSidebar}
          className={cn(
            "h-9 px-3 transition-colors flex items-center gap-2",
            isLeftSidebarOpen 
              ? "text-purple-300 bg-purple-500/20 border border-purple-500/30" 
              : "text-white/70 hover:text-white hover:bg-white/10"
          )}
        >
          <PanelLeft className="h-4 w-4" />
          <span className="text-sm font-medium">Notes</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleFocusMode}
          className={cn(
            "h-9 w-9 p-0 transition-colors",
            isFocusMode 
              ? "text-purple-300 bg-purple-500/20" 
              : "text-white/70 hover:text-white hover:bg-white/10"
          )}
        >
          <Focus className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleLeftSidebar}
        className={cn(
          "h-9 px-4 transition-colors flex items-center gap-2 rounded-lg",
          isLeftSidebarOpen 
            ? "text-purple-300 bg-purple-500/20 border border-purple-500/30 shadow-sm" 
            : "text-white/70 hover:text-white hover:bg-white/10 border border-transparent"
        )}
      >
        <PanelLeft className="h-4 w-4" />
        <span className="text-sm font-medium">Notes</span>
      </Button>

      <div className="w-px h-6 bg-white/10" />

      <Button
        variant="ghost"
        size="sm"
        onClick={toggleAISidebar}
        className={cn(
          "h-9 px-3 transition-colors",
          isAISidebarOpen 
            ? "text-purple-300 bg-purple-500/20" 
            : "text-white/70 hover:text-white hover:bg-white/10"
        )}
      >
        <Sparkles className="h-4 w-4 mr-2" />
        AI
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={toggleFocusMode}
        className={cn(
          "h-9 w-9 p-0 transition-colors",
          isFocusMode 
            ? "text-purple-300 bg-purple-500/20" 
            : "text-white/70 hover:text-white hover:bg-white/10"
        )}
        title="Toggle focus mode (F11)"
      >
        <Focus className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ToolbarNavigation;
