
import React from 'react';
import { cn } from '@/lib/utils';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import ToolbarNavigation from './ToolbarNavigation';
import ToolbarFormatting from './ToolbarFormatting';
import ToolbarActions from './ToolbarActions';
import ToolbarStatus from './ToolbarStatus';

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
  saving?: boolean;
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
  toggleFocusMode = () => {},
  saving = false
}) => {
  const { isMobile, isTablet } = useDeviceDetection();

  if (isMobile) {
    // Enhanced mobile layout with more controls
    return (
      <div className={cn(
        "flex flex-col gap-2 px-4 py-3",
        "bg-black/95 backdrop-blur-xl border-b border-white/10",
        "sticky top-0 z-50"
      )}>
        {/* Top row - Navigation and save */}
        <div className="flex items-center justify-between">
          <ToolbarNavigation
            toggleLeftSidebar={toggleLeftSidebar}
            toggleAISidebar={toggleAISidebar}
            toggleFocusMode={toggleFocusMode}
            isLeftSidebarOpen={isLeftSidebarOpen}
            isAISidebarOpen={isAISidebarOpen}
            isFocusMode={isFocusMode}
            isMobile={true}
          />

          <ToolbarActions
            handleSave={handleSave}
            toggleAISidebar={toggleAISidebar}
            isAISidebarOpen={isAISidebarOpen}
            saving={saving}
            isMobile={true}
          />
        </div>

        {/* Bottom row - Formatting controls */}
        <div className="flex items-center justify-between gap-2">
          <ToolbarFormatting editor={editor} />
          <ToolbarStatus lastSaved={lastSaved} isMobile={true} />
        </div>
      </div>
    );
  }

  // Enhanced desktop layout with comprehensive controls
  return (
    <div className={cn(
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
        {/* Left section - Navigation and core formatting */}
        <div className="flex items-center gap-3">
          <ToolbarNavigation
            toggleLeftSidebar={toggleLeftSidebar}
            toggleAISidebar={toggleAISidebar}
            toggleFocusMode={toggleFocusMode}
            isLeftSidebarOpen={isLeftSidebarOpen}
            isAISidebarOpen={isAISidebarOpen}
            isFocusMode={isFocusMode}
            isMobile={false}
          />

          <ToolbarFormatting editor={editor} />
        </div>

        {/* Right section - Actions and status */}
        <div className="flex items-center gap-3">
          <ToolbarStatus lastSaved={lastSaved} isMobile={false} />

          <ToolbarActions
            handleSave={handleSave}
            toggleAISidebar={toggleAISidebar}
            isAISidebarOpen={isAISidebarOpen}
            saving={saving}
            isMobile={false}
          />
        </div>
      </div>
    </div>
  );
};

export default UnifiedToolbar;
