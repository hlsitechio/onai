
import React from 'react';
import { BubbleMenu } from '@tiptap/react';
import type { Editor } from '@tiptap/react';
import FormatButtons from './bubble-menu/FormatButtons';
import CreateMenuDropdown from './bubble-menu/CreateMenuDropdown';
import AIButton from './bubble-menu/AIButton';
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
        <FormatButtons editor={editor} />
        
        <div className="w-px h-4 bg-white/20 mx-1" />
        
        <CreateMenuDropdown
          onCreateNote={onCreateNote}
          onCreateFolder={onCreateFolder}
        />
        
        <AIButton onShowAIAgent={onShowAIAgent} />
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
