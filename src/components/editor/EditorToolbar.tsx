
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bold, 
  Italic, 
  Save, 
  PanelLeft, 
  Sparkles, 
  Focus, 
  Clock,
  Keyboard
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface EditorToolbarProps {
  execCommand: (command: string, value?: string | null) => void;
  handleSave: () => void;
  toggleLeftSidebar: () => void;
  toggleAISidebar: () => void;
  isLeftSidebarOpen: boolean;
  isAISidebarOpen: boolean;
  lastSaved?: string;
  isFocusMode?: boolean;
  toggleFocusMode?: () => void;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({
  execCommand,
  handleSave,
  toggleLeftSidebar,
  toggleAISidebar,
  isLeftSidebarOpen,
  isAISidebarOpen,
  lastSaved,
  isFocusMode = false,
  toggleFocusMode = () => {}
}) => {
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

  return (
    <div className={cn(
      "flex items-center justify-between p-3 border-b border-white/10 transition-colors",
      isFocusMode 
        ? "bg-black/80 backdrop-blur-xl border-purple-800/30" 
        : "bg-black/40 backdrop-blur-lg"
    )}>
      {/* Left side - Navigation and basic formatting */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleLeftSidebar}
          className={cn(
            "h-8 w-8 p-0",
            isLeftSidebarOpen 
              ? "text-white bg-white/10" 
              : "text-slate-400 hover:text-white hover:bg-white/10"
          )}
          title="Toggle notes sidebar"
        >
          <PanelLeft className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-white/10 mx-1" />

        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand('bold')}
          className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-white/10"
          title="Bold (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand('italic')}
          className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-white/10"
          title="Italic (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </Button>
      </div>

      {/* Center - Status info */}
      <div className="flex items-center gap-3">
        {/* Last saved indicator */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Clock className="h-3 w-3" />
          <span>{formatLastSaved(lastSaved)}</span>
        </div>

        {/* AI Shortcut hint */}
        {!isFocusMode && (
          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-500">
            <Keyboard className="h-3 w-3" />
            <span>Ctrl+Shift+A for AI</span>
          </div>
        )}
      </div>

      {/* Right side - AI and mode toggles + save */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleFocusMode}
          className={cn(
            "h-8 w-8 p-0",
            isFocusMode 
              ? "text-purple-300 bg-purple-500/20" 
              : "text-slate-400 hover:text-white hover:bg-white/10"
          )}
          title="Toggle focus mode (F11)"
        >
          <Focus className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={toggleAISidebar}
          className={cn(
            "h-8 w-8 p-0 relative",
            isAISidebarOpen 
              ? "text-noteflow-300 bg-noteflow-500/20" 
              : "text-slate-400 hover:text-white hover:bg-white/10"
          )}
          title="Toggle AI sidebar"
        >
          <Sparkles className="h-4 w-4" />
          {isAISidebarOpen && (
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-noteflow-400 rounded-full animate-pulse" />
          )}
        </Button>

        <div className="w-px h-6 bg-white/10 mx-1" />

        <Button
          onClick={handleSave}
          size="sm"
          className="bg-noteflow-500 hover:bg-noteflow-600 text-white px-3 h-8"
          title="Save note (Ctrl+S)"
        >
          <Save className="h-3 w-3 mr-1" />
          Save
        </Button>
      </div>
    </div>
  );
};

export default EditorToolbar;
