
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, Focus, Clock } from 'lucide-react';
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

  // Enhanced toolbar configuration with dynamic props
  const enhancedConfig = DEFAULT_TOOLBAR_CONFIG.map(section => ({
    ...section,
    items: section.items.map(item => {
      if (item.component === 'SidebarToggle') {
        return {
          ...item,
          props: {
            isOpen: isLeftSidebarOpen,
            onToggle: toggleLeftSidebar
          }
        };
      }
      return item;
    })
  }));

  // Filter sections based on device type
  const visibleSections = enhancedConfig.filter(section => {
    if (isMobile) {
      // Show only essential sections on mobile
      return ['navigation', 'formatting', 'structure'].includes(section.id);
    }
    if (isTablet) {
      // Show most sections on tablet, hide advanced ones
      return !['advanced', 'tables', 'insert'].includes(section.id);
    }
    // Show all sections on desktop
    return true;
  });

  if (isMobile) {
    // Mobile layout - single row with essential controls
    return (
      <div className="flex items-center justify-between p-2 bg-background border-b border-border">
        <div className="flex items-center gap-1">
          <ToolbarRenderer
            sections={visibleSections.slice(0, 2)}
            editor={editor}
            className="gap-1"
          />
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFocusMode}
            className={cn("p-2", isFocusMode && "bg-accent")}
          >
            <Focus className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost" 
            size="sm"
            onClick={handleSave}
            className="p-2"
          >
            <Save className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  // Desktop/Tablet layout - multi-row with full controls
  return (
    <div className={cn(
      "flex flex-col gap-2 p-3 border-b border-white/10 transition-colors",
      isFocusMode 
        ? "bg-black/80 backdrop-blur-xl border-purple-800/30" 
        : "bg-black/40 backdrop-blur-lg"
    )}>
      {/* Top Row - Navigation and Main Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <ToolbarRenderer
          sections={visibleSections.slice(0, 4)}
          editor={editor}
          className="flex-wrap"
        />

        {/* Right side - Save and Mode toggles */}
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

      {/* Bottom Row - Secondary Controls (hidden on mobile and tablet) */}
      {!isTablet && (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <ToolbarRenderer
            sections={visibleSections.slice(4)}
            editor={editor}
            className="flex-wrap"
          />

          {/* Right side - Status info and quick actions */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Clock className="h-3 w-3" />
              <span>{formatLastSaved(lastSaved)}</span>
            </div>

            <QuickActions 
              toggleAISidebar={toggleAISidebar}
              isAISidebarOpen={isAISidebarOpen}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UnifiedToolbar;
