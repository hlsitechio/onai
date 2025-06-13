
import React from 'react';
import { 
  Bold, Italic, Underline, Strikethrough, Code,
  Heading1, Heading2, Heading3,
  List, ListOrdered,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Image, Link, Table,
  Undo, Redo,
  Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Editor } from '@tiptap/react';

interface TiptapToolbarProps {
  editor: Editor;
  onSave?: () => void;
}

const TiptapToolbar: React.FC<TiptapToolbarProps> = ({ editor, onSave }) => {
  if (!editor) {
    return null;
  }

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
          editor.chain().focus().setImage({ src: url }).run();
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleLinkInsert = () => {
    const url = window.prompt('Enter URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const handleTableInsert = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  const ToolbarButton = ({ 
    icon: Icon, 
    isActive = false, 
    onClick, 
    title, 
    disabled = false 
  }: {
    icon: React.ComponentType<{ className?: string }>;
    isActive?: boolean;
    onClick: () => void;
    title: string;
    disabled?: boolean;
  }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "h-8 w-8 p-0 hover:bg-white/10",
        isActive 
          ? "bg-white/20 text-white" 
          : disabled
          ? "text-gray-500 cursor-not-allowed"
          : "text-gray-300 hover:text-white"
      )}
      title={title}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );

  const Separator = () => <div className="w-px h-6 bg-white/20 mx-1" />;

  return (
    <div className={cn(
      "sticky top-0 z-10 flex flex-wrap items-center gap-1 p-3",
      "bg-black/80 backdrop-blur-sm border-b border-white/10",
      "overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20"
    )}>
      {/* Text Formatting */}
      <div className="flex items-center gap-1">
        <ToolbarButton
          icon={Bold}
          isActive={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Bold (Ctrl+B)"
        />
        <ToolbarButton
          icon={Italic}
          isActive={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Italic (Ctrl+I)"
        />
        <ToolbarButton
          icon={Underline}
          isActive={editor.isActive('underline')}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          title="Underline (Ctrl+U)"
        />
        <ToolbarButton
          icon={Strikethrough}
          isActive={editor.isActive('strike')}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          title="Strikethrough"
        />
        <ToolbarButton
          icon={Code}
          isActive={editor.isActive('code')}
          onClick={() => editor.chain().focus().toggleCode().run()}
          title="Inline Code"
        />
      </div>

      <Separator />

      {/* Headings */}
      <div className="flex items-center gap-1">
        <ToolbarButton
          icon={Heading1}
          isActive={editor.isActive('heading', { level: 1 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          title="Heading 1"
        />
        <ToolbarButton
          icon={Heading2}
          isActive={editor.isActive('heading', { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          title="Heading 2"
        />
        <ToolbarButton
          icon={Heading3}
          isActive={editor.isActive('heading', { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          title="Heading 3"
        />
      </div>

      <Separator />

      {/* Lists */}
      <div className="flex items-center gap-1">
        <ToolbarButton
          icon={List}
          isActive={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Bullet List"
        />
        <ToolbarButton
          icon={ListOrdered}
          isActive={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Numbered List"
        />
      </div>

      <Separator />

      {/* Text Alignment */}
      <div className="flex items-center gap-1">
        <ToolbarButton
          icon={AlignLeft}
          isActive={editor.isActive({ textAlign: 'left' })}
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          title="Align Left"
        />
        <ToolbarButton
          icon={AlignCenter}
          isActive={editor.isActive({ textAlign: 'center' })}
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          title="Align Center"
        />
        <ToolbarButton
          icon={AlignRight}
          isActive={editor.isActive({ textAlign: 'right' })}
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          title="Align Right"
        />
        <ToolbarButton
          icon={AlignJustify}
          isActive={editor.isActive({ textAlign: 'justify' })}
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          title="Justify"
        />
      </div>

      <Separator />

      {/* Insert Elements */}
      <div className="flex items-center gap-1">
        <ToolbarButton
          icon={Image}
          onClick={handleImageUpload}
          title="Insert Image"
        />
        <ToolbarButton
          icon={Link}
          isActive={editor.isActive('link')}
          onClick={handleLinkInsert}
          title="Insert Link"
        />
        <ToolbarButton
          icon={Table}
          onClick={handleTableInsert}
          title="Insert Table"
        />
      </div>

      <Separator />

      {/* History */}
      <div className="flex items-center gap-1">
        <ToolbarButton
          icon={Undo}
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          title="Undo (Ctrl+Z)"
        />
        <ToolbarButton
          icon={Redo}
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          title="Redo (Ctrl+Y)"
        />
      </div>

      {/* Save Button */}
      {onSave && (
        <>
          <Separator />
          <Button
            variant="ghost"
            size="sm"
            onClick={onSave}
            className="h-8 px-3 bg-blue-600 hover:bg-blue-700 text-white"
            title="Save (Ctrl+S)"
          >
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
        </>
      )}
    </div>
  );
};

export default TiptapToolbar;
