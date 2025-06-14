
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
  CheckSquare,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Image,
  Link,
  Undo,
  Redo,
  Quote,
  Minus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Editor } from '@tiptap/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TiptapEnhancedToolbarProps {
  editor: Editor;
}

const TiptapEnhancedToolbar: React.FC<TiptapEnhancedToolbarProps> = ({ editor }) => {
  const [linkUrl, setLinkUrl] = React.useState('');
  const [isLinkPopoverOpen, setIsLinkPopoverOpen] = React.useState(false);

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

  const handleLinkSet = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl('');
      setIsLinkPopoverOpen(false);
    }
  };

  const handleLinkUnset = () => {
    editor.chain().focus().unsetLink().run();
    setIsLinkPopoverOpen(false);
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-white/10 bg-black/40 backdrop-blur-lg overflow-x-auto">
      {/* Text Formatting */}
      <div className="flex items-center gap-1">
        <Button
          onClick={() => editor.chain().focus().toggleBold().run()}
          size="sm"
          variant="ghost"
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive('bold') 
              ? "bg-white/20 text-white" 
              : "text-white/70 hover:text-white hover:bg-white/10"
          )}
          title="Bold (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </Button>
        
        <Button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          size="sm"
          variant="ghost"
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive('italic') 
              ? "bg-white/20 text-white" 
              : "text-white/70 hover:text-white hover:bg-white/10"
          )}
          title="Italic (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </Button>
        
        <Button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          size="sm"
          variant="ghost"
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive('underline') 
              ? "bg-white/20 text-white" 
              : "text-white/70 hover:text-white hover:bg-white/10"
          )}
          title="Underline (Ctrl+U)"
        >
          <Underline className="h-4 w-4" />
        </Button>

        <Button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          size="sm"
          variant="ghost"
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive('strike') 
              ? "bg-white/20 text-white" 
              : "text-white/70 hover:text-white hover:bg-white/10"
          )}
          title="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </Button>

        <Button
          onClick={() => editor.chain().focus().toggleCode().run()}
          size="sm"
          variant="ghost"
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive('code') 
              ? "bg-white/20 text-white" 
              : "text-white/70 hover:text-white hover:bg-white/10"
          )}
          title="Inline Code"
        >
          <Code className="h-4 w-4" />
        </Button>
      </div>

      <div className="w-px h-6 bg-white/10 mx-1" />

      {/* Headings Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 px-2 text-white/70 hover:text-white hover:bg-white/10"
            title="Headings"
          >
            <Heading1 className="h-4 w-4 mr-1" />
            Heading
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-black/90 border-white/10">
          <DropdownMenuItem 
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={cn(
              "text-white hover:bg-white/10",
              editor.isActive('heading', { level: 1 }) && "bg-white/20"
            )}
          >
            <Heading1 className="h-4 w-4 mr-2" />
            Heading 1
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={cn(
              "text-white hover:bg-white/10",
              editor.isActive('heading', { level: 2 }) && "bg-white/20"
            )}
          >
            <Heading2 className="h-4 w-4 mr-2" />
            Heading 2
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={cn(
              "text-white hover:bg-white/10",
              editor.isActive('heading', { level: 3 }) && "bg-white/20"
            )}
          >
            <Heading3 className="h-4 w-4 mr-2" />
            Heading 3
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={cn(
              "text-white hover:bg-white/10",
              !editor.isActive('heading') && "bg-white/20"
            )}
          >
            Normal Text
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="w-px h-6 bg-white/10 mx-1" />

      {/* Lists */}
      <div className="flex items-center gap-1">
        <Button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          size="sm"
          variant="ghost"
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive('bulletList') 
              ? "bg-white/20 text-white" 
              : "text-white/70 hover:text-white hover:bg-white/10"
          )}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>

        <Button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          size="sm"
          variant="ghost"
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive('orderedList') 
              ? "bg-white/20 text-white" 
              : "text-white/70 hover:text-white hover:bg-white/10"
          )}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <Button
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          size="sm"
          variant="ghost"
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive('taskList') 
              ? "bg-white/20 text-white" 
              : "text-white/70 hover:text-white hover:bg-white/10"
          )}
          title="Task List"
        >
          <CheckSquare className="h-4 w-4" />
        </Button>
      </div>

      <div className="w-px h-6 bg-white/10 mx-1" />

      {/* Text Alignment */}
      <div className="flex items-center gap-1">
        <Button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          size="sm"
          variant="ghost"
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive({ textAlign: 'left' }) 
              ? "bg-white/20 text-white" 
              : "text-white/70 hover:text-white hover:bg-white/10"
          )}
          title="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>

        <Button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          size="sm"
          variant="ghost"
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive({ textAlign: 'center' }) 
              ? "bg-white/20 text-white" 
              : "text-white/70 hover:text-white hover:bg-white/10"
          )}
          title="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>

        <Button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          size="sm"
          variant="ghost"
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive({ textAlign: 'right' }) 
              ? "bg-white/20 text-white" 
              : "text-white/70 hover:text-white hover:bg-white/10"
          )}
          title="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </Button>

        <Button
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          size="sm"
          variant="ghost"
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive({ textAlign: 'justify' }) 
              ? "bg-white/20 text-white" 
              : "text-white/70 hover:text-white hover:bg-white/10"
          )}
          title="Justify"
        >
          <AlignJustify className="h-4 w-4" />
        </Button>
      </div>

      <div className="w-px h-6 bg-white/10 mx-1" />

      {/* Insert Elements */}
      <div className="flex items-center gap-1">
        <Button
          onClick={handleImageUpload}
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/10"
          title="Insert Image"
        >
          <Image className="h-4 w-4" />
        </Button>

        <Popover open={isLinkPopoverOpen} onOpenChange={setIsLinkPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              className={cn(
                "h-8 w-8 p-0",
                editor.isActive('link') 
                  ? "bg-white/20 text-white" 
                  : "text-white/70 hover:text-white hover:bg-white/10"
              )}
              title="Insert/Edit Link"
            >
              <Link className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 bg-black/90 border-white/10">
            <div className="space-y-3">
              <div>
                <Label htmlFor="link-url" className="text-white text-sm">Link URL</Label>
                <Input
                  id="link-url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="mt-1 bg-white/10 border-white/20 text-white"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleLinkSet();
                    }
                  }}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleLinkSet}
                  className="bg-noteflow-500 hover:bg-noteflow-600 text-white"
                >
                  Set Link
                </Button>
                {editor.isActive('link') && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleLinkUnset}
                    className="border-red-500 text-red-400 hover:bg-red-500/10"
                  >
                    Remove Link
                  </Button>
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          size="sm"
          variant="ghost"
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive('blockquote') 
              ? "bg-white/20 text-white" 
              : "text-white/70 hover:text-white hover:bg-white/10"
          )}
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </Button>

        <Button
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/10"
          title="Horizontal Rule"
        >
          <Minus className="h-4 w-4" />
        </Button>
      </div>

      <div className="w-px h-6 bg-white/10 mx-1" />

      {/* History */}
      <div className="flex items-center gap-1">
        <Button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/10 disabled:text-white/30"
          title="Undo"
        >
          <Undo className="h-4 w-4" />
        </Button>

        <Button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/10 disabled:text-white/30"
          title="Redo"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TiptapEnhancedToolbar;
