
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Highlighter,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Editor } from '@tiptap/react';

interface TiptapEnhancedToolbarProps {
  editor: Editor;
  onAIClick?: () => void;
}

const TiptapEnhancedToolbar: React.FC<TiptapEnhancedToolbarProps> = ({
  editor,
  onAIClick
}) => {
  if (!editor) return null;

  // Safe command execution with error handling
  const safeToggleCommand = (commandName: string, commandFn: () => boolean) => {
    try {
      if (editor.can()[commandName] && editor.can()[commandName]()) {
        return commandFn();
      } else {
        console.warn(`Command ${commandName} not available`);
        return false;
      }
    } catch (error) {
      console.error(`Error executing ${commandName}:`, error);
      return false;
    }
  };

  // Safe highlight toggle with validation
  const handleHighlight = () => {
    try {
      // Check if highlight extension is available
      if (editor.can().toggleHighlight) {
        return editor.chain().focus().toggleHighlight().run();
      } else {
        console.warn('Highlight extension not available');
        return false;
      }
    } catch (error) {
      console.error('Error toggling highlight:', error);
      return false;
    }
  };

  const formatButtons = [
    {
      icon: Bold,
      isActive: () => editor.isActive('bold'),
      onClick: () => safeToggleCommand('toggleBold', () => editor.chain().focus().toggleBold().run()),
      title: 'Bold (Ctrl+B)',
    },
    {
      icon: Italic,
      isActive: () => editor.isActive('italic'),
      onClick: () => safeToggleCommand('toggleItalic', () => editor.chain().focus().toggleItalic().run()),
      title: 'Italic (Ctrl+I)',
    },
    {
      icon: Underline,
      isActive: () => editor.isActive('underline'),
      onClick: () => safeToggleCommand('toggleUnderline', () => editor.chain().focus().toggleUnderline().run()),
      title: 'Underline (Ctrl+U)',
    },
    {
      icon: Code,
      isActive: () => editor.isActive('code'),
      onClick: () => safeToggleCommand('toggleCode', () => editor.chain().focus().toggleCode().run()),
      title: 'Inline Code',
    },
    {
      icon: Highlighter,
      isActive: () => editor.isActive('highlight'),
      onClick: handleHighlight,
      title: 'Highlight',
    },
  ];

  const headingButtons = [
    {
      icon: Heading1,
      isActive: () => editor.isActive('heading', { level: 1 }),
      onClick: () => safeToggleCommand('toggleHeading', () => editor.chain().focus().toggleHeading({ level: 1 }).run()),
      title: 'Heading 1',
    },
    {
      icon: Heading2,
      isActive: () => editor.isActive('heading', { level: 2 }),
      onClick: () => safeToggleCommand('toggleHeading', () => editor.chain().focus().toggleHeading({ level: 2 }).run()),
      title: 'Heading 2',
    },
    {
      icon: Heading3,
      isActive: () => editor.isActive('heading', { level: 3 }),
      onClick: () => safeToggleCommand('toggleHeading', () => editor.chain().focus().toggleHeading({ level: 3 }).run()),
      title: 'Heading 3',
    },
  ];

  const listButtons = [
    {
      icon: List,
      isActive: () => editor.isActive('bulletList'),
      onClick: () => safeToggleCommand('toggleBulletList', () => editor.chain().focus().toggleBulletList().run()),
      title: 'Bullet List',
    },
    {
      icon: ListOrdered,
      isActive: () => editor.isActive('orderedList'),
      onClick: () => safeToggleCommand('toggleOrderedList', () => editor.chain().focus().toggleOrderedList().run()),
      title: 'Numbered List',
    },
  ];

  const alignmentButtons = [
    {
      icon: AlignLeft,
      isActive: () => editor.isActive({ textAlign: 'left' }),
      onClick: () => safeToggleCommand('setTextAlign', () => editor.chain().focus().setTextAlign('left').run()),
      title: 'Align Left',
    },
    {
      icon: AlignCenter,
      isActive: () => editor.isActive({ textAlign: 'center' }),
      onClick: () => safeToggleCommand('setTextAlign', () => editor.chain().focus().setTextAlign('center').run()),
      title: 'Align Center',
    },
    {
      icon: AlignRight,
      isActive: () => editor.isActive({ textAlign: 'right' }),
      onClick: () => safeToggleCommand('setTextAlign', () => editor.chain().focus().setTextAlign('right').run()),
      title: 'Align Right',
    },
  ];

  const historyButtons = [
    {
      icon: Undo,
      isActive: () => false,
      onClick: () => safeToggleCommand('undo', () => editor.chain().focus().undo().run()),
      title: 'Undo (Ctrl+Z)',
    },
    {
      icon: Redo,
      isActive: () => false,
      onClick: () => safeToggleCommand('redo', () => editor.chain().focus().redo().run()),
      title: 'Redo (Ctrl+Y)',
    },
  ];

  const renderButtonGroup = (buttons: typeof formatButtons, showOnMobile = true) => (
    <div className={cn("flex items-center gap-1", !showOnMobile && "hidden md:flex")}>
      {buttons.map((button, index) => {
        const Icon = button.icon;
        const isActive = button.isActive();
        return (
          <Button
            key={index}
            variant="ghost"
            size="sm"
            onClick={button.onClick}
            className={cn(
              "h-8 w-8 p-0 hover:bg-white/10 transition-colors",
              isActive 
                ? "bg-white/20 text-white" 
                : "text-gray-400 hover:text-white"
            )}
            title={button.title}
          >
            <Icon className="h-4 w-4" />
          </Button>
        );
      })}
    </div>
  );

  return (
    <div className="flex items-center justify-between p-2 border-b border-white/10 bg-black/40 backdrop-blur-lg">
      {/* Left side - formatting controls */}
      <div className="flex items-center gap-2 overflow-x-auto">
        {renderButtonGroup(formatButtons)}
        
        <div className="w-px h-6 bg-white/10" />
        
        {renderButtonGroup(headingButtons, false)}

        <div className="w-px h-6 bg-white/10" />

        {renderButtonGroup(listButtons)}

        <div className="w-px h-6 bg-white/10 hidden md:block" />

        {renderButtonGroup(alignmentButtons, false)}
      </div>

      {/* Right side - AI and history */}
      <div className="flex items-center gap-1">
        <div className="hidden md:flex items-center gap-1">
          {renderButtonGroup(historyButtons, false)}
          <div className="w-px h-6 bg-white/10 mx-1" />
        </div>

        {onAIClick && (
          <Button
            onClick={onAIClick}
            size="sm"
            variant="ghost"
            className="h-8 px-2 text-noteflow-300 hover:text-noteflow-200 hover:bg-noteflow-500/20"
            title="Open AI Agent (Ctrl+Shift+A)"
          >
            <Sparkles className="h-3 w-3 mr-1" />
            <span className="text-xs">AI</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default TiptapEnhancedToolbar;
