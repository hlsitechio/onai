
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Save, 
  Focus, 
  Clock,
  Keyboard,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ToolbarRenderer from './toolbar/core/ToolbarRenderer';
import { DEFAULT_TOOLBAR_CONFIG } from './toolbar/config/ToolbarConfig';
import QuickActions from './toolbar/QuickActions';

interface ModernEditorToolbarProps {
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

const ModernEditorToolbar: React.FC<ModernEditorToolbarProps> = ({
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
        insertContent: (content: string) => ({ run: () => execCommand('insertHTML', content) }),
        setLink: (attrs: any) => ({ run: () => {} }),
        unsetLink: () => ({ run: () => {} }),
        setImage: (attrs: any) => ({ run: () => {} }),
        toggleBlockquote: () => ({ run: () => {} }),
        toggleCodeBlock: (attrs: any) => ({ run: () => {} })
      })
    }),
    state: {
      selection: {
        empty: true,
        from: 0
      }
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

  return (
    <div className={cn(
      "flex flex-col gap-2 p-3 border-b border-white/10 transition-colors",
      isFocusMode 
        ? "bg-black/80 backdrop-blur-xl border-purple-800/30" 
        : "bg-black/40 backdrop-blur-lg"
    )}>
      {/* Top Row - Navigation and Main Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Left side - Primary toolbar controls */}
        <ToolbarRenderer
          sections={enhancedConfig.slice(0, 4)} // Navigation, Typography, Formatting, Structure
          editor={mockEditor as any}
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

      {/* Bottom Row - Secondary Controls (hidden on mobile) */}
      <div className="hidden md:flex flex-wrap items-center justify-between gap-2">
        {/* Left side - Enhanced formatting controls */}
        <ToolbarRenderer
          sections={enhancedConfig.slice(4)} // Content, Media, Advanced, Tables, Insert, History
          editor={mockEditor as any}
          className="flex-wrap"
        />

        {/* Right side - Status info and quick actions */}
        <div className="flex items-center gap-3">
          {/* Last saved indicator */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Clock className="h-3 w-3" />
            <span>{formatLastSaved(lastSaved)}</span>
          </div>

          {/* Quick Actions */}
          <QuickActions 
            toggleAISidebar={toggleAISidebar}
            isAISidebarOpen={isAISidebarOpen}
          />
        </div>
      </div>
    </div>
  );
};

export default ModernEditorToolbar;
