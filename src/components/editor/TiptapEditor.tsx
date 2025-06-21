
import React, { useState, useEffect } from 'react';
import { useTiptapEditor } from '@/hooks/useTiptapEditor';
import { useStylusDetection } from '@/hooks/useStylusDetection';
import { useCameraOCR } from '@/hooks/useCameraOCR';
import TiptapEnhancedToolbar from './toolbar/TiptapEnhancedToolbar';
import EditorLoadingState from './EditorLoadingState';
import EditorErrorState from './EditorErrorState';
import HandwritingCanvas from './HandwritingCanvas';
import OCRCameraCapture from '../ocr/components/OCRCameraCapture';
import AIChatPanel from '../ai-chat/AIChatPanel';
import AIEnhancedBubbleMenu from './ai-enhanced/AIEnhancedBubbleMenu';
import AIFloatingToolbar from './ai-enhanced/AIFloatingToolbar';
import { EditorContent } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { PenTool, Type, MessageSquare, X } from 'lucide-react';
import { callGeminiAI } from '@/utils/aiUtils';
import { useToast } from '@/hooks/use-toast';

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
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAIFloatingVisible, setIsAIFloatingVisible] = useState(true);
  const { hasStylus, isUsingStylus } = useStylusDetection();
  const { toast } = useToast();

  const {
    editor,
    isLoading,
    selectedText,
    handleContentChange
  } = useTiptapEditor({ content, setContent, isFocusMode });

  // Camera OCR functionality
  const {
    isCameraOpen,
    isProcessing: isCameraProcessing,
    ocrProgress,
    openCamera,
    closeCamera,
    handlePhotoCapture
  } = useCameraOCR();

  // Auto-switch to handwriting mode when stylus is detected
  useEffect(() => {
    if (isUsingStylus && inputMode === 'text') {
      setInputMode('handwriting');
    }
  }, [isUsingStylus, inputMode]);

  // Hide floating toolbar when chat is open or in focus mode
  useEffect(() => {
    setIsAIFloatingVisible(!isChatOpen && !isFocusMode);
  }, [isChatOpen, isFocusMode]);

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

  const handleAIQuickAction = async (action: string) => {
    if (!editor) return;

    const contextText = selectedText || editor.getText().slice(-200);
    
    try {
      let prompt = '';
      switch (action) {
        case 'improve':
          prompt = `Improve and enhance this text: "${contextText}"`;
          break;
        case 'summarize':
          prompt = `Summarize this text concisely: "${contextText}"`;
          break;
        case 'translate':
          prompt = `Translate this text to Spanish: "${contextText}"`;
          break;
        case 'ideas':
          prompt = `Generate ideas and expand on this: "${contextText}"`;
          break;
        case 'continue':
          prompt = `Continue this text naturally: "${contextText}"`;
          break;
      }

      const response = await callGeminiAI(prompt, editor.getHTML(), action as any);
      
      if (selectedText) {
        // Replace selected text
        const { from, to } = editor.state.selection;
        editor.chain().focus().setTextSelection({ from, to }).insertContent(response).run();
      } else {
        // Insert at cursor
        editor.chain().focus().insertContent(` ${response}`).run();
      }

      toast({
        title: 'AI action completed',
        description: `Successfully ${action}ed your text.`,
      });
    } catch (error) {
      console.error('AI quick action failed:', error);
      toast({
        title: 'AI action failed',
        description: 'Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleApplyFromChat = (chatContent: string) => {
    if (editor) {
      editor.chain().focus().insertContent(`\n\n${chatContent}`).run();
    }
  };

  if (isLoading) {
    return <EditorLoadingState />;
  }

  if (!editor) {
    return <EditorErrorState />;
  }

  return (
    <div className="relative h-full flex">
      {/* Main Editor Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isChatOpen ? 'mr-96' : ''}`}>
        {/* Enhanced Toolbar */}
        {!isFocusMode && (
          <div className="flex items-center justify-between border-b border-white/10 p-2">
            <TiptapEnhancedToolbar 
              editor={editor} 
              onAIClick={() => setIsChatOpen(true)}
              onCameraOCRClick={openCamera}
              isCameraOCRProcessing={isCameraProcessing}
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
          <div className="flex-1 relative overflow-hidden">
            <EditorContent 
              editor={editor} 
              className="h-full overflow-y-auto focus-within:outline-none p-4"
            />

            {/* AI Enhanced Bubble Menu */}
            <AIEnhancedBubbleMenu
              editor={editor}
              selectedText={selectedText}
            />
          </div>
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

        {/* AI Floating Toolbar */}
        <AIFloatingToolbar
          onOpenChat={() => setIsChatOpen(true)}
          onQuickAction={handleAIQuickAction}
          isVisible={isAIFloatingVisible && inputMode === 'text'}
        />
      </div>

      {/* AI Chat Panel */}
      {isChatOpen && (
        <div className="fixed right-0 top-0 h-full w-96 z-40 bg-black/20 backdrop-blur-sm">
          <div className="h-full p-4">
            <div className="h-full relative">
              <Button
                onClick={() => setIsChatOpen(false)}
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 z-50 h-8 w-8 p-0 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
              <AIChatPanel
                onClose={() => setIsChatOpen(false)}
                onApplyToEditor={handleApplyFromChat}
              />
            </div>
          </div>
        </div>
      )}

      {/* Camera OCR Modal */}
      {isCameraOpen && (
        <OCRCameraCapture
          key="camera-capture" 
          onPhotoCapture={handlePhotoCapture}
          onClose={closeCamera}
          isProcessing={isCameraProcessing}
          ocrProgress={ocrProgress}
        />
      )}
    </div>
  );
};

export default TiptapEditor;
