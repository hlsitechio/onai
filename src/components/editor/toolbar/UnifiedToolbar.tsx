import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, Focus, Clock, PanelLeft, Sparkles, ChevronDown, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { useToolbarActions } from '@/hooks/useToolbarActions';
import FormatControls from './FormatControls';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
  const { execCommand } = useToolbarActions(editor);

  const formatLastSaved = (timestamp?: string) => {
    if (!timestamp) return 'Not saved';
    
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      
      if (diffInMinutes < 1) return 'Just saved to Supabase';
      if (diffInMinutes < 60) return `Saved ${diffInMinutes}m ago`;
      if (diffInMinutes < 1440) return `Saved ${Math.floor(diffInMinutes / 60)}h ago`;
      return `Saved ${date.toLocaleDateString()}`;
    } catch {
      return 'Save time unknown';
    }
  };

  // Heading options
  const headingOptions = [
    { label: 'Normal Text', value: 'p', command: () => execCommand('formatBlock', 'p') },
    { label: 'Heading 1', value: 'h1', command: () => execCommand('formatBlock', 'h1') },
    { label: 'Heading 2', value: 'h2', command: () => execCommand('formatBlock', 'h2') },
    { label: 'Heading 3', value: 'h3', command: () => execCommand('formatBlock', 'h3') },
    { label: 'Heading 4', value: 'h4', command: () => execCommand('formatBlock', 'h4') },
    { label: 'Heading 5', value: 'h5', command: () => execCommand('formatBlock', 'h5') },
    { label: 'Heading 6', value: 'h6', command: () => execCommand('formatBlock', 'h6') },
  ];

  // List options
  const listOptions = [
    { label: 'Bullet List', command: () => execCommand('insertUnorderedList') },
    { label: 'Numbered List', command: () => execCommand('insertOrderedList') },
  ];

  // Alignment options
  const alignmentOptions = [
    { label: 'Align Left', command: () => execCommand('justifyLeft') },
    { label: 'Align Center', command: () => execCommand('justifyCenter') },
    { label: 'Align Right', command: () => execCommand('justifyRight') },
    { label: 'Justify', command: () => execCommand('justifyFull') },
  ];

  // Color options
  const colorOptions = [
    { label: 'Black', value: '#000000' },
    { label: 'White', value: '#ffffff' },
    { label: 'Red', value: '#ef4444' },
    { label: 'Blue', value: '#3b82f6' },
    { label: 'Green', value: '#22c55e' },
    { label: 'Yellow', value: '#eab308' },
    { label: 'Purple', value: '#a855f7' },
    { label: 'Pink', value: '#ec4899' },
  ];

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

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleAISidebar}
              className={cn(
                "h-9 px-2 transition-colors",
                isAISidebarOpen 
                  ? "text-purple-300 bg-purple-500/20" 
                  : "text-white/70 hover:text-white hover:bg-white/10"
              )}
            >
              <Sparkles className="h-4 w-4 mr-1" />
              AI
            </Button>
            
            <Button
              onClick={handleSave}
              size="sm"
              disabled={saving}
              className="bg-purple-600 hover:bg-purple-700 text-white px-3 h-9 transition-colors disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="animate-spin h-4 w-4 mr-1 border-2 border-white/30 border-t-white rounded-full" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Bottom row - Formatting controls */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <FormatControls editor={editor} />
          </div>
          
          {/* Show save status on mobile */}
          {lastSaved && (
            <div className="flex items-center gap-1 text-xs text-purple-300">
              <CheckCircle className="h-3 w-3" />
              <span>Saved</span>
            </div>
          )}
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

          {/* Format Controls */}
          <FormatControls editor={editor} />

          {/* Headings dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-3 text-white/70 hover:text-white hover:bg-white/10"
              >
                Headings
                <ChevronDown className="h-3 w-3 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#27202C] border-white/10 text-white">
              {headingOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={option.command}
                  className="hover:bg-white/10 focus:bg-white/10"
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Lists dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-3 text-white/70 hover:text-white hover:bg-white/10"
              >
                Lists
                <ChevronDown className="h-3 w-3 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#27202C] border-white/10 text-white">
              {listOptions.map((option, idx) => (
                <DropdownMenuItem
                  key={idx}
                  onClick={option.command}
                  className="hover:bg-white/10 focus:bg-white/10"
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Alignment dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-3 text-white/70 hover:text-white hover:bg-white/10"
              >
                Align
                <ChevronDown className="h-3 w-3 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#27202C] border-white/10 text-white">
              {alignmentOptions.map((option, idx) => (
                <DropdownMenuItem
                  key={idx}
                  onClick={option.command}
                  className="hover:bg-white/10 focus:bg-white/10"
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Text Color dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-3 text-white/70 hover:text-white hover:bg-white/10"
              >
                Color
                <ChevronDown className="h-3 w-3 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#27202C] border-white/10 text-white">
              {colorOptions.map((color) => (
                <DropdownMenuItem
                  key={color.value}
                  onClick={() => execCommand('foreColor', color.value)}
                  className="hover:bg-white/10 focus:bg-white/10 flex items-center gap-2"
                >
                  <div 
                    className="w-4 h-4 rounded border border-white/20" 
                    style={{ backgroundColor: color.value }}
                  />
                  {color.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Additional controls */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => execCommand('createLink', prompt('Enter URL:'))}
              className="h-8 px-2 text-white/70 hover:text-white hover:bg-white/10"
              title="Insert Link"
            >
              🔗
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => execCommand('undo')}
              className="h-8 px-2 text-white/70 hover:text-white hover:bg-white/10"
              title="Undo"
            >
              ↶
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => execCommand('redo')}
              className="h-8 px-2 text-white/70 hover:text-white hover:bg-white/10"
              title="Redo"
            >
              ↷
            </Button>
          </div>
        </div>

        {/* Right section - Actions and status */}
        <div className="flex items-center gap-3">
          {lastSaved && (
            <div className="flex items-center gap-2 text-sm text-white/70">
              <CheckCircle className="h-4 w-4 text-green-400" />
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
            disabled={saving}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 h-9 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <div className="animate-spin h-4 w-4 mr-2 border-2 border-white/30 border-t-white rounded-full" />
                Saving to Supabase...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save to Supabase
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UnifiedToolbar;
