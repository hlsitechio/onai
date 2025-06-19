
import React, { useState, useEffect } from 'react';
import { useTiptapEditor } from '@/hooks/useTiptapEditor';
import { useAIAgent } from '@/hooks/useAIAgent';
import { useStylusDetection } from '@/hooks/useStylusDetection';
import TiptapEnhancedToolbar from './toolbar/TiptapEnhancedToolbar';
import EditorLoadingState from './EditorLoadingState';
import EditorErrorState from './EditorErrorState';
import EditorContentArea from './EditorContentArea';
import HandwritingCanvas from './HandwritingCanvas';
import { Button } from '@/components/ui/button';
import { PenTool, Type } from 'lucide-react';

interface TiptapEditorProps {
  content: string;
  setContent: (content: string) => void;
  isFocusMode?: boolean;
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({
  content,
  setContent,
  isFocusMode = false
}) => {
  const [inputMode, setInputMode] = useState<'text' | 'handwriting'>('text');
  const { hasStylus, isUsingStylus } = useStylusDetection();

  const {
    editor,
    isLoading,
    selectedText,
    handleContentChange
  } = useTiptapEditor({ content, setContent, isFocusMode });

  // Use AI Agent hook but without automatic text selection triggering
  const {
    isAIAgentVisible,
    aiPosition,
    showAIAgent,
    hideAIAgent
  } = useAIAgent(editor);

  // Auto-switch to handwriting mode when stylus is detected
  useEffect(() => {
    if (isUsingStylus && inputMode === 'text') {
      setInputMode('handwriting');
    }
  }, [isUsingStylus, inputMode]);

  const handleHandwritingComplete = (handwrittenText: string) => {
    if (editor) {
      const handwritingHTML = `<div class="handwritten-content" style="border: 1px dashed #666; padding: 12px; margin: 12px 0; border-radius: 8px; background: rgba(120, 60, 255, 0.1);">
        <div style="font-size: 12px; color: #999; margin-bottom: 8px; display: flex; align-items: center; gap: 4px;">
          <span>✍️</span>
          <span>Handwritten content</span>
        </div>
        <div>${handwrittenText || '[Handwritten content - processing...]'}</div>
      </div>`;
      
      editor.commands.insertContent(handwritingHTML);
    }
  };

  // Manual AI trigger function
  const handleManualAITrigger = () => {
    if (editor) {
      const { from } = editor.state.selection;
      const coords = editor.view.coordsAtPos(from);
      
      showAIAgent({
        x: coords.left,
        y: coords.top - 50,
      });
    } else {
      showAIAgent();
    }
  };

  if (isLoading) {
    return <EditorLoadingState />;
  }

  if (!editor) {
    return <EditorErrorState />;
  }

  return (
    <div className="relative h-full flex flex-col">
      {/* Enhanced Toolbar with AI button and handwriting toggle */}
      {!isFocusMode && (
        <div className="flex items-center justify-between border-b border-white/10 p-2">
          <TiptapEnhancedToolbar 
            editor={editor} 
            onAIClick={handleManualAITrigger}
          />
          
          {hasStylus && (
            <div className="flex space-x-2 ml-4">
              <Button
                variant={inputMode === 'text' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setInputMode('text')}
                className="flex items-center space-x-1"
              >
                <Type className="h-4 w-4" />
                <span className="hidden sm:inline">Text</span>
              </Button>
              <Button
                variant={inputMode === 'handwriting' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setInputMode('handwriting')}
                className="flex items-center space-x-1"
              >
                <PenTool className="h-4 w-4" />
                <span className="hidden sm:inline">Pen</span>
              </Button>
            </div>
          )}
        </div>
      )}

      {inputMode === 'text' ? (
        /* Main Editor Content */
        <EditorContentArea
          editor={editor}
          content={content}
          selectedText={selectedText}
          handleContentChange={handleContentChange}
          isAIAgentVisible={isAIAgentVisible}
          aiPosition={aiPosition}
          hideAIAgent={hideAIAgent}
          showAIAgent={handleManualAITrigger}
          isFocusMode={isFocusMode}
        />
      ) : (
        <div className="flex-1 p-4">
          <HandwritingCanvas
            onTextExtracted={handleHandwritingComplete}
            className="h-full max-w-full"
            width={1000}
            height={600}
          />
          <div className="mt-4 flex justify-center">
            <Button
              variant="outline"
              onClick={() => setInputMode('text')}
              className="text-white border-white/20 hover:bg-white/10"
            >
              <Type className="h-4 w-4 mr-2" />
              Switch to text editor
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TiptapEditor;
