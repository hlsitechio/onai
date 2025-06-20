
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Bold, 
  Italic, 
  Underline,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Undo,
  Redo,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Editor } from '@tiptap/react';

interface TiptapMainToolbarProps {
  editor: Editor;
  onShowAIAgent: () => void;
}

const TiptapMainToolbar: React.FC<TiptapMainToolbarProps> = ({
  editor,
  onShowAIAgent
}) => {
  return (
    <div className="flex items-center justify-between p-2 border-b border-white/10 bg-black/40 backdrop-blur-lg">
      {/* Left side - Basic formatting */}
      <div className="flex items-center gap-1">
        <Button
          onClick={() => {
            if (editor) {
              editor.chain().focus().toggleBold().run();
            }
          }}
          size="sm"
          variant="ghost"
          className={cn(
            "h-8 w-8 p-0",
            editor?.isActive('bold') 
              ? "bg-white/20 text-white" 
              : "text-white/70 hover:text-white hover:bg-white/10"
          )}
          title="Bold (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </Button>
        
        <Button
          onClick={() => {
            if (editor) {
              editor.chain().focus().toggleItalic().run();
            }
          }}
          size="sm"
          variant="ghost"
          className={cn(
            "h-8 w-8 p-0",
            editor?.isActive('italic') 
              ? "bg-white/20 text-white" 
              : "text-white/70 hover:text-white hover:bg-white/10"
          )}
          title="Italic (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </Button>
        
        <Button
          onClick={() => {
            if (editor) {
              editor.chain().focus().toggleUnderline().run();
            }
          }}
          size="sm"
          variant="ghost"
          className={cn(
            "h-8 w-8 p-0",
            editor?.isActive('underline') 
              ? "bg-white/20 text-white" 
              : "text-white/70 hover:text-white hover:bg-white/10"
          )}
          title="Underline (Ctrl+U)"
        >
          <Underline className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-white/10 mx-1" />

        <Button
          onClick={() => {
            if (editor) {
              editor.chain().focus().toggleHeading({ level: 1 }).run();
            }
          }}
          size="sm"
          variant="ghost"
          className={cn(
            "h-8 w-8 p-0",
            editor?.isActive('heading', { level: 1 }) 
              ? "bg-white/20 text-white" 
              : "text-white/70 hover:text-white hover:bg-white/10"
          )}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>

        <Button
          onClick={() => {
            if (editor) {
              editor.chain().focus().toggleHeading({ level: 2 }).run();
            }
          }}
          size="sm"
          variant="ghost"
          className={cn(
            "h-8 w-8 p-0",
            editor?.isActive('heading', { level: 2 }) 
              ? "bg-white/20 text-white" 
              : "text-white/70 hover:text-white hover:bg-white/10"
          )}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>

        <Button
          onClick={() => {
            if (editor) {
              editor.chain().focus().toggleBulletList().run();
            }
          }}
          size="sm"
          variant="ghost"
          className={cn(
            "h-8 w-8 p-0",
            editor?.isActive('bulletList') 
              ? "bg-white/20 text-white" 
              : "text-white/70 hover:text-white hover:bg-white/10"
          )}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>

        <Button
          onClick={() => {
            if (editor) {
              editor.chain().focus().toggleOrderedList().run();
            }
          }}
          size="sm"
          variant="ghost"
          className={cn(
            "h-8 w-8 p-0",
            editor?.isActive('orderedList') 
              ? "bg-white/20 text-white" 
              : "text-white/70 hover:text-white hover:bg-white/10"
          )}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>

      {/* Right side - AI and actions */}
      <div className="flex items-center gap-1">
        <Button
          onClick={() => {
            if (editor) {
              editor.chain().focus().undo().run();
            }
          }}
          disabled={!editor?.can().chain().focus().undo().run()}
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/10 disabled:text-white/30"
          title="Undo"
        >
          <Undo className="h-4 w-4" />
        </Button>

        <Button
          onClick={() => {
            if (editor) {
              editor.chain().focus().redo().run();
            }
          }}
          disabled={!editor?.can().chain().focus().redo().run()}
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/10 disabled:text-white/30"
          title="Redo"
        >
          <Redo className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-white/10 mx-1" />

        <Button
          onClick={onShowAIAgent}
          size="sm"
          variant="ghost"
          className="h-8 px-2 text-noteflow-300 hover:text-noteflow-200 hover:bg-noteflow-500/20"
          title="Open AI Agent (Ctrl+Shift+A)"
        >
          <Sparkles className="h-3 w-3 mr-1" />
          <span className="text-xs">AI</span>
        </Button>
      </div>
    </div>
  );
};

export default TiptapMainToolbar;
