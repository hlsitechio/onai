
import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
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
  Quote,
  Minus,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link,
  Image,
  Table,
  Highlighter,
  Palette,
  CheckSquare,
  Type,
  FileCode
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface TiptapToolbarProps {
  editor: Editor;
}

const TiptapToolbar: React.FC<TiptapToolbarProps> = ({ editor }) => {
  const [linkUrl, setLinkUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [textColor, setTextColor] = useState('#ffffff');
  const [highlightColor, setHighlightColor] = useState('#fbbf24');

  const addLink = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl('');
    }
  };

  const addImage = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl('');
    }
  };

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  const setColor = () => {
    editor.chain().focus().setColor(textColor).run();
  };

  const setHighlight = () => {
    editor.chain().focus().setHighlight({ color: highlightColor }).run();
  };

  const ToolbarButton = ({ 
    onClick, 
    isActive = false, 
    children, 
    title 
  }: { 
    onClick: () => void; 
    isActive?: boolean; 
    children: React.ReactNode; 
    title: string 
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
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-white/10 bg-black/40">
      {/* Text Formatting */}
      <div className="flex items-center gap-1">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
          title="Underline"
        >
          <Underline className="h-4 w-4" />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive('strike')}
          title="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive('code')}
          title="Inline Code"
        >
          <Code className="h-4 w-4" />
        </ToolbarButton>
      </div>

      <Separator orientation="vertical" className="h-6" />

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

      <Separator orientation="vertical" className="h-6" />

      {/* Text Alignment */}
      <div className="flex items-center gap-1">
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          isActive={editor.isActive({ textAlign: 'left' })}
          title="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          isActive={editor.isActive({ textAlign: 'center' })}
          title="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          isActive={editor.isActive({ textAlign: 'right' })}
          title="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          isActive={editor.isActive({ textAlign: 'justify' })}
          title="Justify"
        >
          <AlignJustify className="h-4 w-4" />
        </ToolbarButton>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Lists and Blocks */}
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
          title="Ordered List"
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          isActive={editor.isActive('taskList')}
          title="Task List"
        >
          <CheckSquare className="h-4 w-4" />
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
          <FileCode className="h-4 w-4" />
        </ToolbarButton>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Colors and Highlighting */}
      <div className="flex items-center gap-1">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-white/10"
              title="Text Color"
            >
              <Palette className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 bg-gray-900 border-gray-700">
            <div className="space-y-2">
              <Input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="w-full h-8"
              />
              <Button onClick={setColor} size="sm" className="w-full">
                Apply Color
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-white/10",
                editor.isActive('highlight') && "bg-white/20 text-white"
              )}
              title="Highlight"
            >
              <Highlighter className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 bg-gray-900 border-gray-700">
            <div className="space-y-2">
              <Input
                type="color"
                value={highlightColor}
                onChange={(e) => setHighlightColor(e.target.value)}
                className="w-full h-8"
              />
              <Button onClick={setHighlight} size="sm" className="w-full">
                Apply Highlight
              </Button>
              <Button 
                onClick={() => editor.chain().focus().unsetHighlight().run()} 
                size="sm" 
                variant="outline" 
                className="w-full"
              >
                Remove Highlight
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Media and Links */}
      <div className="flex items-center gap-1">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-white/10",
                editor.isActive('link') && "bg-white/20 text-white"
              )}
              title="Add Link"
            >
              <Link className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 bg-gray-900 border-gray-700">
            <div className="space-y-2">
              <Input
                placeholder="Enter URL..."
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addLink()}
              />
              <div className="flex gap-2">
                <Button onClick={addLink} size="sm" disabled={!linkUrl}>
                  Add Link
                </Button>
                <Button 
                  onClick={() => editor.chain().focus().unsetLink().run()} 
                  size="sm" 
                  variant="outline"
                >
                  Remove Link
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-white/10"
              title="Add Image"
            >
              <Image className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 bg-gray-900 border-gray-700">
            <div className="space-y-2">
              <Input
                placeholder="Enter image URL..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addImage()}
              />
              <Button onClick={addImage} size="sm" disabled={!imageUrl}>
                Add Image
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        
        <ToolbarButton
          onClick={insertTable}
          title="Insert Table"
        >
          <Table className="h-4 w-4" />
        </ToolbarButton>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* History */}
      <div className="flex items-center gap-1">
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          title="Undo"
        >
          <Undo className="h-4 w-4" />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          title="Redo"
        >
          <Redo className="h-4 w-4" />
        </ToolbarButton>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Divider */}
      <div className="flex items-center gap-1">
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal Rule"
        >
          <Minus className="h-4 w-4" />
        </ToolbarButton>
      </div>
    </div>
  );
};

export default TiptapToolbar;
