
import React, { useState } from 'react';
import { BubbleMenu } from '@tiptap/react';
import type { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Bold, Italic, Underline, Code, Sparkles, Plus, FileText, Folder } from 'lucide-react';
import QuickTextActions from '../ai-text-processor/QuickTextActions';

interface TiptapBubbleMenuProps {
  editor: Editor;
  selectedText: string;
  isProcessingAI: boolean;
  onQuickAI: () => void;
  onShowAIAgent: () => void;
  onCreateNote?: () => void;
  onCreateFolder?: () => void;
}

const TiptapBubbleMenu: React.FC<TiptapBubbleMenuProps> = ({
  editor,
  selectedText,
  isProcessingAI,
  onQuickAI,
  onShowAIAgent,
  onCreateNote,
  onCreateFolder
}) => {
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);

  const handleTextReplace = (newText: string) => {
    if (!selectedText || !editor) return;
    
    try {
      const { from, to } = editor.state.selection;
      editor.chain().focus().setTextSelection({ from, to }).insertContent(newText).run();
    } catch (error) {
      console.warn('Failed to replace text:', error);
    }
  };

  // Simple shouldShow function that's more stable
  const shouldShow = ({ editor, from, to }: { editor: Editor; from: number; to: number }) => {
    const hasSelection = from !== to;
    const hasSelectedText = selectedText && selectedText.length > 0;
    return hasSelection && hasSelectedText;
  };

  const handleCreateNote = () => {
    setIsCreateMenuOpen(false);
    if (onCreateNote) {
      onCreateNote();
    }
  };

  const handleCreateFolder = () => {
    setIsCreateMenuOpen(false);
    if (onCreateFolder) {
      onCreateFolder();
    }
  };

  return (
    <BubbleMenu
      editor={editor}
      shouldShow={shouldShow}
      tippyOptions={{ 
        duration: 100,
        placement: 'top',
        offset: [0, 10],
        onShow: () => {
          console.log('BubbleMenu showing');
        },
        onHide: () => {
          console.log('BubbleMenu hiding');
        }
      }}
      className="flex flex-col gap-2 p-2 bg-black/90 backdrop-blur-xl rounded-lg border border-white/10 shadow-2xl"
    >
      {/* Traditional formatting buttons */}
      <div className="flex items-center gap-1">
        <Button
          onClick={() => {
            try {
              editor.chain().focus().toggleBold().run();
            } catch (error) {
              console.warn('Bold toggle failed:', error);
            }
          }}
          variant="ghost"
          size="sm"
          className={`h-7 w-7 p-0 ${editor.isActive('bold') ? 'bg-white/20' : 'hover:bg-white/10'} text-white`}
        >
          <Bold className="h-3 w-3" />
        </Button>
        <Button
          onClick={() => {
            try {
              editor.chain().focus().toggleItalic().run();
            } catch (error) {
              console.warn('Italic toggle failed:', error);
            }
          }}
          variant="ghost"
          size="sm"
          className={`h-7 w-7 p-0 ${editor.isActive('italic') ? 'bg-white/20' : 'hover:bg-white/10'} text-white`}
        >
          <Italic className="h-3 w-3" />
        </Button>
        <Button
          onClick={() => {
            try {
              editor.chain().focus().toggleUnderline().run();
            } catch (error) {
              console.warn('Underline toggle failed:', error);
            }
          }}
          variant="ghost"
          size="sm"
          className={`h-7 w-7 p-0 ${editor.isActive('underline') ? 'bg-white/20' : 'hover:bg-white/10'} text-white`}
        >
          <Underline className="h-3 w-3" />
        </Button>
        <Button
          onClick={() => {
            try {
              editor.chain().focus().toggleCode().run();
            } catch (error) {
              console.warn('Code toggle failed:', error);
            }
          }}
          variant="ghost"
          size="sm"
          className={`h-7 w-7 p-0 ${editor.isActive('code') ? 'bg-white/20' : 'hover:bg-white/10'} text-white`}
        >
          <Code className="h-3 w-3" />
        </Button>
        
        <div className="w-px h-4 bg-white/20 mx-1" />
        
        {/* Create Note/Folder Popover */}
        <Popover open={isCreateMenuOpen} onOpenChange={setIsCreateMenuOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-green-300 hover:text-green-200 hover:bg-green-500/20"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent 
            className="w-48 p-2 bg-black/95 backdrop-blur-xl border border-white/20 shadow-2xl"
            side="top"
            align="center"
          >
            <div className="flex flex-col gap-1">
              <Button
                onClick={handleCreateNote}
                variant="ghost"
                size="sm"
                className="justify-start text-white hover:bg-white/10"
              >
                <FileText className="h-4 w-4 mr-2" />
                New Note
              </Button>
              <Button
                onClick={handleCreateFolder}
                variant="ghost"
                size="sm"
                className="justify-start text-white hover:bg-white/10"
              >
                <Folder className="h-4 w-4 mr-2" />
                New Folder
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        
        <Button
          onClick={() => {
            try {
              onShowAIAgent();
            } catch (error) {
              console.warn('AI agent show failed:', error);
            }
          }}
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-noteflow-300 hover:text-noteflow-200 hover:bg-noteflow-500/20"
        >
          <Sparkles className="h-3 w-3 mr-1" />
          <span className="text-xs">AI</span>
        </Button>
      </div>

      {/* Quick AI text actions - only show if we have selected text */}
      {selectedText && selectedText.length > 0 && (
        <QuickTextActions
          selectedText={selectedText}
          onTextReplace={handleTextReplace}
        />
      )}
    </BubbleMenu>
  );
};

export default TiptapBubbleMenu;
