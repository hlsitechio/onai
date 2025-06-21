
import React from 'react';
import { Bold, Italic, Underline, Strikethrough, Code, Heading1, Heading2, Heading3, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, AlignJustify, Undo, Redo, Camera, Link, Image, Highlighter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Editor } from '@tiptap/react';

interface OptimizedToolbarProps {
  editor: Editor;
  onCameraOCRClick: () => void;
  isCameraOCRProcessing: boolean;
  characterCount: number;
  characterLimit: number;
}

const OptimizedToolbar: React.FC<OptimizedToolbarProps> = ({
  editor,
  onCameraOCRClick,
  isCameraOCRProcessing,
  characterCount,
  characterLimit
}) => {
  if (!editor) return null;

  const formatButtons = [
    {
      icon: Bold,
      isActive: () => editor.isActive('bold'),
      onClick: () => editor.chain().focus().toggleBold().run(),
      title: 'Bold (Ctrl+B)',
    },
    {
      icon: Italic,
      isActive: () => editor.isActive('italic'),
      onClick: () => editor.chain().focus().toggleItalic().run(),
      title: 'Italic (Ctrl+I)',
    },
    {
      icon: Underline,
      isActive: () => editor.isActive('underline'),
      onClick: () => editor.chain().focus().toggleUnderline().run(),
      title: 'Underline (Ctrl+U)',
    },
    {
      icon: Strikethrough,
      isActive: () => editor.isActive('strike'),
      onClick: () => editor.chain().focus().toggleStrike().run(),
      title: 'Strikethrough',
    },
    {
      icon: Code,
      isActive: () => editor.isActive('code'),
      onClick: () => editor.chain().focus().toggleCode().run(),
      title: 'Inline Code',
    },
    {
      icon: Highlighter,
      isActive: () => editor.isActive('highlight'),
      onClick: () => editor.chain().focus().toggleHighlight().run(),
      title: 'Highlight',
    },
  ];

  const headingButtons = [
    {
      icon: Heading1,
      level: 1 as const,
      isActive: () => editor.isActive('heading', { level: 1 }),
      onClick: () => {
        if (editor.isActive('heading', { level: 1 })) {
          editor.chain().focus().setParagraph().run();
        } else {
          editor.chain().focus().toggleHeading({ level: 1 }).run();
        }
      },
      title: 'Heading 1',
    },
    {
      icon: Heading2,
      level: 2 as const,
      isActive: () => editor.isActive('heading', { level: 2 }),
      onClick: () => {
        if (editor.isActive('heading', { level: 2 })) {
          editor.chain().focus().setParagraph().run();
        } else {
          editor.chain().focus().toggleHeading({ level: 2 }).run();
        }
      },
      title: 'Heading 2',
    },
    {
      icon: Heading3,
      level: 3 as const,
      isActive: () => editor.isActive('heading', { level: 3 }),
      onClick: () => {
        if (editor.isActive('heading', { level: 3 })) {
          editor.chain().focus().setParagraph().run();
        } else {
          editor.chain().focus().toggleHeading({ level: 3 }).run();
        }
      },
      title: 'Heading 3',
    },
  ];

  const listButtons = [
    {
      icon: List,
      isActive: () => editor.isActive('bulletList'),
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      title: 'Bullet List',
    },
    {
      icon: ListOrdered,
      isActive: () => editor.isActive('orderedList'),
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      title: 'Numbered List',
    },
  ];

  const alignmentButtons = [
    {
      icon: AlignLeft,
      alignment: 'left',
      isActive: () => editor.isActive({ textAlign: 'left' }) || (!editor.isActive({ textAlign: 'center' }) && !editor.isActive({ textAlign: 'right' }) && !editor.isActive({ textAlign: 'justify' })),
      onClick: () => editor.chain().focus().setTextAlign('left').run(),
      title: 'Align Left',
    },
    {
      icon: AlignCenter,
      alignment: 'center',
      isActive: () => editor.isActive({ textAlign: 'center' }),
      onClick: () => editor.chain().focus().setTextAlign('center').run(),
      title: 'Align Center',
    },
    {
      icon: AlignRight,
      alignment: 'right',
      isActive: () => editor.isActive({ textAlign: 'right' }),
      onClick: () => editor.chain().focus().setTextAlign('right').run(),
      title: 'Align Right',
    },
    {
      icon: AlignJustify,
      alignment: 'justify',
      isActive: () => editor.isActive({ textAlign: 'justify' }),
      onClick: () => editor.chain().focus().setTextAlign('justify').run(),
      title: 'Justify',
    },
  ];

  const historyButtons = [
    {
      icon: Undo,
      onClick: () => editor.chain().focus().undo().run(),
      canExecute: () => editor.can().chain().focus().undo().run(),
      title: 'Undo (Ctrl+Z)',
    },
    {
      icon: Redo,
      onClick: () => editor.chain().focus().redo().run(),
      canExecute: () => editor.can().chain().focus().redo().run(),
      title: 'Redo (Ctrl+Y)',
    },
  ];

  const handleLinkInsert = () => {
    const url = window.prompt('Enter URL:');
    if (url) {
      if (editor.state.selection.empty) {
        const text = window.prompt('Enter link text:') || url;
        editor.chain().focus().insertContent(`<a href="${url}">${text}</a>`).run();
      } else {
        editor.chain().focus().setLink({ href: url }).run();
      }
    }
  };

  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const url = event.target?.result as string;
          if (url) {
            editor.chain().focus().setImage({ src: url }).run();
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  return (
    <div className="flex items-center gap-1 flex-wrap toolbar bg-[#27202C] rounded-lg p-2">
      {/* Format controls */}
      <div className="flex items-center gap-1">
        {formatButtons.map((button, index) => {
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
                  : "text-gray-300 hover:text-white"
              )}
              title={button.title}
            >
              <Icon className="h-4 w-4" />
            </Button>
          );
        })}
      </div>

      <div className="w-px h-6 bg-white/10" />

      {/* Heading controls */}
      <div className="flex items-center gap-1">
        {headingButtons.map((button) => {
          const Icon = button.icon;
          const isActive = button.isActive();
          return (
            <Button
              key={button.level}
              variant="ghost"
              size="sm"
              onClick={button.onClick}
              className={cn(
                "h-8 w-8 p-0 hover:bg-white/10 transition-colors",
                isActive 
                  ? "bg-white/20 text-white" 
                  : "text-gray-300 hover:text-white"
              )}
              title={button.title}
            >
              <Icon className="h-4 w-4" />
            </Button>
          );
        })}
      </div>

      <div className="w-px h-6 bg-white/10" />

      {/* List controls */}
      <div className="flex items-center gap-1">
        {listButtons.map((button, index) => {
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
                  : "text-gray-300 hover:text-white"
              )}
              title={button.title}
            >
              <Icon className="h-4 w-4" />
            </Button>
          );
        })}
      </div>

      <div className="w-px h-6 bg-white/10 hidden md:block" />

      {/* Alignment controls - hidden on mobile */}
      <div className="hidden md:flex items-center gap-1">
        {alignmentButtons.map((button) => {
          const Icon = button.icon;
          const isActive = button.isActive();
          return (
            <Button
              key={button.alignment}
              variant="ghost"
              size="sm"
              onClick={button.onClick}
              className={cn(
                "h-8 w-8 p-0 hover:bg-white/10 transition-colors",
                isActive 
                  ? "bg-white/20 text-white" 
                  : "text-gray-300 hover:text-white"
              )}
              title={button.title}
            >
              <Icon className="h-4 w-4" />
            </Button>
          );
        })}
      </div>

      <div className="w-px h-6 bg-white/10" />

      {/* Insert controls */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLinkInsert}
          className={cn(
            "h-8 w-8 p-0 hover:bg-white/10 transition-colors",
            editor.isActive('link') 
              ? "bg-white/20 text-white" 
              : "text-gray-300 hover:text-white"
          )}
          title="Insert Link"
        >
          <Link className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleImageUpload}
          className="h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
          title="Insert Image"
        >
          <Image className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onCameraOCRClick}
          disabled={isCameraOCRProcessing}
          className="h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
          title="Camera OCR"
        >
          <Camera className="h-4 w-4" />
        </Button>
      </div>

      <div className="w-px h-6 bg-white/10" />

      {/* History controls */}
      <div className="flex items-center gap-1">
        {historyButtons.map((button, index) => {
          const Icon = button.icon;
          const canExecute = button.canExecute();
          return (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={button.onClick}
              disabled={!canExecute}
              className={cn(
                "h-8 w-8 p-0 hover:bg-white/10 transition-colors",
                canExecute
                  ? "text-gray-300 hover:text-white"
                  : "text-gray-500 cursor-not-allowed"
              )}
              title={button.title}
            >
              <Icon className="h-4 w-4" />
            </Button>
          );
        })}
      </div>

      {/* Character count */}
      <div className="ml-auto text-xs text-gray-400 hidden sm:block">
        {characterCount}/{characterLimit}
      </div>
    </div>
  );
};

export default OptimizedToolbar;
