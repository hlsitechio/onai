
import React from 'react';
import { type Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Quote,
  Minus,
  Undo,
  Redo,
  Camera,
  Loader2
} from 'lucide-react';

interface TiptapEnhancedToolbarProps {
  editor: Editor;
  onCameraOCRClick?: () => void;
  isCameraOCRProcessing?: boolean;
}

const TiptapEnhancedToolbar: React.FC<TiptapEnhancedToolbarProps> = ({
  editor,
  onCameraOCRClick,
  isCameraOCRProcessing = false
}) => {
  const formatButtons = [
    {
      name: 'bold',
      icon: Bold,
      isActive: () => editor.isActive('bold'),
      command: () => editor.chain().focus().toggleBold().run(),
      title: 'Bold (Ctrl+B)'
    },
    {
      name: 'italic',
      icon: Italic,
      isActive: () => editor.isActive('italic'),
      command: () => editor.chain().focus().toggleItalic().run(),
      title: 'Italic (Ctrl+I)'
    },
    {
      name: 'underline',
      icon: Underline,
      isActive: () => editor.isActive('underline'),
      command: () => editor.chain().focus().toggleUnderline().run(),
      title: 'Underline (Ctrl+U)'
    },
    {
      name: 'strike',
      icon: Strikethrough,
      isActive: () => editor.isActive('strike'),
      command: () => editor.chain().focus().toggleStrike().run(),
      title: 'Strikethrough'
    },
    {
      name: 'code',
      icon: Code,
      isActive: () => editor.isActive('code'),
      command: () => editor.chain().focus().toggleCode().run(),
      title: 'Inline Code'
    }
  ];

  const alignButtons = [
    {
      name: 'left',
      icon: AlignLeft,
      isActive: () => editor.isActive({ textAlign: 'left' }),
      command: () => editor.chain().focus().setTextAlign('left').run(),
      title: 'Align Left'
    },
    {
      name: 'center',
      icon: AlignCenter,
      isActive: () => editor.isActive({ textAlign: 'center' }),
      command: () => editor.chain().focus().setTextAlign('center').run(),
      title: 'Align Center'
    },
    {
      name: 'right',
      icon: AlignRight,
      isActive: () => editor.isActive({ textAlign: 'right' }),
      command: () => editor.chain().focus().setTextAlign('right').run(),
      title: 'Align Right'
    }
  ];

  const listButtons = [
    {
      name: 'bulletList',
      icon: List,
      isActive: () => editor.isActive('bulletList'),
      command: () => editor.chain().focus().toggleBulletList().run(),
      title: 'Bullet List'
    },
    {
      name: 'orderedList',
      icon: ListOrdered,
      isActive: () => editor.isActive('orderedList'),
      command: () => editor.chain().focus().toggleOrderedList().run(),
      title: 'Numbered List'
    }
  ];

  return (
    <div className="flex items-center gap-1 p-2 flex-wrap">
      {/* History Controls */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className="h-8 w-8 p-0"
        title="Undo"
      >
        <Undo className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className="h-8 w-8 p-0"
        title="Redo"
      >
        <Redo className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Format Controls */}
      {formatButtons.map((button) => (
        <Button
          key={button.name}
          variant="ghost"
          size="sm"
          onClick={button.command}
          className={`h-8 w-8 p-0 ${button.isActive() ? 'bg-accent' : ''}`}
          title={button.title}
        >
          <button.icon className="h-4 w-4" />
        </Button>
      ))}

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Alignment Controls */}
      {alignButtons.map((button) => (
        <Button
          key={button.name}
          variant="ghost"
          size="sm"
          onClick={button.command}
          className={`h-8 w-8 p-0 ${button.isActive() ? 'bg-accent' : ''}`}
          title={button.title}
        >
          <button.icon className="h-4 w-4" />
        </Button>
      ))}

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* List Controls */}
      {listButtons.map((button) => (
        <Button
          key={button.name}
          variant="ghost"
          size="sm"
          onClick={button.command}
          className={`h-8 w-8 p-0 ${button.isActive() ? 'bg-accent' : ''}`}
          title={button.title}
        >
          <button.icon className="h-4 w-4" />
        </Button>
      ))}

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Additional Controls */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`h-8 w-8 p-0 ${editor.isActive('blockquote') ? 'bg-accent' : ''}`}
        title="Quote"
      >
        <Quote className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className="h-8 w-8 p-0"
        title="Horizontal Rule"
      >
        <Minus className="h-4 w-4" />
      </Button>

      {/* Camera OCR Button */}
      {onCameraOCRClick && (
        <>
          <Separator orientation="vertical" className="h-6 mx-1" />
          <Button
            variant="ghost"
            size="sm"
            onClick={onCameraOCRClick}
            disabled={isCameraOCRProcessing}
            className="h-8 w-8 p-0"
            title="Camera OCR"
          >
            {isCameraOCRProcessing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Camera className="h-4 w-4" />
            )}
          </Button>
        </>
      )}
    </div>
  );
};

export default TiptapEnhancedToolbar;
