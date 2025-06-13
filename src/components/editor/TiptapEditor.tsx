
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Sparkles, 
  Wand2, 
  TrendingUp, 
  ChevronRight,
  MessageSquare,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { callGeminiAI } from '@/utils/aiUtils';
import { getUtilityExtensions } from './config/V3UtilityExtensions';
import { getFormattingExtensions } from './config/V3FormattingExtensions';
import { getTableExtensions } from './config/V3TableExtensions';
import { editorClassNames, loadingComponent } from './config/EditorConfig';
import AIAgent from '../ai-agent/AIAgent';
import InlineAIActions from '../ai-agent/InlineAIActions';
import { useAIAgent } from '@/hooks/useAIAgent';

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
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedText, setSelectedText] = useState('');
  const [selectionPosition, setSelectionPosition] = useState({ x: 0, y: 0 });
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  
  const {
    isAIAgentVisible,
    cursorPosition,
    inlineActionsPosition,
    isInlineActionsVisible,
    showAIAgent,
    hideAIAgent,
    toggleAIAgent,
    handleTextSelection,
    showInlineActions,
    hideInlineActions,
    updateCursorPosition
  } = useAIAgent();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
          HTMLAttributes: {
            class: 'font-bold tracking-tight'
          }
        },
        paragraph: {
          HTMLAttributes: {
            class: 'leading-relaxed'
          }
        }
      }),
      ...getUtilityExtensions(),
      ...getFormattingExtensions(),
      ...getTableExtensions()
    ],
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setContent(html);
    },
    onSelectionUpdate: ({ editor }) => {
      const { from, to } = editor.state.selection;
      const text = editor.state.doc.textBetween(from, to, '');
      
      setSelectedText(text);
      updateCursorPosition(from);
      
      if (text.trim()) {
        // Get selection coordinates for inline actions
        const coords = editor.view.coordsAtPos(from);
        setSelectionPosition({ x: coords.left, y: coords.top - 40 });
        showInlineActions(coords.left, coords.top - 40);
        
        handleTextSelection({
          text,
          start: from,
          end: to
        });
      } else {
        hideInlineActions();
      }
    },
    onFocus: () => {
      // Optional: Show AI agent when editor is focused
    },
    editorProps: {
      attributes: {
        class: cn(
          editorClassNames.base,
          isFocusMode ? editorClassNames.focusMode : editorClassNames.normalMode
        )
      }
    }
  });

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+Shift+A to toggle AI Agent
      if (event.ctrlKey && event.shiftKey && event.key === 'A') {
        event.preventDefault();
        toggleAIAgent();
      }
      
      // Escape to hide AI components
      if (event.key === 'Escape') {
        hideAIAgent();
        hideInlineActions();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [toggleAIAgent, hideAIAgent, hideInlineActions]);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // AI action handlers
  const handleAITextReplace = useCallback((newText: string) => {
    if (!editor || !selectedText) return;
    
    const { from, to } = editor.state.selection;
    editor.chain().focus().deleteRange({ from, to }).insertContent(newText).run();
    hideInlineActions();
  }, [editor, selectedText, hideInlineActions]);

  const handleAITextInsert = useCallback((text: string) => {
    if (!editor) return;
    
    const { to } = editor.state.selection;
    editor.chain().focus().insertContentAt(to, ` ${text}`).run();
    hideInlineActions();
  }, [editor, hideInlineActions]);

  const handleContentChange = useCallback((newContent: string) => {
    if (editor) {
      editor.commands.setContent(newContent);
    }
  }, [editor]);

  // Quick AI actions for bubble menu
  const handleQuickAI = async (action: 'enhance' | 'continue') => {
    if (!selectedText || isProcessingAI) return;
    
    setIsProcessingAI(true);
    try {
      let prompt = '';
      if (action === 'enhance') {
        prompt = `Enhance and improve this text while keeping the same meaning: "${selectedText}"`;
      } else {
        prompt = `Continue this thought naturally: "${selectedText}"`;
      }
      
      const result = await callGeminiAI(prompt, selectedText, 'improve');
      
      if (action === 'enhance') {
        handleAITextReplace(result);
      } else {
        handleAITextInsert(result);
      }
      
      toast({
        title: 'AI Enhancement Applied',
        description: `Successfully ${action === 'enhance' ? 'enhanced' : 'continued'} your text.`,
      });
    } catch (error) {
      console.error('AI action failed:', error);
      toast({
        title: 'AI Action Failed',
        description: 'Please try again or use the AI sidebar for more options.',
        variant: 'destructive'
      });
    } finally {
      setIsProcessingAI(false);
    }
  };

  if (isLoading) {
    return (
      <div className={loadingComponent.containerClass}>
        <div className={loadingComponent.spinnerClass}></div>
        <p className="text-sm">{loadingComponent.text}</p>
      </div>
    );
  }

  if (!editor) {
    return <div>Editor failed to load. Please refresh the page.</div>;
  }

  return (
    <div className="relative h-full flex flex-col">
      {/* Main Toolbar */}
      <div className="flex items-center justify-between p-2 border-b border-white/10 bg-black/40 backdrop-blur-lg">
        {/* Left side - Basic formatting */}
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

          <div className="w-px h-6 bg-white/10 mx-1" />

          <Button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            size="sm"
            variant="ghost"
            className={cn(
              "h-8 w-8 p-0",
              editor.isActive('heading', { level: 1 }) 
                ? "bg-white/20 text-white" 
                : "text-white/70 hover:text-white hover:bg-white/10"
            )}
            title="Heading 1"
          >
            <Heading1 className="h-4 w-4" />
          </Button>

          <Button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            size="sm"
            variant="ghost"
            className={cn(
              "h-8 w-8 p-0",
              editor.isActive('heading', { level: 2 }) 
                ? "bg-white/20 text-white" 
                : "text-white/70 hover:text-white hover:bg-white/10"
            )}
            title="Heading 2"
          >
            <Heading2 className="h-4 w-4" />
          </Button>

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
        </div>

        {/* Right side - AI and actions */}
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

          <div className="w-px h-6 bg-white/10 mx-1" />

          <Button
            onClick={showAIAgent}
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

      {/* Bubble Menu for text selection */}
      <BubbleMenu
        editor={editor}
        tippyOptions={{ duration: 100 }}
        className="bg-black/95 backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl overflow-hidden"
      >
        <div className="flex items-center divide-x divide-white/10">
          {/* Basic formatting */}
          <div className="flex items-center p-1">
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
            >
              <Italic className="h-4 w-4" />
            </Button>
          </div>
          
          {/* AI Actions */}
          <div className="flex items-center p-1">
            <Button
              onClick={() => handleQuickAI('enhance')}
              disabled={isProcessingAI || !selectedText}
              size="sm"
              variant="ghost"
              className="h-8 px-2 text-white/70 hover:text-white hover:bg-white/10"
              title="Enhance with AI"
            >
              {isProcessingAI ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Wand2 className="h-3 w-3" />
              )}
            </Button>
            <Button
              onClick={() => handleQuickAI('continue')}
              disabled={isProcessingAI || !selectedText}
              size="sm"
              variant="ghost"
              className="h-8 px-2 text-white/70 hover:text-white hover:bg-white/10"
              title="Continue with AI"
            >
              <ChevronRight className="h-3 w-3" />
            </Button>
            <Button
              onClick={showAIAgent}
              size="sm"
              variant="ghost"
              className="h-8 px-2 text-noteflow-300 hover:text-noteflow-200 hover:bg-noteflow-500/20"
              title="Open AI Agent"
            >
              <Sparkles className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </BubbleMenu>

      {/* Main Editor */}
      <div className="flex-1 relative overflow-hidden">
        <EditorContent 
          editor={editor} 
          className="h-full overflow-y-auto focus-within:outline-none p-4"
        />

        {/* AI Agent */}
        <AIAgent
          content={content}
          onContentChange={handleContentChange}
          cursorPosition={cursorPosition}
          isVisible={isAIAgentVisible}
        />

        {/* Inline AI Actions */}
        <InlineAIActions
          selectedText={selectedText}
          onTextReplace={handleAITextReplace}
          onTextInsert={handleAITextInsert}
          position={inlineActionsPosition}
          isVisible={isInlineActionsVisible}
          onClose={hideInlineActions}
        />

        {/* Floating AI hint */}
        {!isAIAgentVisible && !isInlineActionsVisible && content.length > 50 && (
          <div className="absolute bottom-4 right-4 z-40">
            <Button
              onClick={showAIAgent}
              size="sm"
              className="bg-noteflow-500/20 hover:bg-noteflow-500/30 text-noteflow-300 border border-noteflow-500/30 backdrop-blur-sm"
            >
              <Sparkles className="h-3 w-3 mr-1" />
              AI Assistant
            </Button>
          </div>
        )}

        {/* Empty state hint */}
        {content.length === 0 && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md px-6">
                <div className="mb-4 opacity-60">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-noteflow-400 to-noteflow-600 flex items-center justify-center">
                    <span className="text-2xl">✨</span>
                  </div>
                </div>
                <h3 className="text-lg font-medium text-white mb-2">
                  Start writing with AI assistance
                </h3>
                <p className="text-sm text-slate-400 mb-4">
                  Use the toolbar above for formatting, select text for AI enhancements, or press Ctrl+Shift+A for the AI agent.
                </p>
                <div className="text-xs text-slate-500 space-y-1">
                  <div>• Select text to see AI options</div>
                  <div>• Press <kbd className="bg-white/10 px-1 rounded">Ctrl+Shift+A</kbd> for AI Agent</div>
                  <div>• Use formatting buttons in the toolbar</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TiptapEditor;
