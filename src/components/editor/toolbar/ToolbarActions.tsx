
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToolbarActionsProps {
  handleSave: () => void;
  toggleAISidebar: () => void;
  isAISidebarOpen: boolean;
  saving: boolean;
  isMobile: boolean;
}

const ToolbarActions: React.FC<ToolbarActionsProps> = ({
  handleSave,
  toggleAISidebar,
  isAISidebarOpen,
  saving,
  isMobile
}) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleAISidebar}
        className={cn(
          isMobile ? "h-9 px-2" : "h-9 px-3",
          "transition-colors",
          isAISidebarOpen 
            ? "text-purple-300 bg-purple-500/20" 
            : "text-white/70 hover:text-white hover:bg-white/10"
        )}
      >
        <Sparkles className="h-4 w-4 mr-1" />
        AI
      </Button>
    </div>
  );
};

export default ToolbarActions;
