
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, Focus, Clock, PanelLeft, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { useToolbarActions } from '@/hooks/useToolbarActions';
import ToolbarRenderer from './core/ToolbarRenderer';
import { DEFAULT_TOOLBAR_CONFIG } from './config/ToolbarConfig';
import QuickActions from './QuickActions';

interface UnifiedToolbarProps {
  editor?: any;
  handleSave: () => void;
  toggleLeftSidebar: () => void;
  toggleAISidebar: () => void;
  isLeftSidebarOpen: boolean;
  isAISidebarOpen: boolean;
  lastSaved?: string;
  isFocusMode?: boolean;
  toggleFocusMode?: () => void;
}

const UnifiedToolbar: React.FC<UnifiedToolbarProps> = ({
  editor,
  handleSave,
  toggleLeftSidebar,
  toggleAISidebar,
  isLeftSidebarOpen,
  isAISidebarOpen,
  lastSaved,
  isFocusMode = false,
  toggleFocusMode = () => {}
}) => {
  const { isMobile, isTablet } = useDeviceDetection();
  const { execCommand } = useToolbarActions(editor);

  const formatLastSaved = (timestamp?: string) => {
    if (!timestamp) return 'Not saved';
    
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      
      if (diffInMinutes < 1) return 'Just saved';
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
      return date.toLocaleDateString();
    } catch {
      return 'Save time unknown';
    }
  };

  if (isMobile) {
    // Enhanced mobile layout
    return (
      <div className={cn(
        "flex items-center justify-between px-4 py-3",
        "bg-black/95 backdrop-blur-xl border-b border-white/10",
        "sticky top-0 z-50"
      )}>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLeftSidebar}
            className={cn(
              "h-9 w-9 p-0 transition-colors",
              isLeftSidebarOpen 
                ? "text-purple-300 bg-purple-500/20" 
                : "text-white/70 hover:text-white hover:bg-white/10"
            )}
          >
            <PanelLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => execCommand('bold')}
              className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/10"
            >
              <strong>B</strong>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => execCommand('italic')}
              className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/10 italic"
            >
              I
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => execCommand('underline')}
              className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/10 underline"
            >
              U
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
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
          
          <Button
            onClick={handleSave}
            size="sm"
            className="bg-purple-600 hover:bg-purple-700 text-white px-3 h-9 transition-colors"
          >
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
        </div>
      </div>
    );
  }

  // Enhanced desktop layout
  return (
    <div className={cn(
      // Ensure clean styling without old interface conflicts
      "!m-0 !p-0 !border-0 !outline-0",
      "flex flex-col gap-3 p-4 border-b border-white/10",
      "transition-all duration-300 ease-in-out",
      "sticky top-0 z-50",
      isFocusMode 
        ? "bg-black/98 backdrop-blur-xl border-purple-500/30" 
        : "bg-black/90 backdrop-blur-lg"
    )}>
      {/* Main toolbar row */}
      <div className="flex items-center justify-between gap-4">
        {/* Left section - Navigation and formatting */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLeftSidebar}
            className={cn(
              "h-9 px-3 transition-colors",
              isLeftSidebarOpen 
                ? "text-purple-300 bg-purple-500/20" 
                : "text-white/70 hover:text-white hover:bg-white/10"
            )}
          >
            <PanelLeft className="h-4 w-4 mr-2" />
            Notes
          </Button>

          <div className="w-px h-6 bg-white/10" />

          {/* Quick formatting buttons */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => execCommand('bold')}
              className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/10 font-bold"
            >
              B
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => execCommand('italic')}
              className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/10 italic"
            >
              I
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => execCommand('underline')}
              className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/10 underline"
            >
              U
            </Button>
          </div>
        </div>

        {/* Right section - Actions and status */}
        <div className="flex items-center gap-3">
          {lastSaved && (
            <div className="flex items-center gap-2 text-sm text-white/50">
              <Clock className="h-3 w-3" />
              <span>{formatLastSaved(lastSaved)}</span>
            </div>
          )}

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

          <Button
            onClick={handleSave}
            size="sm"
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 h-9 transition-colors shadow-lg"
          >
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UnifiedToolbar;
