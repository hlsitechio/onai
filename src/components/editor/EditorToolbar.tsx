
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Save, 
  PanelLeft, 
  Sparkles, 
  Focus, 
  Clock,
  Keyboard,
  MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';
import FormatControls from './toolbar/FormatControls';
import HeadingControls from './toolbar/HeadingControls';
import ListControls from './toolbar/ListControls';
import AlignmentControls from './toolbar/AlignmentControls';
import InsertControls from './toolbar/InsertControls';
import ColorControls from './toolbar/ColorControls';
import HistoryControls from './toolbar/HistoryControls';

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

  // Create a proper mock editor object that matches the Tiptap editor interface
  const mockEditor = {
    isActive: (type: string, attrs?: any) => false,
    can: () => ({
      toggleBold: () => true,
      toggleItalic: () => true,
      toggleUnderline: () => true,
      toggleStrike: () => true,
      toggleBulletList: () => true,
      toggleOrderedList: () => true,
      toggleTaskList: () => true,
      undo: () => true,
      redo: () => true,
      chain: () => ({
        focus: () => ({
          undo: () => ({ run: () => true }),
          redo: () => ({ run: () => true })
        })
      })
    }),
    chain: () => ({
      focus: () => ({
        toggleBold: () => ({ run: () => execCommand('bold') }),
        toggleItalic: () => ({ run: () => execCommand('italic') }),
        toggleUnderline: () => ({ run: () => execCommand('underline') }),
        toggleStrike: () => ({ run: () => execCommand('strikethrough') }),
        toggleCode: () => ({ run: () => execCommand('code') }),
        toggleSuperscript: () => ({ run: () => execCommand('superscript') }),
        toggleSubscript: () => ({ run: () => execCommand('subscript') }),
        toggleHeading: (attrs: any) => ({ run: () => execCommand('formatBlock', `h${attrs.level}`) }),
        setParagraph: () => ({ run: () => execCommand('formatBlock', 'p') }),
        toggleBulletList: () => ({ run: () => execCommand('insertUnorderedList') }),
        toggleOrderedList: () => ({ run: () => execCommand('insertOrderedList') }),
        toggleTaskList: () => ({ run: () => execCommand('insertHTML', '<input type="checkbox"> ') }),
        liftListItem: () => ({ run: () => {} }),
        setTextAlign: (align: string) => ({ run: () => execCommand(`justify${align.charAt(0).toUpperCase() + align.slice(1)}`) }),
        undo: () => ({ run: () => execCommand('undo') }),
        redo: () => ({ run: () => execCommand('redo') }),
        setColor: (color: string) => ({ run: () => execCommand('foreColor', color) }),
        toggleHighlight: (attrs: any) => ({ run: () => execCommand('hiliteColor', attrs.color) }),
        insertContent: (content: string) => ({ run: () => execCommand('insertHTML', content) })
      })
    }),
    state: {
      selection: {
        empty: true,
        from: 0
      }
    }
  };

  return (
    <div className={cn(
      "flex flex-col gap-2 p-3 border-b border-white/10 transition-colors",
      isFocusMode 
        ? "bg-black/80 backdrop-blur-xl border-purple-800/30" 
        : "bg-black/40 backdrop-blur-lg"
    )}>
      {/* Top Row - Main Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Left side - Navigation and primary formatting */}
        <div className="flex flex-wrap items-center gap-1">
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

          {/* Basic Formatting */}
          <FormatControls editor={mockEditor as any} />

          <div className="w-px h-6 bg-white/10 mx-1" />

          {/* Headings */}
          <HeadingControls editor={mockEditor as any} />

          <div className="w-px h-6 bg-white/10 mx-1" />

          {/* Color Controls */}
          <ColorControls editor={mockEditor as any} />
        </div>

        {/* Right side - Mode toggles, AI, and save */}
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

      {/* Bottom Row - Secondary Controls (hidden on mobile) */}
      <div className="hidden md:flex flex-wrap items-center justify-between gap-2">
        {/* Left side - Lists, alignment, insert */}
        <div className="flex flex-wrap items-center gap-1">
          {/* Lists */}
          <ListControls editor={mockEditor as any} />

          <div className="w-px h-6 bg-white/10 mx-1" />

          {/* Alignment */}
          <AlignmentControls editor={mockEditor as any} />

          <div className="w-px h-6 bg-white/10 mx-1" />

          {/* Insert Controls */}
          <InsertControls editor={mockEditor as any} />

          <div className="w-px h-6 bg-white/10 mx-1" />

          {/* History Controls */}
          <HistoryControls editor={mockEditor as any} />
        </div>

        {/* Right side - Status info */}
        <div className="flex items-center gap-3">
          {/* Last saved indicator */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Clock className="h-3 w-3" />
            <span>{formatLastSaved(lastSaved)}</span>
          </div>

          {/* AI Shortcut hint */}
          {!isFocusMode && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Keyboard className="h-3 w-3" />
              <span>Ctrl+Shift+A for AI</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditorToolbar;
