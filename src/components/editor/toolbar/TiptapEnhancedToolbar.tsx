import React from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { 
  Bold, 
  Italic, 
  Underline, 
  Heading1, 
  Heading2, 
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Undo,
  Redo,
  Link,
  Highlighter
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TiptapEnhancedToolbarProps {
  editor: Editor;
}

const TiptapEnhancedToolbar: React.FC<TiptapEnhancedToolbarProps> = ({ editor }) => {
  if (!editor) return null;

  const ToolbarButton = ({ 
    onClick, 
    isActive = false, 
    children, 
    title 
  }: { 
    onClick: () => void; 
    isActive?: boolean; 
    children: React.ReactNode;
    title: string;
  }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={cn(
        "h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-white/10",
        isActive && "bg-white/20 text-white"
      )}
      title={title}
    >
      {children}
    </Button>
  );

  return (
    <div className="flex items-center gap-1 p-2 border-b border-white/10 bg-black/20 backdrop-blur-sm">
      {/* Text formatting */}
      <div className="flex items-center gap-1">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          title="Bold (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          title="Italic (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
          title="Underline (Ctrl+U)"
        >
          <Underline className="h-4 w-4" />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          isActive={editor.isActive('highlight')}
          title="Highlight"
        >
          <Highlighter className="h-4 w-4" />
        </ToolbarButton>
      </div>

      <div className="w-px h-6 bg-white/20" />

      {/* Headings */}
      <div className="flex items-center gap-1">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive('heading', { level: 1 })}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive('heading', { level: 3 })}
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </ToolbarButton>
      </div>

      <div className="w-px h-6 bg-white/20" />

      {/* Lists and blocks */}
      <div className="flex items-center gap-1">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive('codeBlock')}
          title="Code Block"
        >
          <Code className="h-4 w-4" />
        </ToolbarButton>
      </div>

      <div className="w-px h-6 bg-white/20" />

      {/* Undo/Redo */}
      <div className="flex items-center gap-1">
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          title="Undo (Ctrl+Z)"
        >
          <Undo className="h-4 w-4" />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          title="Redo (Ctrl+Y)"
        >
          <Redo className="h-4 w-4" />
        </ToolbarButton>
      </div>
    </div>
  );
};

export default TiptapEnhancedToolbar;
